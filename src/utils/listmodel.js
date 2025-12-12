import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function listModels() {
  try {
    const res = await ai.models.listModels(); // method name sesuai SDK
    console.log("Available models:");
    res.models?.forEach(m => {
      console.log("-", m.name, "| supports:", m.supportedMethods?.join(", ") || "unknown");
    });
    return res.models || [];
  } catch (err) {
    console.error("ListModels error:", err);
    throw err;
  }
}

export default listModels