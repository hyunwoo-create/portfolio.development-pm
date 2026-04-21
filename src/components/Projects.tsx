import React from 'react';
import { motion } from 'motion/react';
import { Plus, X, ArrowUpRight } from 'lucide-react';
import { EditableText } from './EditableText';
import { Project } from '../types';

interface ProjectsProps {
  onProjectClick: (project: Project) => void;
  isEditing: boolean;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  limit?: number;
  setView?: (v: any) => void;
}

export const Projects = ({ onProjectClick, isEditing, projects, setProjects, limit, setView }: ProjectsProps) => {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  const updateProject = (id: string, field: string, value: any) => {
    const newProjects = [...projects];
    const pIdx = newProjects.findIndex(p => p.id === id);
    if (pIdx > -1) {
      newProjects[pIdx] = { ...newProjects[pIdx], [field]: value };
      setProjects(newProjects);
    }
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateProject(id, 'image', ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="portfolio-section" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-16">
        <div>
          <div className="inline-block px-4 py-1 rounded-lg bg-[#3F72AF]/10 text-[#3F72AF] text-xs font-bold mb-6">02_PORTFOLIO</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">주요 프로젝트.</h2>
        </div>
        {isEditing && (
          <button 
            onClick={() => {
              const newProj: Project = {
                id: Date.now().toString(),
                title: "새 프로젝트",
                category: "Category",
                description: "설명",
                image: "https://picsum.photos/seed/new/800/600",
                color: "from-blue-500 to-cyan-400",
                tags: ["Tag"],
                details: [],
                content: ""
              };
              setProjects([...projects, newProj]);
            }}
            className="px-6 py-3 bg-[#0a1e36] text-[#1A59A7] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#112D4E] transition-all"
          >
            <Plus className="w-4 h-4" /> 프로젝트 추가
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative h-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer"
            onClick={() => onProjectClick(project)}
          >
            {isEditing && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const newProjects = projects.filter(p => p.id !== project.id);
                  setProjects(newProjects);
                }}
                className="absolute top-6 right-6 z-30 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <img 
              src={project.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070"} 
              alt={project.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-[#112D4E] via-[#112D4E]/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90`}></div>
            
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <div className="flex gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold text-[#F9F7F7]/60 uppercase tracking-widest bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-500">
                <EditableText 
                  value={project.title} 
                  onSave={(v) => updateProject(project.id, 'title', v)} 
                  isEditing={isEditing} 
                />
              </h3>
              <p className="text-[#DBE2EF] text-sm font-medium line-clamp-2 mb-6 group-hover:translate-x-2 transition-transform duration-500 delay-75">
                <EditableText 
                  value={project.description} 
                  onSave={(v) => updateProject(project.id, 'description', v)} 
                  isEditing={isEditing} 
                />
              </p>
              
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <span>View Detail</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>

            {isEditing && (
              <div className="absolute top-6 left-6 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); document.getElementById(`img-input-${project.id}`)?.click(); }}
                  className="w-10 h-10 glass rounded-full flex items-center justify-center text-[#1A59A7]"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <input id={`img-input-${project.id}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(project.id, e)} onClick={e => e.stopPropagation()} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {limit && projects.length > limit && (
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => setView?.('all-projects')}
            className="px-8 py-4 glass rounded-2xl text-sm font-bold flex items-center gap-3 hover:bg-[#112D4E]/10 transition-all group"
          >
            모든 프로젝트 보기
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      )}
    </section>
  );
};
