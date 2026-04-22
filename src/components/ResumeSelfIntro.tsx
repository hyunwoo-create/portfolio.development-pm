import React, { useState, useEffect, useRef } from 'react';
import { ScrollText, Plus, X } from 'lucide-react';
import { EditableText } from './EditableText';
import { ResumeData, SelfIntroTab } from '../types';

export const SelfIntroInResume = ({ isEditing, data, setData }: { isEditing: boolean, data: ResumeData, setData: (d: ResumeData) => void }) => {
  const [activeIntroTab, setActiveIntroTab] = useState<string>(
    data.selfIntroTabs?.[0]?.id || 'intro-1'
  );
  const [editingIntroTabId, setEditingIntroTabId] = useState<string | null>(null);
  
  const selfIntroTabs: SelfIntroTab[] = data.selfIntroTabs || [
    { id: 'intro-1', title: '성장 과정 및 가치관', content: data.selfIntroduction || '' }
  ];

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isManualScrolling = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const options = {
      root: container,
      rootMargin: '-10% 0px -80% 0px',
      threshold: [0, 0.1]
    };

    const observer = new IntersectionObserver((entries) => {
      if (isManualScrolling.current) return;
      const intersectingEntry = entries.find(entry => entry.isIntersecting);
      if (intersectingEntry) {
        const newTabId = intersectingEntry.target.id.replace('section-', '');
        setActiveIntroTab(prev => (prev !== newTabId ? newTabId : prev));
      }
    }, options);

    selfIntroTabs.forEach(tab => {
      const el = document.getElementById(`section-${tab.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selfIntroTabs]);

  const scrollToTab = (tabId: string) => {
    isManualScrolling.current = true;
    setActiveIntroTab(tabId);
    const container = scrollContainerRef.current;
    const element = document.getElementById(`section-${tabId}`);
    
    if (element) {
      const isScrollable = container && window.getComputedStyle(container).overflowY === 'auto';
      
      if (isScrollable) {
        container.scrollTo({ top: element.offsetTop - 14, behavior: 'smooth' });
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    setTimeout(() => { isManualScrolling.current = false; }, 800);
  };

  return (
    <section className="mt-4 relative scroll-mt-24">
      <div className="flex items-center justify-between mb-8 pdf-no-break">
        <h3 className="text-xl font-black flex items-center gap-3 text-[#112D4E]">
          <ScrollText className="w-6 h-6" /> 자기소개
        </h3>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap print:hidden sticky top-0 z-20 py-2 bg-[#F9F7F7]/95 backdrop-blur-sm -mx-2 px-2 border-b border-transparent hover:border-[#3F72AF]/10 transition-all">
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
                onClick={() => scrollToTab(tab.id)}
                onDoubleClick={() => isEditing && setEditingIntroTabId(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeIntroTab === tab.id ? 'bg-[#112D4E] text-white shadow-lg' : 'bg-[#DBE2EF]/40 text-[#112D4E] hover:bg-[#DBE2EF]'
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
                  if (activeIntroTab === tab.id && newTabs.length > 0) setActiveIntroTab(newTabs[0].id);
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
              const newTab: SelfIntroTab = { id: `intro-${Date.now()}`, title: '새 항목', content: '내용을 입력하세요.' };
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

      <div ref={scrollContainerRef} className="relative space-y-12 md:space-y-16 lg:max-h-[800px] lg:overflow-y-auto lg:custom-scrollbar lg:pr-6 print:max-h-none print:overflow-visible print:space-y-20">
        {selfIntroTabs.map((tab) => (
          <div key={tab.id} id={`section-${tab.id}`} className="transition-all duration-700 opacity-100 scroll-mt-14">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1.5 h-6 bg-[#3F72AF] rounded-full"></div>
              <h4 className="text-xl font-black text-[#112D4E] tracking-tight">{tab.title}</h4>
            </div>
            <div className="bg-white/40 rounded-[2rem] p-8 border border-[#DBE2EF]/50 shadow-sm pdf-no-break">
              <EditableText
                value={tab.content}
                onSave={(v) => {
                  const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, content: v } : t);
                  setData({...data, selfIntroTabs: newTabs});
                }}
                isEditing={isEditing}
                multiline
                className="text-[15px] leading-[1.8] font-semibold text-[#1A374D] markdown-body"
                style={tab.style || {}}
                styleData={tab.style || {}}
                onStyleSave={(s) => {
                  const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, style: s } : t);
                  setData({...data, selfIntroTabs: newTabs});
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
