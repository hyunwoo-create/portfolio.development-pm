// --- Utils ---
export const downloadPdf = (dataUrl: string, name: string) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = name.endsWith('.pdf') ? name : name + '.pdf';
  a.click();
};

