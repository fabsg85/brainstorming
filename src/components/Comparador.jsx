import { useState, useEffect } from "react";
import { T, SCORE_CRITERIA } from "../constants";
import { avg, scoreColor, scoreLabel } from "../utils";
import { StageBadge, ScoreBar } from "./UI";
import MiniBarChart from "./MiniBarChart";
import RadarChart from "./RadarChart";

export default function Comparador({ ideas }) {
  const analyzed = ideas.filter((i) => i.analysis && !i.analysis.error);
  const [selA, setSelA] = useState(null);
  const [selB, setSelB] = useState(null);

  const sorted = [...ideas].sort((a, b) => (avg(b.analysis?.scores) || 0) - (avg(a.analysis?.scores) || 0));

  useEffect(() => {
    if (analyzed.length >= 2 && !selA && !selB) {
      setSelA(analyzed[0].id);
      setSelB(analyzed[1].id);
    }
  }, [analyzed.length]);

  const ideaA = ideas.find((i) => i.id === selA);
  const ideaB = ideas.find((i) => i.id === selB);

  return (
    <div style={{ padding: "28px 20px", fontFamily: T.font }}>
      <h2 style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>📊 Ranking de ideas</h2>
      <div style={{ color: T.textMute, fontSize: 13, marginBottom: 24 }}>{analyzed.length} analizadas · ordenadas por score del Shark</div>

      {ideas.length > 1 && (
        <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: "22px", marginBottom: 30, boxShadow: "0 2px 10px #0000000a" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 18 }}>Comparativa de scores</div>
          <MiniBarChart ideas={ideas} />
        </div>
      )}

      {/* Ranking table */}
      <div style={{ overflowX: "auto", marginBottom: 40 }}>
        <div style={{ minWidth: 560 }}>
          <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 56px 56px 56px 56px 56px 80px", gap: 6, padding: "8px 14px", background: T.bg, borderRadius: 10, marginBottom: 6, fontSize: 11, fontWeight: 700, color: T.textMute, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <div>#</div><div>Idea</div>
            {SCORE_CRITERIA.map((c) => <div key={c.key} style={{ textAlign: "center" }}>{c.icon}</div>)}
            <div style={{ textAlign: "center" }}>TOTAL</div>
          </div>
          {sorted.map((idea, idx) => {
            const sc    = idea.analysis?.scores;
            const total = avg(sc);
            return (
              <div key={idea.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr 56px 56px 56px 56px 56px 80px", gap: 6, padding: "12px 14px", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 12, marginBottom: 6, alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span style={{ color: T.textMute, fontSize: 13 }}>{idx + 1}</span>}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: T.text, marginBottom: 4 }}>{idea.title}</div>
                  <StageBadge stage={idea.stage} />
                </div>
                {SCORE_CRITERIA.map((c) => (
                  <div key={c.key} style={{ textAlign: "center" }}>
                    {sc?.[c.key]
                      ? <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", color: scoreColor(sc[c.key]) }}>{sc[c.key]}</span>
                      : <span style={{ color: T.border }}>—</span>}
                  </div>
                ))}
                <div style={{ textAlign: "center" }}>
                  {total
                    ? <span style={{ background: scoreColor(total) + "15", color: scoreColor(total), border: `1.5px solid ${scoreColor(total)}25`, borderRadius: 8, padding: "3px 10px", fontWeight: 900, fontSize: 13, fontFamily: "monospace" }}>{total.toFixed(1)}</span>
                    : <span style={{ color: T.border }}>—</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Head to head */}
      <h2 style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>⚖️ Cara a cara</h2>
      <div style={{ color: T.textMute, fontSize: 13, marginBottom: 20 }}>Seleccioná dos ideas y que gane la mejor</div>

      {analyzed.length < 2 ? (
        <div style={{ textAlign: "center", padding: "44px", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, color: T.textMute }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚖️</div>
          Necesitás al menos 2 ideas analizadas
        </div>
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
            {[
              { val: selA, set: setSelA, label: "Idea A", color: T.cobalt },
              { val: selB, set: setSelB, label: "Idea B", color: T.coral  },
            ].map(({ val, set, label, color }) => (
              <select key={label} value={val || ""} onChange={(e) => set(Number(e.target.value))}
                style={{ border: `2px solid ${color}35`, borderRadius: 10, padding: "10px 12px", fontSize: 13, color: T.text, background: color + "08", fontWeight: 600, cursor: "pointer", fontFamily: T.font }}>
                <option value="">— {label} —</option>
                {analyzed.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
              </select>
            ))}
          </div>

          {ideaA && ideaB && ideaA.id !== ideaB.id && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[{ idea: ideaA, color: T.cobalt }, { idea: ideaB, color: T.coral }].map(({ idea, color }, col) => {
                const ia = idea.analysis;
                const sc = ia?.avgScore;
                return (
                  <div key={idea.id} style={{ border: `2px solid ${color}18`, borderRadius: 18, overflow: "hidden", boxShadow: `0 6px 24px ${color}12` }}>
                    <div style={{ background: T.text, padding: "18px 20px" }}>
                      <div style={{ color: "#FFFFFF35", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5, fontFamily: T.font }}>Idea {col === 0 ? "A" : "B"}</div>
                      <div style={{ color: "#FFF", fontWeight: 700, fontSize: 16, lineHeight: 1.3, marginBottom: 12, fontFamily: T.fontDisplay }}>{idea.title}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <StageBadge stage={idea.stage} />
                        {sc && (
                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: scoreColor(sc), fontWeight: 900, fontSize: 30, fontFamily: "monospace", lineHeight: 1 }}>{sc.toFixed(1)}</div>
                            <div style={{ color: "#FFFFFF40", fontSize: 10, fontFamily: T.font, marginTop: 2 }}>{scoreLabel(sc)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ padding: "18px 20px", background: T.surface, display: "grid", gap: 10 }}>
                      {ia?.scores && (
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                          <RadarChart scores={ia.scores} size={160} />
                        </div>
                      )}
                      {SCORE_CRITERIA.map((c) => {
                        const val = ia?.scores?.[c.key];
                        if (!val) return null;
                        return <ScoreBar key={c.key} icon={c.icon} label={c.label} value={val} />;
                      })}
                      {ia?.veredicto && (
                        <div style={{ background: T.bg, borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: T.textMute, marginBottom: 5, textTransform: "uppercase", fontFamily: T.font }}>Veredicto</div>
                          <p style={{ margin: 0, fontSize: 13, color: T.textMid, lineHeight: 1.5, fontStyle: "italic", fontFamily: T.font }}>"{ia.veredicto}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
