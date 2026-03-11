import { T, SCORE_CRITERIA } from "../constants";

export default function RadarChart({ scores, size = 180 }) {
  if (!scores) return null;
  const cx = size / 2, cy = size / 2, r = size * 0.35;
  const n  = 5;
  const toRad = (i) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const pt    = (i, dist) => [cx + dist * Math.cos(toRad(i)), cy + dist * Math.sin(toRad(i))];
  const gridPts = (level) => Array.from({ length: n }, (_, i) => pt(i, level * r));
  const toPath  = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";

  const scoreVals = SCORE_CRITERIA.map((c) => scores[c.key] || 0);
  const dataPts   = scoreVals.map((v, i) => pt(i, (v / 10) * r));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25, 0.5, 0.75, 1].map((lv) => (
        <polygon
          key={lv}
          points={gridPts(lv).map((p) => p.join(",")).join(" ")}
          fill={lv === 0.25 ? T.cobaltLight + "80" : "none"}
          stroke={lv === 1 ? "#D0CCC4" : T.border}
          strokeWidth={lv === 1 ? 1.5 : 1}
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const end = pt(i, r);
        return <line key={i} x1={cx} y1={cy} x2={end[0]} y2={end[1]} stroke={T.border} strokeWidth="1" />;
      })}
      <path
        d={toPath(dataPts)}
        fill={T.cobalt + "22"} stroke={T.cobalt} strokeWidth="2" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 6px ${T.cobalt}40)` }}
      />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill={T.cobalt} stroke="white" strokeWidth="1.5" />
      ))}
      {SCORE_CRITERIA.map((c, i) => {
        const labelPt = pt(i, r + 20);
        return (
          <text key={c.key} x={labelPt[0]} y={labelPt[1] + 4}
            textAnchor="middle" fontSize="10" fontWeight="700" fill={T.textMid} fontFamily={T.font}>
            {c.short}
          </text>
        );
      })}
    </svg>
  );
}
