import { create } from "zustand";

import {
  applyAppearanceClass,
  loadAppearancePreference,
  resolveAppearance,
  saveAppearancePreference,
  type AppearancePreference,
  type ResolvedAppearance,
} from "@/lib/appearance";

type AppearanceStore = {
  preference: AppearancePreference;
  resolved: ResolvedAppearance;
  ready: boolean;
  hydrate: () => Promise<void>;
  setPreference: (preference: AppearancePreference) => void;
};

let mediaBound = false;

const bindSystemThemeListener = (): void => {
  if (mediaBound || typeof window === "undefined") return;
  mediaBound = true;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    const { preference } = useAppearanceStore.getState();
    if (preference !== "system") return;
    useAppearanceStore.setState({
      resolved: applyAppearanceClass("system"),
    });
  };
  media.addEventListener("change", onChange);
};

export const useAppearanceStore = create<AppearanceStore>((set) => ({
  preference: "system",
  resolved: resolveAppearance("system"),
  ready: false,
  hydrate: async () => {
    const preference = (await loadAppearancePreference()) ?? "system";
    const resolved = applyAppearanceClass(preference);
    bindSystemThemeListener();
    set({ preference, resolved, ready: true });
  },
  setPreference: (preference) => {
    const resolved = applyAppearanceClass(preference);
    set({ preference, resolved });
    void saveAppearancePreference(preference);
  },
}));
