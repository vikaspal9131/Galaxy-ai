"use client";

type Props = {
  onDelete: () => void;
  open?: boolean;
};

export function NodeMenu({ onDelete, open = true }: Props) {
  return (
    <div
      className={`
        absolute -right-17 top-6 z-50 w-55
        border border-[#2c2c30] rounded-md
        bg-[#212126] shadow-lg
        ease-out hover:bg-[#2a2a30] 
        ${
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }
      `}
    >
      <button
        onClick={onDelete}
        className="px-3 py-2 text-sm text-white/80 w-full text-left text-[10px] flex justify-between"
      >
        <p>Delete</p>

        <p className="italic"> /  Delete /  Backspace</p>
      </button>
    </div>
  );
}
