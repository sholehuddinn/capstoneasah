import { redisClient } from "../config/redis.js";
import { generateAI } from "./generateAiService.js";

export const submitFeedback = async (assessmentKey, tutorialKey, answers) => {
  try {
    const rawSoal = await redisClient.get(assessmentKey);
    if (!rawSoal) {
      throw new Error("Soal tidak ditemukan atau sudah kedaluwarsa.");
    }

    const rawMateri = await redisClient.get(tutorialKey);
    if (!rawMateri) {
      throw new Error("Materi tidak ditemukan.");
    }

    const soalData = JSON.parse(rawSoal);
    const materiData = JSON.parse(rawMateri);

    const isExpired = Date.now() > new Date(soalData[0].expires_at).getTime();
    if (isExpired) {
      return {
        expired: true,
        message: "Soal kedaluwarsa, silakan ambil learncheck lagi.",
      };
    }

    const total = soalData.length;
    const benar = answers.filter((a) => {
      const soal = soalData.find((s) => s.id === a.soal_id);
      return soal && soal.multiple_choice.some((m) => m.correct === a.correct && m.correct);
    }).length;

    const score = ((benar / total) * 100).toFixed(2);

    const createdAt = new Date(soalData[0].created_at).getTime();
    const elapsedSeconds = Math.floor((Date.now() - createdAt) / 1000);
    const lamaMengerjakan =
      elapsedSeconds < 0 || isNaN(elapsedSeconds)
        ? "<tidak diketahui>"
        : `${elapsedSeconds} detik`;

    const prompt = `
Materi pembelajaran siswa:
${materiData.isi || materiData.text || JSON.stringify(materiData)}

Berdasarkan hasil asesmen siswa berikut:
- Jumlah soal: ${total}
- Jawaban benar: ${benar}
- Skor: ${score}%

Berikan umpan balik pembelajaran yang relevan dengan materi di atas.
Gunakan format JSON berikut:
{
  "summary": "Ringkasan hasil belajar berdasarkan materi",
  "analysis": "Analisis area yang sudah dan belum dikuasai berdasarkan materi",
  "advice": "Saran konkret untuk meningkatkan pemahaman",
  "recommendation": "Rekomendasi materi tambahan atau aktivitas belajar"
}

Output hanya JSON valid tanpa tambahan teks lain.
`;

    let text;
    try {
      text = await generateAI(prompt); // ✅ REST API, hasil STRING
    } catch (err) {
      throw new Error("Gagal menghubungi Gemini API untuk feedback.");
    }

    let parsedFeedback;
    try {
      parsedFeedback = JSON.parse(
        text.replace(/```json|```/g, "").trim()
      );
    } catch {
      parsedFeedback = {
        summary: "Asesmen selesai. Kamu menunjukkan pemahaman yang baik terhadap materi.",
        analysis: "Beberapa bagian dari materi masih bisa diperkuat, terutama yang bersifat konseptual.",
        advice: "Pelajari ulang bagian yang kurang dikuasai dan coba pahami melalui contoh nyata.",
        recommendation: "Baca ulang materi dan cari contoh penerapan di dokumentasi resmi.",
      };
    }

    const feedbackKey = `feedback:${assessmentKey}:${tutorialKey}`;
    const feedbackData = {
      feedbackKey,
      redis_key: assessmentKey,
      materi_key: tutorialKey,
      score: Number(score),
      benar,
      total,
      lama_mengerjakan: lamaMengerjakan,
      feedback: parsedFeedback,
      created_at: new Date().toISOString(),
      expires_at: Date.now() + 3600000,
    };

    await redisClient.set(feedbackKey, JSON.stringify(feedbackData), { EX: 3600 });

    return feedbackData;
  } catch (err) {
    throw err;
  }
};
