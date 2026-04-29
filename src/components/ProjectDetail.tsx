import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  isEditing: boolean;
  onSaveContent: (content: string) => void;
}

export const ProjectDetail = ({ project, onBack, isEditing, onSaveContent }: ProjectDetailProps) => (
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
        <div className={`absolute inset-0 bg-gradient-to-t from-[#F9F7F7] via-transparent to-transparent`}></div>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="glass px-3 py-1 rounded-full text-[12px] font-black text-[#1A59A7] uppercase tracking-wider shadow-sm">
              {project.category}
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map(tag => {
                const tagLower = tag.toLowerCase();
                const isLinkTag = tagLower.includes('google play') || tagLower.includes('구글플레이') || tagLower.includes('구글 플레이') || tagLower.includes('steam') || tagLower.includes('스팀');
                const tagUrl = project.linkUrls?.[tag] || '';

                if (isLinkTag && tagUrl) {
                  return (
                    <a key={tag} href={tagUrl} target="_blank" rel="noreferrer" className="text-[11px] font-black text-white bg-[#112D4E] border border-white/20 px-3 py-1.5 rounded-full shadow-lg hover:bg-[#3F72AF] transition-all hover:-translate-y-0.5 flex items-center gap-1">
                      {tag} <ArrowUpRight className="w-3 h-3" />
                    </a>
                  );
                }

                return (
                  <span key={tag} className="text-[12px] font-black text-[#112D4E] bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/50 shadow-sm">
                    #{tag}
                  </span>
                );
              })}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#112D4E] drop-shadow-lg tracking-tight mb-2 leading-tight">{project.title}</h1>
        </div>
      </div>
    </div>

    <div className="glass rounded-[2rem] p-8 md:p-12 markdown-body">
      {isEditing ? (
        <textarea
          className="w-full h-[600px] bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded-2xl p-6 text-[#1A59A7] font-mono text-sm focus:outline-none focus:border-[#112D4E]"
          value={project.content}
          onChange={(e) => onSaveContent(e.target.value)}
        />
      ) : (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          urlTransform={(url) => url}
          components={{
            a: ({node, ...props}) => {
              const href = props.href ? decodeURIComponent(props.href) : '';
              if (href.includes('style:')) {
                const stylePart = href.split('style:')[1];
                const styleParts = stylePart.split(';');
                const customStyle: any = {};
                styleParts.forEach(part => {
                  const [key, val] = part.split(':');
                  if (key && val) {
                    const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    customStyle[camelKey] = val.trim();
                  }
                });
                return (
                  <span 
                    style={customStyle} 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="cursor-text"
                  >
                    {props.children}
                  </span>
                );
              }
              return <a {...props} className="text-[#3F72AF] hover:underline" target="_blank" rel="noopener noreferrer" />;
            },
            p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
            br: () => <br />
          }}
        >
          {project.content}
        </ReactMarkdown>
      )}
    </div>
  </motion.section>
);
