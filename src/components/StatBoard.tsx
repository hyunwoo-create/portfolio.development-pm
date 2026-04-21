import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Target, 
  X, 
  Plus, 
  Upload, 
  ArrowUpRight,
  Cpu,
  Layers,
  ScrollText,
  Code2,
  Zap,
  Monitor,
  Smartphone,
  Gamepad2,
  Wrench
} from 'lucide-react';
import { EditableText } from './EditableText';

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
  return <Cpu className="w-5 h-5" />;
};

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
  skillTabs, 
  setSkillTabs,
  tools, 
  setTools,
  onProjectClick, 
  userImage, 
  onImageUpload 
}: any) => {
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [mobileCategory, setMobileCategory] = useState<string>('projects');
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onImageUpload?.(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    if (!skillTabs || skillTabs.length === 0) {
      setSkillTabs([{ id: 'tab1', name: '기본', skills: [{ name: '새 스킬', level: 50, icon: 'Cpu', caption: '상세 설명' }] }]);
      return;
    }
    const newTabs = [...skillTabs];
    newTabs[0].skills = [...newTabs[0].skills, { name: '새 스킬', level: 50, icon: 'Cpu', caption: '상세 설명' }];
    setSkillTabs(newTabs);
  };

  const removeSkill = (tabIdx: number, skillIdx: number) => {
    const newTabs = [...skillTabs];
    newTabs[tabIdx].skills.splice(skillIdx, 1);
    setSkillTabs(newTabs);
    setHoveredItem(null);
  };

  const updateSkill = (tabIdx: number, skillIdx: number, field: string, value: any) => {
    const newTabs = [...skillTabs];
    newTabs[tabIdx].skills[skillIdx] = { ...newTabs[tabIdx].skills[skillIdx], [field]: value };
    setSkillTabs(newTabs);
    if (hoveredItem?.type === 'skill' && hoveredItem.data.name === skillTabs[tabIdx].skills[skillIdx].name) {
      setHoveredItem({ type: 'skill', data: newTabs[tabIdx].skills[skillIdx] });
    }
  };

  const addTool = () => {
    const newTool = { id: Date.now().toString(), name: '새 도구', iconUrl: '', description: '도구 설명' };
    setTools([...(tools || []), newTool]);
  };

  const removeTool = (id: string) => {
    setTools(tools.filter((t: any) => t.id !== id));
    setHoveredItem(null);
  };

  const updateTool = (id: string, field: string, value: string) => {
    const newTools = tools.map((t: any) => t.id === id ? { ...t, [field]: value } : t);
    setTools(newTools);
    if (hoveredItem?.type === 'tool' && hoveredItem.data.id === id) {
      setHoveredItem({ type: 'tool', data: newTools.find((t: any) => t.id === id) });
    }
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
          <EditableText value={p.category} isEditing={isEditing} onSave={(v: string) => updateProject(p.id, 'category', v)} />
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
        <EditableText value={p.title} isEditing={isEditing} onSave={(v: string) => updateProject(p.id, 'title', v)} />
      </h3>
      <div className="text-[#112D4E]/80 text-sm mb-8 leading-relaxed whitespace-pre-wrap">
        <EditableText value={p.description || "설명이 없습니다."} isEditing={isEditing} multiline onSave={(v: string) => updateProject(p.id, 'description', v)} />
      </div>
      
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

  const renderSkillDetail = (s: any) => {
    const tabIdx = skillTabs.findIndex((t: any) => t.skills.some((sk: any) => sk.name === s.name));
    const skillIdx = skillTabs[tabIdx]?.skills.findIndex((sk: any) => sk.name === s.name);

    return (
    <div className="flex flex-col h-full justify-center animate-fade-in w-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-[#1A59A7] shadow-lg border border-[#DBE2EF]">
          {resolveIcon(s.icon)}
        </div>
        {isEditing && (
          <button onClick={() => removeSkill(tabIdx, skillIdx)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
        )}
      </div>
      
      <h3 className="text-4xl font-black text-[#112D4E] mb-4">
        <EditableText value={s.name} isEditing={isEditing} onSave={(v: string) => updateSkill(tabIdx, skillIdx, 'name', v)} />
      </h3>
      <div className="text-lg text-[#3F72AF] font-medium mb-12 italic leading-relaxed">
        "<EditableText value={s.caption} isEditing={isEditing} onSave={(v: string) => updateSkill(tabIdx, skillIdx, 'caption', v)} />"
      </div>
      
      <div className="relative pt-8 w-full mt-auto">
        <div className="flex justify-between text-[11px] font-black text-[#112D4E] mb-3 uppercase tracking-widest">
          <span>Proficiency</span>
          <span>{s.level}%</span>
        </div>
        <div className="h-4 bg-[#DBE2EF]/50 rounded-full overflow-hidden p-0.5 relative">
          <motion.div initial={{width:0}} animate={{width:`${s.level}%`}} className="h-full bg-gradient-to-r from-[#3F72AF] to-[#112D4E] rounded-full shadow-inner" />
          {isEditing && (
            <input 
              type="range" min="0" max="100" value={s.level} 
              onChange={(e) => updateSkill(tabIdx, skillIdx, 'level', parseInt(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
          )}
        </div>
      </div>
    </div>
    );
  };

  const renderToolDetail = (t: any) => (
    <div className="flex flex-col h-full justify-center text-center items-center animate-fade-in w-full">
      <div className="flex justify-end w-full mb-4">
         {isEditing && (
          <button onClick={() => removeTool(t.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
        )}
      </div>
      <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border border-[#DBE2EF] mb-8 p-6 relative group">
        {t.iconUrl ? <img src={t.iconUrl} className="w-full h-full object-contain filter drop-shadow-md" alt={t.name}/> : <Wrench className="w-12 h-12 text-[#3F72AF]"/>}
        {isEditing && (
          <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity p-4">
             <input 
              className="text-[8px] bg-white text-[#112D4E] p-1 rounded-md w-full focus:outline-none" 
              placeholder="Icon URL" 
              value={t.iconUrl} 
              onChange={(e) => updateTool(t.id, 'iconUrl', e.target.value)}
            />
          </div>
        )}
      </div>
      <h3 className="text-3xl font-black text-[#112D4E] mb-6">
        <EditableText value={t.name} isEditing={isEditing} onSave={(v: string) => updateTool(t.id, 'name', v)} />
      </h3>
      <div className="w-12 h-1 bg-[#3F72AF]/20 mx-auto rounded-full mb-6" />
      <div className="text-[#112D4E]/80 text-sm leading-relaxed max-w-sm whitespace-pre-wrap">
        <EditableText value={t.description || "설명이 없습니다."} isEditing={isEditing} multiline onSave={(v: string) => updateTool(t.id, 'description', v)} />
      </div>
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
                       className={`p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-300 border ${hoveredItem?.data?.id === p.id ? 'bg-[#0a1e36] border-[#0a1e36] shadow-xl translate-x-3 scale-[1.02]' : 'bg-white border-[#DBE2EF] hover:bg-[#DBE2EF] hover:translate-x-1 shadow-sm'}`}>
                    <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${hoveredItem?.data.id === p.id ? 'text-[#3F72AF]' : 'text-[#8fabc8]'}`}>{p.category}</div>
                    <div className={`font-black text-xs leading-tight ${hoveredItem?.data.id === p.id ? 'text-white' : 'text-[#112D4E]'}`}>{p.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills List */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2 pl-2">
                <h2 className="text-[10px] font-black tracking-[0.1em] text-[#8fabc8] uppercase">Core Competencies</h2>
                {isEditing && (
                  <button onClick={addSkill} className="flex items-center gap-1 text-[9px] font-bold bg-white text-[#112D4E] px-2 py-0.5 rounded border border-[#DBE2EF] hover:bg-[#DBE2EF]"><Plus className="w-2.5 h-2.5"/>추가</button>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {skillTabs?.map((tab: any) => tab.skills.map((s:any, idx:number) => (
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
              <div className="flex items-center justify-between mb-2 pl-2">
                <h2 className="text-[10px] font-black tracking-[0.1em] text-[#8fabc8] uppercase">Arsenal</h2>
                {isEditing && (
                  <button onClick={addTool} className="flex items-center gap-1 text-[9px] font-bold bg-white text-[#112D4E] px-2 py-0.5 rounded border border-[#DBE2EF] hover:bg-[#DBE2EF]"><Plus className="w-2.5 h-2.5"/>추가</button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tools?.map((t: any) => (
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
               {projects?.map((p: any) => (
                 <div key={p.id} className="border-b border-[#3F72AF]/10 pb-8 last:border-0 last:pb-0 w-full overflow-hidden">
                    {renderProjectDetail(p)}
                 </div>
               ))}
            </div>
          </StatBoardMobileAccordion>
          
          <StatBoardMobileAccordion title="Core Competencies" isActive={mobileCategory === 'skills'} onClick={() => setMobileCategory(mobileCategory === 'skills' ? '' : 'skills')}>
            <div className="flex flex-col gap-12 pt-6 pb-4 w-full">
               {isEditing && (
                 <button onClick={addSkill} className="flex items-center justify-center gap-2 mb-4 w-full py-3 border-2 border-dashed border-[#1A59A7]/30 rounded-xl text-[#1A59A7] font-bold hover:bg-[#1A59A7]/5"><Plus className="w-4 h-4"/> 새 스킬 추가</button>
               )}
               {skillTabs?.map((tab: any) => tab.skills.map((s:any, idx:number) => (
                <div key={`${tab.id}-${idx}`} className="w-full">
                  {renderSkillDetail(s)}
                </div>
              )))}
            </div>
          </StatBoardMobileAccordion>
          
          <StatBoardMobileAccordion title="Arsenal (Tools)" isActive={mobileCategory === 'tools'} onClick={() => setMobileCategory(mobileCategory === 'tools' ? '' : 'tools')}>
            <div className="flex flex-col pt-4 pb-4 w-full">
               {isEditing && (
                 <button onClick={addTool} className="flex items-center justify-center gap-2 mb-8 w-full py-3 border-2 border-dashed border-[#1A59A7]/30 rounded-xl text-[#1A59A7] font-bold hover:bg-[#1A59A7]/5"><Plus className="w-4 h-4"/> 새 도구 추가</button>
               )}
               <div className="grid grid-cols-2 gap-4">
                  {tools?.map((t:any) => (
                    <div key={t.id} className="bg-white rounded-[1.5rem] p-5 shadow flex flex-col items-center text-center border border-[#DBE2EF]">
                      <div className="w-12 h-12 mb-4">{t.iconUrl ? <img src={t.iconUrl} className="w-full h-full object-contain drop-shadow-sm"/> : <Wrench className="w-full h-full text-[#3F72AF]"/>}</div>
                      <div className="font-bold text-[#112D4E] text-xs leading-tight">{t.name}</div>
                    </div>
                  ))}
               </div>
            </div>
          </StatBoardMobileAccordion>
        </div>
      </div>
    </section>
  );
};
