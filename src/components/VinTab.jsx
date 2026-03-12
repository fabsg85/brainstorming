import { useState } from "react";

// ── VIN CRITERIA (pauta oficial ANII/ANDE Fase II) ────────────────
const VIN_CRITERIA = [
  {
    key: "potencialDinamico",
    label: "Potencial dinámico",
    weight: 15,
    emoji: "🚀",
    color: "#6C5CE7",
    bg: "rgba(108,92,231,0.12)",
    border: "rgba(108,92,231,0.25)",
    guia: "¿Tiene valor diferencial o mérito innovador? ¿Puede convertirse en emprendimiento dinámico en su territorio?",
  },
  {
    key: "idoneidad",
    label: "Idoneidad del equipo",
    weight: 10,
    emoji: "👥",
    color: "#00F5D4",
    bg: "rgba(0,245,212,0.10)",
    border: "rgba(0,245,212,0.25)",
    guia: "¿El equipo tiene habilidades, conocimiento y experiencia para llevar adelante el proyecto?",
  },
  {
    key: "propuestaValor",
    label: "Propuesta de valor",
    weight: 15,
    emoji: "💡",
    color: "#FFB547",
    bg: "rgba(255,181,71,0.12)",
    border: "rgba(255,181,71,0.25)",
    guia: "¿El problema está bien definido y validado? ¿La solución es coherente con el problema?",
  },
  {
    key: "segmentoClientes",
    label: "Segmento de clientes",
    weight: 15,
    emoji: "🎯",
    color: "#FF5F7A",
    bg: "rgba(255,95,122,0.10)",
    border: "rgba(255,95,122,0.25)",
    guia: "¿Es correcta la segmentación? ¿Demuestran un mercado potencial atractivo que justifique validación comercial?",
  },
  {
    key: "modeloIngresos",
    label: "Modelo de ingresos",
    weight: 10,
    emoji: "💰",
    color: "#00F5D4",
    bg: "rgba(0,245,212,0.10)",
    border: "rgba(0,245,212,0.25)",
    guia: "¿El modelo de ingresos es adecuado para el producto/servicio que se pretende validar?",
  },
  {
    key: "mvp",
    label: "Producto mínimo viable",
    weight: 10,
    emoji: "🔨",
    color: "#A29BFE",
    bg: "rgba(162,155,254,0.12)",
    border: "rgba(162,155,254,0.25)",
    guia: "¿El MVP planteado permite llevar adelante un proceso de validación técnica y comercial?",
  },
  {
    key: "planValidacion",
    label: "Plan de validación",
    weight: 20,
    emoji: "🧪",
    color: "#6C5CE7",
    bg: "rgba(108,92,231,0.12)",
    border: "rgba(108,92,231,0.25)",
    guia: "¿El plan de validación es correcto? ¿Los experimentos permiten testear el producto a nivel técnico y de mercado?",
  },
  {
    key: "claridadPropuesta",
    label: "Claridad y calidad",
    weight: 5,
    emoji: "📋",
    color: "#FFB547",
    bg: "rgba(255,181,71,0.12)",
    border: "rgba(255,181,71,0.25)",
    guia: "¿Objetivos, actividades y presupuesto son coherentes? ¿Los indicadores determinan si la validación fue exitosa?",
  },
];

