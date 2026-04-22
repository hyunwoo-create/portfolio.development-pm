import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Upload } from 'lucide-react';
import { getExternalEmbedUrl } from '../utils';

interface HeroVideoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  onSave: (url: string) => void;
}

const isDirectVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('.mp4') || url.includes('.webm') || url.startsWith('data:video/') || url.startsWith('blob:');
};

export const HeroVideoSettingsModal = ({ isOpen, onClose, videoUrl, onSave }: HeroVideoSettingsModalProps) => {
  const [url, setUrl] = useState(videoUrl);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(videoUrl);
  }, [videoUrl]);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
  };

  const handleSave = () => {
    const processedUrl = isDirectVideoUrl(url) ? url : getExternalEmbedUrl(url);
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
