import { useState } from "react";
import { T } from "../constants";

export default function VotingPanel({ idea, onVote }) {
  const [voterName, setVoterName] = useState("");
  const [voted,     setVoted]     = useState(false);
  const votes = idea.votes || [];
  const ups   = votes.filter(v => v.vote === "up").length;
  const downs = votes.filter(v => v.vote === "down").length;

  const handleVote = type => {
    if (!voterName.trim()) return;
    if (votes.find(v => v.name === voterName.trim())) { setVoted(true); return; }
    onVote(idea.id, { name: voterName.trim(), vote: type, time: new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}) });
    setVoted(true);
  };

  const inputStyle = {
    border: `1px solid ${var(--border2)}`,
    borderRadius: 10, padding: "11px 14px",
    fontSize: 13, outline: "none",
    color: "var(--text)", width: "100%",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    background: "var(--surface)",
    backdropFilter: "blur(8px)",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ background: "var(--surface)", border: `1px solid ${var(--border)}`, borderRadius: 18, overflow: "hidden", marginBottom: 16, backdropFilter: "blur(12px)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.08))", padding: "18px 22px", borderBottom: `1px solid ${var(--border)}`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.5),transparent)" }}/>
        <div style={{ fontWeight:700, fontSize:16, color:"var(--text)", fontFamily:"'Sora', sans-serif", marginBottom:3, letterSpacing:"-0.3px" }}>🗳️ El equipo habla primero</div>
        <div style={{ fontSize:12, color:"var(--text)"Mute }}>Votá antes del análisis. El Shark habla después.</div>
      </div>

      <div style={{ padding: "18px 22px" }}>
        {votes.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display:"flex", gap:10, marginBottom:14 }}>
              {[
                { count:ups,   label:"A favor",  color:"#00F5D4", bg:"rgba(0,245,212,0.08)",   border:"rgba(0,245,212,0.2)",   emoji:"👍" },
                { count:downs, label:"En contra", color:"#FF5F7A", bg:"rgba(255,95,122,0.08)",  border:"rgba(255,95,122,0.2)",  emoji:"👎" },
              ].map(({count,label,color,bg,border,emoji}) => (
                <div key={label} style={{ flex:1, background:bg, border:`1px solid ${border}`, borderRadius:12, padding:"12px", textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:900, color, lineHeight:1 }}>{emoji} {count}</div>
                  <div style={{ fontSize:11, color, fontWeight:700, marginTop:4, fontFamily:"'Sora', sans-serif" }}>{label}</div>
                </div>
              ))}
            </div>
            {votes.map((v,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"var(--surface)", borderRadius:8, padding:"8px 12px", marginBottom:6, border:`1px solid ${var(--border)}` }}>
                <span style={{ fontSize:13, fontWeight:600, color:"var(--text)", fontFamily:"'Sora', sans-serif" }}>{v.name}</span>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:16 }}>{v.vote==="up"?"👍":"👎"}</span>
                  <span style={{ fontSize:11, color:"var(--text)"Mute, fontFamily:"monospace" }}>{v.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!voted ? (
          <div>
            <input value={voterName} onChange={e=>setVoterName(e.target.value)}
              placeholder="Tu nombre (no te hagas el anónimo)"
              style={inputStyle}
              onFocus={e=>(e.target.style.borderColor="rgba(108,92,231,0.6)")}
              onBlur={e=>(e.target.style.borderColor="var(--border2)")}/>
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              {[
                { type:"up",   label:"👍 Dale", color:"#00F5D4", bg:"rgba(0,245,212,0.1)",  border:"rgba(0,245,212,0.3)"  },
                { type:"down", label:"👎 Paso", color:"#FF5F7A", bg:"rgba(255,95,122,0.1)", border:"rgba(255,95,122,0.3)" },
              ].map(({type,label,color,bg,border}) => (
                <button key={type} onClick={()=>handleVote(type)} disabled={!voterName.trim()}
                  style={{ flex:1, background:voterName.trim()?bg:"var(--surface)", border:`1px solid ${voterName.trim()?border:"var(--border)"}`, borderRadius:10, padding:"12px", color:voterName.trim()?color:"var(--text)"Mute, fontWeight:800, fontSize:14, cursor:voterName.trim()?"pointer":"not-allowed", fontFamily:"'Sora', sans-serif", transition:"all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background:"rgba(0,245,212,0.08)", border:"1px solid rgba(0,245,212,0.2)", borderRadius:10, padding:"14px", textAlign:"center", color:"#00F5D4", fontWeight:700, fontSize:13, fontFamily:"'Sora', sans-serif" }}>
            ✅ Voto registrado. Ahora a ver qué dice el Shark.
          </div>
        )}
      </div>
    </div>
  );
}
