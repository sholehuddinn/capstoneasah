import { fetchTutorialId, fetchTutorials } from "../services/tutorialService";
import { updateUserProgress } from "../services/progressService";

export const getTutorials = async (_req, res) => {
  try {
    const tutorials = await fetchTutorials();
    res.status(200).json(tutorials);
  } catch (error) {

    res.status(500).json({
      success: false,
      error: "Gagal mengambil data tutorial.",
      details: error.message,
    });

  }
};

export const getTutorialId = async (req, res) => {
  try {

    const { id } = req.params;
    const user_id = req.user?.id;
    const tutorial = await fetchTutorialId(id);

    const result = await updateUserProgress(user_id, id);

    res.status(200).json({
      tutorial: tutorial,
      progress: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: "Gagal mengambil data tutorial.",
      details: error.message,
    });

  }
}