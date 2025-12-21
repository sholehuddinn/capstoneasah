// import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import { redisClient } from "../config/redis.js";
import { createQuestion, findOne } from "../models/question.js"; 
import { generateAI } from "./generateAiService.js";
import { createExplanationModel } from "../models/explanation.js"

import 'dotenv/config';

export const cleanHtmlContent = (html) => {
  if (!html || typeof html !== "string") return "";

  return html
    // 1. Hapus iframe beserta isinya
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    // 2. Hapus script & style (opsional tapi aman)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    // 3. Hapus semua tag HTML lainnya
    .replace(/<[^>]+>/g, "")
    // 4. Decode HTML entity sederhana
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    // 5. Rapikan spasi
    .replace(/\s+/g, " ")
    .trim();
};


// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
//   baseUrl: "https://generativelanguage.googleapis.com/v1"
// });

export const generateAssessments = async (tutorial, user_id) => {
  try {
    // const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    // console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);
    // console.log("GEMINI MODEL:", process.env.MODEL);
    // console.log("SDK VERSION:", require("@google/generative-ai/package.json").version);

    const tutorialKey = `tutorial:${tutorial}`;
    let cachedTutorial = await redisClient.get(tutorialKey);
 
    cachedTutorial = cleanHtmlContent(cachedTutorial);

    if (!cachedTutorial) {
      throw new Error("Materi tutorial tidak ditemukan atau kosong.");
    }

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
      result = await generateAI(prompt);
    } catch (apiErr) {
      console.error("Gagal memanggil Gemini API:", apiErr.message);
      throw new Error("Gagal menghubungi Gemini API — coba beberapa saat lagi.");
    }

    if (!result || typeof result !== "string") {
      throw new Error("Respons dari Gemini API tidak valid (bukan string).");
    }

    let text = result.replace(/```json|```/g, "").trim();

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

      await createExplanationModel({
        question_id: firstQuestion.id,
        explanation_1: firstQuestion.multiple_choice[0].explanation,
        explanation_2: firstQuestion.multiple_choice[1].explanation,
        explanation_3: firstQuestion.multiple_choice[2].explanation,
        explanation_4: firstQuestion.multiple_choice[3].explanation,
      });
    }

    const remaining = data.slice(1); 

    const redisKey = `assessment:${nanoid(6)}`;
    await redisClient.set(redisKey, JSON.stringify(remaining), { EX: 7200 });

    const time = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour12: false,
    });

    console.log(`[AI] generate soal : ${tutorial} | Time: ${time}`);

    return {
      key: redisKey,
      materi_key: tutorialKey,
      data: remaining,
    };
  } catch (err) {
    return err.message;
  }
};

export const getAssessmentId = async (id) => {
  try {
    if (!id) {
      throw new Error("Assessment ID wajib diisi");
    }

    const redisKey = `assessment:${id}`;
    const data = await redisClient.get(redisKey);

    if (!data) {
      throw new Error("Assessment tidak ditemukan atau sudah kadaluarsa");
    }

    return JSON.parse(data);
  } catch (error) {
    throw error; 
  }
};

export const generateAssessmentsIframe = async (tutorial) => {
  try {
    // const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    // console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);
    // console.log("GEMINI MODEL:", process.env.MODEL);
    // console.log("SDK VERSION:", require("@google/generative-ai/package.json").version);

    const tutorialKey = `tutorial:${tutorial}`;
    let cachedTutorial = await redisClient.get(tutorialKey);
 
    cachedTutorial = cleanHtmlContent(cachedTutorial);

    if (!cachedTutorial) {
      throw new Error("Materi tutorial tidak ditemukan atau kosong.");
    }

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
      result = await generateAI(prompt);
    } catch (apiErr) {
      console.error("Gagal memanggil Gemini API:", apiErr.message);
      throw new Error("Gagal menghubungi Gemini API — coba beberapa saat lagi.");
    }

    if (!result || typeof result !== "string") {
      throw new Error("Respons dari Gemini API tidak valid (bukan string).");
    }

    let text = result.replace(/```json|```/g, "").trim();

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

    const remaining = data.slice(1); 

    const redisKey = `assessment:${nanoid(6)}`;
    await redisClient.set(redisKey, JSON.stringify(remaining), { EX: 7200 });

    const time = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour12: false,
    });

    console.log(`[AI] generate soal : ${tutorial} | Time: ${time}`);

    return {
      key: redisKey,
      materi_key: tutorialKey,
      data: remaining,
    };
  } catch (err) {
    return err.message;
  }
};