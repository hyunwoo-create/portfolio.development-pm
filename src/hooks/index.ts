import { useState, useCallback, useEffect } from 'react';
// --- Supabase Content API ---
export const SUPABASE_CONTENT_API = 'https://bovxanwamgbhlubrndyl.supabase.co/functions/v1/content-api';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdnhhbndhbWdiaGx1YnJuZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ0NDAsImV4cCI6MjA5MTM1MDQ0MH0.b4MvsylK--ZJrkjWZnkzcSHpjHxYiyJTA-lYsI8Ij4Y';

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
 return data;
 })
 .catch(() => {
 _contentCache = {};
 return {};
 });
 return _contentPromise;
};

const saveContentToSupabase = async (key: string, value: any) => {
 try {
 await fetch(SUPABASE_CONTENT_API, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'apikey': SUPABASE_ANON_KEY,
 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
 },
 body: JSON.stringify({ password: 'qwer154', key, value }),
 });
 } catch (e) {
 console.error('Failed to save content:', e);
 }
};

// --- Editable Content Hook ---
export const useEditableContent = (initialData: any, key: string) => {
 const [data, setData] = useState(initialData);
 const [loaded, setLoaded] = useState(false);

 useEffect(() => {
 fetchAllContent().then(allContent => {
 if (allContent[key] !== undefined) {
 setData(allContent[key]);
 }
 setLoaded(true);
 });
 }, [key]);

 const updateData = (newData: any) => {
 setData(newData);
 saveContentToSupabase(key, newData);
 };

 return [data, updateData];
};

