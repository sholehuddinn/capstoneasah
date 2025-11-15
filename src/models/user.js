import { db } from "../config/db.js";
import { nanoid } from "nanoid";

export const findByUsernameModel = async (username) => {
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0] || null; 
  } catch (err) {
    throw err;
  }
};

export const create = async (name, username, hashedPassword) => {
  try {
    const id = nanoid(10);

    const result = await db.query(
      `INSERT INTO users (id, name, username, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, username, created_at`,
      [id, name, username, hashedPassword]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};
