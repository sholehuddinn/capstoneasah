import {
  createCredentialsService,
  updateCredentialsService,
} from "../services/credentialsService";

export const createCredentialsController = async (req, res) => {
  try {
    await createCredentialsService(req.body);

    return res.status(201).json({
      success: true,
      message: "Credentials berhasil dibuat",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCredentialsController = async (req, res) => {
  try {
    const { name, credentials } = req.body;

    await updateCredentialsService(name, { credentials });

    return res.status(200).json({
      success: true,
      message: "Credentials berhasil diperbarui",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
