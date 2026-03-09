import { useState } from "react";

const SAMPLE_IDEAS = [
  {
    id: 1,
    title: "Due Diligence Agent para Inversores",
    description: "Agente que procesa pitch decks, financials y datos públicos para generar reportes de DD en minutos en lugar de semanas.",
    stage: "idea",
    comments: [],
    analysis: null,
    analyzing: false,
  },
  {
    id: 2,
    title: "Copiloto AI para Vendedores B2B",
    description: "Chrome extension que analiza llamadas de ventas en tiempo real y sugiere respuestas, objeciones y próximos pasos basándose en el historial del CRM.",
    stage: "validando",
    comments: [],
    analysis: null,
    analyzing: false,
  },
];

const STAGES = [
  { key: "idea", label: "Idea", emoji: "💡", bg: "#ede9fe", color: "#7c3aed" },
  { key: "validando", label: "Validando", emoji: "🔍", bg: "#fef3c7", color: "#d97706" },
  { key: "construyendo", label: "Construyendo", emoji: "🔨", bg: "#dbeafe", color: "#2563eb" },
  { key: "lanzado", label: "Lanzado", emoji: "🚀", bg: "#d1fae5", color: "#059669" },
];

const BLANK = { title: "", description: "", stage: "idea", comments: [], analysis: null };

