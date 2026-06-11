// --- Utils ---
export const downloadPdf = (dataUrl: string, name: string) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = name.endsWith('.pdf') ? name : name + '.pdf';
  a.click();
};

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdnhhbndhbWdiaGx1YnJuZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ0NDAsImV4cCI6MjA5MTM1MDQ0MH0.b4MvsylK--ZJrkjWZnkzcSHpjHxYiyJTA-lYsI8Ij4Y';
const STORAGE_API = 'https://bovxanwamgbhlubrndyl.supabase.co/storage/v1/object/portfolio-images';
const PUBLIC_URL_BASE = 'https://bovxanwamgbhlubrndyl.supabase.co/storage/v1/object/public/portfolio-images';

async function uploadBlobToSupabase(blob: Blob, ext: string = 'webp'): Promise<string> {
  const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  const res = await fetch(`${STORAGE_API}/${filename}`, {
    method: 'POST',
    headers: {
      'Content-Type': blob.type || `image/${ext}`,
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: blob
  });
  if (!res.ok) throw new Error('Upload failed');
  return `${PUBLIC_URL_BASE}/${filename}`;
}

export const processImageHighQuality = (file: File, maxWidth: number = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        const targetWidth = maxWidth;
        let currWidth = img.width;
        let currHeight = img.height;

        const handleCanvasOutput = (targetCanvas: HTMLCanvasElement) => {
          targetCanvas.toBlob(async (blob) => {
            if (blob) {
              try {
                const url = await uploadBlobToSupabase(blob, 'webp');
                resolve(url);
              } catch (err) {
                console.error('Storage upload failed, falling back to base64', err);
                resolve(targetCanvas.toDataURL('image/webp', 0.8));
              }
            } else {
              resolve(targetCanvas.toDataURL('image/webp', 0.8));
            }
          }, 'image/webp', 0.8);
        };

        if (currWidth <= targetWidth) {
          canvas.width = currWidth;
          canvas.height = currHeight;
          ctx.drawImage(img, 0, 0);
          handleCanvasOutput(canvas);
          return;
        }

        canvas.width = currWidth;
        canvas.height = currHeight;
        ctx.drawImage(img, 0, 0);

        while (currWidth * 0.5 > targetWidth) {
          currWidth *= 0.5;
          currHeight *= 0.5;
          
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) break;
          
          tempCanvas.width = currWidth;
          tempCanvas.height = currHeight;
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          tempCtx.drawImage(canvas, 0, 0, currWidth, currHeight);
          
          canvas.width = currWidth;
          canvas.height = currHeight;
          ctx.drawImage(tempCanvas, 0, 0);
        }

        const finalScale = targetWidth / currWidth;
        const finalWidth = targetWidth;
        const finalHeight = currHeight * finalScale;
        
        const finalCanvas = document.createElement('canvas');
        const finalCtx = finalCanvas.getContext('2d');
        if (!finalCtx) {
          handleCanvasOutput(canvas);
          return;
        }

        finalCanvas.width = finalWidth;
        finalCanvas.height = finalHeight;
        finalCtx.imageSmoothingEnabled = true;
        finalCtx.imageSmoothingQuality = 'high';
        finalCtx.drawImage(canvas, 0, 0, finalWidth, finalHeight);

        handleCanvasOutput(finalCanvas);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * 일반적인 미디어 URL(YouTube, Google Drive 등)을 브라우저에서 즉시 사용 가능한 Embed/Direct URL로 변환합니다.
 */
export const getExternalEmbedUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return url || '';
  
  const trimmedUrl = url.trim();

  // 1. YouTube (Shorts 포함)
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const ytMatch = trimmedUrl.match(youtubeRegex);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}`;
  }

  // 2. Vimeo
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
  const vimeoMatch = trimmedUrl.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1`;
  }

  // 3. Google Drive (Direct Link)
  if (trimmedUrl.includes('drive.google.com')) {
    const driveIdRegex = /\/d\/([a-zA-Z0-9_-]+)/;
    const driveMatch = trimmedUrl.match(driveIdRegex);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/uc?id=${driveMatch[1]}`;
    }
  }

  // 4. Dropbox (Direct Link)
  if (trimmedUrl.includes('dropbox.com')) {
    return trimmedUrl
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace('?dl=0', '')
      .replace('&dl=0', '')
      .concat(trimmedUrl.includes('?') ? '&raw=1' : '?raw=1');
  }

  return trimmedUrl;
};

