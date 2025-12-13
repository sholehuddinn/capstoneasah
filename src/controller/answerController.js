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
        `
        SELECT 
          q.assessment,
          q.option_1,
          q.option_2,
          q.option_3,
          q.option_4,
          q.answer,
          e.explanation_1,
          e.explanation_2,
          e.explanation_3,
          e.explanation_4
        FROM question q
        LEFT JOIN question_explanations e
          ON e.question_id = q.id
        WHERE q.id = $1
        LIMIT 1
        `,
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

      const row = q.rows[0];

      const explanationMap = {
        "1": row.explanation_1,
        "2": row.explanation_2,
        "3": row.explanation_3,
        "4": row.explanation_4,
      };

      const userExplanation = explanationMap[answer] || null;

      results.push({
        question_id,
        question: q.rows[0].assessment,
        options: {
          1: q.rows[0].option_1,
          2: q.rows[0].option_2,
          3: q.rows[0].option_3,
          4: q.rows[0].option_4,
        },
        user_answer: answer,
        correct_answer: correctAnswer,
        explanation_user: userExplanation,
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
