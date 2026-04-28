import React from 'react';
import { Plus, X } from 'lucide-react';

export interface ChartPoint {
  value: number; // -10 ~ 10
  label: string;
}

interface HeroLineChartProps {
  points: ChartPoint[];
  isEditing: boolean;
  onChange: (points: ChartPoint[]) => void;
}

const LINE_COLOR = '#E05C6A';

const W = 280, H = 160;
const PAD_X = 24, PAD_TOP = 32, PAD_BOTTOM = 24;
const CHART_W = W - PAD_X * 2;
const CHART_H = H - PAD_TOP - PAD_BOTTOM;

const toSvgY = (val: number) => PAD_TOP + (CHART_H / 2) * (1 - val / 10);
const toSvgX = (i: number, len: number) => {
  if (len <= 1) return W / 2;
  return PAD_X + (i / (len - 1)) * CHART_W;
};

export const HeroLineChart = ({ points, isEditing, onChange }: HeroLineChartProps) => {
  const zeroY = toSvgY(0);

  const pathD = points.length > 1
    ? points.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toSvgX(i, points.length).toFixed(1)},${toSvgY(p.value).toFixed(1)}`
      ).join(' ')
    : '';

  const updatePoint = (i: number, patch: Partial<ChartPoint>) => {
    onChange(points.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  };

  const clamp = (v: number) => Math.max(-10, Math.min(10, v));

  return (
    <div className="w-full">
      {/* ─── SVG 차트 ─── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ overflow: 'visible' }}
      >
        {/* 0 기준선 */}
        <line
          x1={PAD_X} y1={zeroY}
          x2={W - PAD_X} y2={zeroY}
          stroke="rgba(17,45,78,0.15)"
          strokeWidth="1"
        />
        <text
          x={PAD_X - 6} y={zeroY + 3.5}
          fontSize="7" fill="rgba(17,45,78,0.4)"
          textAnchor="end"
        >
          0
        </text>

        {/* 연결선 */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* 포인트 & 라벨 */}
        {points.map((p, i) => {
          const cx = toSvgX(i, points.length);
          const cy = toSvgY(p.value);
          const above = p.value >= 0;
          return (
            <g key={i}>
              <circle
                cx={cx} cy={cy} r="3.5"
                fill="white"
                stroke={LINE_COLOR}
                strokeWidth="1.5"
              />
              {p.label && (
                <text
                  x={cx}
                  y={above ? cy - 9 : cy + 14}
                  fontSize="7.5"
                  fill="rgba(17,45,78,0.65)"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* ─── 관리자 편집 패널 ─── */}
      {isEditing && (
        <div className="mt-3 p-3 bg-white/60 rounded-xl border border-[#3F72AF]/15 backdrop-blur-sm space-y-1.5">
          <p className="text-[10px] font-black text-[#3F72AF] uppercase tracking-widest mb-2">
            그래프 데이터 입력 (-10 ~ 10)
          </p>

          {points.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] text-[#3F72AF]/50 w-3 font-bold shrink-0">
                {i + 1}
              </span>
              {/* 값 입력 */}
              <input
                type="number"
                min={-10}
                max={10}
                step={0.5}
                value={p.value}
                onChange={e => updatePoint(i, { value: clamp(Number(e.target.value)) })}
                className="w-14 text-xs bg-white rounded-lg px-2 py-1 border border-[#3F72AF]/20 text-center text-[#112D4E] focus:outline-none focus:border-[#3F72AF]/60 shrink-0"
              />
              {/* 라벨 입력 */}
              <input
                type="text"
                value={p.label}
                onChange={e => updatePoint(i, { label: e.target.value })}
                placeholder="텍스트 (선택)"
                className="flex-1 text-xs bg-white rounded-lg px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E] placeholder-[#3F72AF]/30 focus:outline-none focus:border-[#3F72AF]/60"
              />
              {/* 삭제 */}
              <button
                onClick={() => onChange(points.filter((_, j) => j !== i))}
                className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <button
            onClick={() => onChange([...points, { value: 0, label: '' }])}
            className="flex items-center gap-1 text-[10px] text-[#3F72AF] hover:text-[#112D4E] font-bold mt-2 transition-colors"
          >
            <Plus className="w-3 h-3" /> 포인트 추가
          </button>
        </div>
      )}
    </div>
  );
};
