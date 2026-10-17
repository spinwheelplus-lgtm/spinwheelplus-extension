import { create } from "zustand";

import {
  loadRandomNamePersist,
  RANDOM_NAME_PERSIST_DEFAULTS,
  saveRandomNamePersist,
  type RandomNamePersistState,
} from "@/lib/random-name/persist";
import {
  computeRandomNameDraw,
  getRandomNamePickPoolSize,
} from "@/lib/random-name/random-name-draw";
import type { RandomNameDrawResult } from "@/lib/random-name/random-name-draw";
import {
  formatNameList,
  parseNameList,
  removeFirstNameMatch,
  removeNameAtIndex,
} from "@/lib/random-name/parse-name-list";
import type { RandomNameSetupFile } from "@/lib/random-name/random-name-setup-file";
import { shuffleNames } from "@/lib/random-name/shuffle-names";
import { createItemId } from "@/lib/random";
import {
  RANDOM_NAME_HISTORY_LIMIT,
  type RandomNameHistoryEntry,
} from "@/types/random-name";

type RandomNameStoreState = RandomNamePersistState & {
  ready: boolean;
  hydrate: () => Promise<void>;
  setRandomNameListInput: (value: string) => void;
  setRandomNameRemoveWinner: (value: boolean) => void;
  setRandomNameDeduplicateNames: (value: boolean) => void;
  setRandomNameRollAnimation: (value: boolean) => void;
  setRandomNameSoundEnabled: (value: boolean) => void;
  applyRandomNameSetup: (setup: RandomNameSetupFile) => void;
  shuffleRandomNameList: () => void;
  clearRandomNameList: () => void;
  computeRandomNamePick: () => RandomNameDrawResult;
  commitRandomNamePick: (name: string, index: number) => void;
  clearRandomNameHistory: () => void;
  restoreRandomNameHistoryEntry: (id: string) => void;
  toggleRandomNameOptionsDocked: () => void;
  setRandomNameHistoryPanelOpen: (open: boolean) => void;
};

export const getRandomNameCount = (
  namesInput: string,
  deduplicate: boolean,
): number => getRandomNamePickPoolSize(namesInput, deduplicate);

export const getRandomNameLineCount = (namesInput: string): number =>
  parseNameList(namesInput).length;

const persistSlice = (
  state: RandomNameStoreState,
): RandomNamePersistState => ({
  random_name_list_input: state.random_name_list_input,
  random_name_remove_winner: state.random_name_remove_winner,
  random_name_deduplicate_names: state.random_name_deduplicate_names,
  random_name_roll_animation: state.random_name_roll_animation,
  random_name_sound_enabled: state.random_name_sound_enabled,
  random_name_current_winner: state.random_name_current_winner,
  random_name_current_picked_at: state.random_name_current_picked_at,
  random_name_history: state.random_name_history,
  random_name_active_history_id: state.random_name_active_history_id,
  random_name_options_docked: state.random_name_options_docked,
  random_name_history_panel_open: state.random_name_history_panel_open,
});

let persistTimer: number | null = null;

const schedulePersist = (): void => {
  if (persistTimer != null) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    void saveRandomNamePersist(persistSlice(useRandomNameStore.getState()));
  }, 200);
};

export const useRandomNameStore = create<RandomNameStoreState>((set, get) => ({
  ready: false,
  ...RANDOM_NAME_PERSIST_DEFAULTS,
  hydrate: async () => {
    const saved = await loadRandomNamePersist();
    set({ ...RANDOM_NAME_PERSIST_DEFAULTS, ...(saved ?? {}), ready: true });
  },
  setRandomNameListInput: (value) => {
    set({ random_name_list_input: value });
    schedulePersist();
  },
  setRandomNameRemoveWinner: (value) => {
    set({ random_name_remove_winner: value });
    schedulePersist();
  },
  setRandomNameDeduplicateNames: (value) => {
    set({ random_name_deduplicate_names: value });
    schedulePersist();
  },
  setRandomNameRollAnimation: (value) => {
    set({ random_name_roll_animation: value });
    schedulePersist();
  },
  setRandomNameSoundEnabled: (value) => {
    set({ random_name_sound_enabled: value });
    schedulePersist();
  },
  applyRandomNameSetup: (setup) => {
    set({
      random_name_list_input: setup.names,
      random_name_remove_winner: setup.removeWinner,
      random_name_deduplicate_names: setup.deduplicate,
      random_name_roll_animation: setup.rollAnimation,
      random_name_sound_enabled: setup.soundEnabled,
    });
    schedulePersist();
  },
  shuffleRandomNameList: () => {
    const names = parseNameList(get().random_name_list_input);
    if (names.length < 2) return;
    set({ random_name_list_input: formatNameList(shuffleNames(names)) });
    schedulePersist();
  },
  clearRandomNameList: () => {
    set({
      random_name_list_input: "",
      random_name_current_winner: null,
      random_name_current_picked_at: null,
      random_name_active_history_id: null,
    });
    schedulePersist();
  },
  computeRandomNamePick: () => {
    const state = get();
    return computeRandomNameDraw(
      state.random_name_list_input,
      state.random_name_deduplicate_names,
    );
  },
  commitRandomNamePick: (name, index) => {
    const state = get();
    const generatedAt = Date.now();
    const entry: RandomNameHistoryEntry = {
      id: createItemId(),
      name,
      generatedAt,
    };

    const names = parseNameList(state.random_name_list_input);
    let nextInput = state.random_name_list_input;

    if (state.random_name_remove_winner && names.length > 0) {
      nextInput = formatNameList(
        state.random_name_deduplicate_names
          ? removeFirstNameMatch(names, name, true)
          : removeNameAtIndex(names, index),
      );
    }

    set({
      random_name_list_input: nextInput,
      random_name_current_winner: name,
      random_name_current_picked_at: generatedAt,
      random_name_active_history_id: entry.id,
      random_name_history: [entry, ...state.random_name_history].slice(
        0,
        RANDOM_NAME_HISTORY_LIMIT,
      ),
    });
    schedulePersist();
  },
  clearRandomNameHistory: () => {
    set({
      random_name_history: [],
      random_name_active_history_id: null,
    });
    schedulePersist();
  },
  restoreRandomNameHistoryEntry: (id) => {
    const entry = get().random_name_history.find((item) => item.id === id);
    if (!entry) return;
    set({
      random_name_current_winner: entry.name,
      random_name_current_picked_at: entry.generatedAt,
      random_name_active_history_id: entry.id,
    });
    schedulePersist();
  },
  toggleRandomNameOptionsDocked: () => {
    set((state) => ({
      random_name_options_docked: !state.random_name_options_docked,
    }));
    schedulePersist();
  },
  setRandomNameHistoryPanelOpen: (open) => {
    set({ random_name_history_panel_open: open });
    schedulePersist();
  },
}));
