import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://nolbcladiwwfaoxjjlmq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbGJjbGFkaXd3ZmFveGpqbG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODg0ODEsImV4cCI6MjA4ODY2NDQ4MX0.fjIqBUf30qZbNcBv8gCCwXA57Wf4kGqtygcUF919Gh8"
);

// ── DESIGN TOKENS ─────────────────────────────────────────────────
const T = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  border: "#E8E6E0",
  text: "#1A1A18",
  textMid: "#5C5A54",
  textMute: "#A8A49E",
  coral: "#FF5C3A",
  coralLight: "#FFF0EC",
  mint: "#00C98D",
  mintLight: "#E6FBF4",
  cobalt: "#2255E8",
  cobaltLight: "#EEF2FF",
  amber: "#F5A623",
  amberLight: "#FFF8EC",
  purple: "#7C3AED",
  purpleLight: "#F5F0FF",
  font: "'DM Sans', system-ui, sans-serif",
  fontDisplay: "'DM Serif Display', Georgia, serif",
};

const STAGES = [
  { key: "idea", label: "Idea", emoji: "💡", bg: T.purpleLight, color: T.purple },
  { key: "validando", label: "Validando", emoji: "🔍", bg: T.amberLight, color: T.amber },
  { key: "construyendo", label: "Construyendo", emoji: "🔨", bg: T.cobaltLight, color: T.cobalt },
  { key: "lanzado", label: "Lanzado", emoji: "🚀", bg: T.mintLight, color: T.mint },
];

const WIZARD_STEPS = [
  { key: "title", label: "El nombre", emoji: "💡", desc: "Un nombre que no suene a startup genérica de 2019, por favor." },
  { key: "problem", label: "El dolor", emoji: "🎯", desc: "¿Qué problema resuelve? ¿Quién lo sufre? ¿Cuánto pagan hoy para no resolverlo?" },
  { key: "stage", label: "Estado actual", emoji: "📍", desc: "Seamos honestos sobre dónde está esto." },
];

const SCORE_CRITERIA = [
  { key: "traccion", label: "Tracción", icon: "📈", short: "Trac" },
  { key: "moat", label: "Moat", icon: "🏰", short: "Moat" },
  { key: "monetizacion", label: "Monetización", icon: "💰", short: "Mono" },
  { key: "velocidad", label: "Velocidad", icon: "⚡", short: "Vel" },
  { key: "mercado", label: "Mercado", icon: "🌍", short: "Mkt" },
];

const scoreLabel = (s) => {
  if (!s) return "Sin datos";
  if (s >= 9) return "Tomá mi plata";
  if (s >= 8) return "Esto va en serio";
  if (s >= 7) return "Tiene potencial";
  if (s >= 6) return "Puede funcionar";
  if (s >= 5) return "Meh, quizás";
  if (s >= 4) return "Necesita trabajo";
  if (s >= 3) return "Houston...";
  return "Próxima idea";
};

const scoreVerdict = (s) => {
  if (!s) return null;
  if (s >= 8.5) return { label: "INVERTIRÍA HOY", emoji: "🔥", sub: "Rarísimo que diga esto. No lo arruines." };
  if (s >= 7.5) return { label: "INVERTIRÍA", emoji: "🟢", sub: "Tiene lo que hace falta. A construir, ayer." };
  if (s >= 6)   return { label: "PIVOTE NECESARIO", emoji: "🟡", sub: "Hay algo acá, pero está enterrado bajo problemas." };
  if (s >= 4.5) return { label: "PASS POR AHORA", emoji: "🟠", sub: "No es el momento o no es la idea." };
  return { label: "HARD PASS", emoji: "🔴", sub: "No, gracias. La próxima." };
};

