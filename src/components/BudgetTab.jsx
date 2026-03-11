import { useState } from "react";
import { T, BUDGET_CATEGORIES } from "../constants";

const PHASE_OPTIONS = ["MVP", "Pre-lanzamiento", "Mes 1", "Mes 2-3", "Recurrente"];

function fmt(n) {
  return n ? `$${Number(n).toLocaleString("en-US")}` : "$0";
}

export default function BudgetTab({ ideaId, budget, onSave }) {
  const items    = budget?.items    || [];
  const notes    = budget?.notes    || "";
  const currency = budget?.currency || "USD";

  const [editNotes, setEditNotes] = useState(notes);
  const [showForm,  setShowForm]  = useState(false);
  const [editIdx,   setEditIdx]   = useState(null);
  const [form, setForm] = useState({ category:"infra", description:"", amount:"", phase:"MVP", recurring:false });

  const total     = items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const byPhase   = PHASE_OPTIONS.map(ph => ({
    phase: ph,
    items: items.filter(i => i.phase === ph),
    total: items.filter(i => i.phase === ph).reduce((s, i) => s + (Number(i.amount) || 0), 0),
  })).filter(g => g.items.length > 0);
  const byCategory = BUDGET_CATEGORIES.map(cat => ({
    ...cat,
    total: items.filter(i => i.category === cat.key).reduce((s, i) => s + (Number(i.amount) || 0), 0),
  })).filter(c => c.total > 0);

  const saveItems = (newItems) => onSave(ideaId, { ...budget, items: newItems, notes: editNotes, currency });

  const openAdd = () => {
    setForm({ category:"infra", description:"", amount:"", phase:"MVP", recurring:false });
    setEditIdx(null);
    setShowForm(true);
  };

  const openEdit = (idx) => {
    setForm({ ...items[idx] });
    setEditIdx(idx);
    setShowForm(true);
  };

  const submitForm = () => {
    if (!form.description.trim() || !form.amount) return;
    const item = { ...form, amount: parseFloat(form.amount) || 0, id: editIdx !== null ? items[editIdx].id : Date.now() };
    const newItems = editIdx !== null
      ? items.map((it, i) => i === editIdx ? item : it)
      : [...items, item];
    saveItems(newItems);
    setShowForm(false);
  };

  const removeItem = (idx) => {
    saveItems(items.filter((_, i) => i !== idx));
  };

  const cat = (key) => BUDGET_CATEGORIES.find(c => c.key === key) || BUDGET_CATEGORIES[6];

  const inputStyle = {
    border: `1px solid var(--surface2)`,
    borderRadius: 8, padding: "9px 12px",
    fontSize: 13, outline: "none",
    color: "var(--text)", background: "var(--surface)",
    fontFamily: "'DM Sans', sans-serif", width: "100%", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>

      {/* ── SUMMARY CARDS ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {/* Total */}
        <div style={{ background: "linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.08))", border: "1px solid rgba(108,92,231,0.3)", borderRadius: 14, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(108,92,231,0.6),rgba(0,245,212,0.3),transparent)" }}/>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--textMute)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, fontFamily: "'Sora', sans-serif" }}>Total MVP</div>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: "#00F5D4", lineHeight: 1 }}>{fmt(total)}</div>
          <div style={{ fontSize: 11, color: "var(--textMute)", marginTop: 4 }}>{items.length} ítems · {currency}</div>
        </div>
        {/* One-time */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--textMute)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, fontFamily: "'Sora', sans-serif" }}>One-time</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace", color: "#FFB547", lineHeight: 1 }}>
            {fmt(items.filter(i => !i.recurring).reduce((s,i)=>s+Number(i.amount||0),0))}
          </div>
          <div style={{ fontSize: 11, color: "var(--textMute)", marginTop: 4 }}>gastos únicos</div>
        </div>
        {/* Recurring */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--textMute)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, fontFamily: "'Sora', sans-serif" }}>Recurrente/mes</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace", color: "#FF5F7A", lineHeight: 1 }}>
            {fmt(items.filter(i => i.recurring).reduce((s,i)=>s+Number(i.amount||0),0))}
          </div>
          <div style={{ fontSize: 11, color: "var(--textMute)", marginTop: 4 }}>costo mensual</div>
        </div>
      </div>

      {/* ── BY CATEGORY BAR CHART ─────────────────────────────── */}
      {byCategory.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--surface2)", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--textMute)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14, fontFamily: "'Sora', sans-serif" }}>Por categoría</div>
          {byCategory.map(c => (
            <div key={c.key} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "var(--textMid)", fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>{c.emoji} {c.label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", color: "#00F5D4" }}>{fmt(c.total)}</span>
              </div>
              <div style={{ height: 4, background: "var(--surface)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${total > 0 ? (c.total / total) * 100 : 0}%`, background: "linear-gradient(90deg,#6C5CE780,#00F5D4)", borderRadius: 99, transition: "width 0.7s cubic-bezier(.4,0,.2,1)" }}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ITEMS TABLE ───────────────────────────────────────── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--surface2)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--surface)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--textMute)", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Sora', sans-serif" }}>
            Ítems · {items.length}
          </div>
          <button onClick={openAdd} style={{ background: "linear-gradient(135deg,#6C5CE7,#00F5D4)", border: "none", borderRadius: 8, padding: "7px 14px", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'Sora', sans-serif", boxShadow: "0 0 12px rgba(108,92,231,0.4)" }}>
            + Agregar
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "44px 20px" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>💸</div>
            <div style={{ color: "var(--textMute)", fontSize: 14, fontFamily: "'Sora', sans-serif", fontWeight: 600, marginBottom: 4 }}>Sin ítems todavía</div>
            <div style={{ color: "var(--textMute)", fontSize: 12 }}>Agregá dominio, hosting, APIs, publicidad, freelancers...</div>
          </div>
        ) : (
          <div>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 90px 100px 70px 32px", gap: 8, padding: "8px 18px", background: "var(--surface)", fontSize: 10, fontWeight: 700, color: "var(--textMute)", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Sora', sans-serif" }}>
              <div/>
              <div>Descripción</div>
              <div>Fase</div>
              <div style={{ textAlign: "right" }}>Monto</div>
              <div style={{ textAlign: "center" }}>Tipo</div>
              <div/>
            </div>

            {items.map((item, idx) => {
              const c = cat(item.category);
              return (
                <div key={item.id || idx}
                  style={{ display: "grid", gridTemplateColumns: "28px 1fr 90px 100px 70px 32px", gap: 8, padding: "10px 18px", borderTop: "1px solid var(--surface)", alignItems: "center", cursor: "pointer", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 16 }}>{c.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Sora', sans-serif" }}>{item.description}</div>
                    <div style={{ fontSize: 11, color: "var(--textMute)", marginTop: 1 }}>{c.label}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--textMute)", background: "var(--surface)", borderRadius: 99, padding: "2px 8px", fontFamily: "'Sora', sans-serif" }}>
                      {item.phase || "MVP"}
                    </span>
                  </div>
                  <div style={{ textAlign: "right", fontWeight: 800, fontFamily: "monospace", fontSize: 13, color: item.recurring ? "#FF5F7A" : "#00F5D4" }}>
                    {fmt(item.amount)}{item.recurring ? "/mes" : ""}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: item.recurring ? "#FF5F7A" : "#FFB547", background: item.recurring ? "rgba(255,95,122,0.1)" : "rgba(255,181,71,0.1)", borderRadius: 99, padding: "2px 8px", fontFamily: "'Sora', sans-serif", border: `1px solid ${item.recurring ? "rgba(255,95,122,0.2)" : "rgba(255,181,71,0.2)"}` }}>
                      {item.recurring ? "🔄 Recur." : "1️⃣ Único"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => openEdit(idx)} style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: 6, color: "#6C5CE7", width: 26, height: 26, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✏️</button>
                    <button onClick={() => removeItem(idx)} style={{ background: "rgba(255,95,122,0.08)", border: "1px solid rgba(255,95,122,0.15)", borderRadius: 6, color: "#FF5F7A", width: 26, height: 26, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>🗑</button>
                  </div>
                </div>
              );
            })}

            {/* Total footer */}
            <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 90px 100px 70px 32px", gap: 8, padding: "12px 18px", borderTop: "1px solid rgba(108,92,231,0.2)", background: "rgba(108,92,231,0.06)", alignItems: "center" }}>
              <div/>
              <div style={{ fontWeight: 700, fontSize: 12, color: "var(--textMid)", fontFamily: "'Sora', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>TOTAL</div>
              <div/>
              <div style={{ textAlign: "right", fontWeight: 900, fontFamily: "monospace", fontSize: 15, color: "#00F5D4" }}>{fmt(total)}</div>
              <div/>
              <div/>
            </div>
          </div>
        )}
      </div>

      {/* ── NOTES ─────────────────────────────────────────────── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--surface2)", borderRadius: 14, padding: "16px 18px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--textMute)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, fontFamily: "'Sora', sans-serif" }}>📝 Notas de presupuesto</div>
        <textarea
          value={editNotes}
          onChange={e => setEditNotes(e.target.value)}
          onBlur={() => onSave(ideaId, { ...budget, items, notes: editNotes, currency })}
          placeholder="Supuestos, fuentes, decisiones pendientes..."
          rows={3}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          onFocus={e => (e.target.style.borderColor = "rgba(108,92,231,0.5)")}
          onBlur2={e => (e.target.style.borderColor = "var(--surface2)")}
        />
      </div>

      {/* ── ADD / EDIT MODAL ──────────────────────────────────── */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 16, backdropFilter: "blur(6px)" }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--surface2)", borderRadius: 20, width: "100%", maxWidth: 460, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>
            {/* Modal header */}
            <div style={{ background: "linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.06))", padding: "18px 22px", borderBottom: "1px solid var(--surface2)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(108,92,231,0.6),rgba(0,245,212,0.3),transparent)" }}/>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#FFFFFF", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.3px" }}>
                  {editIdx !== null ? "✏️ Editar ítem" : "💸 Nuevo ítem"}
                </div>
                <button onClick={() => setShowForm(false)} style={{ background: "var(--surface)", border: "none", borderRadius: 7, color: "var(--textMid)", width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding: "20px 22px", display: "grid", gap: 14 }}>
              {/* Category */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--textMute)", marginBottom: 8, fontFamily: "'Sora', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>Categoría</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {BUDGET_CATEGORIES.map(c => (
                    <button key={c.key} onClick={() => setForm(f => ({ ...f, category: c.key }))}
                      style={{ background: form.category === c.key ? "rgba(108,92,231,0.2)" : "var(--surface)", border: `1px solid ${form.category === c.key ? "rgba(108,92,231,0.5)" : "var(--surface2)"}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer", textAlign: "left", transition: "all 0.12s" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: form.category === c.key ? "#FFFFFF" : "var(--textMid)", fontFamily: "'Sora', sans-serif" }}>{c.emoji} {c.label}</div>
                      <div style={{ fontSize: 10, color: "var(--textMute)", marginTop: 2 }}>{c.examples}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--textMute)", marginBottom: 6, fontFamily: "'Sora', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>Descripción</div>
                <input autoFocus value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder={`ej: ${cat(form.category).examples.split(",")[0].trim()}`}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(108,92,231,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "var(--surface2)")}/>
              </div>

              {/* Amount + Phase row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--textMute)", marginBottom: 6, fontFamily: "'Sora', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>Monto (USD)</div>
                  <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="0"
                    style={{ ...inputStyle, fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}
                    onFocus={e => (e.target.style.borderColor = "rgba(108,92,231,0.5)")}
                    onBlur={e => (e.target.style.borderColor = "var(--surface2)")}/>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--textMute)", marginBottom: 6, fontFamily: "'Sora', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>Fase</div>
                  <select value={form.phase} onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}
                    style={{ ...inputStyle, cursor: "pointer", outline: "none" }}>
                    {PHASE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Recurring toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setForm(f => ({ ...f, recurring: !f.recurring }))}
                  style={{ width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer", background: form.recurring ? "#6C5CE7" : "var(--surface2)", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: form.recurring ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}/>
                </button>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Sora', sans-serif" }}>Costo recurrente</div>
                  <div style={{ fontSize: 11, color: "var(--textMute)" }}>se suma al costo mensual</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "11px", color: "var(--textMid)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
                  Cancelar
                </button>
                <button onClick={submitForm} disabled={!form.description.trim() || !form.amount}
                  style={{ flex: 2, background: form.description.trim() && form.amount ? "linear-gradient(135deg,#6C5CE7,#00F5D4)" : "var(--surface)", border: "none", borderRadius: 10, padding: "11px", color: form.description.trim() && form.amount ? "#fff" : "var(--textMute)", fontWeight: 700, fontSize: 13, cursor: form.description.trim() && form.amount ? "pointer" : "not-allowed", fontFamily: "'Sora', sans-serif", boxShadow: form.description.trim() && form.amount ? "0 0 16px rgba(108,92,231,0.4)" : "none", transition: "all 0.15s" }}>
                  {editIdx !== null ? "✅ Guardar cambios" : "💸 Agregar ítem"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
