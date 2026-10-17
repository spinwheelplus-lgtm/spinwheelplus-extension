import { RANDOM_NAME_SAMPLE_LIST } from "@/lib/random-name/sample-name-list";
import {
  RANDOM_NAME_HISTORY_LIMIT,
  RANDOM_NAME_STORE_PERSIST_KEY,
  type RandomNameHistoryEntry,
} from "@/types/random-name";

export type RandomNamePersistState = {
  random_name_list_input: string;
  random_name_remove_winner: boolean;
  random_name_deduplicate_names: boolean;
  random_name_roll_animation: boolean;
  random_name_sound_enabled: boolean;
  random_name_current_winner: string | null;
  random_name_current_picked_at: number | null;
  random_name_history: RandomNameHistoryEntry[];
  random_name_active_history_id: string | null;
  random_name_options_docked: boolean;
  random_name_history_panel_open: boolean;
};

export const RANDOM_NAME_PERSIST_DEFAULTS: RandomNamePersistState = {
  random_name_list_input: RANDOM_NAME_SAMPLE_LIST,
  random_name_remove_winner: false,
  random_name_deduplicate_names: false,
  random_name_roll_animation: true,
  random_name_sound_enabled: true,
  random_name_current_winner: null,
  random_name_current_picked_at: null,
  random_name_history: [],
  random_name_active_history_id: null,
  random_name_options_docked: true,
  random_name_history_panel_open: true,
};

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

const parseHistory = (value: unknown): RandomNameHistoryEntry[] => {
  if (!Array.isArray(value)) return [];
  const rows: RandomNameHistoryEntry[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    if (typeof row.id !== "string" || row.id.length === 0) continue;
    if (typeof row.name !== "string" || row.name.length === 0) continue;
    if (typeof row.generatedAt !== "number" || !Number.isFinite(row.generatedAt)) {
      continue;
    }
    rows.push({ id: row.id, name: row.name, generatedAt: row.generatedAt });
    if (rows.length >= RANDOM_NAME_HISTORY_LIMIT) break;
  }
  return rows;
};

export const parseRandomNamePersist = (
  value: unknown,
): Partial<RandomNamePersistState> | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const parsed: Partial<RandomNamePersistState> = {};

  if (typeof row.random_name_list_input === "string") {
    parsed.random_name_list_input = row.random_name_list_input;
  }
  if (typeof row.random_name_remove_winner === "boolean") {
    parsed.random_name_remove_winner = row.random_name_remove_winner;
  }
  if (typeof row.random_name_deduplicate_names === "boolean") {
    parsed.random_name_deduplicate_names = row.random_name_deduplicate_names;
  }
  if (typeof row.random_name_roll_animation === "boolean") {
    parsed.random_name_roll_animation = row.random_name_roll_animation;
  }
  if (typeof row.random_name_sound_enabled === "boolean") {
    parsed.random_name_sound_enabled = row.random_name_sound_enabled;
  }
  if (
    row.random_name_current_winner === null ||
    typeof row.random_name_current_winner === "string"
  ) {
    parsed.random_name_current_winner = row.random_name_current_winner;
  }
  if (
    row.random_name_current_picked_at === null ||
    typeof row.random_name_current_picked_at === "number"
  ) {
    parsed.random_name_current_picked_at = row.random_name_current_picked_at;
  }
  if (Array.isArray(row.random_name_history)) {
    parsed.random_name_history = parseHistory(row.random_name_history);
  }
  if (
    row.random_name_active_history_id === null ||
    typeof row.random_name_active_history_id === "string"
  ) {
    parsed.random_name_active_history_id = row.random_name_active_history_id;
  }
  if (typeof row.random_name_options_docked === "boolean") {
    parsed.random_name_options_docked = row.random_name_options_docked;
  }
  if (typeof row.random_name_history_panel_open === "boolean") {
    parsed.random_name_history_panel_open = row.random_name_history_panel_open;
  }

  return parsed;
};

export const loadRandomNamePersist =
  async (): Promise<Partial<RandomNamePersistState> | null> => {
    try {
      if (hasChromeStorage()) {
        const result = await chrome.storage.local.get(
          RANDOM_NAME_STORE_PERSIST_KEY,
        );
        return parseRandomNamePersist(result[RANDOM_NAME_STORE_PERSIST_KEY]);
      }
      const raw = localStorage.getItem(RANDOM_NAME_STORE_PERSIST_KEY);
      return raw ? parseRandomNamePersist(JSON.parse(raw) as unknown) : null;
    } catch {
      return null;
    }
  };

export const saveRandomNamePersist = async (
  state: RandomNamePersistState,
): Promise<void> => {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({
        [RANDOM_NAME_STORE_PERSIST_KEY]: state,
      });
      return;
    }
    localStorage.setItem(
      RANDOM_NAME_STORE_PERSIST_KEY,
      JSON.stringify(state),
    );
  } catch {
    // Quota or private mode: keep working in memory.
  }
};
