import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { ResumePDF } from '../components/ResumePDF';
import { ResumeData } from '../types';

export interface PdfExportPayload {
  data: ResumeData;
  heroContent?: any;
  aboutContent?: any;
  aiSkills?: any;
  toolCards?: any;
  userImage?: string;
}

/**
 * 전용 새 창을 격리하여 브라우저 네이티브 인쇄 엔진(window.print)을 이용한 고밀도 PDF 추출 함수
 * Tailwind v4의 oklch 컬러 및 벡터 텍스트 선택 지원을 완벽히 보장합니다.
 */
export const handlePdfExport = (payload: PdfExportPayload) => {
  try {
    // 1. PDF 전용 정적 마크업 생성 (Interactive 요소 배제)
    const htmlContent = renderToStaticMarkup(React.createElement(ResumePDF, payload));

    // 2. 새 창 격리
    const printWindow = window.open('', '_blank', 'width=1100,height=900,toolbar=0,scrollbars=0,status=0');
    if (!printWindow) {
      alert('팝업 차단이 설정되어 있습니다. 팝업을 허용해 주셔야 PDF 추출이 가능합니다.');
      return;
    }

    // 3. 현재 페이지의 스타일 시트 및 Tailwind v4 변수 복사
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(style => style.outerHTML)
      .join('\n');

    // 4. 인쇄 전용 CSS 및 HTML 주입
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${payload.data.name || 'Resume'}_Export</title>
          <meta charset="utf-8">
          ${styles}
          <style>
            /* PDF 전용 인쇄 설정 */
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: #fff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            .pdf-container {
              width: 1000px;
              margin: 0 auto;
              background: white;
              box-shadow: none;
              zoom: 0.79;
            }
            /* 페이지 강제 분할 제어 */
            .page-break-inside-avoid {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .break-before-page {
              page-break-before: always;
              break-before: page;
            }
            .break-after-page {
              page-break-after: always;
              break-after: page;
            }
            /* 벡터 텍스트 복사 및 폰트 렌더링 최적화 */
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeLegibility;
              transition: none !important;
              animation: none !important;
            }
            /* Markdown 스타일 보정 */
            .markdown-body ul, .markdown-body ol { padding-left: 1.5rem !important; margin-bottom: 1rem; }
            .markdown-body p { margin-bottom: 0.8rem; }
          </style>
        </head>
        <body>
          <div class="pdf-container">
            ${htmlContent}
          </div>
          <script>
            // 5. 폰트 및 모든 이미지가 로드된 것을 감지한 후 인쇄 다이얼로그 호출
            window.onload = function() {
              const images = Array.from(document.images);
              if (images.length === 0) {
                setTimeout(window.print, 500); // 폰트 로딩 대기용 최소 시간
                return;
              }
              
              let loadedCount = 0;
              const onImageLoadOrError = () => {
                loadedCount++;
                if (loadedCount === images.length) {
                  // 이미지가 모두 로드되어도 렌더링 안정화를 위해 500ms만 대기
                  setTimeout(window.print, 500); 
                }
              };

              images.forEach(img => {
                if (img.complete) {
                  onImageLoadOrError();
                } else {
                  img.onload = onImageLoadOrError;
                  img.onerror = onImageLoadOrError;
                }
              });
            };
            // 6. 인쇄 대화상자 종료 시 창 자동 닫기
            window.onafterprint = function() {
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('PDF 생성 프로세스 도중 예기치 못한 오류가 발생했습니다.');
  }
};
