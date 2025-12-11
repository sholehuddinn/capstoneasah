import { findOne } from "../models/question.js";
import { createResult, findResultByQuestion } from "../models/result.js";
import { nanoid } from 'nanoid';

export const answerQuestion = async (user_id, question_id, user_answer) => {
  const question = await db.query(
    `SELECT * FROM question WHERE id = $1 LIMIT 1`,
    [question_id]
  );

  if (!question.rows.length) {
    throw new Error("Soal tidak ditemukan");
  }

  const q = question.rows[0];

  const existing = await findResultByQuestion(user_id, question_id);
  if (existing) {
    return {
      message: "Soal sudah pernah dijawab!",
      data: existing,
    };
  }

  const isCorrect = q.answer === user_answer;

  const create = await createResult({
    id: nanoid(10),
    user_id,
    question_id,
    answer: user_answer,
    is_true: isCorrect,
  });

  return {
    message: isCorrect ? "Jawaban benar!" : "Jawaban salah!",
    correct: isCorrect,
    data: create,
  };
};
