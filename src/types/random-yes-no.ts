export type RandomYesNoAnswerMode =
  | "yes_no"
  | "yes_no_maybe"
  | "true_false"
  | "custom";

export type RandomYesNoAnimationType =
  | "picker"
  | "flip"
  | "fade"
  | "typewriter";

export type RandomYesNoHistoryEntry = {
  id: string;
  answer: string;
  question: string;
  generatedAt: number;
};

export const RANDOM_YES_NO_HISTORY_LIMIT = 200;

export const RANDOM_YES_NO_STORE_PERSIST_KEY = "spinwheelplus.yes-or-no.v1";

export const RANDOM_YES_NO_MIN_CUSTOM_ANSWERS = 2;

export const RANDOM_YES_NO_DEFAULT_CUSTOM_ANSWERS_TEXT =
  "Pizza\nBurger\nSushi\nPho\nKFC\nMcDonald's";

export const RANDOM_YES_NO_ANSWER_MODES: readonly RandomYesNoAnswerMode[] = [
  "yes_no",
  "yes_no_maybe",
  "true_false",
  "custom",
];

export const RANDOM_YES_NO_ANIMATION_TYPES: readonly RandomYesNoAnimationType[] =
  ["picker", "flip", "fade", "typewriter"];
