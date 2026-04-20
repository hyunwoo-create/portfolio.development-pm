import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Markdown } from '@tiptap/markdown';
import { BubbleToolbar } from './BubbleToolbar';
import './AdminTextEditor.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface AdminTextEditorProps {
  /** 관리자 모드 여부. false면 읽기전용 마크다운 렌더링 */
  isAdmin: boolean;

  /** 제목 입력값 (plain text) */
  titleValue?: string;
  onTitleChange?: (v: string) => void;
  titlePlaceholder?: string;
  /** 제목 영역 숨기기 */
  hideTitle?: boolean;

  /** 본문 Markdown 문자열 */
  bodyValue: string;
  onBodyChange: (v: string) => void;
  bodyPlaceholder?: string;

  /** 선택적 레이블 */
  label?: string;
  /** 에디터 최소 높이 */
  minBodyHeight?: string;
  /** 래퍼 className */
  className?: string;
  /** 읽기 모드 시 적용할 추가 className */
  readonlyClassName?: string;
}

export const AdminTextEditor = ({
  isAdmin,
  titleValue = '',
  onTitleChange,
  titlePlaceholder = '제목을 입력하세요...',
  hideTitle = false,
  bodyValue,
  onBodyChange,
  bodyPlaceholder = '내용을 입력하세요...',
  label,
  minBodyHeight = '160px',
  className = '',
  readonlyClassName = '',
}: AdminTextEditorProps) => {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // StarterKit 내 bold/italic 등은 유지, codeBlock 커스텀 없이 기본 사용
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Markdown,
    ],
    content: bodyValue || '',
    editable: isAdmin,
    onUpdate: ({ editor }) => {
      const md = (editor as any).getMarkdown();
      onBodyChange(md);
    },
  });

  // isAdmin 변경 시 편집 가능 여부 동기화
  useEffect(() => {
    if (editor) {
      editor.setEditable(isAdmin);
    }
  }, [isAdmin, editor]);

  // 외부에서 bodyValue가 변경될 때 에디터 내용 동기화
  // (단, 에디터가 현재 포커스 중이면 덮어쓰지 않음)
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const currentMd = (editor as any).getMarkdown();
    if (currentMd !== bodyValue) {
      editor.commands.setContent(bodyValue || '');
    }
  }, [bodyValue, editor]);

  // ─── 읽기 전용 모드 ───
  if (!isAdmin) {
    return (
      <div className={`admin-editor-readonly w-full ${readonlyClassName}`}>
        {label && (
          <p className="text-[10px] font-bold text-[#3F72AF] uppercase tracking-widest mb-1">{label}</p>
        )}
        {!hideTitle && titleValue && (
          <h3 className="text-xl font-bold text-[#112D4E] mb-2">{titleValue}</h3>
        )}
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {bodyValue || ''}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  // ─── 관리자 편집 모드 ───
  return (
    <div className={`admin-text-editor w-full flex flex-col gap-0 ${className}`}>
      {label && (
        <p className="text-[10px] font-bold text-[#3F72AF] uppercase tracking-widest mb-2">{label}</p>
      )}

      {/* 제목 입력 */}
      {!hideTitle && (
        <div className="relative">
          <input
            type="text"
            value={titleValue}
            onChange={(e) => onTitleChange?.(e.target.value)}
            placeholder={titlePlaceholder}
            className="
              w-full bg-transparent border-0 border-b-2 border-[#3F72AF]/20
              text-xl font-bold text-[#112D4E] placeholder-[#3F72AF]/30
              focus:outline-none focus:border-[#3F72AF]/60
              py-2 px-1 mb-3 transition-colors duration-200
            "
          />
        </div>
      )}

      {/* 본문 에디터 */}
      <div
        className="
          admin-editor relative
          bg-[#DBE2EF]/30 rounded-2xl px-4 py-3
          border border-[#3F72AF]/15
          focus-within:border-[#3F72AF]/40
          focus-within:shadow-[0_0_0_3px_rgba(63,114,175,0.10)]
          transition-all duration-200
        "
        style={{ minHeight: minBodyHeight }}
      >
        {editor && <BubbleToolbar editor={editor} />}
        <EditorContent
          editor={editor}
          placeholder={bodyPlaceholder}
        />
        {/* 플레이스홀더 – 에디터 내부 빈 p에 data-placeholder 주입 */}
        {editor && editor.isEmpty && (
          <style>{`
            .admin-editor .ProseMirror > p:first-child::before {
              content: "${bodyPlaceholder}";
              color: rgba(63,114,175,0.35);
              position: absolute;
              pointer-events: none;
              font-style: italic;
            }
          `}</style>
        )}
      </div>
    </div>
  );
};
