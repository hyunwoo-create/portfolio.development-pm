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

// ─── Site Registry Key ────────────────────────────────────────────────────
const SITE_REGISTRY_KEY = '__site_registry';

// ─── Multi-site key helpers ───────────────────────────────────────────────
// default 사이트는 기존 키와 하위 호환을 위해 접두사 없이 사용
function makeDbKey(siteId: string, key: string): string {
  if (siteId === 'default') return key;
  return `${siteId}::${key}`;
}

// 응답 데이터에서 특정 siteId에 해당하는 키만 필터링
function filterDataBySiteId(allData: Record<string, any>, siteId: string): Record<string, any> {
  const result: Record<string, any> = {};

  if (siteId === 'default') {
    for (const [key, value] of Object.entries(allData)) {
      if (!key.includes('::') && key !== SITE_REGISTRY_KEY && value !== '__deleted__') {
        result[key] = value;
      }
    }
  } else {
    const prefix = `${siteId}::`;
    for (const [key, value] of Object.entries(allData)) {
      if (key.startsWith(prefix) && value !== '__deleted__') {
        result[key.replace(prefix, '')] = value;
      }
    }
  }

  return result;
}

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

// Guard: fetchAll 진행 중에는 updateContent의 저장을 억제
let _isFetching = false;

function clearAllDebounceTimers() {
  for (const key of Object.keys(debounceTimers)) {
    clearTimeout(debounceTimers[key]);
    delete debounceTimers[key];
  }
}

const saveToSupabase = async (siteId: string, key: string, value: any) => {
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

    const dbKey = makeDbKey(siteId, key);

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
          key: dbKey,
          value: sanitizedValue,
        }),
      },
      2,    // retries
      800,  // base delay ms
      12000 // timeout ms
    );

    if (!response.ok) {
      console.error(`[Supabase Save Error] key=${dbKey} status=${response.status}`);
      notifySaveFailure(dbKey, response.status);
    }
  } catch (e: any) {
    console.error(`[Supabase Exception] key=${key}`, e);
    notifySaveFailure(key);
  }
};

// ─── Site info type ───────────────────────────────────────────────────────
export interface SiteInfo {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

// ─── Store interface ──────────────────────────────────────────────────────
interface AppState {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  isLoading: boolean;
  fetchError: string | null;

  // Multi-site
  siteId: string;
  setSiteId: (id: string) => void;
  sites: SiteInfo[];
  fetchSites: () => Promise<void>;
  createSite: (id: string, name: string, copyFrom?: string) => Promise<void>;
  deleteSite: (id: string) => Promise<void>;
  renameSite: (id: string, name: string) => Promise<void>;

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
  fetchAll: (siteId?: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isEditing: false,
  setIsEditing: (val) => set({ isEditing: val }),
  isLoading: true,
  fetchError: null,

  // ─── Multi-site state ─────────────────────────────────────────────────
  siteId: 'default',
  setSiteId: (id: string) => {
    // 사이트 전환 시 기존 debounce 타이머 전부 취소
    clearAllDebounceTimers();
    set({ siteId: id });
    get().fetchAll(id);
  },
  sites: [{ id: 'default', name: '기본 사이트', slug: 'default', createdAt: new Date().toISOString() }],
  
  fetchSites: async () => {
    try {
      const res = await fetchWithRetry(
        SUPABASE_CONTENT_API,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
        2, 600, 10000,
      );
      if (!res.ok) return;
      const allData = await res.json();
      
      if (allData[SITE_REGISTRY_KEY]) {
        set({ sites: allData[SITE_REGISTRY_KEY] });
      } else {
        // 레지스트리가 없으면 기본값
        set({ sites: [{ id: 'default', name: '기본 사이트', slug: 'default', createdAt: new Date().toISOString() }] });
      }
    } catch (e) {
      console.error('[Store] Failed to fetch sites:', e);
    }
  },

  createSite: async (id: string, name: string, copyFrom?: string) => {
    const { sites } = get();
    
    // 1. 레지스트리 업데이트
    const newSite: SiteInfo = {
      id,
      name,
      slug: id,
      createdAt: new Date().toISOString(),
    };
    const updatedSites = [...sites, newSite];
    
    // 레지스트리 저장 (레지스트리는 항상 default 네임스페이스)
    await saveToSupabase('default', SITE_REGISTRY_KEY, updatedSites);
    set({ sites: updatedSites });

    // 2. 데이터 복사 (copyFrom이 지정된 경우)
    if (copyFrom) {
      try {
        const res = await fetchWithRetry(
          SUPABASE_CONTENT_API,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
          },
          2, 600, 12000,
        );
        if (res.ok) {
          const allData = await res.json();
          const sourceData = filterDataBySiteId(allData, copyFrom);
          
          // 소스 데이터를 새 사이트 네임스페이스로 복사
          for (const [key, value] of Object.entries(sourceData)) {
            await saveToSupabase(id, key, value);
          }
        }
      } catch (e) {
        console.error('[Store] Failed to copy site data:', e);
      }
    }
  },

