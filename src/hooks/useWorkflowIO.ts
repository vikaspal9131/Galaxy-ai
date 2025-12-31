import { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";

export function useWorkflowIO(
  workflowName: string,
  nodes: Node[],
  edges: Edge[],
  resetFlow: (nodes: Node[], edges: Edge[], name?: string) => void,
  onImport?: () => void
) {
  const exportWorkflow = useCallback(() => {
    const name = workflowName?.trim() || "Untitled";

    const data = {
      name,
      nodes,
      edges,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${name}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }, [workflowName, nodes, edges]);

  const importWorkflow = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".json")) {
        alert("Please import a JSON file");
        return;
      }

      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
        alert("Invalid workflow file");
        return;
      }

      resetFlow(data.nodes, data.edges, data.name || "Untitled");
      onImport?.();
    },
    [resetFlow, onImport]
  );

  return { importWorkflow, exportWorkflow };
}
