import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { pitch } = req.body;

    if (!pitch) return res.status(400).json({ error: "Pitch is required" });

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert pitch coach. Provide **exactly 10 constructive feedback points** for every pitch, numbered 1 to 10, covering clarity, structure, persuasion, and style. Keep it concise and actionable."
                },
                { role: "user", content: `Review this pitch: "${pitch}"` }
            ],
        });

        const feedback = completion.choices[0].message.content;
        res.status(200).json({ feedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI feedback failed" });
    }
}
