export type TextInput = {
  type: "text";
  value: string;
};

export type ImageInput = {
  type: "image";
  mimeType: "image/png" | "image/jpeg" | "image/jpg" | "image/webp";
  data: string;
};

export type SystemInput = {
  type: "system";
  value: string;
};

export type LLMInput = TextInput | ImageInput | SystemInput;
