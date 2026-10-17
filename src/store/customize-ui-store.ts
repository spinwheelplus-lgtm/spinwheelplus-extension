import { create } from "zustand";

export type CustomizeTabId = "design" | "settings";

type CustomizeUiStore = {
  open: boolean;
  tab: CustomizeTabId;
  resultPopupDemoOpen: boolean;
  setOpen: (open: boolean) => void;
  setTab: (tab: CustomizeTabId) => void;
  setResultPopupDemoOpen: (open: boolean) => void;
  openCustomize: (tab?: CustomizeTabId) => void;
};

export const useCustomizeUiStore = create<CustomizeUiStore>((set) => ({
  open: false,
  tab: "design",
  resultPopupDemoOpen: false,
  setOpen: (open) =>
    set(open ? { open: true } : { open: false, resultPopupDemoOpen: false }),
  setTab: (tab) => set({ tab }),
  setResultPopupDemoOpen: (open) => set({ resultPopupDemoOpen: open }),
  openCustomize: (tab) =>
    set(tab ? { open: true, tab } : { open: true }),
}));
