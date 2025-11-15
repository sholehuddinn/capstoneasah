import { updateProgress, resetProgress, verifyProgress } from "../models/progress.js";

export const updateUserProgress = async (user_id, tutorial_id) => {
  try {
    const allowed = await verifyProgress(user_id, tutorial_id);
    if (!allowed) {
      throw new Error("Tidak bisa mengambil tutorial ini karena urutan sebelumnya belum selesai.");
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

export const resetUserProgress = async (user_id) => {
  try {
    const result = await resetProgress(user_id);
    return result;
  } catch (error) {
    throw new Error("Gagal reset progress: " + error.message);
  }
};
