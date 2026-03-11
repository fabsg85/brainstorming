import { T } from "../constants";

const PHASES = [
  { label: "Mes 1 — Validación",   color: "#FF5F7A", icon: "🔍", bg: "rgba(255,95,122,0.08)",  border: "rgba(255,95,122,0.2)" },
  { label: "Mes 2 — Construcción", color: "#FFB547", icon: "🔨", bg: "rgba(255,181,71,0.08)",  border: "rgba(255,181,71,0.2)" },
  { label: "Mes 3 — Lanzamiento",  color: "#00F5D4", icon: "🚀", bg: "rgba(0,245,212,0.08)",   border: "rgba(0,245,212,0.2)" },
];

export default function TimelineGTM({ gtm90dias }) {
  if (!gtm90dias) return null;
  const sentences = gtm90dias.split(/\.\s+/).filter(s => s.trim().length > 10);
  return (
    <div style={{ position:"relative", paddingLeft:32 }}>
      <div style={{ position:"absolute", left:11, top:10, bottom:10, width:1, background:"linear-gradient(180deg,#FF5F7A,#FFB547,#00F5D4)", borderRadius:99, opacity:0.4 }}/>
      {PHASES.map((p,i) => (
        <div key={i} style={{ display:"flex", gap:18, marginBottom:i<2?22:0, position:"relative" }}>
          <div style={{ width:22, height:22, borderRadius:"50%", background:p.color, border:"3px solid rgba(11,11,15,0.8)", flexShrink:0, marginTop:2, boxShadow:`0 0 12px ${p.color}60, 0 0 0 4px ${p.color}15`, position:"relative", zIndex:1 }}/>
          <div style={{ flex:1, background:p.bg, border:`1px solid ${p.border}`, borderRadius:12, padding:"12px 16px", backdropFilter:"blur(8px)" }}>
            <div style={{ fontSize:10, fontWeight:800, color:p.color, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6, fontFamily:"'Sora', sans-serif" }}>
              {p.icon} {p.label}
            </div>
            <p style={{ margin:0, fontSize:13, color:"var(--textMid)", lineHeight:1.65, fontFamily:"'DM Sans', sans-serif" }}>
              {sentences[i]||"..."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
