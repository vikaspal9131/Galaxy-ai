"use client";

import { ReactFlowProvider } from "@xyflow/react";

import Sidebar from "../sidebar/Sidebar";
import { FlowKeyboard } from "./FlowKeyboard";
import { CanvasInner } from "./CanvasInner";

import { useFlowStore } from "@/store/flow.store";
import { useWorkflowIO } from "@/hooks/useWorkflowIO";

export function CanvasArea() {
  const { name, nodes, edges, resetFlow } = useFlowStore();

  const { importWorkflow, exportWorkflow } = useWorkflowIO(
    name,
    nodes,
    edges,
    resetFlow
  );

  return (
    <ReactFlowProvider>
      <Sidebar
        onImportWorkflow={importWorkflow}
        onExportWorkflow={exportWorkflow}
      />
      <FlowKeyboard />
      <CanvasInner />
    </ReactFlowProvider>
  );
}