// ── CHECKLIST ITEMS ───────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  {
    category: "Antes de contactar la institución",
    color: "#6C5CE7",
    items: [
      { id: "c1", text: "Tenés el problema claramente definido en 2-3 líneas" },
      { id: "c2", text: "Sabés quién es tu cliente específico (no 'todos')" },
      { id: "c3", text: "Podés explicar por qué tu solución es diferente a lo que ya existe" },
      { id: "c4", text: "Tenés al menos 3 conversaciones con potenciales clientes reales" },
      { id: "c5", text: "Definiste qué vas a validar (técnico / comercial / ambos)" },
    ],
  },
  {
    category: "Documentos requeridos",
    color: "#FFB547",
    items: [
      { id: "d1", text: "Cédula de identidad vigente de todos los integrantes del equipo" },
      { id: "d2", text: "CV del equipo emprendedor (énfasis en experiencia relevante al proyecto)" },
      { id: "d3", text: "Descripción del proyecto (máx. 2 páginas: problema, solución, mercado, equipo)" },
      { id: "d4", text: "Plan de validación con experimentos concretos e indicadores de éxito" },
      { id: "d5", text: "Presupuesto detallado del proyecto de validación" },
      { id: "d6", text: "Carta de intención de al menos 1 potencial cliente (recomendado)" },
    ],
  },
  {
    category: "Criterios clave que evalúa el jurado",
    color: "#00F5D4",
    items: [
      { id: "e1", text: "Plan de validación (20%): es el criterio más pesado — sé específico en los experimentos" },
      { id: "e2", text: "Potencial dinámico (15%): mostrá por qué puede escalar más allá del mercado local" },
      { id: "e3", text: "Propuesta de valor (15%): el problema tiene que estar validado, no asumido" },
      { id: "e4", text: "Segmento de clientes (15%): segmentación específica, no genérica" },
      { id: "e5", text: "El equipo importa: si falta expertise, mostrá cómo lo vas a complementar" },
    ],
  },
  {
    category: "En la reunión con la institución patrocinadora",
    color: "#FF5F7A",
    items: [
      { id: "r1", text: "Preparaste un pitch de 5 minutos: problema → solución → validación → equipo" },
      { id: "r2", text: "Tenés claro el monto que vas a solicitar y en qué lo vas a gastar" },
      { id: "r3", text: "Sabés qué tipo de validación solicitás: técnica (VIT), comercial, o ambas" },
      { id: "r4", text: "Conocés el foco de la institución (tech, social, diseño, etc.) y tu idea encaja" },
      { id: "r5", text: "Preparaste respuestas para '¿por qué vos?' y '¿qué pasa si falla el supuesto principal?'" },
    ],
  },
];

// ── VIN PROMPT ────────────────────────────────────────────────────
const VIN_PROMPT = (title, description, industry, idea) => `Sos un evaluador experto de proyectos de innovación para el programa VIN (Validación de Idea de Negocio) de ANII/ANDE Uruguay.

Evaluá esta idea usando EXACTAMENTE la pauta oficial VIN Fase II. Devolvé SOLO JSON válido. Sin markdown, sin texto extra.

IDEA: ${title}
DESCRIPCIÓN: ${description}
INDUSTRIA: ${industry || "No especificada"}
${idea?.analysis ? `ANÁLISIS PREVIO DEL SHARK: Score ${idea.analysis.avgScore?.toFixed(1)}/10. Pros: ${(idea.analysis.pros||[]).join(", ")}. Cons: ${(idea.analysis.cons||[]).join(", ")}` : ""}

CRITERIOS (puntaje 1-10 donde 1-2=Deficiente, 3-4=Regular, 5-6=Bueno, 7-8=Muy Bueno, 9-10=Excelente):

{
  "potencialDinamico":    { "puntaje": 0, "comentario": "evaluación concreta 2-3 oraciones", "fortaleza": "qué tiene a favor", "debilidad": "qué le falta" },
  "idoneidad":            { "puntaje": 0, "comentario": "evaluación concreta 2-3 oraciones", "fortaleza": "qué tiene a favor", "debilidad": "qué le falta" },
  "propuestaValor":       { "puntaje": 0, "comentario": "evaluación concreta 2-3 oraciones", "fortaleza": "qué tiene a favor", "debilidad": "qué le falta" },
  "segmentoClientes":     { "puntaje": 0, "comentario": "evaluación concreta 2-3 oraciones", "fortaleza": "qué tiene a favor", "debilidad": "qué le falta" },
  "modeloIngresos":       { "puntaje": 0, "comentario": "evaluación concreta 2-3 oraciones", "fortaleza": "qué tiene a favor", "debilidad": "qué le falta" },
  "mvp":                  { "puntaje": 0, "comentario": "evaluación concreta 2-3 oraciones", "fortaleza": "qué tiene a favor", "debilidad": "qué le falta" },
  "planValidacion":       { "puntaje": 0, "comentario": "evaluación concreta 2-3 oraciones", "fortaleza": "qué tiene a favor", "debilidad": "qué le falta" },
  "claridadPropuesta":    { "puntaje": 0, "comentario": "evaluación concreta 2-3 oraciones", "fortaleza": "qué tiene a favor", "debilidad": "qué le falta" },
  "juicioGlobal":         "párrafo de 4-5 oraciones con observaciones, sugerencias y recomendaciones clave para el postulante",
  "recomendacion":        "aprobado|borderline|rechazado",
  "recomendacionDetalle": "por qué merece o no el apoyo, qué tendría que mejorar para aprobarse",
  "validacionTecnica":    "si|no|no_aplica",
  "validacionComercial":  "si|no",
  "topMejoras":           ["mejora crítica 1 antes de postularse", "mejora crítica 2", "mejora crítica 3"]
}`;

