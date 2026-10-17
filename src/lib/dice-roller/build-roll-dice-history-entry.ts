import { createItemId } from "@/lib/random";
import { summarizeRollDiceSlots } from "@/lib/dice-roller/summarize-roll-dice-results";
import { computeRollDiceFinalTotal } from "@/lib/dice-roller/roll-dice-modifier";
import type { RollDiceHistoryEntry, RollDiceSlot } from "@/types/dice-roller";

export const buildRollDiceHistoryEntry = (
    slots: readonly RollDiceSlot[],
    modifier = 0,
): RollDiceHistoryEntry | null => {
    const summary = summarizeRollDiceSlots(slots);
    if (summary.values.every((value) => value == null)) {
        return null;
    }

    const diceTotal = summary.isWordOnly ? 0 : (summary.diceTotal ?? 0);
    const appliedModifier = summary.isWordOnly ? 0 : modifier;

    return {
        id: createItemId(),
        rolledAt: Date.now(),
        dice_total: diceTotal,
        modifier: appliedModifier,
        total: summary.isWordOnly
            ? 0
            : computeRollDiceFinalTotal(diceTotal, appliedModifier),
        values: summary.values,
        ...(summary.labels != null ? { labels: summary.labels } : {}),
    };
};
