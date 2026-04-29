$p = 'c:\Users\c\Desktop\portfolio\portfolio.basic\src\components\ResumePDF.tsx'
[string]$c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)

# Step 2: Add renderHeroChart before export const ResumePDF
$exportLine = "export const ResumePDF = ({ data, portfolioData, heroContent, aboutContent, aiSkills, toolCards, userImage }: ResumePDFProps) => {"
if (-not ($c -match 'renderHeroChart')) {
  $heroChartCode = @'

const renderHeroChart = (points: any[]) => {
  if (!points || points.length === 0) return null;
  const W = 364, H = 160;
  const PAD_X = 24, PAD_TOP = 32, PAD_BOTTOM = 24;
  const CHART_W = W - PAD_X * 2;
  const CHART_H = H - PAD_TOP - PAD_BOTTOM;
  const toSvgY = (val: number) => PAD_TOP + (CHART_H / 2) * (1 - val / 10);
  const toSvgX = (i: number, len: number) => {
    if (len <= 1) return W / 2;
    return PAD_X + (i / (len - 1)) * CHART_W;
  };
  const zeroY = toSvgY(0);
  const pathD = points.length > 1 ? points.map((p: any, i: number) =>
    `${i === 0 ? 'M' : 'L'}${toSvgX(i, points.length).toFixed(1)},${toSvgY(p.value).toFixed(1)}`
  ).join(' ') : '';
  return (
    <svg viewBox="0 0 364 160" className="w-[437px]" style={{ overflow: 'visible' }}>
      <line x1={PAD_X} y1={zeroY} x2={W - PAD_X} y2={zeroY} stroke="rgba(17,45,78,0.15)" strokeWidth="1" />
      <text x={PAD_X - 6} y={zeroY + 3.5} fontSize="9" fill="rgba(17,45,78,0.4)" textAnchor="end">0</text>
      {pathD && <path d={pathD} fill="none" stroke="#E05C6A" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />}
      {points.map((p: any, i: number) => {
        const cx = toSvgX(i, points.length);
        const cy = toSvgY(p.value);
        const above = p.value >= 0;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="3.5" fill="white" stroke="#E05C6A" strokeWidth="1.5" />
            {p.label && <text x={cx} y={above ? cy - 15 : cy + 20} fontSize="13" fill="rgba(17,45,78,0.65)" textAnchor="middle" fontWeight="600">{p.label}</text>}
          </g>
        );
      })}
    </svg>
  );
};

'@
  $c = $c.Replace($exportLine, $heroChartCode + $exportLine)
  Write-Host 'renderHeroChart added'
} else {
  Write-Host 'renderHeroChart already exists'
}

[System.IO.File]::WriteAllText($p, $c, [System.Text.Encoding]::UTF8)
Write-Host 'Step 2 Done'
