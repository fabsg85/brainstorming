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
  { key: "title", label: "La idea", emoji: "💡", desc: "¿Cómo se llama y de qué se trata?" },
  { key: "problem", label: "El problema", emoji: "🎯", desc: "¿Qué dolor resuelve y para quién?" },
  { key: "stage", label: "Estado actual", emoji: "📍", desc: "¿En qué etapa está la idea?" },
];

const SCORE_CRITERIA = [
  { key: "traccion", label: "Tracción potencial", icon: "📈" },
  { key: "moat", label: "Moat defensible", icon: "🏰" },
  { key: "monetizacion", label: "Monetización clara", icon: "💰" },
  { key: "velocidad", label: "Velocidad validación", icon: "⚡" },
  { key: "mercado", label: "Tamaño de mercado", icon: "🌍" },
];

function avg(scores) {
  if (!scores) return null;
  const vals = Object.values(scores).filter(v => v > 0);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function scoreColor(s) {
  return s >= 7.5 ? "#059669" : s >= 5.5 ? "#d97706" : "#dc2626";
}

// ── SVG SHARK LOGO ───────────────────────────────────────────────
function SharkLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="url(#grad)" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {/* Shark body */}
      <path d="M6 24 C8 18, 14 15, 22 16 L28 14 L24 19 C28 19, 32 21, 34 24 C30 23, 26 22, 22 23 L20 27 L18 23 C14 23, 10 23, 6 24Z" fill="white" opacity="0.95"/>
      {/* Dorsal fin */}
      <path d="M18 16 L22 10 L26 16" fill="white" opacity="0.85"/>
      {/* Eye */}
      <circle cx="27" cy="21" r="1.2" fill="#6366f1"/>
      {/* Tail */}
      <path d="M6 24 L3 20 M6 24 L3 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
    </svg>
  );
}

