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

const VALID_IDS = [
  35363, 35368, 35373, 35378, 35383,
  35398, 35403, 35793, 35408, 35428
];

export const getTutorialId = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) return {};
    
    if (!VALID_IDS.includes(Number(id))) {
      res.status(200).json({
        succes: false,
        message : "ID salah",
        data: {}
      });
    }

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