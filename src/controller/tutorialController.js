import { fetchTutorialId, fetchTutorials } from "../services/tutorialService";

export const getTutorials = async (req, res) => {
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
    const tutorial = await fetchTutorialId(id);

    res.status(200).json(tutorial);

  } catch (error) {

    res.status(500).json({
      success: false,
      error: "Gagal mengambil data tutorial.",
      details: error.message,
    });

  }
}