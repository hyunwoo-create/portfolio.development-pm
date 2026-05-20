import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Lock, Settings, X, FolderOpen } from 'lucide-react';
import { PasswordModal } from './PasswordModal';
import { useAppStore } from '../store';

interface NavbarProps {
  setView: (v: any) => void;
  currentView: string;
  onNavClick: (id: string) => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  onOpenSiteManager?: () => void;
}

export const Navbar = ({ setView, currentView, onNavClick, isEditing, setIsEditing, onOpenSiteManager }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { siteId, sites } = useAppStore();
  const currentSiteName = sites.find(s => s.id === siteId)?.name || siteId;

  const navLinks = [
    { label: '소개', view: 'home', action: () => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); } },
    { label: '이력서', view: 'resume', action: () => { onNavClick('resume-section'); setIsMenuOpen(false); } },
    { label: '포트폴리오', view: 'portfolio', action: () => { setView('portfolio'); setIsMenuOpen(false); } }
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
    const adminPw = import.meta.env.VITE_ADMIN_PASSWORD;
    
    // 환경 변수가 아예 없거나 빈 문자열인 경우 보안을 위해 차단
    if (!adminPw || adminPw.trim() === "") {
      alert("서버 설정 오류: 관리자 비밀번호가 설정되지 않았습니다. GitHub Secrets를 확인해 주세요.");
      return;
    }

    if (pw.trim() === adminPw.trim()) {
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
          <div className="w-12 h-12 bg-[#F9F7F7] rounded-2xl flex items-center justify-center shadow-xl shadow-[#112D4E]/15 group-hover:scale-105 transition-transform border border-[#3F72AF]/30">
            <Home className="text-[#1A59A7] w-6 h-6 cursor-pointer pointer-events-none" />
          </div>
          {isEditing && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#3F72AF]/20 border border-[#3F72AF]/50 rounded text-[10px] text-[#112D4E] font-bold uppercase animate-pulse pointer-events-none whitespace-nowrap">
              Edit Mode
            </div>
          )}
        </div>

        {/* Center: Navigation Links in a pill */}
        <nav className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-0 hidden md:flex items-center gap-8 bg-[#F9F7F7] rounded-full px-8 h-12 shadow-xl shadow-[#112D4E]/15 border border-[#3F72AF]/30">
          {navLinks.map((link) => {
            const isActive = link.view === currentView || (link.view === 'portfolio' && currentView === 'project-detail');
            return (
              <button
                key={link.label}
                onClick={link.action}
                className={`transition-all duration-300 relative font-bold text-[0.95rem] tracking-wide 
                  ${isActive ? 'text-[#3F72AF]' : 'text-[#112D4E] hover:text-[#3F72AF]'}
                  after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#3F72AF] after:transition-all after:duration-300
                  ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                `}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Admin & Mobile Menu */}
        <div className="pointer-events-auto flex items-center gap-2 relative">
          {/* Site Manager Button (admin only) */}
          {isEditing && onOpenSiteManager && (
            <button
              onClick={onOpenSiteManager}
              className="hidden md:flex items-center gap-2 h-12 px-4 bg-[#F9F7F7] rounded-2xl hover:bg-[#112D4E]/10 transition-colors shadow-xl shadow-[#112D4E]/15 border border-[#3F72AF]/30"
              title="사이트 관리"
            >
              <FolderOpen className="w-4 h-4 text-[#3F72AF]" />
              <span className="text-xs font-bold text-[#112D4E] max-w-[120px] truncate">{currentSiteName}</span>
            </button>
          )}
          <button
            onClick={handleAdminClick}
            className="hidden md:flex w-12 h-12 items-center justify-center bg-[#F9F7F7] rounded-2xl hover:bg-[#112D4E]/10 transition-colors shadow-xl shadow-[#112D4E]/15 border border-[#3F72AF]/30"
            title={isEditing ? '완료' : '관리자모드'}
          >
            {isEditing ? <Lock className="w-5 h-5 text-[#112D4E]" /> : <Settings className="w-5 h-5 text-[#112D4E]" />}
          </button>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="w-12 h-12 flex items-center justify-center bg-[#F9F7F7] rounded-2xl text-[#112D4E] shadow-xl shadow-[#112D4E]/15 border border-[#3F72AF]/30"
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
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 bg-[#F9F7F7] border border-[#3F72AF]/20 rounded-2xl p-4 flex flex-col gap-2 md:hidden shadow-2xl"
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
            {isEditing && onOpenSiteManager && (
              <button
                onClick={() => { onOpenSiteManager(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-start gap-2 px-4 py-3 text-[#3F72AF] font-bold rounded-xl hover:bg-[#DBE2EF] transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                사이트 관리 ({currentSiteName})
              </button>
            )}
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
