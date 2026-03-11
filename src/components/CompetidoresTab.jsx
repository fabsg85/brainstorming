import { useState } from "react";
import { T } from "../constants";

export default function CompetidoresTab({ a, idea, onGoAnalysis, onRefreshCompetitors }) {
  const [loading, setLoading] = useState(false);

  const competitors = a?.competidores || [];
  const hasData = competitors.length > 0;

  const handleSearch = async () => {
    setLoading(true);
    await onRefreshCompetitors();
    setLoading(false);
  };

  if (!a && !loading) return (
    <div style={{ textAlign:"center", padding:"64px 20px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:20, backdropFilter:"blur(12px)" }}>
      <div style={{ fontSize:44, marginBottom:16 }}>🔍</div>
      <div style={{ fontWeight:700, fontSize:18, color:"var(--text)", marginBottom:8, fontFamily:"'Sora', sans-serif" }}>Sin análisis base</div>
      <div style={{ color:"var(--textMute)", fontSize:14, marginBottom:28 }}>Primero generá el análisis del Shark</div>
      <button onClick={onGoAnalysis} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:10, padding:"11px 24px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Sora', sans-serif" }}>🦈 Analizar</button>
    </div>
  );

  return (
    <div style={{ display:"grid", gap:14 }}>
      {/* Header + refresh */}
      <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,245,212,0.06))", border:"1px solid rgba(108,92,231,0.25)", borderRadius:16, padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.5),rgba(0,245,212,0.3),transparent)" }}/>
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:"var(--textMute)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:5, fontFamily:"'Sora', sans-serif" }}>Análisis de Competencia Real</div>
          <div style={{ fontWeight:700, fontSize:16, color:"var(--text)", fontFamily:"'Sora', sans-serif", letterSpacing:"-0.3px" }}>🔍 Búsqueda con web search</div>
          <div style={{ fontSize:12, color:"var(--textMute)", marginTop:3 }}>Competidores reales encontrados en internet, no alucinados</div>
        </div>
        <button onClick={handleSearch} disabled={loading}
          style={{ background: loading ? "var(--surface)" : "linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:10, padding:"11px 20px", color: loading ? "var(--textMute)" : "#fff", fontWeight:700, fontSize:13, cursor: loading ? "not-allowed" : "pointer", fontFamily:"'Sora', sans-serif", flexShrink:0, boxShadow: loading ? "none" : "0 0 16px rgba(108,92,231,0.4)", transition:"all 0.2s", minWidth:120 }}>
          {loading ? "🔍 Buscando..." : hasData ? "🔄 Actualizar" : "🔍 Buscar"}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"52px 20px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, backdropFilter:"blur(12px)" }}>
          <div style={{ fontSize:36, marginBottom:16, animation:"pulse 1.4s ease-in-out infinite" }}>🔍</div>
          <div style={{ fontWeight:700, color:"var(--text)", fontSize:16, marginBottom:6, fontFamily:"'Sora', sans-serif" }}>Buscando en internet...</div>
          <div style={{ color:"var(--textMute)", fontSize:13 }}>Esto puede tardar 15-30 segundos. No es alucinación — es búsqueda real.</div>
        </div>
      )}

      {!loading && !hasData && (
        <div style={{ textAlign:"center", padding:"52px 20px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, backdropFilter:"blur(12px)" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
          <div style={{ fontWeight:600, color:"var(--textMid)", fontSize:15, marginBottom:6, fontFamily:"'Sora', sans-serif" }}>Hacé click en "Buscar"</div>
          <div style={{ color:"var(--textMute)", fontSize:13 }}>El Shark va a buscar competidores reales en internet para esta idea</div>
        </div>
      )}

      {!loading && hasData && (
        <>
          {/* Competitive map summary */}
          {a.mapaCompetitivo && (
            <div style={{ background:"rgba(255,181,71,0.08)", border:"1px solid rgba(255,181,71,0.2)", borderRadius:14, padding:"16px 20px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#FFB547", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6, fontFamily:"'Sora', sans-serif" }}>🗺️ Mapa competitivo</div>
              <p style={{ margin:0, fontSize:14, color:"var(--textMid)", lineHeight:1.65 }}>{a.mapaCompetitivo}</p>
            </div>
          )}

          {/* Competitor cards */}
          <div style={{ display:"grid", gap:12 }}>
            {competitors.map((comp, i) => {
              const threatColors = {
                alta:  { color:"#FF5F7A", bg:"rgba(255,95,122,0.1)",  border:"rgba(255,95,122,0.25)" },
                media: { color:"#FFB547", bg:"rgba(255,181,71,0.1)",  border:"rgba(255,181,71,0.25)" },
                baja:  { color:"#00F5D4", bg:"rgba(0,245,212,0.08)",  border:"rgba(0,245,212,0.2)"  },
              };
              const tc = threatColors[comp.amenaza?.toLowerCase()] || threatColors.media;

              return (
                <div key={i} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden", backdropFilter:"blur(12px)" }}>
                  <div style={{ padding:"14px 20px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"var(--surface)" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <div style={{ fontWeight:700, fontSize:15, color:"var(--text)", fontFamily:"'Sora', sans-serif" }}>{comp.nombre}</div>
                        {comp.url && (
                          <a href={comp.url} target="_blank" rel="noreferrer"
                            style={{ fontSize:10, color:"#6C5CE7", fontWeight:600, textDecoration:"none", background:"rgba(108,92,231,0.1)", borderRadius:99, padding:"2px 8px", border:"1px solid rgba(108,92,231,0.2)", fontFamily:"'Sora', sans-serif" }}>
                            ↗ Ver
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize:12, color:"var(--textMute)" }}>{comp.modelo} · {comp.mercado}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                      <span style={{ background:tc.bg, color:tc.color, border:`1px solid ${tc.border}`, borderRadius:99, padding:"2px 10px", fontSize:10, fontWeight:700, fontFamily:"'Sora', sans-serif" }}>
                        ⚡ Amenaza {comp.amenaza}
                      </span>
                      {comp.funding && (
                        <span style={{ fontSize:11, color:"var(--textMute)", fontFamily:"monospace" }}>💰 {comp.funding}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ padding:"14px 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {[
                      { label:"💪 Fortaleza", value:comp.fortaleza,   color:"#00F5D4", bg:"rgba(0,245,212,0.06)",  border:"rgba(0,245,212,0.15)" },
                      { label:"😤 Debilidad", value:comp.debilidad,   color:"#FF5F7A", bg:"rgba(255,95,122,0.06)", border:"rgba(255,95,122,0.15)" },
                      { label:"💳 Precio",    value:comp.precio,      color:"#FFB547", bg:"rgba(255,181,71,0.06)", border:"rgba(255,181,71,0.15)" },
                      { label:"🎯 Diferencial nuestro", value:comp.nuestroDiferencial, color:"#6C5CE7", bg:"rgba(108,92,231,0.08)", border:"rgba(108,92,231,0.2)" },
                    ].filter(f => f.value).map(({ label, value, color, bg, border }) => (
                      <div key={label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"10px 12px" }}>
                        <div style={{ fontSize:10, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:4, fontFamily:"'Sora', sans-serif" }}>{label}</div>
                        <div style={{ fontSize:12, color:"var(--textMid)", lineHeight:1.5 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Our gap */}
          {a.brechaCompetitiva && (
            <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,245,212,0.06))", border:"1px solid rgba(108,92,231,0.25)", borderRadius:14, padding:"18px 22px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.5),transparent)" }}/>
              <div style={{ fontSize:10, fontWeight:700, color:"#6C5CE7", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6, fontFamily:"'Sora', sans-serif" }}>🦈 Brecha a explotar</div>
              <p style={{ margin:0, fontSize:14, color:"var(--textMid)", lineHeight:1.65, fontWeight:500 }}>{a.brechaCompetitiva}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
