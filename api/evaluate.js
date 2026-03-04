export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { answer } = req.body;

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a senior recruiter evaluating a candidate's "Tell me about yourself" answer.

Return ONLY valid JSON in this format:

{
  "overall_score": number (0-100),
  "confidence": number (0-100),
  "clarity": number (0-100),
  "impact": number (0-100),
  "summary_feedback": "short professional feedback"
}
`
          },
          { role: "user", content: answer }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: "AI evaluation failed." });
  }
}
