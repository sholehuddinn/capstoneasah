import {
  createUser,
  findUserByUsername,
  verifyUser,
} from "../services/userService.js";
import { getPreference } from "../services/preferenceService.js";
import { getProgress } from "../services/progressService.js";
import { generateToken } from "../utils/token.js";

export const registerUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res
        .status(400)
        .json({
          success: false,
          error: "name, username, dan password wajib diisi",
        });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    const newUser = await createUser(name, username, password);
    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: "Internal server error",
        details: error.message,
      });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, error: "username dan password wajib diisi" });
    }

    const user = await verifyUser(username, password);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid username or password" });
    }

    const token = generateToken({ id: user.id, username: user.username, name: user.name });
    user.token = token;

    const preference = await getPreference(user.id);
    const ServiceGetProgress = await getProgress(user.id);

    return res.status(200).json({ 
      success: true,
      message: "Login berhasil",
      user: user,
      preference: preference,
      progress: ServiceGetProgress
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: "Internal server error",
        details: error.message,
      });
  }
};

export const getProfile = async (req, res) => {
  try {

    const preference = await getPreference(req.user.id);
    const ServiceGetProgress = await getProgress(req.user.id);

    res.status(200).json({
      success: true,
      message: "Data profil berhasil diambil",
      user: req.user,
      preference: preference,
      progress: ServiceGetProgress
    });
  } catch (err) {
    res.json({ error: err.message })
  }
};
