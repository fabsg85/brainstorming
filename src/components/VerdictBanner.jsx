import { T } from "../constants";
import { scoreColor, scoreVerdict } from "../utils";
import GaugeChart from "./GaugeChart";

export default function VerdictBanner({ score }) {
  if (!score) return null;
  const v = scoreVerdict(score);
  const c = scoreColor(score);
  if (!v) return null;

  return (
    <div style={{ background: T.text, borderRadius: 18, padding: "22px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: `0 12px 40px ${T.text}25, 0 0 0 1px ${T.text}10` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "#FFFFFF50", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, fontFamily: T.font }}>
          Veredicto del Shark
        </div>
        <div style={{ fontWeight: 700, fontSize: 24, color: c, fontFamily: T.fontDisplay, marginBottom: 6 }}>
          {v.emoji} {v.label}
        </div>
        <div style={{ fontSize: 13, color: "#FFFFFF60", fontFamily: T.font, lineHeight: 1.5 }}>
          {v.sub}
        </div>
      </div>
      <div style={{ flexShrink: 0, marginLeft: 16 }}>
        <GaugeChart score={score} size={148} />
      </div>
    </div>
  );
}
