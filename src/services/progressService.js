import {
  updateProgress,
  resetProgress,
  verifyProgress,
  findProgressByUserId,
} from "../models/progress.js";
import { deleteQuestion } from "../models/question.js";

export const updateUserProgress = async (user_id, tutorial_id) => {
  try {
    const allowed = await verifyProgress(user_id, tutorial_id);
    if (!allowed) {
      throw new Error(
        "Tidak bisa mengambil tutorial ini karena urutan sebelumnya belum selesai."
      );
    }

    if (!tutorial_id) {
      throw new Error("Materi ID tidak boleh kosong.");
    }

    const result = await updateProgress(user_id, tutorial_id);
    return result;
  } catch (error) {
    throw new Error("Gagal update progress: " + error.message);
  }
};

export const getProgress = async (user_id) => {
  try {
    const progress = await findProgressByUserId(user_id);

    if (!progress) {
      throw new Error("Progress user tidak ditemukan.");
    }

    return progress;
  } catch (error) {
    console.error("Service getProgress:", error.message);
    throw error;
  }
};

export const resetUserProgress = async (user_id) => {
  try {
    const result = await resetProgress(user_id);
    deleteQuestion(user_id);
    return result;
  } catch (error) {
    throw new Error("Gagal reset progress: " + error.message);
  }
};
