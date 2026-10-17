import {
  RANDOM_YES_NO_ANIMATION_TYPES,
  RANDOM_YES_NO_ANSWER_MODES,
  RANDOM_YES_NO_DEFAULT_CUSTOM_ANSWERS_TEXT,
  RANDOM_YES_NO_HISTORY_LIMIT,
  RANDOM_YES_NO_STORE_PERSIST_KEY,
  type RandomYesNoAnimationType,
  type RandomYesNoAnswerMode,
  type RandomYesNoHistoryEntry,
} from "@/types/random-yes-no";

export type RandomYesNoPersistState = {
  random_yes_no_answer_mode: RandomYesNoAnswerMode;
  random_yes_no_custom_answers_text: string;
  random_yes_no_animation_type: RandomYesNoAnimationType;
  random_yes_no_sound_enabled: boolean;
  random_yes_no_question: string;
  random_yes_no_current_answer: string | null;
  random_yes_no_current_question: string | null;
  random_yes_no_current_generated_at: number | null;
  random_yes_no_history: RandomYesNoHistoryEntry[];
  random_yes_no_options_docked: boolean;
  random_yes_no_history_panel_open: boolean;
};

export const DEFAULT_RANDOM_YES_NO_PERSIST: RandomYesNoPersistState = {
  random_yes_no_answer_mode: "yes_no",
  random_yes_no_custom_answers_text: RANDOM_YES_NO_DEFAULT_CUSTOM_ANSWERS_TEXT,
  random_yes_no_animation_type: "picker",
  random_yes_no_sound_enabled: true,
  random_yes_no_question: "",
  random_yes_no_current_answer: null,
  random_yes_no_current_question: null,
  random_yes_no_current_generated_at: null,
  random_yes_no_history: [],
  random_yes_no_options_docked: true,
  random_yes_no_history_panel_open: true,
};

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

const isAnswerMode = (value: unknown): value is RandomYesNoAnswerMode =>
  typeof value === "string" &&
  (RANDOM_YES_NO_ANSWER_MODES as readonly string[]).includes(value);

const isAnimationType = (value: unknown): value is RandomYesNoAnimationType =>
  typeof value === "string" &&
  (RANDOM_YES_NO_ANIMATION_TYPES as readonly string[]).includes(value);

const parseHistory = (value: unknown): RandomYesNoHistoryEntry[] => {
  if (!Array.isArray(value)) return [];
  const rows: RandomYesNoHistoryEntry[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    if (typeof row.id !== "string" || row.id.length === 0) continue;
    if (typeof row.answer !== "string" || row.answer.length === 0) continue;
    if (typeof row.question !== "string") continue;
    if (typeof row.generatedAt !== "number" || !Number.isFinite(row.generatedAt)) {
      continue;
    }
    rows.push({
      id: row.id,
      answer: row.answer,
      question: row.question,
      generatedAt: row.generatedAt,
    });
    if (rows.length >= RANDOM_YES_NO_HISTORY_LIMIT) break;
  }
  return rows;
};

export const parseRandomYesNoPersist = (
  value: unknown,
): Partial<RandomYesNoPersistState> | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const parsed: Partial<RandomYesNoPersistState> = {};

  if (isAnswerMode(row.random_yes_no_answer_mode)) {
    parsed.random_yes_no_answer_mode = row.random_yes_no_answer_mode;
  }
  if (typeof row.random_yes_no_custom_answers_text === "string") {
    parsed.random_yes_no_custom_answers_text =
      row.random_yes_no_custom_answers_text;
  }
  if (isAnimationType(row.random_yes_no_animation_type)) {
    parsed.random_yes_no_animation_type = row.random_yes_no_animation_type;
  }
  if (typeof row.random_yes_no_sound_enabled === "boolean") {
    parsed.random_yes_no_sound_enabled = row.random_yes_no_sound_enabled;
  }
  if (typeof row.random_yes_no_question === "string") {
    parsed.random_yes_no_question = row.random_yes_no_question;
  }
  if (
    row.random_yes_no_current_answer === null ||
    typeof row.random_yes_no_current_answer === "string"
  ) {
    parsed.random_yes_no_current_answer = row.random_yes_no_current_answer;
  }
  if (
    row.random_yes_no_current_question === null ||
    typeof row.random_yes_no_current_question === "string"
  ) {
    parsed.random_yes_no_current_question = row.random_yes_no_current_question;
  }
  if (row.random_yes_no_current_generated_at === null) {
    parsed.random_yes_no_current_generated_at = null;
  } else if (
    typeof row.random_yes_no_current_generated_at === "number" &&
    Number.isFinite(row.random_yes_no_current_generated_at)
  ) {
    parsed.random_yes_no_current_generated_at =
      row.random_yes_no_current_generated_at;
  }
  if (Array.isArray(row.random_yes_no_history)) {
    parsed.random_yes_no_history = parseHistory(row.random_yes_no_history);
  }
  if (typeof row.random_yes_no_options_docked === "boolean") {
    parsed.random_yes_no_options_docked = row.random_yes_no_options_docked;
  }
  if (typeof row.random_yes_no_history_panel_open === "boolean") {
    parsed.random_yes_no_history_panel_open = row.random_yes_no_history_panel_open;
  }

  return parsed;
};

export const loadRandomYesNoPersist = async (): Promise<
  Partial<RandomYesNoPersistState> | null
> => {
  try {
    if (hasChromeStorage()) {
      const result = await chrome.storage.local.get(
        RANDOM_YES_NO_STORE_PERSIST_KEY,
      );
      return parseRandomYesNoPersist(result[RANDOM_YES_NO_STORE_PERSIST_KEY]);
    }
    const raw = localStorage.getItem(RANDOM_YES_NO_STORE_PERSIST_KEY);
    return raw ? parseRandomYesNoPersist(JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
};

export const saveRandomYesNoPersist = async (
  state: RandomYesNoPersistState,
): Promise<void> => {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({
        [RANDOM_YES_NO_STORE_PERSIST_KEY]: state,
      });
      return;
    }
    localStorage.setItem(
      RANDOM_YES_NO_STORE_PERSIST_KEY,
      JSON.stringify(state),
    );
  } catch {
    // Quota or private mode.
  }
};
