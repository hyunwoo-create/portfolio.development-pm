import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { AdminTextEditor } from './AdminTextEditor';

interface TextStyleEditorProps {
  style: any;
  onStyleChange: (s: any) => void;
}

const TextStyleEditor = ({ style, onStyleChange }: TextStyleEditorProps) => {
  const fonts = [
    { label: 'Pretendard (기본)', value: 'Pretendard Variable, Pretendard, sans-serif' },
    { label: 'Noto Sans KR', value: '"Noto Sans KR", sans-serif' },
    { label: 'Nanum Gothic', value: '"Nanum Gothic", sans-serif' },
    { label: 'Nanum Myeongjo', value: '"Nanum Myeongjo", serif' },
    { label: 'Black Han Sans', value: '"Black Han Sans", sans-serif' },
    { label: 'Do Hyeon', value: '"Do Hyeon", sans-serif' },
    { label: 'Gothic A1', value: '"Gothic A1", sans-serif' },
    { label: 'IBM Plex Sans KR', value: '"IBM Plex Sans KR", sans-serif' },
  ];
  const colorPresets = [
    { label: '기본 (다크)', value: '' },
    { label: '딥네이비', value: '#112D4E' },
    { label: '블루', value: '#1A59A7' },
    { label: '미디엄블루', value: '#3F72AF' },
    { label: '화이트', value: '#F9F7F7' },
    { label: '블랙', value: '#0a1e36' },
  ];
  const highlightPresets = [
    { label: '없음', value: '' },
    { label: '블루 하이라이트', value: 'rgba(63,114,175,0.18)' },
    { label: '네이비 하이라이트', value: 'rgba(17,45,78,0.12)' },
    { label: '옐로우 하이라이트', value: 'rgba(250,204,21,0.3)' },
    { label: '그린 하이라이트', value: 'rgba(34,197,94,0.2)' },
    { label: '핑크 하이라이트', value: 'rgba(244,114,182,0.2)' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mt-1 mb-2 p-2 bg-[#DBE2EF]/80 rounded-lg border border-[#3F72AF]/30 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        <label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">폰트</label>
        <select 
          value={style.fontFamily || ''} 
          onChange={e => onStyleChange({...style, fontFamily: e.target.value})} 
          className="text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E] max-w-[140px]"
        >
          <option value="">기본</option>
          {fonts.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">크기</label>
        <input 
          type="text" 
          value={style.fontSize || ''} 
          onChange={e => onStyleChange({...style, fontSize: e.target.value})} 
          className="w-[60px] text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]" 
          placeholder="3rem"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">자간</label>
        <input 
          type="text" 
          value={style.letterSpacing || ''} 
          onChange={e => onStyleChange({...style, letterSpacing: e.target.value})} 
          className="w-[60px] text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]" 
          placeholder="0.3em"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">줄높이</label>
        <input 
          type="text" 
          value={style.lineHeight || ''} 
          onChange={e => onStyleChange({...style, lineHeight: e.target.value})} 
          className="w-[60px] text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]" 
          placeholder="1.2"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">굵기</label>
        <select 
          value={style.fontWeight || ''} 
          onChange={e => onStyleChange({...style, fontWeight: e.target.value})} 
          className="text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]"
        >
          <option value="">기본</option>
          <option value="400">Regular (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">SemiBold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">ExtraBold (800)</option>
          <option value="900">Black (900)</option>
        </select>
      </div>
      <div className="flex items-center gap-1">
        <label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">글자색</label>
        <select 
          value={style.color || ''} 
          onChange={e => onStyleChange({...style, color: e.target.value})} 
          className="text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]"
        >
          {colorPresets.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <input 
          type="color" 
          value={style.color || '#112D4E'} 
          onChange={e => onStyleChange({...style, color: e.target.value})} 
          className="w-6 h-6 rounded border border-[#3F72AF]/20 cursor-pointer" 
          title="직접 선택"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="text-[10px] text-[#112D4E] font-bold whitespace-nowrap">하이라이트</label>
        <select 
          value={style.backgroundColor || ''} 
          onChange={e => onStyleChange({...style, backgroundColor: e.target.value})} 
          className="text-xs bg-white/80 rounded px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E]"
        >
          {highlightPresets.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
        </select>
      </div>
    </div>
  );
};

interface EditableTextProps {
  value: string;
  onSave: (v: string) => void;
  isEditing: boolean;
  className?: string;
  multiline?: boolean;
  disableMarkdown?: boolean;
  style?: React.CSSProperties;
  styleData?: any;
  onStyleSave?: (s: any) => void;
}

export const EditableText = ({
  value,
  onSave,
  isEditing,
  className = "",
  multiline = false,
  disableMarkdown = false,
  style = {},
  styleData,
  onStyleSave
}: EditableTextProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStyleChange = useCallback((newStyle: any) => {
    if (!onStyleSave || !styleData) return;
    onStyleSave(newStyle);
  }, [onStyleSave, styleData]);

  // ─── READ-ONLY MODE ───
  if (!isEditing) {
    if (disableMarkdown) {
      return <span className={className} style={{ ...style, whiteSpace: multiline ? "pre-wrap" : "normal" }}>{String(value || '')}</span>;
    }
    
    if (multiline) {
      // Delegate to AdminTextEditor's read-only mode for consistent rendering
      return (
        <div style={style} className="w-full">
          <AdminTextEditor
            isAdmin={false}
            bodyValue={value || ''}
            onBodyChange={() => {}}
            hideTitle={true}
            readonlyClassName={className}
          />
        </div>
      );
    }

    // Single-line read-only
    return (
      <span className={className} style={style}>
        {String(value || '')}
      </span>
    );
  }

  // ─── EDIT MODE ───
  return (
    <div className="relative w-full" ref={containerRef}>
      {multiline ? (
        <div className="w-full">
          <AdminTextEditor
            isAdmin={true}
            bodyValue={value || ''}
            onBodyChange={onSave}
            hideTitle={true}
            className={`admin-minimal-editor ${className}`}
            minBodyHeight="80px"
            bodyPlaceholder="내용을 입력하세요..."
          />
          {styleData && onStyleSave && (
            <div className="mt-2">
              <TextStyleEditor style={styleData} onStyleChange={handleStyleChange} />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full relative">
          {isFocused && styleData && onStyleSave && (
            <div className="absolute bottom-full left-0 z-[100] mb-2 pointer-events-auto">
              <TextStyleEditor style={styleData} onStyleChange={handleStyleChange} />
            </div>
          )}
          <input
            ref={inputRef}
            className={`w-full max-w-full bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded px-2 py-1 text-[#1A59A7] focus:outline-none focus:border-[#112D4E] ${className}`}
            value={value || ''}
            onChange={(e) => onSave(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              if (containerRef.current?.contains(e.relatedTarget as Node)) return;
              setIsFocused(false);
            }}
            style={style}
          />
        </div>
      )}
    </div>
  );
};
