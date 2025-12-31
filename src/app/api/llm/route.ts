import { NextResponse } from "next/server";
import { LLMRequestSchema } from "@/lib/llm/schema";
import { buildGeminiParts } from "@/lib/llm/payloadBuilder";
import { getGeminiModel } from "@/lib/llm/geminiClient";
import { ConfigError, LLMExecutionError } from "@/lib/llm/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LLMRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const model = getGeminiModel();
    const parts = buildGeminiParts(parsed.data.inputs);

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
      },
    });

    const candidate = result.response.candidates?.[0];
    let output = "";

    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (typeof part.text === "string") {
          output += part.text + "\n";
        }
      }
    }

    output = output.trim();

    return NextResponse.json({ output });
  } catch (err: any) {
    const message =
      typeof err?.message === "string" ? err.message.toLowerCase() : "";

    // 🔥 API LIMIT / QUOTA / RATE LIMIT
    if (
      message.includes("quota") ||
      message.includes("rate limit") ||
      message.includes("resource exhausted") ||
      message.includes("limit")
    ) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT",
          message:
            "API limit reached. Please wait for quota to refill and try again.",
        },
        { status: 429 }
      );
    }

    if (err instanceof ConfigError) {
      return NextResponse.json(
        { error: "CONFIG_ERROR", message: err.message },
        { status: 500 }
      );
    }

    if (err instanceof LLMExecutionError) {
      return NextResponse.json(
        {
          error: "LLM_ERROR",
          message:
            "The AI service is temporarily unavailable. Please try again later.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        error: "SERVER_ERROR",
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
