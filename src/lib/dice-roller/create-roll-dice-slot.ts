import { createDefaultDiceAppearance } from "@/lib/dice-roller/roll-a-dice-appearance";
import { createItemId } from "@/lib/random";
import { getDiceTypeDefinition } from "@/lib/dice-roller/dice-type-registry";
import type { DiceSides, RollDiceAppearance, RollDiceSlot } from "@/types/dice-roller";

export const createRollDiceSlot = (sides: DiceSides): RollDiceSlot => {
    const definition = getDiceTypeDefinition(sides);
    const initial = definition.randomizeInitialPose();

    return {
        id: createItemId(),
        sides,
        rotation: initial.rotation,
        result: null,
        appearance: createDefaultDiceAppearance(sides),
    };
};

/** Import / export - fresh id and pose, keeps type, colors, and order. */
export const createRollDiceSlotFromConfig = (
    sides: DiceSides,
    appearance: RollDiceAppearance,
): RollDiceSlot => {
    const definition = getDiceTypeDefinition(sides);
    const initial = definition.randomizeInitialPose();

    return {
        id: createItemId(),
        sides,
        rotation: initial.rotation,
        result: null,
        appearance,
    };
};

/** First die on the table: D6 with dot faces and default colors. */
export const createInitialRollDiceSlot = (): RollDiceSlot => {
    const slot = createRollDiceSlot(6);

    return {
        ...slot,
        appearance: {
            ...slot.appearance,
            d6FaceStyle: "pip",
        },
    };
};

/** Swap die type in place - keeps id/colors, resets pose and roll result. */
export const applyRollDiceSlotSides = (
    slot: RollDiceSlot,
    sides: DiceSides,
): RollDiceSlot => {
    if (slot.sides === sides) {
        return slot;
    }

    const definition = getDiceTypeDefinition(sides);
    const initial = definition.randomizeInitialPose();

    return {
        ...slot,
        sides,
        rotation: initial.rotation,
        result: null,
    };
};
