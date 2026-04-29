import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Gamepad2, X, ArrowUpRight, Plus } from 'lucide-react';
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
  const mainProjects = projects.filter(p => p.category === '메인 프로젝트');
  const gameProjects = projects.filter(p => p.category === '게임 분석');
  const aiProjects = projects.filter(p => p.category === 'AI 활용');

  const handleAddProject = (category: string) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: '새 프로젝트',
      category,
      description: '프로젝트 설명을 입력하세요.',
      tags: ['태그1', '태그2'],
      image: '',
      color: 'from-blue-500/20 to-purple-500/20',
      content: ''
    };
    setProjects([...projects, newProject]);
  };

  const renderGrid = (list: Project[], category: string) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      {list.map((project) => (
        <motion.div
          key={project.id}
          whileHover={{ y: -10 }}
          onClick={() => !isEditing && onProjectClick(project)}
          className={`group relative flex flex-col glass rounded-[2rem] overflow-hidden transition-all duration-500 ${!isEditing ? 'cursor-pointer' : ''}`}
        >
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("이 포트폴리오 항목을 삭제하시겠습니까?")) {
                  const newProjects = projects.filter(p => p.id !== project.id);
                  setProjects(newProjects);
                }
              }}
              className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="삭제"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="aspect-[12/5] overflow-hidden relative">
            <img
              src={project.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070"}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40`}></div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            <h4 className="text-xl font-bold mb-4 group-hover:text-[#112D4E] transition-colors">
              <EditableText
                value={project.title}
                onSave={(v) => {
                  const newProjects = projects.map(p => p.id === project.id ? { ...p, title: v } : p);
                  setProjects(newProjects);
                }}
                isEditing={isEditing}
              />
            </h4>
            
            <div className="flex flex-wrap gap-2 mb-8 flex-1 content-start">
              {project.tags?.map((tag, i) => {
                const tagLower = tag.toLowerCase();
                const isLinkTag = tagLower.includes('google play') || tagLower.includes('구글플레이') || tagLower.includes('구글 플레이') || tagLower.includes('steam') || tagLower.includes('스팀');
                const tagUrl = project.linkUrls?.[tag] || '';

                return (
                  <div key={i} className="flex flex-col gap-1" onClick={e => e.stopPropagation()}>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${isLinkTag ? 'bg-[#3F72AF] text-white shadow-md' : 'bg-[#112D4E]/10 text-[#112D4E]'}`}>
                      {isLinkTag && tagUrl && !isEditing ? (
                        <a href={tagUrl} target="_blank" rel="noreferrer" className="hover:underline">{tag}</a>
                      ) : (
                        <EditableText
                          value={tag}
                          onSave={(v) => {
                            const newTags = [...(project.tags || [])];
                            newTags[i] = v;
                            
                            // If tag name changes, migrate URL if it existed
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
                            const newTags = (project.tags || []).filter((_, index) => index !== i);
                            const newLinkUrls = { ...(project.linkUrls || {}) };
                            delete newLinkUrls[tag];
                            setProjects(projects.map(p => p.id === project.id ? { ...p, tags: newTags, linkUrls: newLinkUrls } : p));
                          }}
                          className="hover:text-red-300 transition-colors ml-1"
                          title="태그 삭제"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                    {isEditing && isLinkTag && (
                      <input
                        type="text"
                        placeholder="링크 URL 입력"
                        value={tagUrl}
                        onChange={(e) => {
                          const newLinkUrls = { ...(project.linkUrls || {}) };
                          newLinkUrls[tag] = e.target.value;
                          setProjects(projects.map(p => p.id === project.id ? { ...p, linkUrls: newLinkUrls } : p));
                        }}
                        className="text-[10px] p-1 border border-[#DBE2EF] rounded bg-white text-[#112D4E] w-full mt-1"
                      />
                    )}
                  </div>
                );
              })}
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTags = [...(project.tags || []), '새 태그'];
                    setProjects(projects.map(p => p.id === project.id ? { ...p, tags: newTags } : p));
                  }}
                  className="px-3 py-1 bg-white/50 text-[#112D4E] rounded-full text-sm font-medium border border-dashed border-[#112D4E]/30 hover:bg-[#112D4E]/10 transition-colors flex items-center gap-1 h-fit"
                >
                  <Plus className="w-3 h-3" /> 추가
                </button>
              )}
            </div>

            <button type="button" onClick={(e) => { e.stopPropagation(); onProjectClick(project); }} className="w-full py-4 glass rounded-2xl text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-[#112D4E] group-hover:text-[#F9F7F7] transition-all">
              상세보기 <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
      {isEditing && (
        <motion.div
          whileHover={{ y: -10 }}
          onClick={() => handleAddProject(category)}
          className="group flex flex-col items-center justify-center glass rounded-[2rem] overflow-hidden transition-all duration-500 min-h-[200px] cursor-pointer border-2 border-dashed border-[#112D4E]/20 hover:bg-white/40"
        >
          <div className="p-4 bg-[#112D4E]/5 rounded-full mb-4 shadow-sm group-hover:scale-110 group-hover:bg-[#112D4E]/10 transition-transform">
             <Plus className="w-8 h-8 text-[#112D4E]" />
          </div>
          <span className="font-bold text-[#112D4E]">새 프로젝트 추가 ({category})</span>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
    >
      {/* 헤더 */}
      <div className="mb-16">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-[#112D4E] hover:text-[#112D4E] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 돌아가기
        </button>
        <div className="flex items-center justify-center gap-3 mb-16">
          <Sparkles className="w-8 h-8 text-[#112D4E]" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">포트폴리오</h2>
        </div>
      </div>

      {/* 1. 메인 프로젝트 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#3F72AF]/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#3F72AF]" />
          </div>
          <h3 className="text-2xl font-black text-[#112D4E]">메인 프로젝트</h3>
        </div>
        {(mainProjects.length > 0 || isEditing) ? renderGrid(mainProjects, '메인 프로젝트') : <p className="text-[#8fabc8] mb-20">등록된 항목이 없습니다.</p>}
      </div>

      {/* 2. 게임 분석 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#3F72AF]/10 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-[#3F72AF]" />
          </div>
          <h3 className="text-2xl font-black text-[#112D4E]">게임 분석</h3>
        </div>
        {(gameProjects.length > 0 || isEditing) ? renderGrid(gameProjects, '게임 분석') : <p className="text-[#8fabc8] mb-20">등록된 항목이 없습니다.</p>}
      </div>

      {/* 3. AI 활용 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#3F72AF]/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#3F72AF]" />
          </div>
          <h3 className="text-2xl font-black text-[#112D4E]">AI 활용</h3>
        </div>
        {(aiProjects.length > 0 || isEditing) ? renderGrid(aiProjects, 'AI 활용') : <p className="text-[#8fabc8] mb-20">등록된 항목이 없습니다.</p>}
      </div>

    </motion.section>
  );
};
