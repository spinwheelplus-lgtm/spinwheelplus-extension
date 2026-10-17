import { create } from "zustand";

type ImmersiveStore = {
  immersive: boolean;
  setImmersive: (immersive: boolean) => void;
  toggleImmersive: () => void;
};

export const useImmersiveStore = create<ImmersiveStore>((set) => ({
  immersive: false,
  setImmersive: (immersive) => set({ immersive }),
  toggleImmersive: () => set((state) => ({ immersive: !state.immersive })),
}));