// ── SCORE UTILS ───────────────────────────────────────────────────
function calcVinScore(scores) {
  return VIN_CRITERIA.reduce((total, c) => {
    const s = scores?.[c.key]?.puntaje || 0;
    return total + (s * c.weight / 100);
  }, 0);
}

function vinLabel(score) {
  if (score >= 8.5) return { label: "Excelente", color: "#00F5D4", emoji: "🏆" };
  if (score >= 7)   return { label: "Muy Bueno", color: "#6C5CE7", emoji: "✅" };
  if (score >= 5)   return { label: "Bueno",     color: "#FFB547", emoji: "📈" };
  if (score >= 3)   return { label: "Regular",   color: "#FF9F43", emoji: "⚠️" };
  return                   { label: "Deficiente",color: "#FF5F7A", emoji: "❌" };
}

function recColor(rec) {
  if (rec === "aprobado")   return { color:"#00F5D4", bg:"rgba(0,245,212,0.10)", border:"rgba(0,245,212,0.25)", label:"✅ Recomendado para aprobación" };
  if (rec === "borderline") return { color:"#FFB547", bg:"rgba(255,181,71,0.12)", border:"rgba(255,181,71,0.25)", label:"⚠️ Borderline — con mejoras podría aprobarse" };
  return                           { color:"#FF5F7A", bg:"rgba(255,95,122,0.10)", border:"rgba(255,95,122,0.25)", label:"❌ No recomendado en estado actual" };
}

