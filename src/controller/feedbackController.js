import { submitFeedback } from "../services/feedbackService.js";

export const handleFeedback = async (req, res) => {
  try {
    const { assessment_id, tutorial_id } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Body harus berisi 'answers' dalam bentuk array.",
      });
    }

    const assessmentKey = `assessment:${assessment_id}`;
    const tutorialKey = `tutorial:${tutorial_id}`;

    const result = await submitFeedback(assessmentKey, tutorialKey, answers);

    if (result.expired) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback berhasil dibuat berdasarkan materi pembelajaran.",
      assessment_key: assessmentKey,
      tutorial_key: tutorialKey,
      score: result.score,
      benar: result.benar,
      total: result.total,
      topik: result.topik,
      lama_mengerjakan: result.lama_mengerjakan,
      feedback: result.feedback,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Gagal membuat feedback.",
      details: err.message,
    });
  }
};
