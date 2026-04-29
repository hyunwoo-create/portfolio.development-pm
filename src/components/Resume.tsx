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
  ShieldCheck,
  Wrench,
  Star,
  ArrowRight
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
  setData: (d: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  onNavClick?: (id: string) => void;
}

export const Resume = ({ isEditing, data, setData, onNavClick }: ResumeProps) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const resumeImageInputRef = useRef<HTMLInputElement>(null);
  const [showRsLink, setShowRsLink] = useState(false);
  const [rsLinkValue, setRsLinkValue] = useState('');
  const [activeLinkEditor, setActiveLinkEditor] = useState<{ type: string, idx?: number } | null>(null);
  const [linkInput, setLinkInput] = useState('');

  const handleResumeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageHighQuality(file, 400).then(dataUrl => {
      setData((prev: any) => ({ ...prev, resumeImage: dataUrl }));
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

  const handleBackupData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `portfolio_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleRestoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (window.confirm("기존 데이터를 덮어쓰고 복원하시겠습니까?")) {
          setData(parsed);
          alert("데이터가 성공적으로 복원되었습니다.");
        }
      } catch (err) {
        alert("유효하지 않은 백업 파일입니다.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <motion.section
      id="resume-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 px-6 max-w-5xl mx-auto print:pt-0 print:pb-0 print:max-w-none"
    >
      {isEditing && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-12 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackupData}
              className="px-4 py-2 bg-[#EEF4FF] text-[#3F72AF] border border-[#3F72AF]/30 rounded-xl text-[12px] font-bold flex items-center gap-2 hover:bg-[#3F72AF] hover:text-white transition-all shadow-sm"
              title="현재 데이터를 JSON 파일로 백업합니다"
            >
              <Download className="w-3.5 h-3.5" /> 데이터 백업
            </button>
            <label className="px-4 py-2 bg-white text-[#112D4E] border border-[#DBE2EF] rounded-xl text-[12px] font-bold flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition-all shadow-sm">
              <Upload className="w-3.5 h-3.5" /> 데이터 복원
              <input type="file" accept=".json" className="hidden" onChange={handleRestoreData} />
            </label>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
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
                        onClick={() => setData((prev: any) => ({ ...prev, resumeImage: "" }))}
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
                          if (finalUrl) setData((prev: any) => ({ ...prev, resumeImage: finalUrl }));
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
                  onSave={(v) => setData((prev: any) => ({ ...prev, name: v }))}
                  isEditing={isEditing}
                  style={data.nameStyle || {}}
                  styleData={data.nameStyle || {}}
                  onStyleSave={(s) => setData((prev: any) => ({ ...prev, nameStyle: s }))}
                />
              </h1>
              <p className="text-[#112D4E] font-medium mb-6">
                <EditableText
                  value={data.role}
                  onSave={(v) => setData((prev: any) => ({ ...prev, role: v }))}
                  isEditing={isEditing}
                  style={data.roleStyle || {}}
                  styleData={data.roleStyle || {}}
                  onStyleSave={(s) => setData((prev: any) => ({ ...prev, roleStyle: s }))}
                />
              </p>
              <div className="space-y-4 text-sm text-[#112D4E] ">
                <ContactInfo icon={<Calendar className="w-4 h-4" />} value={data.birthDate || "2000.01.01"} onSave={(v: any) => setData((prev: any) => ({ ...prev, birthDate: v }))} isEditing={isEditing} />
                <div className={isEditing ? 'block' : 'hidden print:block'}>
                  <ContactInfo icon={<Phone className="w-4 h-4" />} value={data.phone || "010-0000-0000"} onSave={(v: any) => setData((prev: any) => ({ ...prev, phone: v }))} isEditing={isEditing} />
                </div>
                <ContactInfo icon={<MapPin className="w-4 h-4" />} value={data.address || "서울특별시 OO구"} onSave={(v: any) => setData((prev: any) => ({ ...prev, address: v }))} isEditing={isEditing} />
                <ContactInfo icon={<Mail className="w-4 h-4" />} value={data.email || "email@example.com"} onSave={(v: any) => setData((prev: any) => ({ ...prev, email: v }))} isEditing={isEditing} />
                <ContactInfo icon={<Github className="w-4 h-4" />} value={data.github} onSave={(v: any) => setData((prev: any) => ({ ...prev, github: v }))} isEditing={isEditing} />
                <ContactInfo icon={<ShieldCheck className="w-4 h-4" />} value={data.militaryService || "군필 (육군 병장)"} onSave={(v: any) => setData((prev: any) => ({ ...prev, militaryService: v }))} isEditing={isEditing} />
              </div>
            </div>

            <div className="space-y-0">
              <ToolsSection data={data} setData={setData} isEditing={isEditing} onNavClick={onNavClick} />
              <ActivitiesSection data={data} setData={setData} isEditing={isEditing} />
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

const ToolsSection = ({ data, setData, isEditing, onNavClick }: any) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, listKey: 'usedTools' | 'usedToolsBottom', idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageHighQuality(file, 100).then(dataUrl => {
      setData((prev: any) => {
        const n = [...(prev[listKey] || [])];
        const oldItem = n[idx];
        const name = typeof oldItem === 'string' ? oldItem : oldItem.name;
        n[idx] = { name, image: dataUrl };
        return { ...prev, [listKey]: n };
      });
    }).catch(console.error);
  };

  const renderTool = (tool: any, idx: number, listKey: 'usedTools' | 'usedToolsBottom') => {
    const toolObj = typeof tool === 'string' ? { name: tool, image: '' } : tool;
    
    return (
      <span key={idx} className="relative group/tool inline-flex items-center">
        <span className="px-3 py-1.5 bg-[#F9F7F7] border border-[#DBE2EF] text-[#112D4E] rounded-lg text-[11px] font-bold shadow-sm flex items-center gap-1.5">
          {isEditing ? (
            <label className="cursor-pointer flex items-center justify-center relative w-6 h-6 bg-gray-200/50 rounded hover:bg-gray-300/50 transition-colors shrink-0 overflow-hidden" title="아이콘 업로드">
              {toolObj.image ? (
                <img src={toolObj.image} alt="" className="w-full h-full object-contain" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-gray-500" />
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, listKey, idx)} />
            </label>
          ) : (
            toolObj.image && <img src={toolObj.image} alt="" className="w-6 h-6 object-contain shrink-0" />
          )}
          <EditableText value={toolObj.name} onSave={(v) => { 
            setData((prev: any) => {
              const n = [...(prev[listKey] || [])]; 
              n[idx] = { ...toolObj, name: v }; 
              return { ...prev, [listKey]: n };
            });
          }} isEditing={isEditing} disableMarkdown={true} />
        </span>
        {isEditing && (
          <button type="button" onClick={() => { 
            setData((prev: any) => {
              const n = [...(prev[listKey] || [])]; 
              n.splice(idx, 1); 
              return { ...prev, [listKey]: n };
            });
          }} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/tool:opacity-100 transition-opacity z-10 shadow-sm"><X className="w-2.5 h-2.5" /></button>
        )}
      </span>
    );
  };

  return (
    <div className="py-10 border-t border-[#DBE2EF]/60 relative pdf-no-break">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] flex items-center gap-3 uppercase">
          <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
            <Wrench className="w-5 h-5" />
          </div>
          사용 TOOL
        </h3>
        {!isEditing && (
          <button 
            onClick={() => {
              if (onNavClick) {
                onNavClick('stat-board');
              } else {
                const el = document.getElementById('stat-board');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-[11px] font-bold text-[#3F72AF] bg-[#3F72AF]/10 px-3 py-1.5 rounded-full hover:bg-[#3F72AF]/20 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            More <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4 pl-1">
        {/* 상단 툴 */}
        <div className="flex flex-wrap gap-2">
          {(data.usedTools || []).map((tool: any, idx: number) => renderTool(tool, idx, 'usedTools'))}
          {isEditing && (
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.usedTools || []), { name: "새 툴", image: "" }]; 
                return { ...prev, usedTools: n };
              });
            }} className="px-3 py-1.5 border border-dashed border-[#3F72AF]/40 text-[#3F72AF] rounded-lg text-[11px] font-bold hover:bg-[#3F72AF]/5 transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> 추가
            </button>
          )}
        </div>

        {/* 구분선 */}
        <div className="h-px bg-gradient-to-r from-[#DBE2EF] to-transparent w-full my-1"></div>

        {/* 하단 툴 */}
        <div className="flex flex-wrap gap-2">
          {(data.usedToolsBottom || []).map((tool: any, idx: number) => renderTool(tool, idx, 'usedToolsBottom'))}
          {isEditing && (
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.usedToolsBottom || []), { name: "새 툴", image: "" }]; 
                return { ...prev, usedToolsBottom: n };
              });
            }} className="px-3 py-1.5 border border-dashed border-[#3F72AF]/40 text-[#3F72AF] rounded-lg text-[11px] font-bold hover:bg-[#3F72AF]/5 transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> 추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ActivitiesSection = ({ data, setData, isEditing }: any) => (
  <div className="py-10 border-t border-[#DBE2EF]/60 relative pdf-no-break">
    <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-3 uppercase">
      <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
        <Star className="w-5 h-5" />
      </div>
      주요 활동
    </h3>
    <div className="space-y-6 pl-1">
      {(data.keyActivities || []).map((act: any, idx: number) => (
        <div key={idx} className="relative group/act">
          {isEditing && (
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.keyActivities || [])]; 
                n.splice(idx, 1); 
                return { ...prev, keyActivities: n };
              });
            }} className="absolute -left-6 top-1 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/act:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
          )}
          <div className="text-[14px] font-bold text-[#112D4E] mb-1.5 leading-tight">
            <EditableText value={act.title} onSave={(v) => { 
              setData((prev: any) => {
                const n = [...(prev.keyActivities || [])]; 
                n[idx] = { ...n[idx], title: v }; 
                return { ...prev, keyActivities: n };
              });
            }} isEditing={isEditing} />
          </div>
          <div className="text-[12px] text-[#3F72AF] font-medium leading-[1.6]">
            <EditableText value={act.description} onSave={(v) => { 
              setData((prev: any) => {
                const n = [...(prev.keyActivities || [])]; 
                n[idx] = { ...n[idx], description: v }; 
                return { ...prev, keyActivities: n };
              });
            }} isEditing={isEditing} multiline />
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={() => { 
        setData((prev: any) => {
          const n = prev.keyActivities ? [...prev.keyActivities] : []; 
          n.push({ title: "새 주요 활동", description: "활동 설명을 입력하세요" }); 
          return { ...prev, keyActivities: n };
        });
      }} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4"><Plus className="w-3 h-3 inline mr-1" /> 주요 활동 추가</button>}
    </div>
  </div>
);

const EducationSection = ({ data, setData, isEditing }: any) => (
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
          {isEditing && (
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.education || [])]; 
                n.splice(idx, 1); 
                return { ...prev, education: n };
              });
            }} className="absolute -left-6 top-1 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/edu:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
          )}
          <div className="text-[14px] font-bold text-[#112D4E] mb-2 leading-tight">
            <EditableText value={edu.title} onSave={(v) => { 
              setData((prev: any) => {
                const n = [...(prev.education || [])]; 
                n[idx] = { ...n[idx], title: v }; 
                return { ...prev, education: n };
              });
            }} isEditing={isEditing} />
          </div>
          <div className="space-y-1.5 mt-2">
            {(edu.details || []).map((d: string, i: number) => (
              <div key={i} className="group/item relative flex items-start gap-1.5 text-[12px] text-[#3F72AF] font-medium">
                <span className="font-bold shrink-0 mt-[1px]">•</span>
                <span className="flex-1">
                  <EditableText value={d} onSave={(v) => { 
                    setData((prev: any) => {
                      const n = [...(prev.education || [])]; 
                      const details = [...(n[idx].details || [])];
                      details[i] = v;
                      n[idx] = { ...n[idx], details };
                      return { ...prev, education: n };
                    });
                  }} isEditing={isEditing} />
                </span>
                {isEditing && <button type="button" onClick={() => { 
                  setData((prev: any) => {
                    const n = [...(prev.education || [])]; 
                    const details = [...(n[idx].details || [])];
                    details.splice(i, 1); 
                    n[idx] = { ...n[idx], details };
                    return { ...prev, education: n };
                  });
                }} className="opacity-0 group-hover/item:opacity-100 absolute -left-5 top-0 text-red-300 transition-opacity"><X className="w-2.5 h-2.5" /></button>}
              </div>
            ))}
            {isEditing && (
              <button type="button" onClick={() => { 
                setData((prev: any) => {
                  const n = [...(prev.education || [])]; 
                  const details = [...(n[idx].details || [])];
                  details.push("새 설명"); 
                  n[idx] = { ...n[idx], details };
                  return { ...prev, education: n };
                });
              }} className="text-[10px] text-[#3F72AF]/60 hover:text-[#3F72AF] ml-2">+ 설명 추가</button>
            )}
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={() => { 
        setData((prev: any) => {
          const n = prev.education ? [...prev.education] : []; 
          n.push({ title: "새 학력", period: "", description: "", details: [] }); 
          return { ...prev, education: n };
        });
      }} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4"><Plus className="w-3 h-3 inline mr-1" /> 학력 추가</button>}
    </div>
  </div>
);

const ExperienceSection = ({ data, setData, isEditing }: any) => (
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
          {/* Timeline Node */}
          <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-[1.5px] border-[#3F72AF] bg-[#F9F7F7] z-10" />

          {isEditing && (
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.leftExperience || [])]; 
                n.splice(idx, 1); 
                return { ...prev, leftExperience: n };
              });
            }} className="absolute -left-6 top-0.5 text-red-300 hover:text-red-500 z-20 opacity-0 group-hover/exp:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
          )}

          <div className="text-[14px] font-bold text-[#112D4E] mb-2 leading-tight">
            <EditableText value={exp.title} onSave={(v) => { 
              setData((prev: any) => {
                const n = [...(prev.leftExperience || [])]; 
                n[idx] = { ...n[idx], title: v }; 
                return { ...prev, leftExperience: n };
              });
            }} isEditing={isEditing} />
          </div>

          <div className="space-y-1.5">
            <div className="text-[12px] text-[#3F72AF] font-medium leading-[1.6] flex flex-col gap-1">
              {(exp.details || []).map((d: string, i: number) => (
                <div key={i} className="group/detail relative flex items-start gap-1.5">
                  <span className="font-bold shrink-0 mt-[1px]">•</span>
                  <span className="flex-1 whitespace-pre-wrap">
                    <EditableText
                      value={d}
                      multiline
                      onSave={(v) => {
                        setData((prev: any) => {
                          const n = [...(prev.leftExperience || [])];
                          const details = [...(n[idx].details || [])];
                          details[i] = v;
                          n[idx] = { ...n[idx], details };
                          return { ...prev, leftExperience: n };
                        });
                      }}
                      isEditing={isEditing}
                    />
                  </span>
                  {isEditing && <button type="button" onClick={() => { 
                    setData((prev: any) => {
                      const n = [...(prev.leftExperience || [])]; 
                      const details = [...(n[idx].details || [])];
                      details.splice(i, 1); 
                      n[idx] = { ...n[idx], details };
                      return { ...prev, leftExperience: n };
                    });
                  }} className="opacity-0 group-hover/detail:opacity-100 absolute -left-5 top-0 text-red-300 transition-opacity"><X className="w-2.5 h-2.5" /></button>}
                </div>
              ))}
              {isEditing && (
                <button type="button" onClick={() => { 
                  setData((prev: any) => {
                    const n = [...(prev.leftExperience || [])]; 
                    const details = [...(n[idx].details || [])];
                    details.push("새 직무/역할"); 
                    n[idx] = { ...n[idx], details };
                    return { ...prev, leftExperience: n };
                  });
                }} className="text-[10px] text-[#3F72AF]/60 hover:text-[#3F72AF] w-max">+ 역할 추가</button>
              )}
            </div>

            <div className="text-[12px] font-bold text-[#112D4E] whitespace-pre-wrap leading-[1.6] pt-1">
              <EditableText
                value={exp.period || 'YYYY.MM ~ YYYY.MM'}
                multiline
                onSave={(v) => {
                  setData((prev: any) => {
                    const n = [...(prev.leftExperience || [])];
                    n[idx] = { ...n[idx], period: v };
                    return { ...prev, leftExperience: n };
                  });
                }}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={() => { 
        setData((prev: any) => {
          const n = prev.leftExperience ? [...prev.leftExperience] : []; 
          n.push({ title: "새 경력", period: "YYYY.MM ~ YYYY.MM", description: "", details: [] }); 
          return { ...prev, leftExperience: n };
        });
      }} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4 ml-6"><Plus className="w-3 h-3 inline mr-1" /> 경력 추가</button>}
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
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.awards || [])]; 
                n.splice(idx, 1); 
                return { ...prev, awards: n };
              });
            }} className="absolute -left-6 top-1 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/cert:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
          )}
          <div className="flex flex-col gap-1.5">
            <div className="text-[14px] text-[#112D4E] font-bold leading-tight">
              <EditableText value={cert.title} onSave={(v) => { 
                setData((prev: any) => {
                  const n = [...(prev.awards || [])]; 
                  n[idx] = { ...n[idx], title: v }; 
                  return { ...prev, awards: n };
                });
              }} isEditing={isEditing} />
            </div>
            <div className="flex items-center gap-2 text-[12px] font-medium text-[#7A8A9E]">
              <span>
                <EditableText value={cert.organization} onSave={(v) => { 
                  setData((prev: any) => {
                    const n = [...(prev.awards || [])]; 
                    n[idx] = { ...n[idx], organization: v }; 
                    return { ...prev, awards: n };
                  });
                }} isEditing={isEditing} />
              </span>
              <span className="w-1 h-1 rounded-full bg-[#DBE2EF]" />
              <span>
                <EditableText value={cert.year ? `${cert.year}` : '연도'} onSave={(v) => { 
                  setData((prev: any) => {
                    const n = [...(prev.awards || [])]; 
                    n[idx] = { ...n[idx], year: v.replace(/[()]/g, '') }; 
                    return { ...prev, awards: n };
                  });
                }} isEditing={isEditing} />
              </span>
            </div>
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={() => { 
        setData((prev: any) => {
          const c = prev.awards || []; 
          const n = [...c, { title: "새 자격증", organization: "기관", year: "연도" }]; 
          return { ...prev, awards: n };
        });
      }} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4"><Plus className="w-3 h-3 inline mr-1" /> 자격/수상 추가</button>}
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
        onSave={(v) => setData((prev: any) => ({ ...prev, summary: v }))}
        isEditing={isEditing}
        multiline
        style={data.summaryStyle || {}}
        styleData={data.summaryStyle || {}}
        onStyleSave={(s) => setData((prev: any) => ({ ...prev, summaryStyle: s }))}
      />
    </p>
  </section>
);
