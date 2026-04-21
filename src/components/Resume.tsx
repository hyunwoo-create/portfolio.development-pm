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
  ScrollText,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { EditableText } from './EditableText';
import { processImageHighQuality } from '../utils';
import { ResumeData, SelfIntroTab } from '../types';

interface ResumeProps {
  isEditing: boolean;
  data: ResumeData;
  setData: (d: ResumeData) => void;
}

export const Resume = ({ isEditing, data, setData }: ResumeProps) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const resumeImageInputRef = useRef<HTMLInputElement>(null);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 print:hidden">
        <div className="flex flex-col items-start gap-4">
          <div className="inline-block px-4 py-1 rounded-lg bg-[#3F72AF]/10 text-[#3F72AF] text-[11px] font-bold tracking-widest mt-2 relative z-50">01_RESUME</div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadPdf}
          className="px-6 py-3 glass rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#112D4E]/10 transition-all"
        >
          <Download className="w-4 h-4 text-[#112D4E]" /> PDF 이력서 다운로드
        </motion.button>
      </div>

      {/* PDF Target Area */}
      <div ref={resumeRef} className="pdf-resume-container" style={{ background: '#F9F7F7' }}>
        <div className="grid md:grid-cols-3 gap-12 print:grid-cols-3">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-12">
            <div className="text-center md:text-left pdf-no-break">
              <div className="w-[230px] h-[230px] rounded-3xl overflow-hidden mb-8 mx-auto md:mx-0 border border-[#3F72AF]/12 shadow-2xl shadow-[#112D4E]/10 relative group z-10">
                <img src={data.resumeImage || "https://picsum.photos/seed/profile/300/300"} alt="Profile" className="w-full h-full object-fill" />
                {isEditing && (
                  <div className="absolute inset-0 bg-[#112D4E]/40 transition-all flex items-center justify-center cursor-pointer"
                    onClick={() => resumeImageInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-1 text-white">
                      <Upload className="w-6 h-6" />
                      <span className="text-[10px] font-bold">사진 변경</span>
                    </div>
                    <input
                      ref={resumeImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleResumeImageUpload}
                    />
                  </div>
                )}
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
                <ContactInfo icon={<MapPin className="w-4 h-4" />} value={data.address || "서울특별시 OO구"} onSave={(v) => setData({...data, address: v})} isEditing={isEditing} />
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
            <ProjectsSection data={data} setData={setData} isEditing={isEditing} />
            <SelfIntroInResume isEditing={isEditing} data={data} setData={setData} />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const ContactInfo = ({ icon, value, onSave, isEditing }: any) => (
  <div className="flex items-center gap-3 justify-center md:justify-start">
    <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#0a1e36] ">
      {icon}
    </div>
    <span>
      <EditableText value={value} onSave={onSave} isEditing={isEditing} disableMarkdown={true} />
    </span>
  </div>
);

const EducationSection = ({ data, setData, isEditing }: any) => (
  <div className="py-8 border-t border-b border-[#DBE2EF] relative pdf-no-break">
    <h3 className="font-bold text-[#112D4E] text-[15px] mb-6 flex items-center gap-2">
      <GraduationCap className="w-4 h-4 text-[#3F72AF]" /> 학력 및 교육
    </h3>
    <div className="space-y-4">
      {(data.education || []).map((edu: any, idx: number) => (
        <div key={idx} className="relative group/edu">
          {isEditing && (
            <button type="button" onClick={() => { const n = [...(data.education || [])]; n.splice(idx,1); setData({...data, education: n}); }} className="absolute -left-4 top-0 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/edu:opacity-100"><X className="w-3 h-3"/></button>
          )}
          <div className="text-[14px] font-bold text-[#112D4E] mb-2 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
            <EditableText value={edu.title} onSave={(v)=>{const n=[...(data.education || [])]; n[idx].title=v; setData({...data, education: n});}} isEditing={isEditing} />
          </div>
          {(edu.details || []).length > 0 && (
            <ul className="list-disc list-inside text-xs text-[#112D4E] space-y-1 ml-1 mt-1 font-medium">
              {edu.details.map((d: string, i: number) => (
                <li key={i} className="group/item relative">
                  <span className="inline-block relative">
                      <EditableText value={d} onSave={(v)=>{const n=[...(data.education || [])]; n[idx].details[i]=v; setData({...data, education: n});}} isEditing={isEditing} />
                  </span>
                  {isEditing && <button type="button" onClick={()=>{const n=[...(data.education || [])]; n[idx].details.splice(i,1); setData({...data, education: n});}} className="opacity-0 group-hover/item:opacity-100 absolute -left-4 top-0.5 text-red-300"><X className="w-2.5 h-2.5"/></button>}
                </li>
              ))}
            </ul>
          )}
          {isEditing && <button type="button" onClick={()=>{const n=[...(data.education || [])]; if(!n[idx].details) n[idx].details=[]; n[idx].details.push("항목"); setData({...data, education: n});}} className="text-[10px] text-gray-400 mt-1 block"><Plus className="w-2 h-2 inline"/> 항목추가</button>}
        </div>
      ))}
      {isEditing && <button type="button" onClick={()=>{const n=data.education?[...data.education]:[]; n.push({title:"새 학력", period:"", description:"", details:[]}); setData({...data, education: n});}} className="text-xs text-blue-400 mt-2 block"><Plus className="w-3 h-3 inline"/> 교육추가</button>}
    </div>
  </div>
);

const ExperienceSection = ({ data, setData, isEditing }: any) => (
  <div className="py-8 border-b border-[#DBE2EF] relative pdf-no-break">
    <div className="flex flex-col gap-1 mb-6">
      <h3 className="font-bold text-[#112D4E] text-[15px] flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-[#3F72AF]" /> 경력 사항
      </h3>
      <span className="text-[12px] font-medium text-[#e85c5c]">
        <EditableText value={data.totalExperience || "총 경력 6년"} onSave={(v)=>setData({...data, totalExperience: v})} isEditing={isEditing} />
      </span>
    </div>
    <div className="space-y-8">
      {(data.leftExperience || []).map((exp: any, idx: number) => (
        <div key={idx} className="relative group/exp">
          {isEditing && (
            <button type="button" onClick={() => { const n = [...(data.leftExperience || [])]; n.splice(idx,1); setData({...data, leftExperience: n}); }} className="absolute -left-4 top-0 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/exp:opacity-100"><X className="w-3 h-3"/></button>
          )}
          <div className="text-[14px] font-bold text-[#112D4E] mb-2">
            <EditableText value={exp.title} onSave={(v)=>{const n=[...(data.leftExperience || [])]; n[idx].title=v; setData({...data, leftExperience: n});}} isEditing={isEditing} />
          </div>
          <div className="text-[12px] text-[#8fabc8] border-l-2 border-[#DBE2EF] pl-2 mb-2 whitespace-pre-wrap leading-relaxed flex flex-col gap-0.5">
            <EditableText value={exp.period || ''} multiline onSave={(v)=>{const n=[...(data.leftExperience || [])]; n[idx].period=v; setData({...data, leftExperience: n});}} isEditing={isEditing} />
          </div>
          {(exp.details || []).length > 0 && (
            <ul className="list-disc list-inside text-xs text-[#112D4E] space-y-1 ml-1 mt-2 font-medium">
              {exp.details.map((d: string, i: number) => (
                <li key={i} className="group/item relative">
                  <span className="inline-block relative">
                     <EditableText value={d} onSave={(v)=>{const n=[...(data.leftExperience || [])]; n[idx].details[i]=v; setData({...data, leftExperience: n});}} isEditing={isEditing} />
                  </span>
                  {isEditing && <button type="button" onClick={()=>{const n=[...(data.leftExperience || [])]; n[idx].details.splice(i,1); setData({...data, leftExperience: n});}} className="opacity-0 group-hover/item:opacity-100 absolute -left-4 top-0.5 text-red-300"><X className="w-2.5 h-2.5"/></button>}
                </li>
              ))}
            </ul>
          )}
          {isEditing && <button type="button" onClick={()=>{const n=[...(data.leftExperience || [])]; if(!n[idx].details) n[idx].details=[]; n[idx].details.push("항목"); setData({...data, leftExperience: n});}} className="text-[10px] text-gray-400 mt-1 block"><Plus className="w-2 h-2 inline"/> 항목추가</button>}
        </div>
      ))}
      {isEditing && <button type="button" onClick={()=>{const n=data.leftExperience?[...data.leftExperience]:[]; n.push({title:"새 경력", period:"", description:"", details:[]}); setData({...data, leftExperience: n});}} className="text-xs text-blue-400 block"><Plus className="w-3 h-3 inline"/> 경력추가</button>}
    </div>
  </div>
);

const CertificatesSection = ({ data, setData, isEditing }: any) => (
  <div className="py-8 relative pdf-no-break">
    <h3 className="font-bold text-[#112D4E] text-[15px] mb-5 flex items-center gap-2">
      <Award className="w-4 h-4 text-[#3F72AF]" /> 자격 및 수상
    </h3>
    <div className="space-y-6">
      {(data.awards || []).map((cert: any, idx: number) => (
        <div key={idx} className="relative group/cert">
          {isEditing && (
            <button type="button" onClick={() => { const n = [...(data.awards || [])]; n.splice(idx,1); setData({...data, awards: n}); }} className="absolute -left-4 top-0 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/cert:opacity-100"><X className="w-3 h-3"/></button>
          )}
          <div className="text-[14px] text-[#112D4E] mb-2 font-medium">
            <EditableText value={cert.title} onSave={(v)=>{const n=[...(data.awards || [])]; n[idx].title=v; setData({...data, awards: n});}} isEditing={isEditing} />
          </div>
          <div className="text-[12px] text-[#8fabc8] border-l-2 border-[#DBE2EF] pl-2 flex flex-col gap-0.5">
            <EditableText value={cert.organization} onSave={(v)=>{const n=[...(data.awards || [])]; n[idx].organization=v; setData({...data, awards: n});}} isEditing={isEditing} />
            <EditableText value={cert.year ? `(${cert.year})` : '(연도)'} onSave={(v)=>{const n=[...(data.awards || [])]; n[idx].year=v.replace(/[()]/g,''); setData({...data, awards: n});}} isEditing={isEditing} />
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={()=>{const c = data.awards || []; const n=[...c, {title:"새 자격증", organization:"기관", year:"연도"}]; setData({...data, awards: n});}} className="text-xs text-blue-400 block"><Plus className="w-3 h-3 inline"/> 자격/수상 추가</button>}
    </div>
  </div>
);

const SummarySection = ({ data, setData, isEditing }: any) => (
  <section className="pdf-no-break">
    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 ">
      <User className="text-[#112D4E] w-6 h-6" /> 자기소개
    </h3>
    <p className="text-[#112D4E] leading-relaxed font-medium whitespace-pre-wrap">
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

const ProjectsSection = ({ data, setData, isEditing }: any) => (
  <section>
    <div className="flex items-center justify-between mb-8 pdf-no-break">
      <h3 className="text-xl font-bold flex items-center gap-3 ">
        <Briefcase className="text-[#1e3d5e] w-6 h-6" /> 프로젝트 경험
      </h3>
      {isEditing && (
        <button 
          onClick={() => {
            const newExp = [...(data.experience || [])];
            newExp.push({ title: "새 프로젝트", period: "기간", description: "설명", details: [] });
            setData({...data, experience: newExp});
          }}
          className="p-2 glass rounded-xl text-[#1e3d5e] hover:bg-[#112D4E]/10 transition-all flex items-center gap-2 text-xs font-bold"
        >
          <Plus className="w-4 h-4" /> 프로젝트 추가
        </button>
      )}
    </div>
    <div className="space-y-8">
      {(data.experience || []).map((exp: any, idx: number) => (
        <div key={idx} className="relative pl-8 border-l border-[#3F72AF]/12 pdf-no-break">
          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#112D4E] shadow-[0_0_10px_rgba(168,85,247,0.5)] "></div>
          {isEditing && (
            <button 
              onClick={() => {
                const newExp = [...(data.experience || [])];
                newExp.splice(idx, 1);
                setData({...data, experience: newExp});
              }}
              className="absolute -left-10 top-0 p-1 text-[#8fabc8] hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex justify-between items-start mb-0">
            <h4 className="font-bold text-[19px] ">
              <EditableText 
                value={exp.title || ""} 
                onSave={(v) => {
                  const newExp = [...(data.experience || [])];
                  newExp[idx].title = v;
                  setData({...data, experience: newExp});
                }} 
                isEditing={isEditing} 
              />
            </h4>
            <span className="text-[13px] font-mono text-[#0a1e36]">
              <EditableText 
                value={exp.period || ""} 
                onSave={(v) => {
                  const newExp = [...(data.experience || [])];
                  newExp[idx].period = v;
                  setData({...data, experience: newExp});
                }} 
                isEditing={isEditing} 
              />
            </span>
          </div>
            <div className="text-[14px] text-[#1A374D] font-semibold leading-[1.7] mt-0.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <EditableText 
                value={(exp.details || []).join('\n').trim()} 
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
        ))}
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
