import { db } from "../config/db.js";
import { nanoid } from "nanoid";

export const tutorialOrder = [
  "35363",
  "35368",
  "35373",
  "35378",
  "35383",
  "35398",
  "35403",
  "35408",
  "35428",
  "35793"
];

export const findProgressByUserId = async (user_id) => {
  try {
    const query = `
      SELECT *
      FROM progress
      WHERE user_id = $1
      LIMIT 1
    `;

    const result = await db.query(query, [user_id]);

    if (result.rowCount === 0) {
      throw new Error("Progress user tidak ditemukan.");
    }

    return result.rows[0];

  } catch (error) {
    console.error("Error getProgress:", error.message);
    return null;
  }
};

export const createProgress = async (user_id) => {
  try {
    const id = nanoid(10);

    await db.query(
      `INSERT INTO progress (id, user_id)
       VALUES ($1, $2)`,
      [id, user_id]
    );

    return true;
  } catch (error) {
    console.error("Error createProgress:", error.message);
    return error.message;
  }
};

export const verifyProgress = async (user_id, tutorial_id) => {
  try {
    const tutorial = String(tutorial_id);
    const index = tutorialOrder.indexOf(tutorial);

    if (index === -1) {
      throw new Error("Tutorial tidak ditemukan dalam urutan.");
    }

    if (index === 0) return true;

    const previousTutorial = tutorialOrder[index - 1];

    const result = await db.query(
      `SELECT "${previousTutorial}"
       FROM progress
       WHERE user_id = $1`,
      [user_id]
    );

    if (result.rowCount === 0) {
      throw new Error("User tidak memiliki progress.");
    }

    if (result.rows[0][previousTutorial] !== true) {
      return false;
    }

    return true;

  } catch (error) {
    console.error("Error verifyProgress:", error.message);
    return false;
  }
};

export const updateProgress = async (user_id, tutorial_id) => {
  try {
    if (isNaN(tutorial_id)) {
      throw new Error("Materi ID harus angka.");
    }

    const allowed = await verifyProgress(user_id, tutorial_id);
    if (!allowed) {
      throw new Error("Tidak bisa mengambil tutorial ini karena urutan sebelumnya belum selesai.");
    }

    const query = `
      UPDATE progress
      SET "${tutorial_id}" = CASE
          WHEN "${tutorial_id}" = false THEN true
          ELSE "${tutorial_id}"
      END
      WHERE user_id = $1
      RETURNING *;
    `;

    const result = await db.query(query, [user_id]);

    if (result.rowCount === 0) {
      throw new Error("User tidak memiliki progress.");
    }

    return result.rows[0];

  } catch (error) {
    console.error("Error updateProgress:", error.message);
    return error.message;
  }
};

export const resetProgress = async (user_id) => {
  try {
    const query = `
      UPDATE progress
      SET 
        "35363" = false,
        "35368" = false,
        "35373" = false,
        "35378" = false,
        "35383" = false,
        "35398" = false,
        "35403" = false,
        "35408" = false,
        "35428" = false,
        "35793" = false
      WHERE user_id = $1
      RETURNING *;
    `;

    const result = await db.query(query, [user_id]);

    if (result.rowCount === 0) {
      throw new Error("User tidak memiliki progress.");
    }

    return result.rows[0];

  } catch (error) {
    console.error("Error resetProgress:", error.message);
    return error.message;
  }
};
