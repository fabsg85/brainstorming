import { useState, useRef } from "react";
import { T, STAGES, SCORE_CRITERIA, TABS } from "./constants";
import { scoreColor, scoreLabel, exportMarkdown } from "./utils";
import { useIdeas } from "./hooks/useIdeas";

import SharkLogo       from "./components/SharkLogo";
import VerdictBanner   from "./components/VerdictBanner";
import RadarChart      from "./components/RadarChart";
import VotingPanel     from "./components/VotingPanel";
import Wizard          from "./components/Wizard";
import PitchDeckModal  from "./components/PitchDeckModal";
import Comparador      from "./components/Comparador";
import TimelineGTM     from "./components/TimelineGTM";
import { Card, StageBadge, ScoreBar, EmptyTab } from "./components/UI";

const ANALYZE_PROMPT = (title, description) => `Analizá esta idea de negocio AI. Devolvé SOLO un objeto JSON válido. Sin markdown, sin texto extra, sin backticks. Empezá con { y terminá con }.

IDEA: ${title}
DESCRIPCIÓN: ${description}

El veredicto tiene que sonar como Kevin O'Leary pero rioplatense: directo, sarcástico, sin filtro.

ESTRUCTURA EXACTA:
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

// ── GLOBAL STYLES ─────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-thumb { background: #D0CCC4; border-radius: 3px; }
    input::placeholder, textarea::placeholder { color: #A8A49E; }
    button  { transition: opacity 0.12s, transform 0.1s; font-family: inherit; }
    button:active { opacity: 0.82; transform: scale(0.98); }
    textarea { resize: vertical; font-family: inherit; }
    select   { appearance: auto; font-family: inherit; }
    @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)}  50%{opacity:0.6;transform:scale(0.93)} }
    @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  `}</style>
);

