import { useState, useEffect, useRef } from 'react';

// --- Supabase Content API ---
export const SUPABASE_CONTENT_API = 'https://bovxanwamgbhlubrndyl.supabase.co/functions/v1/content-api';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdnhhbndhbWdiaGx1YnJuZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ0NDAsImV4cCI6MjA5MTM1MDQ0MH0.b4MvsylK--ZJrkjWZnkzcSHpjHxYiyJTA-lYsI8Ij4Y';

// Large base64 fields that must be saved separately (not bundled into parent objects)
const LARGE_FIELD_KEYS = ['heroImage'];

let _contentCache: Record<string, any> | null = null;
let _contentPromise: Promise<Record<string, any>> | null = null;

const fetchAllContent = (): Promise<Record<string, any>> => {
  if (_contentCache) return Promise.resolve(_contentCache);
  if (_contentPromise) return _contentPromise;
  _contentPromise = fetch(SUPABASE_CONTENT_API, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      _contentCache = data;
      // Merge separately-stored large fields back into parent objects
      if (_contentCache) {
        if (_contentCache['hero_image'] !== undefined && _contentCache['hero_content']) {
          _contentCache['hero_content'] = {
            ..._contentCache['hero_content'],
            heroImage: _contentCache['hero_image'],
          };
        }
      }
      return _contentCache as Record<string, any>;
    })
    .catch(() => {
      _contentCache = {};
      return {};
    });
  return _contentPromise;
};

// Utility to strip base64 images from strings (like HTML content)
const stripBase64Images = (str: string): string => {
  if (typeof str !== 'string') return str;
  // Replace <img src="data:image/..."> with a warning placeholder
  return str.replace(/<img[^>]+src=["']data:image\/[^"']+["'][^>]*>/gi, '<div class="p-4 bg-red-100 text-red-600 rounded-lg text-sm font-bold my-2 border border-red-200">⚠️ 고화질 이미지는 DB 과부하 방지를 위해 반드시 외부 링크(URL) 형태로만 삽입해주세요. (Base64 이미지 자동 삭제됨)</div>');
};

const recursivelySanitize = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('blob:')) return null; // Remove blob URLs
    if (obj.startsWith('data:image/')) return null; // Remove direct base64 strings
    return stripBase64Images(obj); // Strip from HTML
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

const saveContentToSupabase = async (key: string, value: any) => {
  try {
    const sanitizedValue = recursivelySanitize(value);

    // Safeguard: Do not save if sanitizedValue is empty or completely stripped
    // Unless the user explicitly cleared it, but an empty object for a normally complex data structure is suspicious.
    if (!sanitizedValue || (typeof sanitizedValue === 'object' && Object.keys(sanitizedValue).length === 0 && Array.isArray(sanitizedValue) === false && key !== 'hero_image')) {
      console.warn(`[Supabase Save] Blocked saving empty or fully stripped object to key: ${key}`);
      return;
    }

    const response = await fetch(SUPABASE_CONTENT_API, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ password: import.meta.env.VITE_ADMIN_PASSWORD, key, value: sanitizedValue }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Supabase Save Error] Failed to save key: ${key}. Status: ${response.status}`, errorText);
      alert(`데이터 저장 실패 (${key}): 서버 통신 오류가 발생했습니다. 데이터 유실 방지를 위해 창을 닫지 마시고 잠시 후 다시 시도해주세요.`);
      throw new Error(`Supabase save failed: ${response.status}`);
    }
  } catch (e) {
    console.error(`[Supabase Exception] Failed to save ${key}:`, e);
    // Don't alert here if it's a network error during beforeunload to avoid breaking the exit flow
  }
};

// --- Editable Content Hook ---
export const useEditableContent = (initialData: any, key: string) => {
  const [data, setData] = useState(initialData);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);

  // Keep dataRef in sync for the cleanup/beforeunload save
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    fetchAllContent().then(allContent => {
      if (allContent[key] !== undefined) {
        setData(allContent[key]);
      }
    });

    // Cleanup: save immediately on unmount if there's a pending change
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        saveContentToSupabase(key, dataRef.current);
      }
    };
  }, [key]);

  // Handle browser close/reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (debounceTimer.current) {
        saveContentToSupabase(key, dataRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [key]);

  const updateData = (newData: any) => {
    setData(newData);
    // Update global cache so other components (or remounts) get the latest data
    if (_contentCache) {
      _contentCache[key] = newData;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveContentToSupabase(key, newData);
      debounceTimer.current = null;
    }, 800);
  };

  return [data, updateData];
};

