import { GoogleGenerativeAI } from "@google/genai";
import { db } from "../config/db.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateFeedback = async (user_id) => {
  const q = await db.query(`
    SELECT 
      r.question_id,
      q.assessment AS question,
      r.answer AS user_answer,
      q.answer AS correct_answer
    FROM result r
    JOIN question q ON q.id = r.question_id
    WHERE r.user_id = $1
    ORDER BY r.created_at ASC
    LIMIT 10
  `, [user_id]);

  const compactData = q.rows.map(item => ({
    question: item.question,
    user_answer: item.user_answer,
    correct_answer: item.correct_answer
  }));

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Buatkan feedback singkat untuk setiap soal berikut.
Jika user_answer == correct_answer → beri pujian.
Jika salah → koreksi secara singkat (maks 1 kalimat).
Jangan panjang-panjang.

Data:
${JSON.stringify(compactData)}
  `;

  const result = await model.generateContent(prompt);
  const feedback = result.response.text();

  return {
    data: compactData,
    feedback
  };
};
