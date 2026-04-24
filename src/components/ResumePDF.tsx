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
  ScrollText
} from 'lucide-react';
import { ResumeData } from '../types';

interface ResumePDFProps {
  data: ResumeData;
}

// Helper to render icons as SVG strings if needed, but since we are using lucide-react, 
// they should render fine as long as styles are copied.
// NOTE: We don't use Framer Motion here as per safety rules.

export const ResumePDF = ({ data }: ResumePDFProps) => {
  return (
    <div className="p-[20mm] bg-[#F9F7F7] text-[#112D4E] font-sans leading-relaxed" style={{ width: '210mm' }}>
      <div className="grid grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="col-span-1 space-y-12">
          {/* Profile Section */}
          <div className="text-left">
            <div className="w-[180px] h-[180px] rounded-3xl overflow-hidden mb-8 border border-[#3F72AF]/12 shadow-sm">
              <img src={data.resumeImage || "https://picsum.photos/seed/profile/300/300"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-black mb-1 text-[#112D4E] tracking-tight">{data.name}</h1>
            <p className="text-[#3F72AF] font-bold text-base mb-6 uppercase tracking-wider">{data.role}</p>
            
            <div className="space-y-4 text-[12px] text-[#112D4E]/80">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#3F72AF]" />
                <span className="font-bold">{data.birthDate || "2000.01.01"}</span>
              </div>
              {/* Phone Field Added for PDF */}
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-[#3F72AF]" />
                <span className="font-bold">{data.phone || "010-0000-0000"}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#3F72AF]" />
                <span className="font-bold">{data.address || "서울특별시"}</span>
              </div>
              {/* Email Field Added for PDF */}
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#3F72AF]" />
                <span className="font-bold">{data.email || "email@example.com"}</span>
              </div>
              {data.github && (
                <div className="flex items-center gap-3 text-wrap break-all">
                  <Github className="w-4 h-4 text-[#3F72AF] shrink-0" />
                  <span className="font-bold">{data.github}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#3F72AF]" />
                <span className="font-bold">{data.militaryService || "군필"}</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-6 pt-10 border-t border-[#DBE2EF]/60">
            <h3 className="font-black text-[#112D4E] text-[11px] tracking-[0.2em] uppercase flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#3F72AF]" />
              Education
            </h3>
            <div className="space-y-6">
              {(data.education || []).map((edu: any, idx: number) => (
                <div key={idx}>
                  <p className="text-[14px] font-black text-[#112D4E] mb-1">{edu.title}</p>
                  <p className="text-[11px] text-[#3F72AF] font-bold mb-2">{edu.period}</p>
                  <ul className="space-y-1">
                    {(edu.details || []).map((d: string, i: number) => (
                      <li key={i} className="text-[11px] text-[#112D4E]/70 font-bold flex items-start gap-1.5">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#3F72AF]/40 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Sidebar - Badge Removed */}
          <div className="space-y-6 pt-10 border-t border-[#DBE2EF]/60">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[#112D4E] text-[11px] tracking-[0.2em] uppercase flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#3F72AF]" />
                Experience
              </h3>
            </div>
            <div className="space-y-8">
              {(data.leftExperience || []).map((exp: any, idx: number) => (
                <div key={idx} className="relative pl-4 border-l-2 border-[#3F72AF]/20">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-white border border-[#3F72AF]" />
                  <p className="text-[13px] font-black text-[#112D4E] mb-1">{exp.title}</p>
                  <p className="text-[11px] text-[#3F72AF] font-bold mb-2 uppercase">{exp.period}</p>
                  <div className="text-[11px] text-[#112D4E]/60 font-bold leading-relaxed">
                    {Array.isArray(exp.details) ? exp.details.join('\n') : exp.details}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates (AWARDS) */}
          <div className="space-y-6 pt-10 border-t border-[#DBE2EF]/60">
            <h3 className="font-black text-[#112D4E] text-[11px] tracking-[0.2em] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3F72AF]" />
              Certificates
            </h3>
            <div className="space-y-6">
              {(data.awards || []).map((cert: any, idx: number) => (
                <div key={idx}>
                  <p className="text-[13px] font-black text-[#112D4E] mb-1">{cert.title}</p>
                  <p className="text-[11px] text-[#3F72AF] font-bold">{cert.organization} · {cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-2 space-y-16">
          {/* Summary - Renamed to 한 줄 소개 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#112D4E]/10 flex items-center justify-center text-[#112D4E]">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-[#112D4E]">한 줄 소개</h3>
            </div>
            <div className="text-[15px] font-bold text-[#112D4E] leading-loose markdown-body">
              {data.summary?.startsWith('<') ? (
                <div dangerouslySetInnerHTML={{ __html: data.summary }} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {data.summary || ""}
                </ReactMarkdown>
              )}
            </div>
          </section>

          {/* Projects */}
          <section className="space-y-10">
            <h3 className="text-xl font-black flex items-center gap-3 text-[#112D4E]">
              <div className="w-9 h-9 rounded-xl bg-[#112D4E]/10 flex items-center justify-center text-[#112D4E]">
                <Briefcase className="w-5 h-5" />
              </div>
              프로젝트 경험
            </h3>
            <div className="space-y-12">
              {(data.experience || []).map((exp: any, idx: number) => {
                const isReleased = exp.isReleased;
                return (
                  <div key={idx} className="relative pl-8 border-l-2 border-[#3F72AF] page-break-inside-avoid">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 bg-white z-10 ${
                      isReleased ? 'border-orange-500' : 'border-[#3F72AF]'
                    }`} />
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          {exp.icon && (
                            <img src={exp.icon} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm border border-[#DBE2EF]" />
                          )}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-black text-[20px] text-[#112D4E] tracking-tight">{exp.title}</h4>
                              {isReleased && (
                                <div className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-black rounded border border-orange-100 uppercase tracking-widest flex items-center gap-1">
                                  {exp.platformIcon && <img src={exp.platformIcon} alt="" className="w-3 h-3 object-contain" />}
                                  {exp.releasedText || 'Released'}
                                </div>
                              )}
                            </div>
                            {/* Subtitle Added for PDF */}
                            {exp.subtitle && (
                              <p className="text-[12px] text-[#3F72AF] font-bold leading-tight -mt-0.5">{exp.subtitle}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] font-black text-[#3F72AF] font-mono italic">{exp.period}</span>
                      </div>

                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {exp.metrics.map((m: any, mi: number) => (
                            <div key={mi} className="bg-[#F9F7F7] border border-[#DBE2EF] rounded-xl px-4 py-2 flex flex-col min-w-[90px]">
                              <span className="text-[9px] font-black text-[#3F72AF]/60 uppercase tracking-tighter">{m.label}</span>
                              <span className="text-[13px] font-black text-[#112D4E]">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-[14px] text-[#1A374D] font-bold leading-relaxed markdown-body">
                        {(() => {
                          const content = Array.isArray(exp.details) ? exp.details.join('\n') : exp.details;
                          if (content?.startsWith('<')) {
                            return <div dangerouslySetInnerHTML={{ __html: content }} />;
                          }
                          return (
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                              {content}
                            </ReactMarkdown>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Self Intro */}
          <section className="space-y-10 pt-10 border-t border-[#DBE2EF]/60">
            <h3 className="text-xl font-black text-[#112D4E] flex items-center gap-3">
               <div className="w-9 h-9 rounded-xl bg-[#112D4E]/10 flex items-center justify-center text-[#112D4E]">
                <ScrollText className="w-5 h-5" />
              </div>
              자기소개
            </h3>
            <div className="space-y-12">
              {(data.selfIntroTabs || []).map((intro: any, idx: number) => {
                // 웹 UI와 동일하게 정확히 '(시각화)' 텍스트로 분할
                const segments = (intro.content || '').split('(시각화)');
                
                return (
                  <div key={idx} className="page-break-inside-avoid">
                    <h4 className="text-[16px] font-black text-[#3F72AF] mb-4 flex items-center gap-2">
                      <span className="w-2 h-4 bg-[#3F72AF] rounded-sm" />
                      {intro.title}
                    </h4>
                    <div className="text-[14px] text-[#112D4E] font-medium leading-loose markdown-body pl-4">
                      {segments.map((seg: string, i: number) => {
                        const hasCards = !!(intro.vizBlocks && intro.vizBlocks[i] && intro.vizBlocks[i].length > 0);
                        const legacyCards = i === 0 && !hasCards && intro.cards && intro.cards.length > 0 ? intro.cards : null;
                        const cardsToRender = hasCards ? intro.vizBlocks[i] : legacyCards;

                        // 단순 문자열 분할로 인해 발생한 깨진 <p>, </p> 태그 정리
                        let cleanSeg = seg.trim();
                        // 끝에 남은 열린 <p> 태그 제거
                        cleanSeg = cleanSeg.replace(/<p>\s*$/i, '');
                        // 시작에 남은 닫힌 </p> 태그 제거
                        cleanSeg = cleanSeg.replace(/^\s*<\/p>/i, '');
                        // 빈 p태그나 불필요한 줄바꿈 태그 정리
                        cleanSeg = cleanSeg.replace(/^(<p>\s*<\/p>|<br\s*\/?>|\s)+/i, '').replace(/(<p>\s*<\/p>|<br\s*\/?>|\s)+$/i, '');

                        return (
                          <React.Fragment key={i}>
                            {cleanSeg.trim().length > 0 && (
                              cleanSeg.startsWith('<') ? (
                                <div dangerouslySetInnerHTML={{ __html: cleanSeg }} />
                              ) : (
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                  {cleanSeg}
                                </ReactMarkdown>
                              )
                            )}
                            {i < segments.length - 1 && cardsToRender && (
                              <div className="my-6 flex items-stretch gap-2 flex-nowrap w-full overflow-hidden page-break-inside-avoid">
                                {cardsToRender.map((card: any, cIdx: number) => (
                                  <React.Fragment key={card.id || cIdx}>
                                    <div
                                      className="flex-1 flex flex-col items-center text-center bg-[#EEF4FF] border border-[#C8D9F5] rounded-xl p-4"
                                      style={{ minWidth: 0 }}
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
                                      <div className="flex items-center justify-center flex-shrink-0 px-1">
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                          <path d="M3.5 8H12.5M12.5 8L9 4.5M12.5 8L9 11.5" stroke="#3F72AF" strokeOpacity={0.65} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      </div>
                                    )}
                                  </React.Fragment>
                                ))}
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
    </div>
  );
};
