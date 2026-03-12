export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, useWebSearch } = req.body;
  if (!prompt) return res.status(400).json({ error: "No prompt" });

  const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    ...(useWebSearch ? { "anthropic-beta": "web-search-2025-03-05" } : {}),
  };

  const tools = useWebSearch
    ? [{ type: "web_search_20250305", name: "web_search" }]
    : undefined;

  try {
    let messages = [{ role: "user", content: prompt }];
    let finalData = null;

    // Agentic loop: keep going until stop_reason != "tool_use"
    for (let turn = 0; turn < 5; turn++) {
      const body = {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8000,
        messages,
        ...(tools ? { tools } : {}),
      };

      const response = await fetch(ANTHROPIC_API, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        return res.status(500).json(data);
      }

      finalData = data;

      // If not tool_use, we have the final answer
      if (data.stop_reason !== "tool_use") break;

      // Otherwise: append assistant turn + tool results and loop
      messages = [
        ...messages,
        { role: "assistant", content: data.content },
        {
          role: "user",
          content: data.content
            .filter(b => b.type === "tool_use")
            .map(b => ({
              type: "tool_result",
              tool_use_id: b.id,
              content: "Search completed. Use the results above to answer.",
            })),
        },
      ];
    }

    res.status(200).json(finalData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
