import { useState } from "react";
import { T, STAGES, INDUSTRIES } from "../constants";
import SharkLogo from "./SharkLogo";

const WIZARD_STEPS = [
  { key:"title",    label:"El nombre",         emoji:"💡", desc:"Un nombre que no suene a startup genérica de 2019." },
  { key:"customer", label:"El cliente",        emoji:"👤", desc:"¿Quién sufre el problema? Rol, industria, tamaño. Más específico = mejor análisis." },
  { key:"pain",     label:"El dolor",          emoji:"🎯", desc:"¿Qué hace hoy para resolverlo? Sé concreto: tiempo, plata, frecuencia." },
  { key:"price",    label:"¿Cuánto pagan hoy?",emoji:"💸", desc:"¿Qué herramienta/servicio usan hoy y cuánto cuesta? Si no pagan nada, ¿por qué?" },
  { key:"solution", label:"Tu solución",       emoji:"⚡", desc:"¿Qué hace tu producto que lo actual no puede? Una línea, sin buzzwords." },
  { key:"industry", label:"Industria",         emoji:"🏭", desc:"¿En qué espacio juega esta idea?" },
  { key:"stage",    label:"Estado actual",     emoji:"📍", desc:"Seamos honestos sobre dónde está esto." },
];

const inputStyle = (focused) => ({
  border: `1px solid ${focused ? "rgba(108,92,231,0.6)" : "var(--surface2)"}`,
  borderRadius: 10, padding: "12px 14px", fontSize: 14, outline: "none",
  color: "var(--text)", width: "100%", boxSizing: "border-box",
  fontFamily: "'DM Sans',sans-serif", background: "var(--surface)",
  backdropFilter: "blur(8px)", transition: "border-color 0.15s", lineHeight: 1.5,
});

function FocusInput({ value, onChange, placeholder, multiline, rows = 3, onEnter }) {
  const [focused, setFocused] = useState(false);
  const props = {
    value, onChange: e => onChange(e.target.value),
    placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: { ...inputStyle(focused), ...(multiline ? { resize: "vertical" } : {}) },
    ...(onEnter ? { onKeyDown: e => e.key === "Enter" && !multiline && onEnter() } : {}),
  };
  return multiline ? <textarea {...props} rows={rows}/> : <input autoFocus {...props}/>;
}

