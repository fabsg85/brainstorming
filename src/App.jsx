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
import BudgetTab         from "./components/BudgetTab";
import HipotesisTab      from "./components/HipotesisTab";
import PersonasTab       from "./components/PersonasTab";
import CompetidoresTab   from "./components/CompetidoresTab";
import CanvasTab         from "./components/CanvasTab";
import PreSellTab        from "./components/PreSellTab";

// ── FONTS + GLOBAL STYLES ────────────────────────────────────────
const GlobalStyles = ({ light }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── DARK THEME (default) ── */
    :root {
      --bg:       #0B0B0F;
      --bg2:      #111118;
      --bg3:      #16161F;
      --sidebar:  #1A1A24;
      --nav:      rgba(11,11,15,0.85);
      --surface:  rgba(255,255,255,0.04);
      --surface2: rgba(255,255,255,0.07);
      --border:   rgba(255,255,255,0.08);
      --border2:  rgba(255,255,255,0.14);
      --text:     rgba(255,255,255,0.92);
      --textMid:  rgba(255,255,255,0.52);
      --textMute: rgba(255,255,255,0.26);
      --scrollbg: #0B0B0F;
      --inputbg:  rgba(255,255,255,0.05);
      --inputbdr: rgba(255,255,255,0.09);
      --inputclr: rgba(255,255,255,0.75);
      --inputph:  rgba(255,255,255,0.22);
      --cardsh:   0 4px 24px rgba(0,0,0,0.3);
    }

    /* ── LIGHT THEME ── */
    ${light ? `
    :root {
      --bg:       #F4F4F8;
      --bg2:      #FFFFFF;
      --bg3:      #EEEEF4;
      --sidebar:  #FFFFFF;
      --nav:      rgba(244,244,248,0.92);
      --surface:  rgba(0,0,0,0.03);
      --surface2: rgba(0,0,0,0.05);
      --border:   rgba(0,0,0,0.08);
      --border2:  rgba(0,0,0,0.14);
      --text:     rgba(0,0,0,0.88);
      --textMid:  rgba(0,0,0,0.52);
      --textMute: rgba(0,0,0,0.3);
      --scrollbg: #F4F4F8;
      --inputbg:  rgba(0,0,0,0.04);
      --inputbdr: rgba(0,0,0,0.1);
      --inputclr: rgba(0,0,0,0.8);
      --inputph:  rgba(0,0,0,0.28);
      --cardsh:   0 2px 12px rgba(0,0,0,0.08);
    }` : ""}

    html, body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      transition: background 0.25s, color 0.25s;
    }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--scrollbg); }
    ::-webkit-scrollbar-thumb { background: #6C5CE7; border-radius: 99px; }
    input, textarea, select { color: var(--inputclr) !important; background: transparent; }
    input::placeholder, textarea::placeholder { color: var(--inputph) !important; }
    button { transition: opacity 0.12s, transform 0.1s; }
    button:active:not(:disabled) { opacity: 0.82; transform: scale(0.98); }
    textarea { resize: vertical; }
    @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.94)} }
    @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(108,92,231,0.3)} 50%{box-shadow:0 0 40px rgba(108,92,231,0.6),0 0 20px rgba(0,245,212,0.2)} }
    @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-40px) scale(1.04)} 66%{transform:translate(-20px,30px) scale(0.97)} }
  `}</style>
);

// ── NOISE + BLOB BACKGROUND ──────────────────────────────────────
const BackgroundEffects = ({ light }) => (
  <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
    <div style={{ position:"absolute", inset:0, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, backgroundSize:"200px 200px", opacity: light ? 0.25 : 0.5 }}/>
    <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"#6C5CE7", filter:"blur(140px)", opacity: light ? 0.04 : 0.06, top:-200, left:-200, animation:"blobFloat 20s ease-in-out infinite" }}/>
    <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"#00F5D4", filter:"blur(120px)", opacity: light ? 0.04 : 0.05, top:"40%", right:-150, animation:"blobFloat 16s ease-in-out infinite", animationDelay:"-8s" }}/>
    <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"#6C5CE7", filter:"blur(100px)", opacity: light ? 0.03 : 0.04, bottom:-100, left:"30%", animation:"blobFloat 18s ease-in-out infinite", animationDelay:"-14s" }}/>
  </div>
);

const ANALYZE_PROMPT = (title, description, industry = "") => `Sos un Shark board: inversor brutal, técnico, rioplatense. Analizá esta idea y devolvé SOLO JSON válido. Sin markdown, sin backticks, sin texto extra. Empezá con { terminá con }.

IDEA: ${title}
DESCRIPCIÓN: ${description}
INDUSTRIA: ${industry}

IMPORTANTE: Todos los campos son obligatorios. El JSON debe ser parseable.

