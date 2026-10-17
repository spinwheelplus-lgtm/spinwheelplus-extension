import { createFlipCoinSlotsFromMetals } from "@/lib/coin-flip/create-flip-coin-slot";
import type { FlipCoinMetal } from "@/lib/coin-flip/flip-a-coin-assets";
import { FLIP_A_COIN_ASSETS } from "@/lib/coin-flip/flip-a-coin-assets";
import {
    DEFAULT_FLIP_COIN_FACE_STYLE,
    parseFlipCoinFaceStyle,
    serializeFlipCoinFaceStyle,
    type FlipCoinFaceStyle,
} from "@/lib/coin-flip/flip-coin-face-style";
import type {
    FlipCoinClickFlipMode,
    FlipCoinSlot,
} from "@/types/coin-flip";
import {
    DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
    MAX_FLIP_COIN_COUNT,
} from "@/types/coin-flip";

export const FLIP_COIN_TABLE_EXPORT_FORMAT =
    "spinwheelplus-flip-coin-table" as const;

export const FLIP_COIN_TABLE_EXPORT_VERSION = 2 as const;
export const FLIP_COIN_TABLE_EXPORT_VERSION_LABELED = 3 as const;

export type FlipCoinTableExportSlotV1 = {
    metal: FlipCoinMetal;
};

export type FlipCoinTableExportV2 = {
    format: typeof FLIP_COIN_TABLE_EXPORT_FORMAT;
    version:
        | typeof FLIP_COIN_TABLE_EXPORT_VERSION
        | typeof FLIP_COIN_TABLE_EXPORT_VERSION_LABELED;
    exported_at: number;
    click_flip_mode: FlipCoinClickFlipMode;
    coins: FlipCoinTableExportSlotV1[];
    face?: ReturnType<typeof serializeFlipCoinFaceStyle>;
};

export type ParseFlipCoinTableImportResult =
    | {
          ok: true;
          slots: FlipCoinSlot[];
          clickFlipMode?: FlipCoinClickFlipMode;
          faceStyle: FlipCoinFaceStyle;
      }
    | { ok: false; error: string };

const FLIP_COIN_METAL_SET = new Set<string>(Object.keys(FLIP_A_COIN_ASSETS));

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value != null && !Array.isArray(value);

const isFlipCoinMetal = (value: unknown): value is FlipCoinMetal =>
    typeof value === "string" && FLIP_COIN_METAL_SET.has(value);

const isFlipCoinClickFlipMode = (
    value: unknown,
): value is FlipCoinClickFlipMode => value === "all" || value === "one";

const parseClickFlipModeField = (
    value: unknown,
): FlipCoinClickFlipMode | undefined => {
    if (value == null) {
        return undefined;
    }

    return isFlipCoinClickFlipMode(value) ? value : undefined;
};

const parseExportCoin = (value: unknown): FlipCoinTableExportSlotV1 | null => {
    if (!isRecord(value)) {
        return null;
    }

    const { metal } = value;
    if (!isFlipCoinMetal(metal)) {
        return null;
    }

    return { metal };
};

const slotsFromMetals = (
    entries: readonly FlipCoinTableExportSlotV1[],
): FlipCoinSlot[] =>
    createFlipCoinSlotsFromMetals(entries.map((entry) => entry.metal));

const parseCoinsArray = (
    value: unknown,
): ParseFlipCoinTableImportResult | { ok: false; error: string } => {
    if (!Array.isArray(value)) {
        return { ok: false, error: "Missing or invalid coin list." };
    }

    if (value.length < 1 || value.length > MAX_FLIP_COIN_COUNT) {
        return {
            ok: false,
            error: `Coin count must be between 1 and ${MAX_FLIP_COIN_COUNT}.`,
        };
    }

    const entries: FlipCoinTableExportSlotV1[] = [];
    for (const entry of value) {
        const coin = parseExportCoin(entry);
        if (coin == null) {
            return { ok: false, error: "Invalid coin entry in file." };
        }
        entries.push(coin);
    }

    return {
        ok: true,
        slots: slotsFromMetals(entries),
        faceStyle: DEFAULT_FLIP_COIN_FACE_STYLE,
    };
};

export const buildFlipCoinTableExport = (
    slots: readonly FlipCoinSlot[],
    clickFlipMode: FlipCoinClickFlipMode = DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
    faceStyle: FlipCoinFaceStyle = DEFAULT_FLIP_COIN_FACE_STYLE,
): FlipCoinTableExportV2 => ({
    format: FLIP_COIN_TABLE_EXPORT_FORMAT,
    version:
        faceStyle.mode === "classic"
            ? FLIP_COIN_TABLE_EXPORT_VERSION
            : FLIP_COIN_TABLE_EXPORT_VERSION_LABELED,
    exported_at: Date.now(),
    click_flip_mode: clickFlipMode,
    coins: slots.map((slot) => ({ metal: slot.metal })),
    ...(faceStyle.mode === "classic"
        ? {}
        : { face: serializeFlipCoinFaceStyle(faceStyle) }),
});

export const formatFlipCoinTableExport = (
    slots: readonly FlipCoinSlot[],
    clickFlipMode: FlipCoinClickFlipMode = DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
    faceStyle: FlipCoinFaceStyle = DEFAULT_FLIP_COIN_FACE_STYLE,
): string =>
    JSON.stringify(
        buildFlipCoinTableExport(slots, clickFlipMode, faceStyle),
        null,
        2,
    );

export const parseFlipCoinTableImport = (
    raw: unknown,
): ParseFlipCoinTableImportResult => {
    if (!isRecord(raw)) {
        return { ok: false, error: "Invalid JSON file." };
    }

    if (raw.format === FLIP_COIN_TABLE_EXPORT_FORMAT) {
        if (
            raw.version !== FLIP_COIN_TABLE_EXPORT_VERSION &&
            raw.version !== FLIP_COIN_TABLE_EXPORT_VERSION_LABELED
        ) {
            return {
                ok: false,
                error: `Unsupported export version (${String(raw.version)}).`,
            };
        }

        const parsedMode = parseClickFlipModeField(raw.click_flip_mode);
        if (parsedMode == null) {
            return { ok: false, error: "Invalid or missing click_flip_mode in file." };
        }

        const coins = parseCoinsArray(raw.coins);
        if (!coins.ok) {
            return coins;
        }

        return {
            ok: true,
            slots: coins.slots,
            clickFlipMode: parsedMode,
            faceStyle:
                raw.version === FLIP_COIN_TABLE_EXPORT_VERSION_LABELED
                    ? parseFlipCoinFaceStyle(raw.face)
                    : DEFAULT_FLIP_COIN_FACE_STYLE,
        };
    }

    return {
        ok: false,
        error: "Unrecognized coin table file format.",
    };
};

export const parseFlipCoinTableImportText = (
    text: string,
): ParseFlipCoinTableImportResult => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
        return { ok: false, error: "File is empty." };
    }

    try {
        return parseFlipCoinTableImport(JSON.parse(trimmed) as unknown);
    } catch {
        return { ok: false, error: "Could not parse JSON." };
    }
};
