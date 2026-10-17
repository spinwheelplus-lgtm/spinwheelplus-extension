import { formatRollDiceBreakdown } from "@/lib/dice-roller/format-roll-dice-breakdown";
import { formatRollDiceHistoryGeneratedAt } from "@/lib/dice-roller/format-roll-dice-history-time";
import {
    getRollDiceHistoryDiceTotal,
    getRollDiceHistoryModifier,
    isRollDiceHistoryWordOnly,
} from "@/lib/dice-roller/roll-dice-history-entry";
import { formatRollDiceModifierLabel } from "@/lib/dice-roller/roll-dice-modifier";
import type { RollDiceHistoryEntry } from "@/types/dice-roller";

export const formatRollDiceHistoryExport = (
    entries: readonly RollDiceHistoryEntry[],
): string =>
    entries
        .map((entry) => {
            const timestamp = formatRollDiceHistoryGeneratedAt(entry.rolledAt);
            if (isRollDiceHistoryWordOnly(entry)) {
                return `${timestamp}: ${formatRollDiceBreakdown(entry.values, entry.labels)}`;
            }

            const breakdown =
                entry.values.length > 1
                    ? ` (${formatRollDiceBreakdown(entry.values, entry.labels)})`
                    : "";
            const modifier = getRollDiceHistoryModifier(entry);
            const diceTotal = getRollDiceHistoryDiceTotal(entry);

            if (modifier === 0) {
                return `${timestamp}: Total ${entry.total}${breakdown}`;
            }

            return `${timestamp}: Final ${entry.total} (dice ${diceTotal} ${formatRollDiceModifierLabel(modifier)})${breakdown}`;
        })
        .join("\n");

export const downloadRollDiceHistory = (
    entries: readonly RollDiceHistoryEntry[],
): void => {
    if (entries.length === 0) {
        return;
    }

    const blob = new Blob([formatRollDiceHistoryExport(entries)], {
        type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "roll-a-dice-history.txt";
    anchor.click();
    URL.revokeObjectURL(url);
};
