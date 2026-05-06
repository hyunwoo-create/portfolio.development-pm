import React from 'react';
import { Plus, X } from 'lucide-react';

export interface ChartPoint {
  value: number; // -15 ~ 15
  label: string;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
  };
}

interface HeroLineChartProps {
  points: ChartPoint[];
  isEditing: boolean;
  onChange: (points: ChartPoint[]) => void;
}

const LINE_COLOR = '#E05C6A';

const W = 480, H = 240;
const PAD_X = 24, PAD_TOP = 48, PAD_BOTTOM = 40;
const CHART_W = W - PAD_X * 2;
const CHART_H = H - PAD_TOP - PAD_BOTTOM;

const toSvgY = (val: number) => PAD_TOP + (CHART_H / 2) * (1 - val / 15);
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

  const clamp = (v: number) => Math.max(-15, Math.min(15, v));

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
          fontSize="9" fill="rgba(17,45,78,0.4)"
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
          const style = p.style || {};
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
                  y={above ? cy - 15 : cy + 20}
                  fontSize={style.fontSize ?? 13}
                  fill={style.color ?? "rgba(17,45,78,0.65)"}
                  textAnchor="middle"
                  fontWeight={style.fontWeight ?? "600"}
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
        <ChartEditPanel
          points={points}
          onChange={onChange}
          updatePoint={updatePoint}
          clamp={clamp}
        />
      )}
    </div>
  );
};

/* ─── 편집 패널 (스타일 에디터 포함) ─── */
const ChartEditPanel = ({
  points,
  onChange,
  updatePoint,
  clamp,
}: {
  points: ChartPoint[];
  onChange: (pts: ChartPoint[]) => void;
  updatePoint: (i: number, patch: Partial<ChartPoint>) => void;
  clamp: (v: number) => number;
}) => {
  const [openStyleIdx, setOpenStyleIdx] = React.useState<number | null>(null);

  const updateStyle = (i: number, stylePatch: Partial<ChartPoint['style']>) => {
    const current = points[i].style || {};
    updatePoint(i, { style: { ...current, ...stylePatch } });
  };

  // rgba 문자열 → hex 근사 변환 (color picker용)
  const toHex = (color?: string): string => {
    if (!color) return '#112D4E';
    if (color.startsWith('#')) return color;
    const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
    return '#112D4E';
  };

  return (
    <div className="mt-3 p-3 bg-white/60 rounded-xl border border-[#3F72AF]/15 backdrop-blur-sm space-y-1.5">
      <p className="text-[10px] font-black text-[#3F72AF] uppercase tracking-widest mb-2">
        그래프 데이터 입력 (-15 ~ 15)
      </p>

      {points.map((p, i) => {
        const style = p.style || {};
        const isStyleOpen = openStyleIdx === i;

        return (
          <div key={i}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#3F72AF]/50 w-3 font-bold shrink-0">
                {i + 1}
              </span>
              {/* 값 입력 */}
              <input
                type="number"
                min={-15}
                max={15}
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
              {/* 스타일 토글 버튼 (T 아이콘) */}
              <button
                onClick={() => setOpenStyleIdx(isStyleOpen ? null : i)}
                title="텍스트 스타일 편집"
                className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black border transition-colors shrink-0 ${
                  isStyleOpen
                    ? 'bg-[#3F72AF] text-white border-[#3F72AF]'
                    : 'bg-white text-[#3F72AF] border-[#3F72AF]/30 hover:border-[#3F72AF]'
                }`}
              >
                T
              </button>
              {/* 삭제 */}
              <button
                onClick={() => {
                  onChange(points.filter((_, j) => j !== i));
                  if (openStyleIdx === i) setOpenStyleIdx(null);
                }}
                className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* ─── 스타일 에디터 (해당 행에만 표시) ─── */}
            {isStyleOpen && (
              <div className="ml-5 mt-1.5 mb-1 p-2.5 bg-[#EEF3FA] rounded-xl border border-[#3F72AF]/20 flex flex-wrap gap-x-4 gap-y-2 items-center">
                {/* 폰트 크기 */}
                <label className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#3F72AF] font-bold whitespace-nowrap">크기</span>
                  <input
                    type="number"
                    min={8}
                    max={36}
                    step={1}
                    value={style.fontSize ?? 13}
                    onChange={e => updateStyle(i, { fontSize: Number(e.target.value) })}
                    className="w-14 text-xs bg-white rounded-lg px-2 py-1 border border-[#3F72AF]/20 text-center text-[#112D4E] focus:outline-none focus:border-[#3F72AF]/60"
                  />
                </label>

                {/* 폰트 굵기 */}
                <label className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#3F72AF] font-bold whitespace-nowrap">굵기</span>
                  <select
                    value={style.fontWeight ?? '600'}
                    onChange={e => updateStyle(i, { fontWeight: e.target.value })}
                    className="text-xs bg-white rounded-lg px-2 py-1 border border-[#3F72AF]/20 text-[#112D4E] focus:outline-none focus:border-[#3F72AF]/60"
                  >
                    <option value="400">보통</option>
                    <option value="600">세미볼드</option>
                    <option value="700">볼드</option>
                    <option value="900">엑스트라볼드</option>
                  </select>
                </label>

                {/* 색상 */}
                <label className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#3F72AF] font-bold whitespace-nowrap">색상</span>
                  <input
                    type="color"
                    value={toHex(style.color)}
                    onChange={e => updateStyle(i, { color: e.target.value })}
                    className="w-8 h-7 rounded border border-[#3F72AF]/20 cursor-pointer p-0.5 bg-white"
                  />
                </label>

                {/* 초기화 */}
                <button
                  onClick={() => updatePoint(i, { style: {} })}
                  className="text-[10px] text-red-400 hover:text-red-600 font-bold ml-auto"
                >
                  초기화
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={() => onChange([...points, { value: 0, label: '' }])}
        className="flex items-center gap-1 text-[10px] text-[#3F72AF] hover:text-[#112D4E] font-bold mt-2 transition-colors"
      >
        <Plus className="w-3 h-3" /> 포인트 추가
      </button>
    </div>
  );
};