  deleteSite: async (id: string) => {
    if (id === 'default') return;
    
    const { sites } = get();
    
    // 1. 해당 사이트 데이터 삭제 — 키 prefix로 매칭되는 것들을 빈 값으로 덮어쓰기
    // (실제로는 Supabase에서 delete가 아닌 overwrite로 처리)
    try {
      const res = await fetchWithRetry(
        SUPABASE_CONTENT_API,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
        2, 600, 12000,
      );
      if (res.ok) {
        const allData = await res.json();
        const prefix = `${id}::`;
        for (const key of Object.keys(allData)) {
          if (key.startsWith(prefix)) {
            // 해당 키를 빈 문자열로 덮어쓰기 (삭제 효과)
            // makeDbKey를 거치지 않고 이미 접두사가 포함된 raw key를 직접 저장
            try {
              await fetchWithRetry(
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
                    value: '__deleted__',
                  }),
                },
                1, 500, 8000,
              );
            } catch { /* best-effort delete */ }
          }
        }
      }
    } catch (e) {
      console.error('[Store] Failed to delete site data:', e);
    }

    // 2. 레지스트리에서 제거
    const updatedSites = sites.filter(s => s.id !== id);
    await saveToSupabase('default', SITE_REGISTRY_KEY, updatedSites);
    set({ sites: updatedSites });

    // 현재 보고 있는 사이트가 삭제된 경우 default로 전환
    if (get().siteId === id) {
      get().setSiteId('default');
    }
  },

  renameSite: async (id: string, name: string) => {
    const { sites } = get();
    const updatedSites = sites.map(s => s.id === id ? { ...s, name } : s);
    await saveToSupabase('default', SITE_REGISTRY_KEY, updatedSites);
    set({ sites: updatedSites });
  },

  // ─── Data defaults ───────────────────────────────────────────────────
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

    // Debounced Supabase save (800 ms) — siteId 기반 네임스페이스
    // fetchAll 진행 중에는 저장 억제 (사이트 전환 시 불필요한 저장 방지)
    if (_isFetching) return;
    
    const currentSiteId = get().siteId;
    const debounceKey = `${currentSiteId}::${key}`;
    if (debounceTimers[debounceKey]) clearTimeout(debounceTimers[debounceKey]);
    debounceTimers[debounceKey] = setTimeout(() => {
      saveToSupabase(currentSiteId, key, finalValue);
    }, 800);
  },

  fetchAll: async (overrideSiteId?: string) => {
    const siteId = overrideSiteId || get().siteId;
    _isFetching = true;
    clearAllDebounceTimers();
    set({ isLoading: true, fetchError: null, siteId });
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

      const allData = await res.json();

      // 사이트 레지스트리도 함께 로딩
      if (allData[SITE_REGISTRY_KEY]) {
        set({ sites: allData[SITE_REGISTRY_KEY] });
      }

      // 현재 siteId에 해당하는 데이터만 필터링
      const data = filterDataBySiteId(allData, siteId);

      // 사이트 데이터가 비어있으면 default fallback
      const hasData = Object.keys(data).length > 0;
      const finalData = hasData ? data : filterDataBySiteId(allData, 'default');

      if (finalData) {
        set((state) => ({
          heroContent:   finalData['hero_content']           !== undefined ? finalData['hero_content']           : state.heroContent,
          aboutContent:  finalData['about_content']          !== undefined ? finalData['about_content']          : state.aboutContent,
          portfolioData: finalData['portfolio_data']         !== undefined ? finalData['portfolio_data']         : state.portfolioData,
          skillTabs:     finalData['skill_tabs']             !== undefined ? finalData['skill_tabs']             : state.skillTabs,
          tools:         finalData['tools']                  !== undefined ? finalData['tools']                  : state.tools,
          resumeData:    finalData['resume_data']            !== undefined ? finalData['resume_data']            : state.resumeData,
          userImage:     finalData['stat_board_user_image']  !== undefined ? finalData['stat_board_user_image']  : state.userImage,
          aiSkills:      finalData['ai_skills']              !== undefined ? finalData['ai_skills']              : state.aiSkills,
          toolCards:     finalData['tool_cards']             !== undefined ? finalData['tool_cards']             : state.toolCards,
          portfolioDescription: finalData['portfolio_description'] !== undefined ? finalData['portfolio_description'] : state.portfolioDescription,
          portfolioCategories: finalData['portfolio_categories'] !== undefined ? finalData['portfolio_categories'] : state.portfolioCategories,
          statBoardDefaultBtnText: finalData['stat_board_default_btn_text'] !== undefined ? finalData['stat_board_default_btn_text'] : state.statBoardDefaultBtnText,
          statBoardDefaultDetailTitle: finalData['stat_board_default_title'] !== undefined ? finalData['stat_board_default_title'] : state.statBoardDefaultDetailTitle,
          statBoardDefaultDetailDesc: finalData['stat_board_default_desc'] !== undefined ? finalData['stat_board_default_desc'] : state.statBoardDefaultDetailDesc,
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
      _isFetching = false;
    } catch (e: any) {
      console.error('[Store] Failed to fetch initial data:', e);
      _isFetching = false;
      set({ isLoading: false, fetchError: e?.message ?? 'Network error' });
    }
  },
}));
