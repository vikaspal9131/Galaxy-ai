import type { Node, Edge } from "@xyflow/react";
import { api } from "@/lib/axios";

type Args = {
  nodes: Node[];
  edges: Edge[];
  llmNodeId: string;
};

export async function runLLMAndUpdateTextNode({
  nodes,
  edges,
  llmNodeId,
}: Args): Promise<string> {
  const inputs: any[] = [];

  const incoming = edges.filter((e) => e.target === llmNodeId);

  for (const e of incoming) {
    const src = nodes.find((n) => n.id === e.source);
    if (!src) continue;

    if (e.targetHandle === "system" && src.data?.value) {
      inputs.push({ type: "system", value: src.data.value });
    }

    if (e.targetHandle === "user" && src.data?.value) {
      inputs.push({ type: "text", value: src.data.value });
    }

    if (e.targetHandle === "image" && src.data?.mimeType && src.data?.base64) {
      inputs.push({
        type: "image",
        mimeType: src.data.mimeType,
        data: src.data.base64,
      });
    }

    if (src.type === "llmNode" && src.data?.output) {
      inputs.push({ type: "text", value: src.data.output });
    }
  }

  if (!inputs.length) {
    throw new Error("No inputs connected");
  }

  const res = await api.post("/llm", { inputs });
  const output = res.data?.output;

  if (!output) throw new Error("Empty LLM output");

  return output;
}