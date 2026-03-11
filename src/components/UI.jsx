import { T, STAGES, SCORE_CRITERIA } from "../constants";
import { scoreColor, scoreLabel } from "../utils";

export function Card({ title, children, accent, style: extra = {} }) {
  return (
    <div style={{ background: T.surface, border: `1.5px solid ${accent ? accent + "22" : T.border}`, borderRadius: 16, padding: "20px 22px", borderLeft: accent ? `4px solid ${accent}` : undefined, boxShadow: "0 2px 10px #0000000a", ...extra }}>
      {title && (
        <div style={{ fontWeight: 700, fontSize: 11, color: T.textMute, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: T.font }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export function StageBadge({ stage }) {
  const s = STAGES.find((x) => x.key === stage) || STAGES[0];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", fontFamily: T.font }}>
      {s.emoji} {s.label}
    </span>
  );
}

export function ScoreBar({ label, value, icon, rationale }) {
  if (!value) return null;
  const c = scoreColor(value);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: T.text, fontWeight: 600, fontFamily: T.font }}>{icon} {label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: c, fontWeight: 700, background: c + "15", borderRadius: 20, padding: "1px 8px", fontFamily: T.font }}>{scoreLabel(value)}</span>
          <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: c }}>{value}/10</span>
        </div>
      </div>
      <div style={{ height: 6, background: T.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${c}70, ${c})`, borderRadius: 99, width: `${value * 10}%`, transition: "width 0.7s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      {rationale && (
        <div style={{ fontSize: 12, color: T.textMute, marginTop: 5, fontStyle: "italic", lineHeight: 1.4, fontFamily: T.font }}>
          {rationale}
        </div>
      )}
    </div>
  );
}

export function EmptyTab({ icon, title, sub, onGo }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 20px", background: T.surface, borderRadius: 20, border: `1.5px solid ${T.border}` }}>
      <div style={{ fontSize: 46, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 6, fontSize: 17, fontFamily: T.fontDisplay }}>{title}</div>
      <div style={{ color: T.textMute, fontSize: 13, marginBottom: 22 }}>{sub}</div>
      <button onClick={onGo} style={{ background: T.text, border: "none", borderRadius: 10, padding: "11px 24px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: T.font }}>
        🦈 Ir al análisis
      </button>
    </div>
  );
}
