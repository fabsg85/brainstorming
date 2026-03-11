export const T = {
  // Backgrounds
  bg:           "#0B0B0F",
  bg2:          "#111118",
  bg3:          "#16161F",
  surface:      "rgba(255,255,255,0.04)",
  surface2:     "rgba(255,255,255,0.07)",
  surface3:     "rgba(255,255,255,0.10)",
  // Borders
  border:       "rgba(255,255,255,0.08)",
  border2:      "rgba(255,255,255,0.14)",
  // Text
  text:         "rgba(255,255,255,0.92)",
  textMid:      "rgba(255,255,255,0.52)",
  textMute:     "rgba(255,255,255,0.26)",
  white:        "#FFFFFF",
  // Brand
  purple:       "#6C5CE7",
  purpleGlow:   "rgba(108,92,231,0.35)",
  purpleLight:  "rgba(108,92,231,0.12)",
  teal:         "#00F5D4",
  tealGlow:     "rgba(0,245,212,0.25)",
  tealLight:    "rgba(0,245,212,0.10)",
  // Semantic (mapped to brand)
  mint:         "#00F5D4",
  mintLight:    "rgba(0,245,212,0.10)",
  coral:        "#FF5F7A",
  coralLight:   "rgba(255,95,122,0.12)",
  amber:        "#FFB547",
  amberLight:   "rgba(255,181,71,0.12)",
  cobalt:       "#6C5CE7",
  cobaltLight:  "rgba(108,92,231,0.12)",
  // Gradients
  grad:         "linear-gradient(135deg,#6C5CE7,#00F5D4)",
  gradR:        "linear-gradient(135deg,#00F5D4,#6C5CE7)",
  // Typography
  font:         "'DM Sans', system-ui, sans-serif",
  fontDisplay:  "'Sora', system-ui, sans-serif",
};

export const STAGES = [
  { key: "idea",         label: "Idea",          emoji: "💡", bg: "rgba(108,92,231,0.15)", color: "#6C5CE7" },
  { key: "validando",    label: "Validando",      emoji: "🔍", bg: "rgba(255,181,71,0.15)", color: "#FFB547" },
  { key: "construyendo", label: "Construyendo",   emoji: "🔨", bg: "rgba(0,245,212,0.12)",  color: "#00F5D4" },
  { key: "lanzado",      label: "Lanzado",        emoji: "🚀", bg: "rgba(0,245,212,0.18)",  color: "#00F5D4" },
];

export const WIZARD_STEPS = [
  { key: "title",   label: "El nombre",     emoji: "💡", desc: "Un nombre que no suene a startup genérica de 2019, por favor." },
  { key: "problem", label: "El dolor",      emoji: "🎯", desc: "¿Qué problema resuelve? ¿Quién lo sufre? ¿Cuánto pagan hoy para no resolverlo?" },
  { key: "stage",   label: "Estado actual", emoji: "📍", desc: "Seamos honestos sobre dónde está esto." },
];

export const SCORE_CRITERIA = [
  { key: "traccion",     label: "Tracción",     icon: "📈", short: "Trac" },
  { key: "moat",         label: "Moat",         icon: "🏰", short: "Moat" },
  { key: "monetizacion", label: "Monetización", icon: "💰", short: "Mono" },
  { key: "velocidad",    label: "Velocidad",    icon: "⚡", short: "Vel"  },
  { key: "mercado",      label: "Mercado",      icon: "🌍", short: "Mkt"  },
];

export const TABS = (sel) => [
  { key: "vote",        label: "🗳️ Votar"  },
  { key: "analysis",    label: "🦈 Análisis" },
  { key: "monetizacion",label: "💰 Modelo"  },
  { key: "gtm",         label: "🚀 GTM"     },
  { key: "comments",    label: `💬${sel?.comments?.length ? ` ${sel.comments.length}` : ""}` },
];
