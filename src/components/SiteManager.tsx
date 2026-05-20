import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Copy, Trash2, ExternalLink, Check, X, FolderOpen, ChevronDown, Pencil } from 'lucide-react';
import { useAppStore } from '../store';

interface SiteManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

// 한글/영문 이름을 URL-safe slug로 변환
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[가-힣]+/g, (match) => {
      // 간단한 한글→영문 매핑 대신, 한글은 그대로 유지하되 URL에 쓸 수 있는 형태로
      return match;
    })
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const SiteManager = ({ isOpen, onClose }: SiteManagerProps) => {
  const { sites, siteId, setSiteId, fetchSites, createSite, deleteSite, renameSite } = useAppStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteSlug, setNewSiteSlug] = useState('');
  const [copyFromSite, setCopyFromSite] = useState('default');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSites();
    }
  }, [isOpen, fetchSites]);

  // 이름 입력 시 slug 자동 생성
  useEffect(() => {
    if (newSiteName) {
      setNewSiteSlug(toSlug(newSiteName));
    } else {
      setNewSiteSlug('');
    }
  }, [newSiteName]);

  const getFullUrl = (slug: string) => {
    const origin = window.location.origin;
    const base = '/portfolio.development-pm/';
    if (slug === 'default') return `${origin}${base}`;
    return `${origin}${base}${slug}/`;
  };

  const handleCopyLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(getFullUrl(slug));
      setCopiedId(slug);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = getFullUrl(slug);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(slug);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCreateSite = async () => {
    if (!newSiteName.trim() || !newSiteSlug.trim()) return;
    
    // 중복 체크
    if (sites.some(s => s.id === newSiteSlug)) {
      alert('이미 존재하는 슬러그입니다. 다른 이름을 사용해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createSite(newSiteSlug, newSiteName.trim(), copyFromSite || undefined);
      setNewSiteName('');
      setNewSiteSlug('');
      setIsCreating(false);
      setCopyFromSite('default');
    } catch (e) {
      console.error('Failed to create site:', e);
      alert('사이트 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSite = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteSite(id);
      setDeleteConfirmId(null);
    } catch (e) {
      console.error('Failed to delete site:', e);
      alert('사이트 삭제에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenameSite = async (id: string) => {
    if (!editName.trim()) return;
    await renameSite(id, editName.trim());
    setEditingId(null);
    setEditName('');
  };

  const handleSwitchSite = (id: string) => {
    setSiteId(id);
    // URL도 변경
    const base = '/portfolio.development-pm/';
    const newPath = id === 'default' ? base : `${base}${id}/`;
    window.history.pushState({}, '', newPath);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl border border-[#DBE2EF] overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DBE2EF]/60 bg-gradient-to-r from-[#F9F7F7] to-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-[#3F72AF]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#112D4E]">사이트 관리</h2>
                <p className="text-xs text-[#112D4E]/50">회사별 맞춤 포트폴리오 링크를 관리합니다</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#DBE2EF]/60 transition-colors"
            >
              <X className="w-5 h-5 text-[#112D4E]/60" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {sites.map((site) => {
              const isActive = site.id === siteId;
              const isDeleting = deleteConfirmId === site.id;
              const isEditingThis = editingId === site.id;

              return (
                <motion.div
                  key={site.id}
                  layout
                  className={`relative rounded-xl border-2 transition-all duration-200 ${
                    isActive 
                      ? 'border-[#3F72AF] bg-[#3F72AF]/5 shadow-md' 
                      : 'border-[#DBE2EF] bg-white hover:border-[#3F72AF]/40 hover:shadow-sm'
                  }`}
                >
                  <div className="px-4 py-3">
                    {/* Site name row */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? 'bg-[#3F72AF] animate-pulse' : 'bg-[#DBE2EF]'}`} />
                        
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleRenameSite(site.id)}
                              className="flex-1 text-sm font-bold text-[#112D4E] border border-[#3F72AF]/30 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/30"
                              autoFocus
                            />
                            <button onClick={() => handleRenameSite(site.id)} className="text-[#3F72AF] hover:text-[#112D4E]">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setEditingId(null); setEditName(''); }} className="text-[#112D4E]/40 hover:text-[#112D4E]">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm font-bold text-[#112D4E] truncate">{site.name}</span>
                            {isActive && (
                              <span className="shrink-0 text-[10px] font-bold text-[#3F72AF] bg-[#3F72AF]/10 px-2 py-0.5 rounded-full">
                                현재 보는 중
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        {!isEditingThis && site.id !== 'default' && (
                          <button
                            onClick={() => { setEditingId(site.id); setEditName(site.name); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#112D4E]/40 hover:text-[#3F72AF] hover:bg-[#3F72AF]/10 transition-all"
                            title="이름 변경"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {!isActive && (
                          <button
                            onClick={() => handleSwitchSite(site.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#3F72AF] hover:bg-[#3F72AF]/10 transition-all"
                          >
                            전환
                          </button>
                        )}
                        <button
                          onClick={() => handleCopyLink(site.slug)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#112D4E]/40 hover:text-[#3F72AF] hover:bg-[#3F72AF]/10 transition-all"
                          title="링크 복사"
                        >
                          {copiedId === site.slug ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {site.id !== 'default' && !isDeleting && (
                          <button
                            onClick={() => setDeleteConfirmId(site.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#112D4E]/40 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* URL */}
                    <div className="flex items-center gap-1.5 ml-[18px]">
                      <ExternalLink className="w-3 h-3 text-[#112D4E]/30 shrink-0" />
                      <span className="text-[11px] text-[#112D4E]/40 font-mono truncate">
                        {getFullUrl(site.slug)}
                      </span>
                    </div>

                    {/* Delete confirm */}
                    <AnimatePresence>
                      {isDeleting && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 pt-2 border-t border-red-100 overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-red-600 font-medium">정말 삭제하시겠습니까? 데이터도 함께 삭제됩니다.</p>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleDeleteSite(site.id)}
                                disabled={isSubmitting}
                                className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                              >
                                {isSubmitting ? '삭제 중...' : '삭제'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-3 py-1 text-xs font-bold text-[#112D4E]/60 bg-[#DBE2EF]/50 rounded-lg hover:bg-[#DBE2EF] transition-colors"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Create new site section */}
          <div className="border-t border-[#DBE2EF]/60 bg-[#F9F7F7]/50 px-6 py-4">
            <AnimatePresence mode="wait">
              {!isCreating ? (
                <motion.button
                  key="create-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#3F72AF]/30 text-[#3F72AF] font-bold text-sm hover:border-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  새 사이트 만들기
                </motion.button>
              ) : (
                <motion.div
                  key="create-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-bold text-[#112D4E]/60 mb-1 block">사이트 이름</label>
                    <input
                      value={newSiteName}
                      onChange={(e) => setNewSiteName(e.target.value)}
                      placeholder="예: A게임사 BM기획 지원용"
                      className="w-full px-3 py-2 text-sm border border-[#DBE2EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/30 focus:border-[#3F72AF] transition-all"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-[#112D4E]/60 mb-1 block">URL 슬러그 (자동생성, 수정 가능)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-[#112D4E]/40 font-mono shrink-0">.../</span>
                      <input
                        value={newSiteSlug}
                        onChange={(e) => setNewSiteSlug(e.target.value.toLowerCase().replace(/[^a-z0-9가-힣\-]/g, ''))}
                        placeholder="a-game-company"
                        className="flex-1 px-3 py-2 text-sm font-mono border border-[#DBE2EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/30 focus:border-[#3F72AF] transition-all"
                      />
                      <span className="text-[11px] text-[#112D4E]/40 font-mono shrink-0">/</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#112D4E]/60 mb-1 block">데이터 복사 원본</label>
                    <div className="relative">
                      <select
                        value={copyFromSite}
                        onChange={(e) => setCopyFromSite(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#DBE2EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/30 focus:border-[#3F72AF] transition-all appearance-none bg-white"
                      >
                        <option value="">빈 상태로 시작</option>
                        {sites.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.slug})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#112D4E]/30 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleCreateSite}
                      disabled={!newSiteName.trim() || !newSiteSlug.trim() || isSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-[#3F72AF] text-white font-bold text-sm hover:bg-[#112D4E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? '생성 중...' : '생성'}
                    </button>
                    <button
                      onClick={() => { setIsCreating(false); setNewSiteName(''); setNewSiteSlug(''); }}
                      className="px-4 py-2.5 rounded-xl bg-[#DBE2EF]/50 text-[#112D4E] font-bold text-sm hover:bg-[#DBE2EF] transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
