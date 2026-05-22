import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { EditableText } from './EditableText';
import { Project } from '../types';
import { processImageHighQuality } from '../utils';

interface PortfolioGalleryProps {
  onProjectClick: (p: Project) => void;
  isEditing: boolean;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  description?: string;
  setDescription?: (v: string) => void;
  categories?: string[];
  setCategories?: (v: string[]) => void;
  setView: (v: any) => void;
}

export const PortfolioGallery = ({ onProjectClick, isEditing, projects, setProjects, description, setDescription, categories = ['게임 분석', 'AI 활용'], setCategories, setView }: PortfolioGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '게임 분석');
  
  React.useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const activeProjects = projects.filter(p => p.category === activeCategory);

  const handleAddProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: '새 프로젝트',
      category: activeCategory,
      description: '프로젝트 설명을 입력하세요.',
      tags: ['태그1'],
      details: ['서브 카테고리'],
      image: '',
      color: 'from-blue-500/20 to-purple-500/20',
      content: ''
    };
    setProjects([...projects, newProject]);
  };

  const handleHtmlExport = () => {
    import('../utils/html-generator').then(({ generatePortfolioHtml }) => {
      const htmlContent = generatePortfolioHtml(projects, categories, description || '');
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'portfolio-slide.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
    >
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-[#112D4E] hover:text-[#3F72AF] transition-colors group font-bold"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 돌아가기
          </button>
          {!isEditing && (
            <button
              onClick={handleHtmlExport}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3F72AF] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#112D4E] hover:-translate-y-0.5 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              HTML 다운로드
            </button>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#112D4E] mb-4 tracking-tight">포트폴리오</h1>
        <div className="text-[#8fabc8] text-sm md:text-base font-medium">
          {setDescription ? (
            <EditableText 
              value={description || '게임 기획부터 런칭까지의 메인 프로젝트와 AI/툴링을 활용한 기타 작업물 아카이브입니다.'} 
              onSave={setDescription} 
              isEditing={isEditing} 
              multiline 
            />
          ) : (
            <p>{description || '게임 기획부터 런칭까지의 메인 프로젝트와 AI/툴링을 활용한 기타 작업물 아카이브입니다.'}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b border-[#DBE2EF]/50">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => !isEditing && setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-[13px] md:text-sm font-bold transition-all border flex items-center gap-2 ${
              activeCategory === cat && !isEditing
                ? 'bg-[#112D4E] text-white border-[#112D4E] shadow-md'
                : 'bg-white text-[#8fabc8] border-[#DBE2EF] hover:border-[#3F72AF] hover:text-[#3F72AF]'
            }`}
          >
            {isEditing && setCategories ? (
              <EditableText
                value={cat}
                isEditing={isEditing}
                onSave={(v) => {
                  const newCats = [...categories];
                  newCats[i] = v;
                  setCategories(newCats);
                  const updatedProjects = projects.map(p => p.category === cat ? { ...p, category: v } : p);
                  setProjects(updatedProjects);
                  if (activeCategory === cat) setActiveCategory(v);
                }}
              />
            ) : (
              cat
            )}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeProjects.map((project) => {
          const normalTags = project.tags || [];

          return (
            <motion.div
              key={project.id}
              whileHover={{ y: -8 }}
              onClick={() => !isEditing && onProjectClick(project)}
              className={`group flex flex-col bg-white rounded-3xl border border-[#DBE2EF] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${!isEditing ? 'cursor-pointer' : ''}`}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-[#F9F7F7]">
                {isEditing && (
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (ev: any) => {
                          const file = ev.target.files?.[0];
                          if (file) {
                            const b64 = await processImageHighQuality(file, 800);
                            setProjects(projects.map(p => p.id === project.id ? { ...p, image: b64 } : p));
                          }
                        };
                        input.click();
                      }}
                      className="p-2 bg-white text-[#112D4E] rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                      title="이미지 변경"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setProjects(projects.filter(p => p.id !== project.id));
                      }}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      title="프로젝트 삭제"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <img
                  src={project.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="text-[#C08D50] font-bold text-[11px] md:text-xs mb-2 tracking-widest uppercase">
                  <EditableText
                    value={project.details?.[0] || '서브 카테고리'}
                    onSave={(v) => {
                      const newDetails = [...(project.details || [])];
                      newDetails[0] = v;
                      setProjects(projects.map(p => p.id === project.id ? { ...p, details: newDetails } : p));
                    }}
                    isEditing={isEditing}
                  />
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-[#112D4E] mb-4 leading-tight group-hover:text-[#3F72AF] transition-colors">
                  <EditableText
                    value={project.title}
                    onSave={(v) => setProjects(projects.map(p => p.id === project.id ? { ...p, title: v } : p))}
                    isEditing={isEditing}
                  />
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {normalTags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 border border-[#DBE2EF] rounded-full text-[10px] md:text-[11px] text-[#8fabc8] font-bold flex items-center gap-1 bg-[#F9F7F7]">
                      <EditableText
                        value={tag}
                        onSave={(v) => {
                          const newTags = [...(project.tags || [])];
                          const idx = newTags.indexOf(tag);
                          if (idx !== -1) newTags[idx] = v;
                          setProjects(projects.map(p => p.id === project.id ? { ...p, tags: newTags } : p));
                        }}
                        isEditing={isEditing}
                      />
                      {isEditing && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjects(projects.map(p => p.id === project.id ? { ...p, tags: (p.tags || []).filter(t => t !== tag) } : p));
                          }}
                          className="hover:text-red-400 ml-1"
                        ><X className="w-3 h-3" /></button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjects(projects.map(p => p.id === project.id ? { ...p, tags: [...(p.tags || []), '새 태그'] } : p));
                      }}
                      className="px-3 py-1 border border-dashed border-[#8fabc8] rounded-full text-[10px] md:text-[11px] text-[#8fabc8] font-bold hover:bg-[#F9F7F7] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="text-[#8fabc8] text-sm leading-relaxed mb-6 flex-1">
                  <EditableText
                    value={project.description}
                    onSave={(v) => setProjects(projects.map(p => p.id === project.id ? { ...p, description: v } : p))}
                    isEditing={isEditing}
                    multiline
                  />
                </div>

                {/* Release Tags Area (게임 출시 태그) */}
                {((project.releaseTags && project.releaseTags.length > 0) || isEditing) && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#DBE2EF]/50">
                    {(project.releaseTags || []).map((rt, i) => (
                      <div key={rt.id} className="flex flex-col gap-1 w-full sm:w-auto relative" onClick={e => e.stopPropagation()}>
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit bg-white border border-[#DBE2EF] text-[#112D4E]`}>
                          {rt.icon ? (
                            <img src={rt.icon} className="w-4 h-4 object-contain" alt={rt.label} />
                          ) : (
                            isEditing && (
                              <button
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = async (ev: any) => {
                                    const file = ev.target.files?.[0];
                                    if (file) {
                                      const b64 = await processImageHighQuality(file, 100);
                                      const newRt = [...(project.releaseTags || [])];
                                      newRt[i] = { ...newRt[i], icon: b64 };
                                      setProjects(projects.map(p => p.id === project.id ? { ...p, releaseTags: newRt } : p));
                                    }
                                  };
                                  input.click();
                                }}
                                className="w-4 h-4 border border-dashed border-[#8fabc8] flex items-center justify-center rounded-sm text-[8px] text-[#8fabc8] hover:bg-[#F9F7F7]"
                              >
                                Img
                              </button>
                            )
                          )}
                          
                          {rt.url && !isEditing ? (
                            <a href={rt.url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">{rt.label}</a>
                          ) : (
                            <EditableText
                              value={rt.label}
                              onSave={(v) => {
                                const newRt = [...(project.releaseTags || [])];
                                newRt[i] = { ...newRt[i], label: v };
                                setProjects(projects.map(p => p.id === project.id ? { ...p, releaseTags: newRt } : p));
                              }}
                              isEditing={isEditing}
                            />
                          )}

                          {isEditing && (
                            <button
                              onClick={() => {
                                const newRt = [...(project.releaseTags || [])];
                                newRt.splice(i, 1);
                                setProjects(projects.map(p => p.id === project.id ? { ...p, releaseTags: newRt } : p));
                              }}
                              className="hover:text-red-400 ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                        
                        {isEditing && (
                          <input
                            type="text"
                            placeholder="URL 입력"
                            value={rt.url || ''}
                            onChange={(e) => {
                              const newRt = [...(project.releaseTags || [])];
                              newRt[i] = { ...newRt[i], url: e.target.value };
                              setProjects(projects.map(p => p.id === project.id ? { ...p, releaseTags: newRt } : p));
                            }}
                            className="text-[10px] p-1 border border-[#DBE2EF] rounded bg-white text-[#112D4E] w-full"
                          />
                        )}
                      </div>
                    ))}
                    
                    {isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newRt = [...(project.releaseTags || [])];
                          newRt.push({ id: Date.now().toString(), label: '출시 플랫폼', url: '', icon: '' });
                          setProjects(projects.map(p => p.id === project.id ? { ...p, releaseTags: newRt } : p));
                        }}
                        className="px-3 py-1 border border-dashed border-[#8fabc8] rounded-full text-[10px] md:text-[11px] text-[#8fabc8] font-bold hover:bg-[#F9F7F7] flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          );
        })}

        {isEditing && (
          <motion.div
            whileHover={{ y: -8 }}
            onClick={handleAddProject}
            className="group flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-[#DBE2EF] transition-all duration-300 min-h-[400px] cursor-pointer hover:border-[#3F72AF] hover:bg-[#F9F7F7]"
          >
            <div className="p-4 bg-[#DBE2EF]/30 rounded-full mb-4 group-hover:scale-110 group-hover:bg-[#3F72AF]/10 transition-transform">
               <Plus className="w-8 h-8 text-[#3F72AF]" />
            </div>
            <span className="font-bold text-[#3F72AF]">새 프로젝트 추가</span>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
