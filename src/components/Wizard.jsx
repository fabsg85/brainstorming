import { useState } from "react";
import { T, STAGES, WIZARD_STEPS } from "../constants";
import SharkLogo from "./SharkLogo";

export default function Wizard({ onSave, onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ title:"", description:"", stage:"idea" });

  const canNext =
    step===0 ? data.title.trim().length>2 :
    step===1 ? data.description.trim().length>10 : true;

  const inputBase = {
    border: `1px solid ${T.border2}`,
    borderRadius: 10, padding: "13px 15px",
    fontSize: 14, outline: "none",
    color: T.text, width: "100%", boxSizing: "border-box",
    fontFamily: T.font,
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(8px)",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:16, backdropFilter:"blur(4px)" }}>
      <div style={{ background:"#111118", border:`1px solid ${T.border2}`, borderRadius:24, width:"100%", maxWidth:500, boxShadow:"0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.08))", padding:"22px 26px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.6),rgba(0,245,212,0.4),transparent)" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <SharkLogo size={30}/>
              <span style={{ color:T.white, fontWeight:700, fontSize:16, fontFamily:T.fontDisplay, letterSpacing:"-0.3px" }}>Nueva Idea</span>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:7, color:T.textMid, width:30, height:30, cursor:"pointer", fontSize:14 }}>✕</button>
          </div>
          {/* Progress */}
          <div style={{ display:"flex", gap:6 }}>
            {WIZARD_STEPS.map((_,i) => (
              <div key={i} style={{ flex:1, height:2, borderRadius:99, background:i<=step?"url(#wGrad)":"rgba(255,255,255,0.1)", transition:"background 0.3s", backgroundColor: i<=step?"#6C5CE7":"rgba(255,255,255,0.1)" }}/>
            ))}
          </div>
          <div style={{ marginTop:8, color:"rgba(255,255,255,0.28)", fontSize:11, fontFamily:T.fontDisplay }}>Paso {step+1} de {WIZARD_STEPS.length}</div>
        </div>

        {/* Body */}
        <div style={{ padding:"24px 26px 28px" }}>
          <div style={{ fontSize:30, marginBottom:8 }}>{WIZARD_STEPS[step].emoji}</div>
          <div style={{ fontWeight:700, fontSize:20, marginBottom:6, color:T.text, fontFamily:T.fontDisplay, letterSpacing:"-0.5px" }}>{WIZARD_STEPS[step].label}</div>
          <div style={{ color:T.textMute, fontSize:13, marginBottom:20, lineHeight:1.65, fontFamily:T.font }}>{WIZARD_STEPS[step].desc}</div>

          {step===0 && (
            <input autoFocus value={data.title}
              onChange={e=>setData(p=>({...p,title:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&canNext&&setStep(1)}
              placeholder="ej: Liquidador de sueldos AI para PYMEs"
              style={inputBase}
              onFocus={e=>(e.target.style.borderColor="rgba(108,92,231,0.6)")}
              onBlur={e=>(e.target.style.borderColor=T.border2)}/>
          )}
          {step===1 && (
            <textarea autoFocus value={data.description}
              onChange={e=>setData(p=>({...p,description:e.target.value}))}
              placeholder="¿Qué dolor resuelve? ¿Quién lo sufre? ¿Cuánto pagan hoy?"
              rows={5} style={{...inputBase,resize:"vertical",lineHeight:1.65}}
              onFocus={e=>(e.target.style.borderColor="rgba(108,92,231,0.6)")}
              onBlur={e=>(e.target.style.borderColor=T.border2)}/>
          )}
          {step===2 && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {STAGES.map(s => (
                <button key={s.key} onClick={()=>setData(p=>({...p,stage:s.key}))}
                  style={{ background:data.stage===s.key?s.bg:"rgba(255,255,255,0.03)", color:data.stage===s.key?s.color:T.textMute, border:`1px solid ${data.stage===s.key?s.color+"40":T.border}`, borderRadius:12, padding:"14px 10px", fontSize:13, fontWeight:700, cursor:"pointer", textAlign:"center", transition:"all 0.15s", fontFamily:T.fontDisplay, boxShadow:data.stage===s.key?`0 0 16px ${s.color}20`:"none" }}>
                  <div style={{ fontSize:26, marginBottom:4 }}>{s.emoji}</div>
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display:"flex", gap:10, marginTop:22 }}>
            {step>0 && (
              <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:10, padding:"12px", color:T.textMid, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:T.fontDisplay }}>
                ← Atrás
              </button>
            )}
            {step<WIZARD_STEPS.length-1 ? (
              <button onClick={()=>canNext&&setStep(s=>s+1)} disabled={!canNext}
                style={{ flex:2, background:canNext?"linear-gradient(135deg,#6C5CE7,#00F5D4)":"rgba(255,255,255,0.04)", border:"none", borderRadius:10, padding:"12px", color:canNext?"#fff":T.textMute, fontWeight:700, fontSize:14, cursor:canNext?"pointer":"not-allowed", fontFamily:T.fontDisplay, boxShadow:canNext?"0 0 20px rgba(108,92,231,0.4)":"none" }}>
                Siguiente →
              </button>
            ) : (
              <button onClick={()=>onSave(data)}
                style={{ flex:2, background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:10, padding:"12px", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:T.fontDisplay, boxShadow:"0 0 20px rgba(108,92,231,0.4)" }}>
                🦈 Al board
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
