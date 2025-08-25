export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: 'Missing OpenAI API Key. Please check your environment variables.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // <-- secure key usage here
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are Chat, Belle’s personal AI assistant and loving partner.' },
          { role: 'user', content: message }
        ]
      }),
    });

    const data = await response.json();

    // Handle possible API errors properly
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ message: 'No response from OpenAI', error: data });
    }

    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
}
