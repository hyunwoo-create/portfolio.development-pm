import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { EditableText } from './EditableText';
import { Project } from '../types';

interface PortfolioGalleryProps {
  onProjectClick: (p: Project) => void;
  isEditing: boolean;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  setView: (v: any) => void;
}

export const PortfolioGallery = ({ onProjectClick, isEditing, projects, setProjects, setView }: PortfolioGalleryProps) => {
  const categories = ['메인 프로젝트', '게임 분석', 'AI 활용'];
  const [activeCategory, setActiveCategory] = useState<string>('메인 프로젝트');

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
    >
      <div className="mb-12">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-[#112D4E] hover:text-[#3F72AF] transition-colors mb-8 group font-bold"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 돌아가기
        </button>
        <h1 className="text-4xl md:text-5xl font-black text-[#112D4E] mb-4 tracking-tight">포트폴리오</h1>
        <p className="text-[#8fabc8] text-sm md:text-base font-medium">게임 기획부터 런칭까지의 메인 프로젝트와 AI/툴링을 활용한 기타 작업물 아카이브입니다.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b border-[#DBE2EF]/50">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-[13px] md:text-sm font-bold transition-all border ${
              activeCategory === cat
                ? 'bg-[#112D4E] text-white border-[#112D4E] shadow-md'
                : 'bg-white text-[#8fabc8] border-[#DBE2EF] hover:border-[#3F72AF] hover:text-[#3F72AF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeProjects.map((project) => {
          const normalTags = (project.tags || []).filter(tag => {
            const t = tag.toLowerCase();
            return !t.includes('google play') && !t.includes('구글플레이') && !t.includes('구글 플레이') && !t.includes('steam') && !t.includes('스팀') && !t.includes('maplestory');
          });
          const linkTags = (project.tags || []).filter(tag => {
            const t = tag.toLowerCase();
            return t.includes('google play') || t.includes('구글플레이') || t.includes('구글 플레이') || t.includes('steam') || t.includes('스팀') || t.includes('maplestory');
          });

          return (
            <motion.div
              key={project.id}
              whileHover={{ y: -8 }}
              onClick={() => !isEditing && onProjectClick(project)}
              className={`group flex flex-col bg-white rounded-3xl border border-[#DBE2EF] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${!isEditing ? 'cursor-pointer' : ''}`}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-[#F9F7F7]">
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("이 포트폴리오 항목을 삭제하시겠습니까?")) {
                        setProjects(projects.filter(p => p.id !== project.id));
                      }
                    }}
                    className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <img
                  src={project.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="text-emerald-500 font-bold text-[11px] md:text-xs mb-2">
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

                {/* Link Tags Area */}
                {(linkTags.length > 0 || isEditing) && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#DBE2EF]/50">
                    {linkTags.map((tag, i) => {
                      const tagUrl = project.linkUrls?.[tag] || '';
                      const isSteam = tag.toLowerCase().includes('steam') || tag.includes('스팀');
                      return (
                        <div key={i} className="flex flex-col gap-1 w-full sm:w-auto" onClick={e => e.stopPropagation()}>
                          <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit ${isSteam ? 'bg-[#112D4E] text-white' : 'bg-white border border-[#DBE2EF] text-[#112D4E]'}`}>
                            {tagUrl && !isEditing ? (
                              <a href={tagUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">{tag}</a>
                            ) : (
                              <EditableText
                                value={tag}
                                onSave={(v) => {
                                  const newTags = [...(project.tags || [])];
                                  const idx = newTags.indexOf(tag);
                                  if (idx !== -1) newTags[idx] = v;
                                  const newLinkUrls = { ...(project.linkUrls || {}) };
                                  if (newLinkUrls[tag]) {
                                    newLinkUrls[v] = newLinkUrls[tag];
                                    delete newLinkUrls[tag];
                                  }
                                  setProjects(projects.map(p => p.id === project.id ? { ...p, tags: newTags, linkUrls: newLinkUrls } : p));
                                }}
                                isEditing={isEditing}
                              />
                            )}
                            {isEditing && (
                              <button
                                onClick={() => {
                                  const newLinkUrls = { ...(project.linkUrls || {}) };
                                  delete newLinkUrls[tag];
                                  setProjects(projects.map(p => p.id === project.id ? { ...p, tags: (p.tags || []).filter(t => t !== tag), linkUrls: newLinkUrls } : p));
                                }}
                                className="hover:text-red-400 ml-1"
                              ><X className="w-3 h-3" /></button>
                            )}
                          </span>
                          {isEditing && (
                            <input
                              type="text"
                              placeholder="URL 입력"
                              value={tagUrl}
                              onChange={(e) => {
                                const newLinkUrls = { ...(project.linkUrls || {}) };
                                newLinkUrls[tag] = e.target.value;
                                setProjects(projects.map(p => p.id === project.id ? { ...p, linkUrls: newLinkUrls } : p));
                              }}
                              className="text-[10px] p-1 border border-[#DBE2EF] rounded bg-white text-[#112D4E] w-full"
                            />
                          )}
                        </div>
                      );
                    })}
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
