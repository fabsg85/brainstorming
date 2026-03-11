import { T } from "../constants";

const PHASES = [
  { label: "Mes 1 — Validación",   color: T.coral, icon: "🔍", bg: T.coralLight },
  { label: "Mes 2 — Construcción", color: T.amber, icon: "🔨", bg: T.amberLight },
  { label: "Mes 3 — Lanzamiento",  color: T.mint,  icon: "🚀", bg: T.mintLight  },
];

export default function TimelineGTM({ gtm90dias }) {
  if (!gtm90dias) return null;
  const sentences = gtm90dias.split(/\.\s+/).filter((s) => s.trim().length > 10);

  return (
    <div style={{ position: "relative", paddingLeft: 28 }}>
      <div style={{ position: "absolute", left: 11, top: 10, bottom: 10, width: 2, background: `linear-gradient(180deg, ${T.coral}, ${T.amber}, ${T.mint})`, borderRadius: 99 }} />
      {PHASES.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < 2 ? 22 : 0, position: "relative" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: p.color, border: `3px solid ${T.surface}`, flexShrink: 0, marginTop: 1, boxShadow: `0 0 0 3px ${p.color}30`, position: "relative", zIndex: 1 }} />
          <div style={{ flex: 1, background: p.bg, borderRadius: 12, padding: "12px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: p.color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontFamily: T.font }}>
              {p.icon} {p.label}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: T.textMid, lineHeight: 1.6, fontFamily: T.font }}>
              {sentences[i] || "..."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
