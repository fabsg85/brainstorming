import { useState } from "react";
import { T } from "../constants";
import SharkLogo from "./SharkLogo";

export default function VotingPanel({ idea, onVote }) {
  const [voterName, setVoterName] = useState("");
  const [voted,     setVoted]     = useState(false);

  const votes = idea.votes || [];
  const ups   = votes.filter((v) => v.vote === "up").length;
  const downs = votes.filter((v) => v.vote === "down").length;

  const handleVote = (type) => {
    if (!voterName.trim()) return;
    if (votes.find((v) => v.name === voterName.trim())) { setVoted(true); return; }
    onVote(idea.id, {
      name: voterName.trim(),
      vote: type,
      time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    });
    setVoted(true);
  };

  return (
    <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ background: T.text, padding: "16px 22px" }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#FFF", fontFamily: T.fontDisplay, marginBottom: 3 }}>🗳️ El equipo habla primero</div>
        <div style={{ fontSize: 12, color: "#FFFFFF50", fontFamily: T.font }}>Votá antes del análisis. El Shark habla después.</div>
      </div>
      <div style={{ padding: "18px 22px" }}>
        {votes.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              {[
                { count: ups,   label: "A favor",   color: T.mint,  bg: T.mintLight,  emoji: "👍" },
                { count: downs, label: "En contra",  color: T.coral, bg: T.coralLight, emoji: "👎" },
              ].map(({ count, label, color, bg, emoji }) => (
                <div key={label} style={{ flex: 1, background: bg, border: `1.5px solid ${color}25`, borderRadius: 12, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>{emoji} {count}</div>
                  <div style={{ fontSize: 11, color, fontWeight: 700, marginTop: 4, fontFamily: T.font }}>{label}</div>
                </div>
              ))}
            </div>
            {votes.map((v, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bg, borderRadius: 8, padding: "8px 12px", marginBottom: 6, fontFamily: T.font }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{v.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{v.vote === "up" ? "👍" : "👎"}</span>
                  <span style={{ fontSize: 11, color: T.textMute }}>{v.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!voted ? (
          <div>
            <input
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              placeholder="Tu nombre (no te hagas el anónimo)"
              style={{ border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", color: T.text, width: "100%", boxSizing: "border-box", marginBottom: 10, fontFamily: T.font, background: T.bg }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { type: "up",   label: "👍 Dale", color: T.mint,  bg: T.mintLight  },
                { type: "down", label: "👎 Paso", color: T.coral, bg: T.coralLight },
              ].map(({ type, label, color, bg }) => (
                <button
                  key={type}
                  onClick={() => handleVote(type)}
                  disabled={!voterName.trim()}
                  style={{ flex: 1, background: voterName.trim() ? bg : T.bg, border: `2px solid ${voterName.trim() ? color + "40" : T.border}`, borderRadius: 10, padding: "12px", color: voterName.trim() ? color : T.textMute, fontWeight: 800, fontSize: 15, cursor: voterName.trim() ? "pointer" : "not-allowed", fontFamily: T.font, transition: "all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: T.mintLight, border: `1.5px solid ${T.mint}30`, borderRadius: 10, padding: "14px", textAlign: "center", color: T.mint, fontWeight: 700, fontSize: 13, fontFamily: T.font }}>
            ✅ Voto registrado. Ahora a ver qué dice el Shark.
          </div>
        )}
      </div>
    </div>
  );
}
