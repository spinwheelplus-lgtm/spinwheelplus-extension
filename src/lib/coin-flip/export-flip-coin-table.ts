import { formatFlipCoinTableExport } from "@/lib/coin-flip/flip-a-coin-table-export-format";
import {
    DEFAULT_FLIP_COIN_FACE_STYLE,
    type FlipCoinFaceStyle,
} from "@/lib/coin-flip/flip-coin-face-style";
import type { FlipCoinClickFlipMode, FlipCoinSlot } from "@/types/coin-flip";

export const downloadFlipCoinTable = (
    slots: readonly FlipCoinSlot[],
    clickFlipMode: FlipCoinClickFlipMode,
    faceStyle: FlipCoinFaceStyle = DEFAULT_FLIP_COIN_FACE_STYLE,
): void => {
    if (slots.length === 0) {
        return;
    }

    const blob = new Blob(
        [formatFlipCoinTableExport(slots, clickFlipMode, faceStyle)],
        {
        type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "flip-a-coin-table.json";
    anchor.click();
    URL.revokeObjectURL(url);
};
