import React, { useState, useEffect, useRef } from 'react';
import { ScrollText, Plus, X, LayoutGrid, Pencil, Check } from 'lucide-react';
import { EditableText } from './EditableText';
import { ResumeData, SelfIntroTab, IntroCard } from '../types';

const VIZ_MARKER = '(시각화)';

const FlowArrow = ({ faded = false }: { faded?: boolean }) => (
  <div className="flex items-center justify-center flex-shrink-0 self-center px-1">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8H12.5M12.5 8L9 4.5M12.5 8L9 11.5"
        stroke="#3F72AF" strokeOpacity={faded ? 0.25 : 0.65}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// ─── SingleCard: Isolated State per Card ──────────────────────────────────────

const SingleCard = ({
  card,
  isEditing,
  onUpdate,
  onRemove,
}: {
  card: IntroCard;
  isEditing: boolean;
  onUpdate: (updated: IntroCard) => void;
  onRemove: () => void;
}) => {
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);
  const [draft, setDraft] = useState('');

  const startEdit = (field: 'title' | 'description') => {
    setEditingField(field);
    setDraft(field === 'title' ? card.title : card.description);
  };

  const commit = (field: 'title' | 'description') => {
    onUpdate({ ...card, [field]: draft });
    setEditingField(null);
  };

  return (
    <div
      className="relative group/card bg-[#EEF4FF] border border-[#C8D9F5] rounded-2xl p-4 transition-all hover:shadow-md hover:border-[#3F72AF]/40 flex flex-col items-center text-center"
      style={{ flex: '1 1 0', minWidth: 0 }}
    >
      {isEditing && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity z-10 shadow-sm"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Title */}
      {isEditing && editingField === 'title' ? (
        <div className="flex items-center gap-1 mb-2 w-full">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => commit('title')}
            onKeyDown={(e) => { if (e.key === 'Enter') commit('title'); }}
            className="flex-1 text-[14px] font-black text-[#112D4E] bg-transparent border-b border-[#3F72AF] focus:outline-none text-center"
          />
          <button onClick={() => commit('title')}><Check className="w-3.5 h-3.5 text-[#3F72AF]" /></button>
        </div>
      ) : (
        <p
          className={`text-[14px] font-black text-[#112D4E] mb-1.5 leading-tight w-full text-center ${isEditing ? 'cursor-pointer hover:text-[#3F72AF] transition-colors' : ''}`}
          onClick={() => isEditing && startEdit('title')}
        >
          {card.title}
          {isEditing && <Pencil className="inline w-3 h-3 ml-1 opacity-30" />}
        </p>
      )}

      {/* Separator Line */}
      <div className="w-8 h-[2px] bg-[#3F72AF]/30 rounded-full mb-3" />

      {/* Description */}
      {isEditing && editingField === 'description' ? (
        <div className="flex items-start gap-1 w-full">
          <textarea
            autoFocus
            value={draft}
            rows={3}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => commit('description')}
            className="flex-1 text-[12px] font-medium text-[#3D5A80] leading-[1.6] bg-transparent border-b border-[#3F72AF] focus:outline-none resize-none text-center"
          />
          <button onClick={() => commit('description')}><Check className="w-3.5 h-3.5 text-[#3F72AF] mt-0.5" /></button>
        </div>
      ) : (
        <p
          className={`text-[12px] font-medium text-[#3D5A80] leading-[1.6] whitespace-pre-wrap w-full text-center ${isEditing ? 'cursor-pointer hover:text-[#3F72AF] transition-colors' : ''}`}
          onClick={() => isEditing && startEdit('description')}
        >
          {card.description}
          {isEditing && <Pencil className="inline w-3 h-3 ml-1 opacity-30" />}
        </p>
      )}
    </div>
  );
};

// ─── Card Visualization: Multi-Block Aware ─────────────────────────────────────

