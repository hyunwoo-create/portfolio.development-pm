import React, { useState, useRef, useEffect } from 'react';
import { type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { ToolbarButton } from './ToolbarButton';

interface BubbleToolbarProps {
  editor: Editor;
}

const FONT_SIZES = [
  { label: '소', value: '0.8em' },
  { label: '중', value: '1em' },
  { label: '대', value: '1.2em' },
  { label: '특대', value: '1.5em' },
];

const TEXT_COLORS = [
  { label: '기본', value: '#112D4E' },
  { label: '블루', value: '#3F72AF' },
  { label: '스틸블루', value: '#1A59A7' },
  { label: '레드', value: '#c0392b' },
  { label: '그린', value: '#27ae60' },
  { label: '그레이', value: '#7f8c8d' },
];

const HIGHLIGHT_COLORS = [
  { label: '없음', value: '' },
  { label: '앰버', value: 'rgba(245, 197, 88, 0.35)' },
  { label: '세이지', value: 'rgba(130, 185, 155, 0.35)' },
  { label: '라벤더', value: 'rgba(150, 130, 210, 0.35)' },
  { label: '스카이', value: 'rgba(63, 114, 175, 0.25)' },
  { label: '로즈', value: 'rgba(210, 110, 120, 0.28)' },
];

const FONT_FAMILIES = [
  { label: '기본', value: 'inherit' },
  { label: 'Pretendard', value: 'Pretendard Variable, Pretendard, sans-serif' },
  { label: 'Noto Sans', value: '"Noto Sans KR", sans-serif' },
  { label: 'Do Hyeon', value: '"Do Hyeon", sans-serif' },
  { label: 'Black Han Sans', value: '"Black Han Sans", sans-serif' },
  { label: 'Nanum Myeongjo', value: '"Nanum Myeongjo", serif' },
];

export const BubbleToolbar = ({ editor }: BubbleToolbarProps) => {
  const [colorOpen, setColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!colorRef.current?.contains(e.target as Node)) setColorOpen(false);
      if (!highlightRef.current?.contains(e.target as Node)) setHighlightOpen(false);
      if (!sizeRef.current?.contains(e.target as Node)) setSizeOpen(false);
      if (!fontRef.current?.contains(e.target as Node)) setFontOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const setFontSize = (size: string) => {
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
    setSizeOpen(false);
  };

  return (
    <BubbleMenu
      editor={editor}
      className="bubble-toolbar"
    >
      <div
        className="flex items-center gap-0.5 px-2 py-1.5 rounded-2xl"
        style={{
          background: 'rgba(219, 226, 239, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 8px 32px rgba(17,45,78,0.14), 0 2px 8px rgba(17,45,78,0.08)',
        }}
        onMouseDown={(e) => e.preventDefault()}
      >

        {/* --- 텍스트 형식 --- */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="굵게 (Ctrl+B)">
          <span className="font-black text-[13px]">B</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="기울임 (Ctrl+I)">
          <span className="italic font-bold text-[13px]">I</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="밑줄 (Ctrl+U)">
          <span className="underline font-bold text-[13px]">U</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="취소선">
          <span className="line-through font-bold text-[13px]">S</span>
        </ToolbarButton>

        {/* 구분선 */}
        <div className="w-px h-5 bg-[#3F72AF]/25 mx-1" />

        {/* --- 글자 크기 드롭다운 --- */}
        <div className="relative" ref={sizeRef}>
          <ToolbarButton onClick={() => { setSizeOpen(v => !v); setColorOpen(false); setHighlightOpen(false); setFontOpen(false); }} title="글자 크기">
            <span className="text-[10px] font-black leading-none">A↕</span>
          </ToolbarButton>
          {sizeOpen && (
            <div className="absolute top-full left-0 mt-1 z-[200] flex flex-col rounded-xl overflow-hidden"
              style={{ background: 'rgba(219,226,239,0.98)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(17,45,78,0.15)', minWidth: '72px' }}>
              {FONT_SIZES.map((s) => (
                <button key={s.value} type="button" onMouseDown={(e) => { e.preventDefault(); setFontSize(s.value); }}
                  className="px-3 py-1.5 text-left text-xs font-bold text-[#112D4E] hover:bg-[#3F72AF]/15 transition-colors">
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- 폰트 드롭다운 --- */}
        <div className="relative" ref={fontRef}>
          <ToolbarButton onClick={() => { setFontOpen(v => !v); setSizeOpen(false); setColorOpen(false); setHighlightOpen(false); }} title="글꼴">
            <span className="text-[10px] font-black leading-none">F</span>
          </ToolbarButton>
          {fontOpen && (
            <div className="absolute top-full left-0 mt-1 z-[200] flex flex-col rounded-xl overflow-hidden"
              style={{ background: 'rgba(219,226,239,0.98)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(17,45,78,0.15)', minWidth: '100px' }}>
              {FONT_FAMILIES.map((f) => (
                <button key={f.value} type="button" onMouseDown={(e) => { 
                  e.preventDefault(); 
                  editor.chain().focus().setMark('textStyle', { fontFamily: f.value }).run();
                  setFontOpen(false);
                }}
                  className="px-3 py-1.5 text-left text-[10px] font-bold text-[#112D4E] hover:bg-[#3F72AF]/15 transition-colors whitespace-nowrap"
                  style={{ fontFamily: f.value }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- 글자색 드롭다운 --- */}
        <div className="relative" ref={colorRef}>
          <ToolbarButton onClick={() => { setColorOpen(v => !v); setSizeOpen(false); setHighlightOpen(false); setFontOpen(false); }} title="글자 색상">
            <span className="text-[12px] font-black" style={{ color: editor.getAttributes('textStyle').color || '#112D4E' }}>A</span>
          </ToolbarButton>
          {colorOpen && (
            <div className="absolute top-full left-0 mt-1 z-[200] p-2 rounded-xl"
              style={{ background: 'rgba(219,226,239,0.98)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(17,45,78,0.15)' }}>
              <div className="flex gap-1.5 mb-1.5">
                {TEXT_COLORS.map((c) => (
                  <button key={c.value} type="button" title={c.label}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(c.value).run(); setColorOpen(false); }}
                    className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                    style={{ background: c.value, borderColor: editor.getAttributes('textStyle').color === c.value ? '#112D4E' : 'rgba(255,255,255,0.6)' }}
                  />
                ))}
              </div>
              {/* 직접 입력 */}
              <input type="color" title="직접 선택"
                defaultValue={editor.getAttributes('textStyle').color || '#112D4E'}
                onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                className="w-full h-5 rounded cursor-pointer border-0" />
            </div>
          )}
        </div>

        {/* --- 형광펜 드롭다운 --- */}
        <div className="relative" ref={highlightRef}>
          <ToolbarButton
            onClick={() => { setHighlightOpen(v => !v); setColorOpen(false); setSizeOpen(false); setFontOpen(false); }}
            isActive={editor.isActive('highlight')}
            title="형광펜"
          >
            <span className="text-[11px] font-black px-0.5" style={{
              background: 'rgba(245,197,88,0.5)',
              borderRadius: '2px',
              lineHeight: 1.3,
            }}>HL</span>
          </ToolbarButton>
          {highlightOpen && (
            <div className="absolute top-full left-0 mt-1 z-[200] p-2 rounded-xl"
              style={{ background: 'rgba(219,226,239,0.98)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(17,45,78,0.15)' }}>
              <div className="flex gap-1.5">
                {HIGHLIGHT_COLORS.map((h) => (
                  <button key={h.label} type="button" title={h.label}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (!h.value) {
                        editor.chain().focus().unsetHighlight().run();
                      } else {
                        editor.chain().focus().setHighlight({ color: h.value }).run();
                      }
                      setHighlightOpen(false);
                    }}
                    className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                    style={{
                      background: h.value || '#F9F7F7',
                      borderColor: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {!h.value && <span className="text-[8px] text-[#8fabc8]">✕</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-px h-5 bg-[#3F72AF]/25 mx-1" />

        {/* --- 구조 --- */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="제목 1">
          <span className="text-[10px] font-black">H1</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="제목 2">
          <span className="text-[10px] font-black">H2</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="제목 3">
          <span className="text-[10px] font-black">H3</span>
        </ToolbarButton>

        {/* 구분선 */}
        <div className="w-px h-5 bg-[#3F72AF]/25 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="순서 없는 리스트">
          <span className="text-[11px] leading-none">≡</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="순서 있는 리스트">
          <span className="text-[10px] font-bold">1≡</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="인용구">
          <span className="text-[13px] font-black leading-none">"</span>
        </ToolbarButton>

        {/* 구분선 */}
        <div className="w-px h-5 bg-[#3F72AF]/25 mx-1" />

        {/* --- 정렬 --- */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="왼쪽 정렬">
          <span className="text-[10px] font-black">◀</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="가운데 정렬">
          <span className="text-[10px] font-black">▬</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="오른쪽 정렬">
          <span className="text-[10px] font-black">▶</span>
        </ToolbarButton>

        {/* 구분선 */}
        <div className="w-px h-5 bg-[#3F72AF]/25 mx-1" />

        {/* --- 링크 --- */}
        <ToolbarButton
          onClick={() => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run();
            } else {
              const url = window.prompt('링크 URL을 입력하세요:');
              if (url) editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
            }
          }}
          isActive={editor.isActive('link')}
          title="링크 삽입/제거"
        >
          <span className="text-[11px] font-bold">🔗</span>
        </ToolbarButton>

        {/* --- 서식 초기화 --- */}
        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="서식 전체 초기화" danger>
          <span className="text-[10px] font-black">✕</span>
        </ToolbarButton>
      </div>
    </BubbleMenu>
  );
};
