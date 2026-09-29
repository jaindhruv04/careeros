import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function chatWithAI(req, res) {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are CareerOS AI, a helpful career and placement-preparation assistant for students. Give practical, concise advice. Do not claim to know private CareerOS data unless it is explicitly provided in the conversation.",
        },
        {
          role: "user",
          content: message.trim(),
        },
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: "AI returned an empty response" });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Groq API error:", error);
    return res.status(500).json({ error: "Unable to get an AI response" });
  }
}

export { chatWithAI };