const CardVisualization = ({
  cards,
  isEditing,
  blockId,
  onChange,
}: {
  cards: IntroCard[];
  isEditing: boolean;
  blockId: string;
  onChange: (cards: IntroCard[]) => void;
}) => {
  const addCard = () => {
    const uid = `card-${blockId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    onChange([...cards, { id: uid, title: '제목', description: '설명을 입력하세요.' }]);
  };

  const updateCard = (index: number, updated: IntroCard) => {
    const next = [...cards];
    next[index] = updated;
    onChange(next);
  };

  const removeCard = (index: number) => {
    onChange(cards.filter((_, i) => i !== index));
  };

  return (
    <div className="my-5 overflow-x-auto">
      <div className="flex items-stretch min-w-0 flex-nowrap">
        {cards.map((card, i) => (
          <React.Fragment key={card.id}>
            <SingleCard
              card={card}
              isEditing={isEditing}
              onUpdate={(updated) => updateCard(i, updated)}
              onRemove={() => removeCard(i)}
            />
            {i < cards.length - 1 && <FlowArrow />}
          </React.Fragment>
        ))}
        {isEditing && (
          <>
            {cards.length > 0 && <FlowArrow faded />}
            <button
              onClick={addCard}
              className="bg-white/60 border-2 border-dashed border-[#3F72AF]/30 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 text-[#3F72AF]/50 hover:text-[#3F72AF] hover:border-[#3F72AF]/60 transition-all flex-shrink-0"
              style={{ width: '80px' }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-[10px] font-bold">추가</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Tab Content: Independent Blocks ───────────────────────────────────────────

const TabContent = ({
  tab,
  isEditing,
  onUpdateTab,
}: {
  tab: SelfIntroTab;
  isEditing: boolean;
  onUpdateTab: (patch: Partial<SelfIntroTab>) => void;
}) => {
  const segments = tab.content.split(VIZ_MARKER);
  const buildContent = (parts: string[]) => parts.join(VIZ_MARKER);

  const initBlock = (index: number) => {
    const ts = Date.now();
    const newCards = [
      { id: `${tab.id}-b${index}-c1-${ts}`, title: '상황', description: '내용 입력' },
      { id: `${tab.id}-b${index}-c2-${ts}`, title: '행동', description: '내용 입력' },
      { id: `${tab.id}-b${index}-c3-${ts}`, title: '결과', description: '내용 입력' },
      { id: `${tab.id}-b${index}-c4-${ts}`, title: '배운점', description: '내용 입력' },
    ];
    onUpdateTab({
      vizBlocks: { ...(tab.vizBlocks || {}), [index]: newCards }
    });
  };

  const removeBlock = (index: number) => {
    console.log("removeBlock triggered for index:", index);
    
    // 1. 텍스트 세그먼트 병합 (해당 마커 삭제)
    const newSegments = [...segments];
    // <p> 태그 사이를 자연스럽게 이어주기 위해 빈칸으로 병합 (TipTap이 빈 줄 등을 <p>로 알아서 처리함)
    const merged = newSegments[index] + ' ' + newSegments[index + 1];
    newSegments.splice(index, 2, merged);
    const newContent = newSegments.join(VIZ_MARKER);
    console.log("newSegments length after splice:", newSegments.length);
    console.log("newContent:", newContent);

    // 2. vizBlocks 인덱스 당기기 (이후 블록들의 인덱스를 1씩 감소)
    const newVizBlocks: any = {};
    if (tab.vizBlocks) {
      Object.keys(tab.vizBlocks).forEach((key) => {
        const k = parseInt(key, 10);
        if (k < index) {
          newVizBlocks[k] = tab.vizBlocks![k];
        } else if (k > index) {
          newVizBlocks[k - 1] = tab.vizBlocks![k];
        }
      });
    }
    console.log("newVizBlocks:", newVizBlocks);

    onUpdateTab({ content: newContent, vizBlocks: newVizBlocks });
  };

  return (
    <>
      {segments.map((seg, i) => {
        const hasCards = !!(tab.vizBlocks && tab.vizBlocks[i] && tab.vizBlocks[i].length > 0);
        
        return (
          <React.Fragment key={i}>
            {/* Text Segment */}
            {seg.trim().length > 0 && (
              <EditableText
                value={seg}
                onSave={(v) => {
                  const np = [...segments]; np[i] = v;
                  onUpdateTab({ content: buildContent(np) });
                }}
                isEditing={isEditing}
                multiline
                className="text-[15px] leading-[1.8] font-semibold text-[#1A374D] markdown-body"
                style={tab.style || {}}
                styleData={tab.style || {}}
                onStyleSave={(s) => onUpdateTab({ style: s })}
              />
            )}

            {/* Marker Visualization Block (only between segments) */}
            {i < segments.length - 1 && (
              <div className="my-6 relative group/block">
                {isEditing && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5 text-[#3F72AF]/50" />
                      <span className="text-[10px] font-black text-[#3F72AF]/50 tracking-widest uppercase">시각화 블록 #{i+1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!hasCards && (
                        <button 
                          onClick={() => initBlock(i)}
                          className="text-[10px] font-bold text-[#3F72AF] bg-[#EEF4FF] px-2 py-1 rounded-lg hover:bg-[#3F72AF] hover:text-white transition-all"
                        >
                          + 데이터 초기화 (4개)
                        </button>
                      )}
                      <button 
                        onClick={() => removeBlock(i)}
                        className="text-[10px] font-bold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-all"
                        title="텍스트에서 마커를 완전히 삭제합니다"
                      >
                        블록 삭제
                      </button>
                    </div>
                  </div>
                )}

                {hasCards ? (
                  <CardVisualization
                    cards={tab.vizBlocks![i]}
                    isEditing={isEditing}
                    blockId={`${tab.id}-${i}`}
                    onChange={(newCards) => onUpdateTab({
                      vizBlocks: { ...(tab.vizBlocks || {}), [i]: newCards }
                    })}
                  />
                ) : (
                  isEditing && (
                    <div className="border-2 border-dashed border-[#3F72AF]/15 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-[#3F72AF]/30">
                      <p className="text-[11px] font-bold">마커 위치: (시각화) - 데이터를 초기화하거나 카드를 추가하세요</p>
                    </div>
                  )
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const SelfIntroInResume = ({
  isEditing, data, setData,
}: {
  isEditing: boolean;
  data: ResumeData;
  setData: (d: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
}) => {
  const [activeIntroTab, setActiveIntroTab] = useState<string>(data.selfIntroTabs?.[0]?.id || 'intro-1');
  const [editingIntroTabId, setEditingIntroTabId] = useState<string | null>(null);

  const selfIntroTabs: SelfIntroTab[] = data.selfIntroTabs || [
    { id: 'intro-1', title: '성장 과정 및 가치관', content: data.selfIntroduction || '' },
  ];

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isManualScrolling = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      if (isManualScrolling.current) return;
      const hit = entries.find((e) => e.isIntersecting);
      if (hit) {
        const id = hit.target.id.replace('section-', '');
        setActiveIntroTab((prev) => (prev !== id ? id : prev));
      }
    }, { root: container, rootMargin: '-10% 0px -80% 0px', threshold: [0, 0.1] });
    selfIntroTabs.forEach((tab) => {
      const el = document.getElementById(`section-${tab.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [selfIntroTabs]);

  const scrollToTab = (tabId: string) => {
    isManualScrolling.current = true;
    setActiveIntroTab(tabId);
    const el = document.getElementById(`section-${tabId}`);
    const container = scrollContainerRef.current;
    if (el) {
      const scrollable = container && window.getComputedStyle(container).overflowY === 'auto';
      if (scrollable) container.scrollTo({ top: el.offsetTop - 14, behavior: 'smooth' });
      else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
    }
    setTimeout(() => { isManualScrolling.current = false; }, 800);
  };

  const updateTab = (tabId: string, patch: Partial<SelfIntroTab>) => {
    setData((prev: any) => ({
      ...prev,
      selfIntroTabs: (prev.selfIntroTabs || selfIntroTabs).map((t: any) =>
        t.id === tabId ? { ...t, ...patch } : t
      ),
    }));
  };

  return (
    <section className="mt-4 relative scroll-mt-24">
      <div className="flex items-center justify-between mb-8 pdf-no-break">
        <h3 className="text-xl font-black flex items-center gap-3 text-[#112D4E]">
          <ScrollText className="w-6 h-6" /> 자기소개
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6 flex-wrap print:hidden sticky top-0 z-20 py-2 bg-[#F9F7F7]/95 backdrop-blur-sm -mx-2 px-2 border-b border-transparent hover:border-[#3F72AF]/10 transition-all">
        {selfIntroTabs.map((tab) => (
          <div key={tab.id} className="relative flex items-center">
            {isEditing && editingIntroTabId === tab.id ? (
              <input
                type="text"
                className="px-4 py-2 bg-[#DBE2EF]/60 border border-[#112D4E] rounded-xl text-sm font-bold text-[#1A59A7] focus:outline-none min-w-[80px]"
                value={tab.title}
                autoFocus
                onChange={(e) => setData((prev: any) => ({
                  ...prev,
                  selfIntroTabs: (prev.selfIntroTabs || selfIntroTabs).map((t: any) =>
                    t.id === tab.id ? { ...t, title: e.target.value } : t
                  ),
                }))}
                onBlur={() => setEditingIntroTabId(null)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingIntroTabId(null); }}
              />
            ) : (
              <button
                onClick={() => scrollToTab(tab.id)}
                onDoubleClick={() => isEditing && setEditingIntroTabId(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeIntroTab === tab.id ? 'bg-[#112D4E] text-white shadow-lg' : 'bg-[#DBE2EF]/40 text-[#112D4E] hover:bg-[#DBE2EF]'}`}
              >
                {tab.title}
              </button>
            )}
            {isEditing && selfIntroTabs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setData((prev: any) => {
                  const newTabs = (prev.selfIntroTabs || selfIntroTabs).filter((t: any) => t.id !== tab.id);
                  if (activeIntroTab === tab.id && newTabs.length > 0) setActiveIntroTab(newTabs[0].id);
                  return { ...prev, selfIntroTabs: newTabs };
                }); }}
                className="ml-1 p-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <button
            onClick={() => {
              const newTab: SelfIntroTab = { id: `intro-${Date.now()}`, title: '새 항목', content: '내용을 입력하세요.' };
              setData((prev: any) => { setActiveIntroTab(newTab.id); return { ...prev, selfIntroTabs: [...(prev.selfIntroTabs || selfIntroTabs), newTab] }; });
            }}
            className="px-3 py-2 border-2 border-dashed border-[#3F72AF]/20 rounded-xl text-sm font-bold text-[#0a1e36] hover:text-[#112D4E] hover:border-[#112D4E]/50 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> 탭 추가
          </button>
        )}
      </div>

      {/* Content Container */}
      <div ref={scrollContainerRef} className="relative space-y-12 md:space-y-16 lg:max-h-[800px] lg:overflow-y-auto lg:custom-scrollbar lg:pr-6 print:max-h-none print:overflow-visible print:space-y-20">
        {selfIntroTabs.map((tab) => (
          <div key={tab.id} id={`section-${tab.id}`} className="transition-all duration-700 opacity-100 scroll-mt-14">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1.5 h-6 bg-[#3F72AF] rounded-full" />
              <h4 className="text-xl font-black text-[#112D4E] tracking-tight flex-1">{tab.title}</h4>
            </div>
            <div className="bg-white/40 rounded-[2rem] p-8 border border-[#DBE2EF]/50 shadow-sm pdf-no-break">
              <TabContent tab={tab} isEditing={isEditing} onUpdateTab={(patch) => updateTab(tab.id, patch)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
