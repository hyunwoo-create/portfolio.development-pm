import { Project } from '../types';

export const generatePortfolioHtml = (
  projects: Project[],
  categories: string[],
  description: string,
  currentUrl: string
): string => {
  // HTML template similar to portfolio-cover.html but maps through live data
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Portfolio Presentation</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;700;900&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
    body { font-family: 'Pretendard', sans-serif; background-color: #F9F7F7; color: #112D4E; }
    
    /* PDF Print Optimization */
    @page { size: A4 portrait; margin: 0; }
    @media print {
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      #no-print { display: none !important; }
      .page-break { page-break-before: always; }
      .avoid-break { page-break-inside: avoid; }
      #main-content { min-height: 100vh; max-width: 100% !important; width: 100% !important; padding: 20px 40px !important; margin: 0 !important; background: #F9F7F7 !important; }
    }
    
    .glass {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
  </style>
</head>
<body class="min-h-screen">

  <!-- ===============================
       [1] No-Print Setting Panel 
  ================================ -->
  <div id="no-print" class="fixed top-0 left-0 w-full z-50 glass border-b border-[#DBE2EF] shadow-sm py-4 px-6 flex items-center justify-between">
    <div class="flex items-center gap-4 flex-1">
      <div class="font-black text-[#112D4E] tracking-tight">🔗 포트폴리오 링크 설정</div>
      <input 
        type="text" 
        id="link-input" 
        value="${currentUrl}"
        class="flex-1 max-w-2xl px-4 py-2 rounded-xl border border-[#DBE2EF] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#3F72AF] text-[15px] font-medium transition-all"
        placeholder="포트폴리오 주소 입력 (예: https://hyunwoo-create.github.io/portfolio.development-pm/com2us/)"
      />
      <button 
        id="apply-btn"
        class="px-5 py-2 bg-[#112D4E] text-white font-bold rounded-xl hover:bg-[#3F72AF] shadow-md transition-all active:scale-95"
      >
        적용
      </button>
    </div>
    
    <div class="flex items-center gap-3">
      <button 
        onclick="window.print()"
        class="px-6 py-2.5 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all flex items-center gap-2 active:scale-95 ml-4"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
        PDF로 추출하기
      </button>
    </div>
  </div>

  <!-- ===============================
       [2] Main Content (Printable)
  ================================ -->
  <div id="main-content" class="pt-[100px] pb-16 px-8 max-w-[1100px] w-full mx-auto bg-[#F9F7F7]">
    
    <!-- Top Return Link -->
    <div class="mb-4">
      <a 
        id="main-link" 
        href="#" 
        class="portfolio-main-link inline-flex items-center text-[#112D4E] font-bold text-sm hover:text-[#3F72AF] transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        돌아가기
      </a>
    </div>

    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-4xl font-black text-[#112D4E] tracking-tight">포트폴리오</h1>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-3 gap-6">
      ${projects.map(project => `
        <a href="#" data-project-id="${project.id}" class="project-card group flex flex-col bg-white rounded-2xl border border-[#DBE2EF] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative cursor-pointer no-underline block avoid-break" target="_blank">
          <div class="aspect-[4/3] relative overflow-hidden bg-[#F9F7F7]">
            <img
              src="${project.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070'}"
              alt="${project.title}"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <div class="text-[#C08D50] font-bold text-[10px] mb-1 tracking-widest uppercase">
              ${project.details?.[0] || '서브 카테고리'}
            </div>
            <h3 class="text-xl font-black text-[#112D4E] mb-3 leading-tight group-hover:text-[#3F72AF] transition-colors">
              ${project.title}
            </h3>
            <div class="flex flex-wrap gap-1.5 mb-3">
              ${(project.tags || []).map(tag => `
                <span class="px-2.5 py-1 border border-[#DBE2EF] rounded-full text-[10px] text-[#8fabc8] font-bold bg-[#F9F7F7]">
                  ${tag}
                </span>
              `).join('')}
            </div>
            <div class="text-[#8fabc8] text-[11px] leading-relaxed flex-1 mb-4">
              ${project.description}
            </div>
            
            ${project.releaseTags && project.releaseTags.length > 0 ? `
              <div class="pt-4 border-t border-[#DBE2EF]/50 flex flex-wrap gap-2 mt-auto">
                ${project.releaseTags.map(tag => `
                  <div class="inline-flex items-center px-2 py-1 rounded-full border border-[#DBE2EF] bg-white text-[10px] font-bold text-[#112D4E] gap-1.5">
                    ${tag.icon ? `<img src="${tag.icon}" alt="icon" class="w-3.5 h-3.5 rounded-sm object-cover" />` : ''}
                    ${tag.label}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </a>
      `).join('')}
    </div>

    <!-- Footer -->
    <div class="mt-16 pt-8 pb-12 flex flex-col items-center justify-center gap-6">
      <div class="text-center text-[11px] font-bold text-[#8fabc8]">
        © PM 지원자 양현우 포트폴리오 All rights reserved.
      </div>
      <a 
        href="#" 
        target="_blank"
        class="portfolio-main-link group relative flex items-center justify-center w-full max-w-[800px] py-10 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-4xl tracking-tight rounded-3xl shadow-2xl shadow-red-600/20 hover:-translate-y-2 hover:shadow-red-600/40 transition-all duration-300"
      >
        포트폴리오 더 보기 !
        <svg class="w-12 h-12 ml-5 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </a>
    </div>
  </div>

  <!-- Script for handling links -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const linkInput = document.getElementById('link-input');
      const applyBtn = document.getElementById('apply-btn');
      const mainLinks = document.querySelectorAll('.portfolio-main-link');
      const projectCards = document.querySelectorAll('.project-card');

      const updateLinks = (isInitial = false) => {
        let baseUrl = linkInput.value.trim();
        if (!baseUrl) return;
        
        // Ensure the URL starts with http:// or https://
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = 'https://' + baseUrl;
        }

        try {
          const createUrl = (paramKey, paramVal) => {
            const urlObj = new URL(baseUrl);
            urlObj.searchParams.set(paramKey, paramVal);
            return urlObj.toString();
          };

          // Update main links
          mainLinks.forEach(link => {
            link.href = createUrl('view', 'portfolio');
          });

          // Update each project card
          projectCards.forEach(card => {
            const projectId = card.getAttribute('data-project-id');
            card.href = createUrl('project', projectId);
          });
        } catch (e) {
          console.error('Invalid URL:', e);
        }

        if (!isInitial) {
          alert('모든 링크가 업데이트 되었습니다!\\n각 카드를 눌러 연결을 확인해보세요.');
        }
      };

      applyBtn.addEventListener('click', () => updateLinks(false));
      
      linkInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') updateLinks(false);
      });
      
      // Auto-apply on load
      updateLinks(true);
    });
  </script>
</body>
</html>
  `;
};
