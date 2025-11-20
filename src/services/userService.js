import bcrypt from "bcryptjs";
import { create, findByUsernameModel } from "../models/user.js";
import { createPreference } from "../models/preference.js";
import { createProgress } from "../models/progress.js";

export const findUserByUsername = async (username) => {
  try {
    return await findByUsernameModel(username); 
  } catch (error) {
    throw error;
  }
};

export const createUser = async (name, username, password) => {
  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = await create(name, username, hashed);

    await createPreference(user.id);
    await createProgress(user.id)

    return user;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (username, plainPassword) => {
  try {
    const user = await findByUsernameModel(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(plainPassword, user.password);
    if (!isValid) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    throw error;
  }
};
