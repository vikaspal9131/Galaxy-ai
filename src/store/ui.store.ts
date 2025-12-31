import { create } from "zustand";

export type SidebarItemId =
  | "search"
  | "recent"
  | "folder"
  | "image"
  | "video"
  | "box"
  | "zap"
  | "file"
  | "help"
  | null;

type UIState = {
  isSidebarCollapsed: boolean;
  activeSidebarItem: SidebarItemId;
  toggleSidebar: () => void;
  setActiveSidebarItem: (id: SidebarItemId) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: true,
  activeSidebarItem: null,

  toggleSidebar: (): void =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),

  setActiveSidebarItem: (id: SidebarItemId): void =>
    set({
      activeSidebarItem: id,
    }),
}));
