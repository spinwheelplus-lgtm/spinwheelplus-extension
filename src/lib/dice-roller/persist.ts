import { createInitialRollDiceSlot } from "@/lib/dice-roller/create-roll-dice-slot";
import {
    d6FaceWordsEqual,
    displayD6FaceWord,
    parseRollDiceAppearance,
} from "@/lib/dice-roller/d6-face-words";
import { getDiceTypeDefinition } from "@/lib/dice-roller/dice-type-registry";
import {
  clampRollDiceModifier,
  computeRollDiceFinalTotal,
} from "@/lib/dice-roller/roll-dice-modifier";
import {
  DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
  DICE_ROLLER_STORE_PERSIST_KEY,
  MAX_ROLL_DICE_COUNT,
  ROLL_DICE_HISTORY_LIMIT,
  SUPPORTED_DICE_SIDES,
  type DiceSides,
  type RollDiceAppearance,
  type RollDiceClickRollMode,
  type RollDiceHistoryEntry,
  type RollDiceSlot,
} from "@/types/dice-roller";

export type DiceRollerPersistState = {
  dice_slots: Array<{
    id: string;
    sides: DiceSides;
    appearance: RollDiceAppearance;
  }>;
  roll_modifier: number;
  click_roll_mode: RollDiceClickRollMode;
  sound_on: boolean;
  roll_history: RollDiceHistoryEntry[];
};

const SUPPORTED_SIDES_SET = new Set<number>(SUPPORTED_DICE_SIDES);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value != null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isDiceSides = (value: unknown): value is DiceSides =>
  typeof value === "number" && SUPPORTED_SIDES_SET.has(value);

const isClickRollMode = (value: unknown): value is RollDiceClickRollMode =>
  value === "all" || value === "one";

/** Drop a bad label list and keep the numeric row. */
const parseHistoryLabels = (
  value: unknown,
  length: number,
): Array<string | null> | undefined => {
  if (value == null) return undefined;
  if (!Array.isArray(value) || value.length !== length) return undefined;

  const labels: Array<string | null> = [];
  for (const entry of value) {
    if (entry == null) {
      labels.push(null);
      continue;
    }
    if (typeof entry !== "string") return undefined;
    const word = displayD6FaceWord(entry);
    labels.push(word === "" ? null : word);
  }

  if (labels.every((label) => label == null)) return undefined;
  return labels;
};

const randomRotationForSides = (sides: DiceSides) =>
  getDiceTypeDefinition(sides).randomizeInitialPose().rotation;

const parsePersistedSlot = (value: unknown): RollDiceSlot | null => {
  if (!isRecord(value)) return null;
  const { id, sides, appearance } = value;
  if (typeof id !== "string" || id.trim().length === 0) return null;
  if (!isDiceSides(sides)) return null;
  const parsedAppearance = parseRollDiceAppearance(appearance);
  if (parsedAppearance == null) return null;
  return {
    id,
    sides,
    rotation: randomRotationForSides(sides),
    result: null,
    appearance: parsedAppearance,
  };
};

const parseHistoryEntry = (value: unknown): RollDiceHistoryEntry | null => {
  if (!isRecord(value)) return null;
  const { id, rolledAt, total, values, dice_total, modifier, labels } = value;
  if (typeof id !== "string" || id.trim().length === 0) return null;
  if (!isFiniteNumber(rolledAt) || !isFiniteNumber(total)) return null;

  const parsedModifier =
    modifier == null
      ? 0
      : isFiniteNumber(modifier)
        ? clampRollDiceModifier(modifier)
        : null;
  if (parsedModifier == null) return null;

  const parsedDiceTotal =
    dice_total == null
      ? total
      : isFiniteNumber(dice_total)
        ? dice_total
        : null;
  if (parsedDiceTotal == null) return null;

  const parsedFinalTotal =
    dice_total == null && modifier == null
      ? total
      : computeRollDiceFinalTotal(parsedDiceTotal, parsedModifier);

  if (!Array.isArray(values) || values.length < 1) return null;

  const parsedValues: Array<number | null> = [];
  for (const entry of values) {
    if (entry == null) {
      parsedValues.push(null);
      continue;
    }
    if (!isFiniteNumber(entry) || entry < 1) return null;
    parsedValues.push(entry);
  }

  const parsedLabels = parseHistoryLabels(labels, parsedValues.length);

  return {
    id,
    rolledAt,
    dice_total: parsedDiceTotal,
    modifier: parsedModifier,
    total: parsedFinalTotal,
    values: parsedValues,
    ...(parsedLabels != null ? { labels: parsedLabels } : {}),
  };
};

export const createDefaultRollDiceTableSlots = (): RollDiceSlot[] => [
  createInitialRollDiceSlot(),
];

