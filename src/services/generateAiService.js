import { GoogleGenAI } from "@google/genai";
import { getCredentialsByNameService } from "./credentialsService.js";

export async function generateAI(prompt) {
  try {
    const credential = await getCredentialsByNameService("GEMINI_API_KEY");

    if (!credential?.credentials) {
      throw new Error("GEMINI API KEY tidak ditemukan");
    }

    const ai = new GoogleGenAI({
      apiKey: credential.credentials,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite-001",
      contents: prompt,
    });

    return response.text;
  } catch (err) {
    console.error("REST Gemini Error:", err);
    throw new Error("Gagal menghubungi Gemini API.");
  }
}
