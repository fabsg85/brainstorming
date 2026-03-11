import { useState } from "react";
import { T, STAGES, WIZARD_STEPS } from "../constants";
import SharkLogo from "./SharkLogo";

export default function Wizard({ onSave, onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ title: "", description: "", stage: "idea" });

  const canNext =
    step === 0 ? data.title.trim().length > 2 :
    step === 1 ? data.description.trim().length > 10 : true;

  const inputBase = {
    border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "13px 15px",
    fontSize: 14, outline: "none", color: T.text, width: "100%",
    boxSizing: "border-box", fontFamily: T.font, background: T.bg, transition: "border-color 0.15s",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000066", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 24, width: "100%", maxWidth: 500, boxShadow: "0 30px 80px #00000025", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: T.text, padding: "22px 26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SharkLogo size={30} />
              <span style={{ color: "#FFF", fontWeight: 700, fontSize: 16, fontFamily: T.fontDisplay }}>Nueva Idea</span>
            </div>
            <button onClick={onClose} style={{ background: "#FFFFFF15", border: "none", borderRadius: 7, color: "#FFF", width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {WIZARD_STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? T.coral : "#FFFFFF20", transition: "background 0.3s" }} />
            ))}
          </div>
          <div style={{ marginTop: 8, color: "#FFFFFF40", fontSize: 11, fontFamily: T.font }}>Paso {step + 1} de {WIZARD_STEPS.length}</div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 26px 28px" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>{WIZARD_STEPS[step].emoji}</div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6, color: T.text, fontFamily: T.fontDisplay }}>{WIZARD_STEPS[step].label}</div>
          <div style={{ color: T.textMid, fontSize: 13, marginBottom: 20, lineHeight: 1.6, fontFamily: T.font }}>{WIZARD_STEPS[step].desc}</div>

          {step === 0 && (
            <input
              autoFocus value={data.title}
              onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && canNext && setStep(1)}
              placeholder="ej: Liquidador de sueldos AI para PYMEs uruguayas"
              style={inputBase}
              onFocus={(e) => (e.target.style.borderColor = T.coral)}
              onBlur={(e)  => (e.target.style.borderColor = T.border)}
            />
          )}
          {step === 1 && (
            <textarea
              autoFocus value={data.description}
              onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))}
              placeholder="¿Qué dolor resuelve? ¿Quién lo sufre? ¿Cuánto pagan hoy para no resolverlo?"
              rows={5} style={{ ...inputBase, resize: "vertical", lineHeight: 1.6 }}
              onFocus={(e) => (e.target.style.borderColor = T.coral)}
              onBlur={(e)  => (e.target.style.borderColor = T.border)}
            />
          )}
          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {STAGES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setData((p) => ({ ...p, stage: s.key }))}
                  style={{ background: data.stage === s.key ? s.bg : T.bg, color: data.stage === s.key ? s.color : T.textMid, border: `2px solid ${data.stage === s.key ? s.color + "50" : T.border}`, borderRadius: 12, padding: "14px 10px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", transition: "all 0.15s", fontFamily: T.font }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{s.emoji}</div>
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} style={{ flex: 1, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "12px", color: T.text, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: T.font }}>
                ← Atrás
              </button>
            )}
            {step < WIZARD_STEPS.length - 1 ? (
              <button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext}
                style={{ flex: 2, background: canNext ? T.text : T.bg, border: "none", borderRadius: 10, padding: "12px", color: canNext ? "#FFF" : T.textMute, fontWeight: 800, fontSize: 14, cursor: canNext ? "pointer" : "not-allowed", fontFamily: T.font }}>
                Siguiente →
              </button>
            ) : (
              <button onClick={() => onSave(data)} style={{ flex: 2, background: T.text, border: "none", borderRadius: 10, padding: "12px", color: "#FFF", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: T.font }}>
                🦈 Al board
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
