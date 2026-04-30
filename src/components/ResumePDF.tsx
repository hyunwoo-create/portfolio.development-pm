import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { 
  Calendar, 
  MapPin, 
  Linkedin, 
  Github, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck,
  Mail,
  Smartphone,
  User,
  ScrollText,
  Wrench,
  Star,
  Award
} from 'lucide-react';
import { ResumeData } from '../types';

interface ResumePDFProps {
  data: ResumeData;
  heroContent?: any;
  aboutContent?: any;
  aiSkills?: any;
  toolCards?: any;
  userImage?: string;
  statBoardDefaultBtnText?: string;
  statBoardDefaultDetailTitle?: string;
  statBoardDefaultDetailDesc?: string;
}

// HTML 또는 Markdown 콘텐츠를 렌더링하는 공통 헬퍼
const renderContent = (content: string | undefined, className?: string) => {
  if (!content) return null;
  if (content.startsWith('<')) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
    </div>
  );
};

// usedTools 배지 렌더링 헬퍼
const renderToolBadge = (tool: any, keyPrefix: string, idx: number) => {
  const toolObj = typeof tool === 'string' ? { name: tool, image: '' } : tool;
  return (
    <span key={`${keyPrefix}-${idx}`} className="px-3 py-1.5 bg-[#F9F7F7] border border-[#DBE2EF] text-[#112D4E] rounded-lg text-[11px] font-bold shadow-sm flex items-center gap-1.5">
      {toolObj.image && <img src={toolObj.image} alt="" className="w-6 h-6 object-contain shrink-0" />}
      {toolObj.name}
    </span>
  );
};

