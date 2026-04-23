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
import { ProjectsSection } from './ResumeProjects';
import { SelfIntroInResume } from './ResumeSelfIntro';

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
              <h1 className="text-3xl font-bold mb-2">
                <EditableText 
                  value={data.name} 
                  onSave={(v) => setData({...data, name: v})} 
                  isEditing={isEditing} 
                  style={data.nameStyle || {}}
                  styleData={data.nameStyle || {}}
                  onStyleSave={(s) => setData({...data, nameStyle: s})}
                />
              </h1>
              <p className="text-[#112D4E] font-medium mb-6">
                <EditableText 
                  value={data.role} 
                  onSave={(v) => setData({...data, role: v})} 
                  isEditing={isEditing} 
                  style={data.roleStyle || {}}
                  styleData={data.roleStyle || {}}
                  onStyleSave={(s) => setData({...data, roleStyle: s})}
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
          <div className="text-[14px] font-bold text-[#112D4E] mb-2 leading-tight">
            <EditableText value={edu.title} onSave={(v)=>{const n=[...(data.education || [])]; n[idx].title=v; setData({...data, education: n});}} isEditing={isEditing} />
          </div>
          {(edu.details || []).length > 0 && (
            <ul className="space-y-1.5 mt-2">
              {edu.details.map((d: string, i: number) => (
                <li key={i} className="group/item relative flex items-start gap-2 text-[12px] text-[#3F72AF] font-medium">
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
    <div className="flex flex-col mb-8">
      <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] flex items-center gap-3 uppercase mb-2">
        <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
          <Briefcase className="w-5 h-5" />
        </div>
        경력 사항
      </h3>
      <div className="text-[12px] font-bold text-[#E05A5A] pl-12">
        <EditableText 
          value={data.totalExperience || '총 경력 6년'} 
          onSave={(v) => setData({...data, totalExperience: v})} 
          isEditing={isEditing} 
        />
      </div>
    </div>
    <div className="space-y-8 pl-1 relative">
      {(data.leftExperience || []).map((exp: any, idx: number) => (
        <div key={idx} className="relative group/exp">
          {isEditing && (
            <button type="button" onClick={() => { const n = [...(data.leftExperience || [])]; n.splice(idx,1); setData({...data, leftExperience: n}); }} className="absolute -left-6 top-0.5 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/exp:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
          )}
          <div className="text-[14px] font-bold text-[#112D4E] mb-2 leading-tight">
            <EditableText value={exp.title} onSave={(v)=>{const n=[...(data.leftExperience || [])]; n[idx].title=v; setData({...data, leftExperience: n});}} isEditing={isEditing} />
          </div>
          <div className="border-l border-[#DBE2EF] pl-3 ml-1 py-0.5 space-y-1.5">
            <div className="text-[12px] text-[#7A8A9E] font-medium leading-[1.6] whitespace-pre-wrap">
              <EditableText 
                value={(exp.details || []).filter((d: string) => d && d.trim() !== '').join('\n')} 
                multiline 
                onSave={(v) => {
                  const n = [...(data.leftExperience || [])];
                  n[idx].details = v.split('\n');
                  setData({...data, leftExperience: n});
                }} 
                isEditing={isEditing} 
              />
            </div>
            <div className="text-[12px] font-bold text-[#112D4E] whitespace-pre-wrap leading-[1.6]">
              <EditableText 
                value={exp.period || ''} 
                multiline
                onSave={(v) => {
                  const n = [...(data.leftExperience || [])];
                  n[idx].period = v;
                  setData({...data, leftExperience: n});
                }} 
                isEditing={isEditing} 
              />
            </div>
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={()=>{const n=data.leftExperience?[...data.leftExperience]:[]; n.push({title:"새 경력", period:"", description:"", details:[]}); setData({...data, leftExperience: n});}} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4"><Plus className="w-3 h-3 inline mr-1"/> 항목 추가</button>}
    </div>
  </div>
);

const CertificatesSection = ({ data, setData, isEditing }: any) => (
  <div className="py-10 relative pdf-no-break border-b border-[#DBE2EF]/60 md:border-none">
    <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-3 uppercase">
      <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
        <Award className="w-5 h-5" />
      </div>
      자격 및 수상
    </h3>
    <div className="space-y-7 pl-1">
      {(data.awards || []).map((cert: any, idx: number) => (
        <div key={idx} className="relative group/cert">
          {isEditing && (
            <button type="button" onClick={() => { const n = [...(data.awards || [])]; n.splice(idx,1); setData({...data, awards: n}); }} className="absolute -left-6 top-1 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/cert:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
          )}
          <div className="flex flex-col gap-1.5">
            <div className="text-[14px] text-[#112D4E] font-bold leading-tight">
              <EditableText value={cert.title} onSave={(v)=>{const n=[...(data.awards || [])]; n[idx].title=v; setData({...data, awards: n});}} isEditing={isEditing} />
            </div>
            <div className="flex items-center gap-2 text-[12px] font-medium text-[#7A8A9E]">
              <span>
                <EditableText value={cert.organization} onSave={(v)=>{const n=[...(data.awards || [])]; n[idx].organization=v; setData({...data, awards: n});}} isEditing={isEditing} />
              </span>
              <span className="w-1 h-1 rounded-full bg-[#DBE2EF]" />
              <span>
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