function avg(scores) {
  if (!scores) return null;
  const vals = Object.values(scores).filter(v => v > 0);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function scoreColor(s) {
  if (!s) return T.textMute;
  if (s >= 7.5) return T.mint;
  if (s >= 5.5) return T.amber;
  return T.coral;
}

// ── LOGO ──────────────────────────────────────────────────────────
function SharkLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="12" fill={T.text} />
      <path d="M7 27 C9 20,16 17,24 18 L31 16 L27 21 C31 21,36 23,37 27 C33 26,28 25,24 26 L22 30 L20 26 C15 26,11 26,7 27Z" fill="#FFF" />
      <path d="M20 18 L24 11 L28 18" fill="#FFF" opacity="0.65" />
      <circle cx="29" cy="23" r="1.4" fill={T.text} />
      <path d="M7 27 L4 23 M7 27 L4 31" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

// ── GAUGE ─────────────────────────────────────────────────────────
function GaugeChart({ score, size = 150 }) {
  if (!score) return null;
  const c = scoreColor(score);
  const cx = size / 2, cy = size * 0.58;
  const r = size * 0.36;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const startA = -210, endA = 30, totalA = endA - startA;
  const fillA = (score / 10) * totalA;
  const arcPath = (sa, ea, rad) => {
    const x1 = cx + rad * Math.cos(toRad(sa)), y1 = cy + rad * Math.sin(toRad(sa));
    const x2 = cx + rad * Math.cos(toRad(ea)), y2 = cy + rad * Math.sin(toRad(ea));
    return `M ${x1} ${y1} A ${rad} ${rad} 0 ${ea - sa > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const needleA = startA + fillA;
  const nLen = r * 0.78;
  return (
    <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
      <path d={arcPath(startA, endA, r)} fill="none" stroke={T.border} strokeWidth="9" strokeLinecap="round" />
      <path d={arcPath(startA, startA + fillA, r)} fill="none" stroke={c} strokeWidth="9" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 5px ${c}70)` }} />
      {[-5, 0, 5].map(o => (
        <line key={o} x1={cx + (r - 14) * Math.cos(toRad(needleA + o))} y1={cy + (r - 14) * Math.sin(toRad(needleA + o))}
          x2={cx + nLen * Math.cos(toRad(needleA + o))} y2={cy + nLen * Math.sin(toRad(needleA + o))}
          stroke={o === 0 ? T.text : T.text + "20"} strokeWidth={o === 0 ? 2.5 : 1} strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r="5.5" fill={T.text} />
      <text x={cx} y={cy - r * 0.18} textAnchor="middle" fontSize="22" fontWeight="900" fill={c} fontFamily="monospace">{score.toFixed(1)}</text>
      <text x={cx} y={cy - r * 0.18 + 17} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={T.textMid} fontFamily={T.font}>{scoreLabel(score)}</text>
    </svg>
  );
}

// ── RADAR ─────────────────────────────────────────────────────────
function RadarChart({ scores, size = 180 }) {
  if (!scores) return null;
  const cx = size / 2, cy = size / 2, r = size * 0.35;
  const n = 5;
  const toRad = (i) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const pt = (i, dist) => [cx + dist * Math.cos(toRad(i)), cy + dist * Math.sin(toRad(i))];
  const gridPts = (level) => Array.from({ length: n }, (_, i) => pt(i, level * r));
  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";
  const scoreVals = SCORE_CRITERIA.map(c => scores[c.key] || 0);
  const dataPts = scoreVals.map((v, i) => pt(i, (v / 10) * r));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25, 0.5, 0.75, 1].map(lv => (
        <polygon key={lv} points={gridPts(lv).map(p => p.join(",")).join(" ")}
          fill={lv === 0.25 ? T.cobaltLight + "80" : "none"}
          stroke={lv === 1 ? T.borderStrong || "#D0CCC4" : T.border} strokeWidth={lv === 1 ? 1.5 : 1} />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const end = pt(i, r);
        return <line key={i} x1={cx} y1={cy} x2={end[0]} y2={end[1]} stroke={T.border} strokeWidth="1" />;
      })}
      <path d={toPath(dataPts)} fill={T.cobalt + "22"} stroke={T.cobalt} strokeWidth="2" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 6px ${T.cobalt}40)` }} />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill={T.cobalt} stroke="white" strokeWidth="1.5" />
      ))}
      {SCORE_CRITERIA.map((c, i) => {
        const labelPt = pt(i, r + 20);
        return (
          <text key={c.key} x={labelPt[0]} y={labelPt[1] + 4} textAnchor="middle"
            fontSize="10" fontWeight="700" fill={T.textMid} fontFamily={T.font}>{c.short}</text>
        );
      })}
    </svg>
  );
}

// ── MINI BAR CHART ────────────────────────────────────────────────
function MiniBarChart({ ideas }) {
  const withScores = [...ideas].filter(i => i.analysis?.avgScore).sort((a, b) => b.analysis.avgScore - a.analysis.avgScore).slice(0, 7);
  if (withScores.length < 2) return <div style={{ color: T.textMute, fontSize: 13, textAlign: "center", padding: "20px 0" }}>Analizá más ideas para ver el ranking</div>;
  return (
    <div>
      {withScores.map((idea, idx) => {
        const sc = idea.analysis.avgScore;
        const c = scoreColor(sc);
        const medals = ["🥇", "🥈", "🥉"];
        return (
          <div key={idea.id} style={{ marginBottom: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: T.textMid, fontWeight: 600, fontFamily: T.font, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {medals[idx] || `${idx + 1}.`} {idea.title}
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: c, fontFamily: "monospace" }}>{sc.toFixed(1)}</span>
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

// ── TIMELINE GTM ──────────────────────────────────────────────────
function TimelineGTM({ gtm90dias }) {
  if (!gtm90dias) return null;
  const sentences = gtm90dias.split(/\.\s+/).filter(s => s.trim().length > 10);
  const phases = [
    { label: "Mes 1 — Validación", color: T.coral, icon: "🔍", bg: T.coralLight },
    { label: "Mes 2 — Construcción", color: T.amber, icon: "🔨", bg: T.amberLight },
    { label: "Mes 3 — Lanzamiento", color: T.mint, icon: "🚀", bg: T.mintLight },
  ];
  return (
    <div style={{ position: "relative", paddingLeft: 28 }}>
      <div style={{ position: "absolute", left: 11, top: 10, bottom: 10, width: 2,
        background: `linear-gradient(180deg, ${T.coral}, ${T.amber}, ${T.mint})`, borderRadius: 99 }} />
      {phases.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < 2 ? 22 : 0, position: "relative" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: p.color,
            border: `3px solid ${T.surface}`, flexShrink: 0, marginTop: 1,
            boxShadow: `0 0 0 3px ${p.color}30`, position: "relative", zIndex: 1 }} />
          <div style={{ flex: 1, background: p.bg, borderRadius: 12, padding: "12px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: p.color, textTransform: "uppercase",
              letterSpacing: "0.5px", marginBottom: 6, fontFamily: T.font }}>{p.icon} {p.label}</div>
            <p style={{ margin: 0, fontSize: 13, color: T.textMid, lineHeight: 1.6, fontFamily: T.font }}>
              {sentences[i] || "..."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PRIMITIVES ────────────────────────────────────────────────────
function Card({ title, children, accent, style: extra = {} }) {
  return (
    <div style={{ background: T.surface, border: `1.5px solid ${accent ? accent + "22" : T.border}`,
      borderRadius: 16, padding: "20px 22px", borderLeft: accent ? `4px solid ${accent}` : undefined,
      boxShadow: "0 2px 10px #0000000a", ...extra }}>
      {title && <div style={{ fontWeight: 700, fontSize: 11, color: T.textMute, marginBottom: 14,
        textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: T.font }}>{title}</div>}
      {children}
    </div>
  );
}

function StageBadge({ stage }) {
  const s = STAGES.find(x => x.key === stage) || STAGES[0];
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700,
    borderRadius: 20, padding: "3px 10px", fontFamily: T.font }}>{s.emoji} {s.label}</span>;
}

function ScoreBar({ label, value, icon, rationale }) {
  if (!value) return null;
  const c = scoreColor(value);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: T.text, fontWeight: 600, fontFamily: T.font }}>{icon} {label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: c, fontWeight: 700, background: c + "15",
            borderRadius: 20, padding: "1px 8px", fontFamily: T.font }}>{scoreLabel(value)}</span>
          <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: c }}>{value}/10</span>
        </div>
      </div>
      <div style={{ height: 6, background: T.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${c}70, ${c})`,
          borderRadius: 99, width: `${value * 10}%`, transition: "width 0.7s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      {rationale && <div style={{ fontSize: 12, color: T.textMute, marginTop: 5, fontStyle: "italic",
        lineHeight: 1.4, fontFamily: T.font }}>{rationale}</div>}
    </div>
  );
}

