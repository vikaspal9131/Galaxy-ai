"use client";

import { useRef } from "react";
import { TfiExport, TfiImport } from "react-icons/tfi";

type Props = {
  onImport?: (file: File) => void;
  onExport?: () => void;
};

export default function WorkflowActions({ onImport, onExport }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="border-t border-[#302e33] py-2 px-4">
      <p className="text-[14px] text-white mb-2">Workflow</p>

      <div className="flex gap-2 text-sm text-white">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-[3px] border border-[#302E33] py-2
                     flex items-center justify-center gap-3"
        >
          <TfiImport /> Import
        </button>

        <button
          type="button"
          onClick={() => onExport?.()}
          className="w-full rounded-[3px] border border-[#302E33] py-2
                     flex items-center justify-center gap-3"
        >
          <TfiExport /> Export
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onImport) {
            onImport(file);
          }
          e.currentTarget.value = "";
        }}
      />
    </div>
  );
}
