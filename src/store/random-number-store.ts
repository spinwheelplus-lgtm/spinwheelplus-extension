import { create } from "zustand";

import {
  loadRandomNumberPersist,
  saveRandomNumberPersist,
  type RandomNumberPersistState,
} from "@/lib/random-number/persist";
import { clampRandomNumberBound } from "@/lib/random-number/clamp-random-number-bound";
import { clampRandomNumberCustomCount } from "@/lib/random-number/parse-random-number-custom-count";
import type { RandomNumberSetupFile } from "@/lib/random-number/random-number-setup-file";
import { computeRandomNumberDraw } from "@/lib/random-number/random-number-draw";
import type { RandomNumberDrawResult } from "@/lib/random-number/random-number-draw";
import { createItemId } from "@/lib/random";
import {
  RANDOM_NUMBER_COUNT_PRESETS,
  RANDOM_NUMBER_HISTORY_LIMIT,
  type RandomNumberCountMode,
  type RandomNumberHistoryEntry,
} from "@/types/random-number";

type RandomNumberStoreState = RandomNumberPersistState & {
  ready: boolean;
  hydrate: () => Promise<void>;
  setRandomNumberMin: (value: number) => void;
  setRandomNumberMax: (value: number) => void;
  setRandomNumberExcludeInput: (value: string) => void;
  setRandomNumberCountMode: (mode: RandomNumberCountMode) => void;
  setRandomNumberCustomCount: (value: number) => void;
  setRandomNumberAllowDuplicates: (value: boolean) => void;
  setRandomNumberRollAnimation: (value: boolean) => void;
  setRandomNumberSoundEnabled: (value: boolean) => void;
  applyRandomNumberSetup: (setup: RandomNumberSetupFile) => void;
  computeRandomNumberDraw: () => RandomNumberDrawResult;
  commitRandomNumberDraw: (numbers: number[]) => void;
  clearRandomNumberHistory: () => void;
  restoreRandomNumberHistoryEntry: (id: string) => void;
  toggleRandomNumberOptionsDocked: () => void;
  setRandomNumberHistoryPanelOpen: (open: boolean) => void;
};

const resolveRandomNumberCount = (
  mode: RandomNumberCountMode,
  customCount: number,
): number => {
  if (mode === "custom") {
    return clampRandomNumberCustomCount(customCount);
  }
  return mode;
};

export const getRandomNumberResolvedCount = (
  state: Pick<
    RandomNumberPersistState,
    "random_number_count_mode" | "random_number_custom_count"
  >,
): number =>
  resolveRandomNumberCount(
    state.random_number_count_mode,
    state.random_number_custom_count,
  );

const persistSlice = (
  state: RandomNumberStoreState,
): RandomNumberPersistState => ({
  random_number_min: state.random_number_min,
  random_number_max: state.random_number_max,
  random_number_exclude_input: state.random_number_exclude_input,
  random_number_count_mode: state.random_number_count_mode,
  random_number_custom_count: state.random_number_custom_count,
  random_number_allow_duplicates: state.random_number_allow_duplicates,
  random_number_roll_animation: state.random_number_roll_animation,
  random_number_sound_enabled: state.random_number_sound_enabled,
  random_number_current_numbers: state.random_number_current_numbers,
  random_number_current_generated_at: state.random_number_current_generated_at,
  random_number_history: state.random_number_history,
  random_number_active_history_id: state.random_number_active_history_id,
  random_number_options_docked: state.random_number_options_docked,
  random_number_history_panel_open: state.random_number_history_panel_open,
});

let persistTimer: number | null = null;

const schedulePersist = (): void => {
  if (persistTimer != null) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    void saveRandomNumberPersist(persistSlice(useRandomNumberStore.getState()));
  }, 200);
};

