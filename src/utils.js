import { T } from "./constants";

export function avg(scores) {
  if (!scores) return null;
  const vals = Object.values(scores).filter(v => v > 0);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

export function scoreColor(s) {
  if (!s) return T.textMute;
  if (s >= 7.5) return "#00F5D4";   // teal
  if (s >= 5.5) return "#FFB547";   // amber
  return "#FF5F7A";                  // coral
}

export function scoreLabel(s) {
  if (!s) return "Sin datos";
  if (s >= 9)  return "Tomá mi plata";
  if (s >= 8)  return "Esto va en serio";
  if (s >= 7)  return "Tiene potencial";
  if (s >= 6)  return "Puede funcionar";
  if (s >= 5)  return "Meh, quizás";
  if (s >= 4)  return "Necesita trabajo";
  if (s >= 3)  return "Houston...";
  return "Próxima idea";
}

export function scoreVerdict(s) {
  if (!s) return null;
  if (s >= 8.5) return { label: "INVERTIRÍA HOY",    emoji: "🔥", sub: "Rarísimo que diga esto. No lo arruines." };
  if (s >= 7.5) return { label: "INVERTIRÍA",         emoji: "🟢", sub: "Tiene lo que hace falta. A construir, ayer." };
  if (s >= 6)   return { label: "PIVOTE NECESARIO",   emoji: "🟡", sub: "Hay algo acá, pero está enterrado bajo problemas." };
  if (s >= 4.5) return { label: "PASS POR AHORA",     emoji: "🟠", sub: "No es el momento o no es la idea." };
  return          { label: "HARD PASS",               emoji: "🔴", sub: "No, gracias. La próxima." };
}

export function exportMarkdown(filename, content) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
