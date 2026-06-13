import { ToolsSection, ActivitiesSection, EducationSection, ExperienceSection, CertificatesSection, SummarySection } from './ResumeSections';
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
import { useAppStore } from '../store';

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
  const { portfolioData, heroContent, aboutContent, aiSkills, toolCards, userImage, statBoardDefaultBtnText, statBoardDefaultDetailTitle, statBoardDefaultDetailDesc } = useAppStore();

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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#DBE2EF] shadow-sm mb-2">
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePdfExport({ data, heroContent, aboutContent, aiSkills, toolCards, userImage, statBoardDefaultBtnText, statBoardDefaultDetailTitle, statBoardDefaultDetailDesc })}
              className="px-6 py-3 bg-[#112D4E] text-white rounded-xl text-sm font-black flex items-center gap-2 hover:bg-[#0f1a2a] transition-all shadow-lg shadow-[#112D4E]/20"
            >
              <ScrollText className="w-4 h-4 text-white" /> 고품질 PDF 추출
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
