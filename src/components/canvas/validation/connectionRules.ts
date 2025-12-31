import type { Connection, Edge, Node } from "@xyflow/react";

type GetNode = (id: string) => Node | undefined;

export function isValidConnectionFactory(getNode: GetNode) {
  return (conn: Connection | Edge): boolean => {
    if ("id" in conn) return true;

    const { source, target, sourceHandle, targetHandle } = conn;

    if (!source || !target) return false;
    if (source === target) return false;

    const sourceNode = getNode(source);
    const targetNode = getNode(target);

    if (!sourceNode || !targetNode) return false;

    const sourceType = sourceNode.type;
    const targetType = targetNode.type;

    if (
      sourceType === "imageNode" &&
      sourceHandle === "image" &&
      targetType === "llmNode" &&
      targetHandle === "image"
    ) {
      return true;
    }

    if (sourceType === "imageNode") return false;

    if (targetType === "imageNode") return false;

    if (targetType === "llmNode" && targetHandle === "image") {
      return false;
    }

    if (
      sourceType === "textNode" &&
      sourceHandle === "output" &&
      targetType === "llmNode" &&
      (targetHandle === "system" || targetHandle === "user")
    ) {
      return true;
    }

    if (
      sourceType === "llmNode" &&
      sourceHandle === "output" &&
      targetType === "textNode" &&
      targetHandle === "input"
    ) {
      return true;
    }

    if (
      sourceType === "llmNode" &&
      sourceHandle === "output" &&
      targetType === "llmNode" &&
      (targetHandle === "system" || targetHandle === "user")
    ) {
      return true;
    }

    return false;
  };
}
