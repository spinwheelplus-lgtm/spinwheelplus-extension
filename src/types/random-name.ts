export type RandomNameHistoryEntry = {
  id: string;
  name: string;
  generatedAt: number;
};

export const RANDOM_NAME_HISTORY_LIMIT = 100;

export const RANDOM_NAME_STORE_PERSIST_KEY = "spinwheelplus.random-name.v1";