const appearancesMatch = (
  a: RollDiceAppearance,
  b: RollDiceAppearance,
): boolean =>
  a.bodyColor.toLowerCase() === b.bodyColor.toLowerCase() &&
  a.markColor.toLowerCase() === b.markColor.toLowerCase() &&
  a.d6FaceStyle === b.d6FaceStyle &&
  d6FaceWordsEqual(a.d6FaceWords, b.d6FaceWords);

export const isDefaultRollDiceSetup = (
  slots: readonly RollDiceSlot[],
  modifier: number,
  clickRollMode: RollDiceClickRollMode,
): boolean => {
  const defaults = createDefaultRollDiceTableSlots();
  if (slots.length !== defaults.length) return false;
  const slot = slots[0];
  const reference = defaults[0];
  if (slot == null || reference == null) return false;
  return (
    slot.sides === reference.sides &&
    appearancesMatch(slot.appearance, reference.appearance) &&
    clampRollDiceModifier(modifier) === 0 &&
    clickRollMode === DEFAULT_ROLL_DICE_CLICK_ROLL_MODE
  );
};

export const prependRollDiceHistoryEntry = (
  entries: readonly RollDiceHistoryEntry[],
  entry: RollDiceHistoryEntry,
): RollDiceHistoryEntry[] =>
  [entry, ...entries].slice(0, ROLL_DICE_HISTORY_LIMIT);

export const DICE_ROLLER_PERSIST_DEFAULTS: DiceRollerPersistState = {
  dice_slots: [],
  roll_modifier: 0,
  click_roll_mode: DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
  sound_on: true,
  roll_history: [],
};

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

export const parseDiceRollerPersist = (
  value: unknown,
): Partial<DiceRollerPersistState> | null => {
  if (!isRecord(value)) return null;
  const parsed: Partial<DiceRollerPersistState> = {};

  if (Array.isArray(value.dice_slots)) {
    const slots: DiceRollerPersistState["dice_slots"] = [];
    for (const entry of value.dice_slots) {
      const slot = parsePersistedSlot(entry);
      if (slot == null) {
        slots.length = 0;
        break;
      }
      slots.push({
        id: slot.id,
        sides: slot.sides,
        appearance: slot.appearance,
      });
      if (slots.length >= MAX_ROLL_DICE_COUNT) break;
    }
    if (slots.length > 0) parsed.dice_slots = slots;
  }

  if (isFiniteNumber(value.roll_modifier)) {
    parsed.roll_modifier = clampRollDiceModifier(value.roll_modifier);
  }
  if (isClickRollMode(value.click_roll_mode)) {
    parsed.click_roll_mode = value.click_roll_mode;
  }
  if (typeof value.sound_on === "boolean") {
    parsed.sound_on = value.sound_on;
  }
  if (Array.isArray(value.roll_history)) {
    const entries: RollDiceHistoryEntry[] = [];
    for (const entry of value.roll_history) {
      const parsedEntry = parseHistoryEntry(entry);
      if (parsedEntry == null) continue;
      entries.push(parsedEntry);
      if (entries.length >= ROLL_DICE_HISTORY_LIMIT) break;
    }
    parsed.roll_history = entries;
  }

  return parsed;
};

export const hydrateDiceSlotsFromPersist = (
  saved: Partial<DiceRollerPersistState> | null,
): RollDiceSlot[] => {
  const rows = saved?.dice_slots;
  if (rows == null || rows.length === 0) {
    return createDefaultRollDiceTableSlots();
  }
  const slots: RollDiceSlot[] = [];
  for (const row of rows) {
    const slot = parsePersistedSlot(row);
    if (slot == null) return createDefaultRollDiceTableSlots();
    slots.push(slot);
  }
  return slots;
};

export const loadDiceRollerPersist =
  async (): Promise<Partial<DiceRollerPersistState> | null> => {
    try {
      if (hasChromeStorage()) {
        const result = await chrome.storage.local.get(
          DICE_ROLLER_STORE_PERSIST_KEY,
        );
        return parseDiceRollerPersist(result[DICE_ROLLER_STORE_PERSIST_KEY]);
      }
      const raw = localStorage.getItem(DICE_ROLLER_STORE_PERSIST_KEY);
      return raw ? parseDiceRollerPersist(JSON.parse(raw) as unknown) : null;
    } catch {
      return null;
    }
  };

export const saveDiceRollerPersist = async (
  state: DiceRollerPersistState,
): Promise<void> => {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({
        [DICE_ROLLER_STORE_PERSIST_KEY]: state,
      });
      return;
    }
    localStorage.setItem(
      DICE_ROLLER_STORE_PERSIST_KEY,
      JSON.stringify(state),
    );
  } catch {
    // Quota or private mode: keep working in memory.
  }
};
