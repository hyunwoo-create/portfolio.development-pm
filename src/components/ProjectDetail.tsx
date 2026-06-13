import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Play, Image as ImageIcon, FileText, X, Upload, ChevronLeft, ChevronRight, Menu, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Project } from '../types';
import { getExternalEmbedUrl } from '../utils';
import { AdminTextEditor } from './AdminTextEditor';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  isEditing: boolean;
  onSaveContent: (content: string) => void;
  onUpdateProject?: (project: Project) => void;
}

export const ProjectDetail = ({ project, onBack, isEditing, onSaveContent, onUpdateProject }: ProjectDetailProps) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'pdf'>('image');
  const [activePdfId, setActivePdfId] = useState<string | null>(
    project.pdfDocuments && project.pdfDocuments.length > 0 ? project.pdfDocuments[0].id : null
  );
  const [pdfObjectUrl, setPdfObjectUrl] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const activePdf = project.pdfDocuments?.find(p => p.id === activePdfId);

  // PDF 뷰어 렌더링용 Blob URL 변환 (업로드된 Base64 이슈 해결)
  useEffect(() => {
    let objectUrl = '';
    if (activePdf?.url) {
      if (activePdf.url.startsWith('data:')) {
        // base64 데이터를 Blob URL로 변환하여 브라우저 iframe 제약 우회
        fetch(activePdf.url)
          .then(res => res.blob())
          .then(blob => {
            objectUrl = URL.createObjectURL(blob);
            setPdfObjectUrl(objectUrl);
          })
          .catch(err => {
            console.error("PDF Blob 변환 실패", err);
            setPdfObjectUrl(activePdf.url); // fallback
          });
      } else {
        setPdfObjectUrl(activePdf.url);
      }
    } else {
      setPdfObjectUrl('');
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [activePdf?.url]);

  const handleUpdate = (updates: Partial<Project>) => {
    if (onUpdateProject) {
      onUpdateProject({ ...project, ...updates });
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        const newPdf = { id: Date.now().toString(), name: file.name, url: base64 };
        const newDocs = [...(project.pdfDocuments || []), newPdf];
        handleUpdate({ pdfDocuments: newDocs });
        setActivePdfId(newPdf.id);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("PDF 파일만 업로드 가능합니다.");
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 px-6 max-w-5xl mx-auto"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[#112D4E] hover:text-[#112D4E] transition-colors mb-12 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 프로젝트 목록으로
      </button>

      {/* 1. 최상단: 제목, 설명, 태그, 링크 태그 */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-[#112D4E] tracking-tight mb-4 leading-tight">
          {project.title}
        </h1>
        
        {project.description && (
          <div 
            className="text-[#8fabc8] text-lg leading-relaxed mb-6 max-w-3xl [&>p]:mb-0"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        )}

        {/* 일반 태그들 (설명 아래로 이동, 색상 입힘) */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => {
              const tagLower = tag.toLowerCase();
              const isLinkTag = tagLower.includes('google play') || tagLower.includes('구글플레이') || tagLower.includes('구글 플레이') || tagLower.includes('steam') || tagLower.includes('스팀');
              if (isLinkTag) return null; // 링크 태그는 아래에 별도 표시
              return (
                <span key={tag} className="text-[#1A59A7] font-bold text-[13px] bg-[#E3EDF7] px-3 py-1.5 rounded-full shadow-sm">
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        <hr className="my-5 border-[#DBE2EF]" />

        {/* 링크 태그들 (태그 아래 구글 플레이 등 위치) */}
        <div className="flex flex-wrap gap-3">
          {project.releaseTags?.map(rt => (
            <a key={rt.id} href={rt.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DBE2EF] rounded-full text-sm font-bold text-[#112D4E] hover:bg-[#F9F7F7] shadow-sm transition-all hover:-translate-y-0.5">
              {rt.icon && <img src={rt.icon} alt={rt.label} className="w-5 h-5 object-contain" />}
              {rt.label}
            </a>
          ))}
          {project.tags?.map(tag => {
            const tagLower = tag.toLowerCase();
            const isLinkTag = tagLower.includes('google play') || tagLower.includes('구글플레이') || tagLower.includes('구글 플레이') || tagLower.includes('steam') || tagLower.includes('스팀');
            const tagUrl = project.linkUrls?.[tag] || '';
            if (isLinkTag && tagUrl) {
              const isSteam = tagLower.includes('steam') || tagLower.includes('스팀');
              return (
                <a key={tag} href={tagUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm hover:-translate-y-0.5 ${isSteam ? 'bg-[#112D4E] text-white border-transparent hover:bg-[#3F72AF]' : 'bg-white text-[#112D4E] border border-[#DBE2EF] hover:bg-[#F9F7F7]'}`}>
                  {tag} <ArrowUpRight className="w-4 h-4" />
                </a>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* 2. 중간: 미디어 뷰어 */}
      <div className="rounded-[1.5rem] overflow-hidden mb-8 bg-white border border-[#DBE2EF] shadow-sm relative">
        <div className="relative aspect-[4/3] md:aspect-[21/14] bg-[#F9F7F7]">
          <AnimatePresence mode="wait">
            {activeTab === 'image' && (
              <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}

            {activeTab === 'video' && (
              <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                {project.videoUrl ? (
                  <iframe 
                    src={getExternalEmbedUrl(project.videoUrl)} 
                    className="w-full h-full" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowFullScreen 
                  />
                ) : (
                  <div className="text-white/50 flex flex-col items-center gap-4">
                    <Play className="w-16 h-16 opacity-50" />
                    <p>등록된 플레이 영상이 없습니다.</p>
                  </div>
                )}
                {isEditing && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex gap-2 items-center z-20">
                    <span className="text-xs font-bold text-[#112D4E] whitespace-nowrap">영상 URL:</span>
                    <input 
                      type="text" 
                      value={project.videoUrl || ''} 
                      onChange={(e) => handleUpdate({ videoUrl: e.target.value })} 
                      placeholder="YouTube, Vimeo 등 URL" 
                      className="border border-[#DBE2EF] rounded-lg px-3 py-1 text-xs w-64 text-[#112D4E] focus:outline-none"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'pdf' && (
              <motion.div key="pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex bg-gray-100">
                <motion.div 
                  initial={false}
                  animate={{ width: isSidebarOpen ? 256 : 0 }}
                  className="bg-white border-r border-[#DBE2EF] flex flex-col h-full z-10 shadow-sm overflow-hidden"
                >
                  <div className="p-4 border-b border-[#DBE2EF] bg-[#F9F7F7] flex justify-between items-center min-w-[256px]">
                    <h3 className="font-black text-[#112D4E] text-sm">작업 문서 목록</h3>
                    {isEditing && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const newPdf = { id: Date.now().toString(), name: '새 문서', url: '' };
                            const newDocs = [...(project.pdfDocuments || []), newPdf];
                            handleUpdate({ pdfDocuments: newDocs });
                            setActivePdfId(newPdf.id);
                          }}
                          className="text-[#3F72AF] hover:text-[#112D4E] bg-white border border-[#DBE2EF] p-1.5 rounded-lg shadow-sm transition-colors"
                          title="새 문서 추가"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <label className="cursor-pointer text-[#3F72AF] hover:text-[#112D4E] bg-white border border-[#DBE2EF] p-1.5 rounded-lg shadow-sm transition-colors" title="파일 업로드">
                          <Upload className="w-4 h-4" />
                          <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 min-w-[256px]">
                    {(!project.pdfDocuments || project.pdfDocuments.length === 0) ? (
                      <p className="text-xs text-center text-gray-400 mt-10">문서가 없습니다.</p>
                    ) : (
                      project.pdfDocuments.map(pdf => (
                        <div 
                          key={pdf.id}
                          onClick={() => setActivePdfId(pdf.id)}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${activePdfId === pdf.id ? 'bg-[#112D4E] text-white border-[#112D4E] shadow-md' : 'bg-white text-[#112D4E] hover:bg-[#F9F7F7] border-[#DBE2EF]'}`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 shrink-0" />
                            {isEditing ? (
                              <input 
                                value={pdf.name} 
                                onChange={(e) => {
                                  const newDocs = project.pdfDocuments!.map(d => d.id === pdf.id ? { ...d, name: e.target.value } : d);
                                  handleUpdate({ pdfDocuments: newDocs });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent border-b border-current focus:outline-none w-full text-xs font-medium"
                              />
                            ) : (
                              <span className="text-xs font-bold truncate">{pdf.name}</span>
                            )}
                          </div>
                          {isEditing && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const newDocs = project.pdfDocuments!.filter(d => d.id !== pdf.id);
                                handleUpdate({ pdfDocuments: newDocs });
                                if (activePdfId === pdf.id) setActivePdfId(newDocs.length > 0 ? newDocs[0].id : null);
                              }}
                              className="text-red-400 hover:text-red-600 shrink-0 ml-2"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
                
                <div className="flex-1 bg-gray-200 h-full overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-20">
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="bg-white border border-[#DBE2EF] shadow-lg p-2.5 rounded-xl hover:bg-[#F9F7F7] transition-all text-[#112D4E] flex items-center justify-center hover:scale-105"
                      title={isSidebarOpen ? "목록 닫기" : "목록 열기"}
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                  </div>

                  {pdfObjectUrl ? (
                    (() => {
                      const isGoogleDrive = pdfObjectUrl.includes('drive.google.com');
                      // 구글 드라이브 URL → /preview 임베드 형식으로 변환
                      const toGoogleDrivePreview = (url: string): string => {
                        // https://drive.google.com/file/d/FILE_ID/view... 형식
                        const fileMatch = url.match(/\/file\/d\/([^/?\s]+)/);
                        if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
                        // https://drive.google.com/open?id=FILE_ID 형식
                        const openMatch = url.match(/[?&]id=([^&\s]+)/);
                        if (openMatch) return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
                        return url;
                      };
                      const finalUrl = isGoogleDrive
                        ? toGoogleDrivePreview(pdfObjectUrl)
                        : `${pdfObjectUrl}#toolbar=0&navpanes=0&scrollbar=0`;
                      
                      return (
                        <iframe 
                          src={finalUrl} 
                          className="w-full h-full border-none"
                          title="PDF Viewer"
                        >
                          이 브라우저는 PDF 보기를 지원하지 않습니다. <a href={pdfObjectUrl} download>다운로드</a> 하세요.
                        </iframe>
                      );
                    })()
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p>선택된 문서가 없거나 로딩 중입니다.</p>
                    </div>
                  )}
                  {isEditing && activePdf && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl flex gap-2 items-center">
                      <span className="text-[10px] font-bold text-[#112D4E]">문서 URL (수동입력):</span>
                      <input 
                        type="text" 
                        value={activePdf.url} 
                        onChange={(e) => {
                          const newDocs = project.pdfDocuments!.map(d => d.id === activePdf.id ? { ...d, url: e.target.value } : d);
                          handleUpdate({ pdfDocuments: newDocs });
                        }}
                        className="border border-[#DBE2EF] rounded px-2 py-1 text-[10px] w-48 text-[#112D4E] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. 미디어 뷰어 하단: 버튼 3개 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center items-center">
        <button
          onClick={() => setActiveTab('image')}
          className={`group flex items-center justify-center gap-2 w-full sm:w-48 py-4 rounded-2xl font-bold transition-all border shadow-sm ${
            activeTab === 'image' 
              ? 'bg-[#112D4E] text-white border-[#112D4E] hover:bg-white hover:text-[#112D4E]' 
              : 'bg-white text-[#112D4E] border-[#DBE2EF] hover:bg-[#112D4E] hover:text-white hover:border-[#112D4E]'
          }`}
        >
          <ImageIcon className="w-5 h-5" /> 대표 이미지
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`group flex items-center justify-center gap-2 w-full sm:w-48 py-4 rounded-2xl font-bold transition-all border shadow-sm ${
            activeTab === 'video' 
              ? 'bg-[#112D4E] text-white border-[#112D4E] hover:bg-white hover:text-[#112D4E]' 
              : 'bg-white text-[#112D4E] border-[#DBE2EF] hover:bg-[#112D4E] hover:text-white hover:border-[#112D4E]'
          }`}
        >
          <Play className="w-5 h-5" /> 플레이 영상
        </button>
        
        {/* 작업 문서 버튼 (툴팁 포함) */}
        <div className="relative w-full sm:w-48">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`group flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold transition-all border shadow-sm ${
              activeTab === 'pdf' 
                ? 'bg-[#EBF1FA] border-[#3F72AF] text-[#3F72AF] ring-2 ring-[#3F72AF]/30 shadow-[0_0_15px_rgba(63,114,175,0.3)] hover:bg-[#3F72AF] hover:text-white' 
                : 'bg-white text-[#112D4E] border-[#DBE2EF] hover:bg-[#3F72AF] hover:text-white hover:border-[#3F72AF]'
            }`}
          >
            <FileText className="w-5 h-5" /> 작업 문서
          </button>
          
          {/* 작업 문서 툴팁 (버튼 아래 고정) */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10 pointer-events-none">
            <div className="bg-[#5B63E4] text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg relative">
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#5B63E4] rotate-45"></div>
              <span className="relative z-10">문서를 확인해보세요!</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 최하단: 마크다운 텍스트 컨텐츠 */}
      <div className="glass rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#DBE2EF]">
        <AdminTextEditor
          isAdmin={isEditing}
          hideTitle={true}
          bodyValue={project.content || ''}
          onBodyChange={(val) => {
            if (isEditing) onSaveContent(val);
          }}
          minBodyHeight="600px"
        />
      </div>
    </motion.section>
  );
};
