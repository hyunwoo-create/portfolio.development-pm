import { create } from 'zustand';
import { 
  HERO_CONTENT_DEFAULT, 
  ABOUT_CONTENT_DEFAULT, 
  RESUME_DATA, 
  PORTFOLIO_PROJECTS, 
  INITIAL_SKILL_TABS, 
  INITIAL_TOOLS,
  AI_SKILLS_DEFAULT,
  TOOL_CARDS_DEFAULT,
} from '../data/constants';

// Supabase API config
export const SUPABASE_CONTENT_API = 'https://bovxanwamgbhlubrndyl.supabase.co/functions/v1/content-api';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdnhhbndhbWdiaGx1YnJuZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ0NDAsImV4cCI6MjA5MTM1MDQ0MH0.b4MvsylK--ZJrkjWZnkzcSHpjHxYiyJTA-lYsI8Ij4Y';

// Helper to strip base64
const stripBase64Images = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str.replace(/<img[^>]+src=["']data:image\/[^"']+["'][^>]*>/gi, '<div class="p-4 bg-red-100 text-red-600 rounded-lg text-sm font-bold my-2 border border-red-200">⚠️ 고화질 이미지는 DB 과부하 방지를 위해 반드시 외부 링크(URL) 형태로만 삽입해주세요. (Base64 이미지 자동 삭제됨)</div>');
};

const recursivelySanitize = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('blob:')) return null; 
    if (obj.includes('<img') && obj.includes('src="data:image')) {
      return stripBase64Images(obj); 
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(recursivelySanitize).filter(item => item !== null);
  }
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [k, v] of Object.entries(obj)) {
      const sanitizedValue = recursivelySanitize(v);
      if (sanitizedValue !== null) {
        sanitized[k] = sanitizedValue;
      }
    }
    return sanitized;
  }
  return obj;
};

// ─── Fetch with timeout ────────────────────────────────────────────────────
const fetchWithTimeout = (url: string, options: RequestInit, timeoutMs = 10000): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
};

// ─── Retry wrapper ─────────────────────────────────────────────────────────
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 2,
  delayMs = 800,
  timeoutMs = 10000,
): Promise<Response> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options, timeoutMs);
      return res;
    } catch (err: any) {
      const isLastAttempt = attempt === retries;
      if (isLastAttempt) throw err;

      // Abort = timeout, don't retry on explicit user abort
      if (err.name === 'AbortError') {
        console.warn(`[fetchWithRetry] Timeout on attempt ${attempt + 1}/${retries + 1}. Retrying in ${delayMs}ms…`);
      } else {
        console.warn(`[fetchWithRetry] Network error on attempt ${attempt + 1}/${retries + 1}. Retrying in ${delayMs}ms…`);
      }
      await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  throw new Error('fetchWithRetry: exhausted all retries');
};

// ─── Save failure tracking (throttled alert to avoid spam) ────────────────
let lastAlertTime = 0;
const ALERT_THROTTLE_MS = 15_000;

const notifySaveFailure = (key: string, statusCode?: number) => {
  const now = Date.now();
  if (now - lastAlertTime < ALERT_THROTTLE_MS) return;
  lastAlertTime = now;
  const detail = statusCode ? `HTTP ${statusCode}` : '네트워크 연결 오류';
  alert(`⚠️ 데이터 저장에 실패했습니다 (${key} / ${detail}).\n잠시 후 다시 시도하거나, 창을 닫기 전에 데이터를 백업해 주세요.`);
};

// ─── Custom debounce ──────────────────────────────────────────────────────
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

const saveToSupabase = async (key: string, value: any) => {
  try {
    const sanitizedValue = recursivelySanitize(value);
    
    if (
      !sanitizedValue ||
      (typeof sanitizedValue === 'object' &&
        Object.keys(sanitizedValue).length === 0 &&
        !Array.isArray(sanitizedValue) &&
        key !== 'hero_image')
    ) {
      return;
    }

    const response = await fetchWithRetry(
      SUPABASE_CONTENT_API,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          password: import.meta.env.VITE_ADMIN_PASSWORD || 'qwer154',
          key,
          value: sanitizedValue,
        }),
      },
      2,    // retries
      800,  // base delay ms
      12000 // timeout ms
    );

    if (!response.ok) {
      console.error(`[Supabase Save Error] key=${key} status=${response.status}`);
      notifySaveFailure(key, response.status);
    }
  } catch (e: any) {
    console.error(`[Supabase Exception] key=${key}`, e);
    notifySaveFailure(key);
  }
};

// ─── Store interface ──────────────────────────────────────────────────────
interface AppState {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  isLoading: boolean;
  fetchError: string | null;

  // Data stores
  heroContent: any;
  aboutContent: any;
  portfolioData: any[];
  skillTabs: any[];
  tools: any[];
  resumeData: any;
  userImage: string;
  aiSkills: any[];
  toolCards: any[];
  portfolioDescription: string;
  portfolioCategories: string[];
  statBoardDefaultBtnText: string;
  statBoardDefaultDetailTitle: string;
  statBoardDefaultDetailDesc: string;

