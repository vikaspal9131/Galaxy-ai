import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigError } from "./errors";

export function getGeminiModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new ConfigError("GEMINI_API_KEY missing");
  }

  const genAI = new GoogleGenerativeAI(key);

  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048

    },
  });
}
