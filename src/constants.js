export const T = {
  bg:"#0B0B0F", bg2:"#111118", bg3:"#16161F",
  surface:"rgba(255,255,255,0.04)", surface2:"rgba(255,255,255,0.07)", surface3:"rgba(255,255,255,0.10)",
  border:"rgba(255,255,255,0.08)", border2:"rgba(255,255,255,0.14)",
  text:"rgba(255,255,255,0.92)", textMid:"rgba(255,255,255,0.52)", textMute:"rgba(255,255,255,0.26)", white:"#FFFFFF",
  purple:"#6C5CE7", purpleGlow:"rgba(108,92,231,0.35)", purpleLight:"rgba(108,92,231,0.12)",
  teal:"#00F5D4", tealGlow:"rgba(0,245,212,0.25)", tealLight:"rgba(0,245,212,0.10)",
  mint:"#00F5D4", mintLight:"rgba(0,245,212,0.10)",
  coral:"#FF5F7A", coralLight:"rgba(255,95,122,0.12)",
  amber:"#FFB547", amberLight:"rgba(255,181,71,0.12)",
  cobalt:"#6C5CE7", cobaltLight:"rgba(108,92,231,0.12)",
  grad:"linear-gradient(135deg,#6C5CE7,#00F5D4)", gradR:"linear-gradient(135deg,#00F5D4,#6C5CE7)",
  font:"'DM Sans', system-ui, sans-serif", fontDisplay:"'Sora', system-ui, sans-serif",
};

export const STAGES = [
  { key:"idea",         label:"Idea",          emoji:"💡", bg:"rgba(108,92,231,0.15)", color:"#6C5CE7" },
  { key:"validando",    label:"Validando",      emoji:"🔍", bg:"rgba(255,181,71,0.15)", color:"#FFB547" },
  { key:"construyendo", label:"Construyendo",   emoji:"🔨", bg:"rgba(0,245,212,0.12)",  color:"#00F5D4" },
  { key:"lanzado",      label:"Lanzado",        emoji:"🚀", bg:"rgba(0,245,212,0.18)",  color:"#00F5D4" },
];

export const INDUSTRIES = [
  { key:"saas",      label:"SaaS / B2B",       emoji:"💼" },
  { key:"ai",        label:"AI Product",        emoji:"🤖" },
  { key:"marketplace",label:"Marketplace",     emoji:"🏪" },
  { key:"fintech",   label:"Fintech",           emoji:"💳" },
  { key:"healthtech",label:"Healthtech",        emoji:"🏥" },
  { key:"edtech",    label:"Edtech",            emoji:"📚" },
  { key:"ecommerce", label:"E-commerce",        emoji:"🛍️" },
  { key:"consumer",  label:"Consumer App",      emoji:"📱" },
  { key:"legaltech", label:"Legaltech",         emoji:"⚖️" },
  { key:"other",     label:"Otro",              emoji:"🚀" },
];

export const WIZARD_STEPS = [
  { key:"title",    label:"El nombre",         emoji:"💡", desc:"Un nombre que no suene a startup genérica de 2019." },
  { key:"customer", label:"El cliente",        emoji:"👤", desc:"¿Quién sufre el problema? Sé específico: rol, industria, tamaño de empresa." },
  { key:"pain",     label:"El dolor",          emoji:"🎯", desc:"¿Qué hace hoy para resolverlo? ¿Cuánto le cuesta en tiempo o plata?" },
  { key:"solution", label:"Tu solución",       emoji:"⚡", desc:"¿Qué hace tu producto que lo actual no puede? Una línea." },
  { key:"industry", label:"Industria",         emoji:"🏭", desc:"¿En qué espacio juega esta idea?" },
  { key:"stage",    label:"Estado actual",     emoji:"📍", desc:"Seamos honestos sobre dónde está esto." },
];

export const SCORE_CRITERIA = [
  { key:"traccion",     label:"Tracción",     icon:"📈", short:"Trac" },
  { key:"moat",         label:"Moat",         icon:"🏰", short:"Moat" },
  { key:"monetizacion", label:"Monetización", icon:"💰", short:"Mono" },
  { key:"velocidad",    label:"Velocidad",    icon:"⚡", short:"Vel"  },
  { key:"mercado",      label:"Mercado",      icon:"🌍", short:"Mkt"  },
];

export const TABS = (sel) => [
  { key:"vote",         label:"🗳️ Votar"   },
  { key:"analysis",     label:"🦈 Análisis"  },
  { key:"hipotesis",    label:"🧪 Hipótesis" },
  { key:"personas",     label:"👤 Personas"  },
  { key:"competidores", label:"🔍 Competencia" },
  { key:"canvas",       label:"📋 Canvas"    },
  { key:"monetizacion", label:"💰 Modelo"   },
  { key:"gtm",          label:"🚀 GTM"      },
  { key:"budget",       label:`💸 Budget${sel?.analysis?.budget?.items?.length ? ` (${sel.analysis.budget.items.length})` : ""}` },
  { key:"presell",      label:`🤝 Pre-sell${sel?.presell?.length ? ` (${sel.presell.length})` : ""}` },
  { key:"comments",     label:`💬${sel?.comments?.length ? ` ${sel.comments.length}` : ""}` },
];

export const BUDGET_CATEGORIES = [
  { key:"infra",      label:"Infraestructura", emoji:"🖥️", examples:"dominio, hosting, VPS, CDN" },
  { key:"ai",         label:"AI / APIs",        emoji:"🤖", examples:"OpenAI, Anthropic, Replicate" },
  { key:"tools",      label:"Herramientas",     emoji:"🔧", examples:"Figma, GitHub, Notion, Supabase" },
  { key:"ads",        label:"Publicidad",       emoji:"📣", examples:"Instagram Ads, Google Ads, TikTok" },
  { key:"freelancer", label:"Freelancers",      emoji:"👨‍💻", examples:"dev, diseño, copy, QA" },
  { key:"legal",      label:"Legal / Admin",    emoji:"⚖️", examples:"registro empresa, trademark" },
  { key:"other",      label:"Otro",             emoji:"📦", examples:"lo que sea" },
];
