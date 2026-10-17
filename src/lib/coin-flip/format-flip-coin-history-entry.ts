import { formatFlipCoinResultsSummary } from "@/lib/coin-flip/format-flip-coin-results";
import { flipCoinSideLabelsFromHistory } from "@/lib/coin-flip/flip-coin-face-style";
import { localizeFlipCoinSideLabelsNow } from "@/lib/coin-flip/localize-coin-face-labels";
import type { FlipCoinSide } from "@/lib/coin-flip/plan-coin-flip";
import type { FlipCoinHistoryEntry } from "@/types/coin-flip";

export const formatFlipCoinHistoryBreakdown = (
    entry: FlipCoinHistoryEntry,
): string | null => {
    if (entry.values.length <= 1) {
        return null;
    }

    const labels = localizeFlipCoinSideLabelsNow(
        flipCoinSideLabelsFromHistory(entry.face_labels),
    );

    return entry.values
        .map((side) => {
            if (side == null) {
                return "X";
            }
            return side === "heads" ? labels.headsInitial : labels.tailsInitial;
        })
        .join(" - ");
};

export const formatFlipCoinHistorySummary = (
    entry: FlipCoinHistoryEntry,
): string => {
    const breakdown = formatFlipCoinHistoryBreakdown(entry);
    const hasUnresolved = entry.values.some((value) => value == null);

    if (breakdown != null && hasUnresolved) {
        return breakdown;
    }

    const resolvedResults = new Map<string, FlipCoinSide>();
    for (const [index, side] of entry.values.entries()) {
        if (side != null) {
            resolvedResults.set(String(index), side);
        }
    }

    if (resolvedResults.size === 0) {
        return "?";
    }

    const labels = localizeFlipCoinSideLabelsNow(
        flipCoinSideLabelsFromHistory(entry.face_labels),
    );

    if (entry.values.length === 1) {
        const side = entry.values[0];
        if (side == null) {
            return "?";
        }
        return side === "heads" ? labels.heads : labels.tails;
    }

    return formatFlipCoinResultsSummary(resolvedResults, labels);
};

export const speakClassicCoinWords = (
    text: string,
    heads: string,
    tails: string,
): string => text.replaceAll("Heads", heads).replaceAll("Tails", tails);

export const formatFlipCoinHistoryEntryLabel = (
    entry: FlipCoinHistoryEntry,
): string => {
    const summary = formatFlipCoinHistorySummary(entry);
    const breakdown = formatFlipCoinHistoryBreakdown(entry);
    const hasUnresolved = entry.values.some((value) => value == null);

    if (breakdown == null || hasUnresolved) {
        return summary;
    }

    return `${summary} (${breakdown})`;
};
