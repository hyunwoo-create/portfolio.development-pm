import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Layers, ScrollText, Target, Code2, Zap, Monitor, Smartphone, Gamepad2, Wrench, X, Plus } from 'lucide-react';
import { EditableText } from './EditableText';
import { SkillTab, Skill } from '../types';

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

const ICON_OPTIONS = [
  { name: 'Cpu', icon: <Cpu className="w-5 h-5" /> },
  { name: 'Layers', icon: <Layers className="w-5 h-5" /> },
  { name: 'ScrollText', icon: <ScrollText className="w-5 h-5" /> },
  { name: 'Target', icon: <Target className="w-5 h-5" /> },
  { name: 'Code2', icon: <Code2 className="w-5 h-5" /> },
  { name: 'Zap', icon: <Zap className="w-5 h-5" /> },
  { name: 'Monitor', icon: <Monitor className="w-5 h-5" /> },
  { name: 'Smartphone', icon: <Smartphone className="w-5 h-5" /> },
  { name: 'Gamepad2', icon: <Gamepad2 className="w-5 h-5" /> },
  { name: 'Wrench', icon: <Wrench className="w-5 h-5" /> }
];

export const Skills = ({ isEditing, skillTabs, setSkillTabs }: { isEditing: boolean, skillTabs: SkillTab[], setSkillTabs: (s: SkillTab[]) => void }) => {
  const [activeTabId, setActiveTabId] = useState<string>(skillTabs[0]?.id || '');
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);

  useEffect(() => {
    if (skillTabs.length > 0 && !skillTabs.find(t => t.id === activeTabId)) {
      setActiveTabId(skillTabs[0].id);
    }
  }, [skillTabs, activeTabId]);

  const activeTab = skillTabs.find(t => t.id === activeTabId);
  const activeSkills = activeTab?.skills || [];

  const updateTabSkills = (newSkills: Skill[]) => {
    const newTabs = skillTabs.map(t => t.id === activeTabId ? { ...t, skills: newSkills } : t);
    setSkillTabs(newTabs);
  };

  return (
    <section id="skills" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-block px-4 py-1 rounded-lg bg-[#3F72AF]/10 text-[#3F72AF] text-xs font-bold mb-6">03_SKILLS</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">핵심 역량.</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-10 flex-wrap">
          {skillTabs.map((tab) => (
            <div key={tab.id} className="relative flex items-center">
              {isEditing && editingTabId === tab.id ? (
                <input
                  type="text"
                  className="px-4 py-2.5 bg-[#DBE2EF]/60 border border-[#112D4E] rounded-xl text-sm font-bold text-[#1A59A7] focus:outline-none min-w-[80px]"
                  value={tab.name}
                  autoFocus
                  onChange={(e) => {
                    const newTabs = skillTabs.map(t => t.id === tab.id ? { ...t, name: e.target.value } : t);
                    setSkillTabs(newTabs);
                  }}
                  onBlur={() => setEditingTabId(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingTabId(null); }}
                />
              ) : (
                <button
                  onClick={() => setActiveTabId(tab.id)}
                  onDoubleClick={() => isEditing && setEditingTabId(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTabId === tab.id
                    ? 'bg-[#0a1e36] text-[#1A59A7] shadow-lg shadow-[#112D4E]/25'
                    : 'glass text-[#112D4E] hover:text-[#112D4E] hover:bg-[#112D4E]/5'
                  }`}
                >
                  {tab.name}
                </button>
              )}
              {isEditing && skillTabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setSkillTabs(skillTabs.filter(t => t.id !== tab.id));
                  }}
                  className="ml-1 p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="탭 삭제"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => {
                const newTab: SkillTab = {
                  id: `tab-${Date.now()}`,
                  name: '새 탭',
                  skills: []
                };
                setSkillTabs([...skillTabs, newTab]);
                setActiveTabId(newTab.id);
              }}
              className="px-4 py-2.5 border-2 border-dashed border-[#3F72AF]/20 rounded-xl text-sm font-bold text-[#0a1e36] hover:text-[#112D4E] hover:border-[#112D4E]/50 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> 탭 추가
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {isEditing && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => {
                    const newSkill: Skill = { name: "새 역량", level: 50, icon: 'Cpu', caption: "역량에 대한 설명을 입력하세요" };
                    updateTabSkills([...activeSkills, newSkill]);
                  }}
                  className="px-4 py-2 bg-[#0a1e36] text-[#1A59A7] text-sm font-bold rounded-xl hover:bg-[#112D4E] transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> 역량 추가
                </button>
              </div>
            )}
            <div className="space-y-10">
              {activeSkills.length === 0 && (
                <div className="text-center py-16 text-[#8fabc8]">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">이 탭에 역량을 추가해주세요.</p>
                </div>
              )}
              {activeSkills.map((skill, idx) => (
                <div key={idx} className="relative group/skill">
                  {isEditing && (
                    <button 
                      onClick={() => {
                        const newSkills = [...activeSkills];
                        newSkills.splice(idx, 1);
                        updateTabSkills(newSkills);
                      }}
                      className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 text-red-500 opacity-0 group-hover/skill:opacity-100 transition-all hover:bg-red-500/10 rounded-lg"
                      title="삭제"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-10 h-10 glass rounded-xl flex items-center justify-center text-[#112D4E] ${isEditing ? 'cursor-pointer hover:bg-[#112D4E]/10' : ''}`}
                        onClick={() => isEditing && setShowIconPicker(showIconPicker === idx ? null : idx)}
                      >
                        {resolveIcon(skill.icon)}
                      </div>
                      {isEditing && showIconPicker === idx && (
                        <div className="absolute top-12 left-0 z-30 glass p-3 rounded-2xl grid grid-cols-5 gap-2 shadow-2xl">
                          {ICON_OPTIONS.map((opt) => (
                            <button 
                              key={opt.name}
                              onClick={() => {
                                const newSkills = [...activeSkills];
                                newSkills[idx].icon = opt.name;
                                updateTabSkills(newSkills);
                                setShowIconPicker(null);
                              }}
                              className="p-2 hover:bg-[#112D4E]/10 rounded-lg transition-colors text-[#112D4E]"
                            >
                              {opt.icon}
                            </button>
                          ))}
                        </div>
                      )}
                      <span className="font-bold text-lg">
                        <EditableText 
                          value={skill.name} 
                          onSave={(v) => {
                            const newSkills = [...activeSkills];
                            newSkills[idx].name = v;
                            updateTabSkills(newSkills);
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs text-[#0a1e36] bg-[#DBE2EF]/40 px-3 py-1 rounded-lg border border-[#3F72AF]/12 italic">
                        <EditableText 
                          value={skill.caption || ""} 
                          onSave={(v) => {
                            const newSkills = [...activeSkills];
                            newSkills[idx].caption = v;
                            updateTabSkills(newSkills);
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-[#0a1e36]">
                          <EditableText 
                            value={skill.level.toString()} 
                            onSave={(v) => {
                              const newSkills = [...activeSkills];
                              newSkills[idx].level = parseInt(v) || 0;
                              updateTabSkills(newSkills);
                            }} 
                            isEditing={isEditing} 
                          />%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-[#DBE2EF]/40 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-[#112D4E] to-[#0a1e36] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
