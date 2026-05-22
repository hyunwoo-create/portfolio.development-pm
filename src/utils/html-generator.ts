import { Project } from '../types';

export const generatePortfolioHtml = (
  projects: Project[],
  categories: string[],
  description: string
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
      #main-content { min-height: 100vh; padding: 0 !important; margin: 0 !important; background: #F9F7F7 !important; }
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
  <div id="main-content" class="pt-[100px] pb-16 px-10 w-[1000px] mx-auto bg-[#F9F7F7]">
    
    <!-- Top Big Button -->
    <div class="w-full flex justify-center mb-16 pt-8">
      <a 
        id="main-link" 
        href="#" 
        target="_blank"
        class="group relative inline-flex items-center justify-center px-12 py-5 bg-[#112D4E] text-white font-black text-xl tracking-tight rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-300"
      >
        포트폴리오 페이지 바로 가기
        <svg class="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </a>
    </div>

    <!-- Header Section -->
    <div class="mb-12">
      <h1 class="text-4xl font-black text-[#112D4E] mb-4 tracking-tight">포트폴리오</h1>
      <p class="text-[#8fabc8] text-base font-medium">${description || '게임 기획부터 런칭까지의 메인 프로젝트와 AI/툴링을 활용한 기타 작업물 아카이브입니다.'}</p>
    </div>

    <!-- Categories Display (static design) -->
    <div class="flex flex-wrap gap-3 mb-10 pb-6 border-b border-[#DBE2EF]/50">
      ${categories.map((cat, i) => `
        <div class="px-5 py-2.5 rounded-full text-sm font-bold border flex items-center gap-2 ${i === 0 ? 'bg-[#112D4E] text-white border-[#112D4E] shadow-md' : 'bg-white text-[#8fabc8] border-[#DBE2EF]'}">
          ${cat}
        </div>
      `).join('')}
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-2 gap-8 avoid-break">
      ${projects.map(project => `
        <a href="#" data-project-id="${project.id}" class="project-card group flex flex-col bg-white rounded-3xl border border-[#DBE2EF] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative cursor-pointer no-underline block avoid-break" target="_blank">
          <div class="aspect-[4/3] relative overflow-hidden bg-[#F9F7F7]">
            <img
              src="${project.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070'}"
              alt="${project.title}"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div class="p-8 flex-1 flex flex-col">
            <div class="text-[#C08D50] font-bold text-xs mb-2 tracking-widest uppercase">
              ${project.details?.[0] || '서브 카테고리'}
            </div>
            <h3 class="text-2xl font-black text-[#112D4E] mb-4 leading-tight group-hover:text-[#3F72AF] transition-colors">
              ${project.title}
            </h3>
            <div class="flex flex-wrap gap-2 mb-4">
              ${(project.tags || []).map(tag => `
                <span class="px-3 py-1 border border-[#DBE2EF] rounded-full text-[11px] text-[#8fabc8] font-bold bg-[#F9F7F7]">
                  ${tag}
                </span>
              `).join('')}
            </div>
            <div class="text-[#8fabc8] text-sm leading-relaxed mb-6 flex-1">
              ${project.description}
            </div>
          </div>
        </a>
      `).join('')}
    </div>

  </div>

  <!-- Script for handling links -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const linkInput = document.getElementById('link-input');
      const applyBtn = document.getElementById('apply-btn');
      const mainLink = document.getElementById('main-link');
      const projectCards = document.querySelectorAll('.project-card');

      const updateLinks = () => {
        let baseUrl = linkInput.value.trim();
        if (!baseUrl) return;
        
        // Remove trailing slash if exists to ensure format compatibility
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        // Update top main link
        mainLink.href = baseUrl;

        // Update each project card
        projectCards.forEach(card => {
          const projectId = card.getAttribute('data-project-id');
          // Add ?project= query string. Assumes baseUrl does not already contain query params.
          if (baseUrl.includes('?')) {
             card.href = baseUrl + '&project=' + projectId;
          } else {
             card.href = baseUrl + '?project=' + projectId;
          }
        });

        alert('모든 링크가 업데이트 되었습니다!\\n각 카드를 눌러 연결을 확인해보세요.');
      };

      applyBtn.addEventListener('click', updateLinks);
      
      linkInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') updateLinks();
      });
    });
  </script>
</body>
</html>
  `;
};
