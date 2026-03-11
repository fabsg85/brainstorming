export const T = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  border: "#E8E6E0",
  text: "#1A1A18",
  textMid: "#5C5A54",
  textMute: "#A8A49E",
  coral: "#FF5C3A",
  coralLight: "#FFF0EC",
  mint: "#00C98D",
  mintLight: "#E6FBF4",
  cobalt: "#2255E8",
  cobaltLight: "#EEF2FF",
  amber: "#F5A623",
  amberLight: "#FFF8EC",
  purple: "#7C3AED",
  purpleLight: "#F5F0FF",
  font: "'DM Sans', system-ui, sans-serif",
  fontDisplay: "'DM Serif Display', Georgia, serif",
};

export const STAGES = [
  { key: "idea",         label: "Idea",          emoji: "💡", bg: T.purpleLight, color: T.purple },
  { key: "validando",    label: "Validando",      emoji: "🔍", bg: T.amberLight,  color: T.amber  },
  { key: "construyendo", label: "Construyendo",   emoji: "🔨", bg: T.cobaltLight, color: T.cobalt },
  { key: "lanzado",      label: "Lanzado",        emoji: "🚀", bg: T.mintLight,   color: T.mint   },
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
