"use client";

import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./config/nodeTypes";
import { edgeTypes } from "./config/edgeTypes";
import { CanvasToolbar } from "./CanvasToolbar";
import { useFlowStore } from "@/store/flow.store";
import { useLoadWorkflow } from "@/hooks/useLoadWorkflow";
import { useAutosaveWorkflow } from "@/hooks/useAutosaveWorkflow";
import { useFlowHandlers } from "@/hooks/useFlowHandlers";
import { useNodeDrop } from "@/hooks/useNodeDrop";
import { isValidConnectionFactory } from "./validation/connectionRules";
import { WorkflowTitle } from "./WorkflowTitle";

export function CanvasInner() {
  const { nodes, edges } = useFlowStore();

  const isInitialLoad = useLoadWorkflow();
  useAutosaveWorkflow(nodes, edges, !isInitialLoad.current);

  const { onDrop } = useNodeDrop();
  const { onConnect, onReconnect, onNodesChange, onEdgesChange } =
    useFlowHandlers();

  const isValidConnection = isValidConnectionFactory((id) =>
    nodes.find((n) => n.id === id)
  );

  return (
    <div
      className="w-full h-screen bg-[#0E0E13]"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        minZoom={0.05}
        maxZoom={5}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        onReconnect={onReconnect}
        edgesReconnectable
        elementsSelectable
        isValidConnection={isValidConnection}
        deleteKeyCode={["Backspace", "Delete"]}
      >
        <Background gap={20} size={1} color="#615D68" />
        <Controls />
        <MiniMap
          pannable
          zoomable
          style={{
            backgroundColor: "#212126",
            width: 120,
            height: 100,
          }}
        />
        <div className="absolute left-50 top-7 -translate-x-1/2 z-50 rounded border border-[#2f2f35] bg-[#212126] px-2 py-1 shadow-lg w-50 h-10 flex items-center justify-start">
          <WorkflowTitle />
        </div>
        <CanvasToolbar />
      </ReactFlow>
    </div>
  );
}
