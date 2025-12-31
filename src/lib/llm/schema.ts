import { z } from "zod";

const TextInputSchema = z.object({
  type: z.literal("text"),
  value: z.string().min(1, "Text cannot be empty"),
});

const ImageInputSchema = z.object({
  type: z.literal("image"),
  mimeType: z.enum(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
  data: z.string().min(1, "Image data required"),
});

const SystemPromptSchema = z.object({
  type: z.literal("system"),
  value: z.string().min(1, "System prompt cannot be empty"),
});

export const LLMInputSchema = z.discriminatedUnion("type", [
  TextInputSchema,
  ImageInputSchema,
  SystemPromptSchema,
]);

export const LLMRequestSchema = z
  .object({
    inputs: z.array(LLMInputSchema).min(1),
  })
  .superRefine((data, ctx) => {
    const hasText = data.inputs.some((i) => i.type === "text");

    if (!hasText) {
      ctx.addIssue({
        path: ["inputs"],
        message: "At least one text input is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });
