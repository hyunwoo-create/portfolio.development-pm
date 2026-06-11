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

// ─── Circuit breaker (prevents hammering a dead Supabase) ────────────────
let _circuitOpen = false;
let _circuitOpenedAt = 0;
const CIRCUIT_OPEN_MS = 60_000; // 60초 동안 재시도 차단

const isCircuitOpen = (): boolean => {
  if (!_circuitOpen) return false;
  // 60초 경과 시 자동 복구 (half-open)
  if (Date.now() - _circuitOpenedAt > CIRCUIT_OPEN_MS) {
    _circuitOpen = false;
    console.info('[CircuitBreaker] Auto-reset after cooldown');
    return false;
  }
  return true;
};

const openCircuit = () => {
  if (!_circuitOpen) {
    _circuitOpen = true;
    _circuitOpenedAt = Date.now();
    console.warn('[CircuitBreaker] OPEN — Supabase unreachable, skipping requests for 60s');
  }
};

const resetCircuit = () => {
  _circuitOpen = false;
  _circuitOpenedAt = 0;
  console.info('[CircuitBreaker] Manually reset');
};

// ─── Fetch with timeout ────────────────────────────────────────────────────
const fetchWithTimeout = (url: string, options: RequestInit, timeoutMs = 15000): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
};

// ─── Retry wrapper (exponential backoff) ──────────────────────────────────
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 3,
  delayMs = 1000,
  timeoutMs = 15000,
): Promise<Response> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options, timeoutMs);
      return res;
    } catch (err: any) {
      const isLastAttempt = attempt === retries;
      if (isLastAttempt) throw err;

      const backoffDelay = delayMs * Math.pow(2, attempt); // exponential backoff
      if (err.name === 'AbortError') {
        console.warn(`[fetchWithRetry] Timeout on attempt ${attempt + 1}/${retries + 1}. Retrying in ${backoffDelay}ms…`);
      } else {
        console.warn(`[fetchWithRetry] Network error on attempt ${attempt + 1}/${retries + 1}. Retrying in ${backoffDelay}ms…`);
      }
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  throw new Error('fetchWithRetry: exhausted all retries');
};

// ─── Save failure tracking (non-blocking toast instead of alert) ──────────
let lastToastTime = 0;
const TOAST_THROTTLE_MS = 30_000; // 30초 쿨다운
let _toastElement: HTMLDivElement | null = null;