function ScoreBar({ label, value }) {
  if (!value) return null;
  const color = value >= 8 ? "#059669" : value >= 6 ? "#d97706" : "#dc2626";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color }}>{value}/10</span>
      </div>
      <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99 }}>
        <div style={{ height: 6, background: color, borderRadius: 99, width: `${value * 10}%`, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function StageBadge({ stage }) {
  const s = STAGES.find(x => x.key === stage) || STAGES[0];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 9px" }}>
      {s.emoji} {s.label}
    </span>
  );
}

function Card({ title, children, accent }) {
  return (
    <div style={{
      background: "#fff", border: `1px solid ${accent ? accent + "40" : "#e5e7eb"}`,
      borderRadius: 12, padding: "18px 22px",
      borderLeft: accent ? `4px solid ${accent}` : undefined,
    }}>
      <div style={{ fontWeight: 700, fontSize: 11, color: "#9ca3af", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.7px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function OverallScore({ score }) {
  if (!score) return null;
  const color = score >= 7.5 ? "#059669" : score >= 5.5 ? "#d97706" : "#dc2626";
  const label = score >= 7.5 ? "INVERTIRÍA" : score >= 5.5 ? "NECESITA PIVOTE" : "PASS";
  return (
    <div style={{
      background: color + "10", border: `2px solid ${color}30`,
      borderRadius: 14, padding: "16px 22px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div>
        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Veredicto del Shark</div>
        <div style={{ fontWeight: 900, fontSize: 18, color }}>{label}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 42, fontWeight: 900, fontFamily: "monospace", color, lineHeight: 1 }}>{score.toFixed(1)}</div>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>/ 10</div>
      </div>
    </div>
  );
}

export default function App() {
  const [ideas, setIdeas] = useState(SAMPLE_IDEAS);
  const [selectedId, setSelectedId] = useState(1);
  const [tab, setTab] = useState("analysis");
  const [modal, setModal] = useState(false);
  const [draft, setDraft] = useState({ ...BLANK });
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");

  const sel = ideas.find(i => i.id === selectedId);
  const update = (id, patch) => setIdeas(p => p.map(i => i.id === id ? { ...i, ...patch } : i));

  const addIdea = () => {
    if (!draft.title.trim()) return;
    const id = Date.now();
    setIdeas(p => [...p, { ...draft, id, comments: [], analysis: null }]);
    setSelectedId(id);
    setDraft({ ...BLANK });
    setModal(false);
    setTab("analysis");
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

  const analyze = async (idea) => {
    update(idea.id, { analyzing: true });

    const prompt = `Sos un shark de negocios tech con expertise en AI y startups. Analizá esta idea de negocio y respondé ÚNICAMENTE con un JSON válido, sin texto extra, sin markdown, sin backticks.

IDEA: ${idea.title}
DESCRIPCIÓN: ${idea.description}

El JSON debe tener exactamente esta estructura:
{
  "publicObj": "string - quién es el cliente y cuánto paga hoy por este problema",
  "diferencial": "string - ventaja competitiva real, por qué no se copia fácil",
  "benchmark": "string - competidores o alternativas existentes y cómo se compara esta idea",
  "stack": "string - stack técnico recomendado concreto (APIs, modelos, infra)",
  "pros": ["string", "string", "string"],
  "cons": ["string", "string", "string"],
  "veredicto": "string - una línea brutal y directa",
  "mayorRiesgo": "string - el riesgo número 1 que puede matar este proyecto",
  "primeros30dias": "string - 3 acciones concretas para validar antes de construir",
  "mrrEstimado": "string - rango realista a 12 meses si ejecutan bien",
  "scores": {
    "traccion": número del 1 al 10,
    "moat": número del 1 al 10,
    "monetizacion": número del 1 al 10,
    "velocidad": número del 1 al 10,
    "mercado": número del 1 al 10
  }
}`;

    try {
      const res = await fetch("/api/shark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const avgScore = Object.values(parsed.scores).reduce((a, b) => a + b, 0) / Object.values(parsed.scores).length;
      update(idea.id, { analysis: { ...parsed, avgScore }, analyzing: false });
    } catch {
      update(idea.id, { analysis: { error: true }, analyzing: false });
    }
  };

  const a = sel?.analysis;
  const TABS = [
    { key: "analysis", label: "🦈 Análisis" },
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
            const isSelected = idea.id === selectedId;
            const stg = STAGES.find(x => x.key === idea.stage) || STAGES[0];
            const score = idea.analysis?.avgScore;
            const scoreColor = score >= 7.5 ? "#059669" : score >= 5.5 ? "#d97706" : "#dc2626";
            return (
              <div key={idea.id} onClick={() => { setSelectedId(idea.id); setTab("analysis"); }}
                style={{
                  border: `1.5px solid ${isSelected ? "#6366f1" : "#e5e7eb"}`,
                  borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                  background: isSelected ? "#f5f3ff" : "#fff", transition: "all 0.15s",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ background: stg.bg, color: stg.color, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 7px" }}>
                    {stg.emoji} {stg.label}
                  </span>
                  {score ? (
                    <span style={{ background: scoreColor + "15", color: scoreColor, border: `1.5px solid ${scoreColor}40`, borderRadius: 6, padding: "1px 8px", fontWeight: 800, fontSize: 13, fontFamily: "monospace" }}>
                      {score.toFixed(1)}
                    </span>
                  ) : idea.analyzing ? (
                    <span style={{ fontSize: 11, color: "#6366f1" }}>analizando...</span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>sin análisis</span>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: isSelected ? "#6366f1" : "#111827", lineHeight: 1.35, marginBottom: 4 }}>
                  {idea.title || "Sin título"}
                </div>
                <div style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {idea.description || "Sin descripción"}
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN */}
        {sel && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "20px 28px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <StageBadge stage={sel.stage} />
                    <select value={sel.stage} onChange={e => update(selectedId, { stage: e.target.value })}
                      style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#374151", background: "#f9fafb", cursor: "pointer" }}>
                      {STAGES.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                    </select>
                  </div>
                  <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px", color: "#111827" }}>
                    {sel.title}
                  </h1>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: 14, lineHeight: 1.65 }}>{sel.description}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
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

            <div style={{ padding: "24px 28px" }}>

              {/* ANÁLISIS */}
              {tab === "analysis" && (
                <div>
                  {!a && !sel.analyzing && (
                    <div style={{
                      textAlign: "center", padding: "60px 20px",
                      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
                    }}>
                      <div style={{ fontSize: 56, marginBottom: 14 }}>🦈</div>
                      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "#111827" }}>Análisis del Shark</div>
                      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
                        El shark va a generar automáticamente: público objetivo, diferencial, benchmark, stack técnico, pros/cons, scoring y veredicto.
                      </div>
                      <button onClick={() => analyze(sel)} style={{
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        border: "none", borderRadius: 10, padding: "13px 30px",
                        color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                      }}>
                        🦈 Analizar esta idea
                      </button>
                    </div>
                  )}

                  {sel.analyzing && (
                    <div style={{
                      textAlign: "center", padding: "60px 20px",
                      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
                    }}>
                      <div style={{ fontSize: 48, marginBottom: 14 }}>🦈</div>
                      <div style={{ color: "#6366f1", fontWeight: 700, fontSize: 16 }}>Analizando sin piedad...</div>
                      <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 6 }}>Generando análisis completo, esto tarda unos segundos</div>
                    </div>
                  )}

                  {a && !sel.analyzing && (
                    a.error ? (
                      <div style={{ textAlign: "center", padding: "40px", background: "#fff", border: "1px solid #fecaca", borderRadius: 16 }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
                        <div style={{ color: "#dc2626", fontWeight: 700 }}>Error al analizar. Verificá la API key en Vercel.</div>
                        <button onClick={() => { update(selectedId, { analysis: null }); analyze(sel); }} style={{
                          marginTop: 16, background: "#f3f4f6", border: "1px solid #e5e7eb",
                          borderRadius: 8, padding: "9px 18px", color: "#374151",
                          fontWeight: 600, fontSize: 13, cursor: "pointer",
                        }}>
                          🔄 Reintentar
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: 16 }}>
                        <OverallScore score={a.avgScore} />

                        {/* Scores */}
                        <Card title="🎯 Scoring por criterio">
                          <ScoreBar label="📈 Tracción potencial" value={a.scores?.traccion} />
                          <ScoreBar label="🏰 Moat / Ventaja defensible" value={a.scores?.moat} />
                          <ScoreBar label="💰 Monetización clara" value={a.scores?.monetizacion} />
                          <ScoreBar label="⚡ Velocidad de validación" value={a.scores?.velocidad} />
                          <ScoreBar label="🌍 Tamaño de mercado" value={a.scores?.mercado} />
                        </Card>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <Card title="👥 Público objetivo">
                            <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.publicObj}</p>
                          </Card>
                          <Card title="🔍 Benchmark / Competencia">
                            <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.benchmark}</p>
                          </Card>
                        </div>

                        <Card title="✨ Diferencial clave">
                          <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{a.diferencial}</p>
                        </Card>

                        <Card title="⚙️ Stack técnico recomendado">
                          <p style={{ margin: 0, color: "#374151", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace", background: "#f3f4f6", borderRadius: 6, padding: "10px 12px" }}>
                            {a.stack}
                          </p>
                        </Card>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <Card title="✅ Pros" accent="#059669">
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                              {a.pros?.map((p, i) => (
                                <li key={i} style={{ color: "#059669", fontSize: 14, marginBottom: 7, lineHeight: 1.5 }}>{p}</li>
                              ))}
                            </ul>
                          </Card>
                          <Card title="⚠️ Cons / Riesgos" accent="#dc2626">
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                              {a.cons?.map((c, i) => (
                                <li key={i} style={{ color: "#dc2626", fontSize: 14, marginBottom: 7, lineHeight: 1.5 }}>{c}</li>
                              ))}
                            </ul>
                          </Card>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                          <Card title="☠️ Mayor riesgo" accent="#f59e0b">
                            <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.mayorRiesgo}</p>
                          </Card>
                          <Card title="📅 Primeros 30 días">
                            <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.65 }}>{a.primeros30dias}</p>
                          </Card>
                          <Card title="💵 MRR estimado a 12m" accent="#059669">
                            <p style={{ margin: 0, color: "#059669", fontSize: 15, fontWeight: 800, lineHeight: 1.65 }}>{a.mrrEstimado}</p>
                          </Card>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button onClick={() => { update(selectedId, { analysis: null }); analyze(sel); }} style={{
                            background: "#f9fafb", border: "1px solid #e5e7eb",
                            borderRadius: 8, padding: "9px 18px",
                            color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer",
                          }}>
                            🔄 Re-analizar
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* COMENTARIOS */}
              {tab === "comments" && (
                <div>
                  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", marginBottom: 18 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#111827" }}>Agregar comentario</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Tu nombre"
                        style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 13px", fontSize: 13, width: 140, outline: "none", color: "#111827", background: "#fff" }} />
                      <input value={comment} onChange={e => setComment(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addComment()}
                        placeholder="Tu punto de vista, duda o crítica..."
                        style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 13px", fontSize: 13, flex: 1, minWidth: 180, outline: "none", color: "#111827", background: "#fff" }} />
                      <button onClick={addComment} style={{
                        background: "#6366f1", border: "none", borderRadius: 8,
                        padding: "9px 18px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      }}>Enviar</button>
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
                        <div key={c.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 18px" }}>
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
            width: "100%", maxWidth: 520,
            boxShadow: "0 20px 60px #0003",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>💡 Nueva Idea</h2>
              <button onClick={() => setModal(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#374151" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Título de la idea *
                </label>
                <input value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
                  placeholder="ej: Agente AI para due diligence de startups"
                  style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "11px 13px", fontSize: 14, outline: "none", color: "#111827", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Descripción
                </label>
                <textarea value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))}
                  placeholder="Explicá brevemente qué hace y para quién. El Shark va a generar todo lo demás."
                  rows={4}
                  style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "11px 13px", fontSize: 14, resize: "vertical", outline: "none", color: "#111827", boxSizing: "border-box", fontFamily: "inherit" }} />
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

              <div style={{ background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#7c3aed" }}>
                🦈 El Shark va a generar automáticamente: público objetivo, diferencial, benchmark, stack técnico, pros/cons, scoring y veredicto.
              </div>

              <button onClick={addIdea} disabled={!draft.title.trim()} style={{
                background: draft.title.trim() ? "linear-gradient(135deg, #6366f1, #a855f7)" : "#f3f4f6",
                border: "none", borderRadius: 10, padding: "13px",
                color: draft.title.trim() ? "#fff" : "#9ca3af",
                fontWeight: 800, fontSize: 14, cursor: draft.title.trim() ? "pointer" : "not-allowed",
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
