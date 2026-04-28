import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  X, 
  Plus, 
  Upload, 
  Wrench,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import { EditableText } from './EditableText';
import { getExternalEmbedUrl, processImageHighQuality } from '../utils';


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

export const StatBoard = ({ 
  isEditing, 
  projects, 
  setProjects, 
  onProjectClick, 
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

  const addToolCard = () => {
    const newCard = { id: Date.now().toString(), name: '새 도구', iconUrl: '', description: '설명을 입력하세요.', imageUrl: '' };
    setToolCards([...(toolCards || []), newCard]);
  };

  const removeToolCard = (id: string) => {
    setToolCards((toolCards || []).filter((t: any) => t.id !== id));
    setHoveredItem(null);
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
      <div className="text-[#112D4E]/80 text-sm mb-6 leading-relaxed">
        <EditableText value={a.description || '설명을 입력하세요.'} isEditing={isEditing} multiline onSave={(v: string) => updateAiSkill(a.id, 'description', v)} />
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

  const renderToolCardDetail = (t: any) => (
    <div className="flex flex-col h-full animate-fade-in relative z-10 w-full">
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-[#DBE2EF] p-3 relative group">
          {t.iconUrl
            ? <img src={t.iconUrl} className="w-full h-full object-contain drop-shadow-sm" alt={t.name}/>
            : <Wrench className="w-8 h-8 text-[#3F72AF]"/>}
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity p-2">
              <input
                className="text-[8px] bg-white text-[#112D4E] p-1 rounded w-full focus:outline-none"
                placeholder="Icon URL"
                value={t.iconUrl || ''}
                onChange={(e) => updateToolCard(t.id, 'iconUrl', e.target.value)}
              />
            </div>
          )}
        </div>
        {isEditing && (
          <button onClick={() => removeToolCard(t.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
        )}
      </div>
      <h3 className="text-3xl font-black text-[#112D4E] mb-4">
        <EditableText value={t.name} isEditing={isEditing} onSave={(v: string) => updateToolCard(t.id, 'name', v)} />
      </h3>
      <div className="text-[#112D4E]/80 text-sm mb-6 leading-relaxed">
        <EditableText value={t.description || '설명을 입력하세요.'} isEditing={isEditing} multiline onSave={(v: string) => updateToolCard(t.id, 'description', v)} />
      </div>
      {isEditing && (
        <div className="mb-4">
          <label className="text-[10px] font-bold text-[#3F72AF] mb-1 block uppercase tracking-wider">이미지 URL</label>
          <input
            type="text"
            value={t.imageUrl || ''}
            onChange={(e) => updateToolCard(t.id, 'imageUrl', e.target.value)}
            placeholder="https://..."
            className="w-full border border-[#DBE2EF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#3F72AF]"
          />
        </div>
      )}
      {t.imageUrl && (
        <div className="mt-auto w-full rounded-2xl overflow-hidden border border-[#DBE2EF] shadow-sm">
          <img src={t.imageUrl} alt={t.name} className="w-full h-auto object-cover" />
        </div>
      )}
    </div>
  );

  return (
    <section id="stat-board" className="pt-7 pb-14 px-6 max-w-[1400px] mx-auto relative z-20 bg-[#F9F7F7]">
      <div className="w-full flex justify-center mb-10 pointer-events-none">
        <div className="flex flex-col items-center animate-pulse opacity-90">
          <span className="text-[11px] md:text-sm font-black tracking-widest text-[#3F72AF] mb-2 uppercase drop-shadow-sm">SCROLL</span>
          <div className="w-[2px] h-16 md:h-24 bg-gradient-to-b from-[#3F72AF] via-[#3F72AF] to-transparent shadow-sm"></div>
        </div>
      </div>

      {/* DESKTOP 3-COLUMN */}
      <div className="hidden lg:grid gap-8 items-start relative select-none w-full" style={{ gridTemplateColumns: '1.2fr 380px 1.5fr' }}>
        
        {/* LEFT COL: AI 활용 능력 + 사용 TOOL */}
        <div className="flex flex-col justify-between pr-4 h-[48vh] py-2 w-full overflow-hidden">
          <div className="flex flex-col h-full">

            {/* ── AI 활용 능력 ── */}
            <div className="flex flex-col h-1/2 overflow-hidden">
              <div className="flex items-center justify-between mb-2 pl-2">
                <h2 className="text-[14px] font-black tracking-[0.1em] text-[#8fabc8] uppercase">AI 활용 능력</h2>
                {isEditing && (
                  <button onClick={addAiSkill} className="flex items-center gap-1 text-[9px] font-bold bg-white text-[#112D4E] px-2 py-0.5 rounded border border-[#DBE2EF] hover:bg-[#DBE2EF]"><Plus className="w-2.5 h-2.5"/>추가</button>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {aiSkills?.map((a: any) => (
                  <div
                    key={a.id}
                    onClick={() => setHoveredItem({ type: 'aiSkill', data: a })}
                    className={`p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-300 border group ${
                      hoveredItem?.data?.id === a.id
                        ? 'bg-[#0a1e36] border-[#0a1e36] shadow-xl translate-x-3 scale-[1.02]'
                        : 'bg-white border-[#DBE2EF] hover:bg-[#0a1e36] hover:border-[#0a1e36] hover:translate-x-1 shadow-sm'
                    }`}
                  >
                    <div className={`font-black text-[16px] leading-tight transition-colors ${
                      hoveredItem?.data?.id === a.id ? 'text-white' : 'text-[#112D4E] group-hover:text-white'
                    }`}>
                      {a.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 사용 TOOL ── */}
            <div className="flex flex-col h-1/2 overflow-hidden">
              <div className="flex items-center justify-between mb-2 pl-2">
                <h2 className="text-[14px] font-black tracking-[0.1em] text-[#8fabc8] uppercase">사용 TOOL</h2>
                {isEditing && (
                  <button onClick={addToolCard} className="flex items-center gap-1 text-[9px] font-bold bg-white text-[#112D4E] px-2 py-0.5 rounded border border-[#DBE2EF] hover:bg-[#DBE2EF]"><Plus className="w-2.5 h-2.5"/>추가</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {toolCards?.map((t: any) => (
                  <div
                    key={t.id}
                    onClick={() => setHoveredItem({ type: 'toolCard', data: t })}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 border flex items-center gap-2 group ${
                      hoveredItem?.data?.id === t.id
                        ? 'bg-[#0a1e36] border-[#0a1e36] shadow-md'
                        : 'bg-white border-[#DBE2EF] hover:bg-[#0a1e36] hover:border-[#0a1e36] shadow-sm'
                    }`}
                  >
                    {t.iconUrl
                      ? <img src={t.iconUrl} className="w-5 h-5 object-contain shrink-0" alt={t.name}/>
                      : <Wrench className={`w-4 h-4 shrink-0 transition-colors ${
                          hoveredItem?.data?.id === t.id ? 'text-white' : 'text-[#3F72AF] group-hover:text-white'
                        }`}/>}
                    <span className={`font-black text-[14px] leading-tight transition-colors ${
                      hoveredItem?.data?.id === t.id ? 'text-white' : 'text-[#112D4E] group-hover:text-white'
                    }`}>
                      {t.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        
        {/* CENTER COL: User Avatar */}
        <div className="h-[48vh] sticky top-24 flex flex-col items-center justify-center pb-4 pt-2">
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
        <div className="h-[48vh] sticky top-24 pt-4">
          <div className="h-full bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 lg:p-12 border-2 border-white shadow-2xl overflow-hidden flex flex-col w-full relative">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#3F72AF]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#112D4E]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {hoveredItem ? (
              hoveredItem.type === 'aiSkill'  ? renderAiDetail(hoveredItem.data) :
              renderToolCardDetail(hoveredItem.data)
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#8fabc8] font-bold text-center">
                <Wrench className="w-12 h-12 mb-4 opacity-30"/>
                <p className="text-sm">좌측 항목을 클릭하면<br/>상세 정보가 표시됩니다.</p>
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
            <div className="grid grid-cols-2 gap-4 pt-2">
              {isEditing && (
                <button onClick={addToolCard} className="col-span-2 flex items-center justify-center gap-2 mb-2 w-full py-3 border-2 border-dashed border-[#1A59A7]/30 rounded-xl text-[#1A59A7] font-bold hover:bg-[#1A59A7]/5"><Plus className="w-4 h-4"/>TOOL 추가</button>
              )}
              {toolCards?.map((t: any) => (
                <div key={t.id} className="bg-white rounded-[1.5rem] p-5 shadow flex flex-col items-center text-center border border-[#DBE2EF]">
                  <div className="w-12 h-12 mb-3">
                    {t.iconUrl
                      ? <img src={t.iconUrl} className="w-full h-full object-contain drop-shadow-sm" alt={t.name}/>
                      : <Wrench className="w-full h-full text-[#3F72AF]"/>}
                  </div>
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
