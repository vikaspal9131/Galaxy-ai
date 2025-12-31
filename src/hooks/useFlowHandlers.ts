import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  reconnectEdge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type Edge,
} from "@xyflow/react";
import { useFlowStore } from "@/store/flow.store";

export function useFlowHandlers() {
  const { nodes, edges, setFlow } = useFlowStore();

  const onConnect = (connection: Connection) => {
    setFlow(nodes, addEdge({ ...connection, type: "custom" }, edges), true);
  };

  const onReconnect = (oldEdge: Edge, newConnection: Connection) => {
    setFlow(nodes, reconnectEdge(oldEdge, newConnection, edges), true);
  };

  const onNodesChange = (changes: NodeChange[]) =>
    setFlow(applyNodeChanges(changes, nodes), edges, true);

  const onEdgesChange = (changes: EdgeChange[]) =>
    setFlow(nodes, applyEdgeChanges(changes, edges), true);

  return {
    onConnect,
    onReconnect,
    onNodesChange,
    onEdgesChange,
  };
}
