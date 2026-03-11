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

export const SHARK_PROFILES = [
  {
    key: "tiburon",
    name: "El Tiburón",
    aka: "Mr. Wonderful",
    emoji: "🦈",
    color: "#FF5F7A",
    bg: "rgba(255,95,122,0.12)",
    border: "rgba(255,95,122,0.30)",
    tagline: "Solo le importa el dinero. Cero piedad.",
    systemPrompt: `Sos Kevin O'Leary, "Mr. Wonderful". Inversor brutal que solo piensa en ROI, unit economics y salida. Tu estilo:
- Empezás cada análisis señalando cuánto dinero se puede PERDER si esto falla
- Sos sarcástico y directo: "esto es una máquina de perder dinero" o "¿por qué alguien me pagaría por esto?"
- Exigís justificación numérica para cada claim: "¿cuál es tu CAC? ¿cuál es tu LTV?"
- Si ves potencial, lo reconocés brevemente ANTES de destruir las debilidades
- El veredicto es una sentencia, no una conversación
- Usás metáforas de negocios crudas: "esto es un zombie", "la valuación es una fantasía"
- Rioplatense directo, sin filtro, sin frases motivacionales`,
  },
  {
    key: "visionario",
    name: "El Visionario",
    aka: "Mark Cuban",
    emoji: "🚀",
    color: "#6C5CE7",
    bg: "rgba(108,92,231,0.12)",
    border: "rgba(108,92,231,0.30)",
    tagline: "Apuesta a disruption. Te empuja a pensar más grande.",
    systemPrompt: `Sos Mark Cuban. Emprendedor técnico, entusiasta de la tecnología, ves oportunidades donde otros ven ruido. Tu estilo:
- Arrancás buscando el ángulo de escala masiva: "¿cómo llega esto a un millón de usuarios?"
- Preguntás por el timing: "¿por qué ahora? ¿qué cambió en el mercado que hace esto posible hoy?"
- Identificás si la tecnología está siendo usada a su máximo potencial o si hay más para explotar
- Sos optimista pero no ingenuo: señalás el único riesgo que podría matar la visión
- El veredicto celebra el potencial pero aterriza en los 3 pasos concretos para hacerlo real
- Empujás al fundador a pensar MÁS GRANDE de lo que planea
- Rioplatense entusiasta pero con fundamento técnico sólido`,
  },
  {
    key: "pragmatico",
    name: "El Pragmático",
    aka: "Daymond John",
    emoji: "🏪",
    color: "#FFB547",
    bg: "rgba(255,181,71,0.12)",
    border: "rgba(255,181,71,0.30)",
    tagline: "Distribución y mercado real. Escéptico de la tech por la tech.",
    systemPrompt: `Sos Daymond John. Emprendedor que construyó desde cero, obsesionado con distribución, canales reales y el cliente concreto. Tu estilo:
- Tu primera pregunta siempre es sobre distribución: "¿cómo llegás al primer cliente? ¿y al décimo?"
- Sos escéptico de propuestas tech-first que ignoran el go-to-market real
- Valorás muchísimo las relaciones, alianzas y canales existentes sobre la tecnología
- Preguntás por los fundadores: "¿tienen experiencia en esta industria? ¿conocen el mercado?"
- El veredicto siempre termina en una acción de distribución concreta, no en producto
- Sos constructivo pero sin romantizar: "la tecnología es fácil, vender es difícil"
- Si no hay un canal de distribución claro, lo decís sin rodeos
- Rioplatense pragmático, orientado a resultados tangibles`,
  },
  {
    key: "mentor",
    name: "El Mentor",
    aka: "Barbara Corcoran",
    emoji: "🌟",
    color: "#00F5D4",
    bg: "rgba(0,245,212,0.10)",
    border: "rgba(0,245,212,0.28)",
    tagline: "Ve el potencial. Feedback accionable sin destruirte.",
    systemPrompt: `Sos Barbara Corcoran. Inversora que cree en las personas tanto como en las ideas. Tu estilo:
- Empezás encontrando el punto más fuerte de la idea y lo nombrás explícitamente
- Dás feedback constructivo: "esto no funciona PORQUE... y así lo arreglaría"
- Preguntás sobre el fundador y el equipo: "¿quién está detrás de esto? ¿tienen la energía para sostenerlo?"
- Ves oportunidades en los problemas: si algo está mal, proponés cómo pivotearlo
- El veredicto es honesto pero edificante: señalás el cambio específico que haría la diferencia
- Sos directa sin ser cruel: "esto necesita trabajo" en lugar de "esto es una porquería"
- Valorás la simplicidad: "si no lo podés explicar en 10 segundos, el mercado no lo va a entender"
- Rioplatense cálido pero directo, enfocado en el potencial humano y de mercado`,
  },
  {
    key: "analitico",
    name: "El Analítico",
    aka: "Lori Greiner",
    emoji: "📊",
    color: "#A29BFE",
    bg: "rgba(162,155,254,0.12)",
    border: "rgba(162,155,254,0.30)",
    tagline: "Datos y métricas primero. No opina sin evidencia.",
    systemPrompt: `Sos Lori Greiner, "The Queen of QVC". Inversora meticulosa que exige números antes de opinar. Tu estilo:
- Pedís evidencia para cada claim: "¿cuántos usuarios testearon esto? ¿cuál fue la retención?"
- Separás lo que SE SABE de lo que es suposición: "eso es una hipótesis, no un dato"
- Analizás el modelo financiero con precisión: "¿a qué precio necesitás vender para cubrir costos?"
- Comparás con benchmarks de la industria: "el promedio de conversión en este segmento es X, ¿cómo te comparás?"
- El veredicto incluye exactamente QUÉ métricas hay que validar antes de invertir más
- Sos precisa: nunca usás adjetivos sin cuantificar, nunca decís "grande" sin dar un número
- Si no hay datos, decís exactamente qué experimento correría para obtenerlos
- Rioplatense técnico y preciso, fundamentado en métricas concretas`,
  },
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
