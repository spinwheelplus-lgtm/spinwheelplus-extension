import { create } from "zustand";

import {
  DEFAULT_FLIP_COIN_FACE_STYLE,
  parseFlipCoinFaceStyle,
  serializeFlipCoinFaceStyle,
  type FlipCoinFaceStyle,
} from "@/lib/coin-flip/flip-coin-face-style";
import {
  COIN_FLIP_PERSIST_DEFAULTS,
  hydrateCoinSlotsFromPersist,
  loadCoinFlipPersist,
  saveCoinFlipPersist,
  type CoinFlipPersistState,
} from "@/lib/coin-flip/persist";
import {
  DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
  type FlipCoinClickFlipMode,
  type FlipCoinHistoryEntry,
  type FlipCoinSlot,
} from "@/types/coin-flip";

type CoinFlipStoreState = {
  ready: boolean;
  coinSlots: FlipCoinSlot[];
  clickFlipMode: FlipCoinClickFlipMode;
  soundOn: boolean;
  flipHistory: FlipCoinHistoryEntry[];
  faceStyle: FlipCoinFaceStyle;
  hydrate: () => Promise<void>;
  setCoinSlots: (slots: FlipCoinSlot[]) => void;
  setClickFlipMode: (mode: FlipCoinClickFlipMode) => void;
  setFaceStyle: (style: FlipCoinFaceStyle) => void;
  toggleSound: () => void;
  setFlipHistory: (history: FlipCoinHistoryEntry[]) => void;
};

const persistSlice = (state: CoinFlipStoreState): CoinFlipPersistState => ({
  coin_slots: state.coinSlots.map((slot) => ({
    id: slot.id,
    metal: slot.metal,
  })),
  click_flip_mode: state.clickFlipMode,
  sound_on: state.soundOn,
  flip_history: state.flipHistory,
  face: serializeFlipCoinFaceStyle(state.faceStyle),
});

let persistTimer: number | null = null;

const schedulePersist = (): void => {
  if (persistTimer != null) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    void saveCoinFlipPersist(persistSlice(useCoinFlipStore.getState()));
  }, 200);
};

export const useCoinFlipStore = create<CoinFlipStoreState>((set) => ({
  ready: false,
  coinSlots: [],
  clickFlipMode: DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
  soundOn: COIN_FLIP_PERSIST_DEFAULTS.sound_on,
  flipHistory: [],
  faceStyle: DEFAULT_FLIP_COIN_FACE_STYLE,
  hydrate: async () => {
    const saved = await loadCoinFlipPersist();
    set({
      coinSlots: hydrateCoinSlotsFromPersist(saved),
      clickFlipMode:
        saved?.click_flip_mode ?? DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
      soundOn: saved?.sound_on ?? COIN_FLIP_PERSIST_DEFAULTS.sound_on,
      flipHistory: saved?.flip_history ?? [],
      faceStyle: parseFlipCoinFaceStyle(saved?.face),
      ready: true,
    });
  },
  setCoinSlots: (coinSlots) => {
    set({ coinSlots });
    schedulePersist();
  },
  setClickFlipMode: (clickFlipMode) => {
    set({ clickFlipMode });
    schedulePersist();
  },
  setFaceStyle: (faceStyle) => {
    set({ faceStyle });
    schedulePersist();
  },
  toggleSound: () => {
    set((state) => ({ soundOn: !state.soundOn }));
    schedulePersist();
  },
  setFlipHistory: (flipHistory) => {
    set({ flipHistory });
    schedulePersist();
  },
}));
