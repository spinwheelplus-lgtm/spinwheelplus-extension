import {
    formatRollDiceBreakdown,
    isWordOnlyFaceList,
} from "@/lib/dice-roller/format-roll-dice-breakdown";
import { formatRollDiceModifierLabel } from "@/lib/dice-roller/roll-dice-modifier";
import type { RollDiceHistoryEntry } from "@/types/dice-roller";

/** Dice sum for a history row (legacy rows used `total` as dice-only). */
export const getRollDiceHistoryDiceTotal = (
    entry: RollDiceHistoryEntry,
): number => entry.dice_total ?? entry.total;

/** Modifier stored on a history row (0 when absent in legacy data). */
export const getRollDiceHistoryModifier = (
    entry: RollDiceHistoryEntry,
): number => entry.modifier ?? 0;

/** Every landed face is a word, so the row has no numeric total. */
export const isRollDiceHistoryWordOnly = (
    entry: RollDiceHistoryEntry,
): boolean => isWordOnlyFaceList(entry.values, entry.labels);

export type RollDiceHistoryRowCopy = {
    primary: string;
    modifierLabel: string | null;
    breakdown: string | null;
};

/** Headline, optional modifier, and multi-die breakdown for one history row. */
export const getRollDiceHistoryRowCopy = (
    entry: RollDiceHistoryEntry,
): RollDiceHistoryRowCopy => {
    const wordOnly = isRollDiceHistoryWordOnly(entry);
    const modifier = getRollDiceHistoryModifier(entry);

    return {
        primary: wordOnly
            ? formatRollDiceBreakdown(entry.values, entry.labels)
            : String(entry.total),
        modifierLabel:
            !wordOnly && modifier !== 0
                ? `${getRollDiceHistoryDiceTotal(entry)} ${formatRollDiceModifierLabel(modifier)}`
                : null,
        breakdown:
            !wordOnly && entry.values.length > 1
                ? formatRollDiceBreakdown(entry.values, entry.labels)
                : null,
    };
};
