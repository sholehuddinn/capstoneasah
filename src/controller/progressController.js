import {
  updateUserProgress,
  resetUserProgress
} from "../services/progressService.js";

export const updateProgressController = async (req, res) => {
  try {
    const { tutorial_id } = req.params;
    const user_id = req.user?.id;

    if (!user_id || !tutorial_id) {
      return res.status(400).json({
        success: false,
        error: "Unauthorized dan tutorial_id wajib diisi.",
      });
    }

    const result = await updateUserProgress(user_id, tutorial_id);

    return res.json({
      success: true,
      message: `Progress tutorial ${tutorial_id} berhasil diperbarui.`,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const resetProgressController = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await resetUserProgress(user_id);

    return res.json({
      success: true,
      message: "Progress dan soal yang di kumpulkan berhasil di-reset.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
