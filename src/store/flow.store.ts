import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";

type Snapshot = {
  nodes: Node[];
  edges: Edge[];
};

type FlowStore = {
  name: string;
  nodes: Node[];
  edges: Edge[];
  past: Snapshot[];
  future: Snapshot[];

  setName: (name: string) => void;
  setFlow: (nodes: Node[], edges: Edge[], record?: boolean) => void;
  resetFlow: (nodes: Node[], edges: Edge[], name?: string) => void;
  undo: () => void;
  redo: () => void;
};

const clone = <T>(v: T): T => structuredClone(v);

export const useFlowStore = create<FlowStore>((set, get) => ({
  name: "Untitled",
  nodes: [],
  edges: [],
  past: [],
  future: [],

  setName: (name) => set({ name }),

  setFlow: (nodes, edges, record = true) => {
    const { nodes: prevNodes, edges: prevEdges, past } = get();

    set({
      past: record
        ? [...past, clone({ nodes: prevNodes, edges: prevEdges })]
        : past,
      nodes: clone(nodes),
      edges: clone(edges),
      future: [],
    });
  },

  resetFlow: (nodes, edges, name = "Untitled") => {
    set({
      name,
      nodes: clone(nodes),
      edges: clone(edges),
      past: [],
      future: [],
    });
  },

  undo: () => {
    const { past, nodes, edges, future } = get();
    if (!past.length) return;

    const previous = past[past.length - 1];

    set({
      past: past.slice(0, -1),
      future: [clone({ nodes, edges }), ...future],
      nodes: clone(previous.nodes),
      edges: clone(previous.edges),
    });
  },

  redo: () => {
    const { future, nodes, edges, past } = get();
    if (!future.length) return;

    const next = future[0];

    set({
      future: future.slice(1),
      past: [...past, clone({ nodes, edges })],
      nodes: clone(next.nodes),
      edges: clone(next.edges),
    });
  },
}));
