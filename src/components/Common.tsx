import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, X } from 'lucide-react';

export const Footer = () => (
  <footer className="py-16 px-6 text-center">
    <div className="max-w-7xl mx-auto flex items-center justify-center border-t border-[#3F72AF]/8 pt-12">
      <p className="text-[#8fabc8] text-sm font-medium">© PM 지원자 양현우 포트폴리오 All rights reserved.</p>
    </div>
  </footer>
);

export const BackToTop = () => {
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

export const ImageModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
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