{
  "pagaHoy": "quién paga, cuánto, cómo",
  "publicObj": "cliente específico con contexto LATAM",
  "diferencial": "ventaja real, difícil de copiar",
  "benchmark": "competidores reales con nombre",
  "stack": "stack técnico concreto",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2", "con 3"],
  "veredicto": "una línea brutal, directa, sarcástica",
  "mayorRiesgo": "el riesgo que puede matar esto",
  "monetizacion": [
    { "modelo": "nombre", "descripcion": "desc", "pros": "ventaja", "contras": "desventaja", "mrrEstimado": "rango USD" },
    { "modelo": "nombre", "descripcion": "desc", "pros": "ventaja", "contras": "desventaja", "mrrEstimado": "rango USD" },
    { "modelo": "nombre", "descripcion": "desc", "pros": "ventaja", "contras": "desventaja", "mrrEstimado": "rango USD" }
  ],
  "publicidad": { "organico": "canales orgánicos", "pago": "si vale y cuándo", "recomendacion": "qué hacer primero" },
  "gtm90dias": "plan 90 días exactamente 3 frases separadas por punto",
  "riesgoLegal": "riesgos regulatorios LATAM",
  "primeros30dias": "3 acciones concretas antes de escribir código",
  "scoreRationale": { "traccion": "1 línea", "moat": "1 línea", "monetizacion": "1 línea", "velocidad": "1 línea", "mercado": "1 línea" },
  "scores": { "traccion": 0, "moat": 0, "monetizacion": 0, "velocidad": 0, "mercado": 0 },
  "nextStep": { "accion": "qué hacer hoy", "razon": "por qué esta acción primero", "urgencia": "alta|media|baja" },
  "hipotesis": [
    { "hipotesis": "suposición crítica 1", "porqueCritica": "si falla esto, el negocio muere", "riesgo": "alta|media|baja", "metodo": "cómo testearla", "metrica": "cómo saber si pasó o falló", "tiempoEstimado": "X días", "costoEstimado": "$X", "siFalla": "qué hacer si esta hipótesis es falsa" },
    { "hipotesis": "suposición crítica 2", "porqueCritica": "impacto si falla", "riesgo": "alta|media|baja", "metodo": "método", "metrica": "métrica", "tiempoEstimado": "X días", "costoEstimado": "$X", "siFalla": "plan B" },
    { "hipotesis": "suposición crítica 3", "porqueCritica": "impacto si falla", "riesgo": "alta|media|baja", "metodo": "método", "metrica": "métrica", "tiempoEstimado": "X días", "costoEstimado": "$X", "siFalla": "plan B" }
  ],
  "personas": [
    { "nombre": "nombre ficticio realista", "rol": "cargo y empresa", "edad": "rango de edad", "frase": "quote que diría sobre el problema", "frustracion": "qué lo frustra hoy", "objetivo": "qué quiere lograr", "disposicionPago": "cuánto pagaría y por qué", "canal": "dónde lo encontramos", "triggers": ["trigger de compra 1", "trigger 2"] },
    { "nombre": "nombre ficticio 2", "rol": "cargo", "edad": "rango", "frase": "quote", "frustracion": "frustración", "objetivo": "objetivo", "disposicionPago": "disposición", "canal": "canal", "triggers": ["trigger 1", "trigger 2"] }
  ],
  "personaInsight": "qué tienen en común estos dos perfiles y cómo impacta el go-to-market",
  "canvas": {
    "propuestaValor": "qué valor único entregás",
    "segmentoClientes": ["segmento 1", "segmento 2"],
    "canales": ["canal 1", "canal 2"],
    "relacionClientes": "cómo te relacionás con clientes",
    "actividadesClave": ["actividad 1", "actividad 2", "actividad 3"],
    "recursosClave": ["recurso 1", "recurso 2"],
    "sociosClave": ["socio/partner 1", "socio 2"],
    "estructuraCostos": ["costo principal 1", "costo 2", "costo 3"],
    "fuentesIngreso": ["ingreso 1", "ingreso 2"]
  },
  "budget": {
    "items": [
      GENERA entre 8 y 14 items REALES para esta idea específica. Para cada item:
      - "id": número entero incremental
      - "category": una de: "infra" | "ai" | "tools" | "ads" | "freelancer" | "legal" | "other"
      - "description": descripción concreta del gasto (ej: "Vercel Pro para el frontend", "Claude API — estimado 50K tokens/día", "Meta Ads — test inicial de audiencia")
      - "amount": monto en USD (realista para el tipo de producto y mercado LATAM)
      - "phase": una de: "MVP" | "Pre-lanzamiento" | "Mes 1" | "Mes 2-3" | "Recurrente"
      - "recurring": true si es gasto mensual recurrente, false si es one-time

      SIEMPRE incluí: dominio, hosting, al menos 1 item de AI/API, herramientas de desarrollo.
      Si la idea usa AI generativa: calculá el costo de API según el uso esperado.
      Si es un SaaS: incluí costos de DB, auth, email transaccional.
      Si requiere validación de mercado: incluí presupuesto de ads para smoke test.
      Sé REALISTA: ni muy bajo ni inflado. Un MVP típico en LATAM cuesta $500-2000 one-time + $100-300/mes recurrente.
    ],
    "notes": "Budget estimado por el Shark basado en el stack y modelo de negocio. Ajustá según proveedores locales.",
    "currency": "USD"
  }
}`;

// ── EMPTY BOARD ──────────────────────────────────────────────────
function EmptyBoard({ onAdd }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0B0B0F", display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
      <BackgroundEffects light={lightMode}/>
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
            <div key={l} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:99, padding:"7px 14px", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)", fontFamily:"'Sora',sans-serif", backdropFilter:"blur(8px)" }}>
              {e} {l}
            </div>
          ))}
        </div>

        <button onClick={onAdd} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:14, padding:"16px 44px", color:"#fff", fontWeight:700, fontSize:16, cursor:"pointer", fontFamily:"'Sora',sans-serif", letterSpacing:"-0.3px", boxShadow:"0 0 40px rgba(108,92,231,0.5), 0 0 20px rgba(0,245,212,0.2)" }}>
          🦈 Tirar la primera idea
        </button>
        <div style={{ marginTop:16, fontSize:12, color:"var(--textMute)" }}>No hace falta tener todo claro. El Shark se encarga.</div>
      </div>
    </div>
  );
}

// ── ANALYSIS TAB ─────────────────────────────────────────────────
function AnalysisTab({ sel, a, analyzing, onAnalyze, onReanalyze, onExportPrompt, onGoTab }) {
  if (!a && !analyzing) return (
    <div style={{ textAlign:"center", padding:"72px 20px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:20, backdropFilter:"blur(12px)" }}>
      {/* Animated shark logo */}
      <div style={{ display:"inline-flex", marginBottom:24, animation:"glowPulse 3s ease-in-out infinite" }}>
        <SharkLogo size={64}/>
      </div>
      <div style={{ fontWeight:700, fontSize:22, marginBottom:10, fontFamily:"'Sora',sans-serif", color:"var(--text)", letterSpacing:"-0.5px" }}>Que el Shark hable</div>
      <div style={{ color:"var(--textMute)", fontSize:14, marginBottom:36, maxWidth:360, margin:"10px auto 36px", lineHeight:1.7 }}>
        Scoring calibrado · Monetización · GTM · Riesgo legal · Veredicto sin anestesia
      </div>
      <button onClick={onAnalyze} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:12, padding:"14px 36px", color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 0 30px rgba(108,92,231,0.5)" }}>
        🦈 Analizar esta idea
      </button>
    </div>
  );

  if (analyzing) return (
    <div style={{ textAlign:"center", padding:"80px 20px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:20, backdropFilter:"blur(12px)" }}>
      <div style={{ animation:"pulse 1.6s ease-in-out infinite", display:"inline-block" }}><SharkLogo size={64}/></div>
      <div style={{ color:"var(--text)", fontWeight:700, fontSize:20, marginTop:24, fontFamily:"'Sora',sans-serif", letterSpacing:"-0.3px" }}>El Shark está pensando...</div>
      <div style={{ color:"var(--textMute)", fontSize:13, marginTop:8, marginBottom:28 }}>No lo toques. Esto tarda unos segundos.</div>
      <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
        {SCORE_CRITERIA.map((c,i) => (
          <span key={c.key} style={{ fontSize:11, color:"var(--textMid)", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:99, padding:"4px 12px", fontWeight:600, fontFamily:"'Sora',sans-serif", animation:`pulse 1.6s ${i*0.2}s infinite` }}>
            {c.icon} {c.label}
          </span>
        ))}
      </div>
    </div>
  );

  if (a.error) return (
    <div style={{ textAlign:"center", padding:"52px 20px", background:"rgba(255,95,122,0.06)", border:"1px solid rgba(255,95,122,0.2)", borderRadius:20, backdropFilter:"blur(12px)" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>😬</div>
      <div style={{ color:"#FF5F7A", fontWeight:700, fontSize:17, marginBottom:7, fontFamily:"'Sora',sans-serif" }}>Algo salió mal</div>
      <div style={{ color:"var(--textMute)", fontSize:13, marginBottom:22 }}>{a.msg||"El Shark está de mal humor. Intentá de nuevo."}</div>
      <GlowBtn onClick={onReanalyze} variant="ghost">🔄 Reintentar</GlowBtn>
    </div>
  );

  // Score evolution delta
  const prevScore = a.prevScore || null;
  const scoreDelta = prevScore ? (a.avgScore - prevScore).toFixed(1) : null;

  // Next step CTA config
  const getNextStep = (score, a) => {
    if (!score) return null;
    if (score >= 7.5) return { tab:"canvas",    icon:"📋", label:"Generá el Lean Canvas", sub:"Tu idea tiene score alto — siguiente paso: estructurala formalmente", color:"#6C5CE7", bg:"rgba(108,92,231,0.15)", border:"rgba(108,92,231,0.3)" };
    if (score >= 5)   return { tab:"hipotesis",  icon:"🧪", label:"Definí tus hipótesis de validación", sub:"Antes de construir, testéa estos supuestos críticos — alguno puede cambiar todo", color:"#FFB547", bg:"rgba(255,181,71,0.12)", border:"rgba(255,181,71,0.25)" };
    return              { tab:"analysis",   icon:"🔄", label:"El Shark dice: pivoteá antes de seguir", sub:"Score bajo. Describí el cambio y re-analizá antes de invertir más tiempo", color:"#FF5F7A", bg:"rgba(255,95,122,0.12)", border:"rgba(255,95,122,0.25)", action:"reanalyze" };
  };
  const nextStep = getNextStep(a.avgScore, a);

  return (
    <div style={{ display:"grid", gap:14, animation:"fadeUp 0.3s ease" }}>
      <VerdictBanner score={a.avgScore}/>

      {/* Score evolution */}
      {scoreDelta && (
        <div style={{ background: parseFloat(scoreDelta) >= 0 ? "rgba(0,245,212,0.08)" : "rgba(255,95,122,0.08)", border: `1px solid ${parseFloat(scoreDelta) >= 0 ? "rgba(0,245,212,0.2)" : "rgba(255,95,122,0.2)"}`, borderRadius:12, padding:"12px 18px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>{parseFloat(scoreDelta) >= 0 ? "📈" : "📉"}</span>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color: parseFloat(scoreDelta) >= 0 ? "#00F5D4" : "#FF5F7A", fontFamily:"'Sora',sans-serif" }}>
              Score {parseFloat(scoreDelta) >= 0 ? "subió" : "bajó"} {parseFloat(scoreDelta) >= 0 ? "+" : ""}{scoreDelta} puntos desde el análisis anterior
            </div>
            <div style={{ fontSize:11, color:"var(--textMute)", marginTop:2 }}>
              {prevScore?.toFixed(1)} → {a.avgScore?.toFixed(1)} · {a.analyzedAt ? new Date(a.analyzedAt).toLocaleDateString("es-AR") : "hoy"}
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:14, alignItems:"start" }}>
        <Card title="🎯 Scoring detallado">
          {a.pagaHoy && (
            <div style={{ background:"rgba(0,245,212,0.08)", border:"1px solid rgba(0,245,212,0.2)", borderRadius:10, padding:"10px 14px", marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#00F5D4", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'Sora',sans-serif" }}>💸 ¿Pagan por esto hoy?</div>
              <p style={{ margin:0, fontSize:13, color:"var(--textMid)", lineHeight:1.5 }}>{a.pagaHoy}</p>
            </div>
          )}
          {SCORE_CRITERIA.map(c => (
            <ScoreBar key={c.key} icon={c.icon} label={c.label} value={a.scores?.[c.key]} rationale={a.scoreRationale?.[c.key]}/>
          ))}
        </Card>
        {a.scores && (
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:"18px", backdropFilter:"blur(12px)", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"var(--textMute)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:10, textAlign:"center", fontFamily:"'Sora',sans-serif" }}>Radar</div>
            <RadarChart scores={a.scores} size={172}/>
          </div>
        )}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="👥 Público objetivo"><p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.65 }}>{a.publicObj}</p></Card>
        <Card title="🔍 Benchmark"><p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.65 }}>{a.benchmark}</p></Card>
      </div>
      <Card title="✨ Diferencial"><p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.7 }}>{a.diferencial}</p></Card>
      <Card title="⚙️ Stack técnico">
        <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"12px 14px", border:"1px solid var(--border)" }}>
          <p style={{ margin:0, color:"var(--text)", fontSize:13, fontFamily:"monospace", lineHeight:1.7 }}>{a.stack}</p>
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="✅ Pros" accent="#00F5D4">
          <ul style={{ margin:0, paddingLeft:18 }}>
            {a.pros?.map((p,i) => <li key={i} style={{ color:"#00F5D4", fontSize:14, marginBottom:7, lineHeight:1.5 }}><span style={{ color:"var(--textMid)" }}>{p}</span></li>)}
          </ul>
        </Card>
        <Card title="⚠️ Cons" accent="#FF5F7A">
          <ul style={{ margin:0, paddingLeft:18 }}>
            {a.cons?.map((c,i) => <li key={i} style={{ color:"#FF5F7A", fontSize:14, marginBottom:7, lineHeight:1.5 }}><span style={{ color:"var(--textMid)" }}>{c}</span></li>)}
          </ul>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="☠️ Mayor riesgo" accent="#FFB547"><p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.65 }}>{a.mayorRiesgo}</p></Card>
        <Card title="⚖️ Riesgo legal"  accent="#6C5CE7"><p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.65 }}>{a.riesgoLegal}</p></Card>
      </div>
      <Card title="📅 Primeros 30 días"><p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.7 }}>{a.primeros30dias}</p></Card>

      {/* Next step CTA */}
      {nextStep && (
        <div style={{ background:nextStep.bg, border:`1px solid ${nextStep.border}`, borderRadius:16, padding:"20px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:14 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:nextStep.color, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6, fontFamily:"'Sora',sans-serif" }}>🦈 Próximo paso recomendado</div>
            <div style={{ fontWeight:700, fontSize:16, color:"var(--text)", marginBottom:4, fontFamily:"'Sora',sans-serif", letterSpacing:"-0.3px" }}>{nextStep.icon} {nextStep.label}</div>
            <div style={{ fontSize:13, color:"var(--textMute)", lineHeight:1.5 }}>{nextStep.sub}</div>
          </div>
          <button onClick={()=>nextStep.action==="reanalyze" ? onReanalyze() : onGoTab(nextStep.tab)}
            style={{ background:`linear-gradient(135deg,${nextStep.color}CC,${nextStep.color}88)`, border:"none", borderRadius:10, padding:"11px 20px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Sora',sans-serif", flexShrink:0, whiteSpace:"nowrap", boxShadow:`0 0 16px ${nextStep.color}40` }}>
            Ir →
          </button>
        </div>
      )}

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
        <div key={i} style={{ background:"var(--surface)", border:`1px solid ${i===0?"rgba(108,92,231,0.3)":"var(--border)"}, borderRadius:16, overflow:"hidden", backdropFilter:"blur(12px)", boxShadow:i===0?"0 0 30px rgba(108,92,231,0.15)":"none" }}>
          <div style={{ background:i===0?"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.08))":"rgba(255,255,255,0.03)", padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid var(--border)", position:"relative", overflow:"hidden" }}>
            {i===0&&<div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.6),rgba(0,245,212,0.3),transparent)" }}/>}
            <div>
              <span style={{ fontSize:10, fontWeight:700, color:"var(--textMute)", textTransform:"uppercase", letterSpacing:"0.5px", fontFamily:"'Sora',sans-serif" }}>Opción {i+1}{i===0?" · Recomendada":""}</span>
              <div style={{ fontWeight:700, fontSize:16, color:"var(--text)", marginTop:2, fontFamily:"'Sora',sans-serif", letterSpacing:"-0.3px" }}>{m.modelo}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10, color:"var(--textMute)", marginBottom:2, fontFamily:"'Sora',sans-serif" }}>MRR est.</div>
              <div style={{ fontWeight:800, fontSize:15, color:"#00F5D4", fontFamily:"monospace" }}>{m.mrrEstimado}</div>
            </div>
          </div>
          <div style={{ padding:"16px 22px", display:"grid", gap:10 }}>
            <p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.65 }}>{m.descripcion}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { label:"✅ PROS",   text:m.pros,   bg:"rgba(0,245,212,0.08)",  border:"rgba(0,245,212,0.2)",  color:"#00F5D4" },
                { label:"⚠️ CONTRAS",text:m.contras,bg:"rgba(255,95,122,0.08)", border:"rgba(255,95,122,0.2)", color:"#FF5F7A" },
              ].map(({label,text,bg,border,color}) => (
                <div key={label} style={{ background:bg, borderRadius:10, padding:"10px 14px", border:`1px solid ${border}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.5px", fontFamily:"'Sora',sans-serif" }}>{label}</div>
                  <p style={{ margin:0, fontSize:13, color:"var(--textMid)", lineHeight:1.5 }}>{text}</p>
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
              { label:"🦈 DICE EL SHARK",  text:a.publicidad.recomendacion,bg:"rgba(255,255,255,0.03)",color:"var(--text)",   border:"var(--border)", bold:true },
            ].map(({label,text,bg,color,border,bold})=>(
              <div key={label} style={{ background:bg, borderRadius:10, padding:"12px 16px", border:`1px solid ${border}` }}>
                <div style={{ fontSize:10, fontWeight:700, color, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", fontFamily:"'Sora',sans-serif" }}>{label}</div>
                <p style={{ margin:0, fontSize:14, color:"var(--textMid)", lineHeight:1.6, fontWeight:bold?600:400 }}>{text}</p>
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
      <Card title="📅 Primeros 30 días (antes de escribir código)" accent="#FF5F7A"><p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.7 }}>{a.primeros30dias}</p></Card>
      <Card title="⚖️ Riesgo legal y regulatorio" accent="#FFB547"><p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.7 }}>{a.riesgoLegal}</p></Card>
    </div>
  );
}

// ── COMMENTS TAB ─────────────────────────────────────────────────
function CommentsTab({ sel, onAdd }) {
  const [author,  setAuthor]  = useState("");
  const [comment, setComment] = useState("");
  const inputStyle = { border:"1px solid var(--border2)", borderRadius:10, padding:"10px 14px", fontSize:13, outline:"none", color:"var(--text)", background:"var(--surface)", backdropFilter:"blur(8px)", width:"100%", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.15s" };

  const submit = () => {
    if (!comment.trim()) return;
    onAdd(sel.id, { id:Date.now(), author:author.trim()||"Anónimo", text:comment.trim(), time:new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}) });
    setComment("");
  };

  return (
    <div>
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:"18px 22px", marginBottom:14, backdropFilter:"blur(12px)" }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14, color:"var(--text)", fontFamily:"'Sora',sans-serif", letterSpacing:"-0.3px" }}>Agregar comentario</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[{val:author,set:setAuthor,ph:"Tu nombre"},{val:comment,set:setComment,ph:"Tu punto de vista (sin filtro)"}].map(({val,set,ph},i)=>(
            <input key={ph} value={val} onChange={e=>set(e.target.value)}
              onKeyDown={e=>i===1&&e.key==="Enter"&&submit()}
              placeholder={ph} style={inputStyle}
              onFocus={e=>(e.target.style.borderColor="rgba(108,92,231,0.5)")}
              onBlur={e=>(e.target.style.borderColor="var(--border2)")}/>
          ))}
          <GlowBtn onClick={submit}>Enviar</GlowBtn>
        </div>
      </div>
      {!sel.comments?.length ? (
        <div style={{ textAlign:"center", padding:"44px", color:"var(--textMute)", background:"var(--surface)", borderRadius:16, border:"1px solid var(--border)", backdropFilter:"blur(8px)" }}>
          <div style={{fontSize:32,marginBottom:10}}>💬</div>
          <div style={{fontWeight:600,color:"var(--textMid)",marginBottom:4,fontFamily:"'Sora',sans-serif"}}>Nadie dijo nada todavía</div>
          <div style={{fontSize:12}}>Sé el primero en opinar</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {sel.comments.map(c=>(
            <div key={c.id} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 18px", backdropFilter:"blur(8px)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ fontWeight:700, fontSize:13, color:"var(--text)", fontFamily:"'Sora',sans-serif" }}>{c.author}</span>
                <span style={{ fontSize:11, color:"var(--textMute)", fontFamily:"monospace" }}>{c.time}</span>
              </div>
              <p style={{ margin:0, color:"var(--textMid)", fontSize:14, lineHeight:1.6 }}>{c.text}</p>
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
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [sidebarFilter, setSidebarFilter] = useState("");
  const [sidebarSort,   setSidebarSort]   = useState("score");
  const [lightMode,     setLightMode]     = useState(() => localStorage.getItem("sb-theme") === "light");
  const analyzeRef = useRef(false);

  const toggleTheme = () => setLightMode(v => {
    const next = !v;
    localStorage.setItem("sb-theme", next ? "light" : "dark");
    return next;
  });

  const toggleStar = (e, id) => {
    e.stopPropagation();
    const idea = ideas.find(i => i.id === id);
    if (idea) updateIdea(id, { starred: !idea.starred });
  };

  const visibleIdeas = ideas
    .filter(idea => {
      if (!sidebarFilter) return true;
      if (sidebarFilter === "__starred")    return idea.starred;
      if (sidebarFilter === "__analizadas") return idea.analysis && !idea.analysis.error;
      if (["idea","validando","construyendo","lanzado"].includes(sidebarFilter)) return idea.stage === sidebarFilter;
      return idea.title.toLowerCase().includes(sidebarFilter.toLowerCase());
    })
    .sort((a, b) => {
      const sd = (b.starred?1:0)-(a.starred?1:0);
      if (sidebarSort==="score")  return sd||((b.analysis?.avgScore??-1)-(a.analysis?.avgScore??-1));
      if (sidebarSort==="votes")  { const va=(a.votes||[]).filter(v=>v.vote==="up").length,vb=(b.votes||[]).filter(v=>v.vote==="up").length; return sd||(vb-va); }
      if (sidebarSort==="recent") return sd||(b.id-a.id);
      return sd;
    });

  const sel = ideas.find(i => i.id === selectedId) || visibleIdeas[0] || ideas[0] || null;
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
      const res  = await fetch("/api/shark", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ prompt:ANALYZE_PROMPT(sel.title, sel.description, sel.industry||"") }) });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      let jsonText = text.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
      const fb = jsonText.indexOf("{"), lb = jsonText.lastIndexOf("}");
      if (fb !== -1 && lb !== -1) jsonText = jsonText.slice(fb, lb + 1);
      jsonText = jsonText
        .replace(/(\s*[}\]])/g, "$1")
        .replace(/:\s*undefined/g, ": null")
        .replace(/[\u0000-\u001F\u007F]/g, " ");
      // Fix unescaped quotes inside string values
      jsonText = (function fixQ(s) {
        let out="",inS=false,esc=false;
        for(let i=0;i<s.length;i++){
          const c=s[i];
          if(esc){out+=c;esc=false;continue;}
          if(c==="\\"){out+=c;esc=true;continue;}
          if(!inS){if(c==='"')inS=true;out+=c;continue;}
          if(c==='"'){
            let j=i+1;
            while(j<s.length&&(s[j]===' '||s[j]==='\t'))j++;
            const nx=s[j];
            if(nx===':'||nx===','||nx==='}'||nx===']'||nx==='\n'||nx==='\r'||j>=s.length){out+=c;inS=false;}
            else{out+='\\"';}
          }else{out+=c;}
        }
        return out;
      })(jsonText);
      let parsed;
      try{ parsed=JSON.parse(jsonText); }
      catch(pe){
        const pos=parseInt(pe.message.match(/position (\d+)/)?.[1]||"0");
        throw new Error("JSON invalido: ..."+jsonText.slice(Math.max(0,pos-50),pos+50)+"...");
      }
      const avgScore = Object.values(parsed.scores).reduce((a,b)=>a+b,0)/5;
      const prevScore = ideas.find(i=>i.id===ideaId)?.analysis?.avgScore || null;
      await saveAnalysis(ideaId, {...parsed, avgScore, prevScore, analyzedAt: new Date().toISOString()});
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

  const saveBudget = (ideaId, budget) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;
    const newAnalysis = { ...(idea.analysis || {}), budget };
    saveAnalysis(ideaId, newAnalysis);
  };

  const savePresell = (ideaId, presell) => {
    updateIdea(ideaId, { presell });
  };

  const refreshCompetitors = async () => {
    if (!sel) return;
    const ideaId = sel.id;
    const competitorPrompt = `Buscá competidores reales en internet para esta idea de negocio. Devolvé SOLO JSON. Sin markdown, sin backticks.

IDEA: ${sel.title}
DESCRIPCIÓN: ${sel.description}

Buscá exactamente: competidores directos, productos alternativos, herramientas que resuelvan el mismo problema.

{
  "competidores": [
    {
      "nombre": "nombre real del producto/empresa",
      "url": "https://...",
      "modelo": "SaaS/marketplace/etc",
      "mercado": "mercado objetivo",
      "amenaza": "alta|media|baja",
      "funding": "financiamiento conocido o bootstrapped",
      "fortaleza": "qué hacen bien",
      "debilidad": "punto débil explotable",
      "precio": "modelo de precios actual",
      "nuestroDiferencial": "cómo nos diferenciamos de este específicamente"
    }
  ],
  "mapaCompetitivo": "resumen del landscape en 2-3 líneas: quiénes dominan, qué nicho está vacío",
  "brechaCompetitiva": "la oportunidad concreta que estos competidores dejan libre"
}`;
    try {
      const res = await fetch("/api/shark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: competitorPrompt, useWebSearch: true }),
      });
      const data = await res.json();
      // Extract text from response (may contain tool_use blocks)
      const textBlocks = (data.content || []).filter(b => b.type === "text");
      const text = textBlocks.map(b => b.text).join("\n");
      let jsonText = text.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
      const fb = jsonText.indexOf("{"), lb = jsonText.lastIndexOf("}");
      if (fb !== -1 && lb !== -1) jsonText = jsonText.slice(fb, lb+1);
      const parsed = JSON.parse(jsonText);
      const newAnalysis = { ...(sel.analysis || {}), ...parsed };
      await saveAnalysis(ideaId, newAnalysis);
    } catch(err) {
      console.error("Competitors fetch error:", err);
    }
  };

  // ── LOADING ────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0B0B0F", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <GlobalStyles light={lightMode}/>
      <BackgroundEffects/>
      <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{ animation:"spin 3s linear infinite", display:"inline-block" }}><SharkLogo size={64}/></div>
        <div style={{ color:"var(--textMid)", fontWeight:600, marginTop:20, fontSize:14, fontFamily:"'Sora',sans-serif" }}>Cargando Shark Board...</div>
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
    <div style={{ minHeight:"100vh", background:"var(--bg)", color:"var(--text)", position:"relative", transition:"background 0.25s, color 0.25s" }}>
      <GlobalStyles light={lightMode}/>
      <BackgroundEffects light={lightMode}/>

      {/* TOP NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:50, height:62, background:"var(--nav)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 0 rgba(255,255,255,0.04)" }}>
        {/* Left: hamburger + logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {isMobile&&(
            <button onClick={()=>setSidebarOpen(o=>!o)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--textMid)", padding:4, fontSize:20 }}>☰</button>
          )}
          <SharkLogo size={36}/>
          <div>
            <div style={{ fontWeight:700, fontSize:16, letterSpacing:"-0.5px", fontFamily:"'Sora',sans-serif", lineHeight:1.2, color:"var(--text)" }}>
              Shark <span style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Board</span>
            </div>
            <div style={{ color:"var(--textMute)", fontSize:10, fontFamily:"'Sora',sans-serif" }}>{ideas.length} ideas · {ideas.filter(i=>i.analysis&&!i.analysis.error).length} analizadas</div>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={()=>setView(v=>v==="board"?"ranking":"board")}
            style={{ background:view==="ranking"?"rgba(108,92,231,0.2)":"rgba(255,255,255,0.04)", color:view==="ranking"?"#6C5CE7":"var(--textMid)", border:`1px solid ${view==="ranking"?"rgba(108,92,231,0.4)":"var(--border)"}`, borderRadius:9, padding:"7px 14px", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.15s" }}>
            {view==="ranking"?"← Board":"📊 Comparar"}
          </button>
          <button onClick={toggleTheme} title={lightMode ? "Modo oscuro" : "Modo claro"}
            style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:9, padding:"7px 12px", color:"var(--textMid)", fontWeight:600, fontSize:16, cursor:"pointer", lineHeight:1 }}>
            {lightMode ? "🌙" : "☀️"}
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
        <div style={{ display:"flex", height:"calc(100vh - 62px)", position:"relative", background:"var(--bg)" }}>
          {/* Mobile overlay */}
          {isMobile&&sidebarOpen&&(
            <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:40, backdropFilter:"blur(4px)" }}/>
          )}

          {/* SIDEBAR */}
          <div style={{
            width:260, flexShrink:0,
            background:"var(--sidebar)",
            borderRight:"1px solid var(--border)",
            overflowY:"auto",
            display:"flex", flexDirection:"column",
            ...(isMobile?{position:"fixed",left:sidebarOpen?0:-264,top:62,height:"calc(100vh - 62px)",zIndex:45,transition:"left 0.25s cubic-bezier(.4,0,.2,1)"}:{}),
          }}>
            {/* Sidebar header */}
            <div style={{ padding:"12px 10px 10px", borderBottom:"1px solid var(--border)", flexShrink:0, display:"flex", flexDirection:"column", gap:7 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2px" }}>
                <span style={{ fontSize:10, fontWeight:700, color:"var(--textMid)", textTransform:"uppercase", letterSpacing:"1.4px", fontFamily:"'Sora',sans-serif" }}>IDEAS</span>
                <span style={{ fontSize:10, color:"var(--textMute)", fontFamily:"'Sora',sans-serif" }}>{visibleIdeas.length}/{ideas.length}</span>
              </div>
              {/* Search */}
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", fontSize:11, pointerEvents:"none", color:"var(--textMute)" }}>🔍</span>
                <input
                  value={["__starred","__analizadas","idea","validando","construyendo","lanzado"].includes(sidebarFilter) ? "" : sidebarFilter}
                  onChange={e => setSidebarFilter(e.target.value)}
                  placeholder="Buscar..."
                  style={{ width:"100%", boxSizing:"border-box", background:"var(--inputbg)", border:"1px solid var(--inputbdr)", borderRadius:8, padding:"7px 8px 7px 28px", fontSize:12, color:"var(--inputclr)", outline:"none", fontFamily:"'DM Sans',sans-serif" }}
                />
              </div>
              {/* Filter chips */}
              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                {[{k:"",l:"Todas"},{k:"__starred",l:"⭐"},{k:"__analizadas",l:"✅"},{k:"idea",l:"💡"},{k:"validando",l:"🔍"},{k:"construyendo",l:"🔨"},{k:"lanzado",l:"🚀"}].map(f=>{
                  const active = sidebarFilter===f.k;
                  return (
                    <button key={f.k} onClick={()=>setSidebarFilter(f.k)}
                      style={{ background:active?"rgba(108,92,231,0.25)":"var(--surface)", border:`1px solid ${active?"rgba(108,92,231,0.45)":"rgba(255,255,255,0.08)"}`, borderRadius:99, padding:"3px 9px", fontSize:10, fontWeight:700, color:active?"#6C5CE7":"rgba(255,255,255,0.35)", cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.12s", whiteSpace:"nowrap" }}>
                      {f.l}
                    </button>
                  );
                })}
              </div>
              {/* Sort pills */}
              <div style={{ display:"flex", gap:4 }}>
                {[{k:"score",l:"Score"},{k:"votes",l:"Votos"},{k:"recent",l:"Reciente"}].map(opt=>(
                  <button key={opt.k} onClick={()=>setSidebarSort(opt.k)}
                    style={{ flex:1, background:sidebarSort===opt.k?"rgba(108,92,231,0.2)":"var(--surface)", border:`1px solid ${sidebarSort===opt.k?"rgba(108,92,231,0.4)":"rgba(255,255,255,0.08)"}`, borderRadius:6, padding:"4px 2px", fontSize:10, fontWeight:700, color:sidebarSort===opt.k?"#6C5CE7":"rgba(255,255,255,0.3)", cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.12s" }}>
                    {sidebarSort===opt.k?"↓ ":""}{opt.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Ideas list */}
            <div style={{ flex:1, overflowY:"auto", padding:"8px" }}>
              {visibleIdeas.map(idea => {
                const isSelected      = idea.id === sel?.id;
                const stg             = STAGES.find(x=>x.key===idea.stage)||STAGES[0];
                const score           = idea.analysis?.avgScore;
                const sc              = score ? scoreColor(score) : null;
                const isAnalyzingThis = analyzing && sel?.id===idea.id;
                const upVotes         = (idea.votes||[]).filter(v=>v.vote==="up").length;
                return (
                  <div key={idea.id}
                    onClick={()=>{ setSelectedId(idea.id); setTab("analysis"); setSidebarOpen(false); }}
                    style={{ borderRadius:8, padding:"9px 10px 9px 12px", cursor:"pointer", marginBottom:3, background:isSelected?"rgba(108,92,231,0.22)":"transparent", border:`1px solid ${isSelected?"rgba(108,92,231,0.5)":"transparent"}`, borderLeft:`3px solid ${isSelected?"#6C5CE7":idea.starred?"#FFB547":"transparent"}`, transition:"all 0.12s" }}>
                    {/* Title + star */}
                    <div style={{ display:"flex", alignItems:"flex-start", gap:5, marginBottom:5 }}>
                      <div style={{ flex:1, fontWeight:700, fontSize:13, color:isSelected?"var(--text)":"var(--textMid)", lineHeight:1.3, fontFamily:"'Sora',sans-serif", wordBreak:"break-word" }}>
                        {idea.title}
                      </div>
                      <button onClick={e=>toggleStar(e,idea.id)} title={idea.starred?"Quitar estrella":"Destacar"}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:"1px 0", fontSize:13, lineHeight:1, flexShrink:0, opacity:idea.starred?1:0.18, transition:"all 0.15s", transform:idea.starred?"scale(1.1)":"scale(1)" }}
                        onMouseEnter={e=>e.currentTarget.style.opacity="0.8"}
                        onMouseLeave={e=>e.currentTarget.style.opacity=idea.starred?"1":"0.18"}>⭐</button>
                    </div>
                    {/* Stage + score */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ fontSize:10 }}>{stg.emoji}</span>
                        <span style={{ fontSize:10, color:isSelected?stg.color:"var(--textMute)", fontWeight:600, fontFamily:"'Sora',sans-serif" }}>{stg.label}</span>
                        {upVotes>0 && <span style={{ fontSize:10, color:"var(--textMute)" }}>· 👍{upVotes}</span>}
                      </div>
                      {isAnalyzingThis ? (
                        <span style={{ fontSize:10, color:"var(--textMid)", animation:"pulse 1.5s infinite" }}>⏳</span>
                      ) : sc ? (
                        <span style={{ color:sc, fontWeight:800, fontSize:12, fontFamily:"monospace", background:"rgba(0,0,0,0.35)", borderRadius:5, padding:"1px 7px", border:`1px solid ${sc}40` }}>{score.toFixed(1)}</span>
                      ) : (
                        <span style={{ fontSize:10, color:"var(--textMute)", fontStyle:"italic" }}>–</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {visibleIdeas.length===0 && (
                <div style={{ textAlign:"center", padding:"32px 12px", color:"var(--textMute)", fontSize:12, fontFamily:"'Sora',sans-serif" }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>🔍</div>
                  Sin ideas que coincidan
                </div>
              )}
            </div>

                    {/* MAIN PANEL */}
          {sel ? (
            <div style={{ flex:1, overflowY:"auto", minWidth:0, position:"relative", zIndex:1, background:"var(--bg)" }}>
              {/* Idea header */}
              <div style={{ background:"var(--nav)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", padding:"18px 24px 0", position:"sticky", top:0, zIndex:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9, flexWrap:"wrap" }}>
                      <StageBadge stage={sel.stage}/>
                      <select value={sel.stage} onChange={e=>updateIdea(sel.id,{stage:e.target.value})}
                        style={{ border:"1px solid var(--border)", borderRadius:8, padding:"3px 8px", fontSize:11, color:"var(--textMid)", background:"var(--surface)", cursor:"pointer", fontFamily:"'Sora',sans-serif", backdropFilter:"blur(8px)", outline:"none" }}>
                        {STAGES.map(s=><option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                      </select>
                    </div>
                    <h1 style={{ margin:"0 0 7px", fontSize:20, fontWeight:700, letterSpacing:"-0.5px", color:"var(--text)", lineHeight:1.3, fontFamily:"'Sora',sans-serif" }}>{sel.title}</h1>
                    <p style={{ margin:0, color:"var(--textMid)", fontSize:13, lineHeight:1.65 }}>{sel.description}</p>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, marginLeft:18, flexShrink:0 }}>
                    {a?.avgScore&&(
                      <div style={{ textAlign:"center", background:"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.08))", borderRadius:14, padding:"10px 16px", minWidth:80, border:"1px solid rgba(108,92,231,0.2)", boxShadow:"0 0 20px rgba(108,92,231,0.15)", position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.5),rgba(0,245,212,0.3),transparent)" }}/>
                        <div style={{ fontSize:9, color:"var(--textMute)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'Sora',sans-serif" }}>SCORE</div>
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
                      style={{ border:"none", background:"transparent", borderBottom:`2px solid ${tab===t.key?"#6C5CE7":"transparent"}`, color:tab===t.key?"var(--text)":"var(--textMute)", padding:"10px 16px", cursor:"pointer", fontSize:13, fontWeight:tab===t.key?700:500, marginBottom:-1, whiteSpace:"nowrap", transition:"all 0.15s", fontFamily:"'Sora',sans-serif" }}>
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
                    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:"22px", textAlign:"center", backdropFilter:"blur(12px)" }}>
                      <div style={{ fontSize:17, color:"var(--text)", fontWeight:700, marginBottom:7, fontFamily:"'Sora',sans-serif", letterSpacing:"-0.3px" }}>🦈 ¿Listo para el veredicto?</div>
                      <div style={{ fontSize:13, color:"var(--textMute)", marginBottom:20 }}>Votá primero para no contaminar tu juicio</div>
                      <GlowBtn onClick={()=>setTab("analysis")}>Ver qué dice el Shark →</GlowBtn>
                    </div>
                  </div>
                )}
                {tab==="analysis"     && <AnalysisTab     sel={sel} a={a} analyzing={analyzing} onAnalyze={analyze} onReanalyze={reanalyze} onExportPrompt={handleExportPrompt} onGoTab={setTab}/>}
                {tab==="monetizacion" && <MonetizacionTab a={a} onGoAnalysis={()=>setTab("analysis")}/>}
                {tab==="gtm"          && <GtmTab          a={a} onGoAnalysis={()=>setTab("analysis")}/>}
                {tab==="hipotesis"    && <HipotesisTab    a={a} onGoAnalysis={()=>setTab("analysis")}/>}
                {tab==="personas"     && <PersonasTab     a={a} onGoAnalysis={()=>setTab("analysis")}/>}
                {tab==="competidores" && <CompetidoresTab a={a} idea={sel} onGoAnalysis={()=>setTab("analysis")} onRefreshCompetitors={refreshCompetitors}/>}
                {tab==="canvas"       && <CanvasTab       a={a} onGoAnalysis={()=>setTab("analysis")}/>}
                {tab==="budget"       && <BudgetTab       ideaId={sel.id} budget={sel.analysis?.budget} onSave={saveBudget}/>}
                {tab==="presell"      && <PreSellTab      ideaId={sel.id} presell={sel.presell||[]} onSave={savePresell}/>}
                {tab==="comments"     && <CommentsTab     sel={sel} onAdd={addComment}/>}
              </div>
            </div>
          ) : (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
              <div style={{ textAlign:"center", color:"var(--textMute)" }}>
                <SharkLogo size={56}/>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:6, marginTop:20, color:"var(--textMid)", fontFamily:"'Sora',sans-serif" }}>Seleccioná una idea</div>
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
