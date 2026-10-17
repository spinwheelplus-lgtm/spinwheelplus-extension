/** Table-wide labeled faces. Classic metals stay the default. */

export const FLIP_COIN_FACE_PAIR_IDS = ["yes-no", "win-lose", "odd-even"] as const;

export type FlipCoinFacePairId = (typeof FLIP_COIN_FACE_PAIR_IDS)[number];

export type FlipCoinFaceColor = {
    id: string;
    hex: string;
};

/** Saturated faces only. Gold letters disappear on yellow or white. */
export const FLIP_COIN_FACE_COLORS: readonly FlipCoinFaceColor[] = [
    { id: "green", hex: "#128a3e" },
    { id: "red", hex: "#d0122a" },
    { id: "blue", hex: "#1a4fd6" },
    { id: "purple", hex: "#6b21d6" },
    { id: "orange", hex: "#e05a00" },
    { id: "black", hex: "#141414" },
];

export type FlipCoinFacePair = {
    id: FlipCoinFacePairId;
    label: string;
    heads: string;
    tails: string;
    headsInitial: string;
    tailsInitial: string;
    headsColor: string;
    tailsColor: string;
};

export const FLIP_COIN_FACE_PAIRS: readonly FlipCoinFacePair[] = [
    {
        id: "yes-no",
        label: "Yes / No",
        heads: "Yes",
        tails: "No",
        headsInitial: "Y",
        tailsInitial: "N",
        headsColor: "#128a3e",
        tailsColor: "#d0122a",
    },
    {
        id: "win-lose",
        label: "Win / Lose",
        heads: "Win",
        tails: "Lose",
        headsInitial: "W",
        tailsInitial: "L",
        headsColor: "#128a3e",
        tailsColor: "#d0122a",
    },
    {
        id: "odd-even",
        label: "Odd / Even",
        heads: "Odd",
        tails: "Even",
        headsInitial: "O",
        tailsInitial: "E",
        headsColor: "#d0122a",
        tailsColor: "#128a3e",
    },
];

export type FlipCoinFaceStyle =
    | { mode: "classic" }
    | {
          mode: "labeled";
          pairId: FlipCoinFacePairId;
          headsColor: string;
          tailsColor: string;
      };

export const DEFAULT_FLIP_COIN_FACE_STYLE: FlipCoinFaceStyle = {
    mode: "classic",
};

export type FlipCoinSideLabels = {
    heads: string;
    tails: string;
    headsInitial: string;
    tailsInitial: string;
};

export const CLASSIC_FLIP_COIN_SIDE_LABELS: FlipCoinSideLabels = {
    heads: "Heads",
    tails: "Tails",
    headsInitial: "H",
    tailsInitial: "T",
};

/** Snapshot stored on a history row. Snake keys match other coin persist fields. */
export type FlipCoinHistoryFaceLabels = {
    heads: string;
    tails: string;
    heads_initial: string;
    tails_initial: string;
};

const FACE_COLOR_SET = new Set(
    FLIP_COIN_FACE_COLORS.map((color) => color.hex),
);

const PAIR_BY_ID = new Map(
    FLIP_COIN_FACE_PAIRS.map((pair) => [pair.id, pair]),
);

export const isFlipCoinFacePairId = (
    value: unknown,
): value is FlipCoinFacePairId =>
    typeof value === "string" && PAIR_BY_ID.has(value as FlipCoinFacePairId);

export const isFlipCoinFaceColor = (value: unknown): value is string =>
    typeof value === "string" && FACE_COLOR_SET.has(value.toLowerCase());

export const getFlipCoinFacePair = (
    pairId: FlipCoinFacePairId,
): FlipCoinFacePair => {
    const pair = PAIR_BY_ID.get(pairId);
    if (pair == null) {
        return FLIP_COIN_FACE_PAIRS[0]!;
    }
    return pair;
};

export const createLabeledFlipCoinFaceStyle = (
    pairId: FlipCoinFacePairId,
): FlipCoinFaceStyle => {
    const pair = getFlipCoinFacePair(pairId);
    return {
        mode: "labeled",
        pairId,
        headsColor: pair.headsColor,
        tailsColor: pair.tailsColor,
    };
};