  // Setters that update local state AND trigger debounced Supabase save
  updateContent: (key: string, value: any) => void;

  // Initializer
  fetchAll: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isEditing: false,
  setIsEditing: (val) => set({ isEditing: val }),
  isLoading: true,
  fetchError: null,

  heroContent: HERO_CONTENT_DEFAULT,
  aboutContent: ABOUT_CONTENT_DEFAULT,
  portfolioData: PORTFOLIO_PROJECTS,
  skillTabs: INITIAL_SKILL_TABS,
  tools: INITIAL_TOOLS,
  resumeData: RESUME_DATA,
  userImage: '',
  aiSkills: AI_SKILLS_DEFAULT,
  toolCards: TOOL_CARDS_DEFAULT,
  portfolioDescription: '게임 기획부터 런칭까지의 메인 프로젝트와 AI/툴링을 활용한 기타 작업물 아카이브입니다.',
  portfolioCategories: ['게임 분석', 'AI 활용'],
  statBoardDefaultBtnText: '📌 기본 안내 보기',
  statBoardDefaultDetailTitle: '기본 안내',
  statBoardDefaultDetailDesc: '좌측 항목을 클릭하면\n상세 정보가 표시됩니다.',

  updateContent: (key: string, valueOrUpdater: any) => {
    const stateKey =
      key === 'hero_content'          ? 'heroContent'  :
      key === 'about_content'         ? 'aboutContent' :
      key === 'portfolio_data'        ? 'portfolioData':
      key === 'skill_tabs'            ? 'skillTabs'    :
      key === 'tools'                 ? 'tools'        :
      key === 'resume_data'           ? 'resumeData'   :
      key === 'stat_board_user_image' ? 'userImage'    :
      key === 'ai_skills'             ? 'aiSkills'     :
      key === 'tool_cards'            ? 'toolCards'    :
      key === 'portfolio_description' ? 'portfolioDescription' :
      key === 'portfolio_categories'  ? 'portfolioCategories' :
      key === 'stat_board_default_btn_text' ? 'statBoardDefaultBtnText' :
      key === 'stat_board_default_title'    ? 'statBoardDefaultDetailTitle' :
      key === 'stat_board_default_desc'     ? 'statBoardDefaultDetailDesc' : null;

    let finalValue = valueOrUpdater;
    if (typeof valueOrUpdater === 'function' && stateKey) {
      finalValue = valueOrUpdater(get()[stateKey as keyof AppState]);
    }

    if (stateKey) {
      set({ [stateKey]: finalValue } as any);
    }

    // Debounced Supabase save (800 ms)
    if (debounceTimers[key]) clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(() => {
      saveToSupabase(key, finalValue);
    }, 800);
  },

  fetchAll: async () => {
    set({ isLoading: true, fetchError: null });
    try {
      const res = await fetchWithRetry(
        SUPABASE_CONTENT_API,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
        3,     // retries
        600,   // base delay ms
        12000  // timeout ms
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data) {
        set((state) => ({
          heroContent:   data['hero_content']           !== undefined ? data['hero_content']           : state.heroContent,
          aboutContent:  data['about_content']          !== undefined ? data['about_content']          : state.aboutContent,
          portfolioData: data['portfolio_data']         !== undefined ? data['portfolio_data']         : state.portfolioData,
          skillTabs:     data['skill_tabs']             !== undefined ? data['skill_tabs']             : state.skillTabs,
          tools:         data['tools']                  !== undefined ? data['tools']                  : state.tools,
          resumeData:    data['resume_data']            !== undefined ? data['resume_data']            : state.resumeData,
          userImage:     data['stat_board_user_image']  !== undefined ? data['stat_board_user_image']  : state.userImage,
          aiSkills:      data['ai_skills']              !== undefined ? data['ai_skills']              : state.aiSkills,
          toolCards:     data['tool_cards']             !== undefined ? data['tool_cards']             : state.toolCards,
          portfolioDescription: data['portfolio_description'] !== undefined ? data['portfolio_description'] : state.portfolioDescription,
          portfolioCategories: data['portfolio_categories'] !== undefined ? data['portfolio_categories'] : state.portfolioCategories,
          statBoardDefaultBtnText: data['stat_board_default_btn_text'] !== undefined ? data['stat_board_default_btn_text'] : state.statBoardDefaultBtnText,
          statBoardDefaultDetailTitle: data['stat_board_default_title'] !== undefined ? data['stat_board_default_title'] : state.statBoardDefaultDetailTitle,
          statBoardDefaultDetailDesc: data['stat_board_default_desc'] !== undefined ? data['stat_board_default_desc'] : state.statBoardDefaultDetailDesc,
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (e: any) {
      console.error('[Store] Failed to fetch initial data:', e);
      // Fallback to defaults — the site still renders with local constants
      set({ isLoading: false, fetchError: e?.message ?? 'Network error' });
    }
  },
}));
