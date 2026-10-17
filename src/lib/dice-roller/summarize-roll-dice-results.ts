import {
    displayD6FaceWord,
    resolveRollDiceSlotWord,
} from "@/lib/dice-roller/d6-face-words";
import type { RollDiceSlot } from "@/types/dice-roller";

export type RollDiceResultSummary = {
    values: Array<number | null>;
    labels?: Array<string | null>;
    diceTotal: number | null;
    isWordOnly: boolean;
};

/** A words die can still land a number when at least one face is blank. */
export const rollDiceSlotCanScoreNumber = (slot: RollDiceSlot): boolean => {
    if (slot.sides !== 6 || slot.appearance.d6FaceStyle !== "words") {
        return true;
    }

    return slot.appearance.d6FaceWords.some(
        (word) => displayD6FaceWord(word) === "",
    );
};

/** Number faces add up. Word faces stay in the labels and out of the total. */
export const summarizeRollDiceSlots = (
    slots: readonly RollDiceSlot[],
): RollDiceResultSummary => {
    const values: Array<number | null> = [];
    const labels: Array<string | null> = [];
    let numericSum = 0;
    let numericCount = 0;
    let wordCount = 0;
    let hasResult = false;

    for (const slot of slots) {
        values.push(slot.result);
        if (slot.result == null) {
            labels.push(null);
            continue;
        }

        hasResult = true;
        const word = resolveRollDiceSlotWord(slot);
        if (word !== "") {
            labels.push(word);
            wordCount += 1;
            continue;
        }

        labels.push(null);
        numericSum += slot.result;
        numericCount += 1;
    }

    const hasWord = wordCount > 0;

    return {
        values,
        labels: hasWord ? labels : undefined,
        diceTotal: numericCount > 0 ? numericSum : null,
        isWordOnly: hasResult && wordCount > 0 && numericCount === 0,
    };
};
