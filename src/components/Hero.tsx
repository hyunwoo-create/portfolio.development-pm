import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Settings, ChevronRight } from 'lucide-react';
import { EditableText } from './EditableText';
import { processImageHighQuality } from '../utils';
import { HeroVideoSettingsModal } from './HeroVideoSettingsModal';

interface HeroProps {
  onNavClick: (id: string) => void;
  onToggleAdmin: () => void;
  isEditing: boolean;
  content: any;
  setContent: (c: any) => void;
}

const isDirectVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('.mp4') || url.includes('.webm') || url.startsWith('data:video/') || url.startsWith('blob:');
};

export const Hero = ({ onNavClick, onToggleAdmin, isEditing, content, setContent }: HeroProps) => {
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageHighQuality(file).then(dataUrl => {
      setContent({...content, heroImage: dataUrl});
    }).catch(console.error);
  };

  return (
    <>
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F9F7F7] pt-20">
      
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {content.heroVideoUrl ? (
          <div className="w-full h-full relative opacity-20">
            {isDirectVideoUrl(content.heroVideoUrl) ? (
              <video
                src={content.heroVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={content.heroVideoUrl}
                className="w-full h-full object-cover scale-[1.5]"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F9F7F7] via-transparent to-[#F9F7F7]"></div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] text-[#3F72AF]">
            <svg viewBox="0 0 800 800" className="w-[800px] h-[800px]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M120.5 450.5C90.2 410.2 78.5 350.5 120.5 280.5C180.8 180.2 320.5 150.5 450.5 120.5C540.2 100.2 650.5 180.5 720.5 280.5Z" />
              <path d="M650.5 620.5C550.2 720.2 380.5 780.5 280.5 720.5C180.2 650.2 150.8 520.2 120.5 450.5" />
            </svg>
          </div>
        )}
      </div>

      <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[22rem] md:max-w-[32rem] h-[52vh] md:h-[60vh] flex items-end justify-center pointer-events-none z-10">
        <div className="relative w-full h-full flex items-end justify-center">
          {content.heroImage ? (
            <div className="relative w-full max-w-full h-full max-h-full flex items-end justify-center drop-shadow-2xl overflow-hidden rounded-t-[2.5rem] border-x border-t border-[#DBE2EF] bg-gradient-to-t from-[#DBE2EF]/20 to-transparent">
              <img 
                src={content.heroImage} 
                alt="Profile" 
                className="w-full h-full object-cover object-top pointer-events-none" 
                style={{ imageRendering: 'high-quality' as any }}
              />
            </div>
          ) : (
            <div className="w-[80%] h-[80%] bg-[#DBE2EF] rounded-t-[5rem] flex flex-col items-center justify-center text-[#3F72AF]/40 border-4 border-white shadow-xl">
              <Upload className="w-24 h-24 mb-3" />
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[22rem] md:max-w-[32rem] h-[52vh] md:h-[60vh] pointer-events-none z-50">
          <div className="relative w-full h-full">
            <button onClick={() => imageFileInputRef.current?.click()} className="absolute bottom-8 right-0 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-[#112D4E] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#0a1e36] transition-all border-2 border-white pointer-events-auto"><Upload className="w-5 h-5 md:w-6 md:h-6" /></button>
            <button onClick={() => setIsVideoModalOpen(true)} className="absolute bottom-8 left-0 md:left-8 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-[#112D4E] shadow-lg hover:bg-[#F9F7F7] transition-all border-2 border-[#DBE2EF] pointer-events-auto"><Settings className="w-5 h-5 md:w-6 md:h-6" /></button>
            <input ref={imageFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>
      )}

      <div className="relative z-20 w-full max-w-7xl mx-auto min-h-[calc(100vh-5rem)] grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_1fr_auto] gap-8 px-6 lg:px-12 py-12 pointer-events-none">
        <div className="flex flex-col items-start justify-start pointer-events-auto md:pr-12 md:mt-8">
          <h1 className="font-black leading-[1.1] text-[#112D4E] tracking-tight mb-6">
            <EditableText
              value={content.titleLine1 || "기획의도를 알고"}
              onSave={(v) => setContent({...content, titleLine1: v})}
              isEditing={isEditing}
              multiline
              className="block leading-[1.1] whitespace-pre-wrap"
              style={content.tile1Style || {fontSize:'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing:'-0.02em', fontWeight:'900'}}
              styleData={content.tile1Style || {fontSize:'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing:'-0.02em', fontWeight:'900'}}
              onStyleSave={(s) => setContent({...content, tile1Style: s})}
            />
            <EditableText
              value={content.titleLine2 || "결과로 증명하는 PM"}
              onSave={(v) => setContent({...content, titleLine2: v})}
              isEditing={isEditing}
              multiline
              className="block text-[#3F72AF] mt-2 leading-[1.1] whitespace-pre-wrap"
              style={content.tile2Style || {fontSize:'clamp(3rem, 5.5vw, 5rem)', letterSpacing:'-0.05em', fontWeight:'900'}}
              styleData={content.tile2Style || {fontSize:'clamp(3rem, 5.5vw, 5rem)', letterSpacing:'-0.05em', fontWeight:'900'}}
              onStyleSave={(s) => setContent({...content, tile2Style: s})}
            />
          </h1>
        </div>
        
        <div className="flex flex-col items-end justify-start pointer-events-auto text-right md:mt-16">
          <div className="max-w-[280px]">
            <EditableText
              value={content.description || "사용자의 경험을 논리적으로 설계하고..."}
              onSave={(v) => setContent({...content, description: v})}
              isEditing={isEditing}
              multiline
              className="text-[#112D4E] font-medium leading-relaxed whitespace-pre-wrap"
              style={content.descStyle || {fontSize:'0.95rem'}}
              styleData={content.descStyle || {fontSize:'0.95rem'}}
              onStyleSave={(s) => setContent({...content, descStyle: s})}
            />
          </div>
        </div>

        <div className="hidden md:flex flex-col items-start justify-center pointer-events-auto z-20 gap-6 translate-y-8 md:translate-y-10">
          <div className="bg-[#DBE2EF] text-[#112D4E] font-black text-[11px] md:text-xs tracking-widest px-5 py-1.5 rounded-full mb-1 shadow-sm">POINT</div>
          {[1, 2, 3].map(num => (
            <div key={num} className="flex px-5 py-3 md:px-7 md:py-5 bg-white/70 backdrop-blur-md rounded-[1.5rem] border border-[#DBE2EF]/80 shadow-md items-center gap-4 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <span className="text-4xl md:text-5xl font-black text-[#112D4E] tracking-tighter leading-none">
                <EditableText value={content[`point${num}Value`] || "10"} onSave={(v) => setContent({...content, [`point${num}Value`]: v})} isEditing={isEditing} />
              </span>
              <div className="text-[11px] md:text-xs font-black text-[#3F72AF] leading-snug tracking-widest uppercase whitespace-pre-wrap">
                <EditableText value={content[`point${num}Label`] || "YEARS\nEXPERIENCE"} onSave={(v) => setContent({...content, [`point${num}Label`]: v})} isEditing={isEditing} multiline />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-col items-end justify-center pointer-events-auto z-20 gap-4 translate-y-8 md:translate-y-10">
          <button onClick={() => onNavClick('resume-section')} className="px-8 py-4 bg-white/70 backdrop-blur-md rounded-2xl border border-[#DBE2EF]/80 shadow-md flex items-center justify-between gap-6 hover:shadow-lg transition-all transform hover:-translate-y-1 w-[220px] group">
            <span className="text-sm font-bold text-[#112D4E] tracking-tight">이력서 바로가기</span>
            <ChevronRight className="w-5 h-5 text-[#3F72AF] group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => onNavClick('portfolio-view')} className="px-8 py-4 bg-[#112D4E]/90 backdrop-blur-md rounded-2xl border border-[#112D4E] shadow-xl flex items-center justify-between gap-6 hover:shadow-lg transition-all transform hover:-translate-y-1 w-[220px] group">
            <span className="text-sm font-bold text-white tracking-tight">포트폴리오 바로가기</span>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      <HeroVideoSettingsModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} videoUrl={content.heroVideoUrl || ""} onSave={(url) => setContent({...content, heroVideoUrl: url})} />
    </section>
      <div className="relative w-full h-0 flex justify-center z-[100] pointer-events-none">
        <div className="absolute -top-10 flex flex-col items-center animate-pulse opacity-90">
          <span className="text-[11px] md:text-sm font-black tracking-widest text-[#3F72AF] mb-2 uppercase drop-shadow-sm">SCROLL</span>
          <div className="w-[2px] h-16 md:h-24 bg-gradient-to-b from-[#3F72AF] via-[#3F72AF] to-transparent shadow-sm"></div>
        </div>
      </div>
    </>
  );
};
