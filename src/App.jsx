import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://nolbcladiwwfaoxjjlmq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbGJjbGFkaXd3ZmFveGpqbG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODg0ODEsImV4cCI6MjA4ODY2NDQ4MX0.fjIqBUf30qZbNcBv8gCCwXA57Wf4kGqtygcUF919Gh8"
);

const STAGES = [
  { key: "idea", label: "Idea", emoji: "💡", bg: "#ede9fe", color: "#7c3aed" },
  { key: "validando", label: "Validando", emoji: "🔍", bg: "#fef3c7", color: "#d97706" },
  { key: "construyendo", label: "Construyendo", emoji: "🔨", bg: "#dbeafe", color: "#2563eb" },
  { key: "lanzado", label: "Lanzado", emoji: "🚀", bg: "#d1fae5", color: "#059669" },
];

const WIZARD_STEPS = [
  { key: "title", label: "La idea", emoji: "💡", desc: "Dale un nombre claro. ej: 'App de turnos con AI para clínicas'" },
  { key: "problem", label: "El problema", emoji: "🎯", desc: "¿Qué dolor resuelve? ¿Quién lo sufre? ¿Cómo lo resuelven hoy sin tu producto?" },
  { key: "stage", label: "Estado actual", emoji: "📍", desc: "¿En qué etapa está la idea?" },
];

const SCORE_CRITERIA = [
  { key: "traccion", label: "Tracción potencial", icon: "📈" },
  { key: "moat", label: "Moat defensible", icon: "🏰" },
  { key: "monetizacion", label: "Monetización clara", icon: "💰" },
  { key: "velocidad", label: "Velocidad validación", icon: "⚡" },
  { key: "mercado", label: "Tamaño de mercado", icon: "🌍" },
];

const scoreLabel = (s) => s >= 8.5 ? "Excepcional" : s >= 7.5 ? "Muy fuerte" : s >= 6.5 ? "Sólido" : s >= 5.5 ? "Promedio" : "Débil";

function avg(scores) {
  if (!scores) return null;
  const vals = Object.values(scores).filter(v => v > 0);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function scoreColor(s) {
  return s >= 7.5 ? "#059669" : s >= 5.5 ? "#d97706" : "#dc2626";
}

// ── SVG LOGO ─────────────────────────────────────────────────────
function SharkLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="url(#sg)" />
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path d="M6 24 C8 18, 14 15, 22 16 L28 14 L24 19 C28 19, 32 21, 34 24 C30 23, 26 22, 22 23 L20 27 L18 23 C14 23, 10 23, 6 24Z" fill="white" opacity="0.95" />
      <path d="M18 16 L22 10 L26 16" fill="white" opacity="0.85" />
      <circle cx="27" cy="21" r="1.2" fill="#6366f1" />
      <path d="M6 24 L3 20 M6 24 L3 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

// ── PRIMITIVES ────────────────────────────────────────────────────
function ScoreBar({ label, value, icon, rationale }) {
  if (!value) return null;
  const c = scoreColor(value);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{icon} {label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: c, fontWeight: 700, background: c + "15", borderRadius: 4, padding: "1px 6px" }}>{scoreLabel(value)}</span>
          <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: c }}>{value}/10</span>
        </div>
      </div>
      <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: 6, background: `linear-gradient(90deg, ${c}99, ${c})`, borderRadius: 99, width: `${value * 10}%`, transition: "width 0.7s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      {rationale && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 5, fontStyle: "italic", lineHeight: 1.4, paddingLeft: 2 }}>{rationale}</div>}
    </div>
  );
}

function StageBadge({ stage }) {
  const s = STAGES.find(x => x.key === stage) || STAGES[0];
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 9px" }}>{s.emoji} {s.label}</span>;
}

