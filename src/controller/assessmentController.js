import { generateAssessments, getAssessmentId } from "../services/assessmentService.js";
// import { verifyProgress } from "../models/progress.js";

export const createAssessment = async (req, res) => {
  try {
    const { tutorial_id } = req.params;
    const user_id = req.user.id;

    // const verif = await verifyProgress(user_id, tutorial_id);
    //  if (!verif) {
    //   return res.status(403).json({
    //     success: false,
    //     error: "Kamu belum menyelesaikan tutorial sebelumnya.",
    //   });
    // }

    const result = await generateAssessments(tutorial_id, user_id);

    return res.status(200).json({
      success: true,
      assessment_id: result.key,
      materi_id: result.materi_key,
      expires_in: "120s",
      total: result.count,
      data: result.data,
    });
  } catch (err) {
    console.error("Error di controller:", err);

    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan saat membuat asesmen.",
      details: err.message || "Unknown error",
    });
  }
};

export const getAssessmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await getAssessmentId(id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
