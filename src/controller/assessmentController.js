import { generateAssessments } from "../services/assessmentService.js";

export const createAssessment = async (req, res) => {
  try {
    const { tutorial_id } = req.params;

    const result = await generateAssessments(tutorial_id);

    return res.status(200).json({
      success: true,
      message: `Berhasil generate ${result.count} soal.`,
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
