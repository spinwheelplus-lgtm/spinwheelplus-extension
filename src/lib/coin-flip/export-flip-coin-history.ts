import { formatFlipCoinHistoryGeneratedAt } from "@/lib/coin-flip/format-flip-coin-history-time";
import { formatFlipCoinHistoryEntryLabel } from "@/lib/coin-flip/format-flip-coin-history-entry";
import type { FlipCoinHistoryEntry } from "@/types/coin-flip";

export const formatFlipCoinHistoryExport = (
    entries: readonly FlipCoinHistoryEntry[],
): string =>
    entries
        .map((entry) => {
            const timestamp = formatFlipCoinHistoryGeneratedAt(entry.flipped_at);
            return `${timestamp}: ${formatFlipCoinHistoryEntryLabel(entry)}`;
        })
        .join("\n");

export const downloadFlipCoinHistory = (
    entries: readonly FlipCoinHistoryEntry[],
): void => {
    if (entries.length === 0) {
        return;
    }

    const blob = new Blob([formatFlipCoinHistoryExport(entries)], {
        type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "flip-a-coin-history.txt";
    anchor.click();
    URL.revokeObjectURL(url);
};
