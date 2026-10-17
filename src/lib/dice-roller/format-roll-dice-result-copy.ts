import {
    formatRollDiceBreakdown,
    isWordOnlyFaceList,
} from "@/lib/dice-roller/format-roll-dice-breakdown";
import {
    clampRollDiceModifier,
    computeRollDiceFinalTotal,
    formatRollDiceModifierLabel,
} from "@/lib/dice-roller/roll-dice-modifier";

/** Clipboard text for the current roll total and per-die breakdown. */
export const formatRollDiceResultCopy = (
    diceTotal: number,
    values: readonly (number | null)[],
    modifier = 0,
    labels?: readonly (string | null)[] | null,
): string => {
    if (isWordOnlyFaceList(values, labels)) {
        return formatRollDiceBreakdown(values, labels);
    }

    const clampedModifier = clampRollDiceModifier(modifier);
    const finalTotal = computeRollDiceFinalTotal(diceTotal, clampedModifier);
    const resolved = values.filter((value): value is number => value != null);
    const breakdown =
        resolved.length > 1
            ? formatRollDiceBreakdown(values, labels)
            : null;

    if (clampedModifier === 0) {
        if (resolved.length <= 1) {
            return String(resolved[0] ?? diceTotal);
        }

        return `Total: ${diceTotal}\n${breakdown}`;
    }

    const lines = [
        `Dice total: ${diceTotal}`,
        `Modifier: ${formatRollDiceModifierLabel(clampedModifier)}`,
        `Final: ${finalTotal}`,
    ];
    if (breakdown != null) {
        lines.push(breakdown);
    }

    return lines.join("\n");
};