export default function Wizard({ onSave, onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    title: "", customer: "", pain: "", price: "", solution: "",
    industry: "saas", stage: "idea",
  });

  const set = (k, v) => setData(p => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 0) return data.title.trim().length > 2;
    if (step === 1) return data.customer.trim().length > 5;
    if (step === 2) return data.pain.trim().length > 10;
    if (step === 3) return data.price.trim().length > 3;
    if (step === 4) return data.solution.trim().length > 5;
    return true;
  };

  const handleSave = () => {
    const industry = INDUSTRIES.find(i => i.key === data.industry) || INDUSTRIES[0];
    const description = [
      `CLIENTE OBJETIVO: ${data.customer}`,
      `PROBLEMA / DOLOR: ${data.pain}`,
      `QUÉ PAGAN HOY: ${data.price}`,
      `SOLUCIÓN PROPUESTA: ${data.solution}`,
      `INDUSTRIA: ${industry.emoji} ${industry.label}`,
    ].join("\n");
    onSave({ title: data.title, description, stage: data.stage, industry: data.industry });
  };

  const s = WIZARD_STEPS[step];
  const progress = ((step) / (WIZARD_STEPS.length - 1)) * 100;
  const goNext = () => canNext() && setStep(n => n + 1);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:16, backdropFilter:"blur(6px)" }}>
      <div style={{ background:"var(--bg2)", border:"1px solid var(--surface2)", borderRadius:24, width:"100%", maxWidth:520, boxShadow:"0 40px 100px rgba(0,0,0,0.6)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.06))", padding:"20px 24px 16px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.6),rgba(0,245,212,0.4),transparent)" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <SharkLogo size={30}/>
              <span style={{ color:"#fff", fontWeight:700, fontSize:15, fontFamily:"'Sora',sans-serif" }}>Nueva Idea</span>
            </div>
            <button onClick={onClose} style={{ background:"var(--surface2)", border:"none", borderRadius:7, color:"var(--textMid)", width:30, height:30, cursor:"pointer", fontSize:14 }}>✕</button>
          </div>
          {/* Progress bar */}
          <div style={{ height:3, background:"var(--border)", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#6C5CE7,#00F5D4)", borderRadius:99, transition:"width 0.4s cubic-bezier(.4,0,.2,1)" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            <span style={{ fontSize:11, color:"var(--textMute)", fontFamily:"'Sora',sans-serif" }}>Paso {step+1} de {WIZARD_STEPS.length}</span>
            <span style={{ fontSize:11, color:"var(--textMute)", fontFamily:"'Sora',sans-serif" }}>{s.emoji} {s.label}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"22px 24px 26px" }}>
          <div style={{ marginBottom:18 }}>
            <div style={{ fontWeight:700, fontSize:18, color:"var(--text)", fontFamily:"'Sora',sans-serif", marginBottom:6, letterSpacing:"-0.4px" }}>{s.emoji} {s.label}</div>
            <div style={{ color:"var(--textMute)", fontSize:13, lineHeight:1.6 }}>{s.desc}</div>
          </div>

          {/* Step 0 — Title */}
          {step === 0 && (
            <FocusInput value={data.title} onChange={v => set("title", v)} placeholder="ej: Liquidador de sueldos AI para PYMEs" onEnter={goNext}/>
          )}

          {/* Step 1 — Customer */}
          {step === 1 && (
            <div style={{ display:"grid", gap:10 }}>
              <FocusInput value={data.customer} onChange={v => set("customer", v)} placeholder="ej: CFO de empresa de 20-100 empleados en LATAM" onEnter={goNext}/>
              <div style={{ fontSize:11, color:"var(--textMute)", fontFamily:"'DM Sans',sans-serif" }}>Atajos rápidos:</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["Dueño PyME","CTO startup","HR manager","Profesional independiente","Consumidor final","Director de escuela","Reclutador","Gerente de ventas"].map(opt => (
                  <button key={opt} onClick={() => set("customer", opt)}
                    style={{ background: data.customer === opt ? "rgba(108,92,231,0.2)" : "var(--surface)", border: `1px solid ${data.customer === opt ? "rgba(108,92,231,0.4)" : "var(--border)"}`, borderRadius:99, padding:"5px 12px", fontSize:11, fontWeight:600, color: data.customer === opt ? "#6C5CE7" : "var(--textMute)", cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.12s" }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Pain */}
          {step === 2 && (
            <div style={{ display:"grid", gap:10 }}>
              <FocusInput value={data.pain} onChange={v => set("pain", v)} placeholder="ej: Hoy hacen todo en Excel, les toma 3 días por mes, cometen errores y pagan multas por eso" multiline rows={3}/>
              <div style={{ background:"rgba(255,181,71,0.08)", border:"1px solid rgba(255,181,71,0.2)", borderRadius:10, padding:"10px 14px", fontSize:12, color:"rgba(255,181,71,0.8)", lineHeight:1.5 }}>
                💡 El mejor dolor: tiene costo en $ o tiempo medible, ocurre con frecuencia, el cliente ya intenta resolverlo (mal)
              </div>
            </div>
          )}

          {/* Step 3 — Current price / solution */}
          {step === 3 && (
            <div style={{ display:"grid", gap:10 }}>
              <FocusInput value={data.price} onChange={v => set("price", v)} placeholder="ej: Usan un contador externo que cobra $200/mes, o Excel gratis pero les roba 8hs" multiline rows={3}/>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["No pagan nada todavía","Herramienta de $10-50/mes","Consultor o agencia","Software legacy caro ($500+/mes)","Lo hacen manual / in-house"].map(opt => (
                  <button key={opt} onClick={() => set("price", opt)}
                    style={{ background: data.price === opt ? "rgba(0,245,212,0.12)" : "var(--surface)", border: `1px solid ${data.price === opt ? "rgba(0,245,212,0.3)" : "var(--border)"}`, borderRadius:99, padding:"5px 12px", fontSize:11, fontWeight:600, color: data.price === opt ? "#00F5D4" : "var(--textMute)", cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.12s" }}>
                    {opt}
                  </button>
                ))}
              </div>
              <div style={{ background:"rgba(108,92,231,0.08)", border:"1px solid rgba(108,92,231,0.18)", borderRadius:10, padding:"10px 14px", fontSize:12, color:"rgba(108,92,231,0.9)", lineHeight:1.5 }}>
                🦈 El Shark usa esto para calibrar tu precio y evaluar el gap real de mercado
              </div>
            </div>
          )}

          {/* Step 4 — Solution */}
          {step === 4 && (
            <div style={{ display:"grid", gap:10 }}>
              <FocusInput value={data.solution} onChange={v => set("solution", v)} placeholder="ej: Subís el Excel de empleados, la AI calcula sueldos, deducciones y genera los recibos en 3 minutos" multiline rows={3}/>
              <div style={{ background:"rgba(255,95,122,0.07)", border:"1px solid rgba(255,95,122,0.18)", borderRadius:10, padding:"10px 14px", fontSize:12, color:"rgba(255,95,122,0.85)", lineHeight:1.5 }}>
                ⚡ Evitá decir "una plataforma AI que usa ML para optimizar...". Describí lo que hace, no la tecnología.
              </div>
            </div>
          )}

          {/* Step 5 — Industry */}
          {step === 5 && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {INDUSTRIES.map(ind => (
                <button key={ind.key} onClick={() => set("industry", ind.key)}
                  style={{ background: data.industry === ind.key ? "rgba(108,92,231,0.2)" : "var(--surface)", border: `1px solid ${data.industry === ind.key ? "rgba(108,92,231,0.5)" : "var(--surface2)"}`, borderRadius:10, padding:"11px 14px", cursor:"pointer", textAlign:"left", transition:"all 0.12s", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>{ind.emoji}</span>
                  <span style={{ fontSize:13, fontWeight:600, color: data.industry === ind.key ? "#fff" : "var(--textMid)", fontFamily:"'Sora',sans-serif" }}>{ind.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 6 — Stage */}
          {step === 6 && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {STAGES.map(st => (
                <button key={st.key} onClick={() => set("stage", st.key)}
                  style={{ background: data.stage === st.key ? st.bg : "var(--surface)", color: data.stage === st.key ? st.color : "var(--textMid)", border: `1px solid ${data.stage === st.key ? st.color + "40" : "var(--surface2)"}`, borderRadius:12, padding:"14px 10px", fontSize:13, fontWeight:700, cursor:"pointer", textAlign:"center", transition:"all 0.15s", fontFamily:"'Sora',sans-serif", boxShadow: data.stage === st.key ? `0 0 16px ${st.color}20` : "none" }}>
                  <div style={{ fontSize:24, marginBottom:4 }}>{st.emoji}</div>
                  {st.label}
                </button>
              ))}
            </div>
          )}

          {/* Nav */}
          <div style={{ display:"flex", gap:8, marginTop:20 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex:1, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:"12px", color:"var(--textMid)", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
                ← Atrás
              </button>
            )}
            {step < WIZARD_STEPS.length - 1 ? (
              <button onClick={goNext} disabled={!canNext()}
                style={{ flex:2, background: canNext() ? "linear-gradient(135deg,#6C5CE7,#00F5D4)" : "var(--surface)", border:"none", borderRadius:10, padding:"12px", color: canNext() ? "#fff" : "var(--textMute)", fontWeight:700, fontSize:14, cursor: canNext() ? "pointer" : "not-allowed", fontFamily:"'Sora',sans-serif", boxShadow: canNext() ? "0 0 20px rgba(108,92,231,0.4)" : "none", transition:"all 0.15s" }}>
                Siguiente →
              </button>
            ) : (
              <button onClick={handleSave}
                style={{ flex:2, background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:10, padding:"12px", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 0 20px rgba(108,92,231,0.4)" }}>
                🦈 Que el Shark analice
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
