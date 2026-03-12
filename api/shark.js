export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, useWebSearch } = req.body;
  if (!prompt) return res.status(400).json({ error: "No prompt" });

  const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

  try {
    const body = {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    };

    if (useWebSearch) {
      body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    }

    const response = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        ...(useWebSearch ? { "anthropic-beta": "web-search-2025-03-05" } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
