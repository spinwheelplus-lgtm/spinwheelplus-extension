import { FLIP_A_COIN_ASSETS, type FlipCoinMetal } from "@/lib/coin-flip/flip-a-coin-assets";
import { createDefaultFlipCoinSlots } from "@/lib/coin-flip/create-flip-coin-slot";
import {
  DEFAULT_FLIP_COIN_FACE_STYLE,
  flipCoinFacesMatch,
  parseFlipCoinFaceStyle,
  parseFlipCoinHistoryFaceLabels,
  serializeFlipCoinFaceStyle,
  type FlipCoinFaceStyle,
} from "@/lib/coin-flip/flip-coin-face-style";
import {
  COIN_FLIP_STORE_PERSIST_KEY,
  DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
  FLIP_COIN_HISTORY_LIMIT,
  MAX_FLIP_COIN_COUNT,
  type FlipCoinClickFlipMode,
  type FlipCoinHistoryEntry,
  type FlipCoinSlot,
} from "@/types/coin-flip";

export type CoinFlipPersistState = {
  coin_slots: Array<{ id: string; metal: FlipCoinMetal }>;
  click_flip_mode: FlipCoinClickFlipMode;
  sound_on: boolean;
  flip_history: FlipCoinHistoryEntry[];
  face: ReturnType<typeof serializeFlipCoinFaceStyle>;
};

const METAL_SET = new Set<string>(Object.keys(FLIP_A_COIN_ASSETS));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value != null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isMetal = (value: unknown): value is FlipCoinMetal =>
  typeof value === "string" && METAL_SET.has(value);

const isClickMode = (value: unknown): value is FlipCoinClickFlipMode =>
  value === "all" || value === "one";

const isSide = (value: unknown): value is "heads" | "tails" =>
  value === "heads" || value === "tails";

const parseSlot = (value: unknown): FlipCoinSlot | null => {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string" || value.id.trim().length === 0) return null;
  if (!isMetal(value.metal)) return null;
  return { id: value.id, metal: value.metal };
};

const parseHistoryEntry = (value: unknown): FlipCoinHistoryEntry | null => {
  if (!isRecord(value)) return null;
  const { id, flipped_at, values } = value;
  if (typeof id !== "string" || id.trim().length === 0) return null;
  if (!isFiniteNumber(flipped_at)) return null;
  if (!Array.isArray(values) || values.length < 1) return null;
  const parsedValues: Array<"heads" | "tails" | null> = [];
  for (const entry of values) {
    if (entry == null) {
      parsedValues.push(null);
      continue;
    }
    if (!isSide(entry)) return null;
    parsedValues.push(entry);
  }
  const faceLabels = parseFlipCoinHistoryFaceLabels(value.face_labels);
  return {
    id,
    flipped_at,
    values: parsedValues,
    ...(faceLabels != null ? { face_labels: faceLabels } : {}),
  };
};

export const createDefaultFlipCoinTableSlots = (): FlipCoinSlot[] =>
  createDefaultFlipCoinSlots();

export const isDefaultFlipCoinSetup = (
  slots: readonly FlipCoinSlot[],
  clickFlipMode: FlipCoinClickFlipMode,
  faceStyle: FlipCoinFaceStyle = DEFAULT_FLIP_COIN_FACE_STYLE,
): boolean =>
  slots.length === 1 &&
  slots[0]?.metal === "gold" &&
  clickFlipMode === DEFAULT_FLIP_COIN_CLICK_FLIP_MODE &&
  flipCoinFacesMatch(faceStyle, DEFAULT_FLIP_COIN_FACE_STYLE);

export const prependFlipCoinHistoryEntry = (
  entries: readonly FlipCoinHistoryEntry[],
  entry: FlipCoinHistoryEntry,
): FlipCoinHistoryEntry[] =>
  [entry, ...entries].slice(0, FLIP_COIN_HISTORY_LIMIT);

export const COIN_FLIP_PERSIST_DEFAULTS: CoinFlipPersistState = {
  coin_slots: [],
  click_flip_mode: DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
  sound_on: true,
  flip_history: [],
  face: serializeFlipCoinFaceStyle(DEFAULT_FLIP_COIN_FACE_STYLE),
};

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

export const parseCoinFlipPersist = (
  value: unknown,
): Partial<CoinFlipPersistState> | null => {
  if (!isRecord(value)) return null;
  const parsed: Partial<CoinFlipPersistState> = {};

  if (Array.isArray(value.coin_slots)) {
    const slots: CoinFlipPersistState["coin_slots"] = [];
    for (const entry of value.coin_slots) {
      const slot = parseSlot(entry);
      if (slot == null) {
        slots.length = 0;
        break;
      }
      slots.push(slot);
      if (slots.length >= MAX_FLIP_COIN_COUNT) break;
    }
    if (slots.length > 0) parsed.coin_slots = slots;
  }
  if (isClickMode(value.click_flip_mode)) {
    parsed.click_flip_mode = value.click_flip_mode;
  }
  if (typeof value.sound_on === "boolean") parsed.sound_on = value.sound_on;
  parsed.face = serializeFlipCoinFaceStyle(parseFlipCoinFaceStyle(value.face));
  if (Array.isArray(value.flip_history)) {
    const entries: FlipCoinHistoryEntry[] = [];
    for (const entry of value.flip_history) {
      const parsedEntry = parseHistoryEntry(entry);
      if (parsedEntry == null) continue;
      entries.push(parsedEntry);
      if (entries.length >= FLIP_COIN_HISTORY_LIMIT) break;
    }
    parsed.flip_history = entries;
  }
  return parsed;
};

export const hydrateCoinSlotsFromPersist = (
  saved: Partial<CoinFlipPersistState> | null,
): FlipCoinSlot[] => {
  const rows = saved?.coin_slots;
  if (rows == null || rows.length === 0) return createDefaultFlipCoinTableSlots();
  const slots: FlipCoinSlot[] = [];
  for (const row of rows) {
    const slot = parseSlot(row);
    if (slot == null) return createDefaultFlipCoinTableSlots();
    slots.push(slot);
  }
  return slots;
};

export const loadCoinFlipPersist =
  async (): Promise<Partial<CoinFlipPersistState> | null> => {
    try {
      if (hasChromeStorage()) {
        const result = await chrome.storage.local.get(COIN_FLIP_STORE_PERSIST_KEY);
        return parseCoinFlipPersist(result[COIN_FLIP_STORE_PERSIST_KEY]);
      }
      const raw = localStorage.getItem(COIN_FLIP_STORE_PERSIST_KEY);
      return raw ? parseCoinFlipPersist(JSON.parse(raw) as unknown) : null;
    } catch {
      return null;
    }
  };

export const saveCoinFlipPersist = async (
  state: CoinFlipPersistState,
): Promise<void> => {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [COIN_FLIP_STORE_PERSIST_KEY]: state });
      return;
    }
    localStorage.setItem(COIN_FLIP_STORE_PERSIST_KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode.
  }
};
