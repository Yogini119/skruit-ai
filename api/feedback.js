import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    const { pitch } = req.body;

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an expert coach giving pitch feedback." },
            { role: "user", content: `Give constructive feedback on this pitch: "${pitch}"` }
        ],
    });

    const feedback = completion.choices[0].message.content;
    res.status(200).json({ feedback });
}
