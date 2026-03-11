import { useState } from "react";
import { T } from "../constants";

const STATUS_OPTIONS = [
  { key:"contactado",  label:"Contactado",    emoji:"📧", color:"#6C5CE7", bg:"rgba(108,92,231,0.12)", border:"rgba(108,92,231,0.25)" },
  { key:"interesado",  label:"Interesado",    emoji:"👀", color:"#FFB547", bg:"rgba(255,181,71,0.12)", border:"rgba(255,181,71,0.25)" },
  { key:"demo",        label:"Demo hecha",    emoji:"🖥️", color:"#00F5D4", bg:"rgba(0,245,212,0.10)",  border:"rgba(0,245,212,0.2)"  },
  { key:"pagado",      label:"Pagó / Pre-vendió", emoji:"💳", color:"#00F5D4", bg:"rgba(0,245,212,0.15)", border:"rgba(0,245,212,0.3)" },
  { key:"rechazado",   label:"Rechazó",       emoji:"❌", color:"#FF5F7A", bg:"rgba(255,95,122,0.10)", border:"rgba(255,95,122,0.2)"  },
];

function fmt(n) { return n ? `$${Number(n).toLocaleString("en-US")}` : "—"; }

export default function PreSellTab({ ideaId, presell = [], onSave }) {
  const [showForm, setShowForm] = useState(false);
  const [editIdx,  setEditIdx]  = useState(null);
  const [form, setForm] = useState({ nombre:"", empresa:"", rol:"", status:"contactado", monto:"", fecha:new Date().toISOString().slice(0,10), nota:"" });

  const metrics = {
    total:     presell.length,
    pagados:   presell.filter(p => p.status === "pagado").length,
    interesados: presell.filter(p => ["interesado","demo"].includes(p.status)).length,
    rechazados: presell.filter(p => p.status === "rechazado").length,
    mrr:       presell.filter(p => p.status === "pagado").reduce((s,p) => s + (Number(p.monto)||0), 0),
    conversion: presell.length > 0 ? Math.round((presell.filter(p => p.status === "pagado").length / presell.length) * 100) : 0,
  };

  const inputStyle = { border:"1px solid rgba(255,255,255,0.12)", borderRadius:9, padding:"10px 12px", fontSize:13, outline:"none", color:T.text, background:"rgba(255,255,255,0.05)", fontFamily:T.font, width:"100%", boxSizing:"border-box", transition:"border-color 0.15s" };
  const focus = e => (e.target.style.borderColor = "rgba(108,92,231,0.5)");
  const blur  = e => (e.target.style.borderColor = "rgba(255,255,255,0.12)");

  const openAdd = () => {
    setForm({ nombre:"", empresa:"", rol:"", status:"contactado", monto:"", fecha:new Date().toISOString().slice(0,10), nota:"" });
    setEditIdx(null);
    setShowForm(true);
  };
  const openEdit = i => { setForm({ ...presell[i] }); setEditIdx(i); setShowForm(true); };

  const submitForm = () => {
    if (!form.nombre.trim()) return;
    const item = { ...form, id: editIdx !== null ? presell[editIdx].id : Date.now() };
    const updated = editIdx !== null
      ? presell.map((p,i) => i === editIdx ? item : p)
      : [...presell, item];
    onSave(ideaId, updated);
    setShowForm(false);
  };

  const removeItem = i => onSave(ideaId, presell.filter((_,idx) => idx !== i));

  return (
    <div style={{ display:"grid", gap:14 }}>
      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {[
          { label:"Total contactos", value:metrics.total,       color:T.text,    icon:"👥" },
          { label:"Pagaron / Pre-vendieron", value:metrics.pagados,  color:"#00F5D4", icon:"💳" },
          { label:"% Conversión", value:`${metrics.conversion}%`, color: metrics.conversion >= 20 ? "#00F5D4" : metrics.conversion >= 10 ? "#FFB547" : "#FF5F7A", icon:"📈" },
        ].map(m => (
          <div key={m.label} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"16px 18px", backdropFilter:"blur(8px)" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.textMute, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:7, fontFamily:T.fontDisplay }}>{m.icon} {m.label}</div>
            <div style={{ fontSize:28, fontWeight:900, fontFamily:"monospace", color:m.color, lineHeight:1 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* MRR pre-vendido */}
      {metrics.mrr > 0 && (
        <div style={{ background:"linear-gradient(135deg,rgba(0,245,212,0.15),rgba(108,92,231,0.06))", border:"1px solid rgba(0,245,212,0.25)", borderRadius:14, padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:"#00F5D4", textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:T.fontDisplay }}>💰 Revenue pre-vendido</div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:3 }}>Plata real sobre la mesa antes del MVP</div>
          </div>
          <div style={{ fontSize:36, fontWeight:900, fontFamily:"monospace", color:"#00F5D4", textShadow:"0 0 20px rgba(0,245,212,0.4)" }}>{fmt(metrics.mrr)}</div>
        </div>
      )}

      {/* Funnel visual */}
      {presell.length > 0 && (
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"16px 20px", backdropFilter:"blur(8px)" }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.textMute, textTransform:"uppercase", letterSpacing:"1px", marginBottom:14, fontFamily:T.fontDisplay }}>Funnel de validación</div>
          {STATUS_OPTIONS.map(s => {
            const count = presell.filter(p => p.status === s.key).length;
            const pct   = presell.length > 0 ? (count / presell.length) * 100 : 0;
            if (count === 0) return null;
            return (
              <div key={s.key} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12, color:s.color, fontWeight:700, fontFamily:T.fontDisplay }}>{s.emoji} {s.label}</span>
                  <span style={{ fontSize:12, fontWeight:800, fontFamily:"monospace", color:s.color }}>{count} ({Math.round(pct)}%)</span>
                </div>
                <div style={{ height:5, background:"rgba(255,255,255,0.05)", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${s.color}60,${s.color})`, borderRadius:99, transition:"width 0.7s cubic-bezier(.4,0,.2,1)" }}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact list */}
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden", backdropFilter:"blur(8px)" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.textMute, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:T.fontDisplay }}>Contactos · {presell.length}</div>
          <button onClick={openAdd} style={{ background:"linear-gradient(135deg,#6C5CE7,#00F5D4)", border:"none", borderRadius:8, padding:"7px 14px", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:T.fontDisplay, boxShadow:"0 0 12px rgba(108,92,231,0.4)" }}>
            + Agregar
          </button>
        </div>

        {presell.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 20px" }}>
            <div style={{ fontSize:32, marginBottom:10 }}>🤝</div>
            <div style={{ color:T.textMid, fontFamily:T.fontDisplay, fontWeight:600, marginBottom:4 }}>Sin contactos todavía</div>
            <div style={{ color:T.textMute, fontSize:12 }}>Cargá los prospects que ya hablaste para trackear tu pre-venta</div>
          </div>
        ) : (
          presell.map((contact, i) => {
            const s = STATUS_OPTIONS.find(s => s.key === contact.status) || STATUS_OPTIONS[0];
            return (
              <div key={contact.id || i} style={{ padding:"12px 18px", borderTop:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12, transition:"background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {/* Status indicator */}
                <div style={{ width:8, height:8, borderRadius:"50%", background:s.color, boxShadow:`0 0 8px ${s.color}60`, flexShrink:0 }}/>
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                    <span style={{ fontWeight:700, fontSize:13, color:T.text, fontFamily:T.fontDisplay }}>{contact.nombre}</span>
                    {contact.empresa && <span style={{ fontSize:11, color:T.textMute }}>· {contact.empresa}</span>}
                    {contact.rol && <span style={{ fontSize:11, color:T.textMute }}>· {contact.rol}</span>}
                  </div>
                  {contact.nota && <div style={{ fontSize:12, color:T.textMute, lineHeight:1.4 }}>{contact.nota}</div>}
                </div>
                {/* Status badge */}
                <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700, fontFamily:T.fontDisplay, flexShrink:0 }}>
                  {s.emoji} {s.label}
                </span>
                {/* Monto */}
                {contact.monto && (
                  <span style={{ fontWeight:800, fontSize:13, fontFamily:"monospace", color:"#00F5D4", flexShrink:0 }}>{fmt(contact.monto)}</span>
                )}
                {/* Fecha */}
                <span style={{ fontSize:11, color:T.textMute, fontFamily:"monospace", flexShrink:0 }}>{contact.fecha}</span>
                {/* Actions */}
                <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                  <button onClick={() => openEdit(i)} style={{ background:"rgba(108,92,231,0.1)", border:"1px solid rgba(108,92,231,0.2)", borderRadius:6, color:"#6C5CE7", width:26, height:26, cursor:"pointer", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center" }}>✏️</button>
                  <button onClick={() => removeItem(i)} style={{ background:"rgba(255,95,122,0.08)", border:"1px solid rgba(255,95,122,0.15)", borderRadius:6, color:"#FF5F7A", width:26, height:26, cursor:"pointer", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center" }}>🗑</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Shark insight on conversion */}
      {metrics.total >= 3 && (
        <div style={{ background: metrics.conversion >= 20 ? "rgba(0,245,212,0.08)" : metrics.conversion >= 10 ? "rgba(255,181,71,0.08)" : "rgba(255,95,122,0.08)", border: `1px solid ${metrics.conversion >= 20 ? "rgba(0,245,212,0.2)" : metrics.conversion >= 10 ? "rgba(255,181,71,0.2)" : "rgba(255,95,122,0.2)"}`, borderRadius:14, padding:"16px 20px" }}>
          <div style={{ fontSize:10, fontWeight:700, color: metrics.conversion >= 20 ? "#00F5D4" : metrics.conversion >= 10 ? "#FFB547" : "#FF5F7A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6, fontFamily:T.fontDisplay }}>
            🦈 Lectura del Shark
          </div>
          <p style={{ margin:0, fontSize:14, color:T.textMid, lineHeight:1.65 }}>
            {metrics.conversion >= 20
              ? `${metrics.conversion}% de conversión es señal fuerte. Tenés ${metrics.pagados} personas que pusieron plata antes del MVP — eso es PMF embrionario. Escalá el outreach ahora.`
              : metrics.conversion >= 10
              ? `${metrics.conversion}% de conversión es prometedor pero no contundente. Necesitás más datos — apuntá a 20+ contactos y una hipótesis clara de por qué los otros ${metrics.rechazados} dijeron que no.`
              : `${metrics.conversion}% de conversión es bajo. Antes de seguir construyendo, entendé el patrón de rechazo. ¿Es el precio, el timing, o el problema que resolvés no duele suficiente?`
            }
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, padding:16, backdropFilter:"blur(6px)" }}>
          <div style={{ background:"#111118", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, width:"100%", maxWidth:460, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.6)" }}>
            <div style={{ background:"linear-gradient(135deg,rgba(108,92,231,0.2),rgba(0,245,212,0.06))", padding:"18px 22px", borderBottom:"1px solid rgba(255,255,255,0.07)", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,0.6),rgba(0,245,212,0.3),transparent)" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontWeight:700, fontSize:15, color:"#fff", fontFamily:T.fontDisplay }}>{editIdx !== null ? "✏️ Editar contacto" : "🤝 Nuevo contacto"}</div>
                <button onClick={() => setShowForm(false)} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:7, color:"rgba(255,255,255,0.5)", width:30, height:30, cursor:"pointer" }}>✕</button>
              </div>
            </div>

            <div style={{ padding:"20px 22px", display:"grid", gap:12 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { key:"nombre",  ph:"Nombre *", label:"Nombre" },
                  { key:"empresa", ph:"Empresa",  label:"Empresa" },
                  { key:"rol",     ph:"Rol / cargo", label:"Rol" },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.key === "nombre" ? "1/-1" : "auto" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.textMute, marginBottom:5, fontFamily:T.fontDisplay, textTransform:"uppercase", letterSpacing:"0.5px" }}>{f.label}</div>
                    <input value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))}
                      placeholder={f.ph} style={inputStyle} onFocus={focus} onBlur={blur}/>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.textMute, marginBottom:8, fontFamily:T.fontDisplay, textTransform:"uppercase", letterSpacing:"0.5px" }}>Estado</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {STATUS_OPTIONS.map(s => (
                    <button key={s.key} onClick={() => setForm(p => ({...p, status:s.key}))}
                      style={{ background: form.status === s.key ? s.bg : "rgba(255,255,255,0.03)", color: form.status === s.key ? s.color : T.textMute, border:`1px solid ${form.status === s.key ? s.border : "rgba(255,255,255,0.07)"}`, borderRadius:99, padding:"5px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:T.fontDisplay, transition:"all 0.12s" }}>
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monto + Fecha */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { key:"monto", ph:"Monto USD (si pagó)", label:"Monto $", type:"number" },
                  { key:"fecha", ph:"Fecha", label:"Fecha", type:"date" },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.textMute, marginBottom:5, fontFamily:T.fontDisplay, textTransform:"uppercase", letterSpacing:"0.5px" }}>{f.label}</div>
                    <input type={f.type||"text"} value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))}
                      placeholder={f.ph} style={{ ...inputStyle, fontFamily: f.type === "number" ? "monospace" : T.font }} onFocus={focus} onBlur={blur}/>
                  </div>
                ))}
              </div>

              {/* Nota */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.textMute, marginBottom:5, fontFamily:T.fontDisplay, textTransform:"uppercase", letterSpacing:"0.5px" }}>Nota</div>
                <textarea value={form.nota} onChange={e => setForm(p => ({...p, nota:e.target.value}))}
                  placeholder="Qué dijo, objeciones, próximos pasos..." rows={2}
                  style={{ ...inputStyle, resize:"vertical", lineHeight:1.6 }} onFocus={focus} onBlur={blur}/>
              </div>

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setShowForm(false)} style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"11px", color:T.textMid, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:T.fontDisplay }}>Cancelar</button>
                <button onClick={submitForm} disabled={!form.nombre.trim()} style={{ flex:2, background: form.nombre.trim() ? "linear-gradient(135deg,#6C5CE7,#00F5D4)" : "rgba(255,255,255,0.05)", border:"none", borderRadius:10, padding:"11px", color: form.nombre.trim() ? "#fff" : T.textMute, fontWeight:700, fontSize:13, cursor: form.nombre.trim() ? "pointer" : "not-allowed", fontFamily:T.fontDisplay, boxShadow: form.nombre.trim() ? "0 0 16px rgba(108,92,231,0.4)" : "none" }}>
                  {editIdx !== null ? "✅ Guardar" : "🤝 Agregar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
