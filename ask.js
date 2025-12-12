const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Make sure you have your API key in .env like:
// OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST route to get AI answer
router.post('/', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a helpful campus event assistant." },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });

  } catch (err) {
    console.error('OpenAI API error:', err.message);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

module.exports = router;
