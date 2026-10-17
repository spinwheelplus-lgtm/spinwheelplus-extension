import { create } from "zustand";

import { readMessages } from "@/lib/i18n/use-messages";
import { createItemId } from "@/lib/random";
import { shuffleNames } from "@/lib/random-name/shuffle-names";
import { prepareShuffleListItems } from "@/lib/shuffle-list/parse-shuffle-list";
import type { ShuffleListSetupFile } from "@/lib/shuffle-list/shuffle-list-setup-file";
import { playShuffleListRevealSound } from "@/lib/shuffle-list/play-shuffle-list-reveal-sound";
import {
  loadShuffleListPersist,
  saveShuffleListPersist,
  SHUFFLE_LIST_PERSIST_DEFAULTS,
  type ShuffleListPersistState,
} from "@/lib/shuffle-list/persist";
import {
  SHUFFLE_LIST_HISTORY_LIMIT,
  type ShuffleListHistoryEntry,
} from "@/types/shuffle-list";

type ShuffleListStoreState = ShuffleListPersistState & {
  ready: boolean;
  hydrate: () => Promise<void>;
  setShuffleListInput: (value: string) => void;
  setShuffleListIgnoreEmptyLines: (value: boolean) => void;
  setShuffleListRemoveDuplicates: (value: boolean) => void;
  setShuffleListSoundEnabled: (value: boolean) => void;
  applyShuffleListSetup: (setup: ShuffleListSetupFile) => void;
  clearShuffleListInput: () => void;
  shuffleList: () => string | null;
  clearShuffleListHistory: () => void;
  restoreShuffleListHistoryEntry: (id: string) => void;
  toggleShuffleListOptionsDocked: () => void;
};

export const getShuffleListPreparedCount = (
  state: Pick<
    ShuffleListPersistState,
    | "shuffle_list_input"
    | "shuffle_list_ignore_empty_lines"
    | "shuffle_list_remove_duplicates"
  >,
): number =>
  prepareShuffleListItems(state.shuffle_list_input, {
    ignoreEmptyLines: state.shuffle_list_ignore_empty_lines,
    removeDuplicates: state.shuffle_list_remove_duplicates,
  }).length;

const persistSlice = (
  state: ShuffleListStoreState,
): ShuffleListPersistState => ({
  shuffle_list_input: state.shuffle_list_input,
  shuffle_list_ignore_empty_lines: state.shuffle_list_ignore_empty_lines,
  shuffle_list_remove_duplicates: state.shuffle_list_remove_duplicates,
  shuffle_list_sound_enabled: state.shuffle_list_sound_enabled,
  shuffle_list_current_items: state.shuffle_list_current_items,
  shuffle_list_current_shuffled_at: state.shuffle_list_current_shuffled_at,
  shuffle_list_history: state.shuffle_list_history,
  shuffle_list_active_history_id: state.shuffle_list_active_history_id,
  shuffle_list_options_docked: state.shuffle_list_options_docked,
});

let persistTimer: number | null = null;

const schedulePersist = (): void => {
  if (persistTimer != null) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    void saveShuffleListPersist(persistSlice(useShuffleListStore.getState()));
  }, 200);
};

export const useShuffleListStore = create<ShuffleListStoreState>((set, get) => ({
  ready: false,
  ...SHUFFLE_LIST_PERSIST_DEFAULTS,
  hydrate: async () => {
    const saved = await loadShuffleListPersist();
    set({ ...SHUFFLE_LIST_PERSIST_DEFAULTS, ...(saved ?? {}), ready: true });
  },
  setShuffleListInput: (value) => {
    set({ shuffle_list_input: value });
    schedulePersist();
  },
  setShuffleListIgnoreEmptyLines: (value) => {
    set({ shuffle_list_ignore_empty_lines: value });
    schedulePersist();
  },
  setShuffleListRemoveDuplicates: (value) => {
    set({ shuffle_list_remove_duplicates: value });
    schedulePersist();
  },
  setShuffleListSoundEnabled: (value) => {
    set({ shuffle_list_sound_enabled: value });
    schedulePersist();
  },
  applyShuffleListSetup: (setup) => {
    set({
      shuffle_list_input: setup.items,
      shuffle_list_ignore_empty_lines: setup.ignoreEmptyLines,
      shuffle_list_remove_duplicates: setup.removeDuplicates,
      shuffle_list_sound_enabled: setup.soundEnabled,
    });
    schedulePersist();
  },
  clearShuffleListInput: () => {
    set({
      shuffle_list_input: "",
      shuffle_list_current_items: [],
      shuffle_list_current_shuffled_at: null,
      shuffle_list_active_history_id: null,
    });
    schedulePersist();
  },
  shuffleList: () => {
    const state = get();
    const pool = prepareShuffleListItems(state.shuffle_list_input, {
      ignoreEmptyLines: state.shuffle_list_ignore_empty_lines,
      removeDuplicates: state.shuffle_list_remove_duplicates,
    });

    if (pool.length === 0) {
      return readMessages().ui.shuffle.addItem;
    }

    const shuffled = pool.length === 1 ? [...pool] : shuffleNames(pool);
    const generatedAt = Date.now();
    const entry: ShuffleListHistoryEntry = {
      id: createItemId(),
      items: shuffled,
      generatedAt,
    };

    set({
      shuffle_list_current_items: shuffled,
      shuffle_list_current_shuffled_at: generatedAt,
      shuffle_list_active_history_id: entry.id,
      shuffle_list_history: [entry, ...state.shuffle_list_history].slice(
        0,
        SHUFFLE_LIST_HISTORY_LIMIT,
      ),
    });
    if (state.shuffle_list_sound_enabled) {
      playShuffleListRevealSound();
    }
    schedulePersist();
    return null;
  },
  clearShuffleListHistory: () => {
    set({
      shuffle_list_history: [],
      shuffle_list_active_history_id: null,
    });
    schedulePersist();
  },
  restoreShuffleListHistoryEntry: (id) => {
    const entry = get().shuffle_list_history.find((item) => item.id === id);
    if (!entry) return;
    set({
      shuffle_list_current_items: entry.items,
      shuffle_list_current_shuffled_at: entry.generatedAt,
      shuffle_list_active_history_id: entry.id,
    });
    schedulePersist();
  },
  toggleShuffleListOptionsDocked: () => {
    set((state) => ({
      shuffle_list_options_docked: !state.shuffle_list_options_docked,
    }));
    schedulePersist();
  },
}));
