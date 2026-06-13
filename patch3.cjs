const fs = require('fs');

// --- 1. Patch Resume.tsx ---
let resumeContent = fs.readFileSync('src/components/Resume.tsx', 'utf8');
const targetResume = `<div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}`;
const replacementResume = `<div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#DBE2EF] shadow-sm">
              <span className="text-[11px] font-black text-[#3F72AF] uppercase tracking-wider">PDF 연결 링크</span>
              <input 
                type="text" 
                value={data.portfolioUrl || ''} 
                onChange={(e) => setData({ ...data, portfolioUrl: e.target.value })}
                placeholder="https://..."
                className="text-[12px] font-medium text-[#112D4E] w-[200px] focus:outline-none placeholder:text-[#DBE2EF]"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}`;

resumeContent = resumeContent.replace(targetResume, replacementResume);
fs.writeFileSync('src/components/Resume.tsx', resumeContent);

// --- 2. Patch ResumePDF.tsx ---
let pdfContent = fs.readFileSync('src/components/ResumePDF.tsx', 'utf8');

// Replace Top URL
const topHeaderTarget = `<a href="https://hyunwoo-create.github.io/portfolio.development-pm/" target="_blank" rel="noopener noreferrer" style={{ color: '#7FB3E8', fontSize: '16px', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                https://hyunwoo-create.github.io/portfolio.development-pm/
              </a>`;
const topHeaderReplacement = `<a href={data.portfolioUrl || "https://hyunwoo-create.github.io/portfolio.development-pm/"} target="_blank" rel="noopener noreferrer" style={{ color: '#7FB3E8', fontSize: '16px', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                {data.portfolioUrl || "https://hyunwoo-create.github.io/portfolio.development-pm/"}
              </a>`;
pdfContent = pdfContent.replace(topHeaderTarget, topHeaderReplacement);

// Replace button on Hero
const buttonTarget = `{/* Col2 Row2: (Nav buttons 생략 — 인터랙티브 요소) */}
                <div />`;
const buttonReplacement = `{/* Col2 Row2: Portfolio Link Button */}
                <div className="flex justify-end items-end pb-8">
                  <a href={data.portfolioUrl || "https://hyunwoo-create.github.io/portfolio.development-pm/"} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#3F72AF] text-white rounded-2xl font-black text-[22px] shadow-xl flex items-center gap-3 hover:-translate-y-1 transition-transform" style={{ textDecoration: 'none' }}>
                    포트폴리오 확인하기
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                </div>`;
pdfContent = pdfContent.replace(buttonTarget, buttonReplacement);

// Change `|| '...'` to `?? '...'` in aboutContent and heroContent to prevent default text when deleted ("")
pdfContent = pdfContent.replace(/\|\| '/g, "?? '");
pdfContent = pdfContent.replace(/\|\| "/g, '?? "');
pdfContent = pdfContent.replace(/\|\| `/g, '?? `');
pdfContent = pdfContent.replace(/\|\| 100/g, '?? 100');
pdfContent = pdfContent.replace(/\|\| \(num/g, '?? (num');

// Fix StatBoard Detail ternary
const statBoardTernaryTarget = `{statBoardDefaultDetailTitle ? (
                      <>
                        <h3 className="text-2xl font-black text-[#112D4E] mb-6 text-center tracking-tight">{statBoardDefaultDetailTitle}</h3>
                        {statBoardDefaultDetailDesc && (
                          <div
                            className="text-[#112D4E]/80 text-[14px] leading-relaxed font-medium flex-1 text-center statboard-detail-body"
                            dangerouslySetInnerHTML={{ __html: statBoardDefaultDetailDesc }}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <Wrench className="w-12 h-12 mb-4 opacity-30 text-[#8fabc8] mx-auto" />
                        <p className="text-sm font-bold text-[#8fabc8] text-center">좌측 항목을 클릭하면<br/>상세 정보가 표시됩니다.</p>
                      </>
                    )}`;

const statBoardTernaryReplacement = `{statBoardDefaultDetailTitle !== undefined ? (
                      statBoardDefaultDetailTitle !== "" && (
                        <>
                          <h3 className="text-2xl font-black text-[#112D4E] mb-6 text-center tracking-tight">{statBoardDefaultDetailTitle}</h3>
                          {statBoardDefaultDetailDesc && (
                            <div
                              className="text-[#112D4E]/80 text-[14px] leading-relaxed font-medium flex-1 text-center statboard-detail-body"
                              dangerouslySetInnerHTML={{ __html: statBoardDefaultDetailDesc }}
                            />
                          )}
                        </>
                      )
                    ) : (
                      <>
                        <Wrench className="w-12 h-12 mb-4 opacity-30 text-[#8fabc8] mx-auto" />
                        <p className="text-sm font-bold text-[#8fabc8] text-center">좌측 항목을 클릭하면<br/>상세 정보가 표시됩니다.</p>
                      </>
                    )}`;
pdfContent = pdfContent.replace(statBoardTernaryTarget, statBoardTernaryReplacement);

fs.writeFileSync('src/components/ResumePDF.tsx', pdfContent);

console.log('done');
