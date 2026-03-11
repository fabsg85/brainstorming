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
import { Card, StageBadge, ScoreBar, EmptyTab, GlowBtn } from "./components/UI";

// ── FONTS + GLOBAL STYLES ────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #0B0B0F; color: rgba(255,255,255,0.92); font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0B0B0F; }
    ::-webkit-scrollbar-thumb { background: #6C5CE7; border-radius: 99px; }
    input, textarea, select { color: rgba(255,255,255,0.92); background: transparent; }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.22); }
    button { transition: opacity 0.12s, transform 0.1s; }
    button:active:not(:disabled) { opacity: 0.82; transform: scale(0.98); }
    textarea { resize: vertical; }
    @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.94)} }
    @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(108,92,231,0.3)} 50%{box-shadow:0 0 40px rgba(108,92,231,0.6),0 0 20px rgba(0,245,212,0.2)} }
    @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-40px) scale(1.04)} 66%{transform:translate(-20px,30px) scale(0.97)} }
  `}</style>
);

// ── NOISE + BLOB BACKGROUND ──────────────────────────────────────
const BackgroundEffects = () => (
  <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
    {/* Noise texture */}
    <div style={{ position:"absolute", inset:0, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, backgroundSize:"200px 200px", opacity:0.5 }}/>
    {/* Blobs */}
    <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"#6C5CE7", filter:"blur(140px)", opacity:0.06, top:-200, left:-200, animation:"blobFloat 20s ease-in-out infinite" }}/>
    <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"#00F5D4", filter:"blur(120px)", opacity:0.05, top:"40%", right:-150, animation:"blobFloat 16s ease-in-out infinite", animationDelay:"-8s" }}/>
    <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"#6C5CE7", filter:"blur(100px)", opacity:0.04, bottom:-100, left:"30%", animation:"blobFloat 18s ease-in-out infinite", animationDelay:"-14s" }}/>
  </div>
);

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

// ── EMPTY BOARD ──────────────────────────────────────────────────
function EmptyBoard({ onAdd }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0B0B0F", display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
      <BackgroundEffects/>
      <div style={{ textAlign:"center", maxWidth:560, position:"relative", zIndex:1 }}>
        {/* Logo */}
        <div style={{ marginBottom:28, display:"inline-flex", animation:"glowPulse 3s ease-in-out infinite" }}>
          <SharkLogo size={80}/>
        </div>
        <h1 style={{ margin:"0 0 12px", fontSize:56, fontWeight:800, color:"rgba(255,255,255,0.95)", letterSpacing:"-2px", fontFamily:"'Sora',sans-serif", lineHeight:1.05 }}>
          Think Faster.<br/>
          <span style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Hunt Better Ideas.
          </span>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.42)", fontSize:16, lineHeight:1.75, marginBottom:48, fontWeight:300 }}>
          Tirá tus ideas. El Shark las puntúa sin filtro.<br/>Scoring calibrado, veredicto brutal, playbook ejecutable.
        </p>

        {/* Feature pills */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:48 }}>
          {[["🦈","Análisis brutal"],["📊","Scoring 5 ejes"],["📋","Pitch Deck auto"],["🗳️","Votación equipo"],["⚖️","Comparación"],["⬇️","Export .md"]].map(([e,l])=>(
            <div key={l} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:99, padding:"7px 14px", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)", fontFamily:"'Sora',sans-serif", backdropFilter:"blur(8px)" }}>
              {e} {l}
            </div>
          ))}
        </div>

        <button onClick={onAdd} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:14, padding:"16px 44px", color:"#fff", fontWeight:700, fontSize:16, cursor:"pointer", fontFamily:"'Sora',sans-serif", letterSpacing:"-0.3px", boxShadow:"0 0 40px rgba(108,92,231,0.5), 0 0 20px rgba(0,245,212,0.2)" }}>
          🦈 Tirar la primera idea
        </button>
        <div style={{ marginTop:16, fontSize:12, color:"rgba(255,255,255,0.2)" }}>No hace falta tener todo claro. El Shark se encarga.</div>
      </div>
    </div>
  );
}

// ── ANALYSIS TAB ─────────────────────────────────────────────────
function AnalysisTab({ sel, a, analyzing, onAnalyze, onReanalyze, onExportPrompt }) {
  if (!a && !analyzing) return (
    <div style={{ textAlign:"center", padding:"72px 20px", background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, backdropFilter:"blur(12px)" }}>
      {/* Animated shark logo */}
      <div style={{ display:"inline-flex", marginBottom:24, animation:"glowPulse 3s ease-in-out infinite" }}>
        <SharkLogo size={64}/>
      </div>
      <div style={{ fontWeight:700, fontSize:22, marginBottom:10, fontFamily:T.fontDisplay, color:T.text, letterSpacing:"-0.5px" }}>Que el Shark hable</div>
      <div style={{ color:T.textMute, fontSize:14, marginBottom:36, maxWidth:360, margin:"10px auto 36px", lineHeight:1.7 }}>
        Scoring calibrado · Monetización · GTM · Riesgo legal · Veredicto sin anestesia
      </div>
      <button onClick={onAnalyze} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:12, padding:"14px 36px", color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:T.fontDisplay, boxShadow:"0 0 30px rgba(108,92,231,0.5)" }}>
        🦈 Analizar esta idea
      </button>
    </div>
  );

  if (analyzing) return (
    <div style={{ textAlign:"center", padding:"80px 20px", background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, backdropFilter:"blur(12px)" }}>
      <div style={{ animation:"pulse 1.6s ease-in-out infinite", display:"inline-block" }}><SharkLogo size={64}/></div>
      <div style={{ color:T.text, fontWeight:700, fontSize:20, marginTop:24, fontFamily:T.fontDisplay, letterSpacing:"-0.3px" }}>El Shark está pensando...</div>
      <div style={{ color:T.textMute, fontSize:13, marginTop:8, marginBottom:28 }}>No lo toques. Esto tarda unos segundos.</div>
      <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
        {SCORE_CRITERIA.map((c,i) => (
          <span key={c.key} style={{ fontSize:11, color:T.textMid, background:T.surface2, border:`1px solid ${T.border}`, borderRadius:99, padding:"4px 12px", fontWeight:600, fontFamily:T.fontDisplay, animation:`pulse 1.6s ${i*0.2}s infinite` }}>
            {c.icon} {c.label}
          </span>
        ))}
      </div>
    </div>
  );

  if (a.error) return (
    <div style={{ textAlign:"center", padding:"52px 20px", background:"rgba(255,95,122,0.06)", border:"1px solid rgba(255,95,122,0.2)", borderRadius:20, backdropFilter:"blur(12px)" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>😬</div>
      <div style={{ color:"#FF5F7A", fontWeight:700, fontSize:17, marginBottom:7, fontFamily:T.fontDisplay }}>Algo salió mal</div>
      <div style={{ color:T.textMute, fontSize:13, marginBottom:22 }}>{a.msg||"El Shark está de mal humor. Intentá de nuevo."}</div>
      <GlowBtn onClick={onReanalyze} variant="ghost">🔄 Reintentar</GlowBtn>
    </div>
  );

  return (
    <div style={{ display:"grid", gap:14, animation:"fadeUp 0.3s ease" }}>
      <VerdictBanner score={a.avgScore}/>

      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:14, alignItems:"start" }}>
        <Card title="🎯 Scoring detallado">
          {a.pagaHoy && (
            <div style={{ background:"rgba(0,245,212,0.08)", border:"1px solid rgba(0,245,212,0.2)", borderRadius:10, padding:"10px 14px", marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#00F5D4", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:T.fontDisplay }}>💸 ¿Pagan por esto hoy?</div>
              <p style={{ margin:0, fontSize:13, color:T.textMid, lineHeight:1.5 }}>{a.pagaHoy}</p>
            </div>
          )}
          {SCORE_CRITERIA.map(c => (
            <ScoreBar key={c.key} icon={c.icon} label={c.label} value={a.scores?.[c.key]} rationale={a.scoreRationale?.[c.key]}/>
          ))}
        </Card>
        {a.scores && (
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"18px", backdropFilter:"blur(12px)", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.textMute, textTransform:"uppercase", letterSpacing:"1px", marginBottom:10, textAlign:"center", fontFamily:T.fontDisplay }}>Radar</div>
            <RadarChart scores={a.scores} size={172}/>
          </div>
        )}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="👥 Público objetivo"><p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.65 }}>{a.publicObj}</p></Card>
        <Card title="🔍 Benchmark"><p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.65 }}>{a.benchmark}</p></Card>
      </div>
      <Card title="✨ Diferencial"><p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.7 }}>{a.diferencial}</p></Card>
      <Card title="⚙️ Stack técnico">
        <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"12px 14px", border:`1px solid ${T.border}` }}>
          <p style={{ margin:0, color:T.text, fontSize:13, fontFamily:"monospace", lineHeight:1.7 }}>{a.stack}</p>
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="✅ Pros" accent="#00F5D4">
          <ul style={{ margin:0, paddingLeft:18 }}>
            {a.pros?.map((p,i) => <li key={i} style={{ color:"#00F5D4", fontSize:14, marginBottom:7, lineHeight:1.5 }}><span style={{ color:T.textMid }}>{p}</span></li>)}
          </ul>
        </Card>
        <Card title="⚠️ Cons" accent="#FF5F7A">
          <ul style={{ margin:0, paddingLeft:18 }}>
            {a.cons?.map((c,i) => <li key={i} style={{ color:"#FF5F7A", fontSize:14, marginBottom:7, lineHeight:1.5 }}><span style={{ color:T.textMid }}>{c}</span></li>)}
          </ul>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="☠️ Mayor riesgo" accent="#FFB547"><p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.65 }}>{a.mayorRiesgo}</p></Card>
        <Card title="⚖️ Riesgo legal"  accent="#6C5CE7"><p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.65 }}>{a.riesgoLegal}</p></Card>
      </div>
      <Card title="📅 Primeros 30 días"><p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.7 }}>{a.primeros30dias}</p></Card>

      <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
        <GlowBtn onClick={onExportPrompt} variant="ghost">⬇️ Exportar Prompt</GlowBtn>
        <GlowBtn onClick={onReanalyze} variant="teal">🔄 Re-analizar</GlowBtn>
      </div>
    </div>
  );
}

// ── MONETIZACION TAB ─────────────────────────────────────────────
function MonetizacionTab({ a, onGoAnalysis }) {
  if (!a) return <EmptyTab icon="💰" title="Nada que ver acá todavía" sub="Generá el análisis primero" onGo={onGoAnalysis}/>;
  return (
    <div style={{ display:"grid", gap:14 }}>
      {a.monetizacion?.map((m,i) => (
        <div key={i} style={{ background:T.surface, border:`1px solid ${i===0?"rgba(108,92,231,0.3)":T.border}`, borderRadius:16, overflow:"hidden", backdropFilter:"blur(12px)", boxShadow:i===0?"0 0 30px rgba(108,92,231,0.15)":"none" }}>
          <div style={{ background:i===0?"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.08))":"rgba(255,255,255,0.03)", padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${T.border}`, position:"relative", overflow:"hidden" }}>
            {i===0&&<div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.6),rgba(0,245,212,0.3),transparent)" }}/>}
            <div>
              <span style={{ fontSize:10, fontWeight:700, color:T.textMute, textTransform:"uppercase", letterSpacing:"0.5px", fontFamily:T.fontDisplay }}>Opción {i+1}{i===0?" · Recomendada":""}</span>
              <div style={{ fontWeight:700, fontSize:16, color:T.text, marginTop:2, fontFamily:T.fontDisplay, letterSpacing:"-0.3px" }}>{m.modelo}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10, color:T.textMute, marginBottom:2, fontFamily:T.fontDisplay }}>MRR est.</div>
              <div style={{ fontWeight:800, fontSize:15, color:"#00F5D4", fontFamily:"monospace" }}>{m.mrrEstimado}</div>
            </div>
          </div>
          <div style={{ padding:"16px 22px", display:"grid", gap:10 }}>
            <p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.65 }}>{m.descripcion}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { label:"✅ PROS",   text:m.pros,   bg:"rgba(0,245,212,0.08)",  border:"rgba(0,245,212,0.2)",  color:"#00F5D4" },
                { label:"⚠️ CONTRAS",text:m.contras,bg:"rgba(255,95,122,0.08)", border:"rgba(255,95,122,0.2)", color:"#FF5F7A" },
              ].map(({label,text,bg,border,color}) => (
                <div key={label} style={{ background:bg, borderRadius:10, padding:"10px 14px", border:`1px solid ${border}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.5px", fontFamily:T.fontDisplay }}>{label}</div>
                  <p style={{ margin:0, fontSize:13, color:T.textMid, lineHeight:1.5 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      {a.publicidad&&(
        <Card title="📣 Estrategia de adquisición">
          <div style={{ display:"grid", gap:10 }}>
            {[
              { label:"🌱 ORGÁNICO",       text:a.publicidad.organico,     bg:"rgba(0,245,212,0.06)",  color:"#00F5D4", border:"rgba(0,245,212,0.15)" },
              { label:"💸 PUBLICIDAD PAGA", text:a.publicidad.pago,         bg:"rgba(108,92,231,0.06)", color:"#6C5CE7", border:"rgba(108,92,231,0.15)" },
              { label:"🦈 DICE EL SHARK",  text:a.publicidad.recomendacion,bg:"rgba(255,255,255,0.03)",color:T.text,   border:T.border, bold:true },
            ].map(({label,text,bg,color,border,bold})=>(
              <div key={label} style={{ background:bg, borderRadius:10, padding:"12px 16px", border:`1px solid ${border}` }}>
                <div style={{ fontSize:10, fontWeight:700, color, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", fontFamily:T.fontDisplay }}>{label}</div>
                <p style={{ margin:0, fontSize:14, color:T.textMid, lineHeight:1.6, fontWeight:bold?600:400 }}>{text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── GTM TAB ──────────────────────────────────────────────────────
function GtmTab({ a, onGoAnalysis }) {
  if (!a) return <EmptyTab icon="🚀" title="Sin plan todavía" sub="Generá el análisis primero" onGo={onGoAnalysis}/>;
  return (
    <div style={{ display:"grid", gap:14 }}>
      <Card title="🚀 Go-to-Market · Primeros 90 días" accent="#6C5CE7"><TimelineGTM gtm90dias={a.gtm90dias}/></Card>
      <Card title="📅 Primeros 30 días (antes de escribir código)" accent="#FF5F7A"><p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.7 }}>{a.primeros30dias}</p></Card>
      <Card title="⚖️ Riesgo legal y regulatorio" accent="#FFB547"><p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.7 }}>{a.riesgoLegal}</p></Card>
    </div>
  );
}

// ── COMMENTS TAB ─────────────────────────────────────────────────
function CommentsTab({ sel, onAdd }) {
  const [author,  setAuthor]  = useState("");
  const [comment, setComment] = useState("");
  const inputStyle = { border:`1px solid ${T.border2}`, borderRadius:10, padding:"10px 14px", fontSize:13, outline:"none", color:T.text, background:"rgba(255,255,255,0.04)", backdropFilter:"blur(8px)", width:"100%", boxSizing:"border-box", fontFamily:T.font, transition:"border-color 0.15s" };

  const submit = () => {
    if (!comment.trim()) return;
    onAdd(sel.id, { id:Date.now(), author:author.trim()||"Anónimo", text:comment.trim(), time:new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}) });
    setComment("");
  };

  return (
    <div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"18px 22px", marginBottom:14, backdropFilter:"blur(12px)" }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14, color:T.text, fontFamily:T.fontDisplay, letterSpacing:"-0.3px" }}>Agregar comentario</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[{val:author,set:setAuthor,ph:"Tu nombre"},{val:comment,set:setComment,ph:"Tu punto de vista (sin filtro)"}].map(({val,set,ph},i)=>(
            <input key={ph} value={val} onChange={e=>set(e.target.value)}
              onKeyDown={e=>i===1&&e.key==="Enter"&&submit()}
              placeholder={ph} style={inputStyle}
              onFocus={e=>(e.target.style.borderColor="rgba(108,92,231,0.5)")}
              onBlur={e=>(e.target.style.borderColor=T.border2)}/>
          ))}
          <GlowBtn onClick={submit}>Enviar</GlowBtn>
        </div>
      </div>
      {!sel.comments?.length ? (
        <div style={{ textAlign:"center", padding:"44px", color:T.textMute, background:T.surface, borderRadius:16, border:`1px solid ${T.border}`, backdropFilter:"blur(8px)" }}>
          <div style={{fontSize:32,marginBottom:10}}>💬</div>
          <div style={{fontWeight:600,color:T.textMid,marginBottom:4,fontFamily:T.fontDisplay}}>Nadie dijo nada todavía</div>
          <div style={{fontSize:12}}>Sé el primero en opinar</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {sel.comments.map(c=>(
            <div key={c.id} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 18px", backdropFilter:"blur(8px)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ fontWeight:700, fontSize:13, color:T.text, fontFamily:T.fontDisplay }}>{c.author}</span>
                <span style={{ fontSize:11, color:T.textMute, fontFamily:"monospace" }}>{c.time}</span>
              </div>
              <p style={{ margin:0, color:T.textMid, fontSize:14, lineHeight:1.6 }}>{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ROOT APP ─────────────────────────────────────────────────────
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

  const sel = ideas.find(i => i.id === selectedId) || ideas[0] || null;
  const a   = sel?.analysis;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleAdd = async draft => {
    const created = await addIdea(draft);
    if (created) { setSelectedId(created.id); setWizard(false); setTab("vote"); setSidebarOpen(false); }
  };

  const handleDelete = async id => {
    const ok = await deleteIdea(id);
    if (ok) setSelectedId(ideas.filter(i => i.id !== id)[0]?.id || null);
  };

  const analyze = async () => {
    if (analyzeRef.current || analyzing || !sel) return;
    analyzeRef.current = true;
    setAnalyzing(true);
    const ideaId = sel.id;
    try {
      const res  = await fetch("/api/shark", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ prompt:ANALYZE_PROMPT(sel.title, sel.description) }) });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      let jsonText = text.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
      const fb = jsonText.indexOf("{"), lb = jsonText.lastIndexOf("}");
      if (fb!==-1&&lb!==-1) jsonText = jsonText.slice(fb,lb+1);
      const parsed   = JSON.parse(jsonText);
      const avgScore = Object.values(parsed.scores).reduce((a,b)=>a+b,0)/5;
      await saveAnalysis(ideaId, {...parsed, avgScore});
    } catch(err) {
      await saveAnalysis(ideaId, {error:true, msg:err.message});
    }
    analyzeRef.current = false;
    setAnalyzing(false);
  };

  const reanalyze = () => { updateIdea(selectedId, {analysis:null}); setTimeout(analyze, 200); };

  const handleExportPrompt = () => {
    if (!sel||!a) return;
    const score = a.avgScore?.toFixed(1)||"N/A";
    const md = `# Prompt de Construccion — ${sel.title}\n\n> Score: ${score}/10\n\n## CONTEXTO\n**Idea:** ${sel.title}\n**Descripcion:** ${sel.description}\n**Stack:** ${a.stack||"N/A"}\n**Publico:** ${a.publicObj||"N/A"}\n**Diferencial:** ${a.diferencial||"N/A"}\n**Mayor riesgo:** ${a.mayorRiesgo||"N/A"}\n\n## PROS\n${(a.pros||[]).map(p=>"- "+p).join("\n")}\n\n## CONS\n${(a.cons||[]).map(c=>"- "+c).join("\n")}\n\n## MONETIZACION PRIMARIA\n${a.monetizacion?.[0]?`${a.monetizacion[0].modelo}: ${a.monetizacion[0].descripcion} (MRR: ${a.monetizacion[0].mrrEstimado})`:"N/A"}\n\n## PRIMEROS 30 DIAS\n${a.primeros30dias||"N/A"}\n\n## MISION\nSos un experto en producto digital y AI. Construi este producto paso a paso:\n\n**PASO 1 — Validacion:** Define las 3 preguntas criticas y como pre-vender.\n**PASO 2 — MVP:** Feature minima, genera codigo del core.\n**PASO 3 — Primeros clientes:** Como conseguir los primeros 10 pagos.\n**PASO 4 — Escala:** Cuando encontraste PMF y que feature sigue.\n\nEmpeza por PASO 1 y espera mi confirmacion.`;
    exportMarkdown(`prompt-${sel.title.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}.md`, md);
  };

  // ── LOADING ────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0B0B0F", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <GlobalStyles/>
      <BackgroundEffects/>
      <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{ animation:"spin 3s linear infinite", display:"inline-block" }}><SharkLogo size={64}/></div>
        <div style={{ color:T.textMid, fontWeight:600, marginTop:20, fontSize:14, fontFamily:"'Sora',sans-serif" }}>Cargando Shark Board...</div>
      </div>
    </div>
  );

  if (ideas.length === 0 && !wizard) return (
    <>
      <GlobalStyles/>
      <EmptyBoard onAdd={()=>setWizard(true)}/>
      {wizard&&<Wizard onSave={handleAdd} onClose={()=>setWizard(false)}/>}
    </>
  );

  // ── MAIN APP ───────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#0B0B0F", color:T.text, position:"relative" }}>
      <GlobalStyles/>
      <BackgroundEffects/>

      {/* TOP NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:50, height:62, background:"rgba(11,11,15,0.8)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}`, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 0 rgba(255,255,255,0.04)" }}>
        {/* Left: hamburger + logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {isMobile&&(
            <button onClick={()=>setSidebarOpen(o=>!o)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textMid, padding:4, fontSize:20 }}>☰</button>
          )}
          <SharkLogo size={36}/>
          <div>
            <div style={{ fontWeight:700, fontSize:16, letterSpacing:"-0.5px", fontFamily:"'Sora',sans-serif", lineHeight:1.2, color:T.white }}>
              Shark <span style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Board</span>
            </div>
            <div style={{ color:T.textMute, fontSize:10, fontFamily:"'Sora',sans-serif" }}>{ideas.length} ideas · {ideas.filter(i=>i.analysis&&!i.analysis.error).length} analizadas</div>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={()=>setView(v=>v==="board"?"ranking":"board")}
            style={{ background:view==="ranking"?"rgba(108,92,231,0.2)":"rgba(255,255,255,0.04)", color:view==="ranking"?"#6C5CE7":T.textMid, border:`1px solid ${view==="ranking"?"rgba(108,92,231,0.4)":T.border}`, borderRadius:9, padding:"7px 14px", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.15s" }}>
            {view==="ranking"?"← Board":"📊 Comparar"}
          </button>
          <button onClick={()=>setWizard(true)}
            style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:9, padding:"8px 18px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 0 16px rgba(108,92,231,0.4)" }}>
            + Idea
          </button>
        </div>
      </nav>

      {/* RANKING VIEW */}
      {view==="ranking"&&(
        <div style={{ maxWidth:1000, margin:"0 auto", position:"relative", zIndex:1 }}>
          <Comparador ideas={ideas}/>
        </div>
      )}

      {/* BOARD VIEW */}
      {view==="board"&&(
        <div style={{ display:"flex", height:"calc(100vh - 62px)", position:"relative" }}>
          {/* Mobile overlay */}
          {isMobile&&sidebarOpen&&(
            <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:40, backdropFilter:"blur(4px)" }}/>
          )}

          {/* SIDEBAR */}
          <div style={{
            width:260, flexShrink:0,
            background:"#1A1A24",
            borderRight:"1px solid rgba(255,255,255,0.08)",
            overflowY:"auto",
            display:"flex", flexDirection:"column",
            ...(isMobile?{position:"fixed",left:sidebarOpen?0:-264,top:62,height:"calc(100vh - 62px)",zIndex:45,transition:"left 0.25s cubic-bezier(.4,0,.2,1)"}:{}),
          }}>
            {/* Sidebar header */}
            <div style={{ padding:"14px 14px 8px", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"1.4px", fontFamily:"'Sora',sans-serif" }}>
                IDEAS · {ideas.length}
              </div>
            </div>

            {/* Ideas list */}
            <div style={{ flex:1, overflowY:"auto", padding:"8px 8px" }}>
              {ideas.map(idea => {
                const isSelected      = idea.id === (sel?.id);
                const stg             = STAGES.find(x=>x.key===idea.stage)||STAGES[0];
                const score           = idea.analysis?.avgScore;
                const sc              = score ? scoreColor(score) : null;
                const isAnalyzingThis = analyzing && sel?.id===idea.id;
                const voteCount       = (idea.votes||[]).length;
                const upVotes         = (idea.votes||[]).filter(v=>v.vote==="up").length;

                return (
                  <div key={idea.id}
                    onClick={()=>{ setSelectedId(idea.id); setTab("analysis"); setSidebarOpen(false); }}
                    style={{
                      borderRadius:8,
                      padding:"10px 11px 10px 13px",
                      cursor:"pointer",
                      marginBottom:3,
                      background: isSelected ? "rgba(108,92,231,0.22)" : "transparent",
                      border: `1px solid ${isSelected ? "rgba(108,92,231,0.5)" : "transparent"}`,
                      borderLeft: isSelected ? "3px solid #6C5CE7" : "3px solid transparent",
                      transition:"all 0.12s",
                    }}>

                    {/* TITLE — always prominent, first thing you see */}
                    <div style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.75)",
                      lineHeight: 1.3,
                      marginBottom: 6,
                      fontFamily:"'Sora',sans-serif",
                      wordBreak:"break-word",
                    }}>
                      {idea.title}
                    </div>

                    {/* Score + Stage row — BELOW title */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:11 }}>{stg.emoji}</span>
                        <span style={{ fontSize:11, color: isSelected ? stg.color : "rgba(255,255,255,0.35)", fontWeight:600, fontFamily:"'Sora',sans-serif" }}>
                          {stg.label}
                        </span>
                      </div>

                      {isAnalyzingThis ? (
                        <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)", animation:"pulse 1.5s infinite" }}>⏳</span>
                      ) : sc ? (
                        <span style={{
                          color: sc,
                          fontWeight:800,
                          fontSize:13,
                          fontFamily:"monospace",
                          background:"rgba(0,0,0,0.35)",
                          borderRadius:5,
                          padding:"1px 8px",
                          border:`1px solid ${sc}40`,
                          letterSpacing:"0.5px",
                        }}>
                          {score.toFixed(1)}
                        </span>
                      ) : (
                        <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>sin análisis</span>
                      )}
                    </div>

                    {/* Vote pills — only if voted */}
                    {voteCount > 0 && (
                      <div style={{ display:"flex", gap:5, marginTop:7 }}>
                        <span style={{ fontSize:10, fontWeight:600, color:"#00F5D4", background:"rgba(0,245,212,0.1)", borderRadius:99, padding:"1px 8px", border:"1px solid rgba(0,245,212,0.15)" }}>👍 {upVotes}</span>
                        <span style={{ fontSize:10, fontWeight:600, color:"#FF5F7A", background:"rgba(255,95,122,0.1)", borderRadius:99, padding:"1px 8px", border:"1px solid rgba(255,95,122,0.15)" }}>👎 {voteCount-upVotes}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN PANEL */}
          {sel ? (
            <div style={{ flex:1, overflowY:"auto", minWidth:0, position:"relative", zIndex:1 }}>
              {/* Idea header */}
              <div style={{ background:"rgba(17,17,24,0.7)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}`, padding:"18px 24px 0", position:"sticky", top:0, zIndex:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9, flexWrap:"wrap" }}>
                      <StageBadge stage={sel.stage}/>
                      <select value={sel.stage} onChange={e=>updateIdea(sel.id,{stage:e.target.value})}
                        style={{ border:`1px solid ${T.border}`, borderRadius:8, padding:"3px 8px", fontSize:11, color:T.textMid, background:"rgba(255,255,255,0.04)", cursor:"pointer", fontFamily:"'Sora',sans-serif", backdropFilter:"blur(8px)", outline:"none" }}>
                        {STAGES.map(s=><option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                      </select>
                    </div>
                    <h1 style={{ margin:"0 0 7px", fontSize:20, fontWeight:700, letterSpacing:"-0.5px", color:T.text, lineHeight:1.3, fontFamily:"'Sora',sans-serif" }}>{sel.title}</h1>
                    <p style={{ margin:0, color:T.textMid, fontSize:13, lineHeight:1.65 }}>{sel.description}</p>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, marginLeft:18, flexShrink:0 }}>
                    {a?.avgScore&&(
                      <div style={{ textAlign:"center", background:"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.08))", borderRadius:14, padding:"10px 16px", minWidth:80, border:"1px solid rgba(108,92,231,0.2)", boxShadow:"0 0 20px rgba(108,92,231,0.15)", position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.5),rgba(0,245,212,0.3),transparent)" }}/>
                        <div style={{ fontSize:9, color:T.textMute, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'Sora',sans-serif" }}>SCORE</div>
                        <div style={{ fontSize:32, fontWeight:900, fontFamily:"monospace", color:scoreColor(a.avgScore), lineHeight:1.1, margin:"3px 0", textShadow:`0 0 16px ${scoreColor(a.avgScore)}50` }}>{a.avgScore.toFixed(1)}</div>
                        <div style={{ fontSize:10, color:scoreColor(a.avgScore), fontWeight:700, fontFamily:"'Sora',sans-serif" }}>{scoreLabel(a.avgScore)}</div>
                      </div>
                    )}
                    <div style={{ display:"flex", gap:6 }}>
                      {a&&!a.error&&(
                        <GlowBtn onClick={()=>setPitchIdea(sel)} size="sm">📋 Pitch</GlowBtn>
                      )}
                      <GlowBtn onClick={()=>handleDelete(sel.id)} variant="danger" size="sm">🗑</GlowBtn>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display:"flex", overflowX:"auto", gap:2 }}>
                  {TABS(sel).map(t => (
                    <button key={t.key} onClick={()=>setTab(t.key)}
                      style={{ border:"none", background:"transparent", borderBottom:`2px solid ${tab===t.key?"#6C5CE7":"transparent"}`, color:tab===t.key?T.text:T.textMute, padding:"10px 16px", cursor:"pointer", fontSize:13, fontWeight:tab===t.key?700:500, marginBottom:-1, whiteSpace:"nowrap", transition:"all 0.15s", fontFamily:"'Sora',sans-serif" }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div style={{ padding:"22px 20px", animation:"fadeUp 0.2s ease" }}>
                {tab==="vote"&&(
                  <div>
                    <VotingPanel idea={sel} onVote={addVote}/>
                    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"22px", textAlign:"center", backdropFilter:"blur(12px)" }}>
                      <div style={{ fontSize:17, color:T.text, fontWeight:700, marginBottom:7, fontFamily:"'Sora',sans-serif", letterSpacing:"-0.3px" }}>🦈 ¿Listo para el veredicto?</div>
                      <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>Votá primero para no contaminar tu juicio</div>
                      <GlowBtn onClick={()=>setTab("analysis")}>Ver qué dice el Shark →</GlowBtn>
                    </div>
                  </div>
                )}
                {tab==="analysis"     && <AnalysisTab     sel={sel} a={a} analyzing={analyzing} onAnalyze={analyze} onReanalyze={reanalyze} onExportPrompt={handleExportPrompt}/>}
                {tab==="monetizacion" && <MonetizacionTab a={a} onGoAnalysis={()=>setTab("analysis")}/>}
                {tab==="gtm"          && <GtmTab          a={a} onGoAnalysis={()=>setTab("analysis")}/>}
                {tab==="comments"     && <CommentsTab     sel={sel} onAdd={addComment}/>}
              </div>
            </div>
          ) : (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
              <div style={{ textAlign:"center", color:T.textMute }}>
                <SharkLogo size={56}/>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:6, marginTop:20, color:T.textMid, fontFamily:"'Sora',sans-serif" }}>Seleccioná una idea</div>
                <div style={{ fontSize:13 }}>o agregá una con + Idea</div>
              </div>
            </div>
          )}
        </div>
      )}

      {wizard    && <Wizard         onSave={handleAdd}   onClose={()=>setWizard(false)}/>}
      {pitchIdea && <PitchDeckModal idea={pitchIdea}     analysis={pitchIdea.analysis} onClose={()=>setPitchIdea(null)}/>}
    </div>
  );
}
