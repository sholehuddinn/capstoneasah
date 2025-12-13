import {
  createCredentials,
  updateCredentials,
  getCredentialsByName,
} from "../models/credentials";

export const createCredentialsService = async (payload) => {
  if (!payload?.name || !payload?.credentials) {
    throw new Error("Name dan credentials wajib diisi");
  }

  const existing = await getCredentialsByName(payload.name);
  if (existing) {
    throw new Error("Credentials dengan nama tersebut sudah ada");
  }

  return await createCredentials(payload);
};

export const updateCredentialsService = async (name, payload) => {
  if (!name) {
    throw new Error("Name credentials wajib diisi");
  }

  if (!payload?.credentials) {
    throw new Error("Credentials wajib diisi");
  }

  const updated = await updateCredentials(name, payload);

  const time = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour12: false,
    });

  console.log(`[KEY] di ganti | Time: ${time}`);

  if (!updated) {
    throw new Error("Credentials tidak ditemukan");
  }

  return updated;
};

export const getCredentialsByNameService = async (name) => {
  if (!name) {
    throw new Error("Name wajib diisi");
  }

  const data = await getCredentialsByName(name);

  if (!data) {
    throw new Error("Credentials tidak ditemukan");
  }

  return data;
};
