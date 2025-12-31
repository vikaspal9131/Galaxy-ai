"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Upload } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useFlowStore } from "@/store/flow.store";
import { NodeMenu } from "./NodeMenu";

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function ImageNode({ id, data }: any) {
  const { nodes, edges, setFlow } = useFlowStore();
  const { deleteElements } = useReactFlow();
  const [menuOpen, setMenuOpen] = useState(false);

  const onDelete = () => {
    deleteElements({ nodes: [{ id }] });
    setMenuOpen(false);
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    const base64 = await fileToBase64(file);

    setFlow(
      nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                base64,
                mimeType: file.type,
              },
            }
          : n
      ),
      edges,
      true
    );
  };

  const preview =
    data?.base64 && data?.mimeType
      ? `data:${data.mimeType};base64,${data.base64}`
      : null;

  return (
    <>
      {/* ✅ FULL SCREEN CLICK CATCHER — PORTAL */}
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

      <div className="relative bg-[#212126] border border-[#313135] rounded-2xl px-5 py-5 w-96 h-104 text-white shadow-md group z-1000000">
        <div className="flex justify-between items-center mb-2">
          <p className="text[16px] text-white/90">Image</p>

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

        <label className="relative z-10 h-[90%] bg-[#2b2b33] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
          <img className="absolute w-full h-full" src="/images/bg.jpg" alt="" />

          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover relative"
            />
          ) : (
            <div className="flex relative flex-col items-center text-white/90">
              <Upload size={18} />
              Upload image
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </label>

        <Handle
          type="source"
          id="image"
          position={Position.Right}
          style={{
            width: 17,
            height: 17,
            background: "#2b2b33",
            borderRadius: "50%",
            border: "4px solid #f1a0faa7",
            top: 90,
            zIndex: 10,
          }}
        />
      </div>
    </>
  );
}
