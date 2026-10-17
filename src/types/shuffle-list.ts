export type ShuffleListHistoryEntry = {
  id: string;
  items: string[];
  generatedAt: number;
};

export const SHUFFLE_LIST_HISTORY_PREVIEW_LIMIT = 12;

export const SHUFFLE_LIST_HISTORY_LIMIT = 50;

export const SHUFFLE_LIST_STORE_PERSIST_KEY = "spinwheelplus.shuffle-list.v1";
