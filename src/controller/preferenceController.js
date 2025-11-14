import { editPreference } from "../services/preferenceService.js";

export const editPreferenceController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID tidak ditemukan dari token",
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data preference yang dikirim",
      });
    }

    const updatedPreference = await editPreference(userId, updates);

    return res.status(200).json({
      success: true,
      message: "Preference berhasil diperbarui",
      preference: updatedPreference,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
