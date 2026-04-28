import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Gamepad2, X, ArrowUpRight, Download, FileText } from 'lucide-react';
import { EditableText } from './EditableText';
import { Project } from '../types';
import { downloadPdf } from '../utils';

interface PortfolioGalleryProps {
  onProjectClick: (p: Project) => void;
  isEditing: boolean;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  setView: (v: any) => void;
}

export const PortfolioGallery = ({ onProjectClick, isEditing, projects, setProjects, setView }: PortfolioGalleryProps) => {
  const portfolioProjects = projects.filter(p => p.category !== '게임 분석');
  const gameProjects = projects.filter(p => p.category === '게임 분석');

  const renderGrid = (list: Project[]) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {list.map((project) => (
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
              className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="삭제"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="aspect-[16/10] overflow-hidden relative">
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
            <p className="text-[#112D4E] text-sm leading-relaxed mb-8 flex-1">
              <EditableText
                value={project.description}
                onSave={(v) => {
                  const newProjects = projects.map(p => p.id === project.id ? { ...p, description: v } : p);
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
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-[#112D4E]" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">포트폴리오</h2>
        </div>
      </div>

      {/* 포트폴리오 그리드 */}
      {portfolioProjects.length > 0 && renderGrid(portfolioProjects)}

      {/* 구분선 + 게임 분석 헤더 */}
      <div className="my-20">
        <div className="h-px bg-gradient-to-r from-transparent via-[#3F72AF]/30 to-transparent mb-12" />
        <div className="flex items-center justify-center gap-3">
          <Gamepad2 className="w-8 h-8 text-[#112D4E]" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">게임 분석</h2>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#3F72AF]/30 to-transparent mt-12" />
      </div>

      {/* 게임 분석 그리드 */}
      {gameProjects.length > 0
        ? renderGrid(gameProjects)
        : <p className="text-center text-[#8fabc8] font-medium">등록된 게임 분석 항목이 없습니다.</p>
      }
    </motion.section>
  );
};
