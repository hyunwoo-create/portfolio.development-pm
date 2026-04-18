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
      // 캔버스 리사이징 과정을 생략하고 원본 데이터를 그대로 반환하여 화질 저하를 방지합니다.
      resolve(e.target?.result as string);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

