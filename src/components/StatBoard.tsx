import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  X, 
  Plus, 
  Upload, 
  Wrench,
  Trash2,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';
import { EditableText } from './EditableText';
import { AdminTextEditor } from './AdminTextEditor';
import { getExternalEmbedUrl, processImageHighQuality } from '../utils';
import { useAppStore } from '../store';


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



const ToolCategoryDetail = ({ category, toolsInCat, isEditing, updateToolCard, removeToolCard, targetId }: any) => {
  useEffect(() => {
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(`tool-detail-${targetId}`);
        const container = document.getElementById('tool-detail-container');
        if (el && container) {
          container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
        }
      }, 50);
    }
  }, [category, targetId]);

  return (
    <div className="flex flex-col h-full animate-fade-in relative z-10 w-full">
      <div className="flex flex-col mb-8 shrink-0">
        <h2 className="text-4xl font-black text-[#112D4E] tracking-tight">{category}</h2>
        <div className="w-12 h-1.5 bg-[#3F72AF] rounded-full mt-4 mb-2"></div>
      </div>
      
      <div id="tool-detail-container" className="flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col gap-8 pb-[60vh] scroll-smooth relative">
        {toolsInCat.map((t: any, idx: number) => (
          <div key={t.id} id={`tool-detail-${t.id}`} className="flex flex-col relative pt-2 scroll-mt-4">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-4">
                 <div className="w-[62px] h-[62px] bg-white rounded-2xl flex items-center justify-center shadow-lg border border-[#DBE2EF] p-2.5 relative group shrink-0">
                    {t.iconUrl
                      ? <img src={t.iconUrl} className="w-full h-full object-contain drop-shadow-sm" alt={t.name}/>
                      : <Wrench className="w-7 h-7 text-[#3F72AF]"/>}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity p-1.5 gap-1.5 z-20">
                        <input
                          className="text-[8px] bg-white text-[#112D4E] p-1 rounded w-full focus:outline-none text-center"
                          placeholder="URL"
                          value={t.iconUrl || ''}
                          onChange={(e) => updateToolCard(t.id, 'iconUrl', e.target.value)}
                        />
                        <button 
                          onClick={(e) => { e.stopPropagation(); document.getElementById(`tool-icon-upload-${t.id}`)?.click(); }}
                          className="w-full bg-white text-[#112D4E] rounded text-[8px] font-bold py-1 flex items-center justify-center gap-1 hover:bg-gray-200"
                        >
                          <Upload className="w-2 h-2" /> 파일
                        </button>
                        <input 
                          type="file" 
                          id={`tool-icon-upload-${t.id}`} 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const base64 = await processImageHighQuality(file);
                              updateToolCard(t.id, 'iconUrl', base64);
                            } catch (err) {
                              console.error(err);
                              alert('이미지 업로드 중 오류가 발생했습니다.');
                            }
                          }} 
                        />
                      </div>
                    )}
                 </div>
                 <h3 className="text-[28px] font-black text-[#112D4E] leading-tight pt-1">
                   <EditableText value={t.name} isEditing={isEditing} onSave={(v: string) => updateToolCard(t.id, 'name', v)} />
                 </h3>
               </div>
               {isEditing && (
                 <button onClick={() => removeToolCard(t.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition-colors mt-2"><X className="w-4 h-4"/></button>
               )}
             </div>
             
             <div className="text-[#112D4E]/80 text-[15px] mb-6 leading-relaxed">
               <AdminTextEditor
                 isAdmin={isEditing}
                 hideTitle
                 bodyValue={t.description || ''}
                 onBodyChange={(v: string) => updateToolCard(t.id, 'description', v)}
                 bodyPlaceholder="상세 설명을 입력하세요..."
                 minBodyHeight="80px"
                 readonlyClassName="markdown-body"
               />
             </div>

             {isEditing && (
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-[#3F72AF] mb-1 block uppercase tracking-wider">이미지 URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={t.imageUrl || ''}
                      onChange={(e) => updateToolCard(t.id, 'imageUrl', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 border border-[#DBE2EF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#3F72AF]"
                    />
                    <button
                      onClick={() => document.getElementById(`tool-img-upload-${t.id}`)?.click()}
                      className="bg-[#112D4E] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#1A59A7] flex items-center gap-1 shrink-0"
                    >
                      <Upload className="w-3 h-3" /> 파일
                    </button>
                    <input 
                      type="file" 
                      id={`tool-img-upload-${t.id}`} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const base64 = await processImageHighQuality(file);
                          updateToolCard(t.id, 'imageUrl', base64);
                        } catch (err) {
                          console.error(err);
                          alert('이미지 업로드 중 오류가 발생했습니다.');
                        }
                      }} 
                    />
                  </div>
                </div>
              )}
              {t.imageUrl && (
                <div className="w-full rounded-2xl overflow-hidden border border-[#DBE2EF] shadow-sm">
                  <img src={t.imageUrl} alt={t.name} className="w-full h-auto object-cover" />
                </div>
              )}
              {idx < toolsInCat.length - 1 && <hr className="mt-12 border-t-2 border-dashed border-[#DBE2EF]/50" />}
          </div>
        ))}
        {toolsInCat.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-[#3F72AF]/50 font-bold text-sm">
            등록된 툴이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export const StatBoard = ({ 
  isEditing, 
  userImage, 
  onImageUpload,
  aiSkills,
  setAiSkills,
  toolCards,
  setToolCards,
}: any) => {
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [mobileCategory, setMobileCategory] = useState<string>('aiSkills');
  const [showAvatarLink, setShowAvatarLink] = useState(false);
  const [avatarLinkValue, setAvatarLinkValue] = useState('');
  
  const { 
    statBoardDefaultBtnText, 
    statBoardDefaultDetailTitle, 
    statBoardDefaultDetailDesc,
    updateContent 
  } = useAppStore();
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await processImageHighQuality(file);
      onImageUpload?.(base64);
    } catch (err) {
      console.error(err);
      alert('이미지 최적화 중 오류가 발생했습니다.');
    }
  };

  const addAiSkill = () => {
    const newSkill = { id: Date.now().toString(), title: '새 AI 활용 능력', description: '설명을 입력하세요.', videoUrl: '' };
    setAiSkills([...(aiSkills || []), newSkill]);
  };

  const removeAiSkill = (id: string) => {
    setAiSkills((aiSkills || []).filter((a: any) => a.id !== id));
    setHoveredItem(null);
  };

  const updateAiSkill = (id: string, field: string, value: string) => {
    const updated = (aiSkills || []).map((a: any) => a.id === id ? { ...a, [field]: value } : a);
    setAiSkills(updated);
    if (hoveredItem?.type === 'aiSkill' && hoveredItem.data.id === id) {
      setHoveredItem({ type: 'aiSkill', data: updated.find((a: any) => a.id === id) });
    }
  };

  const addToolCard = (category: string = '문서') => {
    const newCard = { id: Date.now().toString(), name: '새 도구', category, iconUrl: '', description: '설명을 입력하세요.', imageUrl: '' };
    setToolCards([...(toolCards || []), newCard]);
  };

  const removeToolCard = (id: string) => {
    setToolCards((toolCards || []).filter((t: any) => t.id !== id));
    if (hoveredItem?.type !== 'toolCategory') {
      setHoveredItem(null);
    }
  };

  const updateToolCard = (id: string, field: string, value: string) => {
    const updated = (toolCards || []).map((t: any) => t.id === id ? { ...t, [field]: value } : t);
    setToolCards(updated);
    if (hoveredItem?.type === 'toolCard' && hoveredItem.data.id === id) {
      setHoveredItem({ type: 'toolCard', data: updated.find((t: any) => t.id === id) });
    }
  };



  const renderAiDetail = (a: any) => (
    <div className="flex flex-col h-full animate-fade-in relative z-10 w-full">
      <div className="flex justify-between items-start mb-6">
        <div className="text-[10px] font-bold text-[#3F72AF] tracking-widest uppercase bg-[#3F72AF]/10 px-3 py-1 rounded-full">
          AI SKILL
        </div>
        {isEditing && (
          <button onClick={() => removeAiSkill(a.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
        )}
      </div>
      <h3 className="text-3xl font-black text-[#112D4E] mb-4 leading-tight">
        <EditableText value={a.title} isEditing={isEditing} onSave={(v: string) => updateAiSkill(a.id, 'title', v)} />
      </h3>
      <div className="text-[#112D4E]/80 text-[15px] mb-6 leading-relaxed">
        <AdminTextEditor
          isAdmin={isEditing}
          hideTitle
          bodyValue={a.description || ''}
          onBodyChange={(v: string) => updateAiSkill(a.id, 'description', v)}
          bodyPlaceholder="상세 설명을 입력하세요..."
          minBodyHeight="100px"
          readonlyClassName="markdown-body"
        />
      </div>
      {isEditing && (
        <div className="mb-4">
          <label className="text-[10px] font-bold text-[#3F72AF] mb-1 block uppercase tracking-wider">영상 URL (YouTube 등)</label>
          <input
            type="text"
            value={a.videoUrl || ''}
            onChange={(e) => updateAiSkill(a.id, 'videoUrl', e.target.value)}
            placeholder="https://youtube.com/..."
            className="w-full border border-[#DBE2EF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#3F72AF]"
          />
        </div>
      )}
      {a.videoUrl && (
        <div className="mt-auto w-full aspect-video rounded-2xl overflow-hidden border border-[#DBE2EF] shadow-sm">
          <iframe
            src={getExternalEmbedUrl(a.videoUrl)}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );

  const renderDefaultDetail = () => (
    <div className="flex flex-col h-full animate-fade-in relative z-10 w-full items-center justify-center text-center">
      <h3 className="text-3xl font-black text-[#112D4E] mb-4 leading-tight w-full text-center">
        <EditableText 
          value={statBoardDefaultDetailTitle} 
          isEditing={isEditing} 
          onSave={(v) => updateContent('stat_board_default_title', v)} 
        />
      </h3>
      <div className="text-[#112D4E]/80 text-sm mb-6 leading-relaxed w-full text-center">
        <EditableText 
          multiline 
          value={statBoardDefaultDetailDesc} 
          isEditing={isEditing} 
          onSave={(v) => updateContent('stat_board_default_desc', v)} 
        />
      </div>
    </div>
  );



  return (
    <section id="stat-board" className="pt-24 pb-14 px-6 max-w-[1400px] mx-auto relative z-20 bg-[#F9F7F7]">


      {/* DESKTOP 3-COLUMN */}
      <div className="hidden lg:grid gap-8 items-stretch relative select-none w-full" style={{ gridTemplateColumns: '1.2fr 380px 1.5fr' }}>
        
        {/* LEFT COL: AI 활용 능력 + 사용 TOOL */}
        <div className="flex flex-col pr-4 py-2 w-full">
          <div className="flex flex-col gap-8 w-full pb-4">



            {/* ── 사용 TOOL ── */}
            <div className="flex flex-col shrink-0">
              <div className="flex items-center justify-between mb-4 pl-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#DBE2EF]/50 flex items-center justify-center shrink-0 border border-[#DBE2EF]/80 shadow-sm">
                    <Wrench className="w-4 h-4 text-[#3F72AF]" />
                  </div>
                  <h2 className="text-[14px] font-black tracking-[0.1em] text-[#112D4E] uppercase pt-0.5">사용 TOOL</h2>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {['문서', '협업', '디자인', '개발', 'AI'].map((cat, idx, arr) => {
                  const toolsInCat = (toolCards || []).filter((t: any) => t.category === cat);
                  return (
                    <div key={cat} className="flex flex-col">
                      <div className="flex items-center justify-between mb-3 pl-2 group/cat">
                        <span 
                          onClick={() => setHoveredItem({ type: 'toolCategory', category: cat })}
                          className="text-[16px] font-black tracking-wide text-[#112D4E] cursor-pointer hover:text-[#3F72AF] transition-colors drop-shadow-sm"
                        >
                          {cat}
                        </span>
                        {isEditing && (
                          <button onClick={() => addToolCard(cat)} className="flex items-center gap-1 text-[9px] font-bold bg-white text-[#112D4E] px-2 py-0.5 rounded border border-[#DBE2EF] hover:bg-[#DBE2EF]">
                            <Plus className="w-2.5 h-2.5"/>추가
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {toolsInCat.map((t: any) => (
                          <div
                            key={t.id}
                            onClick={() => setHoveredItem({ type: 'toolCategory', category: cat, targetId: t.id })}
                            className={`p-2 rounded-xl cursor-pointer transition-all duration-300 border flex items-center gap-2 group relative ${
                              hoveredItem?.targetId === t.id
                                ? 'bg-[#0a1e36] border-[#0a1e36] shadow-md scale-[1.02]'
                                : 'bg-white border-[#DBE2EF] hover:bg-[#0a1e36] hover:border-[#0a1e36] shadow-sm hover:scale-[1.02]'
                            }`}
                          >
                            {t.iconUrl
                              ? <img src={t.iconUrl} className="w-4 h-4 object-contain shrink-0" alt={t.name}/>
                              : <Wrench className={`w-3 h-3 shrink-0 transition-colors ${
                                  hoveredItem?.targetId === t.id ? 'text-white' : 'text-[#3F72AF] group-hover:text-white'
                                }`}/>}
                            <span className={`font-black text-[12px] truncate leading-tight transition-colors ${
                              hoveredItem?.targetId === t.id ? 'text-white' : 'text-[#112D4E] group-hover:text-white'
                            }`}>
                              {t.name}
                            </span>
                            {isEditing && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeToolCard(t.id); }} 
                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow-sm"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {idx < arr.length - 1 && <hr className="mt-4 border-t border-[#DBE2EF] opacity-60" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── 하단 버튼 (기본 화면) ── */}
            <div className="flex flex-col shrink-0 pt-2">
              <button
                onClick={() => setHoveredItem(null)}
                className={`w-full py-6 px-4 rounded-xl font-black text-[16px] transition-all duration-300 border flex items-center justify-between group ${
                  hoveredItem === null
                    ? 'bg-[#112D4E] border-[#112D4E] text-white shadow-xl scale-[1.02]'
                    : 'bg-white border-[#DBE2EF] text-[#112D4E] hover:bg-[#112D4E] hover:border-[#112D4E] hover:text-white shadow-sm'
                }`}
              >
                <span onClick={(e) => isEditing && e.stopPropagation()} className="cursor-text text-left flex-1 whitespace-pre-wrap">
                  <EditableText 
                    multiline
                    value={statBoardDefaultBtnText} 
                    isEditing={isEditing} 
                    onSave={(v: string) => updateContent('stat_board_default_btn_text', v)} 
                  />
                </span>
                <ChevronRight className={`w-5 h-5 transition-all ml-2 ${hoveredItem === null ? 'opacity-100 text-white' : 'opacity-50 text-[#3F72AF] group-hover:opacity-100 group-hover:text-white group-hover:translate-x-1'}`} />
              </button>
            </div>

          </div>
        </div>
        
        {/* CENTER COL: User Avatar */}
        <div className="h-[48vh] flex flex-col items-center justify-center pb-4 pt-2 z-10 self-center">
          <div className="w-full h-full relative group flex items-center justify-center">
            <img src={userImage || "https://picsum.photos/400/800"} alt="Avatar" className="w-[120%] h-[120%] max-w-[none] object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] group-hover:scale-[1.05] transition-transform duration-1000" />
            

            
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-8 z-30 pointer-events-auto">
                <button 
                  onClick={() => document.getElementById('statboard-desktop-img')?.click()}
                  className="w-full max-w-[140px] py-2.5 bg-white text-[#112D4E] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-lg"
                >
                  <Upload className="w-4 h-4" /> 파일 업로드
                </button>
                <button 
                  onClick={() => setShowAvatarLink(true)}
                  className="w-full max-w-[140px] py-2.5 bg-[#3F72AF] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#1A59A7] transition-all shadow-lg"
                >
                  <LinkIcon className="w-4 h-4" /> 링크 주소
                </button>
                <button 
                  onClick={() => onImageUpload?.("")}
                  className="w-full max-w-[140px] py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg"
                >
                  <Trash2 className="w-4 h-4" /> 사진 삭제
                </button>
                <input type="file" id="statboard-desktop-img" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            )}

            {isEditing && showAvatarLink && (
              <div className="absolute inset-0 bg-white/95 rounded-[3rem] z-[40] p-8 flex flex-col justify-center items-center animate-in fade-in zoom-in duration-300">
                <div className="w-full max-w-xs">
                  <p className="text-sm font-black text-[#112D4E] mb-3 text-center">아바타 이미지 URL</p>
                  <input 
                    type="text" 
                    value={avatarLinkValue} 
                    onChange={(e) => setAvatarLinkValue(e.target.value)}
                    placeholder="https://..."
                    className="w-full border-2 border-[#DBE2EF] rounded-xl px-4 py-3 text-xs mb-4 focus:outline-none focus:border-[#3F72AF] shadow-inner"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const finalUrl = getExternalEmbedUrl(avatarLinkValue);
                        if (finalUrl) onImageUpload?.(finalUrl);
                        setAvatarLinkValue('');
                        setShowAvatarLink(false);
                      }} 
                      className="flex-1 bg-[#112D4E] text-white rounded-xl py-3 text-xs font-bold shadow-lg active:scale-95 transition-transform"
                    >
                      적용
                    </button>
                    <button 
                      onClick={() => {
                        setAvatarLinkValue('');
                        setShowAvatarLink(false);
                      }} 
                      className="flex-1 bg-gray-100 text-[#112D4E] rounded-xl py-3 text-xs font-bold"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* RIGHT COL: Hover Details */}
        <div className="relative w-full h-full">
          <div className="absolute top-4 bottom-4 inset-x-0 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 lg:p-12 border-2 border-white shadow-2xl overflow-hidden flex flex-col w-full">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#3F72AF]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#112D4E]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {hoveredItem ? (
              hoveredItem.type === 'aiSkill'  ? renderAiDetail(hoveredItem.data) :
              hoveredItem.type === 'toolCategory' ? (
                <ToolCategoryDetail 
                  category={hoveredItem.category} 
                  targetId={hoveredItem.targetId} 
                  toolsInCat={(toolCards || []).filter((t: any) => t.category === hoveredItem.category)}
                  isEditing={isEditing}
                  updateToolCard={updateToolCard}
                  removeToolCard={removeToolCard}
                />
              ) : null
            ) : (
              renderDefaultDetail()
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
             <div className="absolute inset-0 bg-black/60 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30 p-8">
                <button 
                  onClick={() => document.getElementById('statboard-mobile-img')?.click()}
                  className="w-full max-w-[120px] py-2 bg-white text-[#112D4E] rounded-xl text-[10px] font-bold flex items-center justify-center gap-2"
                >
                  <Upload className="w-3 h-3" /> 파일
                </button>
                <button 
                  onClick={() => setShowAvatarLink(true)}
                  className="w-full max-w-[120px] py-2 bg-[#3F72AF] text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2"
                >
                  <LinkIcon className="w-3 h-3" /> 링크
                </button>
                <button 
                  onClick={() => onImageUpload?.("")}
                  className="w-full max-w-[120px] py-2 bg-red-500 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3 h-3" /> 삭제
                </button>
                <input type="file" id="statboard-mobile-img" accept="image/*" className="hidden" onChange={handleImageUpload} />
             </div>
          )}
        </div>

        <div className="flex flex-col w-full">
          <StatBoardMobileAccordion title="AI 활용 능력" isActive={mobileCategory === 'aiSkills'} onClick={() => setMobileCategory(mobileCategory === 'aiSkills' ? '' : 'aiSkills')}>
            <div className="flex flex-col gap-4 pt-2">
              {isEditing && (
                <button onClick={addAiSkill} className="flex items-center justify-center gap-2 mb-2 w-full py-3 border-2 border-dashed border-[#3F72AF]/30 rounded-xl text-[#3F72AF] font-bold hover:bg-[#3F72AF]/5"><Plus className="w-4 h-4"/>AI 능력 추가</button>
              )}
              {aiSkills?.map((a: any) => (
                <div key={a.id} className="border-b border-[#3F72AF]/10 pb-6 last:border-0">
                  {renderAiDetail(a)}
                </div>
              ))}
            </div>
          </StatBoardMobileAccordion>

          <StatBoardMobileAccordion title="사용 TOOL" isActive={mobileCategory === 'toolCards'} onClick={() => setMobileCategory(mobileCategory === 'toolCards' ? '' : 'toolCards')}>
            <div className="flex flex-col gap-6 pt-2">
              {['문서', '협업', '디자인', '개발', 'AI'].map((cat, idx, arr) => {
                const toolsInCat = (toolCards || []).filter((t: any) => t.category === cat);
                return (
                  <div key={cat} className="flex flex-col">
                    <div className="flex items-center justify-between mb-4 pl-1">
                      <span className="text-[15px] font-black tracking-wide text-[#112D4E] drop-shadow-sm">{cat}</span>
                      {isEditing && (
                        <button onClick={() => addToolCard(cat)} className="flex items-center gap-1 text-[10px] font-bold bg-[#1A59A7]/10 text-[#1A59A7] px-3 py-1 rounded-lg hover:bg-[#1A59A7]/20 transition-colors">
                          <Plus className="w-3 h-3"/>추가
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {toolsInCat.map((t: any) => (
                        <div key={t.id} className="bg-white rounded-xl p-3 shadow-sm flex flex-col items-center text-center border border-[#DBE2EF] relative">
                          {isEditing && (
                            <button 
                              onClick={() => removeToolCard(t.id)} 
                              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 shadow-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                          <div className="w-8 h-8 mb-2">
                            {t.iconUrl
                              ? <img src={t.iconUrl} className="w-full h-full object-contain drop-shadow-sm" alt={t.name}/>
                              : <Wrench className="w-full h-full text-[#3F72AF]"/>}
                          </div>
                          <div className="font-bold text-[#112D4E] text-[10px] leading-tight break-keep">{t.name}</div>
                        </div>
                      ))}
                    </div>
                    {idx < arr.length - 1 && <hr className="mt-6 border-t border-[#DBE2EF] opacity-40" />}
                  </div>
                );
              })}
            </div>
          </StatBoardMobileAccordion>
        </div>
      </div>
    </section>
  );
};
