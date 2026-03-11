import { T, STAGES, SCORE_CRITERIA } from "../constants";
import { scoreColor, scoreLabel } from "../utils";

export function Card({ title, children, accent, style: extra = {}, noPad = false }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${accent ? accent + "30" : T.border}`,
      borderRadius: 16,
      padding: noPad ? 0 : "22px 24px",
      boxShadow: accent ? `0 0 0 1px ${accent}15, 0 8px 32px rgba(0,0,0,0.4)` : "0 4px 24px rgba(0,0,0,0.3)",
      backdropFilter: "blur(12px)",
      borderLeft: accent ? `2px solid ${accent}` : undefined,
      overflow: "hidden",
      ...extra
    }}>
      {title && (
        <div style={{ fontWeight: 700, fontSize: 10, color: T.textMute, marginBottom: 16, textTransform: "uppercase", letterSpacing: "1.2px", fontFamily: T.fontDisplay }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export function StageBadge({ stage }) {
  const s = STAGES.find(x => x.key === stage) || STAGES[0];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "3px 10px", fontFamily: T.fontDisplay, border: `1px solid ${s.color}25` }}>
      {s.emoji} {s.label}
    </span>
  );
}

export function ScoreBar({ label, value, icon, rationale }) {
  if (!value) return null;
  const c = scoreColor(value);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <span style={{ fontSize: 13, color: T.text, fontWeight: 600, fontFamily: T.fontDisplay }}>{icon} {label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: c, fontWeight: 700, background: c + "15", borderRadius: 99, padding: "2px 9px", fontFamily: T.fontDisplay, border: `1px solid ${c}25` }}>{scoreLabel(value)}</span>
          <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: c }}>{value}/10</span>
        </div>
      </div>
      <div style={{ height: 5, background: T.surface2, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${c}70, ${c})`, borderRadius: 99, width: `${value * 10}%`, transition: "width 0.8s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 8px ${c}60` }} />
      </div>
      {rationale && <div style={{ fontSize: 12, color: T.textMute, marginTop: 6, fontStyle: "italic", lineHeight: 1.5 }}>{rationale}</div>}
    </div>
  );
}

export function EmptyTab({ icon, title, sub, onGo }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 20px", background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`, backdropFilter: "blur(12px)" }}>
      <div style={{ fontSize: 44, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 8, fontSize: 18, fontFamily: T.fontDisplay, letterSpacing: "-0.3px" }}>{title}</div>
      <div style={{ color: T.textMute, fontSize: 14, marginBottom: 28 }}>{sub}</div>
      <button onClick={onGo} style={{ background: "linear-gradient(135deg,#6C5CE7,#00F5D4)", border: "none", borderRadius: 10, padding: "11px 24px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: T.fontDisplay, boxShadow: "0 0 24px rgba(108,92,231,0.4)" }}>
        🦈 Ver análisis
      </button>
    </div>
  );
}

export function GlowBtn({ onClick, children, variant = "primary", size = "md", disabled = false, style: extra = {} }) {
  const pads = { sm: "8px 16px", md: "10px 20px", lg: "13px 28px", xl: "15px 36px" };
  const fz   = { sm: 12, md: 13, lg: 14, xl: 15 };
  const vs = {
    primary: { background: "linear-gradient(135deg,#6C5CE7,#00F5D4)", color: "#fff", boxShadow: "0 0 20px rgba(108,92,231,0.4)", border: "none" },
    ghost:   { background: T.surface, color: T.textMid, border: `1px solid ${T.border}` },
    danger:  { background: "rgba(255,95,122,0.12)", color: "#FF5F7A", border: "1px solid rgba(255,95,122,0.2)" },
    teal:    { background: "rgba(0,245,212,0.10)", color: "#00F5D4", border: "1px solid rgba(0,245,212,0.2)" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...vs[variant], padding: pads[size], borderRadius: 10, fontWeight: 700, fontSize: fz[size], cursor: disabled ? "not-allowed" : "pointer", fontFamily: T.fontDisplay, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 7, opacity: disabled ? 0.4 : 1, letterSpacing: "-0.2px", ...extra }}>
      {children}
    </button>
  );
}
