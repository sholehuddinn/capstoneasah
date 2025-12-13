import { db } from "../config/db";
import { nanoid } from 'nanoid';

export const createExplanationModel = async ({
  question_id,
  explanation_1 = null,
  explanation_2 = null,
  explanation_3 = null,
  explanation_4 = null,
}) => {
  try {
    const id = nanoid();

    const query = `
      INSERT INTO question_explanations (
        id,
        question_id,
        explanation_1,
        explanation_2,
        explanation_3,
        explanation_4
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      id,
      question_id,
      explanation_1,
      explanation_2,
      explanation_3,
      explanation_4,
    ];

    const { rows } = await db.query(query, values);

    return rows[0];
  } catch (error) {
    console.error("Error createExplanationModel:", error);
    throw error;
  }
};

export const getExplanationByQuestionIdModel = async (question_id) => {
  try {
    const query = `
      SELECT *
      FROM question_explanations
      WHERE question_id = $1
      LIMIT 1;
    `;

    const { rows } = await db.query(query, [question_id]);

    return rows[0] || null;
  } catch (error) {
    console.error("Error getExplanationByQuestionIdModel:", error);
    throw error;
  }
};
