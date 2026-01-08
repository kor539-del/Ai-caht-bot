import OpenAI from "openai";
import express from "express";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/assess", async (req, res) => {
  try {
    const userAnswer = req.body.answer;

    const prompt = `
    Kamu adalah AI penilai skill karyawan.
    Nilai jawaban berikut dan berikan:
    - skor 0 sampai 100
    - feedback singkat tentang kekurangan dan motivasi belajar

    Jawaban karyawan:
    "${userAnswer}"
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const output = completion.choices[0].message.content;

    res.json({
      score: Math.floor(Math.random() * 40) + 60, 
      feedback: output
    });

  } catch (err) {
    res.status(500).json({ error: "Gagal menilai jawaban AI." });
  }
});

app.get("/", (req, res) => {
  res.send("Server AI Performance Coach berjalan!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
