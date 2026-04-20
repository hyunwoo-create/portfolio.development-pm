import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Wrench, X, Plus } from 'lucide-react';
import { EditableText } from './EditableText';
import { ToolItem } from '../types';

export const MyTools = ({ isEditing, tools, setTools }: { isEditing: boolean, tools: ToolItem[], setTools: (t: ToolItem[]) => void }) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleIconUpload = (toolId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const newTools = tools.map(t => t.id === toolId ? { ...t, iconUrl: dataUrl } : t);
      setTools(newTools);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="my-tools" className="py-32 px-6 max-w-7xl mx-auto border-t border-[#3F72AF]/8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="inline-block px-4 py-1 rounded-lg bg-[#3F72AF]/10 text-[#3F72AF] text-xs font-bold mb-6">04_TOOLS</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">나의 사용 Tool.</h2>
        </div>
        {isEditing && (
          <button
            onClick={() => {
              const newTool: ToolItem = {
                id: `tool-${Date.now()}`,
                name: '새 Tool',
                iconUrl: '',
                description: '툴에 대한 설명을 입력하세요.'
              };
              setTools([...tools, newTool]);
            }}
            className="px-4 py-2 bg-[#0a1e36] text-[#1A59A7] text-sm font-bold rounded-xl hover:bg-[#112D4E] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tool 추가
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass px-4 pt-3.5 pb-3 rounded-xl relative group flex flex-col items-center text-center"
          >
            {isEditing && (
              <button
                onClick={() => {
                  const newTools = tools.filter(t => t.id !== tool.id);
                  setTools(newTools);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={14} />
              </button>
            )}

            {/* Icon area */}
            <div 
              className={`relative w-[43px] h-[43px] mb-2.5 flex items-center justify-center ${isEditing ? 'cursor-pointer hover:opacity-70' : ''}`}
              onClick={() => isEditing && fileInputRefs.current[tool.id]?.click()}
            >
              {tool.iconUrl ? (
                <img
                  src={tool.iconUrl}
                  alt={tool.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Wrench size={30} className="text-[#3F72AF]/20" />
              )}
              {isEditing && (
                <input
                  ref={(el) => { fileInputRefs.current[tool.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleIconUpload(tool.id, e)}
                />
              )}
            </div>

            {/* Title */}
            <div className="font-bold text-[#112D4E] text-[13px] mb-1.5">{tool.name}</div>

            {/* Divider */}
            <div className="w-8 h-[1px] bg-[#112D4E]/10 my-1"></div>

            {/* Description */}
            <div className="text-[11px] text-[#3F72AF] leading-tight flex-1">
              <EditableText
                value={tool.description}
                onSave={(v) => {
                  const newTools = tools.map(t => t.id === tool.id ? { ...t, description: v } : t);
                  setTools(newTools);
                }}
                isEditing={isEditing}
                multiline
              />
            </div>

            {isEditing && (
              <div className="mt-2 w-full space-y-1">
                <div className="flex items-center gap-1 glass rounded-lg px-2 py-0.5">
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none text-[8px] text-[#3F72AF] focus:outline-none"
                    value={tool.name}
                    onChange={(e) => {
                      const newTools = tools.map(t => t.id === tool.id ? { ...t, name: e.target.value } : t);
                      setTools(newTools);
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 glass rounded-lg px-2 py-0.5">
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none text-[8px] text-[#3F72AF] focus:outline-none"
                    value={tool.iconUrl}
                    placeholder="Icon URL..."
                    onChange={(e) => {
                      const newTools = tools.map(t => t.id === tool.id ? { ...t, iconUrl: e.target.value } : t);
                      setTools(newTools);
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-20 text-[#8fabc8]">
          <Wrench className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-sm">사용 중인 Tool을 추가해주세요.</p>
        </div>
      )}
    </section>
  );
};