function VerdictBanner({ score }) {
  if (!score) return null;
  const v = scoreVerdict(score);
  const c = scoreColor(score);
  if (!v) return null;
  return (
    <div style={{ background: T.text, borderRadius: 18, padding: "22px 26px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      boxShadow: `0 12px 40px ${T.text}25, 0 0 0 1px ${T.text}10` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "#FFFFFF50", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, fontFamily: T.font }}>
          Veredicto del Shark
        </div>
        <div style={{ fontWeight: 700, fontSize: 24, color: c, fontFamily: T.fontDisplay, marginBottom: 6 }}>
          {v.emoji} {v.label}
        </div>
        <div style={{ fontSize: 13, color: "#FFFFFF60", fontFamily: T.font, lineHeight: 1.5 }}>{v.sub}</div>
      </div>
      <div style={{ flexShrink: 0, marginLeft: 16 }}>
        <GaugeChart score={score} size={148} />
      </div>
    </div>
  );
}

function EmptyTab({ icon, title, sub, onGo }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 20px", background: T.surface,
      borderRadius: 20, border: `1.5px solid ${T.border}` }}>
      <div style={{ fontSize: 46, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 6, fontSize: 17, fontFamily: T.fontDisplay }}>{title}</div>
      <div style={{ color: T.textMute, fontSize: 13, marginBottom: 22 }}>{sub}</div>
      <button onClick={onGo} style={{ background: T.text, border: "none", borderRadius: 10,
        padding: "11px 24px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: T.font }}>
        🦈 Ir al análisis
      </button>
    </div>
  );
}

// ── VOTING ────────────────────────────────────────────────────────
function VotingPanel({ idea, onVote }) {
  const [voterName, setVoterName] = useState("");
  const [voted, setVoted] = useState(false);
  const votes = idea.votes || [];
  const ups = votes.filter(v => v.vote === "up").length;
  const downs = votes.filter(v => v.vote === "down").length;

  const handleVote = (type) => {
    if (!voterName.trim()) return;
    if (votes.find(v => v.name === voterName.trim())) { setVoted(true); return; }
    onVote(idea.id, { name: voterName.trim(), vote: type, time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) });
    setVoted(true);
  };

  return (
    <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ background: T.text, padding: "16px 22px" }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#FFF", fontFamily: T.fontDisplay, marginBottom: 3 }}>🗳️ El equipo habla primero</div>
        <div style={{ fontSize: 12, color: "#FFFFFF50", fontFamily: T.font }}>Votá antes del análisis. El Shark habla después.</div>
      </div>
      <div style={{ padding: "18px 22px" }}>
        {votes.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              {[{ count: ups, label: "A favor", color: T.mint, bg: T.mintLight, emoji: "👍" },
                { count: downs, label: "En contra", color: T.coral, bg: T.coralLight, emoji: "👎" }].map(({ count, label, color, bg, emoji }) => (
                <div key={label} style={{ flex: 1, background: bg, border: `1.5px solid ${color}25`, borderRadius: 12, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>{emoji} {count}</div>
                  <div style={{ fontSize: 11, color, fontWeight: 700, marginTop: 4, fontFamily: T.font }}>{label}</div>
                </div>
              ))}
            </div>
            {votes.map((v, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                background: T.bg, borderRadius: 8, padding: "8px 12px", marginBottom: 6, fontFamily: T.font }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{v.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{v.vote === "up" ? "👍" : "👎"}</span>
                  <span style={{ fontSize: 11, color: T.textMute }}>{v.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {!voted ? (
          <div>
            <input value={voterName} onChange={e => setVoterName(e.target.value)}
              placeholder="Tu nombre (no te hagas el anónimo)"
              style={{ border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px",
                fontSize: 13, outline: "none", color: T.text, width: "100%", boxSizing: "border-box",
                marginBottom: 10, fontFamily: T.font, background: T.bg }} />
            <div style={{ display: "flex", gap: 8 }}>
              {[{ type: "up", label: "👍 Dale", color: T.mint, bg: T.mintLight },
                { type: "down", label: "👎 Paso", color: T.coral, bg: T.coralLight }].map(({ type, label, color, bg }) => (
                <button key={type} onClick={() => handleVote(type)} disabled={!voterName.trim()}
                  style={{ flex: 1, background: voterName.trim() ? bg : T.bg,
                    border: `2px solid ${voterName.trim() ? color + "40" : T.border}`,
                    borderRadius: 10, padding: "12px", color: voterName.trim() ? color : T.textMute,
                    fontWeight: 800, fontSize: 15, cursor: voterName.trim() ? "pointer" : "not-allowed",
                    fontFamily: T.font, transition: "all 0.15s" }}>{label}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: T.mintLight, border: `1.5px solid ${T.mint}30`, borderRadius: 10,
            padding: "14px", textAlign: "center", color: T.mint, fontWeight: 700, fontSize: 13, fontFamily: T.font }}>
            ✅ Voto registrado. Ahora a ver qué dice el Shark.
          </div>
        )}
      </div>
    </div>
  );
}

// ── PITCH DECK ────────────────────────────────────────────────────
function PitchDeckModal({ idea, analysis: a, onClose }) {
  const [slide, setSlide] = useState(0);
  const score = a?.avgScore;
  const slides = [
    { num: "01", title: "El Problema", color: T.coral, bg: T.coralLight,
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.textMid, margin: 0, fontFamily: T.font }}>{idea.description}</p>
          <div style={{ background: T.surface, border: `1.5px solid ${T.coral}25`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.coral, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.font }}>💸 ¿Pagan por esto hoy?</div>
            <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.6, fontFamily: T.font }}>{a?.pagaHoy || "Sin datos"}</p>
          </div>
        </div>
      )
    },
    { num: "02", title: "La Solución", color: T.cobalt, bg: T.cobaltLight,
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.textMid, margin: 0, fontFamily: T.font }}>{a?.diferencial}</p>
          <div style={{ background: T.text, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF50", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.font }}>⚙️ Stack técnico</div>
            <p style={{ margin: 0, fontSize: 13, color: "#FFF", fontFamily: "monospace", lineHeight: 1.7 }}>{a?.stack}</p>
          </div>
        </div>
      )
    },
    { num: "03", title: "Mercado & Score", color: T.mint, bg: T.mintLight,
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
      )
    },
    { num: "04", title: "Modelo de Negocio", color: T.amber, bg: T.amberLight,
      content: (
        <div style={{ display: "grid", gap: 10 }}>
          {a?.monetizacion?.map((m, i) => (
            <div key={i} style={{ background: i === 0 ? T.text : T.surface, border: `1.5px solid ${i === 0 ? "transparent" : T.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: i === 0 ? "#FFF" : T.text, fontFamily: T.font }}>
                  {m.modelo}{i === 0 && <span style={{ marginLeft: 8, fontSize: 10, background: T.amber + "30", color: T.amber, fontWeight: 700, borderRadius: 20, padding: "2px 8px", fontFamily: T.font }}>★ RECOMENDADO</span>}
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
      )
    },
    { num: "05", title: "Pros & Riesgos", color: T.purple, bg: T.purpleLight,
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { title: "✅ A favor", items: a?.pros, color: T.mint, bg: T.mintLight },
            { title: "⚠️ En contra", items: [...(a?.cons || []), a?.mayorRiesgo ? `☠️ ${a.mayorRiesgo}` : null].filter(Boolean), color: T.coral, bg: T.coralLight }
          ].map(({ title, items, color, bg }) => (
            <div key={title}>
              <div style={{ fontWeight: 700, fontSize: 11, color, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.font }}>{title}</div>
              {items?.map((item, i) => (
                <div key={i} style={{ background: bg, border: `1px solid ${color}18`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: T.textMid, lineHeight: 1.4, marginBottom: 7, fontFamily: T.font }}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      )
    },
    { num: "06", title: "Próximos 90 días", color: T.cobalt, bg: T.cobaltLight,
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <TimelineGTM gtm90dias={a?.gtm90dias} />
          <div style={{ background: T.surface, border: `1.5px solid ${T.cobalt}18`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.cobalt, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.font }}>📅 Primeros 30 días</div>
            <p style={{ margin: 0, fontSize: 14, color: T.textMid, lineHeight: 1.7, fontFamily: T.font }}>{a?.primeros30dias}</p>
          </div>
        </div>
      )
    },
  ];

  const cur = slides[slide];
  const exportMd = () => {
    const sc = a?.avgScore?.toFixed(1) || "N/A";
    const md = `# Pitch Deck — ${idea.title}\n> Score: ${sc}/10 · ${scoreLabel(parseFloat(sc))}\n\n---\n\n## El Problema\n${idea.description}\n\n¿Pagan hoy? ${a?.pagaHoy}\n\n## La Solución\n${a?.diferencial}\n\nStack: ${a?.stack}\n\n## Mercado\nCliente: ${a?.publicObj}\nBenchmark: ${a?.benchmark}\n\n## Modelo de Negocio\n${(a?.monetizacion || []).map((m, i) => `${i + 1}. ${m.modelo}: ${m.descripcion} (MRR: ${m.mrrEstimado})`).join("\n")}\n\n## Pros\n${(a?.pros || []).map(p => "- " + p).join("\n")}\n\n## Cons\n${(a?.cons || []).map(c => "- " + c).join("\n")}\n\nMayor riesgo: ${a?.mayorRiesgo}\n\n## Plan 90 días\n${a?.gtm90dias}\n`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url;
    a2.download = `pitch-${idea.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}.md`;
    a2.click();
    URL.revokeObjectURL(url);
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
          <button onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0}
            style={{ flex: 1, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "11px", color: slide === 0 ? T.textMute : T.text, fontWeight: 700, fontSize: 13, cursor: slide === 0 ? "not-allowed" : "pointer", fontFamily: T.font }}>← Anterior</button>
          <button onClick={exportMd}
            style={{ background: T.mintLight, border: `1.5px solid ${T.mint}40`, borderRadius: 10, padding: "11px 16px", color: T.mint, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: T.font }}>⬇️ .md</button>
          <button onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))} disabled={slide === slides.length - 1}
            style={{ flex: 1, background: T.text, border: "none", borderRadius: 10, padding: "11px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: slide === slides.length - 1 ? "not-allowed" : "pointer", fontFamily: T.font }}>Siguiente →</button>
        </div>
      </div>
    </div>
  );
}

// ── WIZARD ────────────────────────────────────────────────────────
function Wizard({ onSave, onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ title: "", description: "", stage: "idea" });
  const canNext = step === 0 ? data.title.trim().length > 2 : step === 1 ? data.description.trim().length > 10 : true;
  const inputBase = { border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "13px 15px", fontSize: 14, outline: "none", color: T.text, width: "100%", boxSizing: "border-box", fontFamily: T.font, background: T.bg, transition: "border-color 0.15s" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000066", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 24, width: "100%", maxWidth: 500, boxShadow: "0 30px 80px #00000025", overflow: "hidden" }}>
        <div style={{ background: T.text, padding: "22px 26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SharkLogo size={30} />
              <span style={{ color: "#FFF", fontWeight: 700, fontSize: 16, fontFamily: T.fontDisplay }}>Nueva Idea</span>
            </div>
            <button onClick={onClose} style={{ background: "#FFFFFF15", border: "none", borderRadius: 7, color: "#FFF", width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {WIZARD_STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? T.coral : "#FFFFFF20", transition: "background 0.3s" }} />
            ))}
          </div>
          <div style={{ marginTop: 8, color: "#FFFFFF40", fontSize: 11, fontFamily: T.font }}>Paso {step + 1} de {WIZARD_STEPS.length}</div>
        </div>
        <div style={{ padding: "24px 26px 28px" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>{WIZARD_STEPS[step].emoji}</div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6, color: T.text, fontFamily: T.fontDisplay }}>{WIZARD_STEPS[step].label}</div>
          <div style={{ color: T.textMid, fontSize: 13, marginBottom: 20, lineHeight: 1.6, fontFamily: T.font }}>{WIZARD_STEPS[step].desc}</div>

          {step === 0 && (
            <input autoFocus value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && canNext && setStep(1)}
              placeholder="ej: Liquidador de sueldos AI para PYMEs uruguayas"
              style={inputBase} onFocus={e => e.target.style.borderColor = T.coral} onBlur={e => e.target.style.borderColor = T.border} />
          )}
          {step === 1 && (
            <textarea autoFocus value={data.description} onChange={e => setData(p => ({ ...p, description: e.target.value }))}
              placeholder="¿Qué dolor resuelve? ¿Quién lo sufre? ¿Cuánto pagan hoy para no resolverlo?"
              rows={5} style={{ ...inputBase, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = T.coral} onBlur={e => e.target.style.borderColor = T.border} />
          )}
          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {STAGES.map(s => (
                <button key={s.key} onClick={() => setData(p => ({ ...p, stage: s.key }))}
                  style={{ background: data.stage === s.key ? s.bg : T.bg, color: data.stage === s.key ? s.color : T.textMid,
                    border: `2px solid ${data.stage === s.key ? s.color + "50" : T.border}`,
                    borderRadius: 12, padding: "14px 10px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    textAlign: "center", transition: "all 0.15s", fontFamily: T.font }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{s.emoji}</div>{s.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                style={{ flex: 1, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "12px", color: T.text, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: T.font }}>← Atrás</button>
            )}
            {step < WIZARD_STEPS.length - 1 ? (
              <button onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext}
                style={{ flex: 2, background: canNext ? T.text : T.bg, border: "none", borderRadius: 10,
                  padding: "12px", color: canNext ? "#FFF" : T.textMute, fontWeight: 800,
                  fontSize: 14, cursor: canNext ? "pointer" : "not-allowed", fontFamily: T.font }}>Siguiente →</button>
            ) : (
              <button onClick={() => onSave(data)}
                style={{ flex: 2, background: T.text, border: "none", borderRadius: 10, padding: "12px", color: "#FFF", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: T.font }}>🦈 Al board</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMPARADOR ────────────────────────────────────────────────────
function Comparador({ ideas }) {
  const analyzed = ideas.filter(i => i.analysis && !i.analysis.error);
  const [selA, setSelA] = useState(null);
  const [selB, setSelB] = useState(null);
  const sorted = [...ideas].sort((a, b) => (avg(b.analysis?.scores) || 0) - (avg(a.analysis?.scores) || 0));

  useEffect(() => {
    if (analyzed.length >= 2 && !selA && !selB) { setSelA(analyzed[0].id); setSelB(analyzed[1].id); }
  }, [analyzed.length]);

  const ideaA = ideas.find(i => i.id === selA);
  const ideaB = ideas.find(i => i.id === selB);

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

      <div style={{ overflowX: "auto", marginBottom: 40 }}>
        <div style={{ minWidth: 560 }}>
          <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 56px 56px 56px 56px 56px 80px", gap: 6,
            padding: "8px 14px", background: T.bg, borderRadius: 10, marginBottom: 6,
            fontSize: 11, fontWeight: 700, color: T.textMute, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <div>#</div><div>Idea</div>
            {SCORE_CRITERIA.map(c => <div key={c.key} style={{ textAlign: "center" }}>{c.icon}</div>)}
            <div style={{ textAlign: "center" }}>TOTAL</div>
          </div>
          {sorted.map((idea, idx) => {
            const sc = idea.analysis?.scores;
            const total = avg(sc);
            return (
              <div key={idea.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr 56px 56px 56px 56px 56px 80px", gap: 6,
                padding: "12px 14px", background: T.surface, border: `1.5px solid ${T.border}`,
                borderRadius: 12, marginBottom: 6, alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span style={{ color: T.textMute, fontSize: 13 }}>{idx + 1}</span>}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: T.text, marginBottom: 4 }}>{idea.title}</div>
                  <StageBadge stage={idea.stage} />
                </div>
                {SCORE_CRITERIA.map(c => (
                  <div key={c.key} style={{ textAlign: "center" }}>
                    {sc?.[c.key] ? <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", color: scoreColor(sc[c.key]) }}>{sc[c.key]}</span> : <span style={{ color: T.border }}>—</span>}
                  </div>
                ))}
                <div style={{ textAlign: "center" }}>
                  {total ? <span style={{ background: scoreColor(total) + "15", color: scoreColor(total), border: `1.5px solid ${scoreColor(total)}25`, borderRadius: 8, padding: "3px 10px", fontWeight: 900, fontSize: 13, fontFamily: "monospace" }}>{total.toFixed(1)}</span> : <span style={{ color: T.border }}>—</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h2 style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>⚖️ Cara a cara</h2>
      <div style={{ color: T.textMute, fontSize: 13, marginBottom: 20 }}>Seleccioná dos ideas y que gane la mejor</div>

      {analyzed.length < 2 ? (
        <div style={{ textAlign: "center", padding: "44px", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, color: T.textMute }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚖️</div>Necesitás al menos 2 ideas analizadas
        </div>
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
            {[{ val: selA, set: setSelA, label: "Idea A", color: T.cobalt },
              { val: selB, set: setSelB, label: "Idea B", color: T.coral }].map(({ val, set, label, color }) => (
              <select key={label} value={val || ""} onChange={e => set(Number(e.target.value))}
                style={{ border: `2px solid ${color}35`, borderRadius: 10, padding: "10px 12px", fontSize: 13, color: T.text, background: color + "08", fontWeight: 600, cursor: "pointer", fontFamily: T.font }}>
                <option value="">— {label} —</option>
                {analyzed.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
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
                        {sc && <div style={{ textAlign: "right" }}>
                          <div style={{ color: scoreColor(sc), fontWeight: 900, fontSize: 30, fontFamily: "monospace", lineHeight: 1 }}>{sc.toFixed(1)}</div>
                          <div style={{ color: "#FFFFFF40", fontSize: 10, fontFamily: T.font, marginTop: 2 }}>{scoreLabel(sc)}</div>
                        </div>}
                      </div>
                    </div>
                    <div style={{ padding: "18px 20px", background: T.surface, display: "grid", gap: 10 }}>
                      {ia?.scores && (
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                          <RadarChart scores={ia.scores} size={160} />
                        </div>
                      )}
                      {SCORE_CRITERIA.map(c => {
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

// ── MAIN APP ──────────────────────────────────────────────────────
export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("board");
  const [tab, setTab] = useState("analysis");
  const [wizard, setWizard] = useState(false);
  const [pitchIdea, setPitchIdea] = useState(null);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const analyzeRef = useRef(false);

  useEffect(() => { loadIdeas(); }, []);

  const loadIdeas = async () => {
    setLoading(true);
    const { data } = await supabase.from("ideas").select("*").order("created_at", { ascending: false });
    if (data) { setIdeas(data); if (data.length > 0) setSelectedId(data[0].id); }
    setLoading(false);
  };

  const sel = ideas.find(i => i.id === selectedId);

  const saveIdea = async (draft) => {
    const { data, error } = await supabase.from("ideas")
      .insert([{ title: draft.title, description: draft.description, stage: draft.stage, comments: [], votes: [], analysis: null }])
      .select().single();
    if (!error && data) { setIdeas(p => [data, ...p]); setSelectedId(data.id); setWizard(false); setTab("vote"); setSidebarOpen(false); }
  };

  const updateIdea = async (id, patch) => {
    setIdeas(p => p.map(i => i.id === id ? { ...i, ...patch } : i));
    await supabase.from("ideas").update(patch).eq("id", id);
  };

  const deleteIdea = async (id) => {
    if (!window.confirm("¿Borrar esta idea?")) return;
    await supabase.from("ideas").delete().eq("id", id);
    const rest = ideas.filter(i => i.id !== id);
    setIdeas(rest); setSelectedId(rest[0]?.id || null);
  };

  const addVote = async (id, vote) => {
    const idea = ideas.find(i => i.id === id);
    await updateIdea(id, { votes: [...(idea.votes || []), vote] });
  };

  const addComment = async () => {
    if (!comment.trim() || !sel) return;
    const nc = { id: Date.now(), author: author.trim() || "Anónimo", text: comment.trim(), time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) };
    await updateIdea(selectedId, { comments: [...(sel.comments || []), nc] });
    setComment("");
  };

  const analyze = async () => {
    if (analyzeRef.current || analyzing || !sel) return;
    analyzeRef.current = true; setAnalyzing(true);
    const ideaId = sel.id;
    const prompt = `Analizá esta idea de negocio AI. Devolvé SOLO un objeto JSON válido. Sin markdown, sin texto extra, sin backticks. Empezá con { y terminá con }.

IDEA: ${sel.title}
DESCRIPCIÓN: ${sel.description}

PREGUNTA CLAVE: ¿Alguien paga dinero real por resolver esto hoy?

El veredicto tiene que sonar como Kevin O'Leary pero rioplatense: directo, sarcástico, sin filtro. Ejemplo: "Este modelo tiene el moat de una hoja de papel mojada."

ESTRUCTURA EXACTA (respetá todos los campos):
{
  "pagaHoy": "sí/no, quién, cuánto aproximadamente",
  "publicObj": "cliente objetivo y cuánto paga actualmente",
  "diferencial": "ventaja real y por qué no se copia fácil",
  "benchmark": "competidores reales y diferenciación concreta",
  "stack": "stack técnico concreto y específico",
  "pros": ["pro concreto 1", "pro concreto 2", "pro concreto 3"],
  "cons": ["con concreto 1", "con concreto 2", "con concreto 3"],
  "veredicto": "una línea brutal, directa y con algo de humor sarcástico",
  "mayorRiesgo": "el riesgo principal que puede matar este proyecto",
  "monetizacion": [
    { "modelo": "nombre", "descripcion": "descripción corta", "pros": "ventaja principal", "contras": "desventaja principal", "mrrEstimado": "rango USD" },
    { "modelo": "nombre", "descripcion": "descripción corta", "pros": "ventaja principal", "contras": "desventaja principal", "mrrEstimado": "rango USD" },
    { "modelo": "nombre", "descripcion": "descripción corta", "pros": "ventaja principal", "contras": "desventaja principal", "mrrEstimado": "rango USD" }
  ],
  "publicidad": {
    "organico": "canales orgánicos concretos",
    "pago": "cuándo y si vale publicidad paga",
    "recomendacion": "orgánico vs pago con justificación"
  },
  "gtm90dias": "plan 90 días en exactamente 3 frases separadas por punto. Una por mes.",
  "riesgoLegal": "riesgos regulatorios específicos del mercado LATAM",
  "primeros30dias": "3 acciones concretas antes de escribir una línea de código",
  "scoreRationale": {
    "traccion": "justificación en 1 línea",
    "moat": "justificación en 1 línea",
    "monetizacion": "justificación en 1 línea",
    "velocidad": "justificación en 1 línea",
    "mercado": "justificación en 1 línea"
  },
  "scores": { "traccion": 0, "moat": 0, "monetizacion": 0, "velocidad": 0, "mercado": 0 }
}`;

    try {
      const res = await fetch("/api/shark", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      let jsonText = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      const fb = jsonText.indexOf("{"), lb = jsonText.lastIndexOf("}");
      if (fb !== -1 && lb !== -1) jsonText = jsonText.slice(fb, lb + 1);
      const parsed = JSON.parse(jsonText);
      const avgScore = Object.values(parsed.scores).reduce((a, b) => a + b, 0) / 5;
      setIdeas(p => p.map(i => i.id === ideaId ? { ...i, analysis: { ...parsed, avgScore } } : i));
      await supabase.from("ideas").update({ analysis: { ...parsed, avgScore } }).eq("id", ideaId);
    } catch (err) {
      setIdeas(p => p.map(i => i.id === ideaId ? { ...i, analysis: { error: true, msg: err.message } } : i));
      await supabase.from("ideas").update({ analysis: { error: true, msg: err.message } }).eq("id", ideaId);
    }
    analyzeRef.current = false; setAnalyzing(false);
  };

  const exportPrompt = (idea, a) => {
    const score = a.avgScore?.toFixed(1) || "N/A";
    const md = `# Prompt de Construccion — ${idea.title}\n\n> Score: ${score}/10 · ${scoreLabel(parseFloat(score))}\n\n## CONTEXTO\n**Idea:** ${idea.title}\n**Descripcion:** ${idea.description}\n**Stack:** ${a.stack || "N/A"}\n**Publico:** ${a.publicObj || "N/A"}\n**Diferencial:** ${a.diferencial || "N/A"}\n**Mayor riesgo:** ${a.mayorRiesgo || "N/A"}\n\n## PROS\n${(a.pros || []).map(p => "- " + p).join("\n")}\n\n## CONS\n${(a.cons || []).map(c => "- " + c).join("\n")}\n\n## MONETIZACION PRIMARIA\n${a.monetizacion?.[0] ? a.monetizacion[0].modelo + ": " + a.monetizacion[0].descripcion + " (MRR: " + a.monetizacion[0].mrrEstimado + ")" : "N/A"}\n\n## PRIMEROS 30 DIAS\n${a.primeros30dias || "N/A"}\n\n## MISION\nSos un experto en producto digital y AI. Construi este producto paso a paso:\n\n**PASO 1 — Validacion (sem 1-2):** Define las 3 preguntas criticas y como pre-vender.\n**PASO 2 — MVP (sem 3-6):** Feature minima, estructura del proyecto, genera codigo del core.\n**PASO 3 — Primeros clientes (mes 2-3):** Como conseguir los primeros 10 pagos.\n**PASO 4 — Escala (mes 4+):** Cuando encontraste PMF y que feature sigue.\n\nRestricciones: Sin codigo propio, stack AI-first, mercado LATAM, monetizacion desde dia 1.\n\nEmpeza por PASO 1 y espera mi confirmacion.`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prompt-${idea.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const a = sel?.analysis;
  const selScore = a?.avgScore;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const TABS = [
    { key: "vote", label: "🗳️ Votar" },
    { key: "analysis", label: "🦈 Análisis" },
    { key: "monetizacion", label: "💰 Modelo" },
    { key: "gtm", label: "🚀 GTM" },
    { key: "comments", label: `💬${sel?.comments?.length ? ` ${sel.comments.length}` : ""}` },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ animation: "spin 3s linear infinite", display: "inline-block" }}><SharkLogo size={68} /></div>
        <div style={{ color: T.textMid, fontWeight: 600, marginTop: 20, fontSize: 14 }}>Cargando Shark Board...</div>
      </div>
    </div>
  );

  if (!loading && ideas.length === 0 && !wizard) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font, padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ marginBottom: 26 }}><SharkLogo size={84} /></div>
        <h1 style={{ margin: "0 0 10px", fontSize: 46, fontWeight: 700, color: T.text, letterSpacing: "-1.5px", fontFamily: T.fontDisplay, lineHeight: 1.1 }}>Shark Board</h1>
        <p style={{ color: T.textMid, fontSize: 16, lineHeight: 1.75, marginBottom: 42 }}>
          Tirá tus ideas de negocio AI.<br />El Shark las analiza sin filtro — y sin piedad.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 42 }}>
          {[["🦈", "Análisis brutal"], ["📊", "Scoring sarcástico"], ["📋", "Pitch Deck"], ["🗳️", "Votación equipo"], ["⚖️", "Comparación"], ["⬇️", "Export prompt"]].map(([e, l]) => (
            <div key={l} style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 12px", textAlign: "center", boxShadow: "0 2px 8px #0000000a" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{e}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMid }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setWizard(true)}
          style={{ background: T.text, border: "none", borderRadius: 14, padding: "16px 40px", color: "#FFF", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: T.fontDisplay, letterSpacing: "-0.3px", boxShadow: `0 8px 28px ${T.text}22` }}>
          🦈 Tirar la primera idea
        </button>
      </div>
      {wizard && <Wizard onSave={saveIdea} onClose={() => setWizard(false)} />}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #D0CCC4; border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: #A8A49E; }
        button { transition: opacity 0.12s, transform 0.1s; font-family: inherit; }
        button:active { opacity: 0.82; transform: scale(0.98); }
        textarea { resize: vertical; font-family: inherit; }
        select { appearance: auto; font-family: inherit; }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.93); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* TOP BAR */}
      <div style={{ background: T.surface, borderBottom: `1.5px solid ${T.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, height: 62, boxShadow: "0 1px 6px #0000000a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isMobile && <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: T.text, padding: "4px" }}>☰</button>}
          <SharkLogo size={38} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.5px", fontFamily: T.fontDisplay, lineHeight: 1.2 }}>Shark Board</div>
            <div style={{ color: T.textMute, fontSize: 11 }}>{ideas.length} ideas · {ideas.filter(i => i.analysis && !i.analysis.error).length} analizadas</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setView(v => v === "board" ? "ranking" : "board")}
            style={{ background: view === "ranking" ? T.text : T.bg, color: view === "ranking" ? "#FFF" : T.textMid, border: `1.5px solid ${view === "ranking" ? T.text : T.border}`, borderRadius: 10, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
            {view === "ranking" ? "← Board" : "📊 Comparar"}
          </button>
          <button onClick={() => setWizard(true)}
            style={{ background: T.text, border: "none", borderRadius: 10, padding: "8px 18px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: `0 3px 10px ${T.text}20` }}>
            + Idea
          </button>
        </div>
      </div>

      {view === "ranking" && <div style={{ maxWidth: 1000, margin: "0 auto" }}><Comparador ideas={ideas} /></div>}

      {view === "board" && (
        <div style={{ display: "flex", height: "calc(100vh - 62px)", position: "relative" }}>
          {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#00000044", zIndex: 40 }} />}

          {/* SIDEBAR */}
          <div style={{ width: 268, flexShrink: 0, background: T.surface, borderRight: `1.5px solid ${T.border}`,
            overflowY: "auto", padding: "10px 10px", display: "flex", flexDirection: "column", gap: 4,
            ...(isMobile ? { position: "fixed", left: sidebarOpen ? 0 : -272, top: 62, height: "calc(100vh - 62px)", zIndex: 45, transition: "left 0.25s cubic-bezier(.4,0,.2,1)" } : {}) }}>
            <div style={{ padding: "6px 8px 10px", color: T.textMute, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px" }}>
              Ideas · {ideas.length}
            </div>
            {ideas.map(idea => {
              const isSelected = idea.id === selectedId;
              const stg = STAGES.find(x => x.key === idea.stage) || STAGES[0];
              const score = idea.analysis?.avgScore;
              const sc = score ? scoreColor(score) : null;
              const isAnalyzingThis = analyzing && selectedId === idea.id;
              const voteCount = (idea.votes || []).length;
              const upVotes = (idea.votes || []).filter(v => v.vote === "up").length;
              return (
                <div key={idea.id} onClick={() => { setSelectedId(idea.id); setTab("analysis"); setSidebarOpen(false); }}
                  style={{ border: `1.5px solid ${isSelected ? T.text : T.border}`, borderRadius: 12, padding: "11px 13px", cursor: "pointer",
                    background: isSelected ? T.text : T.surface, transition: "all 0.15s",
                    boxShadow: isSelected ? `0 4px 16px ${T.text}18` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ background: isSelected ? "#FFFFFF18" : stg.bg, color: isSelected ? "#FFFFFF80" : stg.color, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "2px 8px" }}>{stg.emoji} {stg.label}</span>
                    {isAnalyzingThis ? (
                      <span style={{ fontSize: 10, color: isSelected ? "#FFFFFF50" : T.textMute, fontWeight: 700, animation: "pulse 1.5s infinite" }}>analizando...</span>
                    ) : sc ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 9, color: isSelected ? "#FFFFFF50" : sc, fontWeight: 700 }}>{scoreLabel(score)}</span>
                        <span style={{ background: isSelected ? "#FFFFFF18" : sc + "15", color: isSelected ? "#FFF" : sc, borderRadius: 6, padding: "1px 6px", fontWeight: 800, fontSize: 12, fontFamily: "monospace" }}>{score.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 10, color: isSelected ? "#FFFFFF25" : T.border, fontWeight: 600 }}>sin análisis</span>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: isSelected ? "#FFF" : T.text, lineHeight: 1.3, marginBottom: 4 }}>{idea.title}</div>
                  <div style={{ color: isSelected ? "#FFFFFF45" : T.textMute, fontSize: 11, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: voteCount ? 7 : 0 }}>{idea.description}</div>
                  {voteCount > 0 && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: isSelected ? "#FFFFFF55" : T.mint, background: isSelected ? "#FFFFFF10" : T.mintLight, borderRadius: 20, padding: "1px 7px" }}>👍 {upVotes}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: isSelected ? "#FFFFFF55" : T.coral, background: isSelected ? "#FFFFFF10" : T.coralLight, borderRadius: 20, padding: "1px 7px" }}>👎 {voteCount - upVotes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* MAIN */}
          {sel ? (
            <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
              <div style={{ background: T.surface, borderBottom: `1.5px solid ${T.border}`, padding: "18px 24px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, flexWrap: "wrap" }}>
                      <StageBadge stage={sel.stage} />
                      <select value={sel.stage} onChange={e => updateIdea(selectedId, { stage: e.target.value })}
                        style={{ border: `1px solid ${T.border}`, borderRadius: 8, padding: "3px 8px", fontSize: 11, color: T.textMid, background: T.bg, cursor: "pointer" }}>
                        {STAGES.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                      </select>
                    </div>
                    <h1 style={{ margin: "0 0 7px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: T.text, lineHeight: 1.3, fontFamily: T.fontDisplay }}>{sel.title}</h1>
                    <p style={{ margin: 0, color: T.textMid, fontSize: 13, lineHeight: 1.65 }}>{sel.description}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, marginLeft: 18, flexShrink: 0 }}>
                    {selScore ? (
                      <div style={{ textAlign: "center", background: T.text, borderRadius: 14, padding: "12px 18px", minWidth: 80 }}>
                        <div style={{ fontSize: 9, color: "#FFFFFF35", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>SCORE</div>
                        <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "monospace", color: scoreColor(selScore), lineHeight: 1.1, margin: "3px 0" }}>{selScore.toFixed(1)}</div>
                        <div style={{ fontSize: 10, color: scoreColor(selScore), fontWeight: 700 }}>{scoreLabel(selScore)}</div>
                      </div>
                    ) : null}
                    <div style={{ display: "flex", gap: 6 }}>
                      {a && !a.error && (
                        <button onClick={() => setPitchIdea(sel)}
                          style={{ background: T.text, border: "none", borderRadius: 8, padding: "7px 13px", color: "#FFF", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>📋 Pitch</button>
                      )}
                      <button onClick={() => deleteIdea(sel.id)}
                        style={{ background: T.coralLight, border: `1px solid ${T.coral}18`, borderRadius: 8, padding: "7px 11px", color: T.coral, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", overflowX: "auto", gap: 2 }}>
                  {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                      style={{ border: "none", background: tab === t.key ? T.bg : "transparent",
                        borderBottom: `3px solid ${tab === t.key ? T.text : "transparent"}`,
                        borderRadius: "8px 8px 0 0", color: tab === t.key ? T.text : T.textMute,
                        padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
                        marginBottom: -1, whiteSpace: "nowrap", transition: "all 0.15s" }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "24px 20px", animation: "fadeUp 0.2s ease" }}>

                {tab === "vote" && (
                  <div>
                    <VotingPanel idea={sel} onVote={addVote} />
                    <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "22px", textAlign: "center" }}>
                      <div style={{ fontSize: 17, color: T.text, fontWeight: 700, marginBottom: 7, fontFamily: T.fontDisplay }}>🦈 ¿Listo para el veredicto?</div>
                      <div style={{ fontSize: 13, color: T.textMid, marginBottom: 20 }}>Votá primero para no contaminar tu juicio</div>
                      <button onClick={() => setTab("analysis")}
                        style={{ background: T.text, border: "none", borderRadius: 10, padding: "11px 26px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Ver qué dice el Shark →</button>
                    </div>
                  </div>
                )}

                {tab === "analysis" && (
                  <div>
                    {!a && !analyzing && (
                      <div style={{ textAlign: "center", padding: "72px 20px", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 20, boxShadow: "0 4px 20px #0000000a" }}>
                        <SharkLogo size={68} />
                        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10, marginTop: 22, fontFamily: T.fontDisplay, color: T.text }}>Que el Shark hable</div>
                        <div style={{ color: T.textMid, fontSize: 14, marginBottom: 34, maxWidth: 360, margin: "10px auto 34px", lineHeight: 1.7 }}>
                          Scoring calibrado · Monetización · GTM · Riesgo legal · Veredicto sin anestesia
                        </div>
                        <button onClick={analyze}
                          style={{ background: T.text, border: "none", borderRadius: 14, padding: "15px 38px", color: "#FFF", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: T.fontDisplay, letterSpacing: "-0.3px", boxShadow: `0 8px 24px ${T.text}22` }}>
                          🦈 Analizar esta idea
                        </button>
                      </div>
                    )}

                    {analyzing && (
                      <div style={{ textAlign: "center", padding: "80px 20px", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 20 }}>
                        <div style={{ animation: "pulse 1.6s ease-in-out infinite", display: "inline-block" }}>
                          <SharkLogo size={68} />
                        </div>
                        <div style={{ color: T.text, fontWeight: 700, fontSize: 20, marginTop: 24, fontFamily: T.fontDisplay }}>El Shark está pensando...</div>
                        <div style={{ color: T.textMute, fontSize: 13, marginTop: 8, marginBottom: 26 }}>No lo toques. Esto tarda unos segundos.</div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
                          {SCORE_CRITERIA.map((c, i) => (
                            <span key={c.key} style={{ fontSize: 11, color: T.textMid, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "4px 12px", fontWeight: 600, animation: `pulse 1.5s ${i * 0.2}s infinite` }}>
                              {c.icon} {c.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {a && !analyzing && (
                      a.error ? (
                        <div style={{ textAlign: "center", padding: "52px 20px", background: T.surface, border: `1.5px solid ${T.coral}25`, borderRadius: 20 }}>
                          <div style={{ fontSize: 42, marginBottom: 12 }}>😬</div>
                          <div style={{ color: T.coral, fontWeight: 700, fontSize: 17, marginBottom: 7, fontFamily: T.fontDisplay }}>Algo salió mal</div>
                          <div style={{ color: T.textMute, fontSize: 13, marginBottom: 22 }}>{a.msg || "El Shark está de mal humor. Intentá de nuevo."}</div>
                          <button onClick={() => { updateIdea(selectedId, { analysis: null }); setTimeout(analyze, 200); }}
                            style={{ background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 24px", color: T.text, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                            🔄 Reintentar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: 16, animation: "fadeUp 0.3s ease" }}>
                          <VerdictBanner score={a.avgScore} />

                          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
                            <Card title="🎯 Scoring detallado">
                              {a.pagaHoy && (
                                <div style={{ background: T.mintLight, border: `1.5px solid ${T.mint}22`, borderRadius: 10, padding: "10px 14px", marginBottom: 18 }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: T.mint, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>💸 ¿Pagan por esto hoy?</div>
                                  <p style={{ margin: 0, fontSize: 13, color: T.textMid, lineHeight: 1.5 }}>{a.pagaHoy}</p>
                                </div>
                              )}
                              {SCORE_CRITERIA.map(c => (
                                <ScoreBar key={c.key} icon={c.icon} label={c.label} value={a.scores?.[c.key]} rationale={a.scoreRationale?.[c.key]} />
                              ))}
                            </Card>
                            {a.scores && (
                              <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "18px", boxShadow: "0 2px 10px #0000000a" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, textAlign: "center" }}>Radar</div>
                                <RadarChart scores={a.scores} size={172} />
                              </div>
                            )}
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="👥 Público objetivo"><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.65 }}>{a.publicObj}</p></Card>
                            <Card title="🔍 Benchmark"><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.65 }}>{a.benchmark}</p></Card>
                          </div>
                          <Card title="✨ Diferencial"><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.7 }}>{a.diferencial}</p></Card>
                          <Card title="⚙️ Stack técnico">
                            <p style={{ margin: 0, color: T.text, fontSize: 13, fontFamily: "monospace", background: T.bg, borderRadius: 8, padding: "12px 14px", lineHeight: 1.7, border: `1px solid ${T.border}` }}>{a.stack}</p>
                          </Card>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="✅ Pros" accent={T.mint}>
                              <ul style={{ margin: 0, paddingLeft: 18 }}>{a.pros?.map((p, i) => <li key={i} style={{ color: T.mint, fontSize: 14, marginBottom: 7, lineHeight: 1.5 }}><span style={{ color: T.textMid }}>{p}</span></li>)}</ul>
                            </Card>
                            <Card title="⚠️ Cons" accent={T.coral}>
                              <ul style={{ margin: 0, paddingLeft: 18 }}>{a.cons?.map((c, i) => <li key={i} style={{ color: T.coral, fontSize: 14, marginBottom: 7, lineHeight: 1.5 }}><span style={{ color: T.textMid }}>{c}</span></li>)}</ul>
                            </Card>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="☠️ Mayor riesgo" accent={T.amber}><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.65 }}>{a.mayorRiesgo}</p></Card>
                            <Card title="⚖️ Riesgo legal" accent={T.cobalt}><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.65 }}>{a.riesgoLegal}</p></Card>
                          </div>
                          <Card title="📅 Primeros 30 días"><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.7 }}>{a.primeros30dias}</p></Card>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                            <button onClick={() => exportPrompt(sel, a)}
                              style={{ background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 18px", color: T.text, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>⬇️ Exportar Prompt</button>
                            <button onClick={() => { updateIdea(selectedId, { analysis: null }); setTimeout(analyze, 200); }}
                              style={{ background: T.text, border: "none", borderRadius: 10, padding: "9px 18px", color: "#FFF", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>🔄 Re-analizar</button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {tab === "monetizacion" && (
                  !a ? <EmptyTab icon="💰" title="Nada que ver acá todavía" sub="Generá el análisis primero" onGo={() => setTab("analysis")} />
                  : (
                    <div style={{ display: "grid", gap: 14 }}>
                      {a.monetizacion?.map((m, i) => (
                        <div key={i} style={{ background: T.surface, border: `1.5px solid ${i === 0 ? T.text + "18" : T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: i === 0 ? "0 6px 24px #00000010" : "none" }}>
                          <div style={{ background: i === 0 ? T.text : T.bg, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <span style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? "#FFFFFF35" : T.textMute, textTransform: "uppercase", letterSpacing: "0.5px" }}>Opción {i + 1}{i === 0 ? " · Recomendada" : ""}</span>
                              <div style={{ fontWeight: 700, fontSize: 16, color: i === 0 ? "#FFF" : T.text, marginTop: 2, fontFamily: T.fontDisplay }}>{m.modelo}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 10, color: i === 0 ? "#FFFFFF35" : T.textMute, marginBottom: 2 }}>MRR est.</div>
                              <div style={{ fontWeight: 800, fontSize: 15, color: T.mint, fontFamily: "monospace" }}>{m.mrrEstimado}</div>
                            </div>
                          </div>
                          <div style={{ padding: "16px 22px", display: "grid", gap: 10 }}>
                            <p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.65 }}>{m.descripcion}</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                              {[{ label: "✅ PROS", text: m.pros, bg: T.mintLight, color: T.mint },
                                { label: "⚠️ CONTRAS", text: m.contras, bg: T.coralLight, color: T.coral }].map(({ label, text, bg, color }) => (
                                <div key={label} style={{ background: bg, borderRadius: 10, padding: "10px 14px" }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                                  <p style={{ margin: 0, fontSize: 13, color: T.textMid, lineHeight: 1.5 }}>{text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      {a.publicidad && (
                        <Card title="📣 Estrategia de adquisición">
                          <div style={{ display: "grid", gap: 10 }}>
                            {[{ label: "🌱 ORGÁNICO", text: a.publicidad.organico, bg: T.mintLight, color: T.mint },
                              { label: "💸 PUBLICIDAD PAGA", text: a.publicidad.pago, bg: T.cobaltLight, color: T.cobalt },
                              { label: "🦈 DICE EL SHARK", text: a.publicidad.recomendacion, bg: T.bg, color: T.text, bold: true }].map(({ label, text, bg, color, bold }) => (
                              <div key={label} style={{ background: bg, borderRadius: 10, padding: "12px 16px", border: bold ? `1.5px solid ${T.border}` : "none" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                                <p style={{ margin: 0, fontSize: 14, color: T.textMid, lineHeight: 1.6, fontWeight: bold ? 600 : 400 }}>{text}</p>
                              </div>
                            ))}
                          </div>
                        </Card>
                      )}
                    </div>
                  )
                )}

                {tab === "gtm" && (
                  !a ? <EmptyTab icon="🚀" title="Sin plan todavía" sub="Generá el análisis primero" onGo={() => setTab("analysis")} />
                  : (
                    <div style={{ display: "grid", gap: 16 }}>
                      <Card title="🚀 Go-to-Market · Primeros 90 días" accent={T.cobalt}>
                        <TimelineGTM gtm90dias={a.gtm90dias} />
                      </Card>
                      <Card title="📅 Primeros 30 días (antes de escribir código)" accent={T.coral}>
                        <p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.7 }}>{a.primeros30dias}</p>
                      </Card>
                      <Card title="⚖️ Riesgo legal y regulatorio" accent={T.amber}>
                        <p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.7 }}>{a.riesgoLegal}</p>
                      </Card>
                    </div>
                  )
                )}

                {tab === "comments" && (
                  <div>
                    <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "18px 22px", marginBottom: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, color: T.text, fontFamily: T.fontDisplay }}>Agregar comentario</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[{ val: author, set: setAuthor, ph: "Tu nombre" }, { val: comment, set: setComment, ph: "Tu punto de vista (sin filtro)" }].map(({ val, set, ph }, i) => (
                          <input key={ph} value={val} onChange={e => set(e.target.value)}
                            onKeyDown={e => i === 1 && e.key === "Enter" && addComment()}
                            placeholder={ph}
                            style={{ border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", color: T.text, background: T.bg }} />
                        ))}
                        <button onClick={addComment}
                          style={{ background: T.text, border: "none", borderRadius: 10, padding: "11px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Enviar</button>
                      </div>
                    </div>
                    {!sel.comments?.length ? (
                      <div style={{ textAlign: "center", padding: "44px", color: T.textMute, background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}` }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
                        <div style={{ fontWeight: 600, color: T.textMid, marginBottom: 4, fontFamily: T.fontDisplay }}>Nadie dijo nada todavía</div>
                        <div style={{ fontSize: 12 }}>Sé el primero en opinar</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {sel.comments.map(c => (
                          <div key={c.id} style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "14px 18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                              <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{c.author}</span>
                              <span style={{ fontSize: 11, color: T.textMute }}>{c.time}</span>
                            </div>
                            <p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.6 }}>{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: T.textMute }}>
                <SharkLogo size={58} />
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6, marginTop: 20, color: T.textMid, fontFamily: T.fontDisplay }}>Seleccioná una idea</div>
                <div style={{ fontSize: 13 }}>o agregá una con + Idea</div>
              </div>
            </div>
          )}
        </div>
      )}

      {wizard && <Wizard onSave={saveIdea} onClose={() => setWizard(false)} />}
      {pitchIdea && <PitchDeckModal idea={pitchIdea} analysis={pitchIdea.analysis} onClose={() => setPitchIdea(null)} />}
    </div>
  );
}
