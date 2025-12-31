"use client";

import { LuMousePointer2 } from "react-icons/lu";
import { IoHandRightOutline } from "react-icons/io5";
import { HiArrowUturnLeft, HiArrowUturnRight } from "react-icons/hi2";
import { useStore } from "@xyflow/react";
import { useFlowStore } from "@/store/flow.store";

export function CanvasToolbar() {
  const zoom = useStore((state) => state.transform[2]);
  const zoomPercentage = Math.round(zoom * 100);

  const { undo, redo } = useFlowStore();

  return (
    <div className="absolute left-1/2 bottom-0 mb-5 -translate-x-1/2 z-50">
      <div className="flex items-center gap-0.5 rounded-md border border-[#2f2f35] bg-[#212126] px-2 py-1 shadow-lg">
        <div className="flex items-center gap-0.5 pr-2 border-r border-[#2f2f35]">
          <button className="h-8 w-8 flex items-center justify-center text-black/90 bg-white/90 rounded">
            <IoHandRightOutline />
          </button>
        </div>

        <div className="flex items-center gap-0.5 px-2 border-r border-[#2f2f35] text-white/90 ">
          <button
            onClick={undo}
            className="h-8 w-8 hover:bg-[#2a2a30] flex items-center justify-center rounded text-[23px] cursor-pointer"
          >
            <HiArrowUturnLeft />
          </button>
          <button
            onClick={redo}
            className="h-8 w-8 hover:bg-[#2a2a30]  flex items-center justify-center rounded text-[23px] cursor-pointer "
          >
            <HiArrowUturnRight />
          </button>
        </div>

        <div className="h-8 w-14 flex items-center justify-center text-sm text-white">
          {zoomPercentage}%
        </div>
      </div>
    </div>
  );
}
