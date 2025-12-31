import { useEffect, useRef } from "react";
import { loadWorkflow } from "@/services/workflow.service";
import { useFlowStore } from "@/store/flow.store";

export function useLoadWorkflow() {
  const { resetFlow } = useFlowStore();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    (async () => {
      const res = await loadWorkflow();

      if (res.data) {
        resetFlow(
          res.data.nodes || [],
          res.data.edges || [],
          res.data.name || "Untitled"
        );
      }

      isInitialLoad.current = false;
    })();
  }, [resetFlow]);

  return isInitialLoad;
}
