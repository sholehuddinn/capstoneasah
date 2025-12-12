import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function generateAI(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt
    });

    return response.text;
  } catch (err) {
    console.error("REST Gemini Error:", err);
    throw new Error("Gagal menghubungi Gemini API.");
  }
}
