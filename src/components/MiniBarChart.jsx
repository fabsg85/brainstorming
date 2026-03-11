import { T } from "../constants";
import { scoreColor } from "../utils";

export default function MiniBarChart({ ideas }) {
  const withScores = [...ideas]
    .filter((i) => i.analysis?.avgScore)
    .sort((a, b) => b.analysis.avgScore - a.analysis.avgScore)
    .slice(0, 7);

  if (withScores.length < 2) {
    return (
      <div style={{ color: T.textMute, fontSize: 13, textAlign: "center", padding: "20px 0" }}>
        Analizá más ideas para ver el ranking
      </div>
    );
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      {withScores.map((idea, idx) => {
        const sc = idea.analysis.avgScore;
        const c  = scoreColor(sc);
        return (
          <div key={idea.id} style={{ marginBottom: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: T.textMid, fontWeight: 600, fontFamily: T.font, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {medals[idx] || `${idx + 1}.`} {idea.title}
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: c, fontFamily: "monospace" }}>
                {sc.toFixed(1)}
              </span>
            </div>
            <div style={{ height: 7, background: T.border, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${sc * 10}%`, background: `linear-gradient(90deg, ${c}80, ${c})`, borderRadius: 99, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
