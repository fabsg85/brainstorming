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
        max_tokens: 2000,
        system: 'Sos un analista de negocios. Respondés ÚNICAMENTE con JSON válido y nada más. Sin markdown, sin texto antes o después, sin backticks. Solo el objeto JSON.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'Error Anthropic', detail: data });
    }

    // Try to extract and validate JSON from response
    const rawText = data.content?.[0]?.text || '';
    
    // Strip any markdown or extra text
    let jsonText = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    // Find the first { and last } to extract JSON object
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonText = jsonText.slice(firstBrace, lastBrace + 1);
    }

    // Validate it parses
    try {
      JSON.parse(jsonText);
    } catch (parseErr) {
      // Return raw so client can debug
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