function ScoreBar({ label, value, icon }) {
  if (!value) return null;
  const c = scoreColor(value);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{icon} {label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: c }}>{value}/10</span>
      </div>
      <div style={{ height: 5, background: "#f3f4f6", borderRadius: 99 }}>
        <div style={{ height: 5, background: c, borderRadius: 99, width: `${value * 10}%`, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function StageBadge({ stage }) {
  const s = STAGES.find(x => x.key === stage) || STAGES[0];
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 9px" }}>{s.emoji} {s.label}</span>;
}

function Card({ title, children, accent }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${accent ? accent + "30" : "#e5e7eb"}`, borderRadius: 12, padding: "18px 22px", borderLeft: accent ? `4px solid ${accent}` : undefined }}>
      {title && <div style={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.7px" }}>{title}</div>}
      {children}
    </div>
  );
}

function Verdict({ score }) {
  if (!score) return null;
  const c = scoreColor(score);
  const label = score >= 7.5 ? "INVERTIRÍA" : score >= 5.5 ? "NECESITA PIVOTE" : "PASS";
  const emoji = score >= 7.5 ? "🟢" : score >= 5.5 ? "🟡" : "🔴";
  return (
    <div style={{ background: c + "08", border: `2px solid ${c}25`, borderRadius: 14, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Veredicto del Shark</div>
        <div style={{ fontWeight: 900, fontSize: 20, color: c }}>{emoji} {label}</div>
        {score && <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4, fontStyle: "italic" }}>{score >= 7.5 ? "Potencial real. A construir." : score >= 5.5 ? "Hay algo acá, pero necesita ajustes." : "No vale el esfuerzo ahora."}</div>}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "monospace", color: c, lineHeight: 1 }}>{score.toFixed(1)}</div>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>/ 10</div>
      </div>
    </div>
  );
}

// ── WIZARD ───────────────────────────────────────────────────────
function Wizard({ onSave, onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ title: "", description: "", stage: "idea" });
  const canNext = step === 0 ? data.title.trim().length > 0 : step === 1 ? data.description.trim().length > 0 : true;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000055", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, boxShadow: "0 25px 60px #0004", overflow: "hidden" }}>
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
          <div style={{ marginTop: 8, color: "#ffffffcc", fontSize: 12 }}>Paso {step + 1} de {WIZARD_STEPS.length}</div>
        </div>

        <div style={{ padding: "28px 24px" }}>
          <div style={{ marginBottom: 6, fontSize: 22 }}>{WIZARD_STEPS[step].emoji}</div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4, color: "#111827" }}>{WIZARD_STEPS[step].label}</div>
          <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 22 }}>{WIZARD_STEPS[step].desc}</div>

          {step === 0 && (
            <input autoFocus value={data.title}
              onChange={e => setData(p => ({ ...p, title: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && canNext && setStep(1)}
              placeholder="ej: App para administración de edificios con AI"
              style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "13px 15px", fontSize: 15, outline: "none", color: "#111827", width: "100%", boxSizing: "border-box" }} />
          )}

          {step === 1 && (
            <textarea autoFocus value={data.description}
              onChange={e => setData(p => ({ ...p, description: e.target.value }))}
              placeholder="¿Qué dolor resuelve? ¿Quién lo sufre? ¿Cómo lo resuelven hoy sin tu producto?"
              rows={5}
              style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "13px 15px", fontSize: 14, outline: "none", color: "#111827", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
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
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.emoji}</div>{s.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: "#f3f4f6", border: "none", borderRadius: 10, padding: "12px", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Atrás</button>
            )}
            {step < WIZARD_STEPS.length - 1 ? (
              <button onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext} style={{ flex: 2, background: canNext ? "linear-gradient(135deg, #6366f1, #a855f7)" : "#f3f4f6", border: "none", borderRadius: 10, padding: "12px", color: canNext ? "#fff" : "#9ca3af", fontWeight: 800, fontSize: 14, cursor: canNext ? "pointer" : "not-allowed" }}>
                Siguiente →
              </button>
            ) : (
              <button onClick={() => onSave(data)} style={{ flex: 2, background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 10, padding: "12px", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                🦈 Agregar al board
              </button>
            )}
          </div>
          <div style={{ marginTop: 14, background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#7c3aed", textAlign: "center" }}>
            El Shark genera todo el análisis automáticamente 🦈
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMPARADOR ───────────────────────────────────────────────────
function Comparador({ ideas }) {
  const sorted = [...ideas].sort((a, b) => (avg(b.analysis?.scores) || 0) - (avg(a.analysis?.scores) || 0));
  return (
    <div style={{ padding: "24px 16px", overflowX: "auto" }}>
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4, color: "#111827" }}>📊 Ranking de Ideas</div>
      <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>Comparativa por score del Shark</div>
      <div style={{ minWidth: 520 }}>
        <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 70px 70px 70px 70px 70px 90px", gap: 6, padding: "8px 12px", background: "#f3f4f6", borderRadius: 10, marginBottom: 6, fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <div>#</div><div>Idea</div>
          {SCORE_CRITERIA.map(c => <div key={c.key} style={{ textAlign: "center" }}>{c.icon}</div>)}
          <div style={{ textAlign: "center" }}>TOTAL</div>
        </div>
        {sorted.map((idea, idx) => {
          const sc = idea.analysis?.scores;
          const total = avg(sc);
          const stg = STAGES.find(x => x.key === idea.stage) || STAGES[0];
          return (
            <div key={idea.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr 70px 70px 70px 70px 70px 90px", gap: 6, padding: "12px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 6, alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span style={{ color: "#9ca3af" }}>{idx + 1}</span>}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 3 }}>{idea.title}</div>
                <span style={{ background: stg.bg, color: stg.color, fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>{stg.emoji} {stg.label}</span>
              </div>
              {SCORE_CRITERIA.map(c => (
                <div key={c.key} style={{ textAlign: "center" }}>
                  {sc?.[c.key] ? <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: scoreColor(sc[c.key]) }}>{sc[c.key]}</span> : <span style={{ color: "#d1d5db" }}>—</span>}
                </div>
              ))}
              <div style={{ textAlign: "center" }}>
                {total ? <span style={{ background: scoreColor(total) + "15", color: scoreColor(total), border: `1.5px solid ${scoreColor(total)}30`, borderRadius: 8, padding: "3px 10px", fontWeight: 900, fontSize: 14, fontFamily: "monospace" }}>{total.toFixed(1)}</span>
                  : <span style={{ color: "#d1d5db" }}>—</span>}
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>No hay ideas para comparar
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────
export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("board");
  const [tab, setTab] = useState("analysis");
  const [wizard, setWizard] = useState(false);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const analyzeRef = useRef(false); // prevent double calls

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
      .insert([{ title: draft.title, description: draft.description, stage: draft.stage, comments: [], analysis: null }])
      .select().single();
    if (!error && data) {
      setIdeas(p => [data, ...p]);
      setSelectedId(data.id);
      setWizard(false);
      setTab("analysis");
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

  const addComment = async () => {
    if (!comment.trim() || !sel) return;
    const nc = { id: Date.now(), author: author.trim() || "Anónimo", text: comment.trim(), time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) };
    const updated = [...(sel.comments || []), nc];
    await updateIdea(selectedId, { comments: updated });
    setComment("");
  };

  const exportPrompt = (idea, a) => {
    const score = a.avgScore?.toFixed(1) || "N/A";
    const verdict = score >= 7.5 ? "INVERTIRÍA" : score >= 5.5 ? "NECESITA PIVOTE" : "PASS";
    const mono = a.monetizacion?.[0];

    const md = `# 🦈 Prompt de Construcción — ${idea.title}

> Generado por Shark Board · Score: ${score}/10 · Veredicto: ${verdict}

---

## CONTEXTO DEL PROYECTO

Sos un experto en producto digital y desarrollo con AI. Vas a ayudarme a construir el siguiente producto paso a paso.

**Idea:** ${idea.title}
**Descripción:** ${idea.description || "Sin descripción"}
**Stage actual:** ${idea.stage}

---

## ANÁLISIS DEL SHARK (contexto para decisiones)

**Público objetivo:** ${a.publicObj || "N/A"}
**Diferencial clave:** ${a.diferencial || "N/A"}
**Benchmark:** ${a.benchmark || "N/A"}
**Stack recomendado:** ${a.stack || "N/A"}
**Mayor riesgo:** ${a.mayorRiesgo || "N/A"}
**Riesgo legal:** ${a.riesgoLegal || "N/A"}

**Pros:**
${a.pros?.map(p => `- ${p}`).join("
") || "N/A"}

**Cons:**
${a.cons?.map(c => `- ${c}`).join("
") || "N/A"}

---

## MODELO DE MONETIZACIÓN PRIMARIO

**Modelo:** ${mono?.modelo || "N/A"}
**Descripción:** ${mono?.descripcion || "N/A"}
**MRR Estimado:** ${mono?.mrrEstimado || "N/A"}

---

## PRIMEROS 30 DÍAS DE VALIDACIÓN

${a.primeros30dias || "N/A"}

---

## GO-TO-MARKET 90 DÍAS

${a.gtm90dias || "N/A"}

---

## TU MISIÓN

Usando todo el contexto anterior, ayudame a construir este producto siguiendo este orden:

### PASO 1 — Validación (Semana 1-2)
- Definí las 3 preguntas de validación más críticas antes de escribir una línea de código
- Diseñá el experimento más simple para testear la hipótesis principal
- ¿Cómo pre-vendo esto antes de construirlo?

### PASO 2 — MVP Mínimo (Semana 3-6)
- ¿Cuál es la feature mínima que genera valor real al usuario?
- Definí el stack exacto con versiones y justificación
- Dame la estructura de carpetas y archivos del proyecto
- Empezá a generar el código del MVP comenzando por el core de valor

### PASO 3 — Primeros Clientes (Mes 2-3)
- ¿Cómo consigo los primeros 10 clientes pagos?
- ¿Qué métricas trackeo desde el día 1?
- ¿Qué feedback loop implemento?

### PASO 4 — Iteración y Escala (Mes 4+)
- ¿Cuándo sé que encontré product-market fit?
- ¿Qué feature agrego primero según feedback?
- ¿Cómo escalo sin romper lo que funciona?

---

## RESTRICCIONES

- Stack: ${a.stack || "Next.js, Supabase, Vercel, Claude API"}
- Sin código propio — todo generado con AI, revisado por freelancer
- Parte-time, presupuesto limitado
- Mercado objetivo: Uruguay / LATAM hispanohablante
- Monetización desde el día 1, sin "crecer y luego ver cómo cobrar"

---

Empezá por el **PASO 1** y esperá mi confirmación antes de avanzar al siguiente.
`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url;
    a2.download = `shark-prompt-${idea.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}.md`;
    a2.click();
    URL.revokeObjectURL(url);
  };

  const analyze = async () => {
    // Guard: prevent multiple simultaneous calls
    if (analyzeRef.current || analyzing || !sel) return;
    analyzeRef.current = true;
    setAnalyzing(true);

    const ideaId = sel.id;
    const ideaTitle = sel.title;
    const ideaDesc = sel.description;

    const prompt = `Analizá esta idea de negocio de AI y devolvé SOLO un objeto JSON válido. Sin texto extra. Sin markdown. Sin backticks. Empezá directamente con { y terminá con }.

IDEA: ${ideaTitle}
DESCRIPCIÓN: ${ideaDesc}

Estructura requerida:
{
  "publicObj": "quién es el cliente y cuánto paga hoy por este problema",
  "diferencial": "ventaja competitiva real y por qué no se copia fácil",
  "benchmark": "competidores existentes y cómo se diferencia esta idea",
  "stack": "stack técnico concreto recomendado",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2", "con 3"],
  "veredicto": "una línea brutal y directa",
  "mayorRiesgo": "el riesgo número 1 que puede matar este proyecto",
  "monetizacion": [
    { "modelo": "nombre", "descripcion": "descripción corta", "pros": "ventaja principal", "contras": "desventaja principal", "mrrEstimado": "rango en USD" },
    { "modelo": "nombre", "descripcion": "descripción corta", "pros": "ventaja principal", "contras": "desventaja principal", "mrrEstimado": "rango en USD" },
    { "modelo": "nombre", "descripcion": "descripción corta", "pros": "ventaja principal", "contras": "desventaja principal", "mrrEstimado": "rango en USD" }
  ],
  "publicidad": {
    "organico": "canales orgánicos recomendados",
    "pago": "si vale la pena publicidad paga y cuándo",
    "recomendacion": "orgánico primero o pago desde día 1 y por qué"
  },
  "gtm90dias": "plan concreto go-to-market primeros 90 días",
  "riesgoLegal": "riesgos regulatorios o legales específicos",
  "primeros30dias": "3 acciones concretas para validar antes de construir",
  "pagaHoy": "sí o no y quién paga qué monto aproximado por resolver este problema hoy",
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
      const res = await fetch("/api/shark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";

      // Robust JSON extraction
      let jsonText = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      const firstBrace = jsonText.indexOf("{");
      const lastBrace = jsonText.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) jsonText = jsonText.slice(firstBrace, lastBrace + 1);

      const parsed = JSON.parse(jsonText);
      const avgScore = Object.values(parsed.scores).reduce((a, b) => a + b, 0) / 5;

      // Update only the specific idea by ID
      setIdeas(p => p.map(i => i.id === ideaId ? { ...i, analysis: { ...parsed, avgScore } } : i));
      await supabase.from("ideas").update({ analysis: { ...parsed, avgScore } }).eq("id", ideaId);

    } catch (err) {
      setIdeas(p => p.map(i => i.id === ideaId ? { ...i, analysis: { error: true, msg: err.message } } : i));
      await supabase.from("ideas").update({ analysis: { error: true } }).eq("id", ideaId);
    }

    analyzeRef.current = false;
    setAnalyzing(false);
  };

  const a = sel?.analysis;
  const selScore = a?.avgScore;
  const isMobile = window.innerWidth < 768;

  const TABS = [
    { key: "analysis", label: "🦈 Análisis" },
    { key: "monetizacion", label: "💰 Monetización" },
    { key: "gtm", label: "🚀 GTM" },
    { key: "comments", label: `💬${sel?.comments?.length ? ` (${sel.comments.length})` : ""}` },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <SharkLogo size={56} />
        <div style={{ color: "#6366f1", fontWeight: 700, marginTop: 14 }}>Cargando...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#111827" }}>

      {/* TOP BAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 3px #0000000a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: "2px 4px", color: "#374151" }}>☰</button>
          )}
          <SharkLogo size={36} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>Shark Board</div>
            <div style={{ color: "#6b7280", fontSize: 11 }}>{ideas.length} idea{ideas.length !== 1 ? "s" : ""}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setView(v => v === "board" ? "ranking" : "board")} style={{ background: view === "ranking" ? "#ede9fe" : "#f3f4f6", color: view === "ranking" ? "#7c3aed" : "#374151", border: "none", borderRadius: 8, padding: "7px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {view === "ranking" ? "← Board" : "📊 Ranking"}
          </button>
          <button onClick={() => setWizard(true)} style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 9, padding: "8px 16px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            + Idea
          </button>
        </div>
      </div>

      {/* RANKING */}
      {view === "ranking" && <div style={{ maxWidth: 900, margin: "0 auto" }}><Comparador ideas={ideas} /></div>}

      {/* BOARD */}
      {view === "board" && (
        <div style={{ display: "flex", height: "calc(100vh - 57px)", position: "relative" }}>

          {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#00000044", zIndex: 40 }} />}

          {/* SIDEBAR */}
          <div style={{
            width: 248, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb",
            overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 6,
            ...(isMobile ? { position: "fixed", left: sidebarOpen ? 0 : -260, top: 57, height: "calc(100vh - 57px)", zIndex: 45, transition: "left 0.25s ease" } : {}),
          }}>
            <div style={{ padding: "6px 8px 8px", color: "#9ca3af", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Ideas del equipo</div>
            {ideas.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px 12px", color: "#9ca3af" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>💡</div>
                <div style={{ fontSize: 12 }}>Agregá la primera idea</div>
              </div>
            )}
            {ideas.map(idea => {
              const isSelected = idea.id === selectedId;
              const stg = STAGES.find(x => x.key === idea.stage) || STAGES[0];
              const score = idea.analysis?.avgScore;
              const sc = score ? scoreColor(score) : null;
              return (
                <div key={idea.id} onClick={() => { setSelectedId(idea.id); setTab("analysis"); setSidebarOpen(false); }}
                  style={{ border: `1.5px solid ${isSelected ? "#6366f1" : "#e5e7eb"}`, borderRadius: 10, padding: "11px 13px", cursor: "pointer", background: isSelected ? "#f5f3ff" : "#fff", transition: "all 0.15s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ background: stg.bg, color: stg.color, fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>{stg.emoji} {stg.label}</span>
                    {sc ? <span style={{ background: sc + "15", color: sc, border: `1.5px solid ${sc}30`, borderRadius: 6, padding: "1px 7px", fontWeight: 800, fontSize: 12, fontFamily: "monospace" }}>{score.toFixed(1)}</span>
                      : <span style={{ fontSize: 10, color: "#9ca3af" }}>sin análisis</span>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: isSelected ? "#6366f1" : "#111827", lineHeight: 1.3, marginBottom: 3 }}>{idea.title}</div>
                  <div style={{ color: "#6b7280", fontSize: 11, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{idea.description}</div>
                </div>
              );
            })}
          </div>

          {/* MAIN */}
          {sel ? (
            <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
              <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 20px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, flexWrap: "wrap" }}>
                      <StageBadge stage={sel.stage} />
                      <select value={sel.stage} onChange={e => updateIdea(selectedId, { stage: e.target.value })}
                        style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#374151", background: "#f9fafb", cursor: "pointer" }}>
                        {STAGES.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                      </select>
                    </div>
                    <h1 style={{ margin: "0 0 5px", fontSize: 20, fontWeight: 800, letterSpacing: "-0.3px", color: "#111827", lineHeight: 1.3 }}>{sel.title}</h1>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>{sel.description}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 12, flexShrink: 0 }}>
                    {selScore && (
                      <div style={{ textAlign: "center", background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb", padding: "8px 14px" }}>
                        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>Score</div>
                        <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: scoreColor(selScore), lineHeight: 1.1 }}>{selScore.toFixed(1)}</div>
                      </div>
                    )}
                    <button onClick={() => deleteIdea(sel.id)} style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 7, padding: "5px 12px", color: "#dc2626", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>🗑</button>
                  </div>
                </div>
                <div style={{ display: "flex", overflowX: "auto" }}>
                  {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ border: "none", background: "none", borderBottom: `2.5px solid ${tab === t.key ? "#6366f1" : "transparent"}`, color: tab === t.key ? "#6366f1" : "#6b7280", padding: "9px 14px", cursor: "pointer", fontSize: 13, fontWeight: tab === t.key ? 700 : 500, marginBottom: -1, whiteSpace: "nowrap" }}>{t.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "20px 16px" }}>

                {/* ANÁLISIS */}
                {tab === "analysis" && (
                  <div>
                    {!a && !analyzing && (
                      <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16 }}>
                        <SharkLogo size={56} />
                        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6, marginTop: 14 }}>Análisis del Shark</div>
                        <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 24, maxWidth: 380, margin: "8px auto 24px" }}>
                          Genera: público, diferencial, benchmark, stack, pros/cons, scoring, 3 modelos de monetización, go-to-market y riesgo legal.
                        </div>
                        <button onClick={analyze} style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 10, padding: "13px 28px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                          🦈 Analizar esta idea
                        </button>
                      </div>
                    )}
                    {analyzing && (
                      <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16 }}>
                        <SharkLogo size={52} />
                        <div style={{ color: "#6366f1", fontWeight: 700, fontSize: 16, marginTop: 14 }}>Analizando sin piedad...</div>
                        <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 6 }}>Esto tarda unos segundos</div>
                      </div>
                    )}
                    {a && !analyzing && (
                      a.error ? (
                        <div style={{ textAlign: "center", padding: "40px", background: "#fff", border: "1px solid #fecaca", borderRadius: 16 }}>
                          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
                          <div style={{ color: "#dc2626", fontWeight: 700, marginBottom: 4 }}>Error al analizar</div>
                          <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 14 }}>{a.msg || "Intentá de nuevo"}</div>
                          <button onClick={() => { updateIdea(selectedId, { analysis: null }); setTimeout(analyze, 200); }} style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 18px", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                            🔄 Reintentar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: 14 }}>
                          <Verdict score={a.avgScore} />
                          <Card title="🎯 Scoring">
                            {a.pagaHoy && (
                              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>💸 ¿Pagan por esto hoy?</div>
                                <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{a.pagaHoy}</p>
                              </div>
                            )}
                            {SCORE_CRITERIA.map(c => (
                              <div key={c.key}>
                                <ScoreBar icon={c.icon} label={c.label} value={a.scores?.[c.key]} />
                                {a.scoreRationale?.[c.key] && (
                                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: -6, marginBottom: 12, paddingLeft: 2, fontStyle: "italic" }}>
                                    {a.scoreRationale[c.key]}
                                  </div>
                                )}
                              </div>
                            ))}
                          </Card>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="👥 Público objetivo"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.publicObj}</p></Card>
                            <Card title="🔍 Benchmark"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.benchmark}</p></Card>
                          </div>
                          <Card title="✨ Diferencial"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{a.diferencial}</p></Card>
                          <Card title="⚙️ Stack técnico"><p style={{ margin: 0, color: "#374151", fontSize: 13, fontFamily: "monospace", background: "#f3f4f6", borderRadius: 6, padding: "10px 12px", lineHeight: 1.6 }}>{a.stack}</p></Card>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="✅ Pros" accent="#059669"><ul style={{ margin: 0, paddingLeft: 18 }}>{a.pros?.map((p, i) => <li key={i} style={{ color: "#059669", fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>{p}</li>)}</ul></Card>
                            <Card title="⚠️ Cons" accent="#dc2626"><ul style={{ margin: 0, paddingLeft: 18 }}>{a.cons?.map((c, i) => <li key={i} style={{ color: "#dc2626", fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>{c}</li>)}</ul></Card>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="☠️ Mayor riesgo" accent="#f59e0b"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.mayorRiesgo}</p></Card>
                            <Card title="⚖️ Riesgo legal" accent="#6366f1"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.riesgoLegal}</p></Card>
                          </div>
                          <Card title="📅 Primeros 30 días"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{a.primeros30dias}</p></Card>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                            <button onClick={() => exportPrompt(sel, a)} style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 8, padding: "8px 18px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>⬇️ Exportar Prompt</button>
                            <button onClick={() => { updateIdea(selectedId, { analysis: null }); setTimeout(analyze, 200); }} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 16px", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>🔄 Re-analizar</button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* MONETIZACIÓN */}
                {tab === "monetizacion" && (
                  <div>
                    {!a && <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>Primero generá el análisis en la tab 🦈</div>}
                    {a && !a.error && (
                      <div style={{ display: "grid", gap: 14 }}>
                        {a.monetizacion?.map((m, i) => (
                          <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
                            <div style={{ background: i === 0 ? "linear-gradient(135deg, #6366f1, #a855f7)" : "#f8fafc", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? "#ffffffaa" : "#9ca3af", textTransform: "uppercase" }}>Opción {i + 1}</span>
                                <div style={{ fontWeight: 800, fontSize: 16, color: i === 0 ? "#fff" : "#111827", marginTop: 2 }}>{m.modelo}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 11, color: i === 0 ? "#ffffffaa" : "#9ca3af", marginBottom: 2 }}>MRR est.</div>
                                <div style={{ fontWeight: 800, fontSize: 14, color: i === 0 ? "#fff" : "#059669", fontFamily: "monospace" }}>{m.mrrEstimado}</div>
                              </div>
                            </div>
                            <div style={{ padding: "16px 20px", display: "grid", gap: 10 }}>
                              <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{m.descripcion}</p>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 12px" }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 4 }}>✅ PROS</div>
                                  <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{m.pros}</p>
                                </div>
                                <div style={{ background: "#fef2f2", borderRadius: 8, padding: "10px 12px" }}>
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
                              <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "12px 14px" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 6 }}>🌱 ORGÁNICO</div>
                                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{a.publicidad.organico}</p>
                              </div>
                              <div style={{ background: "#eff6ff", borderRadius: 8, padding: "12px 14px" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 6 }}>💸 PUBLICIDAD PAGA</div>
                                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{a.publicidad.pago}</p>
                              </div>
                              <div style={{ background: "#faf5ff", borderRadius: 8, padding: "12px 14px", border: "1px solid #ede9fe" }}>
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
                    {!a && <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>Primero generá el análisis en la tab 🦈</div>}
                    {a && !a.error && (
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
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Agregar comentario</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Tu nombre"
                          style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 13px", fontSize: 13, outline: "none", color: "#111827" }} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()}
                            placeholder="Tu punto de vista..."
                            style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 13px", fontSize: 13, flex: 1, outline: "none", color: "#111827" }} />
                          <button onClick={addComment} style={{ background: "#6366f1", border: "none", borderRadius: 8, padding: "9px 16px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Enviar</button>
                        </div>
                      </div>
                    </div>
                    {!sel.comments?.length ? (
                      <div style={{ textAlign: "center", padding: "36px", color: "#9ca3af", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>Nadie comentó aún
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {sel.comments.map(c => (
                          <div key={c.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
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
                <SharkLogo size={52} />
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, marginTop: 14 }}>No hay ideas aún</div>
                <div style={{ fontSize: 13 }}>Tocá + Idea para empezar</div>
              </div>
            </div>
          )}
        </div>
      )}

      {wizard && <Wizard onSave={saveIdea} onClose={() => setWizard(false)} />}

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; } input::placeholder, textarea::placeholder { color: #9ca3af; }`}</style>
    </div>
  );
}
