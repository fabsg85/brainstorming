import { T } from "../constants";
import { scoreColor, scoreLabel } from "../utils";

export default function GaugeChart({ score, size = 150 }) {
  if (!score) return null;
  const c   = scoreColor(score);
  const cx  = size / 2, cy = size * 0.58, r = size * 0.36;
  const toRad = d => (d * Math.PI) / 180;
  const startA = -210, totalA = 240, fillA = (score / 10) * totalA;
  const arcPath = (sa, ea, rad) => {
    const x1=cx+rad*Math.cos(toRad(sa)), y1=cy+rad*Math.sin(toRad(sa));
    const x2=cx+rad*Math.cos(toRad(ea)), y2=cy+rad*Math.sin(toRad(ea));
    return `M ${x1} ${y1} A ${rad} ${rad} 0 ${ea-sa>180?1:0} 1 ${x2} ${y2}`;
  };
  const needleA = startA + fillA;
  const nLen    = r * 0.78;
  return (
    <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6C5CE7"/>
          <stop offset="100%" stopColor="#00F5D4"/>
        </linearGradient>
      </defs>
      {/* Track */}
      <path d={arcPath(startA, startA+totalA, r)} fill="none" stroke="var(--border)" strokeWidth="8" strokeLinecap="round"/>
      {/* Fill */}
      <path d={arcPath(startA, startA+fillA, r)} fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${c}80)` }}/>
      {/* Needle */}
      {[-4,0,4].map(o => (
        <line key={o}
          x1={cx+(r-12)*Math.cos(toRad(needleA+o))} y1={cy+(r-12)*Math.sin(toRad(needleA+o))}
          x2={cx+nLen*Math.cos(toRad(needleA+o))}   y2={cy+nLen*Math.sin(toRad(needleA+o))}
          stroke={o===0 ? "rgba(255,255,255,0.9)" : "var(--border)"}
          strokeWidth={o===0 ? 2.5 : 1.5} strokeLinecap="round"/>
      ))}
      <circle cx={cx} cy={cy} r="5" fill="rgba(255,255,255,0.9)" style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}/>
      <text x={cx} y={cy-r*0.18}      textAnchor="middle" fontSize="22"   fontWeight="900" fill={c}                   fontFamily="monospace">{score.toFixed(1)}</text>
      <text x={cx} y={cy-r*0.18+16}   textAnchor="middle" fontSize="10"   fontWeight="700" fill="rgba(255,255,255,0.4)" fontFamily="'Sora',sans-serif">{scoreLabel(score)}</text>
    </svg>
  );
}
