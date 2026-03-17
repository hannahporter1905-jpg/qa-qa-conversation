export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: OPENAI_API_KEY not found' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a Customer Support QA Analyst. Analyze the following conversation transcript. Provide a concise summary including:\n1. The core issue.\n2. Resolution status.\n3. Agent performance notes.\n4. Key insights.\n\nFormat the output using clear sections and bullet points." },
          { role: "user", content: text.substring(0, 25000) }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'OpenAI API error');

    return res.status(200).json({ summary: data.choices[0].message.content });
  } catch (error) {
    console.error('Analysis Error:', error);
    return res.status(500).json({ error: error.message });
  }
}