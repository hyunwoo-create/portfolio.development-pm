import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Download, FileText, ArrowUpRight, ArrowLeft, Sparkles, Plus } from 'lucide-react';
import { EditableText } from './EditableText';
import { AdminTextEditor } from './AdminTextEditor';
import { Project } from '../types';
import { downloadPdf } from '../utils';

interface ProjectsProps {
  onProjectClick: (p: Project) => void;
  isEditing: boolean;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  limit?: number;
  setView?: (v: any) => void;
}

export const Projects = ({ onProjectClick, isEditing, projects, setProjects, limit, setView }: ProjectsProps) => {
  const displayedProjects = limit ? projects.slice(0, limit) : projects;
  const projectFileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleProjectImageUpload = (projectIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const newProjects = [...projects];
      newProjects[projectIdx].image = dataUrl;
      setProjects(newProjects);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="projects" className="py-32 px-6 bg-[#DBE2EF]/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <div className="inline-block px-4 py-1 rounded-lg bg-[#3F72AF]/10 text-[#3F72AF] text-xs font-bold mb-6">02_PORTFOLIO</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">포트폴리오.</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, idx) => (
            <motion.div 
              key={project.id}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col glass rounded-[2rem] overflow-hidden transition-all duration-500"
            >
              {isEditing && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const newProjects = projects.filter(p => p.id !== project.id);
                    setProjects(newProjects);
                  }}
                  className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-[#1A59A7] rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40`}></div>
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-bold text-[#1A59A7] uppercase tracking-wider">
                  <EditableText 
                    value={project.category} 
                    onSave={(v) => {
                      const newProjects = [...projects];
                      newProjects[idx].category = v;
                      setProjects(newProjects);
                    }} 
                    isEditing={isEditing} 
                  />
                </div>
                {isEditing && (
                  <div className="absolute bottom-3 left-3 right-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        projectFileInputRefs.current[idx]?.click();
                      }}
                      className="w-full flex items-center justify-center gap-2 glass rounded-xl px-3 py-2.5 hover:bg-[#112D4E]/10 transition-all text-[#1A59A7]"
                    >
                      <Upload className="w-4 h-4 text-[#112D4E]" />
                      <span className="text-xs font-bold">이미지 업로드</span>
                    </button>
                    <input
                      ref={(el) => { projectFileInputRefs.current[idx] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleProjectImageUpload(idx, e)}
                    />
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#112D4E] transition-colors">
                  <EditableText 
                    value={project.title} 
                    onSave={(v) => {
                      const newProjects = [...projects];
                      newProjects[idx].title = v;
                      setProjects(newProjects);
                    }} 
                    isEditing={isEditing} 
                  />
                </h3>
                <div className="text-[#112D4E] text-sm leading-relaxed mb-8 flex-1">
                <AdminTextEditor
                  isAdmin={isEditing}
                  hideTitle
                  bodyValue={project.description}
                  onBodyChange={(v) => {
                    const newProjects = [...projects];
                    newProjects[idx].description = v;
                    setProjects(newProjects);
                  }}
                  bodyPlaceholder="프로젝트 설명을 입력하세요..."
                  minBodyHeight="80px"
                  readonlyClassName="markdown-body"
                />
              </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="text-[10px] font-bold px-3 py-1 bg-[#DBE2EF]/40 border border-[#3F72AF]/12 rounded-full text-[#0a1e36] flex items-center gap-1">
                      #<EditableText 
                        value={tag} 
                        onSave={(v) => {
                          const newProjects = [...projects];
                          newProjects[idx].tags[tagIdx] = v;
                          setProjects(newProjects);
                        }} 
                        isEditing={isEditing} 
                      />
                      {isEditing && (
                        <button 
                          onClick={() => {
                            const newProjects = [...projects];
                            newProjects[idx].tags.splice(tagIdx, 1);
                            setProjects(newProjects);
                          }}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <button 
                      onClick={() => {
                        const newProjects = [...projects];
                        newProjects[idx].tags.push("새태그");
                        setProjects(newProjects);
                      }}
                      className="text-[10px] font-bold px-3 py-1 bg-[#112D4E]/20 border border-[#112D4E]/30 rounded-full text-[#112D4E] hover:bg-[#112D4E]/30 transition-all"
                    >
                      + 태그 추가
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button type="button" onClick={() => onProjectClick(project)} className="flex-1 py-4 glass rounded-2xl text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-[#112D4E] group-hover:text-[#F9F7F7] transition-all">
                    상세보기 <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <div className="flex-1 relative">
                    <button type="button" onClick={(e) => { e.stopPropagation(); project.downloadUrl ? downloadPdf(project.downloadUrl, project.downloadFileName || 'portfolio.pdf') : (!isEditing && alert('등록된 PDF 파일이 없습니다.')); }} className={`w-full py-4 glass rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${project.downloadUrl ? 'text-[#3F72AF] group-hover:bg-[#3F72AF] group-hover:text-white' : 'text-gray-400 opacity-60'}`}>
                      다운로드 <Download className="w-4 h-4" />
                    </button>
                    {isEditing && (
                      <button type="button" title="PDF 업로드" onClick={(e) => { e.stopPropagation(); const inp = document.createElement('input'); inp.type='file'; inp.accept='application/pdf'; inp.onchange=()=>{ const f=inp.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{ setProjects(projects.map(p=>p.id===project.id?{...p,downloadUrl:ev.target!.result as string,downloadFileName:f.name}:p)); }; r.readAsDataURL(f); }; inp.click(); }} className="absolute -top-2 -right-2 w-6 h-6 bg-[#3F72AF] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40 border border-white">
                        <FileText className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {limit && projects.length > limit && setView && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => setView('all-projects')}
              className="px-8 py-4 glass rounded-2xl font-bold hover:bg-[#112D4E] hover:text-[#F9F7F7] transition-all flex items-center gap-2 mx-auto"
            >
              더보기 <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export const Portfolio = ({ onProjectClick, isEditing, projects, setProjects, setView }: { onProjectClick: (p: Project) => void, isEditing: boolean, projects: Project[], setProjects: (p: Project[]) => void, setView: (v: any) => void }) => {
  const categories = Array.from(new Set(projects.map(p => p.category)));

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div>
          <button 
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-[#112D4E] hover:text-[#112D4E] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 돌아가기
          </button>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">포트폴리오 갤러리.</h2>
        </div>
      </div>

      <div className="space-y-24">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#112D4E]" /> {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(p => p.category === category).map((project, idx) => (
                <motion.div 
                  key={project.id}
                  whileHover={{ y: -10 }}
                  className="group relative flex flex-col glass rounded-[2rem] overflow-hidden transition-all duration-500"
                >
                  {isEditing && (
                    <button 
                      onClick={() => {
                        if (confirm("이 포트폴리오 항목을 삭제하시겠습니까?")) {
                          const newProjects = projects.filter(p => p.id !== project.id);
                          setProjects(newProjects);
                        }
                      }}
                      className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-[#1A59A7] rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      title="삭제"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={project.image} 
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
                          const newProjects = [...projects];
                          const pIdx = newProjects.findIndex(p => p.id === project.id);
                          newProjects[pIdx].title = v;
                          setProjects(newProjects);
                        }} 
                        isEditing={isEditing} 
                      />
                    </h4>
                    <p className="text-[#112D4E] text-sm leading-relaxed mb-8 flex-1">
                      <EditableText 
                        value={project.description} 
                        onSave={(v) => {
                          const newProjects = [...projects];
                          const pIdx = newProjects.findIndex(p => p.id === project.id);
                          newProjects[pIdx].description = v;
                          setProjects(newProjects);
                        }} 
                        isEditing={isEditing} 
                        multiline
                      />
                    </p>
                    
                    <div className="flex gap-2">
                      <button type="button" onClick={() => onProjectClick(project)} className="flex-1 py-4 glass rounded-2xl text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-[#112D4E] group-hover:text-[#F9F7F7] transition-all">
                        상세보기 <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <div className="flex-1 relative">
                        <button type="button" onClick={(e) => { e.stopPropagation(); project.downloadUrl ? downloadPdf(project.downloadUrl, project.downloadFileName || 'portfolio.pdf') : (!isEditing && alert('등록된 PDF 파일이 없습니다.')); }} className={`w-full py-4 glass rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${project.downloadUrl ? 'text-[#3F72AF] group-hover:bg-[#3F72AF] group-hover:text-white' : 'text-gray-400 opacity-60'}`}>
                          다운로드 <Download className="w-4 h-4" />
                        </button>
                        {isEditing && (
                          <button type="button" title="PDF 업로드" onClick={(e) => { e.stopPropagation(); const inp = document.createElement('input'); inp.type='file'; inp.accept='application/pdf'; inp.onchange=()=>{ const f=inp.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{ setProjects(projects.map(p=>p.id===project.id?{...p,downloadUrl:ev.target!.result as string,downloadFileName:f.name}:p)); }; r.readAsDataURL(f); }; inp.click(); }} className="absolute -top-2 -right-2 w-6 h-6 bg-[#3F72AF] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40 border border-white">
                            <FileText className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export const ProjectDetail = ({ project, onBack, isEditing, onSaveContent }: { project: Project, onBack: () => void, isEditing: boolean, onSaveContent: (content: string) => void }) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="pt-32 pb-24 px-6 max-w-4xl mx-auto"
  >
    <button 
      onClick={onBack}
      className="flex items-center gap-2 text-[#112D4E] hover:text-[#112D4E] transition-colors mb-12 group"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 프로젝트 목록으로
    </button>

    <div className="glass rounded-[2.5rem] overflow-hidden mb-12">
      <div className="aspect-[21/9] relative">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent`}></div>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="glass px-3 py-1 rounded-full text-[10px] font-bold text-[#1A59A7] uppercase tracking-wider">
              {project.category}
            </span>
            <div className="flex gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold text-[#112D4E]">#{tag}</span>
              ))}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A59A7]">{project.title}</h1>
        </div>
      </div>
    </div>

    <div className="glass rounded-[2rem] p-8 md:p-12">
      <AdminTextEditor
        isAdmin={isEditing}
        hideTitle
        bodyValue={project.content || ''}
        onBodyChange={onSaveContent}
        bodyPlaceholder="프로젝트 상세 내용을 입력하세요. 마크다운 형식으로 저장됩니다."
        minBodyHeight="500px"
        readonlyClassName="markdown-body"
      />
    </div>
  </motion.section>
);
