import { db } from "../config/db.js";
import { nanoid } from "nanoid";

export const createPreference = async (user_id) => {
  try {
    const id = nanoid(10);

    await db.query(`INSERT INTO preference (id, user_id) VALUES ($1, $2)`, [
      id,
      user_id,
    ]);

    return true;
  } catch (error) {
    return error.message;
  }
};

export const getPreferenceByUserId = async (user_id) => {
  try {
    const result = db.query(`SELECT * FROM preference WHERE user_id = $1`, [
      user_id
    ]);

    return result;

  } catch (error) {
    return error.message;
  }
};

export const updatePreference = async (fields, values, userId) => {
  try {
    const setQuery = fields.join(", ");
    const index = values.length + 1; 

    const query = `
      UPDATE preference
      SET ${setQuery}
      WHERE user_id = $${index}
      RETURNING *;
    `;

    const result = await db.query(query, [...values, userId]);
    return result;
  } catch (error) {
    console.error("Error in updatePreference:", error);
    throw error;
  }
};