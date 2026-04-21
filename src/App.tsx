/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
 Gamepad2, 
 Layers, 
 ScrollText, 
 Target, 
 Cpu, 
 Code2, 
 ExternalLink, 
 Mail, 
 Github, 
 Linkedin,
 ChevronRight,
 Terminal,
 Zap,
 ArrowUpRight,
 Sparkles,
 Gamepad,
 User,
 Briefcase,
 GraduationCap,
 Award,
 Wrench,
 ArrowLeft,
 Menu,
 X,
 ArrowUp,
 Monitor,
 Smartphone,
 Package as PackageIcon,
 Clock,
 Save,
 Edit3,
 Lock,
 Plus,
 Video,
 Settings,
 Trash2,
 Upload,
 Image as ImageIcon,
 FolderOpen,
 Download,
 FileText,
 Phone,
 MapPin,
 Calendar,
 Home,
 PlayCircle
} from 'lucide-react';

import { Project, SkillTab, ToolItem, GameHistory, ResumeData, Skill, SelfIntroTab } from './types';
import { GAME_HISTORY, RESUME_DATA, PROJECTS, PORTFOLIO_PROJECTS, SKILLS, INITIAL_SKILL_TABS, INITIAL_TOOLS } from './data/constants';
import { downloadPdf, processImageHighQuality } from './utils';

import { useEditableContent } from './hooks';
// --- Components ---

