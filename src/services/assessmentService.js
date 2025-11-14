import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import { redisClient } from "../config/redis.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAssessments = async (tutorial) => {
  try {
    const model = genAI.getGenerativeModel({ model: process.env.MODEL });

    const tutorialKey = `tutorial:${tutorial}`;
    const cachedTutorial = await redisClient.get(tutorialKey);

    if (!cachedTutorial) {
      throw new Error("Materi tutorial tidak ditemukan atau kosong.");
    } 

    const prompt = `
    Berdasarkan materi berikut, buatkan 3 soal pilihan ganda untuk asesmen pembelajaran.
    Tiap soal harus memiliki 4 opsi jawaban (A, B, C, D) dan jelaskan alasan benar/salahnya.

    === Materi ===
    ${cachedTutorial}

    === Format JSON WAJIB (tanpa tambahan teks) ===
    [
      {
        "assessment": "Teks soal di sini",
        "multiple_choice": [
          { "id": 1, "option": "Teks opsi A", "correct": true/false, "explanation": "Penjelasan agak panjang" },
          { "id": 2, "option": "Teks opsi B", "correct": true/false, "explanation": "Penjelasan agak panjang" },
          { "id": 3, "option": "Teks opsi C", "correct": true/false, "explanation": "Penjelasan agak panjang" },
          { "id": 4, "option": "Teks opsi D", "correct": true/false, "explanation": "Penjelasan agak panjang" }
        ]
      }
    ]

    Output HARUS berupa array JSON valid tanpa markdown atau teks lain.
    `;

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (apiErr) {
      console.error("Gagal memanggil Gemini API:", apiErr.message);
      throw new Error("Gagal menghubungi Gemini API — coba beberapa saat lagi.");
    }

    if (!result || !result.response || typeof result.response.text !== "function") {
      throw new Error("Respons dari Gemini API tidak valid.");
    }

    let text = result.response.text().replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      throw new Error("Format JSON tidak valid. Output mentah: " + text);
    }

    const data = parsed.map((q) => ({
      id: nanoid(8),
      assessment: q.assessment,
      multiple_choice: q.multiple_choice.map((m) => ({
        id: m.id || nanoid(6),
        option: m.option,
        correct: m.correct,
        explanation: m.explanation,
      })),
      time: 30000,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 120000).toISOString(),
    }));

    const redisKey = `assessment:${nanoid(6)}`;
    await redisClient.set(redisKey, JSON.stringify(data), { EX: 120 });

    return {
      key: redisKey,
      count: data.length,
      data,
    };
  } catch (err) {
    throw err;
  }
};
