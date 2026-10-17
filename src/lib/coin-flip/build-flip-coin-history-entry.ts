import { createItemId } from "@/lib/random";
import type { FlipCoinHistoryFaceLabels } from "@/lib/coin-flip/flip-coin-face-style";
import type { FlipCoinSide } from "@/lib/coin-flip/plan-coin-flip";
import type { FlipCoinHistoryEntry } from "@/types/coin-flip";

export const buildFlipCoinHistoryEntry = (
    coinIds: readonly string[],
    results: ReadonlyMap<string, FlipCoinSide>,
    faceLabels?: FlipCoinHistoryFaceLabels,
): FlipCoinHistoryEntry | null => {
    if (coinIds.length === 0 || results.size === 0) {
        return null;
    }

    const values = coinIds.map((coinId) => results.get(coinId) ?? null);
    if (!values.some((value) => value != null)) {
        return null;
    }

    return {
        id: createItemId(),
        flipped_at: Date.now(),
        values,
        ...(faceLabels != null ? { face_labels: faceLabels } : {}),
    };
};
