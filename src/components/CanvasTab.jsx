import { T } from "../constants";

const CANVAS_BLOCKS = [
  { key:"propuestaValor",    label:"Propuesta de Valor",   emoji:"💎", color:"#6C5CE7", bg:"rgba(108,92,231,0.12)", border:"rgba(108,92,231,0.25)", wide:true },
  { key:"segmentoClientes",  label:"Segmento de Clientes", emoji:"👥", color:"#00F5D4", bg:"rgba(0,245,212,0.08)",  border:"rgba(0,245,212,0.2)"  },
  { key:"canales",           label:"Canales",              emoji:"📡", color:"#00F5D4", bg:"rgba(0,245,212,0.06)",  border:"rgba(0,245,212,0.15)" },
  { key:"relacionClientes",  label:"Relación con Clientes",emoji:"🤝", color:"#FFB547", bg:"rgba(255,181,71,0.08)", border:"rgba(255,181,71,0.2)"  },
  { key:"actividadesClave",  label:"Actividades Clave",    emoji:"⚙️", color:"#6C5CE7", bg:"rgba(108,92,231,0.08)", border:"rgba(108,92,231,0.2)"  },
  { key:"recursosClave",     label:"Recursos Clave",       emoji:"🔑", color:"#6C5CE7", bg:"rgba(108,92,231,0.06)", border:"rgba(108,92,231,0.15)" },
  { key:"sociosClave",       label:"Socios Clave",         emoji:"🤝", color:"#FFB547", bg:"rgba(255,181,71,0.06)", border:"rgba(255,181,71,0.15)" },
  { key:"estructuraCostos",  label:"Estructura de Costos", emoji:"💸", color:"#FF5F7A", bg:"rgba(255,95,122,0.08)", border:"rgba(255,95,122,0.2)",  wide:true },
  { key:"fuentesIngreso",    label:"Fuentes de Ingreso",   emoji:"💰", color:"#00F5D4", bg:"rgba(0,245,212,0.1)",   border:"rgba(0,245,212,0.25)", wide:true },
];

export default function CanvasTab({ a, onGoAnalysis }) {
  if (!a?.canvas) return (
    <div style={{ textAlign:"center", padding:"64px 20px", background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, backdropFilter:"blur(12px)" }}>
      <div style={{ fontSize:44, marginBottom:16 }}>📋</div>
      <div style={{ fontWeight:700, fontSize:18, color:T.text, marginBottom:8, fontFamily:T.fontDisplay }}>Canvas no generado todavía</div>
      <div style={{ color:T.textMute, fontSize:14, marginBottom:28 }}>Generá el análisis primero y el Lean Canvas se arma automáticamente</div>
      <button onClick={onGoAnalysis} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:10, padding:"11px 24px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:T.fontDisplay, boxShadow:"0 0 24px rgba(108,92,231,0.4)" }}>🦈 Analizar idea</button>
    </div>
  );

  const c = a.canvas;

  return (
    <div style={{ display:"grid", gap:14 }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,245,212,0.06))", border:"1px solid rgba(108,92,231,0.25)", borderRadius:16, padding:"16px 22px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.5),rgba(0,245,212,0.3),transparent)" }}/>
        <div style={{ fontWeight:700, fontSize:10, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:5, fontFamily:T.fontDisplay }}>Generado automáticamente por el Shark</div>
        <div style={{ fontWeight:700, fontSize:17, color:T.text, fontFamily:T.fontDisplay, letterSpacing:"-0.3px" }}>📋 Lean Canvas</div>
      </div>

      {/* Canvas grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {CANVAS_BLOCKS.map(block => {
          const value = c[block.key];
          if (!value) return null;
          const content = Array.isArray(value) ? value : [value];
          return (
            <div key={block.key} style={{ background:block.bg, border:`1px solid ${block.border}`, borderRadius:14, padding:"16px 18px", gridColumn: block.wide ? "1 / -1" : "auto", backdropFilter:"blur(8px)" }}>
              <div style={{ fontSize:10, fontWeight:700, color:block.color, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:10, fontFamily:T.fontDisplay }}>
                {block.emoji} {block.label}
              </div>
              {content.length > 1 ? (
                <ul style={{ margin:0, paddingLeft:16, display:"grid", gap:4 }}>
                  {content.map((item, i) => (
                    <li key={i} style={{ fontSize:13, color:T.textMid, lineHeight:1.55 }}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin:0, fontSize:13, color:T.textMid, lineHeight:1.65 }}>{content[0]}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
