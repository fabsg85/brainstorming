import { useState } from "react";
import { T } from "../constants";
import { scoreColor, scoreLabel, exportMarkdown } from "../utils";
import SharkLogo from "./SharkLogo";
import RadarChart from "./RadarChart";
import TimelineGTM from "./TimelineGTM";

export default function PitchDeckModal({ idea, analysis: a, onClose }) {
  const [slide, setSlide] = useState(0);
  const score = a?.avgScore;

  const slides = [
    {
      num:"01", title:"El Problema", color:"#FF5F7A", accent:"rgba(255,95,122,0.15)",
      content:(
        <div style={{display:"grid",gap:12}}>
          <p style={{fontSize:15,lineHeight:1.8,color:var(--text)Mid,margin:0,fontFamily:"'DM Sans', sans-serif"}}>{idea.description}</p>
          <div style={{background:"rgba(255,95,122,0.08)",border:"1px solid rgba(255,95,122,0.2)",borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#FF5F7A",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.8px",fontFamily:"'Sora', sans-serif"}}>💸 ¿Pagan por esto hoy?</div>
            <p style={{margin:0,fontSize:14,color:var(--text)Mid,lineHeight:1.6}}>{a?.pagaHoy||"Sin datos"}</p>
          </div>
        </div>
      ),
    },
    {
      num:"02", title:"La Solución", color:"#6C5CE7", accent:"rgba(108,92,231,0.15)",
      content:(
        <div style={{display:"grid",gap:12}}>
          <p style={{fontSize:15,lineHeight:1.8,color:var(--text)Mid,margin:0}}>{a?.diferencial}</p>
          <div style={{background:"var(--surface)",border:`1px solid ${var(--border)2}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:var(--text)Mute,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.8px",fontFamily:"'Sora', sans-serif"}}>⚙️ Stack técnico</div>
            <p style={{margin:0,fontSize:13,color:var(--text),fontFamily:"monospace",lineHeight:1.7}}>{a?.stack}</p>
          </div>
        </div>
      ),
    },
    {
      num:"03", title:"Mercado & Score", color:"#00F5D4", accent:"rgba(0,245,212,0.10)",
      content:(
        <div style={{display:"grid",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{t:"👥 Cliente objetivo",v:a?.publicObj},{t:"🔍 vs Competencia",v:a?.benchmark}].map(({t,v})=>(
              <div key={t} style={{background:"rgba(0,245,212,0.06)",border:"1px solid rgba(0,245,212,0.15)",borderRadius:10,padding:"14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#00F5D4",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.8px",fontFamily:"'Sora', sans-serif"}}>{t}</div>
                <p style={{margin:0,fontSize:13,color:var(--text)Mid,lineHeight:1.5}}>{v}</p>
              </div>
            ))}
          </div>
          {score && (
            <div style={{background:"rgba(108,92,231,0.12)",border:"1px solid rgba(108,92,231,0.2)",borderRadius:12,padding:"16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <RadarChart scores={a?.scores} size={120}/>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10,color:var(--text)Mute,marginBottom:4,fontFamily:"'Sora', sans-serif"}}>Score Shark Board</div>
                <div style={{fontSize:36,fontWeight:900,fontFamily:"monospace",color:scoreColor(score)}}>{score.toFixed(1)}</div>
                <div style={{fontSize:12,color:scoreColor(score),fontFamily:"'Sora', sans-serif",fontWeight:700}}>{scoreLabel(score)}</div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      num:"04", title:"Modelo de Negocio", color:"#FFB547", accent:"rgba(255,181,71,0.10)",
      content:(
        <div style={{display:"grid",gap:10}}>
          {a?.monetizacion?.map((m,i)=>(
            <div key={i} style={{background:i===0?"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.08))":"var(--surface)",border:`1px solid ${i===0?"rgba(108,92,231,0.3)":var(--border)}`,borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:var(--text),fontFamily:"'Sora', sans-serif"}}>
                  {m.modelo}
                  {i===0&&<span style={{marginLeft:8,fontSize:10,background:"rgba(255,181,71,0.15)",color:"#FFB547",fontWeight:700,borderRadius:99,padding:"2px 8px"}}>★ RECOMENDADO</span>}
                </div>
                <div style={{fontSize:12,color:var(--text)Mute,marginTop:2}}>{m.descripcion}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                <div style={{fontSize:10,color:var(--text)Mute}}>MRR est.</div>
                <div style={{fontWeight:800,color:"#00F5D4",fontFamily:"monospace",fontSize:14}}>{m.mrrEstimado}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      num:"05", title:"Pros & Riesgos", color:"#6C5CE7", accent:"rgba(108,92,231,0.10)",
      content:(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            {title:"✅ A favor",   items:a?.pros,  color:"#00F5D4",bg:"rgba(0,245,212,0.08)",   border:"rgba(0,245,212,0.2)"},
            {title:"⚠️ En contra", items:[...(a?.cons||[]),a?.mayorRiesgo?`☠️ ${a.mayorRiesgo}`:null].filter(Boolean), color:"#FF5F7A",bg:"rgba(255,95,122,0.08)",border:"rgba(255,95,122,0.2)"},
          ].map(({title,items,color,bg,border})=>(
            <div key={title}>
              <div style={{fontWeight:700,fontSize:10,color,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.8px",fontFamily:"'Sora', sans-serif"}}>{title}</div>
              {items?.map((item,i)=>(
                <div key={i} style={{background:bg,border:`1px solid ${border}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:var(--text)Mid,lineHeight:1.4,marginBottom:7}}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      ),
    },
    {
      num:"06", title:"Próximos 90 días", color:"#00F5D4", accent:"rgba(0,245,212,0.08)",
      content:(
        <div style={{display:"grid",gap:12}}>
          <TimelineGTM gtm90dias={a?.gtm90dias}/>
          <div style={{background:"rgba(108,92,231,0.08)",border:"1px solid rgba(108,92,231,0.2)",borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6C5CE7",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.8px",fontFamily:"'Sora', sans-serif"}}>📅 Primeros 30 días</div>
            <p style={{margin:0,fontSize:14,color:var(--text)Mid,lineHeight:1.7}}>{a?.primeros30dias}</p>
          </div>
        </div>
      ),
    },
  ];

  const cur = slides[slide];

  const handleExport = () => {
    const sc = a?.avgScore?.toFixed(1)||"N/A";
    const md = `# Pitch Deck — ${idea.title}\n> Score: ${sc}/10 · ${scoreLabel(parseFloat(sc))}\n\n---\n\n## El Problema\n${idea.description}\n\n¿Pagan hoy? ${a?.pagaHoy}\n\n## La Solución\n${a?.diferencial}\n\nStack: ${a?.stack}\n\n## Mercado\nCliente: ${a?.publicObj}\nBenchmark: ${a?.benchmark}\n\n## Modelo de Negocio\n${(a?.monetizacion||[]).map((m,i)=>`${i+1}. ${m.modelo}: ${m.descripcion} (MRR: ${m.mrrEstimado})`).join("\n")}\n\n## Pros\n${(a?.pros||[]).map(p=>"- "+p).join("\n")}\n\n## Cons\n${(a?.cons||[]).map(c=>"- "+c).join("\n")}\n\n## Plan 90 días\n${a?.gtm90dias}\n`;
    exportMarkdown(`pitch-${idea.title.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}.md`, md);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:400, padding:16, backdropFilter:"blur(6px)" }}>
      <div style={{ background:"var(--bg2)", border:`1px solid ${var(--border)2}`, borderRadius:24, width:"100%", maxWidth:680, maxHeight:"92vh", overflow:"hidden", boxShadow:"0 40px 120px rgba(0,0,0,0.7)", display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,245,212,0.06))", padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${var(--border)}`, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.5),rgba(0,245,212,0.3),transparent)" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <SharkLogo size={30}/>
            <div>
              <div style={{ color:var(--text)Mute, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'Sora', sans-serif" }}>PITCH DECK</div>
              <div style={{ color:var(--text), fontWeight:700, fontSize:15, fontFamily:"'Sora', sans-serif", letterSpacing:"-0.3px" }}>{idea.title}</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ color:var(--text)Mute, fontSize:12, fontFamily:"monospace" }}>{slide+1}/{slides.length}</span>
            <button onClick={onClose} style={{ background:"var(--surface)", border:`1px solid ${var(--border)}`, borderRadius:8, color:var(--text)Mid, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display:"flex", gap:5, padding:"10px 22px 0", justifyContent:"center" }}>
          {slides.map((_,i) => (
            <button key={i} onClick={()=>setSlide(i)}
              style={{ height:3, borderRadius:99, background:i===slide?cur.color:i<slide?"rgba(255,255,255,0.2)":"var(--border)", border:"none", cursor:"pointer", transition:"all 0.2s", padding:0, width:i===slide?28:8 }}/>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          <div style={{ background:cur.accent, border:`1px solid ${cur.color}18`, borderRadius:16, padding:"20px 22px", backdropFilter:"blur(8px)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
              <div style={{ background:cur.color, color:"#fff", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, fontFamily:"'Sora', sans-serif" }}>{cur.num}</div>
              <div style={{ fontWeight:700, fontSize:18, color:var(--text), fontFamily:"'Sora', sans-serif", letterSpacing:"-0.3px" }}>{cur.title}</div>
            </div>
            {cur.content}
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ padding:"12px 22px 18px", display:"flex", gap:8, borderTop:`1px solid ${var(--border)}`, background:"rgba(17,17,24,0.8)", backdropFilter:"blur(12px)" }}>
          <button onClick={()=>setSlide(s=>Math.max(0,s-1))} disabled={slide===0}
            style={{ flex:1, background:"var(--surface)", border:`1px solid ${var(--border)}`, borderRadius:10, padding:"11px", color:slide===0?var(--text)Mute:var(--text), fontWeight:700, fontSize:13, cursor:slide===0?"not-allowed":"pointer", fontFamily:"'Sora', sans-serif" }}>
            ← Anterior
          </button>
          <button onClick={handleExport}
            style={{ background:"rgba(0,245,212,0.1)", border:"1px solid rgba(0,245,212,0.2)", borderRadius:10, padding:"11px 16px", color:"#00F5D4", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Sora', sans-serif" }}>
            ⬇️ .md
          </button>
          <button onClick={()=>setSlide(s=>Math.min(slides.length-1,s+1))} disabled={slide===slides.length-1}
            style={{ flex:1, background:slide===slides.length-1?"var(--surface)":"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:10, padding:"11px", color:slide===slides.length-1?var(--text)Mute:"#fff", fontWeight:700, fontSize:13, cursor:slide===slides.length-1?"not-allowed":"pointer", fontFamily:"'Sora', sans-serif", boxShadow:slide===slides.length-1?"none":"0 0 16px rgba(108,92,231,0.4)" }}>
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
