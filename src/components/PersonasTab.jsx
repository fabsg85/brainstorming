import { T } from "../constants";

export default function PersonasTab({ a, onGoAnalysis }) {
  if (!a?.personas?.length) return (
    <div style={{ textAlign:"center", padding:"64px 20px", background:var(--surface), border:`1px solid ${var(--border)}`, borderRadius:20, backdropFilter:"blur(12px)" }}>
      <div style={{ fontSize:44, marginBottom:16 }}>👤</div>
      <div style={{ fontWeight:700, fontSize:18, color:var(--text), marginBottom:8, fontFamily:"'Sora', sans-serif" }}>Sin personas todavía</div>
      <div style={{ color:var(--text)Mute, fontSize:14, marginBottom:28 }}>Generá el análisis primero</div>
      <button onClick={onGoAnalysis} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:10, padding:"11px 24px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Sora', sans-serif", boxShadow:"0 0 24px rgba(108,92,231,0.4)" }}>🦈 Analizar</button>
    </div>
  );

  const PERSONA_COLORS = [
    { grad:"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.06))", border:"rgba(108,92,231,0.3)", accent:"#6C5CE7" },
    { grad:"linear-gradient(135deg,rgba(0,245,212,0.12),rgba(108,92,231,0.06))", border:"rgba(0,245,212,0.25)", accent:"#00F5D4" },
  ];

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {a.personas.map((p, i) => {
          const col = PERSONA_COLORS[i % 2];
          return (
            <div key={i} style={{ background:var(--surface), border:`1px solid ${col.border}`, borderRadius:18, overflow:"hidden", backdropFilter:"blur(12px)", boxShadow:`0 0 30px ${col.accent}10` }}>
              {/* Persona header */}
              <div style={{ background:col.grad, padding:"20px 20px 16px", borderBottom:`1px solid ${var(--border)}`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${col.accent}60,transparent)` }}/>
                {/* Avatar placeholder */}
                <div style={{ width:52, height:52, borderRadius:"50%", background:`linear-gradient(135deg,${col.accent}40,${col.accent}20)`, border:`2px solid ${col.accent}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:12 }}>
                  {i === 0 ? "👔" : "👩‍💼"}
                </div>
                <div style={{ fontWeight:800, fontSize:18, color:"#fff", fontFamily:"'Sora', sans-serif", letterSpacing:"-0.4px", marginBottom:2 }}>{p.nombre}</div>
                <div style={{ fontSize:13, color:"var(--textMid)", fontFamily:"'DM Sans', sans-serif" }}>{p.rol} · {p.edad}</div>
              </div>

              <div style={{ padding:"16px 20px", display:"grid", gap:12 }}>
                {/* Quote */}
                {p.frase && (
                  <div style={{ background:"var(--surface)", border:`1px solid ${col.border}`, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:13, color:var(--text)Mid, lineHeight:1.6, fontStyle:"italic" }}>"{p.frase}"</div>
                  </div>
                )}

                {/* Pain + Goal */}
                {[
                  { label:"😤 Frustración diaria",    value:p.frustracion,    color:"#FF5F7A", bg:"rgba(255,95,122,0.07)", border:"rgba(255,95,122,0.18)" },
                  { label:"🎯 Objetivo principal",    value:p.objetivo,       color:"#00F5D4", bg:"rgba(0,245,212,0.06)",  border:"rgba(0,245,212,0.15)" },
                  { label:"💳 Disposición a pagar",   value:p.disposicionPago,color:"#FFB547", bg:"rgba(255,181,71,0.07)", border:"rgba(255,181,71,0.18)" },
                  { label:"📱 Canal de adquisición",  value:p.canal,          color:"#6C5CE7", bg:"rgba(108,92,231,0.08)", border:"rgba(108,92,231,0.18)" },
                ].filter(item => item.value).map(({ label, value, color, bg, border }) => (
                  <div key={label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"10px 14px" }}>
                    <div style={{ fontSize:10, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:4, fontFamily:"'Sora', sans-serif" }}>{label}</div>
                    <div style={{ fontSize:13, color:var(--text)Mid, lineHeight:1.5 }}>{value}</div>
                  </div>
                ))}

                {/* Triggers */}
                {p.triggers?.length > 0 && (
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:var(--text)Mute, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:6, fontFamily:"'Sora', sans-serif" }}>⚡ Qué lo activa a comprar</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {p.triggers.map((t, j) => (
                        <span key={j} style={{ background:"rgba(108,92,231,0.1)", border:"1px solid rgba(108,92,231,0.2)", color:"var(--textMid)", borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:600, fontFamily:"'Sora', sans-serif" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight banner */}
      {a.personaInsight && (
        <div style={{ background:"rgba(255,181,71,0.08)", border:"1px solid rgba(255,181,71,0.2)", borderRadius:14, padding:"16px 20px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#FFB547", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6, fontFamily:"'Sora', sans-serif" }}>🦈 Insight del Shark</div>
          <p style={{ margin:0, fontSize:14, color:var(--text)Mid, lineHeight:1.65, fontStyle:"italic" }}>{a.personaInsight}</p>
        </div>
      )}
    </div>
  );
}
