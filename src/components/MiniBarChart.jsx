import { T } from "../constants";
import { scoreColor } from "../utils";

export default function MiniBarChart({ ideas }) {
  const withScores = [...ideas]
    .filter(i => i.analysis?.avgScore)
    .sort((a,b) => b.analysis.avgScore - a.analysis.avgScore)
    .slice(0,7);
  if (withScores.length < 2) return (
    <div style={{ color: T.textMute, fontSize: 13, textAlign: "center", padding: "20px 0" }}>
      Analizá más ideas para ver el ranking
    </div>
  );
  const medals = ["🥇","🥈","🥉"];
  return (
    <div>
      {withScores.map((idea,idx) => {
        const sc=idea.analysis.avgScore, c=scoreColor(sc);
        return (
          <div key={idea.id} style={{ marginBottom: 12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:12, color:T.textMid, fontWeight:600, fontFamily:T.fontDisplay, maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {medals[idx]||`${idx+1}.`} {idea.title}
              </span>
              <span style={{ fontSize:12, fontWeight:800, color:c, fontFamily:"monospace" }}>{sc.toFixed(1)}</span>
            </div>
            <div style={{ height:5, background:T.surface2, borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${sc*10}%`, background:`linear-gradient(90deg,${c}60,${c})`, borderRadius:99, boxShadow:`0 0 6px ${c}50`, transition:"width 0.9s cubic-bezier(.4,0,.2,1)" }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}
