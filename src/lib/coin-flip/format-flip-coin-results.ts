import {
    CLASSIC_FLIP_COIN_SIDE_LABELS,
    type FlipCoinSideLabels,
} from "@/lib/coin-flip/flip-coin-face-style";
import type { FlipCoinSide } from "@/lib/coin-flip/plan-coin-flip";

/** Summary label for one or many coin results after a flip. */
export const formatFlipCoinResultsSummary = (
    results: ReadonlyMap<string, FlipCoinSide>,
    labels: FlipCoinSideLabels = CLASSIC_FLIP_COIN_SIDE_LABELS,
): string => {
    if (results.size === 0) return "?";
    if (results.size === 1) {
        const side = [...results.values()][0]!;
        return side === "heads" ? labels.heads : labels.tails;
    }

    let heads = 0;
    let tails = 0;
    for (const side of results.values()) {
        if (side === "heads") heads += 1;
        else tails += 1;
    }

    const parts: string[] = [];
    if (heads > 0) parts.push(`${heads} ${labels.heads}`);
    if (tails > 0) parts.push(`${tails} ${labels.tails}`);
    return parts.join(" · ");
};

/** Per-coin breakdown in table order, e.g. `H - T - H`. */
export const formatFlipCoinResultBreakdown = (
    coinIds: readonly string[],
    results: ReadonlyMap<string, FlipCoinSide>,
    labels: FlipCoinSideLabels = CLASSIC_FLIP_COIN_SIDE_LABELS,
): string | null => {
    if (coinIds.length <= 1) {
        return null;
    }

    return coinIds
        .map((coinId) => {
            const side = results.get(coinId);
            if (side == null) {
                return "X";
            }
            return side === "heads" ? labels.headsInitial : labels.tailsInitial;
        })
        .join(" - ");
};

const hasUnresolvedFlipCoinResults = (
    coinIds: readonly string[],
    results: ReadonlyMap<string, FlipCoinSide>,
): boolean => coinIds.some((coinId) => !results.has(coinId));

/** Clipboard text for the copy-result control. */
export const formatFlipCoinResultCopy = (
    coinIds: readonly string[],
    results: ReadonlyMap<string, FlipCoinSide>,
    labels: FlipCoinSideLabels = CLASSIC_FLIP_COIN_SIDE_LABELS,
): string => {
    const breakdown = formatFlipCoinResultBreakdown(coinIds, results, labels);
    if (breakdown != null && hasUnresolvedFlipCoinResults(coinIds, results)) {
        return breakdown;
    }

    const summary = formatFlipCoinResultsSummary(results, labels);
    if (breakdown == null) {
        return summary;
    }
    return `${summary} (${breakdown})`;
};
