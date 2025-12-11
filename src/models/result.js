import { db } from "../config/db";

export const createResult = async (data) => {
  const query = `
    INSERT INTO result
      (id, user_id, question_id, answer, is_true)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    data.id,
    data.user_id,
    data.question_id,
    data.answer,
    data.is_true,
  ];

  const res = await db.query(query, values);
  return res.rows[0];
};

export const findResultByQuestion = async (user_id, question_id) => {
  const query = `
    SELECT * FROM result
    WHERE user_id = $1 AND question_id = $2
    LIMIT 1;
  `;

  const res = await db.query(query, [user_id, question_id]);
  return res.rows[0];
};

export const findResultByUser = async (user_id) => {
  const res = await db.query(
    `SELECT * FROM result WHERE user_id = $1 ORDER BY id ASC`,
    [user_id]
  );

  return res.rows;
};
