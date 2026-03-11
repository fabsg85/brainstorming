import { T, SCORE_CRITERIA } from "../constants";

export default function RadarChart({ scores, size = 180 }) {
  if (!scores) return null;
  const cx=size/2, cy=size/2, r=size*0.33, n=5;
  const toRad = i => (i*2*Math.PI)/n - Math.PI/2;
  const pt    = (i, d) => [cx+d*Math.cos(toRad(i)), cy+d*Math.sin(toRad(i))];
  const toPath = pts => pts.map((p,i) => `${i===0?"M":"L"} ${p[0]} ${p[1]}`).join(" ") + " Z";
  const scoreVals = SCORE_CRITERIA.map(c => scores[c.key] || 0);
  const dataPts   = scoreVals.map((v,i) => pt(i,(v/10)*r));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
      {/* Grid rings */}
      {[0.25,0.5,0.75,1].map(lv => (
        <polygon key={lv}
          points={Array.from({length:n},(_,i)=>pt(i,lv*r)).map(p=>p.join(",")).join(" ")}
          fill={lv===0.25?"rgba(108,92,231,0.05)":"none"}
          stroke={lv===1?"rgba(255,255,255,0.12)":"var(--surface)"}
          strokeWidth={lv===1?1:0.7}/>
      ))}
      {/* Spokes */}
      {Array.from({length:n},(_,i) => {
        const e=pt(i,r);
        return <line key={i} x1={cx} y1={cy} x2={e[0]} y2={e[1]} stroke="var(--surface)" strokeWidth="1"/>;
      })}
      {/* Data fill */}
      <path d={toPath(dataPts)} fill="url(#radarGrad)" stroke="#6C5CE7" strokeWidth="1.5" strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 8px rgba(108,92,231,0.5))" }}/>
      {/* Data points */}
      {dataPts.map((p,i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#00F5D4" stroke="rgba(0,245,212,0.3)" strokeWidth="3"
          style={{ filter: "drop-shadow(0 0 4px #00F5D4)" }}/>
      ))}
      {/* Labels */}
      {SCORE_CRITERIA.map((c,i) => {
        const lp=pt(i,r+20);
        return (
          <text key={c.key} x={lp[0]} y={lp[1]+4} textAnchor="middle"
            fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.4)"
            fontFamily="'Sora',sans-serif" letterSpacing="0.5">
            {c.short.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}
