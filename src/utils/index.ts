// --- Utils ---
export const downloadPdf = (dataUrl: string, name: string) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = name.endsWith('.pdf') ? name : name + '.pdf';
  a.click();
};

export const processImageHighQuality = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Step-down scaling algorithm (전문화된 이미지 리사이징 기법)
        // 브라우저의 기본 리사이징은 한번에 크게 줄일 때 계단 현상(Aliasing)과 무아레 패턴이 발생합니다.
        // 이를 방지하기 위해 절반씩 단계적으로 줄여나가며 고화질을 유지합니다.
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // 고해상도 품질을 위해 충분한 타겟 해상도 설정 (2000px)
        const targetWidth = 2000;
        let currWidth = img.width;
        let currHeight = img.height;

        // 원본 자체가 이미 충분히 작다면 가공하지 않음
        if (currWidth <= targetWidth) {
          resolve(e.target?.result as string);
          return;
        }

        // 초기 시작 캔버스 설정
        canvas.width = currWidth;
        canvas.height = currHeight;
        ctx.drawImage(img, 0, 0);

        // 단계적 축소 (보통 50%씩 줄이는 것이 가장 결과가 좋음)
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

        // 최종 타겟 크기로 정밀 조정
        const finalScale = targetWidth / currWidth;
        const finalWidth = targetWidth;
        const finalHeight = currHeight * finalScale;
        
        const finalCanvas = document.createElement('canvas');
        const finalCtx = finalCanvas.getContext('2d');
        if (!finalCtx) {
          resolve(canvas.toDataURL('image/webp', 0.95));
          return;
        }

        finalCanvas.width = finalWidth;
        finalCanvas.height = finalHeight;
        finalCtx.imageSmoothingEnabled = true;
        finalCtx.imageSmoothingQuality = 'high';
        finalCtx.drawImage(canvas, 0, 0, finalWidth, finalHeight);

        // WebP 95% 품질은 육안상 무손실에 가까우면서도 속도가 빠릅니다.
        resolve(finalCanvas.toDataURL('image/webp', 0.95));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

