import { clampRandomNumberBound } from "@/lib/random-number/clamp-random-number-bound";
import { clampRandomNumberCustomCount } from "@/lib/random-number/parse-random-number-custom-count";
import {
  RANDOM_NUMBER_COUNT_PRESETS,
  RANDOM_NUMBER_HISTORY_LIMIT,
  RANDOM_NUMBER_STORE_PERSIST_KEY,
  type RandomNumberCountMode,
  type RandomNumberHistoryEntry,
} from "@/types/random-number";

export type RandomNumberPersistState = {
  random_number_min: number;
  random_number_max: number;
  random_number_exclude_input: string;
  random_number_count_mode: RandomNumberCountMode;
  random_number_custom_count: number;
  random_number_allow_duplicates: boolean;
  random_number_roll_animation: boolean;
  random_number_sound_enabled: boolean;
  random_number_current_numbers: number[];
  random_number_current_generated_at: number | null;
  random_number_history: RandomNumberHistoryEntry[];
  random_number_active_history_id: string | null;
  random_number_options_docked: boolean;
  random_number_history_panel_open: boolean;
};

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

const isCountMode = (value: unknown): value is RandomNumberCountMode => {
  if (value === "custom") return true;
  return (
    typeof value === "number" &&
    RANDOM_NUMBER_COUNT_PRESETS.includes(
      value as (typeof RANDOM_NUMBER_COUNT_PRESETS)[number],
    )
  );
};

const parseHistory = (value: unknown): RandomNumberHistoryEntry[] => {
  if (!Array.isArray(value)) return [];
  const rows: RandomNumberHistoryEntry[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    if (typeof row.id !== "string" || row.id.length === 0) continue;
    if (!Array.isArray(row.numbers)) continue;
    const numbers = row.numbers.filter(
      (item): item is number => typeof item === "number" && Number.isFinite(item),
    );
    if (typeof row.generatedAt !== "number" || !Number.isFinite(row.generatedAt)) {
      continue;
    }
    rows.push({ id: row.id, numbers, generatedAt: row.generatedAt });
    if (rows.length >= RANDOM_NUMBER_HISTORY_LIMIT) break;
  }
  return rows;
};

export const parseRandomNumberPersist = (
  value: unknown,
): Partial<RandomNumberPersistState> | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const parsed: Partial<RandomNumberPersistState> = {};

  if (typeof row.random_number_min === "number") {
    parsed.random_number_min = clampRandomNumberBound(row.random_number_min);
  }
  if (typeof row.random_number_max === "number") {
    parsed.random_number_max = clampRandomNumberBound(row.random_number_max);
  }
  if (typeof row.random_number_exclude_input === "string") {
    parsed.random_number_exclude_input = row.random_number_exclude_input;
  }
  if (isCountMode(row.random_number_count_mode)) {
    parsed.random_number_count_mode = row.random_number_count_mode;
  }
  if (typeof row.random_number_custom_count === "number") {
    parsed.random_number_custom_count = clampRandomNumberCustomCount(
      row.random_number_custom_count,
    );
  }
  if (typeof row.random_number_allow_duplicates === "boolean") {
    parsed.random_number_allow_duplicates = row.random_number_allow_duplicates;
  }
  if (typeof row.random_number_roll_animation === "boolean") {
    parsed.random_number_roll_animation = row.random_number_roll_animation;
  }
  if (typeof row.random_number_sound_enabled === "boolean") {
    parsed.random_number_sound_enabled = row.random_number_sound_enabled;
  }
  if (Array.isArray(row.random_number_current_numbers)) {
    parsed.random_number_current_numbers =
      row.random_number_current_numbers.filter(
        (item): item is number =>
          typeof item === "number" && Number.isFinite(item),
      );
  }
  if (
    row.random_number_current_generated_at === null ||
    typeof row.random_number_current_generated_at === "number"
  ) {
    parsed.random_number_current_generated_at =
      row.random_number_current_generated_at;
  }
  if (Array.isArray(row.random_number_history)) {
    parsed.random_number_history = parseHistory(row.random_number_history);
  }
  if (
    row.random_number_active_history_id === null ||
    typeof row.random_number_active_history_id === "string"
  ) {
    parsed.random_number_active_history_id =
      row.random_number_active_history_id;
  }
  if (typeof row.random_number_options_docked === "boolean") {
    parsed.random_number_options_docked = row.random_number_options_docked;
  }
  if (typeof row.random_number_history_panel_open === "boolean") {
    parsed.random_number_history_panel_open = row.random_number_history_panel_open;
  }

  return parsed;
};

export const loadRandomNumberPersist =
  async (): Promise<Partial<RandomNumberPersistState> | null> => {
    try {
      if (hasChromeStorage()) {
        const result = await chrome.storage.local.get(
          RANDOM_NUMBER_STORE_PERSIST_KEY,
        );
        return parseRandomNumberPersist(
          result[RANDOM_NUMBER_STORE_PERSIST_KEY],
        );
      }
      const raw = localStorage.getItem(RANDOM_NUMBER_STORE_PERSIST_KEY);
      return raw
        ? parseRandomNumberPersist(JSON.parse(raw) as unknown)
        : null;
    } catch {
      return null;
    }
  };

export const saveRandomNumberPersist = async (
  state: RandomNumberPersistState,
): Promise<void> => {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({
        [RANDOM_NUMBER_STORE_PERSIST_KEY]: state,
      });
      return;
    }
    localStorage.setItem(
      RANDOM_NUMBER_STORE_PERSIST_KEY,
      JSON.stringify(state),
    );
  } catch {
    // Quota or private mode: keep working in memory.
  }
};
