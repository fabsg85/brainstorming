import { useState, useEffect } from "react";
import { T, SCORE_CRITERIA } from "../constants";
import { avg, scoreColor, scoreLabel } from "../utils";
import { StageBadge, ScoreBar } from "./UI";
import MiniBarChart from "./MiniBarChart";
import RadarChart from "./RadarChart";

export default function Comparador({ ideas }) {
  const analyzed = ideas.filter(i => i.analysis && !i.analysis.error);
  const [selA, setSelA] = useState(null);
  const [selB, setSelB] = useState(null);
  const sorted = [...ideas].sort((a,b)=>(avg(b.analysis?.scores)||0)-(avg(a.analysis?.scores)||0));

  useEffect(()=>{
    if(analyzed.length>=2&&!selA&&!selB){ setSelA(analyzed[0].id); setSelB(analyzed[1].id); }
  },[analyzed.length]);

  const ideaA = ideas.find(i=>i.id===selA);
  const ideaB = ideas.find(i=>i.id===selB);

  const selectStyle = {
    border: `1px solid ${var(--border2)}`, borderRadius:10, padding:"10px 12px",
    fontSize:13, color:"var(--text)",
    background:"var(--surface)",
    cursor:"pointer", fontFamily:"'Sora', sans-serif", fontWeight:600,
    backdropFilter:"blur(8px)",
  };

  return (
    <div style={{ padding:"28px 20px", fontFamily:"'DM Sans', sans-serif" }}>
      {/* Ranking */}
      <div style={{ marginBottom:40 }}>
        <h2 style={{ fontFamily:"'Sora', sans-serif", fontSize:24, fontWeight:700, color:"var(--text)", margin:"0 0 4px", letterSpacing:"-0.5px" }}>📊 Ranking de ideas</h2>
        <div style={{ color:"var(--text)"Mute, fontSize:13, marginBottom:24 }}>{analyzed.length} analizadas · ordenadas por score del Shark</div>

        {ideas.length>1 && (
          <div style={{ background:"var(--surface)", border:`1px solid ${var(--border)}`, borderRadius:18, padding:"22px", marginBottom:28, backdropFilter:"blur(12px)", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"var(--text)"Mute, textTransform:"uppercase", letterSpacing:"1px", marginBottom:18, fontFamily:"'Sora', sans-serif" }}>Comparativa de scores</div>
            <MiniBarChart ideas={ideas}/>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <div style={{ minWidth:560 }}>
            <div style={{ display:"grid", gridTemplateColumns:"28px 1fr 56px 56px 56px 56px 56px 80px", gap:6, padding:"8px 14px", background:"var(--surface)", borderRadius:10, marginBottom:6, fontSize:10, fontWeight:700, color:"var(--text)"Mute, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'Sora', sans-serif", border:`1px solid ${var(--border)}` }}>
              <div>#</div><div>Idea</div>
              {SCORE_CRITERIA.map(c=><div key={c.key} style={{textAlign:"center"}}>{c.icon}</div>)}
              <div style={{textAlign:"center"}}>TOTAL</div>
            </div>
            {sorted.map((idea,idx)=>{
              const sc=idea.analysis?.scores, total=avg(sc);
              return (
                <div key={idea.id} style={{ display:"grid", gridTemplateColumns:"28px 1fr 56px 56px 56px 56px 56px 80px", gap:6, padding:"12px 14px", background:"var(--surface)", border:`1px solid ${var(--border)}`, borderRadius:12, marginBottom:6, alignItems:"center", backdropFilter:"blur(8px)", transition:"border-color 0.2s" }}>
                  <div style={{fontWeight:800,fontSize:14}}>
                    {idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":<span style={{color:"var(--text)"Mute,fontSize:13}}>{idx+1}</span>}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:4,fontFamily:"'Sora', sans-serif"}}>{idea.title}</div>
                    <StageBadge stage={idea.stage}/>
                  </div>
                  {SCORE_CRITERIA.map(c=>(
                    <div key={c.key} style={{textAlign:"center"}}>
                      {sc?.[c.key]
                        ?<span style={{fontSize:12,fontWeight:800,fontFamily:"monospace",color:scoreColor(sc[c.key])}}>{sc[c.key]}</span>
                        :<span style={{color:"var(--border)"}}>—</span>}
                    </div>
                  ))}
                  <div style={{textAlign:"center"}}>
                    {total
                      ?<span style={{background:scoreColor(total)+"15",color:scoreColor(total),border:`1px solid ${scoreColor(total)}25`,borderRadius:8,padding:"3px 10px",fontWeight:900,fontSize:13,fontFamily:"monospace"}}>{total.toFixed(1)}</span>
                      :<span style={{color:"var(--border)"}}>—</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Head to Head */}
      <h2 style={{ fontFamily:"'Sora', sans-serif", fontSize:24, fontWeight:700, color:"var(--text)", margin:"0 0 4px", letterSpacing:"-0.5px" }}>⚖️ Cara a cara</h2>
      <div style={{ color:"var(--text)"Mute, fontSize:13, marginBottom:20 }}>Dos ideas. Una gana.</div>

      {analyzed.length<2 ? (
        <div style={{ textAlign:"center", padding:"44px", background:"var(--surface)", border:`1px solid ${var(--border)}`, borderRadius:16, backdropFilter:"blur(8px)" }}>
          <div style={{fontSize:32,marginBottom:8}}>⚖️</div>
          <div style={{color:"var(--text)"Mid,fontFamily:"'Sora', sans-serif"}}>Necesitás al menos 2 ideas analizadas</div>
        </div>
      ) : (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
            {[
              {val:selA,set:setSelA,label:"Idea A",color:"#6C5CE7"},
              {val:selB,set:setSelB,label:"Idea B",color:"#00F5D4"},
            ].map(({val,set,label,color})=>(
              <select key={label} value={val||""} onChange={e=>set(Number(e.target.value))}
                style={{...selectStyle, border:`1px solid ${color}30`, color:val?"var(--text)":"var(--text)"Mute}}>
                <option value="">— {label} —</option>
                {analyzed.map(i=><option key={i.id} value={i.id}>{i.title}</option>)}
              </select>
            ))}
          </div>

          {ideaA&&ideaB&&ideaA.id!==ideaB.id&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[{idea:ideaA,color:"#6C5CE7"},{idea:ideaB,color:"#00F5D4"}].map(({idea,color},col)=>{
                const ia=idea.analysis, sc=ia?.avgScore;
                return (
                  <div key={idea.id} style={{border:`1px solid ${color}20`,borderRadius:18,overflow:"hidden",boxShadow:`0 0 40px ${color}10`,backdropFilter:"blur(12px)"}}>
                    <div style={{background:`linear-gradient(135deg,${color}18,${color}06)`,padding:"18px 20px",borderBottom:`1px solid ${var(--border)}`,position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${color}60,transparent)`}}/>
                      <div style={{color:"var(--text)"Mute,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:5,fontFamily:"'Sora', sans-serif"}}>Idea {col===0?"A":"B"}</div>
                      <div style={{color:"var(--text)",fontWeight:700,fontSize:16,lineHeight:1.3,marginBottom:12,fontFamily:"'Sora', sans-serif",letterSpacing:"-0.3px"}}>{idea.title}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                        <StageBadge stage={idea.stage}/>
                        {sc&&(
                          <div style={{textAlign:"right"}}>
                            <div style={{color:scoreColor(sc),fontWeight:900,fontSize:28,fontFamily:"monospace",lineHeight:1,textShadow:`0 0 16px ${scoreColor(sc)}50`}}>{sc.toFixed(1)}</div>
                            <div style={{color:"var(--text)"Mute,fontSize:10,marginTop:2,fontFamily:"'Sora', sans-serif"}}>{scoreLabel(sc)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{padding:"18px 20px",background:"var(--surface)",display:"grid",gap:10}}>
                      {ia?.scores&&(
                        <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
                          <RadarChart scores={ia.scores} size={160}/>
                        </div>
                      )}
                      {SCORE_CRITERIA.map(c=>{
                        const val=ia?.scores?.[c.key];
                        if(!val) return null;
                        return <ScoreBar key={c.key} icon={c.icon} label={c.label} value={val}/>;
                      })}
                      {ia?.veredicto&&(
                        <div style={{background:"var(--surface)",borderRadius:10,padding:"12px 14px",border:`1px solid ${var(--border)}`}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--text)"Mute,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.8px",fontFamily:"'Sora', sans-serif"}}>Veredicto</div>
                          <p style={{margin:0,fontSize:13,color:"var(--text)"Mid,lineHeight:1.5,fontStyle:"italic"}}>"{ia.veredicto}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
