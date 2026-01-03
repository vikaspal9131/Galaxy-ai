export function stripMarkdown(text: string) {
  if (!text) return "";

  return text
    // keep code content, remove only ``` fences
    .replace(/```[\w]*\n([\s\S]*?)```/g, "$1")

    // inline code
    .replace(/`([^`]+)`/g, "$1")

    // headings
    .replace(/^#{1,6}\s+/gm, "")

    // bold / italic
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")

    // lists
    .replace(/^\s*[-+*]\s+/gm, "")

    // blockquotes
    .replace(/^\s*>+\s?/gm, "")

    // horizontal rules
    .replace(/^\s*[-*_]{3,}\s*$/gm, "");

   
}
