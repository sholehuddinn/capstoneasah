import { getPreferenceByUserId, updatePreference } from '../models/preference'

export const getPreference = async (user_id) => {
  try {

    const result = await getPreferenceByUserId(user_id);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export const editPreference = async (userId, updates) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("No data provided for update");
    }

    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }

    const result = await updatePreference(fields, values, userId);

    if (result.rowCount === 0) {
      throw new Error("Preference not found for this user");
    }

    return result.rows[0];

  } catch (error) {
    console.error("Error in editPreference:", error.message);
    throw error;
  }
};
