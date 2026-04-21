import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const target = textareaRef.current;
    if (target) {
      target.style.height = 'auto';
      target.style.height = target.scrollHeight + 'px';
    }
  }, []);

  useEffect(() => {
    if (multiline && isEditing) {
      adjustTextareaHeight();
    }
  }, [multiline, isEditing, value, adjustTextareaHeight]);

  const handleStyleChange = useCallback((newStyle: any) => {
    if (!onStyleSave || !styleData) return;

    const target = multiline ? textareaRef.current : inputRef.current;
    if (target && target.selectionStart !== null && target.selectionEnd !== null && target.selectionStart !== target.selectionEnd) {
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const selectedText = value.substring(start, end);

      const changedProp = Object.keys(newStyle).find(k => newStyle[k] !== styleData[k]);
      if (changedProp) {
        const kebabKey = changedProp.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        const styleTag = `#style:${kebabKey}:${newStyle[changedProp]}`;
        const newValue = value.substring(0, start) + `[${selectedText}](${styleTag})` + value.substring(end);
        onSave(newValue);
        return;
      }
    }
    onStyleSave(newStyle);
  }, [multiline, value, onSave, onStyleSave, styleData]);

  if (!isEditing) {
    if (disableMarkdown) {
      return <span className={className} style={style}>{String(value || '')}</span>;
    }
    return (
      <span className={className} style={{ ...style, whiteSpace: "pre-wrap" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          urlTransform={(url) => url}
          components={{
            p: ({ node, ...props }) => <span className={`${multiline ? "block" : "inline"} !m-0 !p-0`} {...props} />,
            a: ({ node, ...props }) => {
              const href = props.href ? decodeURIComponent(props.href) : '';
              if (href.includes('style:')) {
                const stylePart = href.split('style:')[1];
                const styleParts = stylePart.split(';');
                const customStyle: any = {};
                styleParts.forEach(part => {
                  const [key, val] = part.split(':');
                  if (key && val) {
                    const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    customStyle[camelKey] = val.trim();
                  }
                });
                return (
                  <span
                    style={customStyle}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="cursor-text"
                  >
                    {props.children}
                  </span>
                );
              }
              return <a {...props} className="text-[#3F72AF] hover:underline" target="_blank" rel="noopener noreferrer" />;
            },
            strong: ({ node, ...props }) => <strong {...props} className="font-extrabold" />,
            em: ({ node, ...props }) => <em {...props} className="italic" />,
            ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside mt-1 space-y-1" />,
            ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside mt-1 space-y-1" />,
            li: ({ node, ...props }) => <li {...props} className="leading-snug" />,
            h1: ({ node, ...props }) => <strong {...props} className="text-2xl font-bold mt-2 block" />,
            h2: ({ node, ...props }) => <strong {...props} className="text-xl font-bold mt-2 block" />,
            h3: ({ node, ...props }) => <strong {...props} className="text-lg font-bold mt-1 block" />,
            br: () => <br />
          }}
        >
          {String(value || '')}
        </ReactMarkdown>
      </span>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      {isEditing && isFocused && styleData && handleStyleChange && (
        <div className="absolute bottom-full left-0 z-[100] mb-2 pointer-events-auto">
          <TextStyleEditor style={styleData} onStyleChange={handleStyleChange} />
        </div>
      )}
      {multiline ? (
        <textarea
          ref={textareaRef}
          className={`w-full max-w-full bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded p-2 text-[#1A59A7] focus:outline-none focus:border-[#112D4E] ${className}`}
          value={value}
          onChange={(e) => onSave(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (containerRef.current?.contains(e.relatedTarget as Node)) return;
            setIsFocused(false);
          }}
          rows={5}
          style={{ ...style, overflowY: 'hidden', minHeight: '5em' }}
        />
      ) : (
        <input
          ref={inputRef}
          className={`w-full max-w-full bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded px-2 py-1 text-[#1A59A7] focus:outline-none focus:border-[#112D4E] ${className}`}
          value={value}
          onChange={(e) => onSave(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (containerRef.current?.contains(e.relatedTarget as Node)) return;
            setIsFocused(false);
          }}
          style={style}
        />
      )}
    </div>
  );
};
