import { create } from "zustand";

import {
  APP_HOME_PATH,
  APP_HOME_VIEW,
  TOOL_MENU_ITEMS,
  type AppView,
} from "@/lib/tool-menu";
import { useImmersiveStore } from "@/store/immersive-store";

type AppViewStore = {
  view: AppView;
  goHome: () => void;
  setView: (view: AppView) => void;
};

const applyViewHash = (view: AppView): void => {
  if (typeof window === "undefined") return;
  const path =
    TOOL_MENU_ITEMS.find((item) => item.id === view)?.path ?? APP_HOME_PATH;
  if (window.location.hash !== `#${path}`) {
    window.location.hash = path;
  }
};

export const viewFromLocationHash = (): AppView => {
  if (typeof window === "undefined") return APP_HOME_VIEW;
  const raw = window.location.hash.replace(/^#/, "");
  if (raw === "/random-number" || raw === "random-number") {
    return "random-number";
  }
  if (raw === "/random-name" || raw === "random-name") {
    return "random-name";
  }
  if (raw === "/dice-roller" || raw === "dice-roller") {
    return "dice-roller";
  }
  if (raw === "/coin-flip" || raw === "coin-flip") {
    return "coin-flip";
  }
  if (raw === "/yes-or-no" || raw === "yes-or-no") {
    return "yes-or-no";
  }
  if (raw === "/shuffle-list" || raw === "shuffle-list") {
    return "shuffle-list";
  }
  if (raw === "/random-team" || raw === "random-team") {
    return "random-team";
  }
  return APP_HOME_VIEW;
};

export const useAppViewStore = create<AppViewStore>((set) => ({
  view: viewFromLocationHash(),
  goHome: () => {
    useImmersiveStore.getState().setImmersive(false);
    applyViewHash(APP_HOME_VIEW);
    set({ view: APP_HOME_VIEW });
  },
  setView: (view) => {
    useImmersiveStore.getState().setImmersive(false);
    applyViewHash(view);
    set({ view });
  },
}));
