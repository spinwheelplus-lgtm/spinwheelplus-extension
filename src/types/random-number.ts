export const RANDOM_NUMBER_COUNT_PRESETS = [1, 2, 3, 5, 10] as const;

export type RandomNumberCountPreset =
  (typeof RANDOM_NUMBER_COUNT_PRESETS)[number];

export type RandomNumberCountMode = RandomNumberCountPreset | "custom";

export type RandomNumberHistoryEntry = {
  id: string;
  numbers: number[];
  generatedAt: number;
};

export const RANDOM_NUMBER_RESULT_DISPLAY_LIMIT = 30;

export const RANDOM_NUMBER_HISTORY_LIMIT = 100;

export const RANDOM_NUMBER_STORE_PERSIST_KEY = "spinwheelplus.random-number.v1";
