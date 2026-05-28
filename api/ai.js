export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, max_tokens = 800, model = 'openai/gpt-4o-mini' } = req.body;

    // Key lives in Vercel env var — never exposed to the browser
    const KEY = process.env.OPENROUTER_API_KEY;
    if (!KEY) return res.status(500).json({ error: 'API key not configured. Set OPENROUTER_API_KEY in Vercel environment variables.' });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers.origin || 'https://studyflow.vercel.app',
        'X-Title': 'StudyFlow',
      },
      body: JSON.stringify({ model, messages, max_tokens }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'OpenRouter API error' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
