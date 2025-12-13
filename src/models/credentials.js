import { db } from "../config/db.js";
import { nanoid } from "nanoid";

export const createCredentials = async (data) => {
  try {
    const { name, credentials } = data;

    const id = nanoid(36);

    const query = `
    INSERT INTO credentials (id, name, credentials)
    VALUES ($1, $2, $3)
    RETURNING *
    `;

    const values = [id, name, credentials];

    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

export const updateCredentials = async (name, data) => {
  try {
    const { credentials } = data;

    const query = `
      UPDATE credentials
      SET
        credentials = $1
      WHERE name = $2
      RETURNING *
    `;

    const values = [credentials, name];

    const result = await db.query(query, values);

    return result.rows[0] ?? null;
  } catch (error) {
    throw error;
  }
};

export const getCredentialsByName = async (name) => {
  try {
    const query = `
    SELECT *
    FROM credentials
    WHERE name = $1
    LIMIT 1
    `;

    const result = await db.query(query, [name]);
    return result.rows[0] ?? null;
  } catch (error) {
    return error.message;
  }
};
