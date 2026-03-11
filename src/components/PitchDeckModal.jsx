import { useState } from "react";
import { T } from "../constants";
import { scoreColor, scoreLabel, exportMarkdown } from "../utils";
import SharkLogo from "./SharkLogo";
import RadarChart from "./RadarChart";
import TimelineGTM from "./TimelineGTM";

export default function PitchDeckModal({ idea, analysis: a, onClose }) {
  const [slide, setSlide] = useState(0);
  const score = a?.avgScore;

  const slides = [
    {
      num: "01", title: "El Problema", color: T.coral, bg: T.coralLight,
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.textMid, margin: 0, fontFamily: T.font }}>{idea.description}</p>
          <div style={{ background: T.surface, border: `1.5px solid ${T.coral}25`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.coral, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.font }}>💸 ¿Pagan por esto hoy?</div>
            <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.6, fontFamily: T.font }}>{a?.pagaHoy || "Sin datos"}</p>
          </div>
        </div>
      ),
    },
    {
      num: "02", title: "La Solución", color: T.cobalt, bg: T.cobaltLight,
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.textMid, margin: 0, fontFamily: T.font }}>{a?.diferencial}</p>
          <div style={{ background: T.text, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF50", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.font }}>⚙️ Stack técnico</div>
            <p style={{ margin: 0, fontSize: 13, color: "#FFF", fontFamily: "monospace", lineHeight: 1.7 }}>{a?.stack}</p>
          </div>
        </div>
      ),
    },
    {
      num: "03", title: "Mercado & Score", color: T.mint, bg: T.mintLight,
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[{ t: "👥 Cliente objetivo", v: a?.publicObj }, { t: "🔍 vs Competencia", v: a?.benchmark }].map(({ t, v }) => (
              <div key={t} style={{ background: T.surface, border: `1.5px solid ${T.mint}25`, borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.mint, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.font }}>{t}</div>
                <p style={{ margin: 0, fontSize: 13, color: T.textMid, lineHeight: 1.5, fontFamily: T.font }}>{v}</p>
              </div>
            ))}
          </div>
          {score && (
            <div style={{ background: T.text, borderRadius: 12, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <RadarChart scores={a?.scores} size={120} />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#FFFFFF40", fontFamily: T.font, marginBottom: 4 }}>Score Shark Board</div>
                <div style={{ fontSize: 38, fontWeight: 900, fontFamily: "monospace", color: scoreColor(score) }}>{score.toFixed(1)}</div>
                <div style={{ fontSize: 12, color: scoreColor(score), fontFamily: T.font, fontWeight: 700 }}>{scoreLabel(score)}</div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      num: "04", title: "Modelo de Negocio", color: T.amber, bg: T.amberLight,
      content: (
        <div style={{ display: "grid", gap: 10 }}>
          {a?.monetizacion?.map((m, i) => (
            <div key={i} style={{ background: i === 0 ? T.text : T.surface, border: `1.5px solid ${i === 0 ? "transparent" : T.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: i === 0 ? "#FFF" : T.text, fontFamily: T.font }}>
                  {m.modelo}
                  {i === 0 && <span style={{ marginLeft: 8, fontSize: 10, background: T.amber + "30", color: T.amber, fontWeight: 700, borderRadius: 20, padding: "2px 8px" }}>★ RECOMENDADO</span>}
                </div>
                <div style={{ fontSize: 12, color: i === 0 ? "#FFFFFF50" : T.textMute, marginTop: 2, fontFamily: T.font }}>{m.descripcion}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: 10, color: i === 0 ? "#FFFFFF40" : T.textMute, fontFamily: T.font }}>MRR est.</div>
                <div style={{ fontWeight: 800, color: T.mint, fontFamily: "monospace", fontSize: 14 }}>{m.mrrEstimado}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: "05", title: "Pros & Riesgos", color: T.purple, bg: T.purpleLight,
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { title: "✅ A favor",   items: a?.pros,  color: T.mint,  bg: T.mintLight  },
            { title: "⚠️ En contra", items: [...(a?.cons || []), a?.mayorRiesgo ? `☠️ ${a.mayorRiesgo}` : null].filter(Boolean), color: T.coral, bg: T.coralLight },
          ].map(({ title, items, color, bg }) => (
            <div key={title}>
              <div style={{ fontWeight: 700, fontSize: 11, color, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.font }}>{title}</div>
              {items?.map((item, i) => (
                <div key={i} style={{ background: bg, border: `1px solid ${color}18`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: T.textMid, lineHeight: 1.4, marginBottom: 7, fontFamily: T.font }}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      ),
    },
    {
      num: "06", title: "Próximos 90 días", color: T.cobalt, bg: T.cobaltLight,
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <TimelineGTM gtm90dias={a?.gtm90dias} />
          <div style={{ background: T.surface, border: `1.5px solid ${T.cobalt}18`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.cobalt, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.font }}>📅 Primeros 30 días</div>
            <p style={{ margin: 0, fontSize: 14, color: T.textMid, lineHeight: 1.7, fontFamily: T.font }}>{a?.primeros30dias}</p>
          </div>
        </div>
      ),
    },
  ];

  const cur = slides[slide];

  const handleExport = () => {
    const sc = a?.avgScore?.toFixed(1) || "N/A";
    const md = `# Pitch Deck — ${idea.title}\n> Score: ${sc}/10 · ${scoreLabel(parseFloat(sc))}\n\n---\n\n## El Problema\n${idea.description}\n\n¿Pagan hoy? ${a?.pagaHoy}\n\n## La Solución\n${a?.diferencial}\n\nStack: ${a?.stack}\n\n## Mercado\nCliente: ${a?.publicObj}\nBenchmark: ${a?.benchmark}\n\n## Modelo de Negocio\n${(a?.monetizacion || []).map((m, i) => `${i + 1}. ${m.modelo}: ${m.descripcion} (MRR: ${m.mrrEstimado})`).join("\n")}\n\n## Pros\n${(a?.pros || []).map((p) => "- " + p).join("\n")}\n\n## Cons\n${(a?.cons || []).map((c) => "- " + c).join("\n")}\n\nMayor riesgo: ${a?.mayorRiesgo}\n\n## Plan 90 días\n${a?.gtm90dias}\n`;
    exportMarkdown(`pitch-${idea.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}.md`, md);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 400, padding: 16 }}>
      <div style={{ background: T.bg, borderRadius: 24, width: "100%", maxWidth: 680, maxHeight: "92vh", overflow: "hidden", boxShadow: "0 40px 100px #00000050", display: "flex", flexDirection: "column" }}>
        <div style={{ background: T.text, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SharkLogo size={30} />
            <div>
              <div style={{ color: "#FFFFFF40", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", fontFamily: T.font }}>PITCH DECK</div>
              <div style={{ color: "#FFF", fontWeight: 700, fontSize: 15, fontFamily: T.fontDisplay }}>{idea.title}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#FFFFFF30", fontSize: 12, fontFamily: T.font }}>{slide + 1}/{slides.length}</span>
            <button onClick={onClose} style={{ background: "#FFFFFF15", border: "none", borderRadius: 8, color: "#FFF", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 5, padding: "10px 22px 0", justifyContent: "center" }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ height: 4, borderRadius: 99, background: i === slide ? cur.color : i < slide ? T.textMute : T.border, border: "none", cursor: "pointer", transition: "all 0.2s", padding: 0, width: i === slide ? 28 : 8 }} />
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div style={{ background: cur.bg, border: `1.5px solid ${cur.color}18`, borderRadius: 16, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{ background: cur.color, color: "#FFF", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 800, fontFamily: T.font }}>{cur.num}</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: T.text, fontFamily: T.fontDisplay }}>{cur.title}</div>
            </div>
            {cur.content}
          </div>
        </div>

        <div style={{ padding: "12px 22px 18px", display: "flex", gap: 8, borderTop: `1px solid ${T.border}`, background: T.surface }}>
          <button onClick={() => setSlide((s) => Math.max(0, s - 1))} disabled={slide === 0}
            style={{ flex: 1, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "11px", color: slide === 0 ? T.textMute : T.text, fontWeight: 700, fontSize: 13, cursor: slide === 0 ? "not-allowed" : "pointer", fontFamily: T.font }}>
            ← Anterior
          </button>
          <button onClick={handleExport}
            style={{ background: T.mintLight, border: `1.5px solid ${T.mint}40`, borderRadius: 10, padding: "11px 16px", color: T.mint, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: T.font }}>
            ⬇️ .md
          </button>
          <button onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))} disabled={slide === slides.length - 1}
            style={{ flex: 1, background: T.text, border: "none", borderRadius: 10, padding: "11px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: slide === slides.length - 1 ? "not-allowed" : "pointer", fontFamily: T.font }}>
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
