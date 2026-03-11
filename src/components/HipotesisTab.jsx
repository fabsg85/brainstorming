import { T } from "../constants";

const RISK_COLORS = {
  alta:  { color:"#FF5F7A", bg:"rgba(255,95,122,0.1)",  border:"rgba(255,95,122,0.25)",  label:"Riesgo Alto" },
  media: { color:"#FFB547", bg:"rgba(255,181,71,0.1)",  border:"rgba(255,181,71,0.25)",  label:"Riesgo Medio" },
  baja:  { color:"#00F5D4", bg:"rgba(0,245,212,0.08)",  border:"rgba(0,245,212,0.2)",    label:"Riesgo Bajo" },
};

const METHOD_ICONS = {
  "entrevista": "🎙️", "landing": "🌐", "presell": "💳",
  "smoke test": "💨", "prototipo": "🖼️", "encuesta": "📋", "default": "🧪",
};

export default function HipotesisTab({ a, onGoAnalysis }) {
  if (!a?.hipotesis?.length) return (
    <div style={{ textAlign:"center", padding:"64px 20px", background:"var(--surface)", border:`1px solid ${var(--border)}`, borderRadius:20, backdropFilter:"blur(12px)" }}>
      <div style={{ fontSize:44, marginBottom:16 }}>🧪</div>
      <div style={{ fontWeight:700, fontSize:18, color:"var(--text)", marginBottom:8, fontFamily:"'Sora', sans-serif" }}>Sin hipótesis todavía</div>
      <div style={{ color:"var(--text)"Mute, fontSize:14, marginBottom:28 }}>Generá el análisis primero</div>
      <button onClick={onGoAnalysis} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:10, padding:"11px 24px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Sora', sans-serif", boxShadow:"0 0 24px rgba(108,92,231,0.4)" }}>🦈 Analizar</button>
    </div>
  );

  return (
    <div style={{ display:"grid", gap:14 }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,245,212,0.06))", border:"1px solid rgba(108,92,231,0.25)", borderRadius:16, padding:"18px 22px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.5),rgba(0,245,212,0.3),transparent)" }}/>
        <div style={{ fontWeight:700, fontSize:10, color:"var(--textMute)", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:8, fontFamily:"'Sora', sans-serif" }}>Framework de Validación</div>
        <div style={{ fontWeight:700, fontSize:17, color:"var(--text)", marginBottom:6, fontFamily:"'Sora', sans-serif", letterSpacing:"-0.3px" }}>
          🧪 Antes de escribir una línea de código
        </div>
        <p style={{ margin:0, fontSize:13, color:"var(--text)"Mid, lineHeight:1.65 }}>
          Estas son las suposiciones críticas que pueden matar el negocio. Rankeadas por riesgo. Testealas en este orden — si la primera falla, no sigas.
        </p>
      </div>

      {/* Hypotheses */}
      {a.hipotesis.map((h, i) => {
        const risk = RISK_COLORS[h.riesgo?.toLowerCase()] || RISK_COLORS.media;
        const methodKey = Object.keys(METHOD_ICONS).find(k => h.metodo?.toLowerCase().includes(k)) || "default";
        return (
          <div key={i} style={{ background:"var(--surface)", border:`1px solid ${var(--border)}`, borderRadius:16, overflow:"hidden", backdropFilter:"blur(12px)" }}>
            {/* Card header */}
            <div style={{ background:`linear-gradient(135deg,${risk.bg},"var(--surface)")`, borderBottom:`1px solid ${var(--border)}`, padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,#6C5CE7,#00F5D4)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, color:"#fff", fontFamily:"monospace", flexShrink:0 }}>
                  {i + 1}
                </div>
                <div style={{ fontWeight:700, fontSize:14, color:"var(--text)", fontFamily:"'Sora', sans-serif", letterSpacing:"-0.2px" }}>{h.hipotesis}</div>
              </div>
              <span style={{ background:risk.bg, color:risk.color, border:`1px solid ${risk.border}`, borderRadius:99, padding:"3px 10px", fontSize:10, fontWeight:700, fontFamily:"'Sora', sans-serif", flexShrink:0, marginLeft:12 }}>
                ⚠️ {risk.label}
              </span>
            </div>

            <div style={{ padding:"16px 20px", display:"grid", gap:12 }}>
              {/* Why critical */}
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"var(--text)"Mute, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:5, fontFamily:"'Sora', sans-serif" }}>¿Por qué es crítica?</div>
                <p style={{ margin:0, fontSize:13, color:"var(--text)"Mid, lineHeight:1.6 }}>{h.porqueCritica}</p>
              </div>

              {/* Test method + metric */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ background:"rgba(108,92,231,0.08)", border:"1px solid rgba(108,92,231,0.18)", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#6C5CE7", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:5, fontFamily:"'Sora', sans-serif" }}>
                    {METHOD_ICONS[methodKey]} Cómo testearla
                  </div>
                  <p style={{ margin:0, fontSize:13, color:"var(--text)"Mid, lineHeight:1.5 }}>{h.metodo}</p>
                </div>
                <div style={{ background:"rgba(0,245,212,0.06)", border:"1px solid rgba(0,245,212,0.15)", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#00F5D4", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:5, fontFamily:"'Sora', sans-serif" }}>📏 Métrica de éxito</div>
                  <p style={{ margin:0, fontSize:13, color:"var(--text)"Mid, lineHeight:1.5 }}>{h.metrica}</p>
                </div>
              </div>

              {/* Cost + Time */}
              <div style={{ display:"flex", gap:10 }}>
                {[
                  { label:"⏱️ Tiempo", value: h.tiempoEstimado, color:"#FFB547", bg:"rgba(255,181,71,0.08)", border:"rgba(255,181,71,0.2)" },
                  { label:"💸 Costo",  value: h.costoEstimado,  color:"#6C5CE7", bg:"rgba(108,92,231,0.08)", border:"rgba(108,92,231,0.2)" },
                ].map(({ label, value, color, bg, border }) => (
                  <div key={label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"10px 14px", flex:1 }}>
                    <div style={{ fontSize:10, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:3, fontFamily:"'Sora', sans-serif" }}>{label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", fontFamily:"'Sora', sans-serif" }}>{value || "—"}</div>
                  </div>
                ))}
                {h.siFalla && (
                  <div style={{ background:"rgba(255,95,122,0.06)", border:"1px solid rgba(255,95,122,0.15)", borderRadius:10, padding:"10px 14px", flex:2 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"#FF5F7A", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:3, fontFamily:"'Sora', sans-serif" }}>☠️ Si falla</div>
                    <div style={{ fontSize:12, color:"var(--text)"Mid, lineHeight:1.4 }}>{h.siFalla}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
