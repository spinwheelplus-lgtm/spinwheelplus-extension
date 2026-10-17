import { createRollDiceSlotFromConfig } from "@/lib/dice-roller/create-roll-dice-slot";
import { parseRollDiceAppearance } from "@/lib/dice-roller/d6-face-words";
import { clampRollDiceModifier } from "@/lib/dice-roller/roll-dice-modifier";
import type {
    DiceSides,
    RollDiceAppearance,
    RollDiceClickRollMode,
    RollDiceSlot,
} from "@/types/dice-roller";
import {
    DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
    MAX_ROLL_DICE_COUNT,
    SUPPORTED_DICE_SIDES,
} from "@/types/dice-roller";

export const ROLL_DICE_TABLE_EXPORT_FORMAT =
    "spinwheelplus-roll-dice-table" as const;

export const ROLL_DICE_TABLE_EXPORT_VERSION = 2 as const;

export type RollDiceTableExportSlotV1 = {
    sides: DiceSides;
    appearance: RollDiceAppearance;
};

export type RollDiceTableExportV2 = {
    format: typeof ROLL_DICE_TABLE_EXPORT_FORMAT;
    version: typeof ROLL_DICE_TABLE_EXPORT_VERSION;
    exported_at: number;
    modifier: number;
    click_roll_mode: RollDiceClickRollMode;
    slots: RollDiceTableExportSlotV1[];
};

export type ParseRollDiceTableImportResult =
    | {
          ok: true;
          slots: RollDiceSlot[];
          modifier?: number;
          clickRollMode?: RollDiceClickRollMode;
      }
    | { ok: false; error: string };

const SUPPORTED_SIDES_SET = new Set<number>(SUPPORTED_DICE_SIDES);

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value != null && !Array.isArray(value);

const isDiceSides = (value: unknown): value is DiceSides =>
    typeof value === "number" && SUPPORTED_SIDES_SET.has(value);

const isRollDiceClickRollMode = (
    value: unknown,
): value is RollDiceClickRollMode => value === "all" || value === "one";

const parseAppearance = parseRollDiceAppearance;

const parseExportSlot = (
    value: unknown,
): RollDiceTableExportSlotV1 | null => {
    if (!isRecord(value)) {
        return null;
    }

    const { sides, appearance } = value;
    if (!isDiceSides(sides)) {
        return null;
    }

    const parsedAppearance = parseAppearance(appearance);
    if (parsedAppearance == null) {
        return null;
    }

    return { sides, appearance: parsedAppearance };
};

const slotsFromExportEntries = (
    entries: readonly RollDiceTableExportSlotV1[],
): RollDiceSlot[] =>
    entries.map((entry) =>
        createRollDiceSlotFromConfig(entry.sides, entry.appearance),
    );

const parseSlotsArray = (
    value: unknown,
): ParseRollDiceTableImportResult => {
    if (!Array.isArray(value)) {
        return { ok: false, error: "Missing or invalid dice list." };
    }

    if (value.length < 1 || value.length > MAX_ROLL_DICE_COUNT) {
        return {
            ok: false,
            error: `Dice count must be between 1 and ${MAX_ROLL_DICE_COUNT}.`,
        };
    }

    const entries: RollDiceTableExportSlotV1[] = [];
    for (const entry of value) {
        const slot = parseExportSlot(entry);
        if (slot == null) {
            return { ok: false, error: "Invalid die entry in file." };
        }
        entries.push(slot);
    }

    return { ok: true, slots: slotsFromExportEntries(entries) };
};

const parseModifierField = (value: unknown): number | null => {
    if (value == null) {
        return 0;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return null;
    }
    return clampRollDiceModifier(value);
};

const parseClickRollModeField = (
    value: unknown,
): RollDiceClickRollMode | null | undefined => {
    if (value == null) {
        return undefined;
    }
    return isRollDiceClickRollMode(value) ? value : null;
};

export const buildRollDiceTableExport = (
    slots: readonly RollDiceSlot[],
    modifier = 0,
    clickRollMode: RollDiceClickRollMode = DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
): RollDiceTableExportV2 => ({
    format: ROLL_DICE_TABLE_EXPORT_FORMAT,
    version: ROLL_DICE_TABLE_EXPORT_VERSION,
    exported_at: Date.now(),
    modifier: clampRollDiceModifier(modifier),
    click_roll_mode: clickRollMode,
    slots: slots.map((slot) => ({
        sides: slot.sides,
        appearance: slot.appearance,
    })),
});

export const formatRollDiceTableExport = (
    slots: readonly RollDiceSlot[],
    modifier = 0,
    clickRollMode: RollDiceClickRollMode = DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
): string =>
    JSON.stringify(
        buildRollDiceTableExport(slots, modifier, clickRollMode),
        null,
        2,
    );

export const parseRollDiceTableImport = (
    raw: unknown,
): ParseRollDiceTableImportResult => {
    if (!isRecord(raw)) {
        return { ok: false, error: "Invalid JSON file." };
    }

    if (raw.format === ROLL_DICE_TABLE_EXPORT_FORMAT) {
        if (raw.version !== ROLL_DICE_TABLE_EXPORT_VERSION) {
            return {
                ok: false,
                error: `Unsupported export version (${String(raw.version)}).`,
            };
        }

        const parsedModifier = parseModifierField(raw.modifier);
        if (parsedModifier == null) {
            return { ok: false, error: "Invalid modifier in file." };
        }

        const parsedClickRollMode = parseClickRollModeField(raw.click_roll_mode);
        if (parsedClickRollMode == null) {
            return {
                ok: false,
                error: "Invalid or missing click_roll_mode in file.",
            };
        }

        const slotsResult = parseSlotsArray(raw.slots);
        if (!slotsResult.ok) {
            return slotsResult;
        }

        return {
            ok: true,
            slots: slotsResult.slots,
            modifier: parsedModifier,
            clickRollMode: parsedClickRollMode,
        };
    }

    return {
        ok: false,
        error: "Unrecognized dice table file format.",
    };
};

export const parseRollDiceTableImportText = (
    text: string,
): ParseRollDiceTableImportResult => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
        return { ok: false, error: "File is empty." };
    }

    try {
        return parseRollDiceTableImport(JSON.parse(trimmed) as unknown);
    } catch {
        return { ok: false, error: "Could not parse JSON." };
    }
};