function Card({ title, children, accent, noPad }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${accent ? accent + "30" : "#e5e7eb"}`, borderRadius: 12, padding: noPad ? 0 : "18px 22px", borderLeft: accent ? `4px solid ${accent}` : undefined, overflow: "hidden" }}>
      {title && <div style={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.7px", ...(noPad ? { padding: "16px 22px 0" } : {}) }}>{title}</div>}
      {children}
    </div>
  );
}

function Verdict({ score }) {
  if (!score) return null;
  const c = scoreColor(score);
  const label = score >= 7.5 ? "INVERTIRÍA" : score >= 5.5 ? "NECESITA PIVOTE" : "PASS";
  const emoji = score >= 7.5 ? "🟢" : score >= 5.5 ? "🟡" : "🔴";
  const sub = score >= 7.5 ? "Potencial real. A construir." : score >= 5.5 ? "Hay algo acá, pero necesita ajustes." : "No vale el esfuerzo ahora.";
  return (
    <div style={{ background: `linear-gradient(135deg, ${c}10, ${c}05)`, border: `2px solid ${c}30`, borderRadius: 16, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>Veredicto del Shark</div>
        <div style={{ fontWeight: 900, fontSize: 22, color: c }}>{emoji} {label}</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 5, fontStyle: "italic" }}>{sub}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "monospace", color: c, lineHeight: 1 }}>{score.toFixed(1)}</div>
        <div style={{ fontSize: 11, color: scoreColor(score), fontWeight: 700, background: scoreColor(score) + "15", borderRadius: 4, padding: "2px 8px", marginTop: 4 }}>{scoreLabel(score)}</div>
      </div>
    </div>
  );
}

function EmptyAnalysis({ tab, onGo }) {
  const icons = { monetizacion: "💰", gtm: "🚀" };
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb" }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>{icons[tab] || "🦈"}</div>
      <div style={{ fontWeight: 800, color: "#111827", marginBottom: 6, fontSize: 16 }}>Sin análisis todavía</div>
      <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 20 }}>Generá el análisis del Shark primero</div>
      <button onClick={onGo} style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 10, padding: "11px 22px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🦈 Ir al análisis</button>
    </div>
  );
}

// ── VOTACIÓN ─────────────────────────────────────────────────────
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
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ background: "linear-gradient(135deg, #f5f3ff, #eff6ff)", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 3 }}>🗳️ Votación del equipo</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>Votá antes de ver el análisis para no contaminar tu juicio</div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        {votes.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#059669", lineHeight: 1 }}>👍 {ups}</div>
                <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, marginTop: 4 }}>A favor</div>
              </div>
              <div style={{ flex: 1, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#dc2626", lineHeight: 1 }}>👎 {downs}</div>
                <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 700, marginTop: 4 }}>En contra</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {votes.map((v, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", borderRadius: 8, padding: "8px 12px" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{v.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{v.vote === "up" ? "👍" : "👎"}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{v.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!voted ? (
          <div>
            <input value={voterName} onChange={e => setVoterName(e.target.value)} placeholder="Tu nombre para votar"
              style={{ border: "1.5px solid #e5e7eb", borderRadius: 9, padding: "10px 14px", fontSize: 13, outline: "none", color: "#111827", width: "100%", boxSizing: "border-box", marginBottom: 10 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleVote("up")} disabled={!voterName.trim()}
                style={{ flex: 1, background: voterName.trim() ? "#f0fdf4" : "#f9fafb", border: `2px solid ${voterName.trim() ? "#86efac" : "#e5e7eb"}`, borderRadius: 10, padding: "12px", color: voterName.trim() ? "#059669" : "#9ca3af", fontWeight: 800, fontSize: 15, cursor: voterName.trim() ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                👍 Apoyo
              </button>
              <button onClick={() => handleVote("down")} disabled={!voterName.trim()}
                style={{ flex: 1, background: voterName.trim() ? "#fef2f2" : "#f9fafb", border: `2px solid ${voterName.trim() ? "#fca5a5" : "#e5e7eb"}`, borderRadius: 10, padding: "12px", color: voterName.trim() ? "#dc2626" : "#9ca3af", fontWeight: 800, fontSize: 15, cursor: voterName.trim() ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                👎 Paso
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: 10, padding: "14px", textAlign: "center", color: "#7c3aed", fontWeight: 700, fontSize: 13 }}>
            ✅ Voto registrado
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
  const stg = STAGES.find(x => x.key === idea.stage) || STAGES[0];

  const slides = [
    {
      num: "01", title: "El Problema", color: "#dc2626", bg: "#fef2f2", border: "#fecaca",
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151", margin: 0 }}>{idea.description}</p>
          <div style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 6, textTransform: "uppercase" }}>💸 ¿Pagan por resolverlo hoy?</div>
            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{a?.pagaHoy || "Sin datos"}</p>
          </div>
        </div>
      )
    },
    {
      num: "02", title: "La Solución", color: "#6366f1", bg: "#f5f3ff", border: "#c7d2fe",
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151", margin: 0 }}>{a?.diferencial}</p>
          <div style={{ background: "#fff", border: "1px solid #c7d2fe", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", marginBottom: 6, textTransform: "uppercase" }}>⚙️ Stack técnico</div>
            <p style={{ margin: 0, fontSize: 13, color: "#374151", fontFamily: "monospace", lineHeight: 1.6 }}>{a?.stack}</p>
          </div>
        </div>
      )
    },
    {
      num: "03", title: "Mercado", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0",
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 6, textTransform: "uppercase" }}>👥 Cliente</div>
              <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{a?.publicObj}</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 6, textTransform: "uppercase" }}>🔍 Benchmark</div>
              <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{a?.benchmark}</p>
            </div>
          </div>
          {score && (
            <div style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 10, padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: "#374151" }}>Score Shark Board</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: scoreColor(score), fontWeight: 700, background: scoreColor(score) + "15", borderRadius: 4, padding: "2px 8px" }}>{scoreLabel(score)}</span>
                <span style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: scoreColor(score) }}>{score.toFixed(1)}/10</span>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      num: "04", title: "Modelo de Negocio", color: "#d97706", bg: "#fffbeb", border: "#fcd34d",
      content: (
        <div style={{ display: "grid", gap: 10 }}>
          {a?.monetizacion?.map((m, i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${i === 0 ? "#fcd34d" : "#e5e7eb"}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{m.modelo}{i === 0 && <span style={{ marginLeft: 8, fontSize: 10, background: "#fef3c7", color: "#d97706", fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>RECOMENDADO</span>}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{m.descripcion}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>MRR est.</div>
                <div style={{ fontWeight: 800, color: "#059669", fontFamily: "monospace", fontSize: 13 }}>{m.mrrEstimado}</div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      num: "05", title: "Pros & Riesgos", color: "#7c3aed", bg: "#faf5ff", border: "#ede9fe",
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 11, color: "#059669", marginBottom: 8, textTransform: "uppercase" }}>✅ A favor</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {a?.pros?.map((p, i) => <div key={i} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{p}</div>)}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 11, color: "#dc2626", marginBottom: 8, textTransform: "uppercase" }}>⚠️ En contra</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {a?.cons?.map((c, i) => <div key={i} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{c}</div>)}
              <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#374151", lineHeight: 1.4 }}>
                <span style={{ fontWeight: 700 }}>☠️ Mayor riesgo: </span>{a?.mayorRiesgo}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: "06", title: "Plan de Acción", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe",
      content: (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ background: "#fff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 8, textTransform: "uppercase" }}>📅 Primeros 30 días</div>
            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{a?.primeros30dias}</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 8, textTransform: "uppercase" }}>🚀 GTM 90 días</div>
            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line" }}>{a?.gtm90dias}</p>
          </div>
        </div>
      )
    },
  ];

  const cur = slides[slide];

  const exportMd = () => {
    const sc = a?.avgScore?.toFixed(1) || "N/A";
    const md = `# 🦈 Pitch Deck — ${idea.title}\n> Shark Board · Score: ${sc}/10\n\n---\n\n## 01 · El Problema\n${idea.description}\n\n**¿Pagan hoy?** ${a?.pagaHoy || "Sin datos"}\n\n---\n\n## 02 · La Solución\n${a?.diferencial}\n\n**Stack:** ${a?.stack}\n\n---\n\n## 03 · Mercado\n**Cliente:** ${a?.publicObj}\n**Benchmark:** ${a?.benchmark}\n**Score Shark:** ${sc}/10\n\n---\n\n## 04 · Modelo de Negocio\n${(a?.monetizacion || []).map((m, i) => `**${i + 1}. ${m.modelo}**\n${m.descripcion}\nMRR estimado: ${m.mrrEstimado}`).join("\n\n")}\n\n---\n\n## 05 · Pros & Riesgos\n**Pros:**\n${(a?.pros || []).map(p => "- " + p).join("\n")}\n\n**Cons:**\n${(a?.cons || []).map(c => "- " + c).join("\n")}\n\n**Mayor riesgo:** ${a?.mayorRiesgo}\n\n---\n\n## 06 · Plan de Acción\n**Primeros 30 días:** ${a?.primeros30dias}\n\n**GTM 90 días:** ${a?.gtm90dias}\n`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pitch-${idea.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 400, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 680, maxHeight: "92vh", overflow: "hidden", boxShadow: "0 32px 80px #0007", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SharkLogo size={28} />
            <div>
              <div style={{ color: "#ffffffaa", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>PITCH DECK</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{idea.title}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#ffffffaa", fontSize: 12 }}>{slide + 1}/{slides.length}</span>
            <button onClick={onClose} style={{ background: "#ffffff22", border: "none", borderRadius: 7, color: "#fff", width: 30, height: 30, cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, padding: "10px 22px 0", justifyContent: "center" }}>
          {slides.map((s, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 28 : 8, height: 8, borderRadius: 99, background: i === slide ? "#6366f1" : i < slide ? "#a5b4fc" : "#e5e7eb", border: "none", cursor: "pointer", transition: "all 0.2s", padding: 0 }} />
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div style={{ background: cur.bg, border: `1px solid ${cur.border}`, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ background: cur.color, color: "#fff", borderRadius: 7, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>{cur.num}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>{cur.title}</div>
            </div>
            {cur.content}
          </div>
        </div>
        <div style={{ padding: "12px 22px 16px", display: "flex", gap: 8, borderTop: "1px solid #f3f4f6" }}>
          <button onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0}
            style={{ flex: 1, background: "#f3f4f6", border: "none", borderRadius: 10, padding: "11px", color: slide === 0 ? "#9ca3af" : "#374151", fontWeight: 700, fontSize: 13, cursor: slide === 0 ? "not-allowed" : "pointer" }}>← Anterior</button>
          <button onClick={exportMd} style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "11px 16px", color: "#059669", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>⬇️ .md</button>
          <button onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))} disabled={slide === slides.length - 1}
            style={{ flex: 1, background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 10, padding: "11px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: slide === slides.length - 1 ? "not-allowed" : "pointer" }}>Siguiente →</button>
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

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000066", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, boxShadow: "0 25px 60px #0005", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SharkLogo size={28} />
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Nueva Idea</span>
            </div>
            <button onClick={onClose} style={{ background: "#ffffff22", border: "none", borderRadius: 6, color: "#fff", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {WIZARD_STEPS.map((s, i) => (
              <div key={s.key} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= step ? "#fff" : "#ffffff33", transition: "background 0.3s" }} />
            ))}
          </div>
          <div style={{ marginTop: 8, color: "#ffffffcc", fontSize: 12 }}>Paso {step + 1} de {WIZARD_STEPS.length} · {WIZARD_STEPS[step].label}</div>
        </div>
        <div style={{ padding: "24px 24px 28px" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{WIZARD_STEPS[step].emoji}</div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 5, color: "#111827" }}>{WIZARD_STEPS[step].label}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>{WIZARD_STEPS[step].desc}</div>

          {step === 0 && (
            <input autoFocus value={data.title}
              onChange={e => setData(p => ({ ...p, title: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && canNext && setStep(1)}
              placeholder="ej: Liquidador de sueldos con AI para PYMEs"
              style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "13px 15px", fontSize: 14, outline: "none", color: "#111827", width: "100%", boxSizing: "border-box", transition: "border-color 0.15s" }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
          )}

          {step === 1 && (
            <textarea autoFocus value={data.description}
              onChange={e => setData(p => ({ ...p, description: e.target.value }))}
              placeholder="¿Qué dolor resuelve? ¿Quién lo sufre? ¿Cómo lo resuelven hoy?"
              rows={5}
              style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "13px 15px", fontSize: 14, outline: "none", color: "#111827", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, transition: "border-color 0.15s" }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
          )}

          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {STAGES.map(s => (
                <button key={s.key} onClick={() => setData(p => ({ ...p, stage: s.key }))} style={{
                  background: data.stage === s.key ? s.bg : "#f9fafb",
                  color: data.stage === s.key ? s.color : "#6b7280",
                  border: `2px solid ${data.stage === s.key ? s.color + "60" : "#e5e7eb"}`,
                  borderRadius: 10, padding: "14px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{s.emoji}</div>{s.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: "#f3f4f6", border: "none", borderRadius: 10, padding: "12px", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Atrás</button>
            )}
            {step < WIZARD_STEPS.length - 1 ? (
              <button onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext}
                style={{ flex: 2, background: canNext ? "linear-gradient(135deg, #6366f1, #a855f7)" : "#f3f4f6", border: "none", borderRadius: 10, padding: "12px", color: canNext ? "#fff" : "#9ca3af", fontWeight: 800, fontSize: 14, cursor: canNext ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                Siguiente →
              </button>
            ) : (
              <button onClick={() => onSave(data)}
                style={{ flex: 2, background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 10, padding: "12px", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                🦈 Agregar al board
              </button>
            )}
          </div>
          <div style={{ marginTop: 14, background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#7c3aed", textAlign: "center" }}>
            El Shark genera análisis completo automáticamente 🦈
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
    if (analyzed.length >= 2 && !selA && !selB) {
      setSelA(analyzed[0].id);
      setSelB(analyzed[1].id);
    }
  }, [analyzed.length]);

  const ideaA = ideas.find(i => i.id === selA);
  const ideaB = ideas.find(i => i.id === selB);

  return (
    <div style={{ padding: "20px 16px" }}>
      {/* Ranking */}
      <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4, color: "#111827" }}>📊 Ranking de Ideas</div>
      <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 18 }}>Ordenadas por score del Shark · {ideas.filter(i => i.analysis && !i.analysis.error).length} analizadas</div>
      <div style={{ overflowX: "auto", marginBottom: 36 }}>
        <div style={{ minWidth: 540 }}>
          <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 60px 60px 60px 60px 60px 86px", gap: 6, padding: "8px 14px", background: "#f3f4f6", borderRadius: 10, marginBottom: 6, fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <div>#</div><div>Idea</div>
            {SCORE_CRITERIA.map(c => <div key={c.key} style={{ textAlign: "center" }}>{c.icon}</div>)}
            <div style={{ textAlign: "center" }}>TOTAL</div>
          </div>
          {sorted.map((idea, idx) => {
            const sc = idea.analysis?.scores;
            const total = avg(sc);
            const stg = STAGES.find(x => x.key === idea.stage) || STAGES[0];
            return (
              <div key={idea.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr 60px 60px 60px 60px 60px 86px", gap: 6, padding: "12px 14px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 6, alignItems: "center", transition: "box-shadow 0.15s" }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span style={{ color: "#9ca3af", fontSize: 13 }}>{idx + 1}</span>}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 3 }}>{idea.title}</div>
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    <span style={{ background: stg.bg, color: stg.color, fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>{stg.emoji} {stg.label}</span>
                    {!idea.analysis && <span style={{ fontSize: 10, color: "#d1d5db", fontWeight: 600 }}>sin análisis</span>}
                  </div>
                </div>
                {SCORE_CRITERIA.map(c => (
                  <div key={c.key} style={{ textAlign: "center" }}>
                    {sc?.[c.key] ? <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: scoreColor(sc[c.key]) }}>{sc[c.key]}</span>
                      : <span style={{ color: "#d1d5db" }}>—</span>}
                  </div>
                ))}
                <div style={{ textAlign: "center" }}>
                  {total ? <span style={{ background: scoreColor(total) + "15", color: scoreColor(total), border: `1.5px solid ${scoreColor(total)}30`, borderRadius: 8, padding: "3px 10px", fontWeight: 900, fontSize: 14, fontFamily: "monospace" }}>{total.toFixed(1)}</span>
                    : <span style={{ color: "#d1d5db", fontSize: 13 }}>—</span>}
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>No hay ideas todavía
            </div>
          )}
        </div>
      </div>

      {/* Side by side */}
      <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4, color: "#111827" }}>⚖️ Comparación Directa</div>
      <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>Seleccioná dos ideas para comparar en detalle</div>

      {analyzed.length < 2 ? (
        <div style={{ textAlign: "center", padding: "36px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, color: "#9ca3af" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚖️</div>
          Necesitás al menos 2 ideas analizadas para comparar
        </div>
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <select value={selA || ""} onChange={e => setSelA(Number(e.target.value))}
              style={{ border: "2px solid #6366f1", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#374151", background: "#f5f3ff", fontWeight: 600, cursor: "pointer" }}>
              <option value="">— Idea A —</option>
              {analyzed.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
            </select>
            <select value={selB || ""} onChange={e => setSelB(Number(e.target.value))}
              style={{ border: "2px solid #a855f7", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#374151", background: "#faf5ff", fontWeight: 600, cursor: "pointer" }}>
              <option value="">— Idea B —</option>
              {analyzed.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
            </select>
          </div>

          {ideaA && ideaB && ideaA.id !== ideaB.id && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[{ idea: ideaA, col: 0 }, { idea: ideaB, col: 1 }].map(({ idea, col }) => {
                const a = idea.analysis;
                const score = a?.avgScore;
                const borderColor = col === 0 ? "#6366f1" : "#a855f7";
                return (
                  <div key={idea.id} style={{ border: `2px solid ${borderColor}25`, borderRadius: 16, overflow: "hidden", boxShadow: `0 4px 20px ${borderColor}10` }}>
                    <div style={{ background: col === 0 ? "linear-gradient(135deg, #6366f1, #818cf8)" : "linear-gradient(135deg, #a855f7, #c084fc)", padding: "16px 18px" }}>
                      <div style={{ color: "#ffffffcc", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>Idea {col === 0 ? "A" : "B"}</div>
                      <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.3, marginBottom: 10 }}>{idea.title}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <StageBadge stage={idea.stage} />
                        {score && (
                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#fff", fontWeight: 900, fontSize: 26, fontFamily: "monospace", lineHeight: 1 }}>{score.toFixed(1)}</div>
                            <div style={{ color: "#ffffffaa", fontSize: 10 }}>{scoreLabel(score)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ padding: "16px", background: "#fff", display: "grid", gap: 8 }}>
                      {SCORE_CRITERIA.map(c => {
                        const val = a?.scores?.[c.key];
                        if (!val) return null;
                        return <ScoreBar key={c.key} icon={c.icon} label={c.label} value={val} />;
                      })}
                      {a?.veredicto && (
                        <div style={{ background: "#f9fafb", borderRadius: 9, padding: "10px 12px", marginTop: 4 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", marginBottom: 4, textTransform: "uppercase" }}>Veredicto</div>
                          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5, fontStyle: "italic" }}>"{a.veredicto}"</p>
                        </div>
                      )}
                      {a?.mayorRiesgo && (
                        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 9, padding: "10px 12px" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#d97706", marginBottom: 4, textTransform: "uppercase" }}>☠️ Mayor riesgo</div>
                          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{a.mayorRiesgo}</p>
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
    if (!error && data) {
      setIdeas(p => [data, ...p]);
      setSelectedId(data.id);
      setWizard(false);
      setTab("vote");
      setSidebarOpen(false);
    }
  };

  const updateIdea = async (id, patch) => {
    setIdeas(p => p.map(i => i.id === id ? { ...i, ...patch } : i));
    await supabase.from("ideas").update(patch).eq("id", id);
  };

  const deleteIdea = async (id) => {
    if (!window.confirm("¿Borrar esta idea?")) return;
    await supabase.from("ideas").delete().eq("id", id);
    const rest = ideas.filter(i => i.id !== id);
    setIdeas(rest);
    setSelectedId(rest[0]?.id || null);
  };

  const addVote = async (id, vote) => {
    const idea = ideas.find(i => i.id === id);
    const updated = [...(idea.votes || []), vote];
    await updateIdea(id, { votes: updated });
  };

  const addComment = async () => {
    if (!comment.trim() || !sel) return;
    const nc = { id: Date.now(), author: author.trim() || "Anónimo", text: comment.trim(), time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) };
    const updated = [...(sel.comments || []), nc];
    await updateIdea(selectedId, { comments: updated });
    setComment("");
  };

  const analyze = async () => {
    if (analyzeRef.current || analyzing || !sel) return;
    analyzeRef.current = true;
    setAnalyzing(true);

    const ideaId = sel.id;
    const prompt = `Analizá esta idea de negocio de AI y devolvé SOLO un objeto JSON válido. Sin texto extra, sin markdown, sin backticks. Empezá con { y terminá con }.

IDEA: ${sel.title}
DESCRIPCIÓN: ${sel.description}

PREGUNTA CLAVE: ¿Existe alguien pagando dinero real por resolver este problema hoy?

Estructura exacta requerida:
{
  "pagaHoy": "sí/no y quién paga qué monto aproximado hoy",
  "publicObj": "cliente objetivo y cuánto paga hoy",
  "diferencial": "ventaja competitiva real y por qué no se copia fácil",
  "benchmark": "competidores y diferenciación",
  "stack": "stack técnico concreto recomendado",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2", "con 3"],
  "veredicto": "una línea brutal y directa",
  "mayorRiesgo": "el riesgo número 1 que puede matar este proyecto",
  "monetizacion": [
    { "modelo": "nombre", "descripcion": "descripción", "pros": "ventaja", "contras": "desventaja", "mrrEstimado": "rango USD" },
    { "modelo": "nombre", "descripcion": "descripción", "pros": "ventaja", "contras": "desventaja", "mrrEstimado": "rango USD" },
    { "modelo": "nombre", "descripcion": "descripción", "pros": "ventaja", "contras": "desventaja", "mrrEstimado": "rango USD" }
  ],
  "publicidad": {
    "organico": "canales orgánicos recomendados",
    "pago": "si vale publicidad paga y cuándo",
    "recomendacion": "orgánico vs pago y por qué"
  },
  "gtm90dias": "plan go-to-market primeros 90 días",
  "riesgoLegal": "riesgos regulatorios específicos",
  "primeros30dias": "3 acciones concretas para validar antes de construir",
  "scoreRationale": {
    "traccion": "justificación 1 línea",
    "moat": "justificación 1 línea",
    "monetizacion": "justificación 1 línea",
    "velocidad": "justificación 1 línea",
    "mercado": "justificación 1 línea"
  },
  "scores": { "traccion": 0, "moat": 0, "monetizacion": 0, "velocidad": 0, "mercado": 0 }
}`;

    try {
      const res = await fetch("/api/shark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      let jsonText = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      const fb = jsonText.indexOf("{");
      const lb = jsonText.lastIndexOf("}");
      if (fb !== -1 && lb !== -1) jsonText = jsonText.slice(fb, lb + 1);
      const parsed = JSON.parse(jsonText);
      const avgScore = Object.values(parsed.scores).reduce((a, b) => a + b, 0) / 5;
      setIdeas(p => p.map(i => i.id === ideaId ? { ...i, analysis: { ...parsed, avgScore } } : i));
      await supabase.from("ideas").update({ analysis: { ...parsed, avgScore } }).eq("id", ideaId);
    } catch (err) {
      setIdeas(p => p.map(i => i.id === ideaId ? { ...i, analysis: { error: true, msg: err.message } } : i));
      await supabase.from("ideas").update({ analysis: { error: true, msg: err.message } }).eq("id", ideaId);
    }
    analyzeRef.current = false;
    setAnalyzing(false);
  };

  const exportPrompt = (idea, a) => {
    const score = a.avgScore?.toFixed(1) || "N/A";
    const md = `# Prompt de Construccion — ${idea.title}\n\n> Shark Board Score: ${score}/10\n\n## CONTEXTO\n**Idea:** ${idea.title}\n**Descripcion:** ${idea.description}\n**Stack recomendado:** ${a.stack || "N/A"}\n**Publico objetivo:** ${a.publicObj || "N/A"}\n**Diferencial:** ${a.diferencial || "N/A"}\n**Mayor riesgo:** ${a.mayorRiesgo || "N/A"}\n\n## PROS\n${(a.pros || []).map(p => "- " + p).join("\n")}\n\n## CONS\n${(a.cons || []).map(c => "- " + c).join("\n")}\n\n## MODELO DE NEGOCIO\n${a.monetizacion?.[0] ? a.monetizacion[0].modelo + ": " + a.monetizacion[0].descripcion + " (MRR est: " + a.monetizacion[0].mrrEstimado + ")" : "N/A"}\n\n## PRIMEROS 30 DIAS\n${a.primeros30dias || "N/A"}\n\n## TU MISION\nSos un experto en producto digital y AI. Ayudame a construir este producto:\n\n**PASO 1 — Validacion (sem 1-2):** Define las 3 preguntas criticas y como pre-vender.\n**PASO 2 — MVP (sem 3-6):** Feature minima, estructura del proyecto, genera codigo del core.\n**PASO 3 — Primeros clientes (mes 2-3):** Como consigo los primeros 10 clientes pagos.\n**PASO 4 — Escala (mes 4+):** Cuando se que encontre PMF.\n\n**Restricciones:** Sin codigo propio, stack AI-first, mercado LATAM, monetizacion desde dia 1.\n\nEmpeza por el PASO 1 y espera mi confirmacion.`;
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
    { key: "comments", label: `💬${sel?.comments?.length ? ` (${sel.comments.length})` : ""}` },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ animation: "spin 2s linear infinite", display: "inline-block" }}><SharkLogo size={60} /></div>
        <div style={{ color: "#6366f1", fontWeight: 700, marginTop: 16, fontSize: 15 }}>Cargando Shark Board...</div>
      </div>
    </div>
  );

  if (!loading && ideas.length === 0 && !wizard) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #faf5ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{ marginBottom: 20 }}><SharkLogo size={76} /></div>
        <h1 style={{ margin: "0 0 10px", fontSize: 32, fontWeight: 900, color: "#111827", letterSpacing: "-0.5px" }}>Shark Board</h1>
        <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
          Tirá ideas de negocio AI. El Shark las analiza sin piedad — scoring calibrado, monetización, go-to-market y riesgo legal en segundos.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 36 }}>
          {[["🦈", "Análisis brutal"], ["📊", "Scoring calibrado"], ["📋", "Pitch Deck"], ["🗳️", "Votación equipo"], ["⚖️", "Comparación"], ["⬇️", "Export prompt"]].map(([e, l]) => (
            <div key={l} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{e}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setWizard(true)} style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 14, padding: "16px 36px", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 28px #6366f140" }}>
          🦈 Agregar primera idea
        </button>
      </div>
      {wizard && <Wizard onSave={saveIdea} onClose={() => setWizard(false)} />}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#111827" }}>

      {/* TOP BAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 4px #0000000a", height: 58 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: "4px", color: "#374151", lineHeight: 1 }}>☰</button>
          )}
          <SharkLogo size={36} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px", lineHeight: 1.2 }}>Shark Board</div>
            <div style={{ color: "#9ca3af", fontSize: 11 }}>{ideas.length} ideas · {ideas.filter(i => i.analysis && !i.analysis.error).length} analizadas</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setView(v => v === "board" ? "ranking" : "board")}
            style={{ background: view === "ranking" ? "#ede9fe" : "#f3f4f6", color: view === "ranking" ? "#7c3aed" : "#374151", border: "none", borderRadius: 8, padding: "7px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {view === "ranking" ? "← Board" : "📊 Comparar"}
          </button>
          <button onClick={() => setWizard(true)}
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 9, padding: "8px 16px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 8px #6366f130" }}>
            + Idea
          </button>
        </div>
      </div>

      {/* COMPARAR */}
      {view === "ranking" && <div style={{ maxWidth: 960, margin: "0 auto" }}><Comparador ideas={ideas} /></div>}

      {/* BOARD */}
      {view === "board" && (
        <div style={{ display: "flex", height: "calc(100vh - 58px)", position: "relative" }}>

          {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#00000044", zIndex: 40 }} />}

          {/* SIDEBAR */}
          <div style={{
            width: 260, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb",
            overflowY: "auto", padding: "8px 8px", display: "flex", flexDirection: "column", gap: 4,
            ...(isMobile ? { position: "fixed", left: sidebarOpen ? 0 : -264, top: 58, height: "calc(100vh - 58px)", zIndex: 45, transition: "left 0.25s cubic-bezier(.4,0,.2,1)" } : {}),
          }}>
            <div style={{ padding: "8px 8px 6px", color: "#9ca3af", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>
              Ideas · {ideas.length}
            </div>

            {ideas.map(idea => {
              const isSelected = idea.id === selectedId;
              const stg = STAGES.find(x => x.key === idea.stage) || STAGES[0];
              const score = idea.analysis?.avgScore;
              const sc = score ? scoreColor(score) : null;
              const hasAnalysis = idea.analysis && !idea.analysis.error;
              const isAnalyzingThis = analyzing && selectedId === idea.id;
              const voteCount = (idea.votes || []).length;
              const upVotes = (idea.votes || []).filter(v => v.vote === "up").length;

              return (
                <div key={idea.id} onClick={() => { setSelectedId(idea.id); setTab("analysis"); setSidebarOpen(false); }}
                  style={{
                    border: `1.5px solid ${isSelected ? "#6366f1" : "#e5e7eb"}`,
                    borderRadius: 11, padding: "10px 12px", cursor: "pointer",
                    background: isSelected ? "#f5f3ff" : "#fff",
                    transition: "all 0.15s",
                    boxShadow: isSelected ? "0 2px 8px #6366f115" : "none",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ background: stg.bg, color: stg.color, fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>{stg.emoji} {stg.label}</span>
                    {isAnalyzingThis ? (
                      <span style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, animation: "pulse 1.5s infinite" }}>analizando...</span>
                    ) : sc ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 10, color: sc, fontWeight: 600 }}>{scoreLabel(score)}</span>
                        <span style={{ background: sc + "15", color: sc, border: `1.5px solid ${sc}25`, borderRadius: 5, padding: "1px 6px", fontWeight: 800, fontSize: 12, fontFamily: "monospace" }}>{score.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 10, color: "#d1d5db", fontWeight: 600 }}>sin análisis</span>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: isSelected ? "#6366f1" : "#111827", lineHeight: 1.3, marginBottom: 4 }}>{idea.title}</div>
                  <div style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{idea.description}</div>
                  {voteCount > 0 && (
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <span style={{ fontSize: 10, color: "#059669", fontWeight: 700, background: "#f0fdf4", borderRadius: 4, padding: "1px 6px" }}>👍 {upVotes}</span>
                      <span style={{ fontSize: 10, color: "#dc2626", fontWeight: 700, background: "#fef2f2", borderRadius: 4, padding: "1px 6px" }}>👎 {voteCount - upVotes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* MAIN */}
          {sel ? (
            <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
              <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 20px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <StageBadge stage={sel.stage} />
                      <select value={sel.stage} onChange={e => updateIdea(selectedId, { stage: e.target.value })}
                        style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#374151", background: "#f9fafb", cursor: "pointer" }}>
                        {STAGES.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                      </select>
                    </div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, letterSpacing: "-0.3px", color: "#111827", lineHeight: 1.3 }}>{sel.title}</h1>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>{sel.description}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 14, flexShrink: 0 }}>
                    {selScore ? (
                      <div style={{ textAlign: "center", background: scoreColor(selScore) + "08", borderRadius: 12, border: `2px solid ${scoreColor(selScore)}25`, padding: "10px 16px", minWidth: 76 }}>
                        <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>SCORE</div>
                        <div style={{ fontSize: 34, fontWeight: 900, fontFamily: "monospace", color: scoreColor(selScore), lineHeight: 1.1, margin: "2px 0" }}>{selScore.toFixed(1)}</div>
                        <div style={{ fontSize: 10, color: scoreColor(selScore), fontWeight: 800, background: scoreColor(selScore) + "15", borderRadius: 4, padding: "1px 6px" }}>{scoreLabel(selScore)}</div>
                      </div>
                    ) : null}
                    <div style={{ display: "flex", gap: 6 }}>
                      {a && !a.error && (
                        <button onClick={() => setPitchIdea(sel)}
                          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 7, padding: "6px 12px", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                          📋 Pitch
                        </button>
                      )}
                      <button onClick={() => deleteIdea(sel.id)}
                        style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 7, padding: "6px 10px", color: "#dc2626", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                </div>

                {/* TABS */}
                <div style={{ display: "flex", overflowX: "auto", gap: 2 }}>
                  {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                      border: "none",
                      background: tab === t.key ? "#f5f3ff" : "transparent",
                      borderBottom: `3px solid ${tab === t.key ? "#6366f1" : "transparent"}`,
                      borderRadius: "8px 8px 0 0",
                      color: tab === t.key ? "#6366f1" : "#6b7280",
                      padding: "10px 16px", cursor: "pointer",
                      fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
                      marginBottom: -1, whiteSpace: "nowrap", transition: "all 0.15s",
                    }}>{t.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "20px 16px" }}>

                {/* VOTAR */}
                {tab === "vote" && (
                  <div>
                    <VotingPanel idea={sel} onVote={addVote} />
                    <div style={{ background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 15, color: "#7c3aed", fontWeight: 800, marginBottom: 6 }}>🦈 ¿Listo para el veredicto?</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Votá primero para no contaminar tu juicio con el score del Shark</div>
                      <button onClick={() => setTab("analysis")}
                        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 10, padding: "11px 24px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        Ver análisis del Shark →
                      </button>
                    </div>
                  </div>
                )}

                {/* ANÁLISIS */}
                {tab === "analysis" && (
                  <div>
                    {!a && !analyzing && (
                      <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16 }}>
                        <SharkLogo size={60} />
                        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, marginTop: 16 }}>Análisis del Shark</div>
                        <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 28, maxWidth: 380, margin: "8px auto 28px", lineHeight: 1.6 }}>
                          Scoring calibrado · Monetización · Go-to-market · Riesgo legal · Veredicto brutal
                        </div>
                        <button onClick={analyze}
                          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 12, padding: "14px 32px", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px #6366f130" }}>
                          🦈 Analizar esta idea
                        </button>
                      </div>
                    )}

                    {analyzing && (
                      <div style={{ textAlign: "center", padding: "70px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16 }}>
                        <div style={{ animation: "pulse 1.5s ease-in-out infinite", display: "inline-block" }}>
                          <SharkLogo size={60} />
                        </div>
                        <div style={{ color: "#6366f1", fontWeight: 800, fontSize: 17, marginTop: 20 }}>Analizando sin piedad...</div>
                        <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 8, marginBottom: 20 }}>Scoring · Monetización · GTM · Riesgo legal</div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
                          {["Tracción", "Moat", "Monetización", "Velocidad", "Mercado"].map(l => (
                            <span key={l} style={{ fontSize: 11, color: "#9ca3af", background: "#f3f4f6", borderRadius: 99, padding: "4px 10px", fontWeight: 600 }}>{l}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {a && !analyzing && (
                      a.error ? (
                        <div style={{ textAlign: "center", padding: "44px 20px", background: "#fff", border: "1px solid #fecaca", borderRadius: 16 }}>
                          <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
                          <div style={{ color: "#dc2626", fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Error al analizar</div>
                          <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 18 }}>{a.msg || "Intentá de nuevo"}</div>
                          <button onClick={() => { updateIdea(selectedId, { analysis: null }); setTimeout(analyze, 200); }}
                            style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 9, padding: "10px 20px", color: "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                            🔄 Reintentar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: 14 }}>
                          <Verdict score={a.avgScore} />
                          <Card title="🎯 Scoring">
                            {a.pagaHoy && (
                              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9, padding: "10px 14px", marginBottom: 16 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>💸 ¿Pagan por esto hoy?</div>
                                <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{a.pagaHoy}</p>
                              </div>
                            )}
                            {SCORE_CRITERIA.map(c => (
                              <ScoreBar key={c.key} icon={c.icon} label={c.label} value={a.scores?.[c.key]} rationale={a.scoreRationale?.[c.key]} />
                            ))}
                          </Card>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="👥 Público objetivo"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.publicObj}</p></Card>
                            <Card title="🔍 Benchmark"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.benchmark}</p></Card>
                          </div>
                          <Card title="✨ Diferencial"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{a.diferencial}</p></Card>
                          <Card title="⚙️ Stack técnico">
                            <p style={{ margin: 0, color: "#374151", fontSize: 13, fontFamily: "monospace", background: "#f8f9fa", borderRadius: 7, padding: "10px 14px", lineHeight: 1.7 }}>{a.stack}</p>
                          </Card>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="✅ Pros" accent="#059669">
                              <ul style={{ margin: 0, paddingLeft: 18 }}>{a.pros?.map((p, i) => <li key={i} style={{ color: "#059669", fontSize: 14, marginBottom: 7, lineHeight: 1.5 }}>{p}</li>)}</ul>
                            </Card>
                            <Card title="⚠️ Cons" accent="#dc2626">
                              <ul style={{ margin: 0, paddingLeft: 18 }}>{a.cons?.map((c, i) => <li key={i} style={{ color: "#dc2626", fontSize: 14, marginBottom: 7, lineHeight: 1.5 }}>{c}</li>)}</ul>
                            </Card>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="☠️ Mayor riesgo" accent="#f59e0b"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.mayorRiesgo}</p></Card>
                            <Card title="⚖️ Riesgo legal" accent="#6366f1"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.riesgoLegal}</p></Card>
                          </div>
                          <Card title="📅 Primeros 30 días"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{a.primeros30dias}</p></Card>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                            <button onClick={() => exportPrompt(sel, a)}
                              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 9, padding: "9px 18px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>⬇️ Exportar Prompt</button>
                            <button onClick={() => { updateIdea(selectedId, { analysis: null }); setTimeout(analyze, 200); }}
                              style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 9, padding: "9px 16px", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>🔄 Re-analizar</button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* MONETIZACIÓN */}
                {tab === "monetizacion" && (
                  <div>
                    {!a ? <EmptyAnalysis tab="monetizacion" onGo={() => setTab("analysis")} /> : a.error ? <EmptyAnalysis tab="monetizacion" onGo={() => setTab("analysis")} /> : (
                      <div style={{ display: "grid", gap: 14 }}>
                        {a.monetizacion?.map((m, i) => (
                          <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", boxShadow: i === 0 ? "0 4px 16px #6366f115" : "none" }}>
                            <div style={{ background: i === 0 ? "linear-gradient(135deg, #6366f1, #a855f7)" : "#f8fafc", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? "#ffffffaa" : "#9ca3af", textTransform: "uppercase" }}>Opción {i + 1}{i === 0 ? " · Recomendada" : ""}</span>
                                <div style={{ fontWeight: 800, fontSize: 16, color: i === 0 ? "#fff" : "#111827", marginTop: 2 }}>{m.modelo}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 10, color: i === 0 ? "#ffffffaa" : "#9ca3af", marginBottom: 2 }}>MRR est.</div>
                                <div style={{ fontWeight: 800, fontSize: 14, color: i === 0 ? "#fff" : "#059669", fontFamily: "monospace" }}>{m.mrrEstimado}</div>
                              </div>
                            </div>
                            <div style={{ padding: "16px 20px", display: "grid", gap: 10 }}>
                              <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{m.descripcion}</p>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div style={{ background: "#f0fdf4", borderRadius: 9, padding: "10px 12px" }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 4 }}>✅ PROS</div>
                                  <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{m.pros}</p>
                                </div>
                                <div style={{ background: "#fef2f2", borderRadius: 9, padding: "10px 12px" }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>⚠️ CONTRAS</div>
                                  <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{m.contras}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {a.publicidad && (
                          <Card title="📣 Estrategia de adquisición">
                            <div style={{ display: "grid", gap: 10 }}>
                              <div style={{ background: "#f0fdf4", borderRadius: 9, padding: "12px 14px" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 6 }}>🌱 ORGÁNICO</div>
                                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{a.publicidad.organico}</p>
                              </div>
                              <div style={{ background: "#eff6ff", borderRadius: 9, padding: "12px 14px" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 6 }}>💸 PUBLICIDAD PAGA</div>
                                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{a.publicidad.pago}</p>
                              </div>
                              <div style={{ background: "#faf5ff", borderRadius: 9, padding: "12px 14px", border: "1px solid #ede9fe" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>🦈 RECOMENDACIÓN</div>
                                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6, fontWeight: 600 }}>{a.publicidad.recomendacion}</p>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* GTM */}
                {tab === "gtm" && (
                  <div>
                    {!a ? <EmptyAnalysis tab="gtm" onGo={() => setTab("analysis")} /> : a.error ? <EmptyAnalysis tab="gtm" onGo={() => setTab("analysis")} /> : (
                      <div style={{ display: "grid", gap: 14 }}>
                        <Card title="🚀 Go-to-Market · Primeros 90 días" accent="#6366f1">
                          <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>{a.gtm90dias}</p>
                        </Card>
                        <Card title="⚖️ Riesgo legal y regulatorio" accent="#f59e0b">
                          <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{a.riesgoLegal}</p>
                        </Card>
                      </div>
                    )}
                  </div>
                )}

                {/* COMENTARIOS */}
                {tab === "comments" && (
                  <div>
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#111827" }}>Agregar comentario</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Tu nombre"
                          style={{ border: "1.5px solid #e5e7eb", borderRadius: 9, padding: "10px 13px", fontSize: 13, outline: "none", color: "#111827", transition: "border-color 0.15s" }}
                          onFocus={e => e.target.style.borderColor = "#6366f1"}
                          onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()}
                            placeholder="Tu punto de vista sobre esta idea..."
                            style={{ border: "1.5px solid #e5e7eb", borderRadius: 9, padding: "10px 13px", fontSize: 13, flex: 1, outline: "none", color: "#111827", transition: "border-color 0.15s" }}
                            onFocus={e => e.target.style.borderColor = "#6366f1"}
                            onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                          <button onClick={addComment} style={{ background: "#6366f1", border: "none", borderRadius: 9, padding: "10px 18px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Enviar</button>
                        </div>
                      </div>
                    </div>
                    {!sel.comments?.length ? (
                      <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
                        <div style={{ fontWeight: 600 }}>Nadie comentó aún</div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>Sé el primero en opinar</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {sel.comments.map(c => (
                          <div key={c.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 11, padding: "12px 16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                              <span style={{ fontWeight: 700, fontSize: 13, color: "#6366f1" }}>{c.author}</span>
                              <span style={{ fontSize: 11, color: "#9ca3af" }}>{c.time}</span>
                            </div>
                            <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.6 }}>{c.text}</p>
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
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                <SharkLogo size={56} />
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5, marginTop: 16 }}>Seleccioná una idea</div>
                <div style={{ fontSize: 13 }}>o agregá una nueva con + Idea</div>
              </div>
            </div>
          )}
        </div>
      )}

      {wizard && <Wizard onSave={saveIdea} onClose={() => setWizard(false)} />}
      {pitchIdea && <PitchDeckModal idea={pitchIdea} analysis={pitchIdea.analysis} onClose={() => setPitchIdea(null)} />}

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: #9ca3af; }
        button:active { opacity: 0.85; transform: scale(0.98); }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.93); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        select { appearance: auto; }
      `}</style>
    </div>
  );
}