// ── EMPTY STATE ───────────────────────────────────────────────────
function EmptyBoard({ onAdd }) {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font, padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ marginBottom: 26 }}><SharkLogo size={84} /></div>
        <h1 style={{ margin: "0 0 10px", fontSize: 46, fontWeight: 700, color: T.text, letterSpacing: "-1.5px", fontFamily: T.fontDisplay, lineHeight: 1.1 }}>Shark Board</h1>
        <p style={{ color: T.textMid, fontSize: 16, lineHeight: 1.75, marginBottom: 42 }}>
          Tirá tus ideas de negocio AI.<br />El Shark las analiza sin filtro — y sin piedad.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 42 }}>
          {[["🦈","Análisis brutal"],["📊","Scoring sarcástico"],["📋","Pitch Deck"],["🗳️","Votación equipo"],["⚖️","Comparación"],["⬇️","Export prompt"]].map(([e, l]) => (
            <div key={l} style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 12px", textAlign: "center", boxShadow: "0 2px 8px #0000000a" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{e}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMid }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={onAdd} style={{ background: T.text, border: "none", borderRadius: 14, padding: "16px 40px", color: "#FFF", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: T.fontDisplay, letterSpacing: "-0.3px", boxShadow: `0 8px 28px ${T.text}22` }}>
          🦈 Tirar la primera idea
        </button>
      </div>
    </div>
  );
}

// ── ANALYSIS TAB ──────────────────────────────────────────────────
function AnalysisTab({ sel, a, analyzing, onAnalyze, onReanalyze, onExportPrompt }) {
  if (!a && !analyzing) {
    return (
      <div style={{ textAlign: "center", padding: "72px 20px", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 20, boxShadow: "0 4px 20px #0000000a" }}>
        <SharkLogo size={68} />
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10, marginTop: 22, fontFamily: T.fontDisplay, color: T.text }}>Que el Shark hable</div>
        <div style={{ color: T.textMid, fontSize: 14, marginBottom: 34, maxWidth: 360, margin: "10px auto 34px", lineHeight: 1.7 }}>
          Scoring calibrado · Monetización · GTM · Riesgo legal · Veredicto sin anestesia
        </div>
        <button onClick={onAnalyze} style={{ background: T.text, border: "none", borderRadius: 14, padding: "15px 38px", color: "#FFF", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: T.fontDisplay, letterSpacing: "-0.3px", boxShadow: `0 8px 24px ${T.text}22` }}>
          🦈 Analizar esta idea
        </button>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 20 }}>
        <div style={{ animation: "pulse 1.6s ease-in-out infinite", display: "inline-block" }}><SharkLogo size={68} /></div>
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
    );
  }

  if (a.error) {
    return (
      <div style={{ textAlign: "center", padding: "52px 20px", background: T.surface, border: `1.5px solid ${T.coral}25`, borderRadius: 20 }}>
        <div style={{ fontSize: 42, marginBottom: 12 }}>😬</div>
        <div style={{ color: T.coral, fontWeight: 700, fontSize: 17, marginBottom: 7, fontFamily: T.fontDisplay }}>Algo salió mal</div>
        <div style={{ color: T.textMute, fontSize: 13, marginBottom: 22 }}>{a.msg || "El Shark está de mal humor. Intentá de nuevo."}</div>
        <button onClick={onReanalyze} style={{ background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 24px", color: T.text, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
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
          {SCORE_CRITERIA.map((c) => (
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
        <Card title="⚖️ Riesgo legal"  accent={T.cobalt}><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.65 }}>{a.riesgoLegal}</p></Card>
      </div>
      <Card title="📅 Primeros 30 días"><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.7 }}>{a.primeros30dias}</p></Card>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onExportPrompt} style={{ background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 18px", color: T.text, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>⬇️ Exportar Prompt</button>
        <button onClick={onReanalyze}    style={{ background: T.text, border: "none", borderRadius: 10, padding: "9px 18px", color: "#FFF", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>🔄 Re-analizar</button>
      </div>
    </div>
  );
}

// ── MONETIZACION TAB ──────────────────────────────────────────────
function MonetizacionTab({ a, onGoAnalysis }) {
  if (!a) return <EmptyTab icon="💰" title="Nada que ver acá todavía" sub="Generá el análisis primero" onGo={onGoAnalysis} />;
  return (
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
  );
}

// ── GTM TAB ───────────────────────────────────────────────────────
function GtmTab({ a, onGoAnalysis }) {
  if (!a) return <EmptyTab icon="🚀" title="Sin plan todavía" sub="Generá el análisis primero" onGo={onGoAnalysis} />;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card title="🚀 Go-to-Market · Primeros 90 días" accent={T.cobalt}><TimelineGTM gtm90dias={a.gtm90dias} /></Card>
      <Card title="📅 Primeros 30 días (antes de escribir código)" accent={T.coral}><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.7 }}>{a.primeros30dias}</p></Card>
      <Card title="⚖️ Riesgo legal y regulatorio" accent={T.amber}><p style={{ margin: 0, color: T.textMid, fontSize: 14, lineHeight: 1.7 }}>{a.riesgoLegal}</p></Card>
    </div>
  );
}

// ── COMMENTS TAB ──────────────────────────────────────────────────
function CommentsTab({ sel, onAdd }) {
  const [author,  setAuthor]  = useState("");
  const [comment, setComment] = useState("");

  const submit = () => {
    if (!comment.trim()) return;
    onAdd(sel.id, { id: Date.now(), author: author.trim() || "Anónimo", text: comment.trim(), time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) });
    setComment("");
  };

  return (
    <div>
      <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "18px 22px", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, color: T.text, fontFamily: T.fontDisplay }}>Agregar comentario</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[{ val: author, set: setAuthor, ph: "Tu nombre" }, { val: comment, set: setComment, ph: "Tu punto de vista (sin filtro)" }].map(({ val, set, ph }, i) => (
            <input key={ph} value={val} onChange={(e) => set(e.target.value)}
              onKeyDown={(e) => i === 1 && e.key === "Enter" && submit()}
              placeholder={ph}
              style={{ border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", color: T.text, background: T.bg }} />
          ))}
          <button onClick={submit} style={{ background: T.text, border: "none", borderRadius: 10, padding: "11px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Enviar</button>
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
          {sel.comments.map((c) => (
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
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────
export default function App() {
  const { ideas, loading, addIdea, updateIdea, deleteIdea, addVote, addComment, saveAnalysis } = useIdeas();
  const [selectedId,  setSelectedId]  = useState(null);
  const [view,        setView]        = useState("board");
  const [tab,         setTab]         = useState("analysis");
  const [wizard,      setWizard]      = useState(false);
  const [pitchIdea,   setPitchIdea]   = useState(null);
  const [analyzing,   setAnalyzing]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const analyzeRef = useRef(false);

  const sel = ideas.find((i) => i.id === selectedId) || ideas[0] || null;
  const a   = sel?.analysis;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleAdd = async (draft) => {
    const created = await addIdea(draft);
    if (created) { setSelectedId(created.id); setWizard(false); setTab("vote"); setSidebarOpen(false); }
  };

  const handleDelete = async (id) => {
    const ok = await deleteIdea(id);
    if (ok) setSelectedId(ideas.filter((i) => i.id !== id)[0]?.id || null);
  };

  const analyze = async () => {
    if (analyzeRef.current || analyzing || !sel) return;
    analyzeRef.current = true;
    setAnalyzing(true);
    const ideaId = sel.id;
    try {
      const res  = await fetch("/api/shark", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: ANALYZE_PROMPT(sel.title, sel.description) }) });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      let jsonText = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      const fb = jsonText.indexOf("{"), lb = jsonText.lastIndexOf("}");
      if (fb !== -1 && lb !== -1) jsonText = jsonText.slice(fb, lb + 1);
      const parsed   = JSON.parse(jsonText);
      const avgScore = Object.values(parsed.scores).reduce((a, b) => a + b, 0) / 5;
      await saveAnalysis(ideaId, { ...parsed, avgScore });
    } catch (err) {
      await saveAnalysis(ideaId, { error: true, msg: err.message });
    }
    analyzeRef.current = false;
    setAnalyzing(false);
  };

  const reanalyze = () => { updateIdea(selectedId, { analysis: null }); setTimeout(analyze, 200); };

  const handleExportPrompt = () => {
    if (!sel || !a) return;
    const score = a.avgScore?.toFixed(1) || "N/A";
    const md = `# Prompt de Construccion — ${sel.title}\n\n> Score: ${score}/10\n\n## CONTEXTO\n**Idea:** ${sel.title}\n**Descripcion:** ${sel.description}\n**Stack:** ${a.stack || "N/A"}\n**Publico:** ${a.publicObj || "N/A"}\n**Diferencial:** ${a.diferencial || "N/A"}\n**Mayor riesgo:** ${a.mayorRiesgo || "N/A"}\n\n## PROS\n${(a.pros || []).map((p) => "- " + p).join("\n")}\n\n## CONS\n${(a.cons || []).map((c) => "- " + c).join("\n")}\n\n## MONETIZACION PRIMARIA\n${a.monetizacion?.[0] ? `${a.monetizacion[0].modelo}: ${a.monetizacion[0].descripcion} (MRR: ${a.monetizacion[0].mrrEstimado})` : "N/A"}\n\n## PRIMEROS 30 DIAS\n${a.primeros30dias || "N/A"}\n\n## MISION\nSos un experto en producto digital y AI. Construi este producto paso a paso:\n\n**PASO 1 — Validacion:** Define las 3 preguntas criticas y como pre-vender.\n**PASO 2 — MVP:** Feature minima, genera codigo del core.\n**PASO 3 — Primeros clientes:** Como conseguir los primeros 10 pagos.\n**PASO 4 — Escala:** Cuando encontraste PMF y que feature sigue.\n\nEmpeza por PASO 1 y espera mi confirmacion.`;
    exportMarkdown(`prompt-${sel.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}.md`, md);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font }}>
      <GlobalStyles />
      <div style={{ textAlign: "center" }}>
        <div style={{ animation: "spin 3s linear infinite", display: "inline-block" }}><SharkLogo size={68} /></div>
        <div style={{ color: T.textMid, fontWeight: 600, marginTop: 20, fontSize: 14 }}>Cargando Shark Board...</div>
      </div>
    </div>
  );

  if (ideas.length === 0 && !wizard) return (
    <>
      <GlobalStyles />
      <EmptyBoard onAdd={() => setWizard(true)} />
      {wizard && <Wizard onSave={handleAdd} onClose={() => setWizard(false)} />}
    </>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text }}>
      <GlobalStyles />

      {/* TOP BAR */}
      <div style={{ background: T.surface, borderBottom: `1.5px solid ${T.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, height: 62, boxShadow: "0 1px 6px #0000000a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isMobile && <button onClick={() => setSidebarOpen((o) => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: T.text, padding: "4px" }}>☰</button>}
          <SharkLogo size={38} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.5px", fontFamily: T.fontDisplay, lineHeight: 1.2 }}>Shark Board</div>
            <div style={{ color: T.textMute, fontSize: 11 }}>{ideas.length} ideas · {ideas.filter((i) => i.analysis && !i.analysis.error).length} analizadas</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setView((v) => (v === "board" ? "ranking" : "board"))}
            style={{ background: view === "ranking" ? T.text : T.bg, color: view === "ranking" ? "#FFF" : T.textMid, border: `1.5px solid ${view === "ranking" ? T.text : T.border}`, borderRadius: 10, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
            {view === "ranking" ? "← Board" : "📊 Comparar"}
          </button>
          <button onClick={() => setWizard(true)} style={{ background: T.text, border: "none", borderRadius: 10, padding: "8px 18px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: `0 3px 10px ${T.text}20` }}>
            + Idea
          </button>
        </div>
      </div>

      {view === "ranking" && <div style={{ maxWidth: 1000, margin: "0 auto" }}><Comparador ideas={ideas} /></div>}

      {view === "board" && (
        <div style={{ display: "flex", height: "calc(100vh - 62px)", position: "relative" }}>
          {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#00000044", zIndex: 40 }} />}

          {/* SIDEBAR */}
          <div style={{ width: 268, flexShrink: 0, background: T.surface, borderRight: `1.5px solid ${T.border}`, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: 4, ...(isMobile ? { position: "fixed", left: sidebarOpen ? 0 : -272, top: 62, height: "calc(100vh - 62px)", zIndex: 45, transition: "left 0.25s cubic-bezier(.4,0,.2,1)" } : {}) }}>
            <div style={{ padding: "6px 8px 10px", color: T.textMute, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px" }}>Ideas · {ideas.length}</div>
            {ideas.map((idea) => {
              const isSelected    = idea.id === (sel?.id);
              const stg           = STAGES.find((x) => x.key === idea.stage) || STAGES[0];
              const score         = idea.analysis?.avgScore;
              const sc            = score ? scoreColor(score) : null;
              const isAnalyzing   = analyzing && sel?.id === idea.id;
              const voteCount     = (idea.votes || []).length;
              const upVotes       = (idea.votes || []).filter((v) => v.vote === "up").length;
              return (
                <div key={idea.id} onClick={() => { setSelectedId(idea.id); setTab("analysis"); setSidebarOpen(false); }}
                  style={{ border: `1.5px solid ${isSelected ? T.text : T.border}`, borderRadius: 12, padding: "11px 13px", cursor: "pointer", background: isSelected ? T.text : T.surface, transition: "all 0.15s", boxShadow: isSelected ? `0 4px 16px ${T.text}18` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ background: isSelected ? "#FFFFFF18" : stg.bg, color: isSelected ? "#FFFFFF80" : stg.color, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "2px 8px" }}>{stg.emoji} {stg.label}</span>
                    {isAnalyzing ? (
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

          {/* MAIN PANEL */}
          {sel ? (
            <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
              {/* Idea header */}
              <div style={{ background: T.surface, borderBottom: `1.5px solid ${T.border}`, padding: "18px 24px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, flexWrap: "wrap" }}>
                      <StageBadge stage={sel.stage} />
                      <select value={sel.stage} onChange={(e) => updateIdea(sel.id, { stage: e.target.value })}
                        style={{ border: `1px solid ${T.border}`, borderRadius: 8, padding: "3px 8px", fontSize: 11, color: T.textMid, background: T.bg, cursor: "pointer" }}>
                        {STAGES.map((s) => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                      </select>
                    </div>
                    <h1 style={{ margin: "0 0 7px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: T.text, lineHeight: 1.3, fontFamily: T.fontDisplay }}>{sel.title}</h1>
                    <p style={{ margin: 0, color: T.textMid, fontSize: 13, lineHeight: 1.65 }}>{sel.description}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, marginLeft: 18, flexShrink: 0 }}>
                    {a?.avgScore && (
                      <div style={{ textAlign: "center", background: T.text, borderRadius: 14, padding: "12px 18px", minWidth: 80 }}>
                        <div style={{ fontSize: 9, color: "#FFFFFF35", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>SCORE</div>
                        <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "monospace", color: scoreColor(a.avgScore), lineHeight: 1.1, margin: "3px 0" }}>{a.avgScore.toFixed(1)}</div>
                        <div style={{ fontSize: 10, color: scoreColor(a.avgScore), fontWeight: 700 }}>{scoreLabel(a.avgScore)}</div>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 6 }}>
                      {a && !a.error && (
                        <button onClick={() => setPitchIdea(sel)} style={{ background: T.text, border: "none", borderRadius: 8, padding: "7px 13px", color: "#FFF", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>📋 Pitch</button>
                      )}
                      <button onClick={() => handleDelete(sel.id)} style={{ background: T.coralLight, border: `1px solid ${T.coral}18`, borderRadius: 8, padding: "7px 11px", color: T.coral, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", overflowX: "auto", gap: 2 }}>
                  {TABS(sel).map((t) => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                      style={{ border: "none", background: tab === t.key ? T.bg : "transparent", borderBottom: `3px solid ${tab === t.key ? T.text : "transparent"}`, borderRadius: "8px 8px 0 0", color: tab === t.key ? T.text : T.textMute, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: tab === t.key ? 700 : 500, marginBottom: -1, whiteSpace: "nowrap", transition: "all 0.15s" }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div style={{ padding: "24px 20px", animation: "fadeUp 0.2s ease" }}>
                {tab === "vote" && (
                  <div>
                    <VotingPanel idea={sel} onVote={addVote} />
                    <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "22px", textAlign: "center" }}>
                      <div style={{ fontSize: 17, color: T.text, fontWeight: 700, marginBottom: 7, fontFamily: T.fontDisplay }}>🦈 ¿Listo para el veredicto?</div>
                      <div style={{ fontSize: 13, color: T.textMid, marginBottom: 20 }}>Votá primero para no contaminar tu juicio</div>
                      <button onClick={() => setTab("analysis")} style={{ background: T.text, border: "none", borderRadius: 10, padding: "11px 26px", color: "#FFF", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Ver qué dice el Shark →</button>
                    </div>
                  </div>
                )}
                {tab === "analysis"     && <AnalysisTab     sel={sel} a={a} analyzing={analyzing} onAnalyze={analyze} onReanalyze={reanalyze} onExportPrompt={handleExportPrompt} />}
                {tab === "monetizacion" && <MonetizacionTab a={a} onGoAnalysis={() => setTab("analysis")} />}
                {tab === "gtm"          && <GtmTab          a={a} onGoAnalysis={() => setTab("analysis")} />}
                {tab === "comments"     && <CommentsTab     sel={sel} onAdd={addComment} />}
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

      {wizard    && <Wizard          onSave={handleAdd}  onClose={() => setWizard(false)} />}
      {pitchIdea && <PitchDeckModal  idea={pitchIdea}    analysis={pitchIdea.analysis} onClose={() => setPitchIdea(null)} />}
    </div>
  );
}
