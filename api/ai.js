export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(500).json({ error: 'No key configured' });

  const { model, messages, max_tokens } = req.body;

  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.SITE_URL || '',
      'X-Title': 'StudyFlow'
    },
    body: JSON.stringify({ model, messages, max_tokens })
  });

  const data = await r.json();
  return res.status(r.status).json(data);
}
