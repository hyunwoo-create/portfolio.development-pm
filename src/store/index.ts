import { create } from 'zustand';
import { 
  HERO_CONTENT_DEFAULT, 
  ABOUT_CONTENT_DEFAULT, 
  GAME_HISTORY, 
  RESUME_DATA, 
  PORTFOLIO_PROJECTS, 
  INITIAL_SKILL_TABS, 
  INITIAL_TOOLS 
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
    // Only run expensive regex if the string looks like HTML to avoid accidental stripping
    // or performance issues with large base64 strings in non-HTML fields.
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

// Custom debounce implementation for the store
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

const saveToSupabase = async (key: string, value: any) => {
  try {
    const sanitizedValue = recursivelySanitize(value);
    
    if (!sanitizedValue || (typeof sanitizedValue === 'object' && Object.keys(sanitizedValue).length === 0 && Array.isArray(sanitizedValue) === false && key !== 'hero_image')) {
      return;
    }

    const response = await fetch(SUPABASE_CONTENT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ password: import.meta.env.VITE_ADMIN_PASSWORD || 'qwer154', key, value: sanitizedValue }),
    });

    if (!response.ok) {
      console.error(`[Supabase Save Error] Failed to save key: ${key}. Status: ${response.status}`);
      alert(`데이터 저장 실패 (${key}): 서버 통신 오류. 데이터 유실 방지를 위해 창을 닫지 마시고 잠시 후 다시 시도해주세요.`);
    }
  } catch (e) {
    console.error(`[Supabase Exception] Failed to save ${key}:`, e);
  }
};

interface AppState {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  isLoading: boolean;
  
  // Data stores
  heroContent: any;
  aboutContent: any;
  portfolioData: any[];
  skillTabs: any[];
  tools: any[];
  gameHistory: any;
  resumeData: any;
  userImage: string;
  
  // Setters that update local state AND trigger debounced Supabase save
  updateContent: (key: string, value: any) => void;
  
  // Initializer
  fetchAll: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isEditing: false,
  setIsEditing: (val) => set({ isEditing: val }),
  isLoading: true,
  
  heroContent: HERO_CONTENT_DEFAULT,
  aboutContent: ABOUT_CONTENT_DEFAULT,
  portfolioData: PORTFOLIO_PROJECTS,
  skillTabs: INITIAL_SKILL_TABS,
  tools: INITIAL_TOOLS,
  gameHistory: GAME_HISTORY,
  resumeData: RESUME_DATA,
  userImage: '',
  
  updateContent: (key: string, valueOrUpdater: any) => {
    const stateKey = key === 'hero_content' ? 'heroContent' :
                     key === 'about_content' ? 'aboutContent' :
                     key === 'portfolio_data' ? 'portfolioData' :
                     key === 'skill_tabs' ? 'skillTabs' :
                     key === 'tools' ? 'tools' :
                     key === 'game_history' ? 'gameHistory' :
                     key === 'resume_data' ? 'resumeData' :
                     key === 'stat_board_user_image' ? 'userImage' : null;
                     
    let finalValue = valueOrUpdater;
    if (typeof valueOrUpdater === 'function' && stateKey) {
      finalValue = valueOrUpdater(get()[stateKey as keyof AppState]);
    }

    if (stateKey) {
      set({ [stateKey]: finalValue } as any);
    }
    
    // 2. Debounce Supabase saving (800ms)
    if (debounceTimers[key]) clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(() => {
      saveToSupabase(key, finalValue);
    }, 800);
  },
  
  fetchAll: async () => {
    try {
      const res = await fetch(SUPABASE_CONTENT_API, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
      });
      const data = await res.json();
      
      // Update store with fetched data if it exists
      if (data) {
        set((state) => ({
          heroContent: data['hero_content'] !== undefined ? data['hero_content'] : state.heroContent,
          aboutContent: data['about_content'] !== undefined ? data['about_content'] : state.aboutContent,
          portfolioData: data['portfolio_data'] !== undefined ? data['portfolio_data'] : state.portfolioData,
          skillTabs: data['skill_tabs'] !== undefined ? data['skill_tabs'] : state.skillTabs,
          tools: data['tools'] !== undefined ? data['tools'] : state.tools,
          gameHistory: data['game_history'] !== undefined ? data['game_history'] : state.gameHistory,
          resumeData: data['resume_data'] !== undefined ? data['resume_data'] : state.resumeData,
          userImage: data['stat_board_user_image'] !== undefined ? data['stat_board_user_image'] : state.userImage,
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Failed to fetch initial data', e);
      set({ isLoading: false });
    }
  }
}));