const renderHeroChart = (points: any[]) => {
  if (!points || points.length === 0) return null;
  const W = 364, H = 160;
  const PAD_X = 24, PAD_TOP = 32, PAD_BOTTOM = 24;
  const CHART_W = W - PAD_X * 2;
  const CHART_H = H - PAD_TOP - PAD_BOTTOM;
  const toSvgY = (val: number) => PAD_TOP + (CHART_H / 2) * (1 - val / 15);
  const toSvgX = (i: number, len: number) => {
    if (len <= 1) return W / 2;
    return PAD_X + (i / (len - 1)) * CHART_W;
  };
  const zeroY = toSvgY(0);
  const pathD = points.length > 1
    ? points.map((p: any, i: number) =>
        `${i === 0 ? 'M' : 'L'}${toSvgX(i, points.length).toFixed(1)},${toSvgY(p.value).toFixed(1)}`
      ).join(' ')
    : '';
  return (
    <svg viewBox="0 0 364 160" className="w-[437px]" style={{ overflow: 'visible' }}>
      <line x1={PAD_X} y1={zeroY} x2={W - PAD_X} y2={zeroY} stroke="rgba(17,45,78,0.15)" strokeWidth="1" />
      <text x={PAD_X - 6} y={zeroY + 3.5} fontSize="9" fill="rgba(17,45,78,0.4)" textAnchor="end">0</text>
      {pathD && <path d={pathD} fill="none" stroke="#E05C6A" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />}
      {points.map((p: any, i: number) => {
        const cx = toSvgX(i, points.length);
        const cy = toSvgY(p.value);
        const above = p.value >= 0;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="3.5" fill="white" stroke="#E05C6A" strokeWidth="1.5" />
            {p.label && (
              <text x={cx} y={above ? cy - 15 : cy + 20} fontSize="13" fill="rgba(17,45,78,0.65)" textAnchor="middle" fontWeight="600">{p.label}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export const ResumePDF = ({ data, heroContent, aboutContent, aiSkills, toolCards, userImage, statBoardDefaultBtnText, statBoardDefaultDetailTitle, statBoardDefaultDetailDesc }: ResumePDFProps) => {

  return (
    <table className="bg-[#F9F7F7] text-[#112D4E] font-sans leading-relaxed mx-auto" style={{ width: '1000px', borderCollapse: 'collapse', borderSpacing: 0 }}>
      <thead style={{ display: 'table-header-group' }}>
        <tr>
          <td style={{ padding: 0 }}>
            <div style={{
              background: '#112D4E',
              padding: '12px 60px 12px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              printColorAdjust: 'exact',
              WebkitPrintColorAdjust: 'exact',
            }}>
              <span style={{ color: '#DBE2EF', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>PORTFOLIO</span>
              <a href="https://hyunwoo-create.github.io/portfolio/" target="_blank" rel="noopener noreferrer" style={{ color: '#7FB3E8', fontSize: '16px', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                https://hyunwoo-create.github.io/portfolio/
              </a>
            </div>
            <div style={{ height: '32px', background: '#F9F7F7' }} />
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: '0 40px 40px 40px' }}>

      {/* ── 최상단 포트폴리오 URL 배너 (페이지 1) ── */}
      

      {/* ══════════════════════════════════════════════
          소개 페이지 — Hero + About + StatBoard
          실제 컴포넌트 HTML 구조를 그대로 재현
      ══════════════════════════════════════════════ */}
      {(heroContent || aboutContent) && (
        <div className="break-after-page mb-16 bg-[#F9F7F7]">

          {/* ── Hero Section ── (Hero.tsx 구조 그대로) */}
          {heroContent && (
            <section className="relative w-full flex items-center justify-center overflow-hidden bg-[#F9F7F7] pt-20" style={{ height: '1000px' }}>
              {/* Center Profile Image — Hero.tsx: absolute bottom, center */}
              {heroContent.heroImage && (
                <div className="absolute bottom-12 left-1/2 w-full flex items-end justify-center pointer-events-none z-10"
                  style={{ transform: 'translateX(-50%)', maxWidth: '36rem', height: '720px' }}>
                  <div className="relative w-full h-full flex items-end justify-center">
                    <div className="relative w-full max-w-full h-full max-h-full flex items-end justify-center drop-shadow-2xl overflow-hidden rounded-t-[2.5rem] bg-gradient-to-t from-[#DBE2EF]/20 to-transparent">
                      <img
                        src={heroContent.heroImage}
                        alt="Profile"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Grid Overlay — Hero.tsx: grid grid-cols-2 grid-rows-[auto_1fr_auto] */}
              <div className="relative z-20 w-full mx-auto grid grid-cols-2 gap-8 px-12 py-12"
                style={{ maxWidth: '80rem', height: '960px', gridTemplateRows: 'auto 1fr auto' }}>

                {/* Col1 Row1: Title */}
                <div className="flex flex-col items-start justify-start pr-12 mt-4">
                  <h1 className="font-black leading-[1.1] text-[#112D4E] tracking-tight mb-6">
                    <div className="block leading-[1.2] whitespace-pre-wrap" style={{ fontSize: '28px', letterSpacing: '-0.02em', fontWeight: '900', wordBreak: 'keep-all' }}>
                      {heroContent.titleLine1 && heroContent.titleLine1.startsWith('<')
                        ? <span dangerouslySetInnerHTML={{ __html: heroContent.titleLine1 }} />
                        : (heroContent.titleLine1 || '기획의도를 알고')}
                    </div>
                    <div className="block text-[#3F72AF] mt-3 leading-[1.2] whitespace-pre-wrap" style={{ fontSize: '38px', letterSpacing: '-0.04em', fontWeight: '900', wordBreak: 'keep-all' }}>
                      {heroContent.titleLine2 && heroContent.titleLine2.startsWith('<')
                        ? <span dangerouslySetInnerHTML={{ __html: heroContent.titleLine2 }} />
                        : (heroContent.titleLine2 || '결과로 증명하는 PM')}
                    </div>
                  </h1>
                </div>

                {/* Col2 Row1: Line Chart */}
                <div className="flex flex-col items-end justify-start mt-8 mr-8">
                  <div className="w-full" style={{ maxWidth: '380px' }}>
                    {renderHeroChart(heroContent.chartPoints || [])}
                  </div>
                </div>

                {/* Col1 Row2: POINT Cards */}
                <div className="flex flex-col items-start justify-center gap-6" style={{ transform: 'translateY(2.5rem)' }}>
                  <div className="bg-[#DBE2EF] text-[#112D4E] font-black text-[11px] tracking-widest px-5 py-1.5 rounded-full mb-1 shadow-sm">POINT</div>
                  {[1, 2, 3].map(num => {
                    const pVal = heroContent[`point${num}Value`] || '10';
                    const pLbl = heroContent[`point${num}Label`] || 'YEARS\nEXPERIENCE';
                    return (
                      <div key={num} className="flex px-4 py-2.5 bg-white/70 rounded-[1.25rem] border border-[#DBE2EF]/80 shadow-md items-center gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-black tracking-tighter leading-none" style={{ color: ['#0B1D2E', '#112D4E', '#1E4D80'][num - 1] }}>
                            {typeof pVal === 'string' && pVal.startsWith('<')
                              ? <span dangerouslySetInnerHTML={{ __html: pVal }} />
                              : pVal}
                          </span>
                          <div className="text-[11px] font-black text-[#3F72AF] leading-snug tracking-widest uppercase whitespace-pre-wrap">
                            {typeof pLbl === 'string' && pLbl.startsWith('<')
                              ? <span dangerouslySetInnerHTML={{ __html: pLbl }} />
                              : pLbl}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Col2 Row2: (Nav buttons 생략 — 인터랙티브 요소) */}
                <div />
              </div>
            </section>
          )}

          {/* ── About Section (Page 2) ── */}
          {aboutContent && (
            <div className="break-before-page">
              
              <section className="px-12 pt-12 pb-12 bg-[#F9F7F7]" style={{ width: '1000px', minHeight: '1050px' }}>
              {/* Q&A 헤더 */}
              <div className="flex justify-between items-end mb-16 border-b border-[#3F72AF]/20 pb-6 gap-4">
                <h2 className="text-3xl font-black text-[#112D4E] tracking-tight whitespace-pre-wrap">
                  {aboutContent.titleLeft || 'Q. 누구를 채용해야 할까요?'}
                </h2>
                <h2 className="text-2xl font-black text-[#3F72AF] tracking-tight text-right whitespace-pre-wrap">
                  {aboutContent.titleRight || 'A. 저 입니다. 지원자 양 현우'}
                </h2>
              </div>

              {/* 2컬럼 그리드 (About.tsx 참조) */}
              <div className="grid grid-cols-12 gap-12 items-stretch">
                
                {/* 좌 컬럼: 차트 + 동영상 */}
                <div className="col-span-5 flex flex-col gap-8">
                  {/* 막대형 그래프 카드 */}
                  <div className="bg-white rounded-[2rem] shadow-lg shadow-[#112D4E]/5 border border-[#DBE2EF] p-8">
                    <div className="flex flex-col items-center justify-center mb-10">
                      <h3 className="text-lg font-black text-[#112D4E] text-center">
                        {aboutContent.chartTitle || '막대형 그래프 채용 지원자격 top3'}
                      </h3>
                    </div>
                    <div className="space-y-8 relative">
                      {/* 눈금선 */}
                      <div className="absolute inset-0 left-20 flex justify-between pointer-events-none z-0 mt-2">
                        <div className="h-full ml-4 relative flex items-start">
                          <div className="absolute inset-y-0 left-0 border-l border-dashed border-[#3F72AF] opacity-20" />
                          <span className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-[#3F72AF] opacity-50 bg-white px-1">0</span>
                        </div>
                        <div className="h-full mr-12 relative flex items-start">
                          <div className="absolute inset-y-0 left-0 border-l border-dashed border-[#3F72AF] opacity-20" />
                          <span className="absolute -top-6 -translate-x-1/2 text-xs font-black text-[#1A59A7] bg-white px-1.5 py-0.5 shadow-sm rounded z-10 border border-[#DBE2EF]">
                            {aboutContent.chartTotal || 100}
                          </span>
                        </div>
                      </div>
                      {/* 막대 */}
                      {[1, 2, 3].map((num) => {
                        const totalParam = parseInt(aboutContent.chartTotal) || 100;
                        const v = parseInt(aboutContent[`skill${num}Value`]) || (num === 1 ? 80 : num === 2 ? 60 : 40);
                        const p = Math.min((v / totalParam) * 100, 100);
                        return (
                          <div key={num} className="flex items-center gap-4 relative z-10 pr-4">
                            <div className="w-14 text-sm font-bold text-[#112D4E] text-right whitespace-pre-wrap">
                              {aboutContent[`skill${num}Name`] || `역량 ${String.fromCharCode(64 + num)}`}
                            </div>
                            <div className="flex-1 flex flex-col w-full">
                              <div className="h-8 relative flex items-center w-full">
                                <div className="h-full bg-[#3F72AF] rounded-r-md shadow-sm flex items-center justify-end px-2" style={{ width: `${p}%`, minWidth: '1.5rem', maxWidth: '100%' }}>
                                  {p > 15 && <span className="text-white text-[10px] font-bold whitespace-nowrap px-1">{Math.round(p)}%</span>}
                                </div>
                                <span className="ml-3 text-sm font-black text-[#112D4E] min-w-[2rem]">{v}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 크롤러 동영상 */}
                  <div className="bg-white rounded-[2rem] shadow-lg shadow-[#112D4E]/5 border border-[#DBE2EF] p-8 flex flex-col items-center">
                    <h3 className="text-lg font-black text-[#112D4E] text-center mb-6">
                      {aboutContent.videoTitle || "크롤러 동영상"}
                    </h3>
                    <div className="w-full aspect-video bg-[#DBE2EF]/30 rounded-2xl overflow-hidden flex items-center justify-center border border-[#DBE2EF]">
                      <div className="text-center text-[#3F72AF]">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 opacity-60"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 우 컬럼: 역량 설명 텍스트 */}
                <div className="col-span-7 flex flex-col justify-between py-6">
                  <div className="flex flex-col space-y-16 pl-16 flex-1 justify-around">
                    {[1, 2, 3].map((num) => {
                      const title = aboutContent[`descTitle${num}`] || (
                        num === 1 ? '역량 A에 해당하는 내용 및 역량' :
                        num === 2 ? '역량 B에 해당하는 내용 및 역량' :
                                   '역량 C에 해당하는 내용 및 역량'
                      );
                      const body = aboutContent[`descText${num}`] || (
                        num === 1 ? '채용 공고에서 요구하는 최우선 역량을 완벽하게 충족하며, 실무에서 즉시 성과를 창출할 수 있는 기획력과 문제해결 능력을 보유하고 있습니다.' :
                        num === 2 ? '다양한 직군과의 협업 경험을 통해 커뮤니케이션 비용을 줄이고, 복잡한 프로젝트를 리드하여 성공적인 런칭을 이끌어냅니다.' :
                                   '데이터 수집 및 분석 자동화(크롤링) 경험을 바탕으로, 높은 수준의 기술적 이해도를 지니고 있어 개발팀과 매끄럽게 소통합니다.'
                      );
                      return (
                        <div key={num} className="relative">
                          <div className="absolute top-1/2 -left-16 w-12 -translate-y-1/2 flex items-center opacity-30 text-[#3F72AF]">
                            <div className="flex-1 border-t-2 border-dashed border-[#3F72AF]"></div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ml-2"><path d="m9 18 6-6-6-6"/></svg>
                          </div>
                          <h4 className="text-[17px] font-black text-[#112D4E] mb-3 leading-snug tracking-tight">
                            {title}
                          </h4>
                          <div className="text-[#3F72AF] text-[15px] leading-relaxed font-medium">
                            {renderContent(body)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              </section>
            </div>
          )}

          {/* ── StatBoard Section (Page 3) ── */}
          {(aiSkills?.length > 0 || toolCards?.length > 0 || userImage) && (
            <div className="break-before-page">
              
              <section className="px-12 pt-12 bg-[#F9F7F7]" style={{ width: '1000px', minHeight: '1050px', display: 'flex', flexDirection: 'column' }}>
                {/* 상단: AI능력(좌) + 아바타(중) + 기본 안내(우) */}
                <div className="grid grid-cols-12 gap-8 flex-1 items-start relative">
                
                {/* 좌측: AI 능력 목록 */}
                <div className="col-span-3 flex flex-col gap-6 pt-12 z-10">
                  {aiSkills?.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h2 className="text-sm font-black tracking-[0.1em] text-[#8fabc8] uppercase mb-1">AI 활용 능력</h2>
                      {aiSkills.map((a: any) => (
                        <div key={a.id} className="p-4 rounded-xl bg-white border border-[#DBE2EF] shadow-sm">
                          <div className="font-black text-[15px] text-[#112D4E] leading-tight">{a.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                {/* 좌측 하단: 기본 버튼 */}
                {statBoardDefaultBtnText && (
                  <div className="mt-6 px-6 py-4 bg-[#0a1e36] rounded-2xl flex items-center justify-between gap-4 shadow-xl">
                    <span className="text-white text-[13px] font-black leading-snug whitespace-pre-wrap">{statBoardDefaultBtnText}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                )}

                </div>

                {/* 중앙: 아바타 */}
                <div className="col-span-4 h-[700px] relative flex items-center justify-center z-20">
                  {userImage && (
                    <img
                      src={userImage}
                      alt="Avatar"
                      className="w-[120%] max-w-none h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]"
                    />
                  )}
                </div>

                {/* 우측: statBoard 기본 상세 내용 */}
                <div className="col-span-5 pt-12 z-10">
                  <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-12 border-2 border-white shadow-2xl flex flex-col" style={{ minHeight: '400px' }}>
                    {statBoardDefaultDetailTitle ? (
                      <>
                        <h3 className="text-2xl font-black text-[#112D4E] mb-6 text-center tracking-tight">{statBoardDefaultDetailTitle}</h3>
                        {statBoardDefaultDetailDesc ? (() => {
                          const desc = statBoardDefaultDetailDesc;
                          const isHtml = /<[a-z][\s\S]*>/i.test(desc);
                          return (
                            <div
                              className="text-[#112D4E]/80 text-[15px] leading-relaxed font-medium flex-1 text-center statboard-detail-body"
                              dangerouslySetInnerHTML={{ __html: isHtml ? desc : desc.replace(/\n/g, '<br/>') }}
                            />
                          );
                        })() : null}
                        <div className="mt-6 pt-4 border-t border-[#DBE2EF]/60">
                          <p className="text-xs font-bold text-[#8fabc8] text-center">좌측 항목을 클릭하면 상세 정보가 표시됩니다.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Wrench className="w-12 h-12 mb-4 opacity-30 text-[#8fabc8] mx-auto" />
                        <p className="text-sm font-bold text-[#8fabc8] text-center">좌측 항목을 클릭하면<br/>상세 정보가 표시됩니다.</p>
                      </>
                    )}
                  </div>
                </div>

                </div>

                {/* 하단: 사용 TOOL 카테고리별 가로 정렬 */}
                {toolCards?.length > 0 && (() => {
                  const cats = ['문서', '협업', '디자인', '개발', 'AI'];
                  const byCat = cats.map(cat => ({ cat, items: toolCards.filter((t: any) => t.category === cat) })).filter(g => g.items.length > 0);
                  return (
                    <div className="border-t border-[#DBE2EF]/60 pt-8 pb-12 mt-4">
                      <h2 className="text-sm font-black tracking-[0.15em] text-[#8fabc8] uppercase mb-6">사용 TOOL</h2>
                      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${byCat.length}, 1fr)` }}>
                        {byCat.map(g => (
                          <div key={g.cat} className="flex flex-col gap-2">
                            <div className="text-[11px] font-black text-[#3F72AF] tracking-widest uppercase pb-1 border-b border-[#DBE2EF]/60 mb-1">{g.cat}</div>
                            {g.items.map((t: any) => (
                              <div key={t.id} className="px-3 py-2 rounded-xl bg-white border border-[#DBE2EF] shadow-sm flex items-center gap-2">
                                {t.iconUrl
                                  ? <img src={t.iconUrl} className="w-4 h-4 object-contain shrink-0" alt={t.name} />
                                  : <Wrench className="w-3.5 h-3.5 shrink-0 text-[#3F72AF]" />}
                                <span className="font-black text-[12px] text-[#112D4E]">{t.name}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </section>
            </div>
          )}

        </div>
      )}



      {/* Resume Grid */}
      <div className="break-before-page">
        
        <div className="grid grid-cols-[280px_1fr] gap-12">
        {/* Sidebar */}
        <div className="flex flex-col gap-12">
          {/* Profile Section */}
          <div className="text-left flex flex-col gap-6">
            <div className="w-[180px] h-[180px] rounded-3xl overflow-hidden shadow-sm border border-[#3F72AF]/12 bg-white">
              <img src={data.resumeImage || "https://picsum.photos/seed/profile/300/300"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1.5 mb-2">
              <h1 className="text-3xl font-black text-[#112D4E] tracking-tight">{data.name}</h1>
              <p className="text-[13px] text-[#3F72AF] font-black uppercase tracking-wider">{data.role}</p>
            </div>
            
            <div className="flex flex-col gap-3 text-[11px] text-[#112D4E]/80 font-medium">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#3F72AF] shrink-0" />
                <span>{data.birthDate || "2000.01.01"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-[#3F72AF] shrink-0" />
                <span>{data.phone || "010-0000-0000"}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#3F72AF] shrink-0" />
                <span>{data.address || "서울특별시"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#3F72AF] shrink-0" />
                <span>{data.email || "email@example.com"}</span>
              </div>
              {data.github && (
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-[#3F72AF] shrink-0" />
                  <span className="break-words">{data.github}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#3F72AF] shrink-0" />
                <span>{data.militaryService || "군필"}</span>
              </div>
            </div>
          </div>

          {/* Tools */}
          {(() => {
            const hasTools = ['toolsDocs', 'toolsCollab', 'toolsDesign', 'toolsDev', 'toolsAi', 'usedTools', 'usedToolsBottom'].some(k => data[k] && data[k].length > 0);
            if (!hasTools) return null;
            return (
              <div className="py-10 border-t border-[#DBE2EF]/60 relative pdf-no-break">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] flex items-center gap-3 uppercase">
                    <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
                      <Wrench className="w-5 h-5" />
                    </div>
                    사용 TOOL
                  </h3>
                </div>
                <div className="flex flex-col gap-6 pl-1">
                  {(() => {
                    const cats = [
                      { id: 'toolsDocs', fallback: 'usedTools', label: '문서' },
                      { id: 'toolsCollab', fallback: 'usedToolsBottom', label: '협업' },
                      { id: 'toolsDesign', fallback: null, label: '디자인' },
                      { id: 'toolsDev', fallback: null, label: '개발' },
                      { id: 'toolsAi', fallback: null, label: 'AI' }
                    ].map(c => {
                      const listKey = (data[c.id] && data[c.id].length > 0) ? c.id : (c.fallback && data[c.fallback] && data[c.fallback].length > 0 ? c.fallback : c.id);
                      return { ...c, listKey, items: data[listKey] || [] };
                    }).filter(c => c.items.length > 0);

                    return cats.map((cat, index) => (
                      <div key={cat.id} className="flex flex-col gap-2.5">
                        <div className="text-[13.5px] font-black text-[#3F72AF] tracking-widest uppercase">{cat.label}</div>
                        <div className="flex flex-wrap gap-2">
                          {cat.items.map((tool: any, idx: number) => renderToolBadge(tool, cat.id, idx))}
                        </div>
                        {index < cats.length - 1 && <div className="h-px bg-[#DBE2EF]/50 w-full mt-2" />}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            );
          })()}

          {/* Activities */}
          {data.keyActivities && data.keyActivities.length > 0 && (
            <div className="py-10 border-t border-[#DBE2EF]/60 relative pdf-no-break">
              <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-3 uppercase">
                <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
                  <Star className="w-5 h-5" />
                </div>
                주요 활동
              </h3>
              <div className="space-y-6 pl-1">
                {data.keyActivities.map((act: any, idx: number) => (
                  <div key={idx} className="relative group/act">
                    <div className="text-[14px] font-bold text-[#112D4E] mb-1.5 leading-tight">{act.title}</div>
                    <div className="text-[12px] text-[#3F72AF] font-medium leading-[1.6]">
                      {act.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          <div className="py-10 border-t border-b border-[#DBE2EF]/60 relative pdf-no-break">
            <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-3 uppercase">
              <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              학력 및 교육
            </h3>
            <div className="space-y-7">
              {(data.education || []).map((edu: any, idx: number) => (
                <div key={idx} className="relative group/edu">
                  <div className="text-[14px] font-bold text-[#112D4E] mb-2 leading-tight">{edu.title}</div>
                  <div className="space-y-1.5 mt-2">
                    {(edu.details || []).map((detail: string, i: number) => (
                      <div key={i} className="group/item relative flex items-start gap-1.5 text-[12px] text-[#3F72AF] font-medium">
                        <span className="font-bold shrink-0 mt-[1px]">•</span>
                        <span className="flex-1">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Sidebar */}
          <div className="py-10 border-b border-[#DBE2EF]/60 relative pdf-no-break">
            <div className="flex flex-col mb-8">
              <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] flex items-center gap-3 uppercase">
                <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                경력 사항
              </h3>
            </div>
            <div className="relative before:absolute before:inset-y-2 before:left-[4.5px] before:w-[1.5px] before:bg-[#DBE2EF] space-y-8">
              {(data.leftExperience || []).map((exp: any, idx: number) => (
                <div key={idx} className="relative group/exp pl-6">
                  <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-[1.5px] border-[#3F72AF] bg-[#F9F7F7] z-10" />
                  <div className="text-[14px] font-bold text-[#112D4E] mb-2 leading-tight">{exp.title}</div>
                  <div className="space-y-1.5">
                    <div className="text-[12px] text-[#3F72AF] font-medium leading-[1.6] flex flex-col gap-1">
                      {(exp.details || []).map((d: string, i: number) => (
                        <div key={i} className="group/detail relative flex items-start gap-1.5">
                          <span className="font-bold shrink-0 mt-[1px]">•</span>
                          {d && d.startsWith('<')
                            ? <span className="flex-1 whitespace-pre-wrap text-[#3F72AF]" dangerouslySetInnerHTML={{ __html: d }} />
                            : <span className="flex-1 whitespace-pre-wrap">{d}</span>}
                        </div>
                      ))}
                    </div>
                    <div className="text-[12px] font-bold text-[#112D4E] whitespace-pre-wrap leading-[1.6] pt-1">{exp.period}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates (AWARDS) */}
          <div className="py-10 relative pdf-no-break">
            <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-3 uppercase">
              <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              자격 및 수상
            </h3>
            <div className="space-y-7 pl-1">
              {(data.awards || []).map((cert: any, idx: number) => (
                <div key={idx} className="relative group/cert">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[14px] text-[#112D4E] font-bold leading-tight">
                      {cert.title}
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#7A8A9E]">
                      <span>{cert.organization}</span>
                      <span className="w-1 h-1 rounded-full bg-[#DBE2EF]" />
                      <span>{cert.year ? `${cert.year}` : '연도'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Summary - Renamed to 한 줄 소개 */}
          <section className="pdf-no-break">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <User className="text-[#112D4E] w-6 h-6" /> 한 줄 소개
            </h3>
            <div className="text-[#112D4E] leading-relaxed font-medium" style={data.summaryStyle || {}}>
              {renderContent(data.summary || '')}
            </div>
          </section>

          {/* Projects */}
          <section className="space-y-10">
            <h3 className="text-xl font-black flex items-center gap-3 text-[#112D4E] tracking-tight">
              <div className="w-9 h-9 rounded-xl bg-[#112D4E]/10 flex items-center justify-center text-[#112D4E]">
                <Briefcase className="w-5 h-5" />
              </div>
              프로젝트 경험
            </h3>
            <div className="space-y-12">
              {(data.experience || []).map((exp: any, idx: number) => {
                const isReleased = exp.isReleased !== false && (exp.title?.includes('출시') || exp.metrics);
                return (
                  <div key={idx} className="relative pl-10 border-l-2 border-[#3F72AF] page-break-inside-avoid">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-[#3F72AF] bg-white z-10 ${
                      isReleased ? 'shadow-[0_0_15px_rgba(249,115,22,0.3)] border-orange-500' : ''
                    }`} />
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          {exp.icon && (
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-[#DBE2EF]/50 shrink-0">
                              <img src={exp.icon} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-black text-[21px] text-[#112D4E] tracking-tight shrink-0">{exp.title}</h4>
                              {isReleased && (
                                <div className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 bg-orange-50 text-orange-600 border-orange-200 shadow-[0_2px_10px_rgba(249,115,22,0.1)] whitespace-nowrap shrink-0">
                                  {exp.platformIcon && <img src={exp.platformIcon} alt="" className="w-3.5 h-3.5 object-contain shrink-0" />}
                                  <span>{exp.releasedText || 'Released'}</span>
                                </div>
                              )}
                            </div>
                            {exp.subtitle && (
                              <div className="pl-1 text-[13px] text-[#3F72AF] font-bold leading-tight -mt-1 mb-1">
                                {exp.subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-[13px] font-bold font-mono text-[#3F72AF]/80 whitespace-nowrap shrink-0">{exp.period}</span>
                      </div>

                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="flex gap-3 flex-wrap mb-2">
                          {exp.metrics.map((m: any, mi: number) => (
                            <div key={mi} className="bg-[#F9F7F7] border border-[#DBE2EF] rounded-2xl px-4 py-3 flex flex-col gap-0.5 min-w-[120px] shadow-sm">
                              <span className="text-[10px] font-extrabold text-[#3F72AF]/60 uppercase tracking-tighter">{m.label}</span>
                              <span className="text-[14.5px] font-black text-[#112D4E]">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-[14.5px] text-[#1A374D] font-medium leading-[1.8] tracking-tight markdown-body">
                        {renderContent(Array.isArray(exp.details) ? exp.details.join('\n') : exp.details)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Self Intro */}
          <section className="space-y-12 pt-10 border-t border-[#DBE2EF]/60">
            <h3 className="text-xl font-black text-[#112D4E] flex items-center gap-3 mb-8">
               <div className="w-9 h-9 rounded-xl bg-[#112D4E]/10 flex items-center justify-center text-[#112D4E]">
                <ScrollText className="w-5 h-5" />
              </div>
              자기소개
            </h3>
            <div className="space-y-16">
              {(data.selfIntroTabs || []).map((intro: any, idx: number) => {
                const segments = (intro.content || '').split('(시각화)');
                
                return (
                  <div key={idx} className="page-break-inside-avoid" style={{ zoom: 0.88 }}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-1.5 h-6 bg-[#3F72AF] rounded-full" />
                      <h4 className="text-xl font-black text-[#112D4E] tracking-tight flex-1">{intro.title}</h4>
                    </div>
                    
                    <div className="bg-white/40 rounded-[2rem] p-8 border border-[#DBE2EF]/50 shadow-sm">
                      {segments.map((seg: string, i: number) => {
                        const hasCards = !!(intro.vizBlocks && intro.vizBlocks[i] && intro.vizBlocks[i].length > 0);
                        const legacyCards = i === 0 && !hasCards && intro.cards && intro.cards.length > 0 ? intro.cards : null;
                        const cardsToRender = hasCards ? intro.vizBlocks[i] : legacyCards;

                        let cleanSeg = seg.trim();
                        cleanSeg = cleanSeg.replace(/<p>\s*$/i, '');
                        cleanSeg = cleanSeg.replace(/^\s*<\/p>/i, '');
                        cleanSeg = cleanSeg.replace(/^(<p>\s*<\/p>|<br\s*\/?>|\s)+/i, '').replace(/(<p>\s*<\/p>|<br\s*\/?>|\s)+$/i, '');

                        return (
                          <React.Fragment key={i}>
                            {cleanSeg.trim().length > 0 && (
                              <div className="text-[15px] leading-[1.8] font-semibold text-[#1A374D] markdown-body mb-6">
                                {renderContent(cleanSeg)}
                              </div>
                            )}
                            {i < segments.length - 1 && cardsToRender && (
                              <div className="my-6 overflow-hidden">
                                <div className="flex items-stretch min-w-0 flex-nowrap">
                                  {cardsToRender.map((card: any, cIdx: number) => (
                                    <React.Fragment key={card.id || cIdx}>
                                      <div
                                        className="bg-[#EEF4FF] border border-[#C8D9F5] rounded-2xl p-4 flex flex-col items-center text-center"
                                        style={{ flex: '1 1 0', minWidth: 0 }}
                                      >
                                        <p className="text-[14px] font-black text-[#112D4E] mb-1.5 leading-tight w-full text-center">
                                          {card.title}
                                        </p>
                                        <div className="w-8 h-[2px] bg-[#3F72AF]/30 rounded-full mb-3" />
                                        <p className="text-[12px] font-medium text-[#3D5A80] leading-[1.6] whitespace-pre-wrap w-full text-center">
                                          {card.description}
                                        </p>
                                      </div>
                                      {cIdx < cardsToRender.length - 1 && (
                                        <div className="flex items-center justify-center flex-shrink-0 self-center px-1">
                                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3.5 8H12.5M12.5 8L9 4.5M12.5 8L9 11.5" stroke="#3F72AF" strokeOpacity={0.65} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        </div>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      </div></td></tr></tbody></table>);};
