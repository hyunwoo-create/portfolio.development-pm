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

const saveContentToSupabase = async (key: string, value: any) => {
  try {
    // Strip large base64 fields from the main object; save them separately
    let sanitizedValue = value;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Strip blob: URLs — they are session-only and become invalid after reload
      const hasBlobUrl = Object.values(value).some(
        (v) => typeof v === 'string' && v.startsWith('blob:')
      );
      if (hasBlobUrl) {
        sanitizedValue = { ...value };
        for (const k of Object.keys(sanitizedValue)) {
          if (typeof sanitizedValue[k] === 'string' && sanitizedValue[k].startsWith('blob:')) {
            delete sanitizedValue[k];
          }
        }
      }

      const hasLargeField = LARGE_FIELD_KEYS.some(f => sanitizedValue[f] && typeof sanitizedValue[f] === 'string' && sanitizedValue[f].startsWith('data:'));
      if (hasLargeField) {
        sanitizedValue = { ...sanitizedValue };
        for (const field of LARGE_FIELD_KEYS) {
          if (sanitizedValue[field] && typeof sanitizedValue[field] === 'string' && sanitizedValue[field].startsWith('data:')) {
            const imageData = sanitizedValue[field];
            delete sanitizedValue[field];
            // Save the large field under its own key
            fetch(SUPABASE_CONTENT_API, {
              method: 'POST',
              keepalive: true,
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ password: import.meta.env.VITE_ADMIN_PASSWORD, key: 'hero_image', value: imageData }),
            }).catch(e => console.error('Failed to save hero_image:', e));
          }
        }
      }
    }

    await fetch(SUPABASE_CONTENT_API, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ password: import.meta.env.VITE_ADMIN_PASSWORD, key, value: sanitizedValue }),
    });
  } catch (e) {
    console.error('Failed to save content:', e);
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

