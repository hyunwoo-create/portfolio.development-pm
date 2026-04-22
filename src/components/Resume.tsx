import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  Upload, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Linkedin, 
  Github, 
  GraduationCap, 
  Briefcase, 
  Award, 
  User, 
  Plus,
  X,
  Trash2,
  Check,
  Link as LinkIcon,
  Smartphone,
  ScrollText,
  ShieldCheck
} from 'lucide-react';
import { EditableText } from './EditableText';
import { processImageHighQuality, getExternalEmbedUrl } from '../utils';
import { handlePdfExport } from '../utils/pdf-generator';
import { ResumeData, SelfIntroTab } from '../types';

interface ResumeProps {
  isEditing: boolean;
  data: ResumeData;
  setData: (d: ResumeData) => void;
}

export const Resume = ({ isEditing, data, setData }: ResumeProps) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const resumeImageInputRef = useRef<HTMLInputElement>(null);
  const [showRsLink, setShowRsLink] = useState(false);
  const [rsLinkValue, setRsLinkValue] = useState('');
  const [activeLinkEditor, setActiveLinkEditor] = useState<{type: string, idx?: number} | null>(null);
  const [linkInput, setLinkInput] = useState('');

  const handleResumeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageHighQuality(file).then(dataUrl => {
      setData({...data, resumeImage: dataUrl});
    }).catch(console.error);
  };

  const handleDownloadPdf = useCallback(() => {
    const originalTitle = document.title;
    document.title = `${data.name || '이력서'}_이력서`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  }, [data.name]);

  return (
    <motion.section 
      id="resume-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 px-6 max-w-5xl mx-auto print:pt-0 print:pb-0 print:max-w-none"
    >
      {isEditing && (
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-3 mb-12 print:hidden">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePdfExport(data)}
            className="px-6 py-3 bg-[#112D4E] text-white rounded-xl text-sm font-black flex items-center gap-2 hover:bg-[#0f1a2a] transition-all shadow-lg shadow-[#112D4E]/20"
          >
            <ScrollText className="w-4 h-4 text-white" /> 고품질 PDF 추출 (추천)
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadPdf}
            className="px-6 py-3 glass rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#112D4E]/5 transition-all text-[#112D4E]"
          >
            <Download className="w-4 h-4 text-[#112D4E]" /> 일반 인쇄
          </motion.button>
        </div>
      )}

      {/* PDF Target Area */}
      <div ref={resumeRef} className="pdf-resume-container" style={{ background: '#F9F7F7' }}>
        <div className="grid md:grid-cols-3 gap-12 print:grid-cols-3">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-12">
            <div className="text-center md:text-left pdf-no-break">
              <div className="w-[230px] h-[230px] rounded-3xl overflow-hidden mb-8 mx-auto md:mx-0 border border-[#3F72AF]/12 shadow-2xl shadow-[#112D4E]/10 relative group z-10">
                <img src={data.resumeImage || "https://picsum.photos/seed/profile/300/300"} alt="Profile" className="w-full h-full object-fill" />
                {isEditing && (
                  <div className="absolute bottom-4 right-4 pointer-events-auto group/rscontrols print:hidden z-30">
                    <div className="flex flex-col gap-2 opacity-0 group-hover/rscontrols:opacity-100 transition-opacity translate-y-2 group-hover/rscontrols:translate-y-0 duration-300 mb-2">
                      <button 
                        onClick={() => resumeImageInputRef.current?.click()} 
                        className="w-10 h-10 bg-white text-[#112D4E] rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-gray-100 transition-all"
                        title="파일 업로드"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowRsLink(true)} 
                        className="w-10 h-10 bg-[#3F72AF] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#1A59A7] transition-all"
                        title="링크 주소"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setData({...data, resumeImage: ""})} 
                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-red-600 transition-all"
                        title="이미지 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="w-10 h-10 bg-[#112D4E] rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white">
                      <Plus className="w-5 h-5 transition-transform group-hover/rscontrols:rotate-45" />
                    </button>
                  </div>
                )}
                {isEditing && showRsLink && (
                  <div className="absolute inset-0 bg-white/95 z-30 p-4 flex flex-col justify-center animate-in fade-in zoom-in duration-200">
                    <p className="text-[11px] font-black text-[#112D4E] mb-2">이미지 URL 입력</p>
                    <input 
                      type="text" 
                      value={rsLinkValue} 
                      onChange={(e) => setRsLinkValue(e.target.value)}
                      placeholder="https://..."
                      className="w-full border border-[#DBE2EF] rounded-lg px-3 py-2 text-[11px] mb-3 focus:outline-none focus:border-[#3F72AF]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const finalUrl = getExternalEmbedUrl(rsLinkValue);
                          if (finalUrl) setData({...data, resumeImage: finalUrl});
                          setRsLinkValue('');
                          setShowRsLink(false);
                        }} 
                        className="flex-1 bg-[#112D4E] text-white rounded-lg py-2 text-[10px] font-bold"
                      >
                        적용
                      </button>
                      <button 
                        onClick={() => {
                          setRsLinkValue('');
                          setShowRsLink(false);
                        }} 
                        className="flex-1 bg-[#DBE2EF] text-[#112D4E] rounded-lg py-2 text-[10px] font-bold"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={resumeImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleResumeImageUpload}
                />
              </div>
              <h1 className="text-3xl font-bold mb-2 ">
                <EditableText 
                  value={data.name} 
                  onSave={(v) => setData({...data, name: v})} 
                  isEditing={isEditing} 
                />
              </h1>
              <p className="text-[#112D4E] font-medium mb-6 ">
                <EditableText 
                  value={data.role} 
                  onSave={(v) => setData({...data, role: v})} 
                  isEditing={isEditing} 
                />
              </p>
              <div className="space-y-4 text-sm text-[#112D4E] ">
                <ContactInfo icon={<Calendar className="w-4 h-4" />} value={data.birthDate || "2000.01.01"} onSave={(v) => setData({...data, birthDate: v})} isEditing={isEditing} />
                <div className={isEditing ? 'block' : 'hidden print:block'}>
                  <ContactInfo icon={<Phone className="w-4 h-4" />} value={data.phone || "010-0000-0000"} onSave={(v) => setData({...data, phone: v})} isEditing={isEditing} />
                </div>
                <ContactInfo icon={<MapPin className="w-4 h-4" />} value={data.address || "서울특별시 OO구"} onSave={(v) => setData({...data, address: v})} isEditing={isEditing} />
                <ContactInfo icon={<Mail className="w-4 h-4" />} value={data.email || "email@example.com"} onSave={(v) => setData({...data, email: v})} isEditing={isEditing} />
                <ContactInfo icon={<Github className="w-4 h-4" />} value={data.github} onSave={(v) => setData({...data, github: v})} isEditing={isEditing} />
                <ContactInfo icon={<ShieldCheck className="w-4 h-4" />} value={data.militaryService || "군필 (육군 병장)"} onSave={(v) => setData({...data, militaryService: v})} isEditing={isEditing} />
              </div>
            </div>

            <div className="space-y-0">
              <EducationSection data={data} setData={setData} isEditing={isEditing} />
              <ExperienceSection data={data} setData={setData} isEditing={isEditing} />
              <CertificatesSection data={data} setData={setData} isEditing={isEditing} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-16">
            <SummarySection data={data} setData={setData} isEditing={isEditing} />
            <ProjectsSection 
              data={data} 
              setData={setData} 
              isEditing={isEditing} 
              activeLinkEditor={activeLinkEditor}
              setActiveLinkEditor={setActiveLinkEditor}
              linkInput={linkInput}
              setLinkInput={setLinkInput}
            />
            <SelfIntroInResume isEditing={isEditing} data={data} setData={setData} />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const ContactInfo = ({ icon, value, onSave, isEditing }: any) => {
  const isLink = value?.includes('github.com') || value?.includes('http') || value?.includes('@');
  const href = value?.includes('@') ? `mailto:${value}` : (value?.startsWith('http') ? value : `https://${value}`);

  return (
    <div className="flex items-center gap-3 justify-center md:justify-start">
      <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#0a1e36]">
        {icon}
      </div>
      <span className="flex-1">
        {!isEditing && isLink ? (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#112D4E] hover:text-[#3F72AF] hover:underline transition-colors"
          >
            <EditableText value={value} onSave={onSave} isEditing={isEditing} disableMarkdown={true} />
          </a>
        ) : (
          <EditableText value={value} onSave={onSave} isEditing={isEditing} disableMarkdown={true} />
        )}
      </span>
    </div>
  );
};

