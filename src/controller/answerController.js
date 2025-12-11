import crypto from "crypto";
import { db } from "../config/db.js";
import { answerQuestion } from "../services/answerService.js";

export const submitBulkAnswer = async (req, res) => {
  try {
    const { answers } = req.body;

    const user_id = req.user.id;

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return res.status(403).json({
        error: "Akses ditolak: Anda wajib mengirim tepat 10 jawaban."
      });
    }

    const results = [];

    for (const item of answers) {
      const { question_id, answer } = item;

      const q = await db.query(
        `SELECT answer FROM question WHERE id = $1 LIMIT 1`,
        [question_id]
      );

      if (!q.rows.length) {
        return res.status(400).json({
          error: `Soal dengan ID ${question_id} tidak ditemukan`
        });
      }

      const correctAnswer = q.rows[0].answer;
      const isTrue = correctAnswer === answer;

      const saved = await answerQuestion(
        user_id,
        question_id,
        answer
      );

      results.push({
        question_id,
        user_answer: answer,
        correct_answer: correctAnswer,
        is_true: isTrue,
      });
    }

    return res.json({
      message: "10 jawaban berhasil diproses",
      results,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
