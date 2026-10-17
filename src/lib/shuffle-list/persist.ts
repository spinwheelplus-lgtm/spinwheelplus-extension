import { SHUFFLE_LIST_SAMPLE_LIST } from "@/lib/shuffle-list/sample-shuffle-list";
import {
  SHUFFLE_LIST_HISTORY_LIMIT,
  SHUFFLE_LIST_STORE_PERSIST_KEY,
  type ShuffleListHistoryEntry,
} from "@/types/shuffle-list";

export type ShuffleListPersistState = {
  shuffle_list_input: string;
  shuffle_list_ignore_empty_lines: boolean;
  shuffle_list_remove_duplicates: boolean;
  shuffle_list_sound_enabled: boolean;
  shuffle_list_current_items: string[];
  shuffle_list_current_shuffled_at: number | null;
  shuffle_list_history: ShuffleListHistoryEntry[];
  shuffle_list_active_history_id: string | null;
  shuffle_list_options_docked: boolean;
};

export const SHUFFLE_LIST_PERSIST_DEFAULTS: ShuffleListPersistState = {
  shuffle_list_input: SHUFFLE_LIST_SAMPLE_LIST,
  shuffle_list_ignore_empty_lines: true,
  shuffle_list_remove_duplicates: false,
  shuffle_list_sound_enabled: true,
  shuffle_list_current_items: [],
  shuffle_list_current_shuffled_at: null,
  shuffle_list_history: [],
  shuffle_list_active_history_id: null,
  shuffle_list_options_docked: true,
};

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

const parseItems = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) return null;
  const items: string[] = [];
  for (const item of value) {
    if (typeof item === "string") items.push(item);
  }
  return items;
};

const parseHistory = (value: unknown): ShuffleListHistoryEntry[] => {
  if (!Array.isArray(value)) return [];
  const rows: ShuffleListHistoryEntry[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    if (typeof row.id !== "string" || row.id.length === 0) continue;
    if (typeof row.generatedAt !== "number" || !Number.isFinite(row.generatedAt)) {
      continue;
    }
    const items = parseItems(row.items);
    if (!items) continue;
    rows.push({ id: row.id, items, generatedAt: row.generatedAt });
    if (rows.length >= SHUFFLE_LIST_HISTORY_LIMIT) break;
  }
  return rows;
};

export const parseShuffleListPersist = (
  value: unknown,
): Partial<ShuffleListPersistState> | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const parsed: Partial<ShuffleListPersistState> = {};

  if (typeof row.shuffle_list_input === "string") {
    parsed.shuffle_list_input = row.shuffle_list_input;
  }
  if (typeof row.shuffle_list_ignore_empty_lines === "boolean") {
    parsed.shuffle_list_ignore_empty_lines = row.shuffle_list_ignore_empty_lines;
  }
  if (typeof row.shuffle_list_remove_duplicates === "boolean") {
    parsed.shuffle_list_remove_duplicates = row.shuffle_list_remove_duplicates;
  }
  if (typeof row.shuffle_list_sound_enabled === "boolean") {
    parsed.shuffle_list_sound_enabled = row.shuffle_list_sound_enabled;
  }
  const currentItems = parseItems(row.shuffle_list_current_items);
  if (currentItems) {
    parsed.shuffle_list_current_items = currentItems;
  }
  if (
    row.shuffle_list_current_shuffled_at === null ||
    typeof row.shuffle_list_current_shuffled_at === "number"
  ) {
    parsed.shuffle_list_current_shuffled_at = row.shuffle_list_current_shuffled_at;
  }
  if (Array.isArray(row.shuffle_list_history)) {
    parsed.shuffle_list_history = parseHistory(row.shuffle_list_history);
  }
  if (
    row.shuffle_list_active_history_id === null ||
    typeof row.shuffle_list_active_history_id === "string"
  ) {
    parsed.shuffle_list_active_history_id = row.shuffle_list_active_history_id;
  }
  if (typeof row.shuffle_list_options_docked === "boolean") {
    parsed.shuffle_list_options_docked = row.shuffle_list_options_docked;
  }

  return parsed;
};

export const loadShuffleListPersist =
  async (): Promise<Partial<ShuffleListPersistState> | null> => {
    try {
      if (hasChromeStorage()) {
        const result = await chrome.storage.local.get(
          SHUFFLE_LIST_STORE_PERSIST_KEY,
        );
        return parseShuffleListPersist(result[SHUFFLE_LIST_STORE_PERSIST_KEY]);
      }
      const raw = localStorage.getItem(SHUFFLE_LIST_STORE_PERSIST_KEY);
      return raw ? parseShuffleListPersist(JSON.parse(raw) as unknown) : null;
    } catch {
      return null;
    }
  };

export const saveShuffleListPersist = async (
  state: ShuffleListPersistState,
): Promise<void> => {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({
        [SHUFFLE_LIST_STORE_PERSIST_KEY]: state,
      });
      return;
    }
    localStorage.setItem(SHUFFLE_LIST_STORE_PERSIST_KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode: keep working in memory.
  }
};
