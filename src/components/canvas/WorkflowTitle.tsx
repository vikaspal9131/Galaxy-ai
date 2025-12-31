"use client";

import { useState } from "react";
import { useFlowStore } from "@/store/flow.store";
import { saveWorkflow } from "@/services/workflow.service";

export function WorkflowTitle() {
  const { name, setName, nodes, edges } = useFlowStore();
  const [editing, setEditing] = useState(false);

  const save = async () => {
    const finalName = name.trim() || "Untitled";
    setName(finalName);
    setEditing(false);

    await saveWorkflow(nodes, edges, finalName);
  };

  return editing ? (
    <input
      autoFocus
      value={name}
      onChange={(e) => setName(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => e.key === "Enter" && save()}
      className="text-white/90 outline-none text-[13px]"
    />
  ) : (
    <h1
      onClick={() => setEditing(true)}
      className="
        cursor-pointer
        hover:opacity-80
        text-[13px]
        text-white/90
        font-medium
        max-w-45
        truncate
        whitespace-nowrap
        overflow-hidden
      "
      title={name}
    >
      {name || "Untitled"}
    </h1>
  );
}
