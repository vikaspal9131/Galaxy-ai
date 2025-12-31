import { useEffect, useRef } from "react";
import { saveWorkflow } from "@/services/workflow.service";

export function useAutosaveWorkflow(
  nodes: any,
  edges: any,
  enabled: boolean
) {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      saveWorkflow(nodes, edges);
    }, 1500);
  }, [nodes, edges, enabled]);
}
