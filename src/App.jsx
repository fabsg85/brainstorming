import { useState, useEffect } from "react";
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

function Card({ title, children, accent, noPad }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${accent ? accent + "30" : "#e5e7eb"}`, borderRadius: 12, padding: noPad ? 0 : "18px 22px", borderLeft: accent ? `4px solid ${accent}` : undefined, overflow: "hidden" }}>
      {title && <div style={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.7px", padding: noPad ? "18px 22px 0" : 0 }}>{title}</div>}
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
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "monospace", color: c, lineHeight: 1 }}>{score.toFixed(1)}</div>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>/ 10</div>
      </div>
    </div>
  );
}

// ── WIZARD ──────────────────────────────────────────────────────
function Wizard({ onSave, onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ title: "", description: "", stage: "idea" });

  const canNext = step === 0 ? data.title.trim().length > 0 : step === 1 ? data.description.trim().length > 0 : true;

  const handleSubmit = () => {
    if (data.title.trim()) onSave(data);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000055", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, boxShadow: "0 25px 60px #0004", overflow: "hidden" }}>
        {/* Progress */}
        <div style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>💡 Nueva Idea</span>
            <button onClick={onClose} style={{ background: "#ffffff22", border: "none", borderRadius: 6, color: "#fff", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {WIZARD_STEPS.map((s, i) => (
              <div key={s.key} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= step ? "#fff" : "#ffffff33", transition: "background 0.3s" }} />
            ))}
          </div>
          <div style={{ marginTop: 10, color: "#ffffffcc", fontSize: 12 }}>Paso {step + 1} de {WIZARD_STEPS.length}</div>
        </div>

        <div style={{ padding: "28px 24px" }}>
          <div style={{ marginBottom: 6, fontSize: 22 }}>{WIZARD_STEPS[step].emoji}</div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4, color: "#111827" }}>{WIZARD_STEPS[step].label}</div>
          <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 22 }}>{WIZARD_STEPS[step].desc}</div>

          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                autoFocus
                value={data.title}
                onChange={e => setData(p => ({ ...p, title: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && canNext && setStep(1)}
                placeholder="ej: App para administración de edificios con AI"
                style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "13px 15px", fontSize: 15, outline: "none", color: "#111827", width: "100%", boxSizing: "border-box" }}
              />
            </div>
          )}

          {step === 1 && (
            <textarea
              autoFocus
              value={data.description}
              onChange={e => setData(p => ({ ...p, description: e.target.value }))}
              placeholder="¿Qué dolor resuelve exactamente? ¿Quién lo sufre hoy? ¿Cómo lo resuelven sin tu producto?"
              rows={5}
              style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "13px 15px", fontSize: 14, outline: "none", color: "#111827", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
            />
          )}

          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {STAGES.map(s => (
                <button key={s.key} onClick={() => setData(p => ({ ...p, stage: s.key }))} style={{
                  background: data.stage === s.key ? s.bg : "#f9fafb",
                  color: data.stage === s.key ? s.color : "#6b7280",
                  border: `2px solid ${data.stage === s.key ? s.color + "60" : "#e5e7eb"}`,
                  borderRadius: 10, padding: "14px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  textAlign: "center", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.emoji}</div>
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: "#f3f4f6", border: "none", borderRadius: 10, padding: "12px", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                ← Atrás
              </button>
            )}
            {step < WIZARD_STEPS.length - 1 ? (
              <button onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext} style={{
                flex: 2, background: canNext ? "linear-gradient(135deg, #6366f1, #a855f7)" : "#f3f4f6",
                border: "none", borderRadius: 10, padding: "12px",
                color: canNext ? "#fff" : "#9ca3af", fontWeight: 800, fontSize: 14, cursor: canNext ? "pointer" : "not-allowed",
              }}>
                Siguiente →
              </button>
            ) : (
              <button onClick={handleSubmit} style={{
                flex: 2, background: "linear-gradient(135deg, #6366f1, #a855f7)",
                border: "none", borderRadius: 10, padding: "12px",
                color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
              }}>
                🦈 Agregar al board
              </button>
            )}
          </div>

          <div style={{ marginTop: 16, background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#7c3aed", textAlign: "center" }}>
            El Shark genera automáticamente todo el análisis 🦈
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMPARADOR ──────────────────────────────────────────────────
function Comparador({ ideas }) {
  const sorted = [...ideas].sort((a, b) => (avg(b.analysis?.scores) || 0) - (avg(a.analysis?.scores) || 0));
  return (
    <div style={{ padding: "24px 16px", overflowX: "auto" }}>
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4, color: "#111827" }}>📊 Ranking de Ideas</div>
      <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>Comparativa de todas las ideas por score del Shark</div>
      <div style={{ minWidth: 500 }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 80px 80px 80px 80px 80px 90px", gap: 8, padding: "8px 12px", background: "#f3f4f6", borderRadius: 10, marginBottom: 6, fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <div>#</div>
          <div>Idea</div>
          {SCORE_CRITERIA.map(c => <div key={c.key} style={{ textAlign: "center" }}>{c.icon}</div>)}
          <div style={{ textAlign: "center" }}>TOTAL</div>
        </div>
        {sorted.map((idea, idx) => {
          const sc = idea.analysis?.scores;
          const total = avg(sc);
          const stg = STAGES.find(x => x.key === idea.stage) || STAGES[0];
          return (
            <div key={idea.id} style={{
              display: "grid", gridTemplateColumns: "28px 1fr 80px 80px 80px 80px 80px 90px",
              gap: 8, padding: "12px", background: "#fff",
              border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 6,
              alignItems: "center",
            }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: idx === 0 ? "#f59e0b" : "#9ca3af" }}>{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 3 }}>{idea.title}</div>
                <span style={{ background: stg.bg, color: stg.color, fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>{stg.emoji} {stg.label}</span>
              </div>
              {SCORE_CRITERIA.map(c => (
                <div key={c.key} style={{ textAlign: "center" }}>
                  {sc?.[c.key] ? (
                    <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: scoreColor(sc[c.key]) }}>{sc[c.key]}</span>
                  ) : <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>}
                </div>
              ))}
              <div style={{ textAlign: "center" }}>
                {total ? (
                  <span style={{ background: scoreColor(total) + "15", color: scoreColor(total), border: `1.5px solid ${scoreColor(total)}30`, borderRadius: 8, padding: "3px 10px", fontWeight: 900, fontSize: 14, fontFamily: "monospace" }}>
                    {total.toFixed(1)}
                  </span>
                ) : <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>}
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
            No hay ideas aún para comparar
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
  const [view, setView] = useState("board"); // board | ranking
  const [tab, setTab] = useState("analysis");
  const [wizard, setWizard] = useState(false);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const analyze = async () => {
    if (!sel) return;
    setAnalyzing(true);

    const prompt = `Sos un shark de negocios tech con expertise en AI, monetización y go-to-market. Analizá esta idea y respondé ÚNICAMENTE con un JSON válido, sin texto extra, sin markdown, sin backticks.

IDEA: ${sel.title}
DESCRIPCIÓN: ${sel.description}

JSON requerido (respetá exactamente los tipos):
{
  "publicObj": "string",
  "diferencial": "string",
  "benchmark": "string - competidores existentes, alternativas actuales, y cómo se diferencia esta idea",
  "stack": "string - stack técnico concreto recomendado",
  "pros": ["string", "string", "string"],
  "cons": ["string", "string", "string"],
  "veredicto": "string - una línea brutal y directa",
  "mayorRiesgo": "string",
  "monetizacion": [
    { "modelo": "string - nombre del modelo", "descripcion": "string", "pros": "string", "contras": "string", "mrrEstimado": "string" },
    { "modelo": "string", "descripcion": "string", "pros": "string", "contras": "string", "mrrEstimado": "string" },
    { "modelo": "string", "descripcion": "string", "pros": "string", "contras": "string", "mrrEstimado": "string" }
  ],
  "publicidad": {
    "organico": "string - canales orgánicos recomendados y por qué",
    "pago": "string - si vale la pena publicidad paga, cuándo y en qué canal",
    "recomendacion": "string - orgánico primero o pago desde el día 1"
  },
  "gtm90dias": "string - plan concreto de go-to-market para los primeros 90 días",
  "riesgoLegal": "string - riesgos regulatorios o legales específicos a considerar",
  "primeros30dias": "string - 3 acciones concretas para validar antes de construir",
  "scores": {
    "traccion": número 1-10,
    "moat": número 1-10,
    "monetizacion": número 1-10,
    "velocidad": número 1-10,
    "mercado": número 1-10
  }
}`;

    try {
      const res = await fetch("/api/shark", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const avgScore = Object.values(parsed.scores).reduce((a, b) => a + b, 0) / 5;
      await updateIdea(sel.id, { analysis: { ...parsed, avgScore } });
    } catch {
      await updateIdea(sel.id, { analysis: { error: true } });
    }
    setAnalyzing(false);
  };

  const a = sel?.analysis;
  const selScore = a?.avgScore;

  const TABS = [
    { key: "analysis", label: "🦈 Análisis" },
    { key: "monetizacion", label: "💰 Monetización" },
    { key: "gtm", label: "🚀 Go-to-Market" },
    { key: "comments", label: `💬${sel?.comments?.length ? ` (${sel.comments.length})` : ""}` },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🦈</div>
        <div style={{ color: "#6366f1", fontWeight: 700 }}>Cargando...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#111827" }}>

      {/* TOP BAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 3px #0000000a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: "2px 6px", display: "block" }} className="mobile-menu">☰</button>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🦈</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>AI Shark Board</div>
            <div style={{ color: "#6b7280", fontSize: 11 }}>{ideas.length} ideas</div>
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

      {/* RANKING VIEW */}
      {view === "ranking" && (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Comparador ideas={ideas} />
        </div>
      )}

      {/* BOARD VIEW */}
      {view === "board" && (
        <div style={{ display: "flex", height: "calc(100vh - 58px)", position: "relative" }}>

          {/* Overlay mobile */}
          {sidebarOpen && (
            <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#00000044", zIndex: 40 }} />
          )}

          {/* SIDEBAR */}
          <div style={{
            width: 250, flexShrink: 0, background: "#fff",
            borderRight: "1px solid #e5e7eb", overflowY: "auto", padding: 10,
            display: "flex", flexDirection: "column", gap: 6,
            position: window.innerWidth < 768 ? "fixed" : "relative",
            left: window.innerWidth < 768 ? (sidebarOpen ? 0 : -260) : 0,
            top: window.innerWidth < 768 ? 58 : 0,
            height: window.innerWidth < 768 ? "calc(100vh - 58px)" : "auto",
            zIndex: window.innerWidth < 768 ? 45 : 1,
            transition: "left 0.25s ease",
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
              {/* Idea header */}
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
                        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px" }}>Score</div>
                        <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: scoreColor(selScore), lineHeight: 1.1 }}>{selScore.toFixed(1)}</div>
                      </div>
                    )}
                    <button onClick={() => deleteIdea(sel.id)} style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 7, padding: "5px 12px", color: "#dc2626", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>🗑</button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
                  {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                      border: "none", background: "none", borderBottom: `2.5px solid ${tab === t.key ? "#6366f1" : "transparent"}`,
                      color: tab === t.key ? "#6366f1" : "#6b7280", padding: "9px 14px", cursor: "pointer",
                      fontSize: 13, fontWeight: tab === t.key ? 700 : 500, marginBottom: -1, whiteSpace: "nowrap",
                    }}>{t.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "20px 16px" }}>

                {/* ── TAB: ANÁLISIS ── */}
                {tab === "analysis" && (
                  <div>
                    {!a && !analyzing && (
                      <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16 }}>
                        <div style={{ fontSize: 52, marginBottom: 12 }}>🦈</div>
                        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Análisis del Shark</div>
                        <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 24, maxWidth: 380, margin: "0 auto 24px" }}>
                          Genera: público objetivo, diferencial, benchmark, stack, pros/cons, scoring, monetización, go-to-market y riesgo legal.
                        </div>
                        <button onClick={analyze} style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: 10, padding: "13px 28px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                          🦈 Analizar esta idea
                        </button>
                      </div>
                    )}
                    {analyzing && (
                      <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16 }}>
                        <div style={{ fontSize: 44, marginBottom: 12 }}>🦈</div>
                        <div style={{ color: "#6366f1", fontWeight: 700, fontSize: 16 }}>Analizando sin piedad...</div>
                        <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 6 }}>Esto tarda unos segundos</div>
                      </div>
                    )}
                    {a && !analyzing && (
                      a.error ? (
                        <div style={{ textAlign: "center", padding: "40px", background: "#fff", border: "1px solid #fecaca", borderRadius: 16 }}>
                          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
                          <div style={{ color: "#dc2626", fontWeight: 700, marginBottom: 12 }}>Error al analizar</div>
                          <button onClick={() => { updateIdea(selectedId, { analysis: null }); setTimeout(analyze, 100); }} style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 18px", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                            🔄 Reintentar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: 14 }}>
                          <Verdict score={a.avgScore} />
                          <Card title="🎯 Scoring">
                            {SCORE_CRITERIA.map(c => <ScoreBar key={c.key} icon={c.icon} label={c.label} value={a.scores?.[c.key]} />)}
                          </Card>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="👥 Público objetivo"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.publicObj}</p></Card>
                            <Card title="🔍 Benchmark"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.benchmark}</p></Card>
                          </div>
                          <Card title="✨ Diferencial"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{a.diferencial}</p></Card>
                          <Card title="⚙️ Stack técnico"><p style={{ margin: 0, color: "#374151", fontSize: 13, fontFamily: "monospace", background: "#f3f4f6", borderRadius: 6, padding: "10px 12px", lineHeight: 1.6 }}>{a.stack}</p></Card>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="✅ Pros" accent="#059669">
                              <ul style={{ margin: 0, paddingLeft: 18 }}>{a.pros?.map((p, i) => <li key={i} style={{ color: "#059669", fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>{p}</li>)}</ul>
                            </Card>
                            <Card title="⚠️ Cons" accent="#dc2626">
                              <ul style={{ margin: 0, paddingLeft: 18 }}>{a.cons?.map((c, i) => <li key={i} style={{ color: "#dc2626", fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>{c}</li>)}</ul>
                            </Card>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Card title="☠️ Mayor riesgo" accent="#f59e0b"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.mayorRiesgo}</p></Card>
                            <Card title="⚖️ Riesgo legal / regulatorio" accent="#6366f1"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.riesgoLegal}</p></Card>
                          </div>
                          <Card title="📅 Primeros 30 días"><p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{a.primeros30dias}</p></Card>
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button onClick={() => { updateIdea(selectedId, { analysis: null }); setTimeout(analyze, 100); }} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 16px", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                              🔄 Re-analizar
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* ── TAB: MONETIZACIÓN ── */}
                {tab === "monetizacion" && (
                  <div>
                    {!a && <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Primero generá el análisis en la tab 🦈</div>}
                    {a && !a.error && (
                      <div style={{ display: "grid", gap: 14 }}>
                        {a.monetizacion?.map((m, i) => (
                          <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
                            <div style={{ background: i === 0 ? "linear-gradient(135deg, #6366f1, #a855f7)" : i === 1 ? "#f8fafc" : "#f8fafc", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? "#ffffffaa" : "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>Opción {i + 1}</span>
                                <div style={{ fontWeight: 800, fontSize: 16, color: i === 0 ? "#fff" : "#111827", marginTop: 2 }}>{m.modelo}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 11, color: i === 0 ? "#ffffffaa" : "#9ca3af", marginBottom: 2 }}>MRR est.</div>
                                <div style={{ fontWeight: 800, fontSize: 14, color: i === 0 ? "#fff" : "#059669", fontFamily: "monospace" }}>{m.mrrEstimado}</div>
                              </div>
                            </div>
                            <div style={{ padding: "16px 20px", display: "grid", gap: 12 }}>
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
                        {/* Publicidad */}
                        {a.publicidad && (
                          <Card title="📣 Estrategia de adquisición">
                            <div style={{ display: "grid", gap: 12 }}>
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

                {/* ── TAB: GO-TO-MARKET ── */}
                {tab === "gtm" && (
                  <div>
                    {!a && <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Primero generá el análisis en la tab 🦈</div>}
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

                {/* ── TAB: COMENTARIOS ── */}
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
                <div style={{ fontSize: 44, marginBottom: 10 }}>💡</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>No hay ideas aún</div>
                <div style={{ fontSize: 13 }}>Tocá + Idea para empezar</div>
              </div>
            </div>
          )}
        </div>
      )}

      {wizard && <Wizard onSave={saveIdea} onClose={() => setWizard(false)} />}

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: #9ca3af; }
      `}</style>
    </div>
  );
}
