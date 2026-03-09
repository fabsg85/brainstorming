import { useState } from "react";

const SAMPLE_IDEAS = [
  {
    id: 1,
    title: "Due Diligence Agent para Inversores",
    summary: "Agente que procesa pitch decks, financials y datos públicos para generar reportes de DD en minutos en lugar de semanas.",
    publicObj: "VCs, ángeles inversores, family offices en LATAM y España",
    diferencial: "Integración con Crunchbase, LinkedIn y registros públicos + LLM especializado en inversión. Produce reporte estructurado listo para comité de inversión.",
    tech: "Claude API + RAG + scraping público + PDF generation",
    pros: ["Mercado con altísimo poder adquisitivo", "Pain real: DD tarda semanas y cuesta $5K–$20K", "Output fácil de cobrar como reporte premium"],
    cons: ["Requiere validación de accuracy (riesgo legal)", "Ciclo de venta largo con institucionales", "Big4 tienen soluciones propias"],
    stage: "idea",
    comments: [],
    scores: {},
    sharkOpinion: null,
  },
  {
    id: 2,
    title: "Copiloto AI para Vendedores B2B",
    summary: "Chrome extension + CRM plugin que analiza llamadas de ventas en tiempo real y sugiere respuestas, objeciones y próximos pasos.",
    publicObj: "Equipos de ventas B2B SaaS, inmobiliarias premium, agencias de alto ticket",
    diferencial: "Contextualiza sugerencias con el CRM del cliente. Aprende del mejor vendedor del equipo y escala ese conocimiento a todos.",
    tech: "Whisper STT + Claude API + HubSpot/Salesforce API + Chrome Extension",
    pros: ["ROI medible en días (más cierres = más $)", "Integración profunda = alto switching cost", "Upsell natural: analytics del equipo"],
    cons: ["Integraciones CRM son complejas", "Privacidad en grabación de llamadas (GDPR)", "Gong y Chorus ya existen"],
    stage: "validando",
    comments: [],
    scores: {},
    sharkOpinion: null,
  },
];

const CRITERIA = [
  { key: "traccion", label: "Tracción potencial", icon: "📈", desc: "¿Hay demanda real y urgente?" },
  { key: "moat", label: "Moat / Ventaja defensible", icon: "🏰", desc: "¿Qué tan difícil es copiarlo?" },
  { key: "monetizacion", label: "Monetización clara", icon: "💰", desc: "¿Es fácil cobrar desde el día 1?" },
  { key: "velocidad", label: "Velocidad de validación", icon: "⚡", desc: "¿En cuánto tiempo se puede testear?" },
  { key: "mercado", label: "Tamaño de mercado", icon: "🌍", desc: "¿Cuán grande es la oportunidad?" },
];

const STAGES = [
  { key: "idea", label: "Idea", emoji: "💡", bg: "#ede9fe", color: "#7c3aed" },
  { key: "validando", label: "Validando", emoji: "🔍", bg: "#fef3c7", color: "#d97706" },
  { key: "construyendo", label: "Construyendo", emoji: "🔨", bg: "#dbeafe", color: "#2563eb" },
  { key: "lanzado", label: "Lanzado", emoji: "🚀", bg: "#d1fae5", color: "#059669" },
];

const BLANK = {
  title: "", summary: "", publicObj: "", diferencial: "",
  tech: "", pros: ["", ""], cons: ["", ""],
  stage: "idea", comments: [], scores: {}, sharkOpinion: null,
};

function avg(scores) {
  const vals = Object.values(scores);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function ScoreChip({ score }) {
  if (score === null) return <span style={{ color: "#9ca3af", fontSize: 13 }}>—</span>;
  const color = score >= 7.5 ? "#059669" : score >= 5.5 ? "#d97706" : "#dc2626";
  return (
    <span style={{
      background: color + "15", color, border: `1.5px solid ${color}40`,
      borderRadius: 8, padding: "2px 10px", fontWeight: 800,
      fontSize: 14, fontFamily: "monospace",
    }}>
      {score.toFixed(1)}
    </span>
  );
}

function StageBadge({ stage }) {
  const s = STAGES.find(x => x.key === stage) || STAGES[0];
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 700,
      borderRadius: 6, padding: "3px 9px",
    }}>
      {s.emoji} {s.label}
    </span>
  );
}

