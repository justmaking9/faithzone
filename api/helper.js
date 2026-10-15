export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Please enter a message.' });
  }
  const prompt = `You are the Christian Helper for FaithZone, the app of The Builders House Chapel International, Senior Pastor Vitalis Adu. Give a warm, respectful, Bible-based Christian response. Be concise. If the person asks for prayer, include a short prayer. Never claim to be a pastor or replace professional help; for safety or mental-health crises, encourage contacting local emergency services or a trusted person.\n\nUser: ${message.slice(0, 4000)}`;
  try {
    const url = 'https://text.pollinations.ai/' + encodeURIComponent(prompt);
    const response = await fetch(url, { headers: { Accept: 'text/plain' } });
    if (!response.ok) return res.status(response.status).json({ error: 'Pollinations AI request failed.' });
    const reply = (await response.text()).trim();
    if (!reply) return res.status(500).json({ error: 'The AI did not return a reply.' });
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Could not reach the AI service.' });
  }
}