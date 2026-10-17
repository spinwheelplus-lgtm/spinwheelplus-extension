import { formatRollDiceTableExport } from "@/lib/dice-roller/roll-a-dice-table-export-format";
import type { RollDiceClickRollMode, RollDiceSlot } from "@/types/dice-roller";
import { DEFAULT_ROLL_DICE_CLICK_ROLL_MODE } from "@/types/dice-roller";

export const downloadRollDiceTable = (
    slots: readonly RollDiceSlot[],
    modifier = 0,
    clickRollMode: RollDiceClickRollMode = DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
): void => {
    if (slots.length === 0) {
        return;
    }

    const blob = new Blob(
        [formatRollDiceTableExport(slots, modifier, clickRollMode)],
        {
            type: "application/json;charset=utf-8",
        },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "roll-a-dice-table.json";
    anchor.click();
    URL.revokeObjectURL(url);
};
