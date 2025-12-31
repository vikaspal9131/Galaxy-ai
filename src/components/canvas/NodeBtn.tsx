"use client";

import { TfiText } from "react-icons/tfi";
import { CiImageOn } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";

const SIDEBAR_ITEMS = [
  {
    label: "Text",
    type: "textNode",
    icon: TfiText,
  },
  {
    label: "Image",
    type: "imageNode",
    icon: CiImageOn,
  },
  {
    label: "Gemini-2.5-flash",
    type: "llmNode",
    icon: FcGoogle,
  },
];

export function FlowSidebar() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="px-4">
      <h1 className="mb-3 text-[15px] font-medium">Quick access</h1>
      <div className="grid grid-cols-2 gap-2.25">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
              className="border border-[#555559] h-25
                         flex flex-col items-center justify-center rounded-[3px]
                         text-xs text-center
                         hover:bg-[#353539]
                         cursor-grab active:cursor-grabbing
                         transition select-none"
            >
              <Icon className="text-[20px] mb-1.5 pointer-events-none text-gray-300" />
              {item.label}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
