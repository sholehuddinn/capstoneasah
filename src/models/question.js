import { db } from "../config/db";

export const createQuestion = async (data) => {
  const query = `
      INSERT INTO question 
        (id, user_id, tutorial_id, assessment, option_1, option_2, option_3, option_4, answer)
      VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;

  const values = [
    data.id,
    data.user_id,
    data.tutorial_id,
    data.assessment,
    data.option_1,
    data.option_2,
    data.option_3,
    data.option_4,
    data.answer,
  ];

  const res = await db.query(query, values);
  return res.rows[0];
};

export const findOne = async (user_id, tutorial_id) => {
  const res = await db.query(
    `SELECT * FROM question 
     WHERE user_id = $1 
       AND tutorial_id = $2
     LIMIT 1`,
    [user_id, tutorial_id]
  );
  return res.rows[0];
};

export const findByUser = async (user_id) => {
  const res = await db.query(
    `SELECT * FROM question 
     WHERE user_id = $1 
     ORDER BY id ASC`,
    [user_id]
  );
  return res.rows;
};

export const deleteQuestion = async (user_id) => {
  await db.query(`DELETE FROM question WHERE user_id = $1`, [user_id]);
  return true;
};

export const findTutorialByUser = async (user_id) => {
  const res = await db.query(
    `SELECT tutorial_id 
     FROM question 
     WHERE user_id = $1 
     LIMIT 1`,
    [user_id]
  );
  return res.rows[0]?.tutorial_id || null;
};