const EducationSection = ({ data, setData, isEditing }: any) => (
  <div className="py-10 border-t border-b border-[#DBE2EF]/60 relative pdf-no-break">
    <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-3 uppercase">
      <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
        <GraduationCap className="w-5 h-5" />
      </div>
      학력 및 교육
    </h3>
    <div className="space-y-7 pl-1">
      {(data.education || []).map((edu: any, idx: number) => (
        <div key={idx} className="relative group/edu">
          {isEditing && (
            <button type="button" onClick={() => { const n = [...(data.education || [])]; n.splice(idx,1); setData({...data, education: n}); }} className="absolute -left-6 top-1 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/edu:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
          )}
          <div className="text-[14.5px] font-extrabold text-[#112D4E] mb-2 leading-tight">
            <EditableText value={edu.title} onSave={(v)=>{const n=[...(data.education || [])]; n[idx].title=v; setData({...data, education: n});}} isEditing={isEditing} />
          </div>
          {(edu.details || []).length > 0 && (
            <ul className="space-y-1.5 mt-2">
              {edu.details.map((d: string, i: number) => (
                <li key={i} className="group/item relative flex items-start gap-2 text-[12px] text-[#3F72AF] font-bold">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#3F72AF]/50 flex-shrink-0" />
                  <span className="flex-1">
                    <EditableText value={d} onSave={(v)=>{const n=[...(data.education || [])]; n[idx].details[i]=v; setData({...data, education: n});}} isEditing={isEditing} />
                  </span>
                  {isEditing && <button type="button" onClick={()=>{const n=[...(data.education || [])]; n[idx].details.splice(i,1); setData({...data, education: n});}} className="opacity-0 group-hover/item:opacity-100 absolute -left-5 top-0 text-red-300 transition-opacity"><X className="w-2.5 h-2.5"/></button>}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {isEditing && <button type="button" onClick={()=>{const n=data.education?[...data.education]:[]; n.push({title:"새 학력", period:"", description:"", details:[]}); setData({...data, education: n});}} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4"><Plus className="w-3 h-3 inline mr-1"/> 항목 추가</button>}
    </div>
  </div>
);

const ExperienceSection = ({ data, setData, isEditing }: any) => (
  <div className="py-10 border-b border-[#DBE2EF]/60 relative pdf-no-break">
    <div className="flex items-center justify-between mb-8">
      <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] flex items-center gap-3 uppercase">
        <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
          <Briefcase className="w-5 h-5" />
        </div>
        경력 사항
      </h3>
    </div>
    <div className="space-y-10 pl-2 relative">
      <div className="absolute left-[3px] top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-[#3F72AF]/30 via-[#3F72AF]/10 to-transparent rounded-full" />
      {(data.leftExperience || []).map((exp: any, idx: number) => (
        <div key={idx} className="relative group/exp pl-8">
          <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#3F72AF] shadow-[0_0_0_4px_rgba(63,114,175,0.08)] z-10 transition-transform group-hover/exp:scale-110" />
          {isEditing && (
            <button type="button" onClick={() => { const n = [...(data.leftExperience || [])]; n.splice(idx,1); setData({...data, leftExperience: n}); }} className="absolute -left-6 top-0.5 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/exp:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
          )}
          <div className="text-[14.5px] font-extrabold text-[#112D4E] mb-2 leading-tight">
            <EditableText value={exp.title} onSave={(v)=>{const n=[...(data.leftExperience || [])]; n[idx].title=v; setData({...data, leftExperience: n});}} isEditing={isEditing} />
          </div>
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#3F72AF] uppercase tracking-wider">
              <EditableText 
                value={exp.period || ''} 
                onSave={(v) => {
                  const n = [...(data.leftExperience || [])];
                  n[idx].period = v;
                  setData({...data, leftExperience: n});
                }} 
                isEditing={isEditing} 
              />
            </div>
            <div className="text-[12.5px] text-[#1A374D] font-bold leading-[1.6]">
              <EditableText 
                value={(exp.details || []).filter((d: string) => d && d.trim() !== '').join('\n')} 
                multiline 
                onSave={(v) => {
                  const n = [...(data.leftExperience || [])];
                  n[idx].details = v.split('\n');
                  setData({...data, leftExperience: n});
                }} 
                isEditing={isEditing} 
                style={exp.style || {}}
                styleData={exp.style || {}}
                onStyleSave={(s) => {
                  const n = [...(data.leftExperience || [])];
                  n[idx].style = s;
                  setData({...data, leftExperience: n});
                }}
              />
            </div>
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={()=>{const n=data.leftExperience?[...data.leftExperience]:[]; n.push({title:"새 경력", period:"", description:"", details:[]}); setData({...data, leftExperience: n});}} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all ml-8 w-[calc(100%-2rem)]"><Plus className="w-3 h-3 inline mr-1"/> 항목 추가</button>}
    </div>
  </div>
);

const CertificatesSection = ({ data, setData, isEditing }: any) => (
  <div className="py-10 relative pdf-no-break">
    <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-2.5 uppercase">
      <div className="w-8 h-8 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF]">
        <Award className="w-4 h-4" />
      </div>
      자격 및 수상
    </h3>
    <div className="space-y-7 pl-1">
      {(data.awards || []).map((cert: any, idx: number) => (
        <div key={idx} className="relative group/cert">
          {isEditing && (
            <button type="button" onClick={() => { const n = [...(data.awards || [])]; n.splice(idx,1); setData({...data, awards: n}); }} className="absolute -left-6 top-1 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/cert:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
          )}
          <div className="flex flex-col gap-2">
            <div className="text-[14px] text-[#112D4E] font-extrabold leading-tight">
              <EditableText value={cert.title} onSave={(v)=>{const n=[...(data.awards || [])]; n[idx].title=v; setData({...data, awards: n});}} isEditing={isEditing} />
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="text-[#3F72AF]/80">
                <EditableText value={cert.organization} onSave={(v)=>{const n=[...(data.awards || [])]; n[idx].organization=v; setData({...data, awards: n});}} isEditing={isEditing} />
              </span>
              <span className="w-1 h-1 rounded-full bg-[#DBE2EF]" />
              <span className="text-[#3F72AF]/60 font-mono">
                <EditableText value={cert.year ? `${cert.year}` : '연도'} onSave={(v)=>{const n=[...(data.awards || [])]; n[idx].year=v.replace(/[()]/g,''); setData({...data, awards: n});}} isEditing={isEditing} />
              </span>
            </div>
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={()=>{const c = data.awards || []; const n=[...c, {title:"새 자격증", organization:"기관", year:"연도"}]; setData({...data, awards: n});}} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4"><Plus className="w-3 h-3 inline mr-1"/> 자격/수상 추가</button>}
    </div>
  </div>
);

const SummarySection = ({ data, setData, isEditing }: any) => (
  <section className="pdf-no-break">
    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 ">
      <User className="text-[#112D4E] w-6 h-6" /> 한 줄 소개
    </h3>
    <p className="text-[#112D4E] leading-relaxed font-medium">
      <EditableText 
        value={data.summary} 
        onSave={(v) => setData({...data, summary: v})} 
        isEditing={isEditing} 
        multiline
        style={data.summaryStyle || {}}
        styleData={data.summaryStyle || {}}
        onStyleSave={(s) => setData({...data, summaryStyle: s})}
      />
    </p>
  </section>
);

const ProjectsSection = ({ 
  data, 
  setData, 
  isEditing, 
  activeLinkEditor, 
  setActiveLinkEditor, 
  linkInput, 
  setLinkInput 
}: any) => (
  <section className="pdf-no-break">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xl font-black flex items-center gap-3 text-[#112D4E] tracking-tight">
        <div className="w-9 h-9 rounded-xl bg-[#112D4E]/10 flex items-center justify-center text-[#112D4E]">
          <Briefcase className="w-5 h-5" />
        </div>
        프로젝트 경험
      </h3>
      {isEditing && (
        <button 
          onClick={() => {
            const newExp = [...(data.experience || [])];
            newExp.push({ title: "새 프로젝트", period: "기간", description: "설명", details: [], isReleased: true, metrics: [
              { label: "사용자", value: "0" },
              { label: "좋아요", value: "0" },
              { label: "성과", value: "설명" }
            ] });
            setData({...data, experience: newExp});
          }}
          className="px-4 py-2 bg-[#112D4E] text-white rounded-xl hover:bg-[#0f1a2a] transition-all flex items-center gap-2 text-xs font-extrabold shadow-sm"
        >
          <Plus className="w-4 h-4" /> 프로젝트 추가
        </button>
      )}
    </div>
    <div className="space-y-12">
      {(data.experience || []).map((exp: any, idx: number) => {
        const isReleased = exp.isReleased !== false && (exp.title?.includes('출시') || exp.metrics);
        
        return (
          <div key={idx} className={`relative pl-10 border-l-2 border-[#3F72AF] transition-all group/exp`}>
            {/* Timeline Dot */}
            <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-[#3F72AF] bg-white z-10 ${
              isReleased ? 'shadow-[0_0_15px_rgba(249,115,22,0.3)] border-orange-500' : ''
            }`} />
            
            {isEditing && (
              <button 
                onClick={() => {
                  const newExp = [...(data.experience || [])];
                  newExp.splice(idx, 1);
                  setData({...data, experience: newExp});
                }}
                className="absolute -left-10 top-0 p-1 text-red-300 hover:text-red-500 opacity-0 group-hover/exp:opacity-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  {/* Project Icon */}
                  <div className="relative group/icon shrink-0">
                    {exp.icon ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-[#DBE2EF]/50 relative group/icon">
                        <img src={exp.icon} alt={exp.title} className="w-full h-full object-cover" />
                        {isEditing && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/icon:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                            <button onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) processImageHighQuality(file).then(d => {
                                  const n = [...(data.experience || [])];
                                  n[idx].icon = d;
                                  setData({...data, experience: n});
                                });
                              };
                              input.click();
                            }} className="w-full py-1 bg-white text-[8px] font-bold rounded-md">파일</button>
                            <button onClick={() => {
                              setActiveLinkEditor({type: 'projIcon', idx});
                              setLinkInput(exp.icon || '');
                            }} className="w-full py-1 bg-[#3F72AF] text-white text-[8px] font-bold rounded-md">링크</button>
                            <button onClick={() => {
                              const n = [...(data.experience || [])];
                              n[idx].icon = null;
                              setData({...data, experience: n});
                            }} className="w-full py-1 bg-red-500 text-white text-[8px] font-bold rounded-md">삭제</button>
                          </div>
                        )}
                        {isEditing && activeLinkEditor?.type === 'projIcon' && activeLinkEditor?.idx === idx && (
                          <div className="absolute inset-0 bg-white/95 z-30 p-2 flex flex-col justify-center gap-2">
                            <input type="text" value={linkInput} onChange={e => setLinkInput(e.target.value)} placeholder="URL" className="w-full border border-[#DBE2EF] rounded px-2 py-1 text-[8px]" autoFocus />
                            <div className="flex gap-1">
                              <button onClick={() => {
                                const finalUrl = getExternalEmbedUrl(linkInput);
                                const n = [...(data.experience || [])];
                                n[idx].icon = finalUrl;
                                setData({...data, experience: n});
                                setActiveLinkEditor(null);
                              }} className="flex-1 bg-[#112D4E] text-white rounded py-1 text-[8px]">적용</button>
                              <button onClick={() => setActiveLinkEditor(null)} className="flex-1 bg-[#DBE2EF] text-[#112D4E] rounded py-1 text-[8px]">취소</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      isEditing && (
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) processImageHighQuality(file).then(d => {
                                  const n = [...(data.experience || [])];
                                  n[idx].icon = d;
                                  setData({...data, experience: n});
                                });
                              };
                              input.click();
                            }}
                            className="w-12 h-6 rounded-md border border-dashed border-[#DBE2EF] flex items-center justify-center text-[8px] text-[#3F72AF] hover:border-[#3F72AF] transition-all"
                          >
                            파일
                          </button>
                          <button 
                            onClick={() => {
                              setActiveLinkEditor({type: 'projIcon', idx});
                              setLinkInput('');
                            }}
                            className="w-12 h-6 rounded-md border border-dashed border-[#3F72AF] flex items-center justify-center text-[8px] text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all"
                          >
                            링크
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-[21px] text-[#112D4E] tracking-tight">
                        <EditableText 
                          value={(exp.title || "").trim()} 
                          onSave={(v) => {
                            const newExp = [...(data.experience || [])];
                            newExp[idx].title = v;
                            setData({...data, experience: newExp});
                          }} 
                          isEditing={isEditing} 
                        />
                      </h4>
                      {(isReleased || isEditing) && (
                        <div className="flex items-center gap-1">
                          <div
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-1.5 ${
                              isReleased 
                                ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-[0_2px_10px_rgba(249,115,22,0.1)]' 
                                : 'bg-gray-50 text-gray-400 border-gray-200 opacity-50 hover:opacity-100'
                            }`}
                          >
                            {isEditing && (
                              <button
                                onClick={() => {
                                  const newExp = [...(data.experience || [])];
                                  newExp[idx].isReleased = !isReleased;
                                  setData({...data, experience: newExp});
                                }}
                                className={`w-2 h-2 rounded-full transition-colors ${isReleased ? 'bg-orange-500' : 'bg-gray-300'}`}
                                title="출시 상태 토글"
                              />
                            )}
                            
                            {/* Platform Icon Section */}
                            <div className="relative group/picon flex-shrink-0">
                              {exp.platformIcon ? (
                                <div className="w-3.5 h-3.5 rounded-sm overflow-hidden flex items-center justify-center relative group/picon-active">
                                  <img src={exp.platformIcon} alt="platform" className="w-full h-full object-contain" />
                                  {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/picon-active:opacity-100 flex flex-col items-center justify-center gap-0.5 z-20">
                                      <button onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveLinkEditor({type: 'platIcon', idx});
                                        setLinkInput(exp.platformIcon || '');
                                      }} className="text-[5px] bg-white rounded px-0.5">L</button>
                                      <button onClick={(e) => {
                                        e.stopPropagation();
                                        const n = [...(data.experience || [])];
                                        n[idx].platformIcon = null;
                                        setData({...data, experience: n});
                                      }} className="text-[5px] bg-red-500 text-white rounded px-0.5">X</button>
                                    </div>
                                  )}
                                  {isEditing && activeLinkEditor?.type === 'platIcon' && activeLinkEditor?.idx === idx && (
                                    <div className="absolute left-0 top-0 bg-white border border-[#DBE2EF] rounded shadow-xl p-1 z-30 min-w-[80px]">
                                      <input type="text" value={linkInput} onChange={e => setLinkInput(e.target.value)} placeholder="URL" className="w-full text-[6px] border rounded mb-1" autoFocus />
                                      <div className="flex gap-1">
                                        <button onClick={() => {
                                          const finalUrl = getExternalEmbedUrl(linkInput);
                                          const n = [...(data.experience || [])];
                                          n[idx].platformIcon = finalUrl;
                                          setData({...data, experience: n});
                                          setActiveLinkEditor(null);
                                        }} className="flex-1 bg-[#112D4E] text-white text-[6px] rounded">Ok</button>
                                        <button onClick={() => setActiveLinkEditor(null)} className="flex-1 bg-gray-200 text-[6px] rounded">C</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                isEditing && (
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (ev: any) => {
                                          const file = ev.target.files?.[0];
                                          if (file) processImageHighQuality(file).then(d => {
                                            const n = [...(data.experience || [])];
                                            n[idx].platformIcon = d;
                                            setData({...data, experience: n});
                                          });
                                        };
                                        input.click();
                                      }}
                                      className="w-3 h-3 border border-dashed border-gray-300 rounded-sm flex items-center justify-center text-[6px]"
                                      title="파일"
                                    >F</button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveLinkEditor({type: 'platIcon', idx});
                                        setLinkInput('');
                                      }}
                                      className="w-3 h-3 border border-dashed border-blue-300 rounded-sm flex items-center justify-center text-[6px]"
                                      title="링크"
                                    >L</button>
                                  </div>
                                )
                              )}
                            </div>
                            <span className={isEditing ? 'cursor-text' : ''}>
                              <EditableText 
                                value={exp.releasedText || (isReleased ? 'Released' : 'Set Released')} 
                                onSave={(v) => {
                                  const newExp = [...(data.experience || [])];
                                  newExp[idx].releasedText = v;
                                  setData({...data, experience: newExp});
                                }} 
                                isEditing={isEditing} 
                                disableMarkdown={true}
                              />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* New Indented Subtitle Field */}
                    <div className="pl-1 text-[13px] text-[#3F72AF] font-bold leading-tight -mt-1 mb-1">
                      <EditableText 
                        value={exp.subtitle || (isEditing ? "프로젝트 부제목 또는 한 줄 설명" : "")} 
                        onSave={(v) => {
                          const newExp = [...(data.experience || [])];
                          newExp[idx].subtitle = v;
                          setData({...data, experience: newExp});
                        }} 
                        isEditing={isEditing} 
                        disableMarkdown={true}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-[13px] font-bold font-mono text-[#3F72AF]/80">
                  <EditableText 
                    value={(exp.period || "").trim()} 
                    onSave={(v) => {
                      const newExp = [...(data.experience || [])];
                      newExp[idx].period = v;
                      setData({...data, experience: newExp});
                    }} 
                    isEditing={isEditing} 
                  />
                </span>
              </div>

              {/* Metrics Badge Row — 지표가 있으면 released 여부와 무관하게 표시 */}
              {((exp.metrics && exp.metrics.length > 0) || isEditing) && (
                <div className="flex gap-3 flex-wrap mb-2">
                  {(exp.metrics || []).map((m: any, i: number) => (
                    <div key={i} className="group/metric relative bg-[#F9F7F7] border border-[#DBE2EF] rounded-2xl px-4 py-3 flex flex-col gap-0.5 min-w-[120px] shadow-sm hover:shadow-md transition-all">
                      {isEditing && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newExp = [...(data.experience || [])];
                            newExp[idx].metrics.splice(i, 1);
                            setData({...data, experience: newExp});
                          }}
                          className="absolute -right-2 -top-2 bg-white border border-red-200 text-red-500 rounded-full p-0.5 opacity-0 group-hover/metric:opacity-100 shadow-sm transition-all z-20"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                      <span className="text-[10px] font-extrabold text-[#3F72AF]/60 uppercase tracking-tighter">
                        <EditableText 
                          value={m.label} 
                          onSave={(v) => {
                            const newExp = [...(data.experience || [])];
                            newExp[idx].metrics[i].label = v;
                            setData({...data, experience: newExp});
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                      <span className="text-[14.5px] font-black text-[#112D4E]">
                        <EditableText 
                          value={m.value} 
                          onSave={(v) => {
                            const newExp = [...(data.experience || [])];
                            newExp[idx].metrics[i].value = v;
                            setData({...data, experience: newExp});
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                    </div>
                  ))}
                  {isEditing && (
                    <button 
                      onClick={() => {
                        const newExp = [...(data.experience || [])];
                        if(!newExp[idx].metrics) newExp[idx].metrics = [];
                        newExp[idx].metrics.push({ label: "신규 지표", value: "데이터" });
                        setData({...data, experience: newExp});
                      }}
                      className="border-2 border-dashed border-[#3F72AF]/20 rounded-2xl px-4 py-3 flex flex-col items-center justify-center min-w-[120px] text-[#3F72AF]/40 hover:text-[#3F72AF] hover:border-[#3F72AF]/50 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-[10px] font-bold mt-1">지표 추가</span>
                    </button>
                  )}
                </div>
              )}

              <div className="text-[14.5px] text-[#1A374D] font-medium leading-[1.8] tracking-tight markdown-body">
                <EditableText 
                  value={(exp.details || []).filter((d: string) => d && d.trim() !== '').join('\n')} 
                  multiline
                  onSave={(v) => {
                    const newExp = [...(data.experience || [])];
                    newExp[idx].details = v.split('\n');
                    setData({...data, experience: newExp});
                  }} 
                  isEditing={isEditing} 
                  style={exp.style || {}}
                  styleData={exp.style || {}}
                  onStyleSave={(s) => {
                    const newExp = [...(data.experience || [])];
                    newExp[idx].style = s;
                    setData({...data, experience: newExp});
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

const SelfIntroInResume = ({ isEditing, data, setData }: { isEditing: boolean, data: ResumeData, setData: (d: ResumeData) => void }) => {
  const [activeIntroTab, setActiveIntroTab] = useState<string>(
    data.selfIntroTabs?.[0]?.id || 'intro-1'
  );
  const [editingIntroTabId, setEditingIntroTabId] = useState<string | null>(null);
  
  const selfIntroTabs: SelfIntroTab[] = data.selfIntroTabs || [
    { id: 'intro-1', title: '성장 과정 및 가치관', content: data.selfIntroduction || '' }
  ];

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isManualScrolling = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const options = {
      root: container,
      rootMargin: '-10% 0px -80% 0px',
      threshold: [0, 0.1]
    };

    const observer = new IntersectionObserver((entries) => {
      if (isManualScrolling.current) return;
      const intersectingEntry = entries.find(entry => entry.isIntersecting);
      if (intersectingEntry) {
        const newTabId = intersectingEntry.target.id.replace('section-', '');
        setActiveIntroTab(prev => (prev !== newTabId ? newTabId : prev));
      }
    }, options);

    selfIntroTabs.forEach(tab => {
      const el = document.getElementById(`section-${tab.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selfIntroTabs]);

  const scrollToTab = (tabId: string) => {
    isManualScrolling.current = true;
    setActiveIntroTab(tabId);
    const container = scrollContainerRef.current;
    const element = document.getElementById(`section-${tabId}`);
    if (container && element) {
      container.scrollTo({ top: element.offsetTop - 14, behavior: 'smooth' });
    }
    setTimeout(() => { isManualScrolling.current = false; }, 800);
  };

  return (
    <section className="mt-4 relative scroll-mt-24">
      <div className="flex items-center justify-between mb-8 pdf-no-break">
        <h3 className="text-xl font-black flex items-center gap-3 text-[#112D4E]">
          <ScrollText className="w-6 h-6" /> 자기소개서
        </h3>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap print:hidden sticky top-0 z-20 py-2 bg-[#F9F7F7]/95 backdrop-blur-sm -mx-2 px-2 border-b border-transparent hover:border-[#3F72AF]/10 transition-all">
        {selfIntroTabs.map((tab) => (
          <div key={tab.id} className="relative flex items-center">
            {isEditing && editingIntroTabId === tab.id ? (
              <input
                type="text"
                className="px-4 py-2 bg-[#DBE2EF]/60 border border-[#112D4E] rounded-xl text-sm font-bold text-[#1A59A7] focus:outline-none min-w-[80px]"
                value={tab.title}
                autoFocus
                onChange={(e) => {
                  const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, title: e.target.value } : t);
                  setData({...data, selfIntroTabs: newTabs});
                }}
                onBlur={() => setEditingIntroTabId(null)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingIntroTabId(null); }}
              />
            ) : (
              <button
                onClick={() => scrollToTab(tab.id)}
                onDoubleClick={() => isEditing && setEditingIntroTabId(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeIntroTab === tab.id ? 'bg-[#112D4E] text-white shadow-lg' : 'bg-[#DBE2EF]/40 text-[#112D4E] hover:bg-[#DBE2EF]'
                }`}
              >
                {tab.title}
              </button>
            )}
            {isEditing && selfIntroTabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newTabs = selfIntroTabs.filter(t => t.id !== tab.id);
                  setData({...data, selfIntroTabs: newTabs});
                  if (activeIntroTab === tab.id && newTabs.length > 0) setActiveIntroTab(newTabs[0].id);
                }}
                className="ml-1 p-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="탭 삭제"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <button
            onClick={() => {
              const newTab: SelfIntroTab = { id: `intro-${Date.now()}`, title: '새 항목', content: '내용을 입력하세요.' };
              const newTabs = [...selfIntroTabs, newTab];
              setData({...data, selfIntroTabs: newTabs});
              setActiveIntroTab(newTab.id);
            }}
            className="px-3 py-2 border-2 border-dashed border-[#3F72AF]/20 rounded-xl text-sm font-bold text-[#0a1e36] hover:text-[#112D4E] hover:border-[#112D4E]/50 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> 탭 추가
          </button>
        )}
      </div>

      <div ref={scrollContainerRef} className="relative space-y-12 md:space-y-16 lg:max-h-[800px] lg:overflow-y-auto lg:custom-scrollbar lg:pr-6 print:max-h-none print:overflow-visible print:space-y-20">
        {selfIntroTabs.map((tab) => (
          <div key={tab.id} id={`section-${tab.id}`} className="transition-all duration-700 opacity-100 scroll-mt-14">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1.5 h-6 bg-[#3F72AF] rounded-full"></div>
              <h4 className="text-xl font-black text-[#112D4E] tracking-tight">{tab.title}</h4>
            </div>
            <div className="bg-white/40 rounded-[2rem] p-8 border border-[#DBE2EF]/50 shadow-sm pdf-no-break">
              <EditableText
                value={tab.content}
                onSave={(v) => {
                  const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, content: v } : t);
                  setData({...data, selfIntroTabs: newTabs});
                }}
                isEditing={isEditing}
                multiline
                className="text-[15px] leading-[1.8] font-semibold text-[#1A374D] markdown-body"
                style={tab.style || {}}
                styleData={tab.style || {}}
                onStyleSave={(s) => {
                  const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, style: s } : t);
                  setData({...data, selfIntroTabs: newTabs});
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
