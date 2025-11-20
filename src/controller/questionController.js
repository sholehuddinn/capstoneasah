import { getQuestionsByUserService } from "../services/questionServive";

export const getQuestionsByUser = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "Unauthorized"
      });
    }

    const result = await getQuestionsByUserService(user_id);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.json(result);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server.",
      details: err.message
    });
  }
};