export const useRandomNumberStore = create<RandomNumberStoreState>((set, get) => ({
  ready: false,
  random_number_min: 1,
  random_number_max: 100,
  random_number_exclude_input: "",
  random_number_count_mode: 1,
  random_number_custom_count: 20,
  random_number_allow_duplicates: false,
  random_number_roll_animation: true,
  random_number_sound_enabled: true,
  random_number_current_numbers: [],
  random_number_current_generated_at: null,
  random_number_history: [],
  random_number_active_history_id: null,
  random_number_options_docked: true,
  random_number_history_panel_open: true,
  hydrate: async () => {
    const saved = await loadRandomNumberPersist();
    set({ ...(saved ?? {}), ready: true });
  },
  setRandomNumberMin: (value) => {
    if (!Number.isFinite(value)) return;
    set({ random_number_min: clampRandomNumberBound(value) });
    schedulePersist();
  },
  setRandomNumberMax: (value) => {
    if (!Number.isFinite(value)) return;
    set({ random_number_max: clampRandomNumberBound(value) });
    schedulePersist();
  },
  setRandomNumberExcludeInput: (value) => {
    set({ random_number_exclude_input: value });
    schedulePersist();
  },
  setRandomNumberCountMode: (mode) => {
    if (mode !== "custom" && !RANDOM_NUMBER_COUNT_PRESETS.includes(mode)) {
      return;
    }
    set({ random_number_count_mode: mode });
    schedulePersist();
  },
  setRandomNumberCustomCount: (value) => {
    set({
      random_number_custom_count: clampRandomNumberCustomCount(value),
    });
    schedulePersist();
  },
  setRandomNumberAllowDuplicates: (value) => {
    set({ random_number_allow_duplicates: value });
    schedulePersist();
  },
  setRandomNumberRollAnimation: (value) => {
    set({ random_number_roll_animation: value });
    schedulePersist();
  },
  setRandomNumberSoundEnabled: (value) => {
    set({ random_number_sound_enabled: value });
    schedulePersist();
  },
  applyRandomNumberSetup: (setup) => {
    set({
      random_number_min: setup.min,
      random_number_max: setup.max,
      random_number_exclude_input: setup.exclude,
      random_number_count_mode: setup.countMode,
      random_number_custom_count: setup.customCount,
      random_number_allow_duplicates: setup.allowDuplicates,
      random_number_roll_animation: setup.rollAnimation,
      random_number_sound_enabled: setup.soundEnabled,
    });
    schedulePersist();
  },
  computeRandomNumberDraw: () => {
    const state = get();
    return computeRandomNumberDraw({
      min: state.random_number_min,
      max: state.random_number_max,
      excludeInput: state.random_number_exclude_input,
      count: resolveRandomNumberCount(
        state.random_number_count_mode,
        state.random_number_custom_count,
      ),
      allowDuplicates: state.random_number_allow_duplicates,
    });
  },
  commitRandomNumberDraw: (numbers) => {
    const state = get();
    const generatedAt = Date.now();
    const entry: RandomNumberHistoryEntry = {
      id: createItemId(),
      numbers,
      generatedAt,
    };
    set({
      random_number_current_numbers: numbers,
      random_number_current_generated_at: generatedAt,
      random_number_active_history_id: entry.id,
      random_number_history: [entry, ...state.random_number_history].slice(
        0,
        RANDOM_NUMBER_HISTORY_LIMIT,
      ),
    });
    schedulePersist();
  },
  clearRandomNumberHistory: () => {
    set({
      random_number_history: [],
      random_number_active_history_id: null,
    });
    schedulePersist();
  },
  restoreRandomNumberHistoryEntry: (id) => {
    const entry = get().random_number_history.find((item) => item.id === id);
    if (!entry) return;
    set({
      random_number_current_numbers: entry.numbers,
      random_number_current_generated_at: entry.generatedAt,
      random_number_active_history_id: entry.id,
    });
    schedulePersist();
  },
  toggleRandomNumberOptionsDocked: () => {
    set((state) => ({
      random_number_options_docked: !state.random_number_options_docked,
    }));
    schedulePersist();
  },
  setRandomNumberHistoryPanelOpen: (open) => {
    set({ random_number_history_panel_open: open });
    schedulePersist();
  },
}));