const showToast = (message: string, durationMs = 6000) => {
  // Remove existing toast
  if (_toastElement && _toastElement.parentNode) {
    _toastElement.parentNode.removeChild(_toastElement);
  }
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%); z-index:99999;
    background:#1a1a2e; color:#fff; padding:14px 28px; border-radius:14px;
    font-size:13px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,0.25);
    display:flex; align-items:center; gap:10px; max-width:90vw;
    animation: toast-in 0.3s ease-out;
  `;
  el.innerHTML = `<span style="font-size:18px">⚠️</span><span>${message}</span>`;
  // Add animation keyframes if not already present
  if (!document.getElementById('toast-keyframes')) {
    const style = document.createElement('style');
    style.id = 'toast-keyframes';
    style.textContent = '@keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(style);
  }
  document.body.appendChild(el);
  _toastElement = el;
  setTimeout(() => {
    if (el.parentNode) {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.parentNode?.removeChild(el), 300);
    }
  }, durationMs);
};

const notifySaveFailure = (key: string, statusCode?: number) => {
  const now = Date.now();
  const detail = statusCode ? `HTTP ${statusCode}` : '네트워크 연결 오류';
  console.warn(`[Save Failed] key=${key} detail=${detail}`);
  if (now - lastToastTime < TOAST_THROTTLE_MS) return; // 30초 내 중복 알림 억제
  lastToastTime = now;
  showToast(`저장 실패 (${key}) — 자동 재시도 중입니다.`, 5000);
};

// ─── Failed save retry queue ─────────────────────────────────────────────
interface PendingWrite { siteId: string; key: string; value: any; retryCount: number; }
const _pendingRetries: Map<string, PendingWrite> = new Map();
let _retryTimerId: ReturnType<typeof setTimeout> | null = null;

const scheduleRetryQueue = () => {
  if (_retryTimerId || _pendingRetries.size === 0) return;
  _retryTimerId = setTimeout(async () => {
    _retryTimerId = null;
    const entries = Array.from(_pendingRetries.entries());
    for (const [qKey, item] of entries) {
      try {
        const dbKey = makeDbKey(item.siteId, item.key);
        const sanitizedValue = recursivelySanitize(item.value);
        const res = await fetchWithTimeout(
          SUPABASE_CONTENT_API,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              password: (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'qwer154',
              key: dbKey,
              value: sanitizedValue,
            }),
          },
          20000,
        );
        if (res.ok) {
          _pendingRetries.delete(qKey);
          console.info(`[RetryQueue] Successfully saved key=${dbKey}`);
        } else {
          item.retryCount++;
          if (item.retryCount >= 5) {
            _pendingRetries.delete(qKey);
            console.error(`[RetryQueue] Giving up on key=${dbKey} after 5 retries`);
          }
        }
      } catch {
        item.retryCount++;
        if (item.retryCount >= 5) {
          _pendingRetries.delete(qKey);
        }
      }
    }
    // 남은 항목이 있으면 다시 스케줄
    if (_pendingRetries.size > 0) scheduleRetryQueue();
  }, 10_000); // 10초 후 재시도
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
  // Circuit breaker: Supabase가 다운된 상태면 저장 시도 자체를 건너뜀
  if (isCircuitOpen()) {
    console.warn(`[saveToSupabase] Circuit open, skipping save for key=${key}`);
    _pendingRetries.set(`${siteId}::${key}`, { siteId, key, value, retryCount: 0 });
    return;
  }

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
      1,     // retries (reduced — circuit breaker handles recovery)
      1000,  // base delay ms
      10000  // timeout ms
    );

    if (!response.ok) {
      console.error(`[Supabase Save Error] key=${dbKey} status=${response.status}`);
      notifySaveFailure(dbKey, response.status);
      _pendingRetries.set(`${siteId}::${key}`, { siteId, key, value, retryCount: 0 });
      scheduleRetryQueue();
    }
  } catch (e: any) {
    console.error(`[Supabase Exception] key=${key}`, e);
    openCircuit(); // 네트워크 실패 시 circuit 열기
    notifySaveFailure(key);
    _pendingRetries.set(`${siteId}::${key}`, { siteId, key, value, retryCount: 0 });
    scheduleRetryQueue();
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
    // Circuit breaker: Supabase 다운 시 fetchSites 건너뜀
    if (isCircuitOpen()) {
      console.warn('[fetchSites] Circuit open, skipping');
      return;
    }
    try {
      const res = await fetchWithRetry(
        SUPABASE_CONTENT_API,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
        1, 800, 8000, // 줄인 재시도: 1회, 8초 타임아웃
      );
      if (!res.ok) return;
      const allData = await res.json();
      
      if (allData[SITE_REGISTRY_KEY]) {
        set({ sites: allData[SITE_REGISTRY_KEY] });
      } else {
        set({ sites: [{ id: 'default', name: '기본 사이트', slug: 'default', createdAt: new Date().toISOString() }] });
      }
    } catch (e) {
      console.error('[Store] Failed to fetch sites:', e);
      openCircuit();
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
    
    // "다시 시도" 클릭 시 circuit breaker 리셋
    resetCircuit();
    
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
        1,     // retries (reduced from 3 — fast fallback to defaults)
        1000,  // base delay ms
        8000   // timeout ms (reduced from 20s — faster error detection)
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const allData = await res.json();

      // 사이트 레지스트리도 함께 로딩
      const fetchedSites = allData[SITE_REGISTRY_KEY] || [{ id: 'default', name: '기본 사이트', slug: 'default' }];
      set({ sites: fetchedSites });

      // 상속(Prototype) 체인을 통해 데이터를 병합
      // default -> parent -> current 순으로 덮어씌움 (Base64 중복 저장 방지)
      let finalData: any = {};
      const currentSite = fetchedSites.find((s: any) => s.id === siteId) || { id: 'default' };
      
      const chain: string[] = [];
      let pointer: any = currentSite;
      while (pointer && !chain.includes(pointer.id)) {
        chain.unshift(pointer.id);
        pointer = fetchedSites.find((s: any) => s.id === pointer.parentId);
      }
      if (!chain.includes('default')) chain.unshift('default');

      for (const pId of chain) {
        const pData = filterDataBySiteId(allData, pId);
        finalData = { ...finalData, ...pData };
      }

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
      openCircuit(); // Supabase 접속 실패 → circuit 열기
      set({ isLoading: false, fetchError: e?.message ?? 'Network error' });
    }
  },
}));