const EditableText = ({ 
 value, 
 onSave, 
 isEditing, 
 className = "", 
 multiline = false,
	disableMarkdown = false,
  style = {},
  styleData,
  onStyleSave 
}: { 
  value: string, 
  onSave: (v: string) => void, 
  isEditing: boolean, 
  className?: string,
  multiline?: boolean,
  disableMarkdown?: boolean,
  style?: React.CSSProperties,
  styleData?: any,
  onStyleSave?: (s: any) => void
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStyleChange = useCallback((newStyle: any) => {
    if (!onStyleSave || !styleData) return;

    const target = multiline ? textareaRef.current : inputRef.current;
    if (target && target.selectionStart !== null && target.selectionEnd !== null && target.selectionStart !== target.selectionEnd) {
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const selectedText = value.substring(start, end);
      
      const changedProp = Object.keys(newStyle).find(k => newStyle[k] !== styleData[k]);
      if (changedProp) {
        const kebabKey = changedProp.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        const styleTag = `#style:${kebabKey}:${newStyle[changedProp]}`;
        const newValue = value.substring(0, start) + `[${selectedText}](${styleTag})` + value.substring(end);
        onSave(newValue);
        return;
      }
    }
    onStyleSave(newStyle);
  }, [multiline, value, onSave, onStyleSave, styleData]);

  if (!isEditing) {
    if (disableMarkdown) {
      return <span className={className} style={style}>{String(value || '')}</span>;
    }
    return (
      <span className={className} style={style}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          urlTransform={(url) => url}
          components={{ 
            p: ({node, ...props}) => <span className={multiline ? "block mb-2 last:mb-0" : "inline"} {...props} />,
            a: ({node, ...props}) => {
              const href = props.href ? decodeURIComponent(props.href) : '';
              // Use includes to catch cases where the protocol might be prefixed with a base URL
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
            strong: ({node, ...props}) => <strong {...props} className="font-extrabold" />,
            em: ({node, ...props}) => <em {...props} className="italic" />,
            ul: ({node, ...props}) => <ul {...props} className="list-disc list-inside mt-1 space-y-1" />,
            ol: ({node, ...props}) => <ol {...props} className="list-decimal list-inside mt-1 space-y-1" />,
            li: ({node, ...props}) => <li {...props} className="leading-snug" />,
            h1: ({node, ...props}) => <strong {...props} className="text-2xl font-bold mt-2 block" />,
            h2: ({node, ...props}) => <strong {...props} className="text-xl font-bold mt-2 block" />,
            h3: ({node, ...props}) => <strong {...props} className="text-lg font-bold mt-1 block" />,
            br: () => <br />
          }}
        >
          {String(value || '')}
        </ReactMarkdown>
      </span>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      {isEditing && isFocused && styleData && handleStyleChange && (
        <div className="absolute bottom-full left-0 z-[100] mb-2 pointer-events-auto">
          <TextStyleEditor style={styleData} onStyleChange={handleStyleChange} />
        </div>
      )}
      {multiline ? (
        <textarea
          ref={textareaRef}
          className={`w-full max-w-full bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded p-2 text-[#1A59A7] focus:outline-none focus:border-[#112D4E] ${className}`}
          value={value}
          onChange={(e) => onSave(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (containerRef.current?.contains(e.relatedTarget as Node)) return;
            setIsFocused(false);
          }}
          rows={3}
          style={style}
        />
      ) : (
        <input
          ref={inputRef}
          className={`w-full max-w-full bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded px-2 py-1 text-[#1A59A7] focus:outline-none focus:border-[#112D4E] ${className}`}
          value={value}
          onChange={(e) => onSave(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (containerRef.current?.contains(e.relatedTarget as Node)) return;
            setIsFocused(false);
          }}
          style={style}
        />
      )}
    </div>
  );
};


const TextStyleEditor = ({ style, onStyleChange }: { style: any, onStyleChange: (s: any) => void }) => {
	const fonts = [
	{ label: 'Pretendard (기본)', value: 'Pretendard Variable, Pretendard, sans-serif' },
	{ label: 'Noto Sans KR', value: '"Noto Sans KR", sans-serif' },
	{ label: 'Nanum Gothic', value: '"Nanum Gothic", sans-serif' },
	{ label: 'Nanum Myeongjo', value: '"Nanum Myeongjo", serif' },
	{ label: 'Black Han Sans', value: '"Black Han Sans", sans-serif' },
	{ label: 'Do Hyeon', value: '"Do Hyeon", sans-serif' },
	{ label: 'Gothic A1', value: '"Gothic A1", sans-serif' },
	{ label: 'IBM Plex Sans KR', value: '"IBM Plex Sans KR", sans-serif' },
	];
	const colorPresets = [
	{ label: '기본 (다크)', value: '' },
	{ label: '딥네이비', value: '#112D4E' },
	{ label: '블루', value: '#1A59A7' },
	{ label: '미디엄블루', value: '#3F72AF' },
	{ label: '화이트', value: '#F9F7F7' },
	{ label: '블랙', value: '#0a1e36' },
	];
	const highlightPresets = [
	{ label: '없음', value: '' },
	{ label: '블루 하이라이트', value: 'rgba(63,114,175,0.18)' },
	{ label: '네이비 하이라이트', value: 'rgba(17,45,78,0.12)' },
	{ label: '옐로우 하이라이트', value: 'rgba(250,204,21,0.3)' },
	{ label: '그린 하이라이트', value: 'rgba(34,197,94,0.2)' },
	{ label: '핑크 하이라이트', value: 'rgba(244,114,182,0.2)' },
	];
	return (
	<div className="flex flex-wrap items-center gap-2 mt-1 mb-2 p-2 bg-[#DBE2EF]/80 rounded-lg border border-[#3F72AF]/30 backdrop-blur-sm">
	<div className="flex items-center gap-1">
	<label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">폰트</label>
	<select value={style.fontFamily || ''} onChange={e => onStyleChange({...style, fontFamily: e.target.value})} className="text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E] max-w-[140px]">
	<option value="">기본</option>
	{fonts.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
	</select>
	</div>
	<div className="flex items-center gap-1">
	<label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">크기</label>
	<input type="text" value={style.fontSize || ''} onChange={e => onStyleChange({...style, fontSize: e.target.value})} className="w-[60px] text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]" placeholder="3rem"/>
	</div>
	<div className="flex items-center gap-1">
	<label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">자간</label>
	<input type="text" value={style.letterSpacing || ''} onChange={e => onStyleChange({...style, letterSpacing: e.target.value})} className="w-[60px] text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]" placeholder="0.3em"/>
	</div>
	<div className="flex items-center gap-1">
	<label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">줄높이</label>
	<input type="text" value={style.lineHeight || ''} onChange={e => onStyleChange({...style, lineHeight: e.target.value})} className="w-[60px] text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]" placeholder="1.2"/>
	</div>
	<div className="flex items-center gap-1">
	<label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">굵기</label>
	<select value={style.fontWeight || ''} onChange={e => onStyleChange({...style, fontWeight: e.target.value})} className="text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]">
	<option value="">기본</option>
	<option value="400">Regular (400)</option>
	<option value="500">Medium (500)</option>
	<option value="600">SemiBold (600)</option>
	<option value="700">Bold (700)</option>
	<option value="800">ExtraBold (800)</option>
	<option value="900">Black (900)</option>
	</select>
	</div>
	<div className="flex items-center gap-1">
	<label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">글자색</label>
	<select value={style.color || ''} onChange={e => onStyleChange({...style, color: e.target.value})} className="text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]">
	{colorPresets.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
	</select>
	<input type="color" value={style.color || '#112D4E'} onChange={e => onStyleChange({...style, color: e.target.value})} className="w-6 h-6 rounded border border-[#3F72AF]/20 cursor-pointer" title="직접 선택"/>
	</div>
	<div className="flex items-center gap-1">
	<label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">하이라이트</label>
	<select value={style.backgroundColor || ''} onChange={e => onStyleChange({...style, backgroundColor: e.target.value})} className="text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]">
	{highlightPresets.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
	</select>
	</div>
	</div>
	);
};

const PasswordModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (pw: string) => void }) => {
 const [password, setPassword] = useState('');

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 onConfirm(password);
 setPassword('');
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#112D4E]/80 backdrop-blur-sm"
 onClick={onClose}
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="relative max-w-md w-full glass rounded-[2rem] p-8"
 onClick={e => e.stopPropagation()}
 >
 <h3 className="text-2xl font-bold text-[#1A59A7] mb-6 text-center">관리자 인증</h3>
 <form onSubmit={handleSubmit} className="space-y-6">
 <div>
 <label className="block text-sm font-medium text-[#112D4E] mb-2">비밀번호를 입력하세요</label>
 <input
 type="password"
 autoFocus
 className="w-full bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded-xl px-4 py-3 text-[#1A59A7] focus:outline-none focus:border-[#112D4E] transition-all text-center text-2xl tracking-widest"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 />
 </div>
 <div className="flex gap-4">
 <button
 type="button"
 onClick={onClose}
 className="flex-1 px-6 py-3 glass rounded-xl text-[#1A59A7] font-bold hover:bg-[#112D4E]/10 transition-all"
 >
 취소
 </button>
 <button
 type="submit"
 className="flex-1 px-6 py-3 bg-[#0a1e36] rounded-xl text-[#1A59A7] font-bold hover:bg-[#112D4E] transition-all shadow-lg shadow-[#112D4E]/25"
 >
 확인
 </button>
 </div>
 </form>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
};

const Navbar = ({ setView, currentView, onNavClick, isEditing, setIsEditing }: { setView: (v: any) => void, currentView: string, onNavClick: (id: string) => void, isEditing: boolean, setIsEditing: (v: boolean) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Here are the links in the EXACT requested order
  const navLinks = [
    { label: '소개', action: () => { onNavClick('about'); setIsMenuOpen(false); } },
    { label: '이력서', action: () => { onNavClick('resume-section'); setIsMenuOpen(false); } },
    { label: '포트폴리오', action: () => { onNavClick('portfolio-section'); setIsMenuOpen(false); } },
    { label: '핵심 역량', action: () => { onNavClick('skills'); setIsMenuOpen(false); } },
    { label: '사용 Tool', action: () => { onNavClick('my-tools'); setIsMenuOpen(false); } },
  ];

  const handleAdminClick = () => {
    if (isEditing) {
      setIsEditing(false);
      alert("관리자 모드가 비활성화되었습니다.");
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordConfirm = (pw: string) => {
    if (pw === 'qwer154') {
      setIsEditing(true);
      setIsPasswordModalOpen(false);
      alert("관리자 모드가 활성화되었습니다. 내용을 클릭하여 수정하세요.");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <>
      <header className="fixed top-4 w-full z-50 px-4 md:px-8 flex justify-between items-start print:hidden pointer-events-none">
        {/* Left: Home Brand */}
        <div 
          className="pointer-events-auto flex flex-col items-center gap-1 cursor-pointer group select-none relative" 
          onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }}
          onDoubleClick={handleAdminClick}
          title="더블클릭하여 관리자 모드"
        >
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-lg shadow-[#112D4E]/10 group-hover:scale-105 transition-transform border border-white/20">
            <Home className="text-[#1A59A7] w-6 h-6 cursor-pointer pointer-events-none" />
          </div>
          {isEditing && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#3F72AF]/20 border border-[#3F72AF]/50 rounded text-[10px] text-[#112D4E] font-bold uppercase animate-pulse pointer-events-none whitespace-nowrap">
              Edit Mode
            </div>
          )}
        </div>

        {/* Center: Navigation Links in a pill */}
        <nav className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-0 hidden md:flex items-center gap-8 glass rounded-full px-8 h-12 shadow-lg shadow-[#112D4E]/10 border border-white/20">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="text-[#112D4E] hover:text-[#3F72AF] font-bold text-[0.95rem] tracking-wide transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-[#3F72AF] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Admin & Mobile Menu */}
        <div className="pointer-events-auto flex items-center gap-2 relative">
          <button
            onClick={handleAdminClick}
            className="hidden md:flex w-12 h-12 items-center justify-center glass rounded-2xl hover:bg-[#112D4E]/10 transition-colors shadow-lg shadow-[#112D4E]/10 border border-white/20"
            title={isEditing ? '완료' : '관리자모드'}
          >
            {isEditing ? <Lock className="w-5 h-5 text-[#112D4E]" /> : <Settings className="w-5 h-5 text-[#112D4E]" />}
          </button>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="w-12 h-12 flex items-center justify-center glass rounded-2xl text-[#112D4E] shadow-lg shadow-[#112D4E]/10 border border-white/20"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <div className="w-5 h-5 flex flex-col justify-center gap-1.5"><div className="w-full h-0.5 bg-current"></div><div className="w-full h-0.5 bg-current"></div><div className="w-full h-0.5 bg-current"></div></div>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 glass rounded-2xl p-4 flex flex-col gap-2 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="w-full text-left px-4 py-3 text-[#112D4E] font-bold rounded-xl hover:bg-[#DBE2EF] transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { handleAdminClick(); setIsMenuOpen(false); }}
              className="w-full flex items-center justify-start gap-2 px-4 py-3 text-[#112D4E] font-bold rounded-xl bg-[#DBE2EF]/50 hover:bg-[#DBE2EF] transition-colors"
            >
              {isEditing ? <Lock className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
              {isEditing ? '관리자 모드 완료' : '관리자 모드'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        onConfirm={handlePasswordConfirm} 
      />
    </>
  );
};
const convertToEmbedUrl = (url: string): string => {
 if (!url) return url;
 // Already an embed URL
 if (url.includes('/embed/')) return url;
 // youtube.com/watch?v=VIDEO_ID
 const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
 if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${watchMatch[1]}`;
 // youtu.be/VIDEO_ID
 const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
 if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortMatch[1]}`;
 // youtube.com/shorts/VIDEO_ID
 const shortsMatch = url.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
 if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortsMatch[1]}`;
 return url;
};

const isDirectVideoUrl = (url: string): boolean => {
 if (!url) return false;
 return url.includes('.mp4') || url.includes('.webm') || url.startsWith('data:video/') || url.startsWith('blob:');
};

// --- Hero Video Settings Modal ---
const HeroVideoSettingsModal = ({ isOpen, onClose, videoUrl, onSave }: { isOpen: boolean, onClose: () => void, videoUrl: string, onSave: (url: string) => void }) => {
 const [url, setUrl] = useState(videoUrl);
 const videoFileInputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
 setUrl(videoUrl);
 }, [videoUrl]);

 const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 // Use URL.createObjectURL for video files (FileReader may fail with large videos)
 const objectUrl = URL.createObjectURL(file);
 setUrl(objectUrl);
 };

 const handleSave = () => {
 // Auto-convert YouTube URLs to embed format
 const processedUrl = isDirectVideoUrl(url) ? url : convertToEmbedUrl(url);
 onSave(processedUrl);
 onClose();
 };

 if (!isOpen) return null;

 return (
 <AnimatePresence>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#112D4E]/70 backdrop-blur-md"
 onClick={onClose}
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="glass rounded-3xl p-8 w-full max-w-lg border border-[#3F72AF]/12"
 onClick={e => e.stopPropagation()}
 >
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 bg-gradient-to-br from-[#112D4E] to-[#3F72AF] rounded-xl flex items-center justify-center">
 <Video className="w-5 h-5 text-[#1A59A7]" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-[#1A59A7]">Hero 영상 설정</h3>
 <p className="text-xs text-[#112D4E]">영상 파일을 업로드하거나 URL을 입력하세요</p>
 </div>
 </div>
 <div className="space-y-4">
 {/* File Upload */}
 <div>
 <label className="block text-sm font-medium text-[#112D4E] mb-2">영상 파일 업로드</label>
 <button
 onClick={() => videoFileInputRef.current?.click()}
 className="w-full flex items-center justify-center gap-3 bg-[#DBE2EF]/40 border-2 border-dashed border-[#3F72AF]/20 rounded-xl px-4 py-4 text-[#1A59A7] hover:bg-[#112D4E]/10 hover:border-[#112D4E]/50 transition-all"
 >
 <Upload className="w-5 h-5 text-[#112D4E]" />
 <span className="text-sm font-bold">영상 파일 선택 (.mp4, .webm)</span>
 </button>
 <input
 ref={videoFileInputRef}
 type="file"
 accept="video/mp4,video/webm"
 className="hidden"
 onChange={handleVideoFileUpload}
 />
 </div>

 <div className="flex items-center gap-3 text-[#0a1e36]">
 <div className="flex-1 h-px bg-[#DBE2EF]/60"></div>
 <span className="text-xs font-bold">또는</span>
 <div className="flex-1 h-px bg-[#DBE2EF]/60"></div>
 </div>

 {/* URL Input */}
 <div>
 <label className="block text-sm font-medium text-[#112D4E] mb-2">영상 URL</label>
 <input
 type="text"
 className="w-full bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded-xl px-4 py-3 text-[#1A59A7] focus:outline-none focus:border-[#112D4E] transition-all placeholder-[#8fabc8]"
 value={url}
 onChange={(e) => setUrl(e.target.value)}
 placeholder="https://www.youtube.com/watch?v=... 또는 youtu.be/..."
 />
 </div>
 <p className="text-xs text-[#0a1e36]">YouTube URL을 그대로 붙여넣으세요. 자동으로 변환됩니다. 직접 영상 파일(.mp4, .webm)도 지원됩니다.</p>

 {url && (
 <div className="p-3 bg-[#3F72AF]/10 border border-[#3F72AF]/20 rounded-xl">
 <p className="text-xs text-[#3F72AF] font-bold">✓ 영상이 설정되었습니다</p>
 <p className="text-[10px] text-[#0a1e36] mt-1 truncate">{url.startsWith('data:') || url.startsWith('blob:') ? '업로드된 파일' : url}</p>
 </div>
 )}

 <div className="flex gap-3 pt-2">
 <button
 onClick={onClose}
 className="flex-1 px-6 py-3 glass rounded-xl text-[#1A59A7] font-bold hover:bg-[#112D4E]/10 transition-all"
 >
 취소
 </button>
 <button
 onClick={handleSave}
 className="flex-1 px-6 py-3 bg-[#0a1e36] rounded-xl text-[#1A59A7] font-bold hover:bg-[#112D4E] transition-all shadow-lg shadow-[#112D4E]/25"
 >
 저장
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 </AnimatePresence>
 );
};

const Hero = ({ onNavClick, isEditing, onToggleAdmin, content, setContent }: { onNavClick: (id: string) => void, isEditing: boolean, onToggleAdmin: () => void, content: any, setContent: (c: any) => void }) => {
  const imageFileInputRef = useRef<HTMLInputElement>(null);

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
      
      {/* Background Brush Stroke */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg viewBox="0 0 800 800" className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-[0.08] text-[#3F72AF] absolute -translate-y-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M120.5 450.5C90.2 410.2 78.5 350.5 120.5 280.5C180.8 180.2 320.5 150.5 450.5 120.5C540.2 100.2 650.5 180.5 720.5 280.5C790.8 380.2 750.5 520.5 650.5 620.5C550.2 720.2 380.5 780.5 280.5 720.5C180.2 650.2 150.8 520.2 120.5 450.5Z" />
          <path d="M220.5 650.5C190.2 610.2 178.5 550.5 220.5 480.5C280.8 380.2 420.5 350.5 550.5 320.5C640.2 300.2 750.5 380.5 820.5 480.5" stroke="currentColor" strokeWidth="40" strokeLinecap="round" opacity="0.5" />
          <path d="M50.5 350.5C90.2 210.2 178.5 150.5 220.5 280.5" stroke="currentColor" strokeWidth="60" strokeLinecap="round" opacity="0.3" />
        </svg>
      </div>

      {/* Center Portrait */}
      <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[22rem] md:max-w-[32rem] h-[52vh] md:h-[60vh] flex items-end justify-center pointer-events-none z-10">
        <div className="relative w-full h-full flex items-end justify-center">
          {content.heroImage ? (
            <div className="relative w-full max-w-full h-full max-h-full flex items-end justify-center drop-shadow-2xl overflow-hidden rounded-t-[2.5rem] border-x border-t border-[#DBE2EF] bg-gradient-to-t from-[#DBE2EF]/20 to-transparent">
              <img 
                src={content.heroImage} 
                alt="Profile" 
                className="w-full h-full object-cover object-top pointer-events-none" 
                style={{ 
                  imageRendering: 'high-quality' as any,
                  transform: 'translateZ(0)',
                  willChange: 'transform'
                }}
              />
            </div>
          ) : (            <div className="w-[80%] h-[80%] bg-[#DBE2EF] rounded-t-[5rem] flex flex-col items-center justify-center text-[#3F72AF]/40 border-4 border-white shadow-xl">
              <User className="w-24 h-24 mb-3" />
              <p className="text-sm font-medium">사진 업로드</p>
              <p className="text-[10px]">(배경있는 사진도 둥글게 처리됨)</p>
            </div>
          )}
        </div>
      </div>

      {/* Hero Admin Controls - Separate layer to avoid overlapping text while remaining clickable */}
      {isEditing && (
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[22rem] md:max-w-[32rem] h-[52vh] md:h-[60vh] pointer-events-none z-50">
          <div className="relative w-full h-full">
            <button
              onClick={() => imageFileInputRef.current?.click()}
              className="absolute bottom-8 right-0 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-[#112D4E] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#0a1e36] transition-all border-2 border-white pointer-events-auto"
            >
              <Upload className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <input ref={imageFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>
      )}

      {/* Grid Layout for Text Corners */}
      <div className="relative z-20 w-full max-w-7xl mx-auto min-h-[calc(100vh-5rem)] grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_1fr_auto] gap-8 px-6 lg:px-12 py-12 pointer-events-none">
        
        {/* Top Left: Title */}
        <div className="flex flex-col items-start justify-start pointer-events-auto md:pr-12 md:mt-8">
          <h1 className="font-black leading-[1.1] text-[#112D4E] tracking-tight mb-6">
            <EditableText
              value={content.titleLine1 || "10년의 조율\n감각으로 협업\n을 완성하고"}
              onSave={(v) => setContent({...content, titleLine1: v})}
              isEditing={isEditing}
              multiline
              className="block leading-[1.1] whitespace-pre-wrap"
              style={content.titleLine1Style || {fontSize:'clamp(2.5rem, 4.5vw, 4rem)',letterSpacing:'-0.02em',fontWeight:'900'}}
              styleData={content.titleLine1Style || {fontSize:'clamp(2.5rem, 4.5vw, 4rem)',letterSpacing:'-0.02em',fontWeight:'900'}}
              onStyleSave={(s) => setContent({...content, titleLine1Style: s})}
            />
            <EditableText
              value={content.titleLine2 || "결과로 증명하\n는 PM"}
              onSave={(v) => setContent({...content, titleLine2: v})}
              isEditing={isEditing}
              multiline
              className="block text-[#3F72AF] mt-2 leading-[1.1] whitespace-pre-wrap"
              style={content.titleLine2Style || {fontSize:'clamp(3rem, 5.5vw, 5rem)',letterSpacing:'-0.05em',fontWeight:'900'}}
              styleData={content.titleLine2Style || {fontSize:'clamp(3rem, 5.5vw, 5rem)',letterSpacing:'-0.05em',fontWeight:'900'}}
              onStyleSave={(s) => setContent({...content, titleLine2Style: s})}
            />
          </h1>
        </div>
        
        {/* Top Right: Description */}
        <div className="flex flex-col items-end justify-start pointer-events-auto text-right md:mt-16">
          <div className="max-w-[280px]">
            <EditableText
              value={content.description || "사용자의 경험을 논리적으로 설계하고, 명확한 문서화를 통해 팀의 비전을 구체화합니다. 데이터와 심리학을 기반으로 한 깊이 있는 기획을 지향합니다."}
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

        {/* Middle Left: Points */}
        <div className="hidden md:flex flex-col items-start justify-center pointer-events-auto z-20 gap-6 translate-y-8 md:translate-y-10">
          <div className="bg-[#DBE2EF] text-[#112D4E] font-black text-[11px] md:text-xs tracking-widest px-5 py-1.5 rounded-full mb-1 shadow-sm">
            POINT
          </div>
          {[1, 2, 3].map(num => (
            <div key={num} className="flex px-5 py-3 md:px-7 md:py-5 bg-white/70 backdrop-blur-md rounded-[1.5rem] border border-[#DBE2EF]/80 shadow-md items-center gap-4 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <span className="text-4xl md:text-5xl font-black text-[#112D4E] tracking-tighter leading-none">
                <EditableText
                  value={content[`point${num}Value`] || "10"}
                  onSave={(v) => setContent({...content, [`point${num}Value`]: v})}
                  isEditing={isEditing}
                />
              </span>
              <div className="text-[11px] md:text-xs font-black text-[#3F72AF] leading-snug tracking-widest uppercase whitespace-pre-wrap">
                <EditableText
                  value={content[`point${num}Label`] || "YEARS\nEXPERIENCE"}
                  onSave={(v) => setContent({...content, [`point${num}Label`]: v})}
                  isEditing={isEditing}
                  multiline
                />
              </div>
            </div>
          ))}
        </div>

        {/* Middle Right: Nav Buttons */}
        <div className="hidden md:flex flex-col items-end justify-center pointer-events-auto z-20 gap-4 translate-y-8 md:translate-y-10">
          <button 
             onClick={() => onNavClick('resume-section')}
             className="px-8 py-4 bg-white/70 backdrop-blur-md rounded-2xl border border-[#DBE2EF]/80 shadow-md flex items-center justify-between gap-6 hover:shadow-lg transition-all transform hover:-translate-y-1 w-[220px] group"
          >
            <span className="text-sm font-bold text-[#112D4E] tracking-tight">이력서 바로가기</span>
            <ChevronRight className="w-5 h-5 text-[#3F72AF] group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
             onClick={() => onNavClick('portfolio-section')}
             className="px-8 py-4 bg-[#112D4E]/90 backdrop-blur-md rounded-2xl border border-[#112D4E] shadow-xl flex items-center justify-between gap-6 hover:shadow-lg transition-all transform hover:-translate-y-1 w-[220px] group"
          >
            <span className="text-sm font-bold text-white tracking-tight">포트폴리오 바로가기</span>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Bottom Left: Empty */}
        <div className="flex flex-col items-start justify-end pointer-events-auto pb-8 md:pb-12 z-20">
        </div>        {/* Bottom Right: Empty */}
        <div className="flex flex-col items-end justify-end pointer-events-auto pb-8 md:pb-12 z-20">
        </div>
      </div>
    </section>
      {/* Scroll Indicator at Boundary */}
      <div className="relative w-full h-0 flex justify-center z-[100] pointer-events-none">
        <div className="absolute -top-10 flex flex-col items-center animate-pulse opacity-90">
          <span className="text-[11px] md:text-sm font-black tracking-widest text-[#3F72AF] mb-2 uppercase drop-shadow-sm">SCROLL</span>
          <div className="w-[2px] h-16 md:h-24 bg-gradient-to-b from-[#3F72AF] via-[#3F72AF] to-transparent shadow-sm"></div>
        </div>
      </div>
    </>
  );
};
const About = ({ isEditing, content, setContent, onMoreMeClick }: { isEditing: boolean, content: any, setContent: (c: any) => void, onMoreMeClick: () => void }) => {
  const skills = [1, 2, 3];
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setContent({...content, videoUrl: ev.target?.result as string});
    };
    reader.readAsDataURL(file);
  };

  const totalParam = parseInt(content.chartTotal) || 100;
  const v1 = parseInt(content.skill1Value) || 80;
  const v2 = parseInt(content.skill2Value) || 60;
  const v3 = parseInt(content.skill3Value) || 40;

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto bg-[#F9F7F7]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-[#3F72AF]/20 pb-6 gap-4">
        <h2 className="text-3xl md:text-4xl font-black text-[#112D4E] tracking-tight whitespace-pre-wrap">
          <EditableText 
            value={content.titleLeft || "Q. 누구를 채용해야 할까요?"} 
            onSave={(v) => setContent({...content, titleLeft: v})} 
            isEditing={isEditing} 
          />
        </h2>
        <h2 className="text-2xl md:text-3xl font-black text-[#3F72AF] tracking-tight text-right w-full md:w-auto whitespace-pre-wrap">
          <EditableText 
            value={content.titleRight || "A. 저 입니다. 지원자 양 현우"} 
            onSave={(v) => setContent({...content, titleRight: v})} 
            isEditing={isEditing} 
          />
        </h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 relative items-stretch">
        
        {/* Left Column: Cards */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Chart Card */}
          <div className="bg-white rounded-[2rem] shadow-lg shadow-[#112D4E]/5 border border-[#DBE2EF] p-8">
            <div className="flex flex-col items-center justify-center mb-10 relative">
              <h3 className="text-lg font-black text-[#112D4E] text-center">
                <EditableText 
                  value={content.chartTitle || "막대형 그래프 채용 지원자격 top3"} 
                  onSave={(v) => setContent({...content, chartTitle: v})} 
                  isEditing={isEditing} 
                />
              </h3>
              {isEditing && (
                <div className="mt-4 flex items-center gap-2 bg-[#DBE2EF]/30 px-3 py-1.5 rounded-lg border border-[#DBE2EF]">
                  <span className="text-[#3F72AF] text-xs font-bold">모수(Total): </span>
                  <input 
                    type="number"
                    value={content.chartTotal || 100}
                    onChange={(e) => setContent({...content, chartTotal: e.target.value})}
                    className="w-16 border border-[#3F72AF]/30 rounded px-2 py-0.5 text-xs font-bold text-center"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-8 relative">
              {/* Vertical Grid Lines (Cosmetic) */}
              <div className="absolute inset-0 left-20 flex justify-between pointer-events-none z-0 mt-2">
                <div className="h-full ml-4 relative flex items-start">
                  <div className="absolute inset-y-0 left-0 border-l border-dashed border-[#3F72AF] opacity-20"></div>
                  <span className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-[#3F72AF] opacity-50 bg-white px-1">0</span>
                </div>
                <div className="h-full mr-12 relative flex items-start">
                  <div className="absolute inset-y-0 left-0 border-l border-dashed border-[#3F72AF] opacity-20"></div>
                  <span className="absolute -top-6 -translate-x-1/2 text-xs font-black text-[#1A59A7] bg-white px-1.5 py-0.5 shadow-sm rounded z-10 border border-[#DBE2EF]">{totalParam}</span>
                </div>
              </div>

              {skills.map((num) => {
                const v = num === 1 ? v1 : num === 2 ? v2 : v3;
                const p = Math.min((v / totalParam) * 100, 100);
                return (
                <div key={num} className="flex items-center gap-4 relative z-10 pr-4">
                  <div className="w-14 text-sm font-bold text-[#112D4E] text-right whitespace-pre-wrap">
                    <EditableText 
                      value={content[`skill${num}Name`] || `역량 ${String.fromCharCode(64 + num)}`} 
                      onSave={(v) => setContent({...content, [`skill${num}Name`]: v})} 
                      isEditing={isEditing} 
                    />
                  </div>
                  <div className="flex-1 flex flex-col group w-full">
                    <div className="h-8 bg-transparent relative flex items-center w-full">
                      <div 
                        className="h-full bg-[#3F72AF] rounded-r-md transition-all duration-700 shadow-sm flex items-center justify-end px-2 overflow-visible relative"
                        style={{ width: `${p}%`, minWidth: '1.5rem', maxWidth: '100%' }}
                      >
                         {p > 15 && <span className="text-white text-[10px] font-bold drop-shadow-md whitespace-nowrap px-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2">{Math.round(p)}%</span>}
                      </div>
                      <span className="ml-3 text-sm font-black text-[#112D4E] min-w-[2rem]">{v}</span>
                      
                      {isEditing && (
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#3F72AF]">값:</span>
                          <input 
                            type="number" 
                            value={content[`skill${num}Value`] || v}
                            onChange={(e) => setContent({...content, [`skill${num}Value`]: e.target.value})}
                            className="w-14 text-xs border border-[#DBE2EF] rounded px-1 h-6 font-bold text-[#112D4E] text-center"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Video Card */}
          <div className="bg-white rounded-[2rem] shadow-lg shadow-[#112D4E]/5 border border-[#DBE2EF] p-8 flex flex-col items-center">
            <h3 className="text-lg font-black text-[#112D4E] text-center mb-6">
              <EditableText 
                value={content.videoTitle || "크롤러 동영상"} 
                onSave={(v) => setContent({...content, videoTitle: v})} 
                isEditing={isEditing} 
              />
            </h3>
            
            <div className="w-full aspect-video bg-[#DBE2EF]/30 rounded-2xl overflow-hidden relative flex items-center justify-center border border-[#DBE2EF]">
              {content.videoUrl ? (
                <video 
                  src={content.videoUrl} 
                  controls 
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-[#3F72AF]">
                  <PlayCircle className="w-12 h-12 mx-auto mb-2 opacity-60" />
                </div>
              )}

              {isEditing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity z-10 p-4">
                  <div className="w-full max-w-[200px]">
                    <label className="text-white text-xs font-bold mb-1 block">동영상 URL 입력</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={content.videoUrl || ""}
                      onChange={(e) => setContent({...content, videoUrl: e.target.value})}
                      className="w-full px-3 py-2 rounded text-black text-xs"
                    />
                  </div>
                  <div className="text-white text-[10px] font-bold">OR</div>
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'video/*,image/*';
                      input.onchange = handleVideoUpload as any;
                      input.click();
                    }}
                    className="flex items-center gap-2 bg-white text-[#112D4E] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
                  >
                    <Upload className="w-4 h-4" /> 파일 업로드
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Text and Button */}
        <div className="lg:col-span-7 flex flex-col justify-between py-6">
          <div className="flex flex-col space-y-16 lg:pl-16 flex-1 justify-around">
            {skills.map((num) => (
              <div key={num} className="relative">
                {/* Desktop Arrow perfectly pointing at this block */}
                <div className="hidden lg:flex absolute top-1/2 -left-16 w-12 -translate-y-1/2 items-center opacity-30 text-[#3F72AF] pointer-events-none">
                  <div className="flex-1 border-t-2 border-dashed border-[#3F72AF]"></div>
                  <ChevronRight className="w-5 h-5 -ml-2" />
                </div>

                <h4 className="text-[17px] font-black text-[#112D4E] mb-3 leading-snug tracking-tight whitespace-pre-wrap">
                  <EditableText 
                    value={content[`descTitle${num}`] || `역량 ${String.fromCharCode(64 + num)}에 해당하는 내용 및 역량`} 
                    onSave={(v) => setContent({...content, [`descTitle${num}`]: v})} 
                    isEditing={isEditing} 
                  />
                </h4>
                <p className="text-[#3F72AF] text-[15px] leading-relaxed font-medium whitespace-pre-wrap">
                  <EditableText 
                    value={content[`descText${num}`] || (num === 1 ? '채용 공고에서 요구하는 최우선 역량을 완벽하게 충족하며, 실무에서 즉시 성과를 창출할 수 있는 기획력과 문제해결 능력을 보유하고 있습니다.' : num === 2 ? '다양한 직군과의 협업 경험을 통해 커뮤니케이션 비용을 줄이고, 복잡한 프로젝트를 리드하여 성공적인 런칭을 이끌어냅니다.' : '데이터 수집 및 분석 자동화(크롤링) 경험을 바탕으로, 높은 수준의 기술적 이해도를 지니고 있어 개발팀과 매끄럽게 소통합니다.')} 
                    onSave={(v) => setContent({...content, [`descText${num}`]: v})} 
                    isEditing={isEditing} 
                    multiline
                  />
                </p>
                
                {/* Arrow for mobile, displayed below text */}
                <div className="lg:hidden flex items-center w-full opacity-20 text-[#3F72AF] mt-6">
                  <div className="flex-1 border-t-2 border-dashed border-[#3F72AF]"></div>
                  <ChevronRight className="w-5 h-5 -ml-2" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-end lg:pr-8">
            <button 
              onClick={onMoreMeClick}
              className="bg-[#112D4E] text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center gap-3 hover:bg-[#1A59A7] transition-all whitespace-nowrap transform hover:scale-105"
            >
              MORE ME <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

const Projects = ({ onProjectClick, isEditing, projects, setProjects, limit, setView }: { onProjectClick: (p: Project) => void, isEditing: boolean, projects: Project[], setProjects: (p: Project[]) => void, limit?: number, setView?: (v: any) => void }) => {
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
 <p className="text-[#112D4E] text-sm leading-relaxed mb-8 flex-1">
 <EditableText 
 value={project.description} 
 onSave={(v) => {
 const newProjects = [...projects];
 newProjects[idx].description = v;
 setProjects(newProjects);
 }} 
 isEditing={isEditing} 
 multiline
 />
 </p>
 
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

const Portfolio = ({ onProjectClick, isEditing, projects, setProjects, setView }: { onProjectClick: (p: Project) => void, isEditing: boolean, projects: Project[], setProjects: (p: Project[]) => void, setView: (v: any) => void }) => {
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

const ICON_MAP: Record<string, React.ReactNode> = {
 'Cpu': <Cpu className="w-5 h-5" />,
 'Layers': <Layers className="w-5 h-5" />,
 'ScrollText': <ScrollText className="w-5 h-5" />,
 'Target': <Target className="w-5 h-5" />,
 'Code2': <Code2 className="w-5 h-5" />,
 'Zap': <Zap className="w-5 h-5" />,
 'Monitor': <Monitor className="w-5 h-5" />,
 'Smartphone': <Smartphone className="w-5 h-5" />,
 'Gamepad2': <Gamepad2 className="w-5 h-5" />,
 'Wrench': <Wrench className="w-5 h-5" />,
};

const resolveIcon = (iconName: string | React.ReactNode): React.ReactNode => {
 if (typeof iconName === 'string') {
 return ICON_MAP[iconName] || <Cpu className="w-5 h-5" />;
 }
 // Fallback for legacy data that might have JSX objects stored (they won't render, so use default)
 return <Cpu className="w-5 h-5" />;
};

const ICON_OPTIONS = [
 { name: 'Cpu', icon: <Cpu className="w-5 h-5" /> },
 { name: 'Layers', icon: <Layers className="w-5 h-5" /> },
 { name: 'ScrollText', icon: <ScrollText className="w-5 h-5" /> },
 { name: 'Target', icon: <Target className="w-5 h-5" /> },
 { name: 'Code2', icon: <Code2 className="w-5 h-5" /> },
 { name: 'Zap', icon: <Zap className="w-5 h-5" /> },
 { name: 'Monitor', icon: <Monitor className="w-5 h-5" /> },
 { name: 'Smartphone', icon: <Smartphone className="w-5 h-5" /> },
 { name: 'Gamepad2', icon: <Gamepad2 className="w-5 h-5" /> },
 { name: 'Wrench', icon: <Wrench className="w-5 h-5" /> }
];

const Skills = ({ isEditing, skillTabs, setSkillTabs }: { isEditing: boolean, skillTabs: SkillTab[], setSkillTabs: (s: SkillTab[]) => void }) => {
 const [activeTabId, setActiveTabId] = useState<string>(skillTabs[0]?.id || '');
 const [showIconPicker, setShowIconPicker] = useState<number | null>(null);
 const [editingTabId, setEditingTabId] = useState<string | null>(null);

 // Make sure activeTabId is valid
 useEffect(() => {
 if (skillTabs.length > 0 && !skillTabs.find(t => t.id === activeTabId)) {
 setActiveTabId(skillTabs[0].id);
 }
 }, [skillTabs, activeTabId]);

 const activeTab = skillTabs.find(t => t.id === activeTabId);
 const activeSkills = activeTab?.skills || [];

 const updateTabSkills = (newSkills: Skill[]) => {
 const newTabs = skillTabs.map(t => t.id === activeTabId ? { ...t, skills: newSkills } : t);
 setSkillTabs(newTabs);
 };

 return (
 <section id="skills" className="py-32 px-6 max-w-7xl mx-auto">
 <div className="max-w-4xl">
 <div className="flex items-center justify-between mb-10">
 <div>
 <div className="inline-block px-4 py-1 rounded-lg bg-[#3F72AF]/10 text-[#3F72AF] text-xs font-bold mb-6">03_SKILLS</div>
 <h2 className="text-4xl md:text-5xl font-bold tracking-tight">핵심 역량.</h2>
 </div>
 </div>

 {/* Tab Bar */}
 <div className="flex items-center gap-2 mb-10 flex-wrap">
 {skillTabs.map((tab) => (
 <div key={tab.id} className="relative flex items-center">
 {isEditing && editingTabId === tab.id ? (
 <input
 type="text"
 className="px-4 py-2.5 bg-[#DBE2EF]/60 border border-[#112D4E] rounded-xl text-sm font-bold text-[#1A59A7] focus:outline-none min-w-[80px]"
 value={tab.name}
 autoFocus
 onChange={(e) => {
 const newTabs = skillTabs.map(t => t.id === tab.id ? { ...t, name: e.target.value } : t);
 setSkillTabs(newTabs);
 }}
 onBlur={() => setEditingTabId(null)}
 onKeyDown={(e) => { if (e.key === 'Enter') setEditingTabId(null); }}
 />
 ) : (
 <button
 onClick={() => setActiveTabId(tab.id)}
 onDoubleClick={() => isEditing && setEditingTabId(tab.id)}
 className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
 activeTabId === tab.id
 ? 'bg-[#0a1e36] text-[#1A59A7] shadow-lg shadow-[#112D4E]/25'
 : 'glass text-[#112D4E] hover:text-[#112D4E] hover:bg-[#112D4E]/5'
 }`}
 >
 {tab.name}
 </button>
 )}
 {isEditing && skillTabs.length > 1 && (
 <button
 onClick={(e) => {
 e.stopPropagation();
 e.preventDefault();
 setSkillTabs(skillTabs.filter(t => t.id !== tab.id));
 }}
 className="ml-1 p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
 title="탭 삭제"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 ))}
 {isEditing && (
 <button
 onClick={() => {
 const newTab: SkillTab = {
 id: `tab-${Date.now()}`,
 name: '새 탭',
 skills: []
 };
 setSkillTabs([...skillTabs, newTab]);
 setActiveTabId(newTab.id);
 }}
 className="px-4 py-2.5 border-2 border-dashed border-[#3F72AF]/20 rounded-xl text-sm font-bold text-[#0a1e36] hover:text-[#112D4E] hover:border-[#112D4E]/50 transition-all flex items-center gap-1.5"
 >
 <Plus className="w-4 h-4" /> 탭 추가
 </button>
 )}
 </div>

 {/* Active Tab Content */}
 <AnimatePresence mode="wait">
 <motion.div
 key={activeTabId}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.3 }}
 >
 {isEditing && (
 <div className="mb-6 flex justify-end">
 <button
 onClick={() => {
 const newSkill: Skill = { name: "새 역량", level: 50, icon: 'Cpu', caption: "역량에 대한 설명을 입력하세요" };
 updateTabSkills([...activeSkills, newSkill]);
 }}
 className="px-4 py-2 bg-[#0a1e36] text-[#1A59A7] text-sm font-bold rounded-xl hover:bg-[#112D4E] transition-all flex items-center gap-2"
 >
 <Plus className="w-4 h-4" /> 역량 추가
 </button>
 </div>
 )}
 <div className="space-y-10">
 {activeSkills.length === 0 && (
 <div className="text-center py-16 text-[#8fabc8]">
 <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
 <p className="text-sm">이 탭에 역량을 추가해주세요.</p>
 </div>
 )}
 {activeSkills.map((skill, idx) => (
 <div key={idx} className="relative group/skill">
 {isEditing && (
 <button 
 onClick={() => {
 const newSkills = [...activeSkills];
 newSkills.splice(idx, 1);
 updateTabSkills(newSkills);
 }}
 className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 text-red-500 opacity-0 group-hover/skill:opacity-100 transition-all hover:bg-red-500/10 rounded-lg"
 title="삭제"
 >
 <X className="w-5 h-5" />
 </button>
 )}
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-3">
 <div 
 className={`w-10 h-10 glass rounded-xl flex items-center justify-center text-[#112D4E] ${isEditing ? 'cursor-pointer hover:bg-[#112D4E]/10' : ''}`}
 onClick={() => isEditing && setShowIconPicker(showIconPicker === idx ? null : idx)}
 >
 {resolveIcon(skill.icon)}
 </div>
 {isEditing && showIconPicker === idx && (
 <div className="absolute top-12 left-0 z-30 glass p-3 rounded-2xl grid grid-cols-5 gap-2 shadow-2xl">
 {ICON_OPTIONS.map((opt) => (
 <button 
 key={opt.name}
 onClick={() => {
 const newSkills = [...activeSkills];
 newSkills[idx].icon = opt.name;
 updateTabSkills(newSkills);
 setShowIconPicker(null);
 }}
 className="p-2 hover:bg-[#112D4E]/10 rounded-lg transition-colors text-[#112D4E]"
 >
 {opt.icon}
 </button>
 ))}
 </div>
 )}
 <span className="font-bold text-lg">
 <EditableText 
 value={skill.name} 
 onSave={(v) => {
 const newSkills = [...activeSkills];
 newSkills[idx].name = v;
 updateTabSkills(newSkills);
 }} 
 isEditing={isEditing} 
 />
 </span>
 </div>
 <div className="flex items-center gap-6">
 <span className="text-xs text-[#0a1e36] bg-[#DBE2EF]/40 px-3 py-1 rounded-lg border border-[#3F72AF]/12 italic">
 <EditableText 
 value={skill.caption || ""} 
 onSave={(v) => {
 const newSkills = [...activeSkills];
 newSkills[idx].caption = v;
 updateTabSkills(newSkills);
 }} 
 isEditing={isEditing} 
 />
 </span>
 <div className="flex items-center gap-2">
 <span className="font-mono text-sm text-[#0a1e36]">
 <EditableText 
 value={skill.level.toString()} 
 onSave={(v) => {
 const newSkills = [...activeSkills];
 newSkills[idx].level = parseInt(v) || 0;
 updateTabSkills(newSkills);
 }} 
 isEditing={isEditing} 
 />%
 </span>
 </div>
 </div>
 </div>
 <div className="h-2 bg-[#DBE2EF]/40 rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 whileInView={{ width: `${skill.level}%` }}
 viewport={{ once: true }}
 transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
 className="h-full bg-gradient-to-r from-[#112D4E] to-[#0a1e36] rounded-full"
 />
 </div>
 </div>
 ))}
 </div>
 </motion.div>
 </AnimatePresence>
 </div>
 </section>
 );
};

const MyTools = ({ isEditing, tools, setTools }: { isEditing: boolean, tools: ToolItem[], setTools: (t: ToolItem[]) => void }) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleIconUpload = (toolId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const newTools = tools.map(t => t.id === toolId ? { ...t, iconUrl: dataUrl } : t);
      setTools(newTools);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="my-tools" className="py-32 px-6 max-w-7xl mx-auto border-t border-[#3F72AF]/8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="inline-block px-4 py-1 rounded-lg bg-[#3F72AF]/10 text-[#3F72AF] text-xs font-bold mb-6">04_TOOLS</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">나의 사용 Tool.</h2>
        </div>
        {isEditing && (
          <button
            onClick={() => {
              const newTool: ToolItem = {
                id: `tool-${Date.now()}`,
                name: '새 Tool',
                iconUrl: '',
                description: '툴에 대한 설명을 입력하세요.'
              };
              setTools([...tools, newTool]);
            }}
            className="px-4 py-2 bg-[#0a1e36] text-[#1A59A7] text-sm font-bold rounded-xl hover:bg-[#112D4E] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tool 추가
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass px-4 pt-3.5 pb-3 rounded-xl relative group flex flex-col items-center text-center"
          >
            {isEditing && (
              <button
                onClick={() => {
                  const newTools = tools.filter(t => t.id !== tool.id);
                  setTools(newTools);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={14} />
              </button>
            )}

            {/* Icon area */}
            <div 
              className={`relative w-[43px] h-[43px] mb-2.5 flex items-center justify-center ${isEditing ? 'cursor-pointer hover:opacity-70' : ''}`}
              onClick={() => isEditing && fileInputRefs.current[tool.id]?.click()}
            >
              {tool.iconUrl ? (
                <img
                  src={tool.iconUrl}
                  alt={tool.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Wrench size={30} className="text-[#3F72AF]/20" />
              )}
              {isEditing && (
                <input
                  ref={(el) => { fileInputRefs.current[tool.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleIconUpload(tool.id, e)}
                />
              )}
            </div>

            {/* Title */}
            <div className="font-bold text-[#112D4E] text-[13px] mb-1.5">{tool.name}</div>

            {/* Divider */}
            <div className="w-8 h-[1px] bg-[#112D4E]/10 my-1"></div>

            {/* Description */}
            <div className="text-[11px] text-[#3F72AF] leading-tight flex-1">
              <EditableText
                value={tool.description}
                onSave={(v) => {
                  const newTools = tools.map(t => t.id === tool.id ? { ...t, description: v } : t);
                  setTools(newTools);
                }}
                isEditing={isEditing}
                multiline
              />
            </div>

            {isEditing && (
              <div className="mt-2 w-full space-y-1">
                <div className="flex items-center gap-1 glass rounded-lg px-2 py-0.5">
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none text-[8px] text-[#3F72AF] focus:outline-none"
                    value={tool.name}
                    onChange={(e) => {
                      const newTools = tools.map(t => t.id === tool.id ? { ...t, name: e.target.value } : t);
                      setTools(newTools);
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 glass rounded-lg px-2 py-0.5">
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none text-[8px] text-[#3F72AF] focus:outline-none"
                    value={tool.iconUrl}
                    placeholder="Icon URL..."
                    onChange={(e) => {
                      const newTools = tools.map(t => t.id === tool.id ? { ...t, iconUrl: e.target.value } : t);
                      setTools(newTools);
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-20 text-[#8fabc8]">
          <Wrench className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-sm">사용 중인 Tool을 추가해주세요.</p>
        </div>
      )}
    </section>
  );
};

const PlayHistory = ({ isEditing, history, setHistory }: { isEditing: boolean, history: GameHistory, setHistory: (h: GameHistory) => void }) => (
 <section id="play-history" className="py-32 px-6 max-w-7xl mx-auto border-t border-[#3F72AF]/8">
 <div className="inline-block px-4 py-1 rounded-lg bg-[#112D4E]/10 text-[#1e3d5e] text-xs font-bold mb-6">05_PLAY_HISTORY</div>
 <h2 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">게임 플레이 이력.</h2>
 
 <div className="grid md:grid-cols-3 gap-8">
 {/* Online */}
 <div className="bento-card !p-8">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3 text-[#112D4E]">
 <Monitor className="w-6 h-6" />
 <span className="font-bold uppercase tracking-wider">Online Games</span>
 </div>
 {isEditing && (
 <button 
 onClick={() => {
 const newHistory = {...history};
 newHistory.online.push({ id: Date.now().toString(), name: "새 게임", hours: 0 });
 setHistory(newHistory);
 }}
 className="p-1.5 glass rounded-lg text-[#112D4E] hover:bg-[#112D4E]/10"
 >
 <Plus className="w-4 h-4" />
 </button>
 )}
 </div>
 <div className="space-y-4">
 {history.online.map((game, idx) => (
 <div key={game.id} className="flex justify-between items-center group">
 <div className="flex items-center gap-2">
 {isEditing && (
 <button 
 onClick={() => {
 const newHistory = {...history};
 newHistory.online.splice(idx, 1);
 setHistory(newHistory);
 }}
 className="text-[#8fabc8] hover:text-red-400 transition-colors"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 <span className="text-[#3F72AF] font-medium">
 <EditableText 
 value={game.name} 
 onSave={(v) => {
 const newHistory = {...history};
 newHistory.online[idx].name = v;
 setHistory(newHistory);
 }} 
 isEditing={isEditing} 
 />
 </span>
 </div>
 <div className="flex items-center gap-1.5 text-[#0a1e36] font-mono text-sm">
 <Clock className="w-3.5 h-3.5" /> 
 <EditableText 
 value={game.hours.toString()} 
 onSave={(v) => {
 const newHistory = {...history};
 newHistory.online[idx].hours = parseInt(v) || 0;
 setHistory(newHistory);
 }} 
 isEditing={isEditing} 
 />h
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Mobile */}
 <div className="bento-card !p-8">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3 text-[#3F72AF]">
 <Smartphone className="w-6 h-6" />
 <span className="font-bold uppercase tracking-wider">Mobile Games</span>
 </div>
 {isEditing && (
 <button 
 onClick={() => {
 const newHistory = {...history};
 newHistory.mobile.push({ id: Date.now().toString(), name: "새 게임", hours: 0 });
 setHistory(newHistory);
 }}
 className="p-1.5 glass rounded-lg text-[#3F72AF] hover:bg-[#112D4E]/10"
 >
 <Plus className="w-4 h-4" />
 </button>
 )}
 </div>
 <div className="space-y-4">
 {history.mobile.map((game, idx) => (
 <div key={game.id} className="flex justify-between items-center group">
 <div className="flex items-center gap-2">
 {isEditing && (
 <button 
 onClick={() => {
 const newHistory = {...history};
 newHistory.mobile.splice(idx, 1);
 setHistory(newHistory);
 }}
 className="text-[#8fabc8] hover:text-red-400 transition-colors"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 <span className="text-[#3F72AF] font-medium">
 <EditableText 
 value={game.name} 
 onSave={(v) => {
 const newHistory = {...history};
 newHistory.mobile[idx].name = v;
 setHistory(newHistory);
 }} 
 isEditing={isEditing} 
 />
 </span>
 </div>
 <div className="flex items-center gap-1.5 text-[#0a1e36] font-mono text-sm">
 <Clock className="w-3.5 h-3.5" /> 
 <EditableText 
 value={game.hours.toString()} 
 onSave={(v) => {
 const newHistory = {...history};
 newHistory.mobile[idx].hours = parseInt(v) || 0;
 setHistory(newHistory);
 }} 
 isEditing={isEditing} 
 />h
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Package */}
 <div className="bento-card !p-8">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3 text-[#112D4E]">
 <PackageIcon className="w-6 h-6" />
 <span className="font-bold uppercase tracking-wider">Package Games</span>
 </div>
 {isEditing && (
 <button 
 onClick={() => {
 const newHistory = {...history};
 newHistory.package.push({ id: Date.now().toString(), name: "새 게임", hours: 0 });
 setHistory(newHistory);
 }}
 className="p-1.5 glass rounded-lg text-[#112D4E] hover:bg-[#112D4E]/10"
 >
 <Plus className="w-4 h-4" />
 </button>
 )}
 </div>
 <div className="space-y-4">
 {history.package.map((game, idx) => (
 <div key={game.id} className="flex justify-between items-center group">
 <div className="flex items-center gap-2">
 {isEditing && (
 <button 
 onClick={() => {
 const newHistory = {...history};
 newHistory.package.splice(idx, 1);
 setHistory(newHistory);
 }}
 className="text-[#8fabc8] hover:text-red-400 transition-colors"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 <span className="text-[#3F72AF] font-medium">
 <EditableText 
 value={game.name} 
 onSave={(v) => {
 const newHistory = {...history};
 newHistory.package[idx].name = v;
 setHistory(newHistory);
 }} 
 isEditing={isEditing} 
 />
 </span>
 </div>
 <div className="flex items-center gap-1.5 text-[#0a1e36] font-mono text-sm">
 <Clock className="w-3.5 h-3.5" /> 
 <EditableText 
 value={game.hours.toString()} 
 onSave={(v) => {
 const newHistory = {...history};
 newHistory.package[idx].hours = parseInt(v) || 0;
 setHistory(newHistory);
 }} 
 isEditing={isEditing} 
 />h
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>
);

interface ResumeProps {
 setView: (v: any) => void;
 isEditing: boolean;
 data: ResumeData;
 setData: (d: ResumeData) => void;
}

const SelfIntro = ({ setView, isEditing, data, setData }: ResumeProps) => {
 const [activeIntroTab, setActiveIntroTab] = useState<string>(
 data.selfIntroTabs?.[0]?.id || 'intro-1'
 );
 const [editingIntroTabId, setEditingIntroTabId] = useState<string | null>(null);

 useEffect(() => {
 const tabs = data.selfIntroTabs || [];
 if (tabs.length > 0 && !tabs.find(t => t.id === activeIntroTab)) {
 setActiveIntroTab(tabs[0].id);
 }
 }, [data.selfIntroTabs, activeIntroTab]);

 const selfIntroTabs: SelfIntroTab[] = data.selfIntroTabs || [
 { id: 'intro-1', title: '성장 과정 및 가치관', content: data.selfIntroduction || '' }
 ];

 return (
 <motion.section 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="pt-32 pb-24 px-6 max-w-5xl mx-auto"
 >
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">          <div className="inline-block px-4 py-1 rounded-lg bg-[#3F72AF]/10 text-[#3F72AF] text-xs font-bold">01_RESUME</div>
 </div>
 <div className="pdf-resume-container" style={{ background: '#F9F7F7' }}>
 {/* Self Introduction - Tabbed */}
 <section className="pt-8 border-t border-[#3F72AF]/8 ">
 <div className="flex items-center justify-between mb-8 pdf-no-break">
 <h3 className="text-xl font-bold flex items-center gap-3 ">
 <ScrollText className="text-[#112D4E] w-6 h-6" /> 자기소개서
 </h3>
 </div>

 {/* Tab Bar */}
 <div className="flex items-center gap-2 mb-6 flex-wrap pdf-no-break">
 {selfIntroTabs.map((tab) => (
 <div key={tab.id} className="relative flex items-center">
 {isEditing && editingIntroTabId === tab.id ? (
 <input
 type="text"
 className="px-4 py-2 bg-[#DBE2EF]/60 border border-[#112D4E] rounded-xl text-sm font-bold text-[#1A59A7] focus:outline-none min-w-[80px]"
 value={tab.title}
 autoFocus
 onChange={(e) => {
 const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, title: e.target.value } : t);
 setData({...data, selfIntroTabs: newTabs});
 }}
 onBlur={() => setEditingIntroTabId(null)}
 onKeyDown={(e) => { if (e.key === 'Enter') setEditingIntroTabId(null); }}
 />
 ) : (
 <button
 onClick={() => setActiveIntroTab(tab.id)}
 onDoubleClick={() => isEditing && setEditingIntroTabId(tab.id)}
 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
 activeIntroTab === tab.id
 ? 'bg-[#0a1e36] text-[#1A59A7] shadow-lg shadow-[#112D4E]/25'
 : 'glass text-[#112D4E] hover:text-[#112D4E] hover:bg-[#112D4E]/5'
 }`}
 >
 {tab.title}
 </button>
 )}
 {isEditing && selfIntroTabs.length > 1 && (
 <button
 onClick={(e) => {
 e.stopPropagation();
 const newTabs = selfIntroTabs.filter(t => t.id !== tab.id);
 setData({...data, selfIntroTabs: newTabs});
 if (activeIntroTab === tab.id && newTabs.length > 0) {
 setActiveIntroTab(newTabs[0].id);
 }
 }}
 className="ml-1 p-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
 title="탭 삭제"
 >
 <X className="w-3 h-3" />
 </button>
 )}
 </div>
 ))}
 {isEditing && (
 <button
 onClick={() => {
 const newTab: SelfIntroTab = {
 id: `intro-${Date.now()}`,
 title: '새 항목',
 content: '내용을 입력하세요.'
 };
 const newTabs = [...selfIntroTabs, newTab];
 setData({...data, selfIntroTabs: newTabs});
 setActiveIntroTab(newTab.id);
 }}
 className="px-3 py-2 border-2 border-dashed border-[#3F72AF]/20 rounded-xl text-sm font-bold text-[#0a1e36] hover:text-[#112D4E] hover:border-[#112D4E]/50 transition-all flex items-center gap-1.5"
 >
 <Plus className="w-3.5 h-3.5" /> 탭 추가
 </button>
 )}
 </div>

  {/* Tab Content */}
  <div className="glass rounded-[2rem] p-6 pdf-no-break">
  {selfIntroTabs.map((tab) => (
  <div key={tab.id} style={{ display: activeIntroTab === tab.id ? 'block' : 'none' }}>
    <EditableText
      value={tab.content}
      onSave={(v) => {
        const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, content: v } : t);
        setData({...data, selfIntroTabs: newTabs});
      }}
      isEditing={isEditing}
      multiline
      className="leading-relaxed font-medium markdown-body min-h-[300px]"
      style={tab.style || {}}
      styleData={tab.style || {}}
      onStyleSave={(s) => {
        const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, style: s } : t);
        setData({...data, selfIntroTabs: newTabs});
      }}
    />
  </div>
  ))}
  </div>
 </section>
 </div>
 </motion.section>
 );
};

const Resume = ({ setView, isEditing, data, setData }: ResumeProps) => {
 const resumeRef = useRef<HTMLDivElement>(null);
 const resumeImageInputRef = useRef<HTMLInputElement>(null);
 const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

 const handleResumeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageHighQuality(file).then(dataUrl => {
      setData({...data, resumeImage: dataUrl});
    }).catch(console.error);
  };
 const techStack = data.techStack || [
 { id: 'ts-1', label: 'Engines & Languages', items: ['Unity', 'UE5', 'C#', 'C++', 'Blueprints'] },
 { id: 'ts-2', label: 'Design Tools', items: ['Excel', 'Python', 'Jira', 'Figma', 'Confluence'] }
 ];

 const coreCompetencies = data.coreCompetencies || [
 '수치 기반의 밸런싱 시뮬레이션',
 '논리적인 시스템 구조 설계',
 '플레이어 심리 분석 및 UX 설계'
 ];
 const handleDownloadPdf = useCallback(() => {
 // html2canvas incompatible with Tailwind CSS v4 oklch colors. 
 // Fallback to native print dialog which accurately saves as PDF without crashing.
 const originalTitle = document.title;
 document.title = `${data.name || '이력서'}_이력서`;
 window.print();
 setTimeout(() => {
 document.title = originalTitle;
 }, 100);
 }, [data.name]);

 return (
 <motion.section 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="pt-32 pb-24 px-6 max-w-5xl mx-auto print:pt-0 print:pb-0 print:max-w-none"
 >
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 print:hidden">
           <div className="flex flex-col items-start gap-4">
            <div className="inline-block px-4 py-1 rounded-lg bg-[#3F72AF]/10 text-[#3F72AF] text-[11px] font-bold tracking-widest mt-2 relative z-50">01_RESUME</div>
          </div>
 <motion.button 
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={handleDownloadPdf}
 className="px-6 py-3 glass rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#112D4E]/10 transition-all"
 >
 <Download className="w-4 h-4 text-[#112D4E]" /> PDF 이력서 다운로드
 </motion.button>
 </div>

 {/* PDF Target Area */}
 <div ref={resumeRef} className="pdf-resume-container" style={{ background: '#F9F7F7' }}>
 <div className="grid md:grid-cols-3 gap-12 print:grid-cols-3">
 {/* Sidebar */}
 <div className="md:col-span-1 space-y-12">
 <div className="text-center md:text-left pdf-no-break">
 <div className="w-[140px] h-[140px] rounded-3xl overflow-hidden mb-6 mx-auto md:mx-0 border border-[#3F72AF]/12 shadow-2xl shadow-[#112D4E]/10 relative group z-10">
 <img src={data.resumeImage || "https://picsum.photos/seed/profile/300/300"} alt="Profile" className="w-full h-full object-cover" />
 {isEditing && (
 <div className="absolute inset-0 bg-[#112D4E]/40 transition-all flex items-center justify-center cursor-pointer"
 onClick={() => resumeImageInputRef.current?.click()}
 >
 <div className="flex flex-col items-center gap-1 text-white">
 <Upload className="w-6 h-6" />
 <span className="text-[10px] font-bold">사진 변경</span>
 </div>
 <input
 ref={resumeImageInputRef}
 type="file"
 accept="image/*"
 className="hidden"
 onChange={handleResumeImageUpload}
 />
 </div>
 )}
 </div>
 <h1 className="text-3xl font-bold mb-2 ">
 <EditableText 
 value={data.name} 
 onSave={(v) => setData({...data, name: v})} 
 isEditing={isEditing} 
 />
 </h1>
 <p className="text-[#112D4E] font-medium mb-6 ">
 <EditableText 
 value={data.role} 
 onSave={(v) => setData({...data, role: v})} 
 isEditing={isEditing} 
 />
 </p> <div className="space-y-4 text-sm text-[#112D4E] ">
 <div className="flex items-center gap-3 justify-center md:justify-start">
 <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#0a1e36] ">
 <Calendar className="w-4 h-4" />
 </div>
 <span>
 <EditableText 
 value={data.birthDate || "2000.01.01"} 
 onSave={(v) => setData({...data, birthDate: v})} 
 isEditing={isEditing} 
 disableMarkdown={true}
 />
 </span>
 </div>
 <div className="flex items-center gap-3 justify-center md:justify-start">
 <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#0a1e36] ">
 <MapPin className="w-4 h-4" />
 </div>
 <span>
 <EditableText 
 value={data.address || "서울특별시 OO구"} 
 onSave={(v) => setData({...data, address: v})} 
 isEditing={isEditing} 
 disableMarkdown={true}
 />
 </span>
 </div>
 <div className="flex items-center gap-3 justify-center md:justify-start">
 <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#0a1e36] ">
 <Phone className="w-4 h-4" />
 </div>
 <span>
 <EditableText 
 value={data.phone || "010-0000-0000"} 
 onSave={(v) => setData({...data, phone: v})} 
 isEditing={isEditing} 
 disableMarkdown={true}
 />
 </span>
 </div>
 <div className="flex items-center gap-3 justify-center md:justify-start">
 <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#0a1e36] ">
 <Mail className="w-4 h-4" />
 </div>
 <span>
 <EditableText 
 value={data.email} 
 onSave={(v) => setData({...data, email: v})} 
 isEditing={isEditing} 
 disableMarkdown={true}
 />
 </span>
 </div>
 <div className="flex items-center gap-3 justify-center md:justify-start">
 <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#0a1e36] ">
 <Linkedin className="w-4 h-4" />
 </div>
 <span>
 <EditableText 
 value={data.linkedin} 
 onSave={(v) => setData({...data, linkedin: v})} 
 isEditing={isEditing} 
 disableMarkdown={true}
 />
 </span>
 </div>
 <div className="flex items-center gap-3 justify-center md:justify-start">
 <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#0a1e36] ">
 <Github className="w-4 h-4" />
 </div>
 <span>
 <EditableText 
 value={data.github} 
 onSave={(v) => setData({...data, github: v})} 
 isEditing={isEditing} 
 disableMarkdown={true}
 />
 </span>
 </div>
 </div>
 </div>

  {/* Left Side: Education, Experience, Certificates */}
  <div className="space-y-0">
    
    {/* Education Section */}
    <div className="py-8 border-t border-b border-[#DBE2EF] relative pdf-no-break">
      <h3 className="font-bold text-[#112D4E] text-[15px] mb-6 flex items-center gap-2">
        <GraduationCap className="w-4 h-4 text-[#3F72AF]" /> 학력 및 교육
      </h3>
      <div className="space-y-4">
        {data.education && data.education.map((edu, idx) => (
          <div key={idx} className="relative group/edu">
            {isEditing && (
              <button type="button" onClick={() => { const n = [...data.education]; n.splice(idx,1); setData({...data, education: n}); }} className="absolute -left-4 top-0 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/edu:opacity-100"><X className="w-3 h-3"/></button>
            )}
            <div className="text-[14px] font-bold text-[#112D4E] mb-2 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
              <EditableText value={edu.title} onSave={(v)=>{const n=[...data.education]; n[idx].title=v; setData({...data, education: n});}} isEditing={isEditing} />
            </div>
            {edu.details && edu.details.length > 0 && (
              <ul className="list-disc list-inside text-xs text-[#112D4E] space-y-1 ml-1 mt-1 font-medium">
                {edu.details.map((d, i) => (
                  <li key={i} className="group/item relative">
                    <span className="inline-block relative">
                        <EditableText value={d} onSave={(v)=>{const n=[...data.education]; n[idx].details[i]=v; setData({...data, education: n});}} isEditing={isEditing} />
                    </span>
                    {isEditing && <button type="button" onClick={()=>{const n=[...data.education]; n[idx].details.splice(i,1); setData({...data, education: n});}} className="opacity-0 group-hover/item:opacity-100 absolute -left-4 top-0.5 text-red-300"><X className="w-2.5 h-2.5"/></button>}
                  </li>
                ))}
              </ul>
            )}
            {isEditing && <button type="button" onClick={()=>{const n=[...data.education]; if(!n[idx].details) n[idx].details=[]; n[idx].details.push("항목"); setData({...data, education: n});}} className="text-[10px] text-gray-400 mt-1 block"><Plus className="w-2 h-2 inline"/> 항목추가</button>}
          </div>
        ))}
        {isEditing && <button type="button" onClick={()=>{const n=data.education?[...data.education]:[]; n.push({title:"새 학력", period:"", description:"", details:[]}); setData({...data, education: n});}} className="text-xs text-blue-400 mt-2 block"><Plus className="w-3 h-3 inline"/> 교육추가</button>}
      </div>
    </div>

    {/* Experience Section */}
    <div className="py-8 border-b border-[#DBE2EF] relative pdf-no-break">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-bold text-[#112D4E] text-[15px] flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#3F72AF]" /> 경력 사항
        </h3>
        <span className="text-[12px] font-medium text-[#e85c5c]">
          <EditableText value={data.totalExperience || "총 경력 6년"} onSave={(v)=>setData({...data, totalExperience: v})} isEditing={isEditing} />
        </span>
      </div>
      <div className="space-y-8">
        {data.leftExperience && data.leftExperience.map((exp, idx) => (
          <div key={idx} className="relative group/exp">
            {isEditing && (
              <button type="button" onClick={() => { const n = [...data.leftExperience]; n.splice(idx,1); setData({...data, leftExperience: n}); }} className="absolute -left-4 top-0 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/exp:opacity-100"><X className="w-3 h-3"/></button>
            )}
            <div className="text-[14px] font-bold text-[#112D4E] mb-2">
              <EditableText value={exp.title} onSave={(v)=>{const n=[...data.leftExperience]; n[idx].title=v; setData({...data, leftExperience: n});}} isEditing={isEditing} />
            </div>
            <div className="text-[12px] text-[#8fabc8] border-l-2 border-[#DBE2EF] pl-2 mb-2 whitespace-pre-wrap leading-relaxed flex flex-col gap-0.5">
              <EditableText value={exp.period || ''} multiline onSave={(v)=>{const n=[...data.leftExperience]; n[idx].period=v; setData({...data, leftExperience: n});}} isEditing={isEditing} />
            </div>
            {exp.details && exp.details.length > 0 && (
              <ul className="list-disc list-inside text-xs text-[#112D4E] space-y-1 ml-1 mt-2 font-medium">
                {exp.details.map((d, i) => (
                  <li key={i} className="group/item relative">
                    <span className="inline-block relative">
                       <EditableText value={d} onSave={(v)=>{const n=[...data.leftExperience]; n[idx].details[i]=v; setData({...data, leftExperience: n});}} isEditing={isEditing} />
                    </span>
                    {isEditing && <button type="button" onClick={()=>{const n=[...data.leftExperience]; n[idx].details.splice(i,1); setData({...data, leftExperience: n});}} className="opacity-0 group-hover/item:opacity-100 absolute -left-4 top-0.5 text-red-300"><X className="w-2.5 h-2.5"/></button>}
                  </li>
                ))}
              </ul>
            )}
            {isEditing && <button type="button" onClick={()=>{const n=[...data.leftExperience]; if(!n[idx].details) n[idx].details=[]; n[idx].details.push("항목"); setData({...data, leftExperience: n});}} className="text-[10px] text-gray-400 mt-1 block"><Plus className="w-2 h-2 inline"/> 항목추가</button>}
          </div>
        ))}
        {isEditing && <button type="button" onClick={()=>{const n=data.leftExperience?[...data.leftExperience]:[]; n.push({title:"새 경력", period:"", description:"", details:[]}); setData({...data, leftExperience: n});}} className="text-xs text-blue-400 block"><Plus className="w-3 h-3 inline"/> 경력추가</button>}
      </div>
    </div>

    {/* Certificates Section */}
    <div className="py-8 relative pdf-no-break">
      <h3 className="font-bold text-[#112D4E] text-[15px] mb-5 flex items-center gap-2">
        <Award className="w-4 h-4 text-[#3F72AF]" /> 자격 및 수상
      </h3>
      <div className="space-y-6">
        {data.awards && data.awards.map((cert, idx) => (
          <div key={idx} className="relative group/cert">
            {isEditing && (
              <button type="button" onClick={() => { const n = [...data.awards]; n.splice(idx,1); setData({...data, awards: n}); }} className="absolute -left-4 top-0 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/cert:opacity-100"><X className="w-3 h-3"/></button>
            )}
            <div className="text-[14px] text-[#112D4E] mb-2 font-medium">
              <EditableText value={cert.title} onSave={(v)=>{const n=[...data.awards]; n[idx].title=v; setData({...data, awards: n});}} isEditing={isEditing} />
            </div>
            <div className="text-[12px] text-[#8fabc8] border-l-2 border-[#DBE2EF] pl-2 flex flex-col gap-0.5">
              <EditableText value={cert.organization} onSave={(v)=>{const n=[...data.awards]; n[idx].organization=v; setData({...data, awards: n});}} isEditing={isEditing} />
              <EditableText value={cert.year ? '('+cert.year+')' : '(연도)'} onSave={(v)=>{const n=[...data.awards]; n[idx].year=v.replace(/[()]/g,''); setData({...data, awards: n});}} isEditing={isEditing} />
            </div>
          </div>
        ))}
        {isEditing && <button type="button" onClick={()=>{const c = data.awards || []; const n=[...c, {title:"새 자격증", organization:"기관", year:"연도"}]; setData({...data, awards: n});}} className="text-xs text-blue-400 block"><Plus className="w-3 h-3 inline"/> 자격/수상 추가</button>}
      </div>
    </div>
  </div>
 </div>

 {/* Main Content */}
 <div className="md:col-span-2 space-y-16">
 {/* Summary */}
 <section className="pdf-no-break">
 <h3 className="text-xl font-bold mb-6 flex items-center gap-3 ">
 <User className="text-[#112D4E] w-6 h-6" /> 자기소개
 </h3>
 <p className="text-[#112D4E] leading-relaxed font-medium whitespace-pre-wrap">
 <EditableText 
  value={data.summary} 
  onSave={(v) => setData({...data, summary: v})} 
  isEditing={isEditing} 
  multiline
  style={data.summaryStyle || {}}
  styleData={data.summaryStyle || {}}
  onStyleSave={(s) => setData({...data, summaryStyle: s})}
 />
 </p>
 </section>



 {/* Experience */}
 <section>
 <div className="flex items-center justify-between mb-8 pdf-no-break">
 <h3 className="text-xl font-bold flex items-center gap-3 ">
 <Briefcase className="text-[#1e3d5e] w-6 h-6" /> 프로젝트 경험
 </h3>
 {isEditing && (
 <button 
 onClick={() => {
 const newExp = [...data.experience];
 newExp.push({ title: "새 프로젝트", period: "기간", description: "설명", details: [] });
 setData({...data, experience: newExp});
 }}
 className="p-2 glass rounded-xl text-[#1e3d5e] hover:bg-[#112D4E]/10 transition-all flex items-center gap-2 text-xs font-bold"
 >
 <Plus className="w-4 h-4" /> 프로젝트 추가
 </button>
 )}
 </div>
 <div className="space-y-8">
 {data.experience.map((exp, idx) => (
 <div key={idx} className="relative pl-8 border-l border-[#3F72AF]/12 pdf-no-break">
 <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#112D4E] shadow-[0_0_10px_rgba(168,85,247,0.5)] "></div>
 {isEditing && (
 <button 
 onClick={() => {
 const newExp = [...data.experience];
 newExp.splice(idx, 1);
 setData({...data, experience: newExp});
 }}
 className="absolute -left-10 top-0 p-1 text-[#8fabc8] hover:text-red-400 transition-colors"
 >
 <X className="w-4 h-4" />
 </button>
 )}
 <div className="flex justify-between items-start mb-1">
 <h4 className="font-bold text-[19px] ">
 <EditableText 
 value={exp.title} 
 onSave={(v) => {
 const newExp = [...data.experience];
 newExp[idx].title = v;
 setData({...data, experience: newExp});
 }} 
 isEditing={isEditing} 
 />
 </h4>
 <span className="text-[13px] font-mono text-[#0a1e36]">
 <EditableText 
 value={exp.period} 
 onSave={(v) => {
 const newExp = [...data.experience];
 newExp[idx].period = v;
 setData({...data, experience: newExp});
 }} 
 isEditing={isEditing} 
 />
 </span>
 </div>
 <p className="text-[15px] text-[#112D4E] mb-2 whitespace-pre-wrap">
 <EditableText 
 value={exp.description} 
 onSave={(v) => {
 const newExp = [...data.experience];
 newExp[idx].description = v;
 setData({...data, experience: newExp});
 }} 
 isEditing={isEditing} 
 />
 </p>
 <ul className="text-[13px] text-[#0a1e36] space-y-1 list-disc list-inside">
 {exp.details.map((detail, dIdx) => (
 <li key={dIdx} className="group flex items-start gap-2">
 <EditableText 
 value={detail} 
 onSave={(v) => {
 const newExp = [...data.experience];
 newExp[idx].details[dIdx] = v;
 setData({...data, experience: newExp});
 }} 
 isEditing={isEditing} 
 />
 {isEditing && (
 <button 
 onClick={() => {
 const newExp = [...data.experience];
 newExp[idx].details.splice(dIdx, 1);
 setData({...data, experience: newExp});
 }}
 className="opacity-0 group-hover:opacity-100 text-[#8fabc8] hover:text-red-400 transition-all"
 >
 <X className="w-3 h-3" />
 </button>
 )}
 </li>
 ))}
 {isEditing && (
 <button 
 onClick={() => {
 const newExp = [...data.experience];
 newExp[idx].details.push("새 상세 내용");
 setData({...data, experience: newExp});
 }}
 className="text-[10px] text-[#112D4E] hover:text-[#1e3d5e] transition-colors flex items-center gap-1"
 >
 <Plus className="w-3 h-3" /> 항목 추가
 </button>
 )}
 </ul>
 </div>
 ))}
 </div>
 </section>



  {/* Self Introduction - merged into resume */}
  <SelfIntroInResume isEditing={isEditing} data={data} setData={setData} />
 </div>
 </div>
 </div>
 </motion.section>
 );
};


// Self Introduction embedded inside Resume
const SelfIntroInResume = ({ isEditing, data, setData }: { isEditing: boolean, data: ResumeData, setData: (d: ResumeData) => void }) => {
  const [activeIntroTab, setActiveIntroTab] = useState<string>(
  data.selfIntroTabs?.[0]?.id || 'intro-1'
  );
  const [editingIntroTabId, setEditingIntroTabId] = useState<string | null>(null);

  useEffect(() => {
  const tabs = data.selfIntroTabs || [];
  if (tabs.length > 0 && !tabs.find(t => t.id === activeIntroTab)) {
  setActiveIntroTab(tabs[0].id);
  }
  }, [data.selfIntroTabs, activeIntroTab]);

  const selfIntroTabs: SelfIntroTab[] = data.selfIntroTabs || [
  { id: 'intro-1', title: '성장 과정 및 가치관', content: data.selfIntroduction || '' }
  ];

  return (
  <section className="pt-12 mt-12 border-t border-[#3F72AF]/8">
  <div className="flex items-center justify-between mb-8 pdf-no-break">
  <h3 className="text-xl font-bold flex items-center gap-3">
  <ScrollText className="text-[#112D4E] w-6 h-6" /> 자기소개서
  </h3>
  </div>

  {/* Tab Bar */}
  <div className="flex items-center gap-2 mb-6 flex-wrap pdf-no-break">
  {selfIntroTabs.map((tab) => (
  <div key={tab.id} className="relative flex items-center">
  {isEditing && editingIntroTabId === tab.id ? (
  <input
  type="text"
  className="px-4 py-2 bg-[#DBE2EF]/60 border border-[#112D4E] rounded-xl text-sm font-bold text-[#1A59A7] focus:outline-none min-w-[80px]"
  value={tab.title}
  autoFocus
  onChange={(e) => {
  const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, title: e.target.value } : t);
  setData({...data, selfIntroTabs: newTabs});
  }}
  onBlur={() => setEditingIntroTabId(null)}
  onKeyDown={(e) => { if (e.key === 'Enter') setEditingIntroTabId(null); }}
  />
  ) : (
  <button
  onClick={() => setActiveIntroTab(tab.id)}
  onDoubleClick={() => isEditing && setEditingIntroTabId(tab.id)}
  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
  activeIntroTab === tab.id
  ? 'bg-[#0a1e36] text-[#F9F7F7] shadow-lg shadow-[#112D4E]/25'
  : 'glass text-[#112D4E] hover:text-[#112D4E] hover:bg-[#112D4E]/5'
  }`}
  >
  {tab.title}
  </button>
  )}
  {isEditing && selfIntroTabs.length > 1 && (
  <button
  onClick={(e) => {
  e.stopPropagation();
  const newTabs = selfIntroTabs.filter(t => t.id !== tab.id);
  setData({...data, selfIntroTabs: newTabs});
  if (activeIntroTab === tab.id && newTabs.length > 0) {
  setActiveIntroTab(newTabs[0].id);
  }
  }}
  className="ml-1 p-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
  title="탭 삭제"
  >
  <X className="w-3 h-3" />
  </button>
  )}
  </div>
  ))}
  {isEditing && (
  <button
  onClick={() => {
  const newTab: SelfIntroTab = {
  id: `intro-${Date.now()}`,
  title: '새 항목',
  content: '내용을 입력하세요.'
  };
  const newTabs = [...selfIntroTabs, newTab];
  setData({...data, selfIntroTabs: newTabs});
  setActiveIntroTab(newTab.id);
  }}
  className="px-3 py-2 border-2 border-dashed border-[#3F72AF]/20 rounded-xl text-sm font-bold text-[#0a1e36] hover:text-[#112D4E] hover:border-[#112D4E]/50 transition-all flex items-center gap-1.5"
  >
  <Plus className="w-3.5 h-3.5" /> 탭 추가
  </button>
  )}
  </div>

  {/* Tab Content */}
  <div className="glass rounded-[2rem] p-6 pdf-no-break">
  {selfIntroTabs.map((tab) => (
  <div key={tab.id} style={{ display: activeIntroTab === tab.id ? 'block' : 'none' }}>
    <EditableText
      value={tab.content}
      onSave={(v) => {
        const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, content: v } : t);
        setData({...data, selfIntroTabs: newTabs});
      }}
      isEditing={isEditing}
      multiline
      className="leading-relaxed font-medium markdown-body min-h-[300px]"
      style={tab.style || {}}
      styleData={tab.style || {}}
      onStyleSave={(s) => {
        const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, style: s } : t);
        setData({...data, selfIntroTabs: newTabs});
      }}
    />
  </div>
  ))}
  </div>
  </section>
  );
};

const Footer = () => (
 <footer className="py-16 px-6 text-center">
 <div className="max-w-7xl mx-auto flex items-center justify-center border-t border-[#3F72AF]/8 pt-12">
 <p className="text-[#8fabc8] text-sm font-medium">© PM 지원자 양현우 포트폴리오 All rights reserved.</p>
 </div>
 </footer>
);

const BackToTop = () => {
 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
 const toggleVisibility = () => {
 if (window.pageYOffset > 500) {
 setIsVisible(true);
 } else {
 setIsVisible(false);
 }
 };

 window.addEventListener('scroll', toggleVisibility);
 return () => window.removeEventListener('scroll', toggleVisibility);
 }, []);

 const scrollToTop = () => {
 window.scrollTo({
 top: 0,
 behavior: 'smooth'
 });
 };

 return (
 <AnimatePresence>
 {isVisible && (
 <motion.button
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.8 }}
 onClick={scrollToTop}
 className="fixed bottom-8 right-8 z-50 w-12 h-12 glass rounded-full flex items-center justify-center text-[#1A59A7] hover:bg-[#112D4E]/10 transition-all shadow-2xl"
 >
 <ArrowUp className="w-6 h-6" />
 </motion.button>
 )}
 </AnimatePresence>
 );
};

const ImageModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#112D4E]/80 backdrop-blur-sm"
 onClick={onClose}
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="relative max-w-5xl w-full glass rounded-[2.5rem] overflow-hidden p-2"
 onClick={e => e.stopPropagation()}
 >
 <button 
 onClick={onClose}
 className="absolute top-6 right-6 z-10 w-10 h-10 glass rounded-full flex items-center justify-center text-[#1A59A7] hover:bg-[#112D4E]/10 transition-all"
 >
 <X className="w-6 h-6" />
 </button>
 <img 
 src="https://ais-dev-pk434uciagywugueajrdik-352024962937.asia-northeast1.run.app/api/file/ais-dev-pk434uciagywugueajrdik-352024962937.asia-northeast1.run.app/attachments/0194b635-f09d-7901-831d-853488730870" 
 alt="UI Reference" 
 className="w-full h-auto rounded-[2rem]"
 referrerPolicy="no-referrer"
 />
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
);

const ProjectDetail = ({ project, onBack, isEditing, onSaveContent }: { project: Project, onBack: () => void, isEditing: boolean, onSaveContent: (content: string) => void }) => (
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

const StatBoardMobileAccordion = ({ title, isActive, onClick, children }: any) => (
  <div className="border border-[#3F72AF]/20 rounded-2xl mb-4 overflow-hidden bg-white/50 backdrop-blur-md">
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 font-bold text-[#112D4E]">
      <span className="tracking-widest uppercase text-sm">{title}</span>
      <ChevronRight className={`w-5 h-5 transition-transform ${isActive ? 'rotate-90' : ''}`} />
    </button>
    <AnimatePresence>
      {isActive && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
          <div className="p-5 pt-0 border-t border-[#3F72AF]/10">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const DraggableChart = ({ isEditing, initialPoints, onSave }: any) => {
  const [points, setPoints] = useState<any[]>(initialPoints);
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    setPoints(initialPoints);
  }, [initialPoints]);

  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingIdx(idx);
    setHoverIdx(null);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isEditing || draggingIdx === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(400, ((e.clientX - rect.left) / rect.width) * 400));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    const newPoints = [...points];
    newPoints[draggingIdx] = { ...newPoints[draggingIdx], x, y };
    setPoints(newPoints);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingIdx !== null) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggingIdx(null);
      onSave(points);
    }
  };

  const dPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative h-28 w-full overflow-visible flex items-center justify-center mt-4 mb-4">
        <svg 
          ref={svgRef} 
          viewBox="0 0 400 100" 
          className="w-[110%] h-[110%] drop-shadow-md overflow-visible"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <path d="M 0,80 L 400,80" stroke="#DBE2EF" strokeWidth="2" strokeDasharray="4 4" />
          <path d={dPath} stroke="#1A59A7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p: any, i: number) => (
            <g key={i}>
              <circle 
                cx={p.x} cy={p.y} r={isEditing && draggingIdx === i ? 12 : isEditing ? 10 : 8} fill="#112D4E" stroke="#fff" strokeWidth={2}
                className={`${isEditing ? 'cursor-grab active:cursor-grabbing hover:scale-125' : 'cursor-help hover:scale-125 hover:fill-[#3F72AF]'} transition-transform shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`} 
                onPointerDown={(e) => handlePointerDown(i, e)}
                onMouseEnter={() => { if(draggingIdx === null) setHoverIdx(i); }}
                onMouseLeave={() => { if(draggingIdx === null) setHoverIdx(null); }}
              />
            </g>
          ))}
        </svg>
        <AnimatePresence>
          {hoverIdx !== null && draggingIdx === null && !isEditing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-50 bg-[#112D4E]/95 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full min-w-[200px] border border-white/10"
              style={{ left: `${(points[hoverIdx].x / 400) * 100}%`, top: `${(points[hoverIdx].y / 100) * 100}%`, marginTop: '-15px' }}
            >
              <div className="font-black text-sm mb-1 text-cyan-300 tracking-tight">{points[hoverIdx].label}</div>
              <div className="text-[11px] text-white/90 leading-relaxed font-medium whitespace-pre-wrap">{points[hoverIdx].detail}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isEditing && (
        <div className="w-full bg-white/60 p-3 rounded-2xl border border-[#DBE2EF] grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-2 mt-4 shadow-inner">
          {points.map((p: any, i: number) => (
             <div key={i} className="flex flex-col gap-1 p-2 bg-white rounded-lg shadow-sm border border-black/5">
                <input 
                  value={p.label} 
                  onChange={e => {
                    const newPts = [...points];
                    newPts[i].label = e.target.value;
                    setPoints(newPts);
                  }}
                  onBlur={() => onSave(points)}
                  className="text-xs font-bold text-[#112D4E] bg-transparent border-b border-[#DBE2EF] focus:border-[#3F72AF] focus:outline-none" 
                  placeholder="태그"
                />
                <textarea
                  value={p.detail} 
                  onChange={e => {
                    const newPts = [...points];
                    newPts[i].detail = e.target.value;
                    setPoints(newPts);
                  }}
                  onBlur={() => onSave(points)}
                  className="text-[10px] text-gray-500 bg-transparent border-none focus:outline-none resize-none h-10 no-scrollbar leading-tight font-medium" 
                  placeholder="상세 설명"
                />
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatBoard = ({ isEditing, projects, setProjects, skillTabs, setSkillTabs, tools, setTools, onProjectClick, userImage, onImageUpload }: any) => {
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [mobileCategory, setMobileCategory] = useState<string>('projects');
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (onImageUpload) onImageUpload(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (projects && projects.length > 0 && !hoveredItem) {
      setHoveredItem({ type: 'project', data: projects[0] });
    }
  }, [projects]);

  const updateProject = (id: string, field: string, value: string) => {
    const newProjects = [...projects];
    const pIdx = newProjects.findIndex((p: any) => p.id === id);
    if (pIdx > -1) {
      newProjects[pIdx][field] = value;
      setProjects(newProjects);
      if (hoveredItem?.data?.id === id) setHoveredItem({ type: 'project', data: newProjects[pIdx] });
    }
  };

  const renderProjectDetail = (p: any) => (
    <div className="flex flex-col h-full animate-fade-in relative z-10 w-full">
      <div className="flex justify-between items-start mb-2">
        <div className="text-[10px] font-bold text-[#3F72AF] tracking-widest uppercase bg-[#3F72AF]/10 inline-block px-3 py-1 rounded-full w-fit">
          <EditableText value={p.category} isEditing={isEditing} onSave={(v) => updateProject(p.id, 'category', v)} />
        </div>
        {isEditing && (
          <button onClick={() => {
            if(confirm("프로젝트를 삭제하시겠습니까?")) {
              const newProjects = projects.filter((proj: any) => proj.id !== p.id);
              setProjects(newProjects);
              setHoveredItem(null);
            }
          }} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
        )}
      </div>
      <h3 className="text-3xl font-black text-[#112D4E] mb-4 leading-tight">
        <EditableText value={p.title} isEditing={isEditing} onSave={(v) => updateProject(p.id, 'title', v)} />
      </h3>
      <div className="text-[#112D4E]/80 text-sm mb-8 leading-relaxed whitespace-pre-wrap">
        <EditableText value={p.description || "설명이 없습니다."} isEditing={isEditing} multiline onSave={(v) => updateProject(p.id, 'description', v)} />
      </div>
      
      {/* Interactive Draggable Points Chart */}
      <div className="mt-auto mb-4 bg-white/50 rounded-[2rem] p-6 border border-[#DBE2EF] shadow-sm w-full">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-[#112D4E] flex items-center gap-2 uppercase"><Target className="w-4 h-4"/> Project Data Profile</h4>
        <DraggableChart 
          isEditing={isEditing} 
          initialPoints={p.chartPoints || [
            { x: 30, y: 80, label: "Planning", detail: "초기 기획 및 구조 설계" },
            { x: 120, y: 50, label: "Design", detail: "UX/UI 설계 및 시각화" },
            { x: 200, y: 60, label: "Execution", detail: "프로젝트 진행 및 구현" },
            { x: 280, y: 30, label: "Troubleshoot", detail: "문제 해결 및 이슈 대응" },
            { x: 370, y: 15, label: "Impact", detail: "최종 성과 및 지표 개선" },
          ]}
          onSave={(points: any) => updateProject(p.id, 'chartPoints', points)}
        />
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {p.tags?.map((t: string, i: number) => <span key={i} className="text-[10px] font-bold px-3 py-1 bg-[#DBE2EF] text-[#1A59A7] rounded-full">#{t}</span>)}
        {isEditing && (
          <button onClick={() => {
            const newTags = [...(p.tags || []), "새태그"];
            updateProject(p.id, 'tags', newTags as any);
          }} className="text-[10px] font-bold px-3 py-1 border border-[#3F72AF]/30 text-[#3F72AF] rounded-full hover:bg-[#DBE2EF] transition-colors">+ 태그</button>
        )}
      </div>
      <button onClick={() => onProjectClick(p)} className="mt-auto w-full py-4 bg-[#0a1e36] text-[#F9F7F7] rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#112D4E] transition-all shadow-xl">상세 내용 보기 <ArrowUpRight className="w-4 h-4"/></button>
    </div>
  );

  const renderSkillDetail = (s: any) => (
    <div className="flex flex-col h-full justify-center animate-fade-in w-full">
      <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-[#1A59A7] mb-8 shadow-lg border border-[#DBE2EF]">
        {resolveIcon(s.icon)}
      </div>
      <h3 className="text-4xl font-black text-[#112D4E] mb-4">{s.name}</h3>
      <p className="text-lg text-[#3F72AF] font-medium mb-12 italic leading-relaxed">"{s.caption}"</p>
      
      <div className="relative pt-8 w-full mt-auto">
        <div className="flex justify-between text-[11px] font-black text-[#112D4E] mb-3 uppercase tracking-widest">
          <span>Proficiency</span>
          <span>{s.level}%</span>
        </div>
        <div className="h-4 bg-[#DBE2EF]/50 rounded-full overflow-hidden p-0.5">
          <motion.div initial={{width:0}} animate={{width:`${s.level}%`}} className="h-full bg-gradient-to-r from-[#3F72AF] to-[#112D4E] rounded-full shadow-inner" />
        </div>
      </div>
    </div>
  );

  const renderToolDetail = (t: any) => (
    <div className="flex flex-col h-full justify-center text-center items-center animate-fade-in w-full">
      <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border border-[#DBE2EF] mb-8 p-6">
        {t.iconUrl ? <img src={t.iconUrl} className="w-full h-full object-contain filter drop-shadow-md" alt={t.name}/> : <Wrench className="w-12 h-12 text-[#3F72AF]"/>}
      </div>
      <h3 className="text-3xl font-black text-[#112D4E] mb-6">{t.name}</h3>
      <div className="w-12 h-1 bg-[#3F72AF]/20 mx-auto rounded-full mb-6" />
      <p className="text-[#112D4E]/80 text-sm leading-relaxed max-w-sm whitespace-pre-wrap">{t.description}</p>
    </div>
  );

  return (
    <section id="stat-board" className="pt-12 pb-24 px-6 max-w-[1400px] mx-auto relative z-20 bg-[#F9F7F7]">
      <div className="w-full flex justify-center mb-16 pointer-events-none">
        <div className="flex flex-col items-center animate-pulse opacity-90">
          <span className="text-[11px] md:text-sm font-black tracking-widest text-[#3F72AF] mb-2 uppercase drop-shadow-sm">SCROLL</span>
          <div className="w-[2px] h-16 md:h-24 bg-gradient-to-b from-[#3F72AF] via-[#3F72AF] to-transparent shadow-sm"></div>
        </div>
      </div>

      {/* DESKTOP 3-COLUMN */}
      <div className="hidden lg:grid gap-8 items-start relative select-none w-full" style={{ gridTemplateColumns: '1.2fr 380px 1.5fr' }}>
        
        {/* LEFT COL: Navigation Lists */}
        <div className="flex flex-col justify-between pr-4 h-[80vh] py-2 w-full overflow-hidden">
          
          {/* Projects List */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pl-2">
                <h2 className="text-[10px] font-black tracking-[0.1em] text-[#8fabc8] uppercase">Portfolio</h2>
                {isEditing && (
                  <button onClick={() => {
                    const newProj = { id: Date.now().toString(), title: "새 프로젝트", category: "NEW", description: "설명", image: "", color: "from-blue-500 to-cyan-400", tags: ["태그"], details: [], chartPoints: null, content: "" };
                    setProjects([...projects, newProj]);
                  }} className="flex items-center gap-1 text-[9px] font-bold bg-white text-[#112D4E] px-2 py-0.5 rounded border border-[#DBE2EF] hover:bg-[#DBE2EF]"><Plus className="w-2.5 h-2.5"/>추가</button>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {projects.map((p: any) => (
                  <div key={p.id} onMouseEnter={() => setHoveredItem({type: 'project', data: p})}
                       className={`p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-300 border ${hoveredItem?.data.id === p.id ? 'bg-[#0a1e36] border-[#0a1e36] shadow-xl translate-x-3 scale-[1.02]' : 'bg-white border-[#DBE2EF] hover:bg-[#DBE2EF] hover:translate-x-1 shadow-sm'}`}>
                    <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${hoveredItem?.data.id === p.id ? 'text-[#3F72AF]' : 'text-[#8fabc8]'}`}>{p.category}</div>
                    <div className={`font-black text-xs leading-tight ${hoveredItem?.data.id === p.id ? 'text-white' : 'text-[#112D4E]'}`}>{p.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills List */}
            <div className="mt-4">
              <h2 className="text-[10px] font-black tracking-[0.1em] text-[#8fabc8] mb-2 uppercase pl-2">Core Competencies</h2>
              <div className="flex flex-col gap-1.5">
                {skillTabs.map((tab: any) => tab.skills.map((s:any, idx:number) => (
                  <div key={`${tab.id}-${idx}`} onMouseEnter={() => setHoveredItem({type: 'skill', data: s})}
                       className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-300 border ${hoveredItem?.data.name === s.name ? 'bg-[#0a1e36] border-[#0a1e36] shadow-md translate-x-2' : 'bg-white border-[#DBE2EF] hover:bg-[#DBE2EF] hover:translate-x-1'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hoveredItem?.data.name === s.name ? 'bg-[#112D4E] text-[#F9F7F7]' : 'bg-[#DBE2EF]/50 text-[#1A59A7]'}`}>
                      {resolveIcon(s.icon)}
                    </div>
                    <div className="flex-1">
                      <div className={`font-black text-[11px] ${hoveredItem?.data.name === s.name ? 'text-white' : 'text-[#112D4E]'}`}>{s.name}</div>
                      <div className="w-full h-1 bg-[#112D4E]/10 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-current opacity-90 rounded-full" style={{width: `${s.level}%`}}/>
                      </div>
                    </div>
                  </div>
                )))}
              </div>
            </div>

            {/* Tools List */}
            <div className="mt-4">
              <h2 className="text-[10px] font-black tracking-[0.1em] text-[#8fabc8] mb-2 uppercase pl-2">Arsenal</h2>
              <div className="flex flex-wrap gap-1.5">
                {tools.map((t: any) => (
                  <div key={t.id} onMouseEnter={() => setHoveredItem({type: 'tool', data: t})}
                       className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all border font-bold text-[10px] shadow-sm ${hoveredItem?.data.id === t.id ? 'bg-[#0a1e36] text-white border-[#0a1e36] shadow-md scale-105' : 'bg-white text-[#1A59A7] border-[#DBE2EF] hover:bg-[#DBE2EF]'}`}>
                    {t.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* CENTER COL: User Avatar */}
        <div className="h-[80vh] sticky top-24 flex flex-col items-center justify-center pb-8 pt-4">
          <div className="w-full h-full relative group flex items-center justify-center">
            <img src={userImage || "https://picsum.photos/400/800"} alt="Avatar" className="w-[120%] h-[120%] max-w-[none] object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] group-hover:scale-[1.05] transition-transform duration-1000" />
            
            <div className="absolute bottom-10 left-0 right-0 z-20 px-8 text-center pointer-events-none">
              <div className="inline-block px-4 py-2 bg-[#112D4E]/80 backdrop-blur-md rounded-full text-[10px] font-black text-white tracking-[0.3em] uppercase mb-3 shadow-lg">Candidate</div>
            </div>
            
            {isEditing && (
              <div className="absolute inset-0 bg-[#112D4E]/50 rounded-[3rem] flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-30"
                   onClick={() => document.getElementById('statboard-desktop-img')?.click()}>
                <div className="text-white flex flex-col items-center">
                  <Upload className="w-10 h-10 mb-3" />
                  <span className="font-bold text-sm bg-black/30 px-3 py-1 rounded-full">이미지 변경</span>
                </div>
                <input type="file" id="statboard-desktop-img" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            )}
          </div>
        </div>
        
        {/* RIGHT COL: Hover Details */}
        <div className="h-[80vh] sticky top-24 pt-4">
          <div className="h-full bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 lg:p-12 border-2 border-white shadow-2xl overflow-hidden flex flex-col w-full relative">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#3F72AF]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#112D4E]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {hoveredItem ? (
              hoveredItem.type === 'project' ? renderProjectDetail(hoveredItem.data) :
              hoveredItem.type === 'skill' ? renderSkillDetail(hoveredItem.data) :
              renderToolDetail(hoveredItem.data)
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#8fabc8] font-bold text-center">
                <Target className="w-12 h-12 mb-4 opacity-50"/>
                <p className="text-sm">좌측 리스트에 마우스를 올리면<br/>상세 정보가 스캔됩니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE/TABLET ACCORDION (below lg) */}
      <div className="lg:hidden flex flex-col gap-6 w-full">
        <div className="w-full aspect-[3/4] max-h-[70vh] relative mb-12 group flex items-center justify-center">
          <img src={userImage || "https://picsum.photos/400/800"} alt="Avatar" className="w-[120%] h-[120%] max-w-[none] object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end p-8 pointer-events-none justify-center text-center">
            <div className="bg-[#112D4E]/80 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black mb-1 tracking-tight text-white">STATUS</h2>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]">Interactive Board</p>
            </div>
          </div>
          {isEditing && (
             <div className="absolute inset-0 bg-[#112D4E]/40 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-30"
                  onClick={() => document.getElementById('statboard-mobile-img')?.click()}>
                <Upload className="w-10 h-10 mb-3 text-white" />
                <span className="font-bold text-sm text-white bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">이미지 변경</span>
                <input type="file" id="statboard-mobile-img" accept="image/*" className="hidden" onChange={handleImageUpload} />
             </div>
          )}
        </div>

        <div className="flex flex-col w-full">
          <StatBoardMobileAccordion title="Portfolio" isActive={mobileCategory === 'projects'} onClick={() => setMobileCategory(mobileCategory === 'projects' ? '' : 'projects')}>
            <div className="flex flex-col gap-2 pt-2">
               {isEditing && (
                 <button onClick={() => {
                   const newProj = { id: Date.now().toString(), title: "새 프로젝트", category: "NEW", description: "설명", image: "", color: "from-blue-500 to-cyan-400", tags: [], details: [], content: "" };
                   setProjects([...projects, newProj]);
                 }} className="flex items-center justify-center gap-2 mb-4 w-full py-3 border-2 border-dashed border-[#3F72AF]/30 rounded-xl text-[#3F72AF] font-bold hover:bg-[#3F72AF]/5"><Plus className="w-4 h-4"/> 새 프로젝트 추가</button>
               )}
               {projects.map((p: any) => (
                 <div key={p.id} className="border-b border-[#3F72AF]/10 pb-8 last:border-0 last:pb-0 w-full overflow-hidden">
                    {renderProjectDetail(p)}
                 </div>
               ))}
            </div>
          </StatBoardMobileAccordion>
          
          <StatBoardMobileAccordion title="Core Competencies" isActive={mobileCategory === 'skills'} onClick={() => setMobileCategory(mobileCategory === 'skills' ? '' : 'skills')}>
            <div className="flex flex-col gap-12 pt-6 pb-4 w-full">
              {skillTabs.map((tab) => tab.skills.map((s:any, idx:number) => (
                <div key={`${tab.id}-${idx}`} className="w-full">
                  {renderSkillDetail(s)}
                </div>
              )))}
            </div>
          </StatBoardMobileAccordion>
          
          <StatBoardMobileAccordion title="Arsenal (Tools)" isActive={mobileCategory === 'tools'} onClick={() => setMobileCategory(mobileCategory === 'tools' ? '' : 'tools')}>
            <div className="grid grid-cols-2 gap-4 pt-4 pb-4 w-full">
              {tools.map((t:any) => (
                <div key={t.id} className="bg-white rounded-[1.5rem] p-5 shadow flex flex-col items-center text-center border border-[#DBE2EF]">
                  <div className="w-12 h-12 mb-4">{t.iconUrl ? <img src={t.iconUrl} className="w-full h-full object-contain drop-shadow-sm"/> : <Wrench className="w-full h-full text-[#3F72AF]"/>}</div>
                  <div className="font-bold text-[#112D4E] text-xs leading-tight">{t.name}</div>
                </div>
              ))}
            </div>
          </StatBoardMobileAccordion>
        </div>
      </div>
    </section>
  );
};

export default function App() {
 const [view, setView] = useState<'home' | 'resume' | 'self-intro' | 'project-detail' | 'portfolio' | 'all-projects' | 'more-me'>('home');
  const [prevViewForDetail, setPrevViewForDetail] = useState<string>('home');
  const [prevView, setPrevView] = useState<'home' | 'resume' | 'self-intro' | 'project-detail' | 'portfolio' | 'all-projects' | 'more-me'>('home');
 
  const changeView = (newView: 'home' | 'resume' | 'self-intro' | 'project-detail' | 'portfolio' | 'all-projects' | 'more-me') => {
 setPrevView(view);
 setView(newView);
 };

 const [selectedProject, setSelectedProject] = useState<Project | null>(null);
 const [scrollTarget, setScrollTarget] = useState<string | null>(null);
 const [isImageModalOpen, setIsImageModalOpen] = useState(false);

 // --- Edit Mode Logic ---
 const [isEditing, setIsEditing] = useState(false);
	const [isHomePasswordOpen, setIsHomePasswordOpen] = useState(false);

 // --- Persistent Content ---
 const [heroContent, setHeroContent] = useEditableContent({
 titleLine1: "기획의도를 알고",
 titleLine2: "목차를 쓸줄 아는 기획자",
 description: "사용자의 경험을 논리적으로 설계하고, 명확한 문서화를 통해 팀의 비전을 구체화합니다. 데이터와 심리학을 기반으로 한 깊이 있는 기획을 지향합니다."
 }, 'hero_content');

 const [aboutContent, setAboutContent] = useEditableContent({
 title: "논리와 감성의 균형으로",
 subtitle: "최고의 재미를 설계합니다.",
 p1: "게임이 '작동'하는 원리를 깊이 있게 학습했습니다. 단순한 아이디어를 넘어, 수치로 증명되는 밸런싱과 플레이어의 심리를 관통하는 내러티브 설계를 지향합니다.",
 p2: "훌륭한 게임 디자인은 보이지 않아야 한다고 믿습니다. 플레이어가 자연스럽게 몰입하고, 성취감을 느끼며, 그 세계의 일부가 된 듯한 경험을 제공하는 것이 저의 목표입니다.",
 stats: [
 { label: "제작 프로토타입", value: "12+" },
 { label: "QA 테스트 시간", value: "200+" },
 { label: "최대 기획서 분량", value: "50p" }
 ]
 }, 'about_content');


 const [portfolioData, setPortfolioData] = useEditableContent(PORTFOLIO_PROJECTS, 'portfolio_data');
 const [skillsData, setSkillsData] = useEditableContent(SKILLS, 'skills_data');
 const [skillTabsData, setSkillTabsData] = useEditableContent(INITIAL_SKILL_TABS, 'skill_tabs_data');
 const [toolsData, setToolsData] = useEditableContent(INITIAL_TOOLS, 'tools_data');
 const [historyData, setHistoryData] = useEditableContent(GAME_HISTORY, 'history_data');
 const [resumeData, setResumeData] = useEditableContent(RESUME_DATA, 'resume_data');  useEffect(() => {
    if (scrollTarget && (view === 'home' || view === 'more-me')) {
      let attempts = 0;
      let scrollTimer = null;
      const checkAndScroll = () => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          const bodyRect = document.body.getBoundingClientRect().top;
          window.scrollTo({ top: el.getBoundingClientRect().top - bodyRect - 100, behavior: 'smooth' });
          setScrollTarget(null);
        } else if (attempts < 15) {
          attempts++;
          scrollTimer = setTimeout(checkAndScroll, 200);
        } else {
          setScrollTarget(null);
        }
      };      scrollTimer = setTimeout(checkAndScroll, 400); 
      return () => clearTimeout(scrollTimer);
    }
  }, [view, scrollTarget]);  const handleNavClick = (id: string) => {
    const homeIds = ['about'];
    const moreMeIds = ['resume-section', 'portfolio-section', 'skills', 'my-tools'];

    if (homeIds.includes(id)) {
      if (view !== 'home') {
        setScrollTarget(null);
        changeView('home');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (moreMeIds.includes(id)) {
      if (view !== 'more-me') {
        setScrollTarget(id);
        changeView('more-me');
      } else {
        const el = document.getElementById(id);
        if (el) {
          const bodyRect = document.body.getBoundingClientRect().top;
          window.scrollTo({ top: el.getBoundingClientRect().top - bodyRect - 100, behavior: 'smooth' });
        }
      }
    } else {
      if (view !== 'home') {
        setScrollTarget(id);
        changeView('home');
      }
    }
  };

 const handleProjectClick = (project: Project) => {
  setSelectedProject(project);
  setPrevViewForDetail(view);
  changeView('project-detail');
  };

 return (
 <div className="min-h-screen selection:bg-[#112D4E]/30">
 <Navbar 
 setView={changeView} 
 currentView={view} 
 onNavClick={handleNavClick} 
 isEditing={isEditing} 
 setIsEditing={setIsEditing}
 />
 <main>
 <AnimatePresence mode="wait">  {view === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: '-50%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-50%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Hero 
              onNavClick={handleNavClick}
              onToggleAdmin={() => {
                if (isEditing) { setIsEditing(false); } else {
                  setIsHomePasswordOpen(true);
                }
              }}
              isEditing={isEditing}
              content={heroContent}
              setContent={setHeroContent}
            />
            <About 
              isEditing={isEditing} 
              content={aboutContent} 
              setContent={setAboutContent} 
              onMoreMeClick={() => { changeView('more-me'); window.scrollTo(0,0); }}
            />
            
            <StatBoard 
              isEditing={isEditing}
              projects={portfolioData}
              setProjects={setPortfolioData}
              skillTabs={skillTabsData}
              setSkillTabs={setSkillTabsData}
              tools={toolsData}
              setTools={setToolsData}
              onProjectClick={handleProjectClick}
              userImage={resumeData.statBoardImage || resumeData.resumeImage || heroContent.heroImage}
              onImageUpload={(dataUrl: string) => {
                setResumeData({...resumeData, statBoardImage: dataUrl});
              }}
            />
          </motion.div>
        )}

        {view === 'more-me' && (          <motion.div 
            key="more-me"
            initial={{ opacity: 0, x: '50%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '50%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full"
          >            <section id="resume-section" className="pt-8 md:pt-16">
              <Resume 
                setView={changeView} 
                isEditing={isEditing} 
                data={resumeData} 
                setData={setResumeData} 
              />
            </section>
            
            {/* The legacy admin components are preserved but hidden unless editing, OR we can just rely on dedicated tabs later.
                For now, they are fully replaced by the StatBoard in the normal view. 
                If the user wants to edit them, they can switch back or use the separate portfolio views. */}
            {isEditing && (
              <div className="mt-32 p-8 border-4 border-dashed border-red-400/30 rounded-[3rem] bg-red-400/5 mx-6 max-w-7xl xl:mx-auto">
                <h2 className="text-center text-red-500 font-bold mb-8">🛠️ 레거시 에디터 (데이터 수정용)</h2>
                <Projects onProjectClick={handleProjectClick} isEditing={isEditing} projects={portfolioData} setProjects={setPortfolioData} limit={6} setView={changeView} />
                <Skills isEditing={isEditing} skillTabs={skillTabsData} setSkillTabs={setSkillTabsData} />
                <MyTools isEditing={isEditing} tools={toolsData} setTools={setToolsData} />
              </div>
            )}
          </motion.div>
        )}

 {view === 'portfolio' && (
 <Portfolio 
 key="portfolio"
 onProjectClick={handleProjectClick}
 isEditing={isEditing}
 projects={portfolioData}
 setProjects={setPortfolioData}
 setView={changeView}
 />
 )}

 {view === 'all-projects' && (
 <div key="all-projects" className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
 <button 
 onClick={() => changeView('home')}
 className="flex items-center gap-2 text-[#112D4E] hover:text-[#112D4E] transition-colors mb-12 group"
 >
 <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 돌아가기
 </button>
 <Projects 
 onProjectClick={handleProjectClick} 
 isEditing={isEditing} 
 projects={portfolioData} 
 setProjects={setPortfolioData}
 />
 </div>
 )}

 {view === 'project-detail' && selectedProject && (
 <ProjectDetail 
 key="project-detail"
 project={selectedProject} 
 onBack={() => changeView((prevViewForDetail === 'project-detail' ? 'home' : prevViewForDetail) as any)} 
 isEditing={isEditing}
  onSaveContent={(content) => {
    if (!selectedProject) return;
    const newPortfolio = [...portfolioData];
    const pIdx = newPortfolio.findIndex(p => p.id === selectedProject.id);
    if (pIdx !== -1) {
      newPortfolio[pIdx].content = content;
      setPortfolioData(newPortfolio);
      setSelectedProject({...selectedProject, content});
    }
  }}
 />
 )}
 </AnimatePresence>
 <PasswordModal
	isOpen={isHomePasswordOpen}
	onClose={() => setIsHomePasswordOpen(false)}
	onConfirm={(pw) => {
	if (pw === 'qwer154') {
	setIsEditing(true);
	setIsHomePasswordOpen(false);
	}
	}}
	/>
	</main>
 <Footer />
 <BackToTop />
 <ImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
 
 {isEditing && (
 <div className="fixed bottom-24 left-8 z-50 flex flex-col gap-2">
 <div className="glass p-4 rounded-2xl flex items-center gap-3 border border-amber-500/30 shadow-2xl">
 <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black">
 <Edit3 className="w-5 h-5" />
 </div>
 <div>
 <p className="text-xs font-bold text-[#3F72AF] uppercase tracking-widest">Admin Mode</p>
 <p className="text-[10px] text-[#112D4E]">내용을 클릭하여 직접 수정하세요. 자동 저장됩니다.</p>
 </div>
 <button 
 onClick={() => setIsEditing(false)}
 className="ml-4 p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors"
 >
 <Lock className="w-4 h-4 text-[#0a1e36]" />
 </button>
 </div>
 </div>
 )}
 </div>
 );
}
