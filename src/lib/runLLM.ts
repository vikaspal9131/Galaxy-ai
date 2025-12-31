import axios from "axios";

export async function runLLM({
  nodes,
  edges,
  llmNodeId,
}: {
  nodes: any[];
  edges: any[];
  llmNodeId: string;
}) {
  let systemPrompt: string | undefined;
  const inputs: any[] = [];

  const incomingEdges = edges.filter((e) => e.target === llmNodeId);

  for (const edge of incomingEdges) {
    const node = nodes.find((n) => n.id === edge.source);
    if (!node) continue;

    if (
      node.type === "textNode" &&
      node.data?.role === "system" &&
      typeof node.data.value === "string"
    ) {
      systemPrompt = node.data.value;
      continue;
    }

    if (node.type === "textNode" && typeof node.data.value === "string") {
      inputs.push({
        type: "text",
        value: node.data.value,
      });
    }

    if (node.type === "imageNode" && typeof node.data.base64 === "string") {
      inputs.push({
        type: "image",
        mimeType: node.data.mimeType,
        data: node.data.base64,
      });
    }
  }

  if (inputs.length === 0) {
    throw new Error("No valid inputs connected to LLM node");
  }

  const payload = {
    inputs,
    ...(systemPrompt ? { systemPrompt } : {}),
  };

  console.log("FINAL PAYLOAD:", payload);

  const res = await axios.post("/api/llm", payload);
  return res.data;
}
