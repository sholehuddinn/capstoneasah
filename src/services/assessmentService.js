import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import { redisClient } from "../config/redis.js";
import { createQuestion, findOne } from "../models/question.js";
import { getTutorialId } from "../controller/tutorialController.js";
import { fetchTutorialId } from "./tutorialService.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAssessments = async (tutorial, user_id) => {
  try {
    const model = genAI.getGenerativeModel({ model: process.env.MODEL });

    const tutorialKey = `tutorial:${tutorial}`;
    const cachedTutorial = await fetchTutorialId(tutorial);
    await redisClient.set(tutorialKey, JSON.stringify(cachedTutorial), { EX: 3600 });

    const prompt = `
    Berdasarkan materi berikut, buatkan 4 soal pilihan ganda untuk asesmen pembelajaran.
    Tiap soal harus memiliki 4 opsi jawaban (A, B, C, D) dan jelaskan alasan benar/salahnya.
    Pastikan Kamu Membuat soal tidak keluar dari konteks materi yang aku berikan.

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

    const data = parsed.map((q, index) => ({
      id: nanoid(8),
      assessment: q.assessment,
      multiple_choice: q.multiple_choice.map((m) => ({
        id: m.id || nanoid(6),
        option: m.option,
        correct: m.correct,
        explanation: m.explanation,
      })),
      question_number: index + 1,
      time: 30000,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 120000).toISOString(),
    }));

    const firstQuestion = data[0]; 

    const exists = await findOne(user_id, tutorial);

    if (!exists) {
      await createQuestion({
        id: firstQuestion.id,
        user_id,
        assessment: firstQuestion.assessment,
        tutorial_id: tutorial,
        option_1: firstQuestion.multiple_choice[0].option,
        option_2: firstQuestion.multiple_choice[1].option,
        option_3: firstQuestion.multiple_choice[2].option,
        option_4: firstQuestion.multiple_choice[3].option,
        answer:
          firstQuestion.multiple_choice.find((m) => m.correct)?.id.toString() ?? "1",
      });
    }

    const remaining = data.slice(1); 

    const redisKey = `assessment:${nanoid(6)}`;
    await redisClient.set(redisKey, JSON.stringify(remaining), { EX: 120 });

    return {
      key: redisKey,
      materi_key: tutorialKey,
      data: remaining,
    };
  } catch (err) {
    throw err;
  }
};