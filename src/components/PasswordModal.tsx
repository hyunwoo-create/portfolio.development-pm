import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pw: string) => void;
}

export const PasswordModal = ({ isOpen, onClose, onConfirm }: PasswordModalProps) => {
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
