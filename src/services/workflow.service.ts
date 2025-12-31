import { api } from "@/lib/axios";

export const loadWorkflow = async () =>
  api.get("/workflow");

export const saveWorkflow = async (
  nodes: any,
  edges: any,
  workflowName?: string
) =>
  api.put("/workflow", {
    nodes,
    edges,
    ...(workflowName ? { name: workflowName } : {}),
  });
