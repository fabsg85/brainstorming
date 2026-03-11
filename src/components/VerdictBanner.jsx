import { scoreColor, scoreVerdict } from "../utils";
import GaugeChart from "./GaugeChart";

export default function VerdictBanner({ score }) {
  if (!score) return null;
  const v = scoreVerdict(score);
  const c = scoreColor(score);
  if (!v) return null;
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(0,245,212,0.06) 100%)",
      border: "1px solid rgba(108,92,231,0.25)",
      borderRadius: 18,
      padding: "24px 28px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backdropFilter: "blur(16px)",
      boxShadow: "0 0 60px rgba(108,92,231,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.6),rgba(0,245,212,0.4),transparent)" }}/>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:10, color:"var(--textMute)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:10, fontFamily:"'Sora',sans-serif" }}>
          Veredicto del Shark
        </div>
        <div style={{ fontWeight:700, fontSize:26, color:c, fontFamily:"'Sora',sans-serif", marginBottom:8, letterSpacing:"-0.5px", textShadow:`0 0 20px ${c}50` }}>
          {v.emoji} {v.label}
        </div>
        <div style={{ fontSize:13, color:"var(--textMid)", fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, fontStyle:"italic" }}>
          "{v.sub}"
        </div>
      </div>
      <div style={{ flexShrink:0, marginLeft:20 }}>
        <GaugeChart score={score} size={150}/>
      </div>
    </div>
  );
}
