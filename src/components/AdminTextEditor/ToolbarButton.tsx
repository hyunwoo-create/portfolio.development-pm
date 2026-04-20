import React from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title?: string;
  children: React.ReactNode;
  danger?: boolean;
}

export const ToolbarButton = ({ onClick, isActive, title, children, danger }: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // 에디터 포커스 유지
        onClick();
      }}
      title={title}
      className={`
        relative flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold
        transition-all duration-150 select-none
        ${isActive
          ? 'bg-[#112D4E] text-[#F9F7F7] shadow-sm'
          : danger
            ? 'text-red-400 hover:bg-red-500/10'
            : 'text-[#112D4E] hover:bg-[#3F72AF]/15'
        }
      `}
    >
      {children}
    </button>
  );
};
