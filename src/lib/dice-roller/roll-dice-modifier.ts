/** RPG bonus/penalty applied to the dice sum before showing the final total. */
export const ROLL_DICE_MODIFIER_MIN = -99;
export const ROLL_DICE_MODIFIER_MAX = 99;

export const clampRollDiceModifier = (value: number): number =>
    Math.min(
        ROLL_DICE_MODIFIER_MAX,
        Math.max(ROLL_DICE_MODIFIER_MIN, Math.round(value)),
    );

export const parseRollDiceModifierInput = (raw: string): number => {
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === "-" || trimmed === "+") {
        return 0;
    }

    const parsed = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(parsed)) {
        return 0;
    }

    return clampRollDiceModifier(parsed);
};

export const computeRollDiceFinalTotal = (
    diceTotal: number,
    modifier: number,
): number => diceTotal + clampRollDiceModifier(modifier);

export const formatRollDiceModifierLabel = (modifier: number): string => {
    const clamped = clampRollDiceModifier(modifier);
    if (clamped > 0) {
        return `+${clamped}`;
    }
    return String(clamped);
};

/** Label on the modifier tile - `±` when unset, otherwise signed value. */
export const formatRollDiceModifierButtonLabel = (modifier: number): string => {
    const clamped = clampRollDiceModifier(modifier);
    if (clamped === 0) {
        return "±";
    }
    return formatRollDiceModifierLabel(clamped);
};

/** One-line dice / modifier / final summary for the table chrome. */
export const formatRollDiceTotalsLine = (
    diceTotal: number | null,
    modifier: number,
    finalTotal: number | null,
    showValues: boolean,
): string => {
    const dice =
        showValues && diceTotal != null ? String(diceTotal) : "-----";
    const final =
        showValues && finalTotal != null ? String(finalTotal) : "-----";
    const modLabel = formatRollDiceModifierLabel(modifier);

    return `Dice: ${dice} · ${modLabel} · Final: ${final}`;
};