// ── COMPONENT ─────────────────────────────────────────────────────
export default function VinTab({ sel, a, onGoAnalysis }) {
  const [activeSection, setActiveSection] = useState("evaluador");
  const [evaluating, setEvaluating]       = useState(false);
  const [vinData, setVinData]             = useState(sel?.vinEval || null);
  const [checkState, setCheckState]       = useState(sel?.vinChecklist || {});
  const [error, setError]                 = useState(null);

  const runEvaluation = async () => {
    if (!sel) return;
    setEvaluating(true);
    setError(null);
    try {
      const res = await fetch("/api/shark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: VIN_PROMPT(sel.title, sel.description, sel.industry, sel) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(JSON.stringify(data.error));
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
      let jsonText = text.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
      const fb = jsonText.indexOf("{"), lb = jsonText.lastIndexOf("}");
      if (fb === -1) throw new Error("Sin JSON en respuesta");
      jsonText = jsonText.slice(fb, lb+1);
      const parsed = JSON.parse(jsonText);
      const vinScore = calcVinScore(parsed);
      const result = { ...parsed, vinScore, evaluatedAt: new Date().toISOString() };
      setVinData(result);
      // Persist in idea via custom event (parent will save)
      window.dispatchEvent(new CustomEvent("saveVinEval", { detail: { ideaId: sel.id, vinEval: result } }));
    } catch(err) {
      setError(err.message);
    }
    setEvaluating(false);
  };

  const toggleCheck = (id) => {
    const next = { ...checkState, [id]: !checkState[id] };
    setCheckState(next);
    window.dispatchEvent(new CustomEvent("saveVinChecklist", { detail: { ideaId: sel.id, vinChecklist: next } }));
  };

  const totalChecks = CHECKLIST_ITEMS.flatMap(c => c.items).length;
  const doneChecks  = Object.values(checkState).filter(Boolean).length;

  const sectionBtn = (key, label) => (
    <button onClick={() => setActiveSection(key)} style={{
      background: activeSection === key ? "rgba(108,92,231,0.2)" : "var(--surface)",
      border: `1px solid ${activeSection === key ? "rgba(108,92,231,0.5)" : "var(--border)"}`,
      borderRadius: 9, padding: "8px 18px", cursor: "pointer",
      fontSize: 13, fontWeight: 700, color: activeSection === key ? "#6C5CE7" : "var(--textMid)",
      fontFamily: "'Sora',sans-serif", transition: "all 0.15s",
    }}>{label}</button>
  );

  return (
    <div style={{ display:"grid", gap:14, animation:"fadeUp 0.3s ease" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,245,212,0.06))", border:"1px solid rgba(108,92,231,0.3)", borderRadius:16, padding:"18px 22px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.6),rgba(0,245,212,0.3),transparent)" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:"var(--textMute)", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:5, fontFamily:"'Sora',sans-serif" }}>ANII / ANDE Uruguay</div>
            <div style={{ fontWeight:800, fontSize:18, color:"var(--text)", fontFamily:"'Sora',sans-serif", letterSpacing:"-0.4px" }}>🏛️ Validación de Idea de Negocio (VIN)</div>
            <div style={{ fontSize:12, color:"var(--textMute)", marginTop:4 }}>Evaluación con pauta oficial Fase II · Ponderación real de criterios</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {sectionBtn("evaluador", "📊 Evaluador")}
            {sectionBtn("checklist", `✅ Checklist ${doneChecks > 0 ? `(${doneChecks}/${totalChecks})` : ""}`)}
          </div>
        </div>
      </div>

      {/* ── EVALUADOR ─────────────────────────────────────────── */}
      {activeSection === "evaluador" && (
        <>
          {!vinData && !evaluating && (
            <div style={{ textAlign:"center", padding:"64px 20px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:20, backdropFilter:"blur(12px)" }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🏛️</div>
              <div style={{ fontWeight:700, fontSize:20, color:"var(--text)", marginBottom:8, fontFamily:"'Sora',sans-serif", letterSpacing:"-0.3px" }}>Evaluación VIN</div>
              <div style={{ color:"var(--textMute)", fontSize:14, marginBottom:12, maxWidth:440, margin:"8px auto 28px", lineHeight:1.7 }}>
                El Shark evalúa tu idea con los <strong style={{color:"var(--textMid)"}}>8 criterios oficiales</strong> de la pauta ANII/ANDE, con sus pesos reales. Mismo estándar que usa el jurado.
              </div>
              {!a && (
                <div style={{ background:"rgba(255,181,71,0.10)", border:"1px solid rgba(255,181,71,0.25)", borderRadius:10, padding:"10px 16px", marginBottom:20, fontSize:12, color:"#FFB547", maxWidth:400, margin:"0 auto 20px" }}>
                  💡 Tip: hacé primero el análisis del Shark para una evaluación más precisa
                </div>
              )}
              <button onClick={runEvaluation} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:12, padding:"14px 36px", color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 0 30px rgba(108,92,231,0.5)" }}>
                🏛️ Evaluar para VIN
              </button>
            </div>
          )}

          {evaluating && (
            <div style={{ textAlign:"center", padding:"72px 20px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:20, backdropFilter:"blur(12px)" }}>
              <div style={{ fontSize:48, marginBottom:20, animation:"pulse 1.4s ease-in-out infinite" }}>🏛️</div>
              <div style={{ fontWeight:700, fontSize:18, color:"var(--text)", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>Evaluando con pauta VIN...</div>
              <div style={{ color:"var(--textMute)", fontSize:13, marginBottom:24 }}>El Shark está aplicando los 8 criterios oficiales de ANII/ANDE</div>
              <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
                {VIN_CRITERIA.map((c, i) => (
                  <span key={c.key} style={{ fontSize:11, color:"var(--textMid)", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:99, padding:"4px 12px", fontWeight:600, fontFamily:"'Sora',sans-serif", animation:`pulse 1.6s ${i*0.15}s infinite` }}>
                    {c.emoji} {c.label} {c.weight}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ background:"rgba(255,95,122,0.08)", border:"1px solid rgba(255,95,122,0.25)", borderRadius:14, padding:"16px 20px", color:"#FF5F7A", fontSize:13 }}>
              😬 Error: {error}
              <button onClick={runEvaluation} style={{ marginLeft:12, background:"none", border:"1px solid rgba(255,95,122,0.4)", borderRadius:7, padding:"4px 12px", color:"#FF5F7A", cursor:"pointer", fontSize:12 }}>Reintentar</button>
            </div>
          )}

          {vinData && !evaluating && (
            <>
              {/* Score global */}
              {(() => {
                const vl = vinLabel(vinData.vinScore);
                const rc = recColor(vinData.recomendacion);
                return (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {/* Puntaje global */}
                    <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.06))", border:"1px solid rgba(108,92,231,0.3)", borderRadius:16, padding:"20px 22px", position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.6),transparent)" }}/>
                      <div style={{ fontSize:10, fontWeight:700, color:"var(--textMute)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>Puntaje Ponderado VIN</div>
                      <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                        <span style={{ fontSize:48, fontWeight:900, fontFamily:"monospace", color: vl.color, lineHeight:1 }}>{vinData.vinScore.toFixed(1)}</span>
                        <span style={{ fontSize:18, color:"var(--textMute)", fontWeight:300 }}>/10</span>
                      </div>
                      <div style={{ marginTop:8, fontSize:13, fontWeight:700, color: vl.color, fontFamily:"'Sora',sans-serif" }}>{vl.emoji} {vl.label}</div>
                    </div>
                    {/* Recomendación */}
                    <div style={{ background: rc.bg, border:`1px solid ${rc.border}`, borderRadius:16, padding:"20px 22px" }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"var(--textMute)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:8, fontFamily:"'Sora',sans-serif" }}>Recomendación Jurado</div>
                      <div style={{ fontWeight:800, fontSize:15, color: rc.color, fontFamily:"'Sora',sans-serif", marginBottom:8 }}>{rc.label}</div>
                      <div style={{ fontSize:12, color:"var(--textMute)", lineHeight:1.5 }}>{vinData.recomendacionDetalle}</div>
                      <div style={{ display:"flex", gap:6, marginTop:10 }}>
                        <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:99, background:"var(--surface2)", color:"var(--textMid)", fontFamily:"'Sora',sans-serif" }}>
                          VIT: {vinData.validacionTecnica === "no_aplica" ? "No aplica" : vinData.validacionTecnica === "si" ? "✅ Sí" : "❌ No"}
                        </span>
                        <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:99, background:"var(--surface2)", color:"var(--textMid)", fontFamily:"'Sora',sans-serif" }}>
                          Comercial: {vinData.validacionComercial === "si" ? "✅ Sí" : "❌ No"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Top mejoras */}
              {vinData.topMejoras?.length > 0 && (
                <div style={{ background:"rgba(255,181,71,0.08)", border:"1px solid rgba(255,181,71,0.2)", borderRadius:14, padding:"16px 20px" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#FFB547", textTransform:"uppercase", letterSpacing:"1px", marginBottom:12, fontFamily:"'Sora',sans-serif" }}>⚡ Mejoras críticas antes de postularte</div>
                  {vinData.topMejoras.map((m, i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom: i < vinData.topMejoras.length-1 ? 10 : 0 }}>
                      <span style={{ width:22, height:22, borderRadius:"50%", background:"rgba(255,181,71,0.2)", border:"1px solid rgba(255,181,71,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#FFB547", flexShrink:0, fontFamily:"monospace" }}>{i+1}</span>
                      <span style={{ fontSize:13, color:"var(--textMid)", lineHeight:1.5 }}>{m}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Criterios detallados */}
              <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden" }}>
                <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"var(--text)", fontFamily:"'Sora',sans-serif" }}>📊 Desglose por criterio</div>
                  <button onClick={runEvaluation} style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 14px", color:"var(--textMid)", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>🔄 Re-evaluar</button>
                </div>
                {VIN_CRITERIA.map((c, idx) => {
                  const d = vinData[c.key];
                  if (!d) return null;
                  const pct = (d.puntaje / 10) * 100;
                  const vl = vinLabel(d.puntaje);
                  return (
                    <div key={c.key} style={{ padding:"14px 18px", borderTop: idx > 0 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <span style={{ fontSize:18, flexShrink:0 }}>{c.emoji}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ fontSize:13, fontWeight:700, color:"var(--text)", fontFamily:"'Sora',sans-serif" }}>{c.label}</span>
                              <span style={{ fontSize:10, color:"var(--textMute)", fontWeight:600, background:"var(--surface2)", borderRadius:99, padding:"2px 7px", fontFamily:"'Sora',sans-serif" }}>{c.weight}%</span>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <span style={{ fontSize:11, color: vl.color, fontWeight:700, fontFamily:"'Sora',sans-serif" }}>{vl.emoji} {vl.label}</span>
                              <span style={{ fontSize:16, fontWeight:900, fontFamily:"monospace", color: c.color }}>{d.puntaje}/10</span>
                            </div>
                          </div>
                          <div style={{ height:6, background:"var(--surface2)", borderRadius:99, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${c.color},${c.color}99)`, borderRadius:99, transition:"width 0.6s ease" }}/>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:"var(--textMid)", lineHeight:1.6, marginBottom:8, paddingLeft:28 }}>{d.comentario}</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, paddingLeft:28 }}>
                        <div style={{ background:"rgba(0,245,212,0.06)", border:"1px solid rgba(0,245,212,0.15)", borderRadius:8, padding:"8px 10px" }}>
                          <div style={{ fontSize:9, fontWeight:700, color:"#00F5D4", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:4, fontFamily:"'Sora',sans-serif" }}>✓ Fortaleza</div>
                          <div style={{ fontSize:11, color:"var(--textMute)", lineHeight:1.4 }}>{d.fortaleza}</div>
                        </div>
                        <div style={{ background:"rgba(255,95,122,0.06)", border:"1px solid rgba(255,95,122,0.15)", borderRadius:8, padding:"8px 10px" }}>
                          <div style={{ fontSize:9, fontWeight:700, color:"#FF5F7A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:4, fontFamily:"'Sora',sans-serif" }}>✗ A mejorar</div>
                          <div style={{ fontSize:11, color:"var(--textMute)", lineHeight:1.4 }}>{d.debilidad}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Juicio global */}
              {vinData.juicioGlobal && (
                <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"var(--textMute)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:10, fontFamily:"'Sora',sans-serif" }}>📝 Juicio global del evaluador</div>
                  <div style={{ fontSize:13, color:"var(--textMid)", lineHeight:1.8 }}>{vinData.juicioGlobal}</div>
                  {vinData.evaluatedAt && (
                    <div style={{ fontSize:10, color:"var(--textMute)", marginTop:12 }}>
                      Evaluado el {new Date(vinData.evaluatedAt).toLocaleDateString("es-UY", { day:"2-digit", month:"long", year:"numeric" })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── CHECKLIST ─────────────────────────────────────────── */}
      {activeSection === "checklist" && (
        <>
          {/* Progress bar */}
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"16px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--text)", fontFamily:"'Sora',sans-serif" }}>Progreso de preparación</span>
              <span style={{ fontSize:13, fontWeight:800, fontFamily:"monospace", color: doneChecks === totalChecks ? "#00F5D4" : "#FFB547" }}>{doneChecks}/{totalChecks}</span>
            </div>
            <div style={{ height:8, background:"var(--surface2)", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(doneChecks/totalChecks)*100}%`, background: doneChecks === totalChecks ? "#00F5D4" : "linear-gradient(90deg,#6C5CE7,#FFB547)", borderRadius:99, transition:"width 0.4s ease" }}/>
            </div>
            {doneChecks === totalChecks && (
              <div style={{ marginTop:10, fontSize:12, color:"#00F5D4", fontWeight:700, fontFamily:"'Sora',sans-serif" }}>🎉 ¡Listo para postularte!</div>
            )}
          </div>

          {CHECKLIST_ITEMS.map(cat => {
            const catDone = cat.items.filter(i => checkState[i.id]).length;
            return (
              <div key={cat.category} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden" }}>
                <div style={{ padding:"12px 18px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", background:`${cat.color}0d` }}>
                  <span style={{ fontSize:13, fontWeight:700, color: cat.color, fontFamily:"'Sora',sans-serif" }}>{cat.category}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:"var(--textMute)", fontFamily:"'Sora',sans-serif" }}>{catDone}/{cat.items.length}</span>
                </div>
                {cat.items.map((item, i) => (
                  <div key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 18px", borderTop: i > 0 ? "1px solid var(--border)" : "none", cursor:"pointer", transition:"background 0.12s", background: checkState[item.id] ? `${cat.color}08` : "transparent" }}
                    onMouseEnter={e => { if(!checkState[item.id]) e.currentTarget.style.background = "var(--surface2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = checkState[item.id] ? `${cat.color}08` : "transparent"; }}
                  >
                    <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${checkState[item.id] ? cat.color : "var(--border2)"}`, background: checkState[item.id] ? cat.color : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, transition:"all 0.15s" }}>
                      {checkState[item.id] && <span style={{ color:"#fff", fontSize:11, fontWeight:900, lineHeight:1 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:13, color: checkState[item.id] ? "var(--textMute)" : "var(--text)", textDecoration: checkState[item.id] ? "line-through" : "none", lineHeight:1.5, transition:"all 0.15s" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
