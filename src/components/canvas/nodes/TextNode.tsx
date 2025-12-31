"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { createPortal } from "react-dom";
import { NodeMenu } from "./NodeMenu";
import { stripMarkdown } from "@/utils/stripMarkdown";

export function TextNode({ id, data }: any) {
  const { setNodes, deleteElements } = useReactFlow();
  const [menuOpen, setMenuOpen] = useState(false);

  const onDelete = () => {
    deleteElements({ nodes: [{ id }] });
    setMenuOpen(false);
  };

  const isLLMOutput = data?.value && data?.from === "llm";

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                value,
                from: "user",
              },
            }
          : n
      )
    );
  };

  return (
    <>
     
      {menuOpen &&
        createPortal(
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
            }}
          />,
          document.body
        )}

      <div className="relative bg-[#212126] border border-[#313135] rounded-2xl px-4 py-3 w-122 h-70 text-white shadow-md group z-1000000">
        <div className="flex justify-between items-center mb-2 px-1 py-2">
          <p className="text-[16px] font-normal tracking-wide text-white/90">
            Text
          </p>

          <button
            className="cursor-pointer hover:bg-white/10 outline-none rounded-[3px] p-2"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            <BsThreeDots className="text-neutral-300 hover:text-white" />
          </button>

          {menuOpen && <NodeMenu onDelete={onDelete} />}
        </div>

        <textarea
          value={
            typeof data?.value === "string"
              ? isLLMOutput
                ? stripMarkdown(data.value)
                : data.value
              : data?.value
              ? isLLMOutput
                ? stripMarkdown(JSON.stringify(data.value, null, 2))
                : JSON.stringify(data.value, null, 2)
              : ""
          }
          onChange={isLLMOutput ? undefined : onChange}
          readOnly={isLLMOutput}
          placeholder={
            isLLMOutput
              ? "LLM output (read only)"
              : "Type prompt or view output..."
          }
          className={`
            w-full h-[78%] resize-none rounded-xl scroll-style
            bg-[#353539] p-3 text-[16px]
            text-white outline-none
            placeholder:text-neutral-500
            ${isLLMOutput ? "cursor-not-allowed opacity-90" : ""}
          `}
        />

        <span className="absolute -right-4 top-22.5 rounded-full w-8 h-8 bg-[#212126]" />
        <span className="absolute -left-16 top-[4.2rem] text-[14px] font-dm-mono text-[#f1a0faa7] opacity-0 group-hover:opacity-100 transition">
          input
        </span>
        <span className="absolute -left-4 top-22.5 rounded-full w-8 h-8 bg-[#212126]" />
        <span className="absolute -right-16 top-[4.2rem] text-[14px] font-dm-mono text-[#f1a0faa7] opacity-0 group-hover:opacity-100 transition">
          Prompt
        </span>

        <Handle
          id="input"
          type="target"
          position={Position.Left}
          style={{ ...handleStyle, top: 100 }}
        />

        <Handle
          id="output"
          type="source"
          position={Position.Right}
          style={{ ...handleStyle, top: 100 }}
        />
      </div>
    </>
  );
}

const handleStyle = {
  width: 17,
  height: 17,
  background: "#2b2b33",
  borderRadius: "50%",
  border: "4px solid #f1a0faa7",
};
