import type { LLMInput } from "./types";

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export function buildGeminiParts(inputs: LLMInput[]): GeminiPart[] {
  const parts: GeminiPart[] = [];

  for (const input of inputs) {
  
    if (input.type === "system") {
      parts.push({
        text: `SYSTEM INSTRUCTIONS:\n${input.value}`,
      });
    }

 
    if (input.type === "text") {
      parts.push({
        text: input.value,
      });
    }

  
    if (input.type === "image") {
      parts.push({
        inlineData: {
          mimeType: input.mimeType,
          data: input.data.includes(",")
            ? input.data.split(",")[1]
            : input.data,
        },
      });
    }
  }

  if (!parts.length) {
    throw new Error("No Gemini parts built");
  }

  return parts;
}
