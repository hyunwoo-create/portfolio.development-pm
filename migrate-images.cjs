const fs = require('fs');

const API = 'https://bovxanwamgbhlubrndyl.supabase.co/functions/v1/content-api';
const STORAGE_API = 'https://bovxanwamgbhlubrndyl.supabase.co/storage/v1/object/portfolio-images';
const PUBLIC_URL_BASE = 'https://bovxanwamgbhlubrndyl.supabase.co/storage/v1/object/public/portfolio-images';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdnhhbndhbWdiaGx1YnJuZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ0NDAsImV4cCI6MjA5MTM1MDQ0MH0.b4MvsylK--ZJrkjWZnkzcSHpjHxYiyJTA-lYsI8Ij4Y';
const ADMIN_PASSWORD = 'qwer154';

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
}

async function uploadBase64ToStorage(base64Str) {
  // Extract mime type and data
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }
  const mimeType = matches[1];
  const data = Buffer.from(matches[2], 'base64');
  
  const ext = mimeType.split('/')[1] || 'png';
  const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  
  console.log(`Uploading ${filename} (${data.length} bytes)...`);
  
  const res = await fetchWithRetry(`${STORAGE_API}/${filename}`, {
    method: 'POST',
    headers: {
      'Content-Type': mimeType,
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`
    },
    body: data
  });
  
  return `${PUBLIC_URL_BASE}/${filename}`;
}

async function migrate() {
  console.log('Fetching all data...');
  const res = await fetch(API, {
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  });
  const allData = await res.json();
  
  let modifiedCount = 0;
  
  // Recursively find and replace base64 strings
  async function traverse(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') {
      if (obj.startsWith('data:image/')) {
        const publicUrl = await uploadBase64ToStorage(obj);
        if (publicUrl) {
          modifiedCount++;
          return publicUrl;
        }
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      const arr = [];
      for (const item of obj) {
        arr.push(await traverse(item));
      }
      return arr;
    }
    if (typeof obj === 'object') {
      const newObj = {};
      for (const [k, v] of Object.entries(obj)) {
        newObj[k] = await traverse(v);
      }
      return newObj;
    }
    return obj;
  }

  console.log('Scanning and migrating images...');
  for (const [key, value] of Object.entries(allData)) {
    const newVal = await traverse(value);
    
    // If the value changed, save it back
    if (JSON.stringify(value) !== JSON.stringify(newVal)) {
      console.log(`Updating key: ${key}`);
      await fetchWithRetry(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`
        },
        body: JSON.stringify({
          password: ADMIN_PASSWORD,
          key: key,
          value: newVal
        })
      });
    }
  }
  
  console.log(`Migration complete! Replaced ${modifiedCount} base64 images.`);
}

migrate().catch(console.error);
