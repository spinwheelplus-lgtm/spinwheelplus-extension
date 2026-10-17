import { create } from "zustand";

import {
  DICE_ROLLER_PERSIST_DEFAULTS,
  hydrateDiceSlotsFromPersist,
  loadDiceRollerPersist,
  saveDiceRollerPersist,
  type DiceRollerPersistState,
} from "@/lib/dice-roller/persist";
import { clampRollDiceModifier } from "@/lib/dice-roller/roll-dice-modifier";
import {
  DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
  type RollDiceClickRollMode,
  type RollDiceHistoryEntry,
  type RollDiceSlot,
} from "@/types/dice-roller";

type DiceRollerStoreState = {
  ready: boolean;
  diceSlots: RollDiceSlot[];
  rollModifier: number;
  clickRollMode: RollDiceClickRollMode;
  soundOn: boolean;
  rollHistory: RollDiceHistoryEntry[];
  hydrate: () => Promise<void>;
  setDiceSlots: (slots: RollDiceSlot[]) => void;
  setRollModifier: (value: number) => void;
  setClickRollMode: (mode: RollDiceClickRollMode) => void;
  toggleSound: () => void;
  setRollHistory: (history: RollDiceHistoryEntry[]) => void;
};

const persistSlice = (
  state: DiceRollerStoreState,
): DiceRollerPersistState => ({
  dice_slots: state.diceSlots.map((slot) => ({
    id: slot.id,
    sides: slot.sides,
    appearance: slot.appearance,
  })),
  roll_modifier: state.rollModifier,
  click_roll_mode: state.clickRollMode,
  sound_on: state.soundOn,
  roll_history: state.rollHistory,
});

let persistTimer: number | null = null;

const schedulePersist = (): void => {
  if (persistTimer != null) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    void saveDiceRollerPersist(persistSlice(useDiceRollerStore.getState()));
  }, 200);
};

export const useDiceRollerStore = create<DiceRollerStoreState>((set) => ({
  ready: false,
  diceSlots: [],
  rollModifier: DICE_ROLLER_PERSIST_DEFAULTS.roll_modifier,
  clickRollMode: DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
  soundOn: DICE_ROLLER_PERSIST_DEFAULTS.sound_on,
  rollHistory: [],
  hydrate: async () => {
    const saved = await loadDiceRollerPersist();
    set({
      diceSlots: hydrateDiceSlotsFromPersist(saved),
      rollModifier:
        saved?.roll_modifier ?? DICE_ROLLER_PERSIST_DEFAULTS.roll_modifier,
      clickRollMode:
        saved?.click_roll_mode ?? DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
      soundOn: saved?.sound_on ?? DICE_ROLLER_PERSIST_DEFAULTS.sound_on,
      rollHistory: saved?.roll_history ?? [],
      ready: true,
    });
  },
  setDiceSlots: (diceSlots) => {
    set({ diceSlots });
    schedulePersist();
  },
  setRollModifier: (value) => {
    set({ rollModifier: clampRollDiceModifier(value) });
    schedulePersist();
  },
  setClickRollMode: (clickRollMode) => {
    set({ clickRollMode });
    schedulePersist();
  },
  toggleSound: () => {
    set((state) => ({ soundOn: !state.soundOn }));
    schedulePersist();
  },
  setRollHistory: (rollHistory) => {
    set({ rollHistory });
    schedulePersist();
  },
}));