function Slider({ value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <input
        type="range" min={1} max={10} value={value || 1}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: "#6366f1", cursor: "pointer" }}
      />
      <span style={{
        minWidth: 36, textAlign: "center", fontWeight: 800,
        fontFamily: "monospace", fontSize: 16,
        color: !value ? "#9ca3af" : value >= 8 ? "#059669" : value >= 5 ? "#d97706" : "#dc2626",
      }}>
        {value || "—"}
      </span>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 22px" }}>
      <div style={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.7px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [ideas, setIdeas] = useState(SAMPLE_IDEAS);
  const [selectedId, setSelectedId] = useState(1);
  const [tab, setTab] = useState("detail");
  const [modal, setModal] = useState(false);
  const [draft, setDraft] = useState({ ...BLANK });
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [loadingShark, setLoadingShark] = useState(false);

  const sel = ideas.find(i => i.id === selectedId);
  const update = (id, patch) => setIdeas(p => p.map(i => i.id === id ? { ...i, ...patch } : i));

  const addIdea = () => {
    if (!draft.title.trim()) return;
    const id = Date.now();
    setIdeas(p => [...p, { ...draft, id, comments: [], scores: {}, sharkOpinion: null }]);
    setSelectedId(id);
    setDraft({ ...BLANK });
    setModal(false);
    setTab("detail");
  };

  const addComment = () => {
    if (!comment.trim()) return;
    update(selectedId, {
      comments: [...sel.comments, {
        id: Date.now(),
        author: author.trim() || "Anónimo",
        text: comment.trim(),
        time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      }]
    });
    setComment("");
  };

  const getShark = async () => {
    setLoadingShark(true);
    try {
      const prompt = `Eres un shark de negocios tech con expertise en AI y startups. Analiza esta idea y da tu opinión BRUTAL y DIRECTA en español, sin adornos.

IDEA: ${sel.title}
RESUMEN: ${sel.summary}
PÚBLICO: ${sel.publicObj}
DIFERENCIAL: ${sel.diferencial}
PROS: ${sel.pros.filter(Boolean).join(", ")}
CONS: ${sel.cons.filter(Boolean).join(", ")}
TECH: ${sel.tech}

Responde exactamente con este formato (sin markdown ni asteriscos):

VEREDICTO: [INVERTIRÍA / NECESITA PIVOTE / PASS] — [una línea directa y sin filtros]

MOAT REAL: [2-3 oraciones. ¿La ventaja competitiva es real o ilusoria?]

MAYOR RIESGO: [El riesgo número 1 que va a matar este proyecto si no se resuelve]

PRIMEROS 30 DÍAS: [3 acciones concretas para validar antes de construir]

MRR ESTIMADO A 12M: [rango realista si ejecutan bien]`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      update(selectedId, { sharkOpinion: data.content?.[0]?.text || "Error al obtener opinión." });
    } catch {
      update(selectedId, { sharkOpinion: "Error de conexión. Intentá de nuevo." });
    }
    setLoadingShark(false);
  };

  const selScore = sel ? avg(sel.scores) : null;

  const TABS = [
    { key: "detail", label: "📋 Detalle" },
    { key: "score", label: "🎯 Scoring" },
    { key: "shark", label: "🦈 Shark" },
    { key: "comments", label: `💬 Comentarios${sel?.comments.length ? ` (${sel.comments.length})` : ""}` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#111827" }}>

      {/* TOP BAR */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 3px #0000000a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🦈</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.3px" }}>AI Shark Board</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>{ideas.length} ideas · sesión de brainstorming</div>
          </div>
        </div>
        <button onClick={() => { setDraft({ ...BLANK }); setModal(true); }} style={{
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          border: "none", borderRadius: 9, padding: "9px 20px",
          color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
        }}>
          + Nueva Idea
        </button>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 67px)" }}>

        {/* SIDEBAR */}
        <div style={{
          width: 260, flexShrink: 0, background: "#fff",
          borderRight: "1px solid #e5e7eb", overflowY: "auto", padding: 10,
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ padding: "8px 8px 6px", color: "#9ca3af", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>
            Ideas del equipo
          </div>
          {ideas.map(idea => {
            const s = avg(idea.scores);
            const isSelected = idea.id === selectedId;
            const stg = STAGES.find(x => x.key === idea.stage) || STAGES[0];
            return (
              <div key={idea.id} onClick={() => { setSelectedId(idea.id); setTab("detail"); }}
                style={{
                  border: `1.5px solid ${isSelected ? "#6366f1" : "#e5e7eb"}`,
                  borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                  background: isSelected ? "#f5f3ff" : "#fff",
                  transition: "all 0.15s",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{
                    background: stg.bg, color: stg.color,
                    fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 7px",
                  }}>
                    {stg.emoji} {stg.label}
                  </span>
                  <ScoreChip score={s} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: isSelected ? "#6366f1" : "#111827", lineHeight: 1.35, marginBottom: 4 }}>
                  {idea.title || "Sin título"}
                </div>
                <div style={{
                  color: "#6b7280", fontSize: 12, lineHeight: 1.5,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {idea.summary || "Sin descripción"}
                </div>
                {idea.sharkOpinion && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#7c3aed", fontWeight: 600 }}>🦈 Shark opinion lista</div>
                )}
              </div>
            );
          })}
        </div>

        {/* MAIN PANEL */}
        {sel && (
          <div style={{ flex: 1, overflowY: "auto" }}>

            {/* Idea header */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "20px 28px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <StageBadge stage={sel.stage} />
                    <select value={sel.stage} onChange={e => update(selectedId, { stage: e.target.value })}
                      style={{
                        border: "1px solid #e5e7eb", borderRadius: 6, padding: "3px 8px",
                        fontSize: 11, color: "#374151", background: "#f9fafb", cursor: "pointer",
                      }}>
                      {STAGES.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                    </select>
                  </div>
                  <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px", color: "#111827" }}>
                    {sel.title}
                  </h1>
                </div>
                {selScore !== null && (
                  <div style={{ textAlign: "center", marginLeft: 20, padding: "10px 20px", background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2, fontWeight: 600 }}>SCORE EQUIPO</div>
                    <div style={{
                      fontSize: 34, fontWeight: 900, fontFamily: "monospace",
                      color: selScore >= 7.5 ? "#059669" : selScore >= 5.5 ? "#d97706" : "#dc2626",
                    }}>
                      {selScore.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>/ 10</div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div style={{ display: "flex" }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)} style={{
                    border: "none", background: "none",
                    borderBottom: `2.5px solid ${tab === t.key ? "#6366f1" : "transparent"}`,
                    color: tab === t.key ? "#6366f1" : "#6b7280",
                    padding: "10px 18px", cursor: "pointer",
                    fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
                    marginBottom: -1, transition: "all 0.15s",
                  }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div style={{ padding: "24px 28px" }}>

              {/* DETALLE */}
              {tab === "detail" && (
                <div style={{ display: "grid", gap: 16 }}>
                  <Card title="🧠 Resumen ejecutivo">
                    <p style={{ margin: 0, color: "#374151", lineHeight: 1.75, fontSize: 15 }}>{sel.summary || "—"}</p>
                  </Card>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Card title="👥 Público objetivo">
                      <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{sel.publicObj || "—"}</p>
                    </Card>
                    <Card title="⚙️ Stack técnico">
                      <p style={{ margin: 0, color: "#374151", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace", background: "#f3f4f6", borderRadius: 6, padding: "8px 10px" }}>
                        {sel.tech || "—"}
                      </p>
                    </Card>
                  </div>
                  <Card title="✨ Diferencial clave">
                    <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.75 }}>{sel.diferencial || "—"}</p>
                  </Card>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Card title="✅ Pros">
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {sel.pros.filter(Boolean).map((p, i) => (
                          <li key={i} style={{ color: "#059669", fontSize: 14, marginBottom: 7, lineHeight: 1.5 }}>{p}</li>
                        ))}
                      </ul>
                    </Card>
                    <Card title="⚠️ Cons / Riesgos">
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {sel.cons.filter(Boolean).map((c, i) => (
                          <li key={i} style={{ color: "#dc2626", fontSize: 14, marginBottom: 7, lineHeight: 1.5 }}>{c}</li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </div>
              )}

              {/* SCORING */}
              {tab === "score" && (
                <div>
                  <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: 14 }}>
                    Puntuá cada criterio del 1 al 10. El score final es el promedio de los criterios completados.
                  </p>
                  <div style={{ display: "grid", gap: 10 }}>
                    {CRITERIA.map(c => (
                      <div key={c.key} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{c.icon} {c.label}</span>
                          {sel.scores[c.key] && (
                            <span style={{
                              background: "#f3f4f6", borderRadius: 6, padding: "2px 10px",
                              fontWeight: 800, fontFamily: "monospace", fontSize: 13, color: "#374151",
                            }}>
                              {sel.scores[c.key]}/10
                            </span>
                          )}
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 10 }}>{c.desc}</div>
                        <Slider value={sel.scores[c.key]} onChange={val => update(selectedId, { scores: { ...sel.scores, [c.key]: val } })} />
                      </div>
                    ))}
                  </div>
                  {selScore !== null && (
                    <div style={{
                      marginTop: 18, background: "#f5f3ff",
                      border: "1.5px solid #c4b5fd", borderRadius: 14,
                      padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#6366f1" }}>Score final</div>
                        <div style={{ color: "#7c3aed", fontSize: 13, marginTop: 2 }}>
                          {Object.keys(sel.scores).length} de {CRITERIA.length} criterios completados
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{
                          fontSize: 44, fontWeight: 900, fontFamily: "monospace",
                          color: selScore >= 7.5 ? "#059669" : selScore >= 5.5 ? "#d97706" : "#dc2626",
                        }}>
                          {selScore.toFixed(1)}
                        </div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>/ 10</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SHARK */}
              {tab === "shark" && (
                <div>
                  {!sel.sharkOpinion && !loadingShark && (
                    <div style={{
                      textAlign: "center", padding: "56px 20px",
                      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
                    }}>
                      <div style={{ fontSize: 56, marginBottom: 14 }}>🦈</div>
                      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "#111827" }}>¿Querés mi opinión?</div>
                      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 28, maxWidth: 380, margin: "0 auto 28px" }}>
                        Analizamos la idea y damos un veredicto sin filtros: moat real, mayor riesgo, primeros 30 días y MRR estimado.
                      </div>
                      <button onClick={getShark} style={{
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        border: "none", borderRadius: 10, padding: "13px 30px",
                        color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                      }}>
                        🦈 Pedir opinión del Shark
                      </button>
                    </div>
                  )}
                  {loadingShark && (
                    <div style={{
                      textAlign: "center", padding: "56px 20px",
                      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
                    }}>
                      <div style={{ fontSize: 48, marginBottom: 14 }}>🦈</div>
                      <div style={{ color: "#6366f1", fontWeight: 700, fontSize: 16 }}>Analizando sin piedad...</div>
                      <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 6 }}>Esto tarda unos segundos</div>
                    </div>
                  )}
                  {sel.sharkOpinion && !loadingShark && (
                    <div>
                      <div style={{
                        background: "#fff", border: "1px solid #e5e7eb",
                        borderRadius: 16, padding: "28px 30px",
                        borderTop: "4px solid #6366f1",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
                          <span style={{ fontSize: 22 }}>🦈</span>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>Shark Opinion</div>
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>{sel.title}</div>
                          </div>
                        </div>
                        <div style={{ color: "#1f2937", lineHeight: 1.85, fontSize: 14 }}>
                          {sel.sharkOpinion.split("\n").filter(l => l.trim()).map((line, i) => {
                            const colonIdx = line.indexOf(":");
                            const isHeader = colonIdx > 0 && colonIdx < 30 && line === line.toUpperCase().slice(0, colonIdx) + line.slice(colonIdx);
                            if (isHeader) {
                              return (
                                <div key={i} style={{ marginBottom: 14 }}>
                                  <span style={{ fontWeight: 800, color: "#6366f1" }}>{line.slice(0, colonIdx)}:</span>
                                  <span style={{ color: "#1f2937" }}>{line.slice(colonIdx + 1)}</span>
                                </div>
                              );
                            }
                            return <p key={i} style={{ margin: "0 0 10px", color: "#374151" }}>{line}</p>;
                          })}
                        </div>
                      </div>
                      <button onClick={getShark} style={{
                        marginTop: 12, background: "#f9fafb",
                        border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 18px",
                        color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer",
                      }}>
                        🔄 Regenerar opinión
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* COMENTARIOS */}
              {tab === "comments" && (
                <div>
                  <div style={{
                    background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: 12, padding: "16px 18px", marginBottom: 18,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#111827" }}>Agregar comentario</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Tu nombre"
                        style={{
                          border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 13px",
                          fontSize: 13, width: 140, outline: "none", color: "#111827", background: "#fff",
                        }} />
                      <input value={comment} onChange={e => setComment(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addComment()}
                        placeholder="Tu punto de vista, duda o crítica..."
                        style={{
                          border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 13px",
                          fontSize: 13, flex: 1, minWidth: 180, outline: "none", color: "#111827", background: "#fff",
                        }} />
                      <button onClick={addComment} style={{
                        background: "#6366f1", border: "none", borderRadius: 8,
                        padding: "9px 18px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      }}>
                        Enviar
                      </button>
                    </div>
                  </div>
                  {sel.comments.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
                      Nadie comentó aún. ¡Sé el primero!
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {sel.comments.map(c => (
                        <div key={c.id} style={{
                          background: "#fff", border: "1px solid #e5e7eb",
                          borderRadius: 10, padding: "14px 18px",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: "#6366f1" }}>{c.author}</span>
                            <span style={{ fontSize: 11, color: "#9ca3af" }}>{c.time}</span>
                          </div>
                          <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.6 }}>{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL nueva idea */}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, background: "#00000044",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: 20,
        }}>
          <div style={{
            background: "#fff", borderRadius: 18, padding: "30px 34px",
            width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 60px #0003",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>➕ Nueva Idea</h2>
              <button onClick={() => setModal(false)} style={{
                background: "#f3f4f6", border: "none", borderRadius: 8,
                width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#374151",
              }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Título *", key: "title", ph: "ej: Agente AI para due diligence", multi: false },
                { label: "Resumen ejecutivo", key: "summary", ph: "¿Qué hace, para quién y por qué importa?", multi: true },
                { label: "Público objetivo", key: "publicObj", ph: "¿Quién es el cliente y cuánto paga hoy por este problema?", multi: false },
                { label: "Diferencial clave", key: "diferencial", ph: "¿Por qué no se copia fácil? ¿Cuál es el moat?", multi: false },
                { label: "Stack técnico", key: "tech", ph: "ej: Claude API + RAG + Next.js + Supabase", multi: false },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {f.label}
                  </label>
                  {f.multi ? (
                    <textarea rows={3} value={draft[f.key]}
                      onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                      style={{
                        width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
                        padding: "10px 13px", fontSize: 14, resize: "vertical",
                        outline: "none", color: "#111827", boxSizing: "border-box", fontFamily: "inherit",
                      }} />
                  ) : (
                    <input value={draft[f.key]}
                      onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                      style={{
                        width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
                        padding: "10px 13px", fontSize: 14, outline: "none",
                        color: "#111827", boxSizing: "border-box",
                      }} />
                  )}
                </div>
              ))}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { label: "✅ Pros (uno por línea)", key: "pros", color: "#059669" },
                  { label: "⚠️ Cons (uno por línea)", key: "cons", color: "#dc2626" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {f.label}
                    </label>
                    <textarea rows={4} value={draft[f.key].join("\n")}
                      onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value.split("\n") }))}
                      style={{
                        width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
                        padding: "10px 13px", fontSize: 13, resize: "vertical",
                        outline: "none", color: f.color, boxSizing: "border-box", fontFamily: "inherit",
                      }} />
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Stage inicial
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {STAGES.map(s => (
                    <button key={s.key} onClick={() => setDraft(p => ({ ...p, stage: s.key }))} style={{
                      background: draft.stage === s.key ? s.bg : "#f9fafb",
                      color: draft.stage === s.key ? s.color : "#6b7280",
                      border: `1.5px solid ${draft.stage === s.key ? s.color + "60" : "#e5e7eb"}`,
                      borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={addIdea} disabled={!draft.title.trim()} style={{
                background: draft.title.trim() ? "linear-gradient(135deg, #6366f1, #a855f7)" : "#f3f4f6",
                border: "none", borderRadius: 10, padding: "13px",
                color: draft.title.trim() ? "#fff" : "#9ca3af",
                fontWeight: 800, fontSize: 14, cursor: draft.title.trim() ? "pointer" : "not-allowed",
                marginTop: 4,
              }}>
                Agregar al board →
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }`}</style>
    </div>
  );
}