export const flipCoinSideLabelsForStyle = (
    style: FlipCoinFaceStyle,
): FlipCoinSideLabels => {
    if (style.mode === "classic") {
        return CLASSIC_FLIP_COIN_SIDE_LABELS;
    }
    const pair = getFlipCoinFacePair(style.pairId);
    return {
        heads: pair.heads,
        tails: pair.tails,
        headsInitial: pair.headsInitial,
        tailsInitial: pair.tailsInitial,
    };
};

export const flipCoinHistoryFaceLabelsForStyle = (
    style: FlipCoinFaceStyle,
): FlipCoinHistoryFaceLabels | undefined => {
    if (style.mode === "classic") {
        return undefined;
    }
    const labels = flipCoinSideLabelsForStyle(style);
    return {
        heads: labels.heads,
        tails: labels.tails,
        heads_initial: labels.headsInitial,
        tails_initial: labels.tailsInitial,
    };
};

export const flipCoinSideLabelsFromHistory = (
    labels: FlipCoinHistoryFaceLabels | undefined,
): FlipCoinSideLabels => {
    if (labels == null) {
        return CLASSIC_FLIP_COIN_SIDE_LABELS;
    }
    return {
        heads: labels.heads,
        tails: labels.tails,
        headsInitial: labels.heads_initial,
        tailsInitial: labels.tails_initial,
    };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value != null && !Array.isArray(value);

/** Missing face means classic. Invalid labeled colors fall back to the pair defaults. */
export const parseFlipCoinFaceStyle = (value: unknown): FlipCoinFaceStyle => {
    if (!isRecord(value) || value.mode == null || value.mode === "classic") {
        return DEFAULT_FLIP_COIN_FACE_STYLE;
    }

    if (value.mode !== "labeled" || !isFlipCoinFacePairId(value.pair)) {
        return DEFAULT_FLIP_COIN_FACE_STYLE;
    }

    const pair = getFlipCoinFacePair(value.pair);
    const headsColor = isFlipCoinFaceColor(value.heads_color)
        ? value.heads_color.toLowerCase()
        : pair.headsColor;
    const tailsColor = isFlipCoinFaceColor(value.tails_color)
        ? value.tails_color.toLowerCase()
        : pair.tailsColor;

    return {
        mode: "labeled",
        pairId: value.pair,
        headsColor,
        tailsColor,
    };
};

export const serializeFlipCoinFaceStyle = (
    style: FlipCoinFaceStyle,
):
    | { mode: "classic" }
    | {
          mode: "labeled";
          pair: FlipCoinFacePairId;
          heads_color: string;
          tails_color: string;
      } => {
    if (style.mode === "classic") {
        return { mode: "classic" };
    }
    return {
        mode: "labeled",
        pair: style.pairId,
        heads_color: style.headsColor,
        tails_color: style.tailsColor,
    };
};

const LABEL_PATTERN = /^[A-Za-z][A-Za-z ]{0,11}$/;
const INITIAL_PATTERN = /^[A-Za-z]$/;

export const parseFlipCoinHistoryFaceLabels = (
    value: unknown,
): FlipCoinHistoryFaceLabels | undefined => {
    if (!isRecord(value)) {
        return undefined;
    }
    const { heads, tails, heads_initial, tails_initial } = value;
    if (
        typeof heads !== "string" ||
        typeof tails !== "string" ||
        typeof heads_initial !== "string" ||
        typeof tails_initial !== "string"
    ) {
        return undefined;
    }
    if (
        !LABEL_PATTERN.test(heads) ||
        !LABEL_PATTERN.test(tails) ||
        !INITIAL_PATTERN.test(heads_initial) ||
        !INITIAL_PATTERN.test(tails_initial)
    ) {
        return undefined;
    }
    return { heads, tails, heads_initial, tails_initial };
};

export const flipCoinFacesMatch = (
    left: FlipCoinFaceStyle,
    right: FlipCoinFaceStyle,
): boolean => {
    if (left.mode === "classic" || right.mode === "classic") {
        return left.mode === right.mode;
    }
    return (
        left.pairId === right.pairId &&
        left.headsColor === right.headsColor &&
        left.tailsColor === right.tailsColor
    );
};

/** Rebuild key for a coin mesh. Labeled coins ignore metal. */
export const flipCoinMeshVisualKey = (
    metal: string,
    style: FlipCoinFaceStyle,
): string => {
    if (style.mode === "classic") {
        return `metal:${metal}`;
    }
    return `face:${style.pairId}:${style.headsColor}:${style.tailsColor}`;
};
