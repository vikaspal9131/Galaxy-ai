"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
import { BsThreeDots } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useState } from "react";
import { createPortal } from "react-dom";
import { NodeMenu } from "./NodeMenu";
import { runLLMAndUpdateTextNode } from "@/utils/runLLMAndUpdateTextNode";
import { stripMarkdown } from "@/utils/stripMarkdown";

export function LLMNode({ id }: any) {
  const { deleteElements, getNodes, getEdges, setNodes } = useReactFlow();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const node = getNodes().find((n) => n.id === id);
  const rawOutput = node?.data?.output;

  const output =
    typeof rawOutput === "string"
      ? stripMarkdown(rawOutput)
      : rawOutput
      ? stripMarkdown(JSON.stringify(rawOutput, null, 2))
      : "";

  const onDelete = () => {
    deleteElements({ nodes: [{ id }] });
    setMenuOpen(false);
  };

  const onRun = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const result = await runLLMAndUpdateTextNode({
        nodes: getNodes(),
        edges: getEdges(),
        llmNodeId: id,
      });

      const edges = getEdges();

      const outputEdge = edges.find(
        (e) => e.source === id && e.sourceHandle === "output"
      );

      setNodes((nds) => {
        if (outputEdge) {
          return nds.map((n) => {
            if (n.id === outputEdge.target) {
              return {
                ...n,
                data: {
                  ...n.data,
                  value: result,
                  from: "llm",
                },
              };
            }

            if (n.id === id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  output: "",
                },
              };
            }

            return n;
          });
        }

        return nds.map((n) =>
          n.id === id
            ? {
                ...n,
                data: {
                  ...n.data,
                  output: result,
                },
              }
            : n
        );
      });
    } catch (e: any) {
      setError(e.message || "LLM failed");
    } finally {
      setLoading(false);
    }
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

      <div className="bg-[#212126] border border-[#313135] rounded-2xl w-114.5 h-154.25 text-white px-4 group relative z-1000000">
        <button
          className="absolute top-4 right-6 hover:bg-white/10 outline-none rounded-[3px] p-2"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
        >
          <BsThreeDots />
        </button>
        {menuOpen && <NodeMenu onDelete={onDelete} />}
        <div className="flex flex-col items-center p-3 h-154">
          <div className="flex items-center w-full gap-3">
            <FcGoogle size={17} />
            <p className="text-[16px] text-white/90 py-3">Gemini 2.5 flash</p>
          </div>

          <textarea
            value={output}
            onChange={(e) =>
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === id
                    ? {
                        ...n,
                        data: {
                          ...n.data,
                          output: e.target.value,
                        },
                      }
                    : n
                )
              )
            }
            placeholder="LLM output..."
            className="
              mt-2 resize-none
              rounded-xl bg-[#353539] p-3
              text-[13px] text-white/80 outline-none
              overflow-y-scroll scroll-style
              w-full h-full
            "
          />

          <div className="w-full flex justify-between items-center mt-3 font-dm-mono">
            <div className="w-50 test-start">
              {error && (
                <p className="text-[11px] text-red-400 text-center">{error}</p>
              )}
            </div>
            <button
              onClick={onRun}
              disabled={loading}
              className="border border-[#313135] text-white text-[15px] mt-2 px-5 py-1 rounded font-dm-mono cursor-pointer flex items-center gap-1 hover:bg-white/50 hover:text-black/90 duration-500"
            >
              {loading ? (
                "Running…"
              ) : (
                <>
                  Run Model <IoIosArrowRoundForward size={23} />
                </>
              )}
            </button>
          </div>
        </div>
        <span className="absolute -left-4 top-12 rounded-full w-8 h-8 bg-[#212126]" />{" "}
        <span className="absolute -left-30 top-[1.2rem] text-[14px] font-dm-mono text-[#f1a0faa7] opacity-0 group-hover:opacity-100 transition duration-500">
          {" "}
          System Input{" "}
        </span>{" "}
        <span className="absolute -left-4 top-36 rounded-full w-8 h-8 bg-[#212126]" />{" "}
        <span className="absolute -left-30 top-[8.2rem] text-[14px] font-dm-mono text-[#f1a0faa7] opacity-0 group-hover:opacity-100 transition duration-500">
          {" "}
          Prompt{" "}
        </span>{" "}
        <span className="absolute -left-4 top-63 rounded-full w-8 h-8 bg-[#212126]" />{" "}
        <span className="absolute -left-30 top-[14.2rem] text-[14px] font-dm-mono text-[#f1a0faa7] opacity-0 group-hover:opacity-100 transition duration-500">
          {" "}
          Image{" "}
        </span>{" "}
        <span className="absolute -right-4 top-73 rounded-full w-8 h-8 bg-[#212126]" />{" "}
        <span className="absolute -right-20 top-80 text-[14px] font-dm-mono text-[#f1a0faa7] opacity-0 group-hover:opacity-100 transition duration-500">
          {" "}
          Output{" "}
        </span>
        <Handle
          id="system"
          type="target"
          position={Position.Left}
          style={{
            width: 17,
            height: 17,
            background: "#2b2b33",
            borderRadius: "50%",
            border: "4px solid #f1a0faa7",
            top: 60,
          }}
        />
        <Handle
          id="user"
          type="target"
          position={Position.Left}
          style={{
            width: 17,
            height: 17,
            background: "#2b2b33",
            borderRadius: "50%",
            border: "4px solid #f1a0faa7",
            top: 150,
          }}
        />
        <Handle
          id="image"
          type="target"
          position={Position.Left}
          style={{
            width: 17,
            height: 17,
            background: "#2b2b33",
            borderRadius: "50%",
            border: "4px solid #f1a0faa7",
            top: 250,
          }}
        />
        <Handle
          id="output"
          type="source"
          position={Position.Right}
          style={{
            width: 17,
            height: 17,
            background: "#2b2b33",
            borderRadius: "50%",
            border: "4px solid #f1a0faa7",
            top: "50%",
          }}
        />
      </div>
    </>
  );
}
