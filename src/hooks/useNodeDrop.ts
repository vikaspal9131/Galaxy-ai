import { useReactFlow } from "@xyflow/react";
import { generateNodeId } from "@/lib/id";
import { useFlowStore } from "@/store/flow.store";

export function useNodeDrop() {
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, setFlow } = useFlowStore();

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    if (!type) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    setFlow(
      [...nodes, { id: generateNodeId(), type, position, data: {} }],
      edges,
      true
    );
  };

  return { onDrop };
}
