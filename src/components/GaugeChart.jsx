import { T } from "../constants";
import { scoreColor, scoreLabel } from "../utils";

export default function GaugeChart({ score, size = 150 }) {
  if (!score) return null;
  const c   = scoreColor(score);
  const cx  = size / 2;
  const cy  = size * 0.58;
  const r   = size * 0.36;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const startA = -210, endA = 30;
  const totalA = endA - startA;
  const fillA  = (score / 10) * totalA;

  const arcPath = (sa, ea, rad) => {
    const x1 = cx + rad * Math.cos(toRad(sa));
    const y1 = cy + rad * Math.sin(toRad(sa));
    const x2 = cx + rad * Math.cos(toRad(ea));
    const y2 = cy + rad * Math.sin(toRad(ea));
    return `M ${x1} ${y1} A ${rad} ${rad} 0 ${ea - sa > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };

  const needleA = startA + fillA;
  const nLen    = r * 0.78;

  return (
    <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
      <path d={arcPath(startA, endA, r)} fill="none" stroke={T.border} strokeWidth="9" strokeLinecap="round" />
      <path
        d={arcPath(startA, startA + fillA, r)}
        fill="none" stroke={c} strokeWidth="9" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 5px ${c}70)` }}
      />
      {[-5, 0, 5].map((o) => (
        <line
          key={o}
          x1={cx + (r - 14) * Math.cos(toRad(needleA + o))}
          y1={cy + (r - 14) * Math.sin(toRad(needleA + o))}
          x2={cx + nLen * Math.cos(toRad(needleA + o))}
          y2={cy + nLen * Math.sin(toRad(needleA + o))}
          stroke={o === 0 ? T.text : T.text + "20"}
          strokeWidth={o === 0 ? 2.5 : 1}
          strokeLinecap="round"
        />
      ))}
      <circle cx={cx} cy={cy} r="5.5" fill={T.text} />
      <text x={cx} y={cy - r * 0.18}      textAnchor="middle" fontSize="22"   fontWeight="900" fill={c}       fontFamily="monospace">{score.toFixed(1)}</text>
      <text x={cx} y={cy - r * 0.18 + 17} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={T.textMid} fontFamily={T.font}>{scoreLabel(score)}</text>
    </svg>
  );
}
