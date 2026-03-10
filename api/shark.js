export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key no configurada' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'JSON inválido' }); }
  }
  if (!body || !body.prompt) return res.status(400).json({ error: 'Falta el prompt' });

  const { prompt } = body;

  // Inject scoring methodology into every request
  const scoringGuide = `
METODOLOGÍA DE SCORING — SEGUILA AL PIE DE LA LETRA:

Antes de asignar cada score, razoná en voz alta con una justificación de 1 línea. Luego asigná el número usando estas anclas ESTRICTAS:

TRACCIÓN POTENCIAL (¿hay demanda probada y urgente?):
10 = gente pagando por esto hoy, mercado en crecimiento explosivo
8-9 = dolor claro y frecuente, alternativas caras o malas, dispuestos a pagar
6-7 = problema real pero no urgente, o demanda incierta
4-5 = nicho pequeño o dolor que la gente tolera sin resolver
1-3 = problema imaginario o que nadie prioriza

MOAT / VENTAJA DEFENSIBLE (¿qué tan difícil es copiarlo en 6 meses?):
10 = data propietaria única + network effects + contratos exclusivos
8-9 = integración profunda en workflow + datos que mejoran con el uso
6-7 = ventaja de primero en el mercado o expertise de dominio específico
4-5 = diferenciación de producto copiable en meses
1-3 = commodity puro, cualquiera lo replica en semanas

MONETIZACIÓN CLARA (¿es fácil cobrar desde el día 1?):
10 = precio obvio, cliente con presupuesto asignado, venta directa simple
8-9 = modelo claro, willingness to pay demostrada en mercados similares
6-7 = modelo posible pero requiere educación del mercado
4-5 = monetización indirecta o incierta
1-3 = "gratis y luego vemos" o sin modelo viable

VELOCIDAD DE VALIDACIÓN (¿en cuánto tiempo sabés si funciona?):
10 = pre-venta posible en menos de 1 semana, feedback inmediato
8-9 = MVP validable en 2-4 semanas con clientes reales
6-7 = validación en 1-3 meses
4-5 = ciclo de venta largo o validación compleja
1-3 = años para saber si funciona (regulatorio, B2G, etc.)

TAMAÑO DE MERCADO (¿cuánto MRR es posible a 3 años con buen execution?):
10 = $1M+ MRR alcanzable, mercado global o regional masivo
8-9 = $100K-$1M MRR alcanzable, mercado regional sólido
6-7 = $20K-$100K MRR, nicho rentable pero limitado
4-5 = $5K-$20K MRR máximo realista
1-3 = mercado demasiado chico para ser negocio sostenible

IMPORTANTE: Sé brutal. La mayoría de las ideas merecen entre 4 y 7. Un 8+ requiere justificación sólida. Un 9+ es excepcional y debe tener evidencia concreta de mercado.
`;

  const fullPrompt = scoringGuide + "\n\n" + prompt;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        system: 'Sos un analista de negocios brutalmente honesto. Respondés ÚNICAMENTE con JSON válido y nada más. Sin markdown, sin texto antes o después, sin backticks. Solo el objeto JSON puro. Cada campo de texto máximo 2 oraciones. Sé conciso.',
        messages: [{ role: 'user', content: fullPrompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'Error Anthropic', detail: data });
    }

    const rawText = data.content?.[0]?.text || '';

    let jsonText = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonText = jsonText.slice(firstBrace, lastBrace + 1);
    }

    try {
      JSON.parse(jsonText);
    } catch (parseErr) {
      return res.status(200).json({
        content: [{ type: 'text', text: jsonText }],
        parseError: parseErr.message,
        rawText: rawText.slice(0, 500)
      });
    }

    return res.status(200).json({ content: [{ type: 'text', text: jsonText }] });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
