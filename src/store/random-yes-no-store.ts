import { create } from "zustand";

import {
  DEFAULT_RANDOM_YES_NO_PERSIST,
  loadRandomYesNoPersist,
  saveRandomYesNoPersist,
  type RandomYesNoPersistState,
} from "@/lib/random-yes-no/persist";
import {
  parseCustomAnswers,
  validateCustomAnswers,
} from "@/lib/random-yes-no/parse-custom-answers";
import { pickRandomYesNoAnswer } from "@/lib/random-yes-no/pick-random-answer";
import type { YesNoSetupFile } from "@/lib/random-yes-no/yes-no-setup-file";
import { resolveRandomYesNoAnswerPool } from "@/lib/random-yes-no/resolve-answer-pool";
import { readMessages } from "@/lib/i18n/use-messages";
import { createItemId } from "@/lib/random";
import {
  RANDOM_YES_NO_HISTORY_LIMIT,
  type RandomYesNoAnimationType,
  type RandomYesNoAnswerMode,
  type RandomYesNoHistoryEntry,
} from "@/types/random-yes-no";

type RandomYesNoStoreState = RandomYesNoPersistState & {
  ready: boolean;
  hydrate: () => Promise<void>;
  setRandomYesNoAnswerMode: (mode: RandomYesNoAnswerMode) => void;
  setRandomYesNoCustomAnswersText: (value: string) => void;
  setRandomYesNoAnimationType: (type: RandomYesNoAnimationType) => void;
  setRandomYesNoSoundEnabled: (enabled: boolean) => void;
  applyRandomYesNoSetup: (setup: YesNoSetupFile) => void;
  commitRandomYesNoAnswer: (answer: string) => void;
  restoreRandomYesNoHistoryEntry: (id: string) => void;
  clearRandomYesNoHistory: () => void;
  pickRandomYesNoAnswerForMode: () =>
    | { ok: true; answer: string; pool: readonly string[] }
    | { ok: false; error: string };
  toggleRandomYesNoOptionsDocked: () => void;
  setRandomYesNoHistoryPanelOpen: (open: boolean) => void;
};

const persistSlice = (
  state: RandomYesNoStoreState,
): RandomYesNoPersistState => ({
  random_yes_no_answer_mode: state.random_yes_no_answer_mode,
  random_yes_no_custom_answers_text: state.random_yes_no_custom_answers_text,
  random_yes_no_animation_type: state.random_yes_no_animation_type,
  random_yes_no_sound_enabled: state.random_yes_no_sound_enabled,
  random_yes_no_question: state.random_yes_no_question,
  random_yes_no_current_answer: state.random_yes_no_current_answer,
  random_yes_no_current_question: state.random_yes_no_current_question,
  random_yes_no_current_generated_at: state.random_yes_no_current_generated_at,
  random_yes_no_history: state.random_yes_no_history,
  random_yes_no_options_docked: state.random_yes_no_options_docked,
  random_yes_no_history_panel_open: state.random_yes_no_history_panel_open,
});

let persistTimer: number | null = null;

const schedulePersist = (): void => {
  if (persistTimer != null) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    void saveRandomYesNoPersist(persistSlice(useRandomYesNoStore.getState()));
  }, 200);
};

export const getRandomYesNoCustomAnswers = (
  state: Pick<RandomYesNoPersistState, "random_yes_no_custom_answers_text">,
): string[] => parseCustomAnswers(state.random_yes_no_custom_answers_text);

export const useRandomYesNoStore = create<RandomYesNoStoreState>((set, get) => ({
  ready: false,
  ...DEFAULT_RANDOM_YES_NO_PERSIST,
  hydrate: async () => {
    const saved = await loadRandomYesNoPersist();
    set({ ...(saved ?? {}), ready: true });
  },
  setRandomYesNoAnswerMode: (mode) => {
    set({ random_yes_no_answer_mode: mode });
    schedulePersist();
  },
  setRandomYesNoCustomAnswersText: (value) => {
    set({ random_yes_no_custom_answers_text: value });
    schedulePersist();
  },
  setRandomYesNoAnimationType: (type) => {
    set({ random_yes_no_animation_type: type });
    schedulePersist();
  },
  setRandomYesNoSoundEnabled: (enabled) => {
    set({ random_yes_no_sound_enabled: enabled });
    schedulePersist();
  },
  applyRandomYesNoSetup: (setup) => {
    set({
      random_yes_no_answer_mode: setup.answerMode,
      random_yes_no_custom_answers_text: setup.customAnswers,
      random_yes_no_animation_type: setup.animation,
      random_yes_no_sound_enabled: setup.soundEnabled,
    });
    schedulePersist();
  },
  commitRandomYesNoAnswer: (answer) => {
    const state = get();
    const generatedAt = Date.now();
    const entry: RandomYesNoHistoryEntry = {
      id: createItemId(),
      answer,
      question: "",
      generatedAt,
    };
    set({
      random_yes_no_current_answer: answer,
      random_yes_no_current_question: null,
      random_yes_no_current_generated_at: generatedAt,
      random_yes_no_history: [entry, ...state.random_yes_no_history].slice(
        0,
        RANDOM_YES_NO_HISTORY_LIMIT,
      ),
    });
    schedulePersist();
  },
  restoreRandomYesNoHistoryEntry: (id) => {
    const entry = get().random_yes_no_history.find((row) => row.id === id);
    if (!entry) return;
    set({
      random_yes_no_current_answer: entry.answer,
      random_yes_no_current_question: entry.question.trim() || null,
      random_yes_no_current_generated_at: entry.generatedAt,
    });
    schedulePersist();
  },
  clearRandomYesNoHistory: () => {
    set({
      random_yes_no_history: [],
      random_yes_no_current_answer: null,
      random_yes_no_current_question: null,
      random_yes_no_current_generated_at: null,
    });
    schedulePersist();
  },
  pickRandomYesNoAnswerForMode: () => {
    const state = get();
    const customAnswers = getRandomYesNoCustomAnswers(state);
    const pool = resolveRandomYesNoAnswerPool(
      state.random_yes_no_answer_mode,
      customAnswers,
    );

    if (state.random_yes_no_answer_mode === "custom") {
      const validationError = validateCustomAnswers(customAnswers);
      if (validationError) {
        return { ok: false, error: validationError };
      }
    }

    if (pool.length === 0) {
      return {
        ok: false,
        error: readMessages().ui.yesNo.needAnswers,
      };
    }

    return { ok: true, answer: pickRandomYesNoAnswer(pool), pool };
  },
  toggleRandomYesNoOptionsDocked: () => {
    set((state) => ({
      random_yes_no_options_docked: !state.random_yes_no_options_docked,
    }));
    schedulePersist();
  },
  setRandomYesNoHistoryPanelOpen: (open) => {
    set({ random_yes_no_history_panel_open: open });
    schedulePersist();
  },
}));
