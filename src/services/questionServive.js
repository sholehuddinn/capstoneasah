import { findByUser } from "../models/question.js";

export const getQuestionsByUserService = async (user_id) => {
  try {
    const questions = await findByUser(user_id);

    const sanitized = questions.map(q => {
      const { answer, ...rest } = q;
      return rest;
    });

    return {
      success: true,
      data: sanitized
    };
  } catch (err) {
    return {
      success: false,
      error: "Gagal mengambil data question.",
      details: err.message
    };
  }
};