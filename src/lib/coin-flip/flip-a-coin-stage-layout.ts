import { FLIP_COIN_BASE_DIAMETER_PX } from "@/lib/coin-flip/flip-a-coin-assets";

/** Panel / viewport height budget for the flip-a-coin stage (95lvh). */
export const FLIP_COIN_PANEL_MAX_HEIGHT_RATIO = 0.95;

export const FLIP_COIN_MAX_DIAMETER_PX = FLIP_COIN_BASE_DIAMETER_PX;
export const FLIP_COIN_MIN_DIAMETER_PX = 96;

/**
 * Side of the square frame around one coin at scale 1.
 * Matches roll-a-dice frame sizing so multi-coin grids tile cleanly.
 */
export const FLIP_COIN_FRAME_BASE_PX = FLIP_COIN_BASE_DIAMETER_PX;
export const FLIP_COIN_STAGE_MIN_SCALE = 0.2;
/** Gap between coin frames - same as roll-a-dice `DICE_GRID_GAP_PX` (16px). */
export const FLIP_COIN_GRID_GAP_PX = 16;
/** Vertical gap between top/bottom chrome blocks (mb-5 + mt-5). */
export const FLIP_COIN_CHROME_VERTICAL_GAP_PX = 40;
/** Coin area placeholder height before the first layout pass. */
export const FLIP_COIN_SKELETON_MIN_HEIGHT_PX = FLIP_COIN_FRAME_BASE_PX;

export type FlipCoinStageLayoutInput = {
    /** Measured width of the coin area. */
    containerWidth: number;
    /** Height budget (95lvh panel cap minus chrome). */
    maxHeightPx: number;
};

/** @deprecated Use FlipCoinGridLayout for multi-coin stage. */
export type FlipCoinStageLayout = {
    /** Coin diameter in CSS / canvas px. */
    diameterPx: number;
    /** Uniform scale vs design diameter. */
    scale: number;
    /** Canvas / stage footprint (square). */
    stageSizePx: number;
};

export type FlipCoinGridLayoutInput = FlipCoinStageLayoutInput & {
    coinCount: number;
};

export type FlipCoinGridLayout = {
    /** Square frame side in px (already scaled). */
    frameSizePx: number;
    /** Uniform scale (≤ 1) applied to the coin inside its frame. */
    scale: number;
    columns: number;
    rows: number;
    /** Gap between adjacent coin frames. */
    gapPx: number;
    gridWidthPx: number;
    gridHeightPx: number;
};

const buildGridLayout = (
    coinCount: number,
    columns: number,
    frameSizePx: number,
): FlipCoinGridLayout => {
    const rows = Math.ceil(coinCount / columns);
    const gapPx = FLIP_COIN_GRID_GAP_PX;
    return {
        frameSizePx,
        scale: frameSizePx / FLIP_COIN_FRAME_BASE_PX,
        columns,
        rows,
        gapPx,
        gridWidthPx: columns * frameSizePx + (columns - 1) * gapPx,
        gridHeightPx: rows * frameSizePx + (rows - 1) * gapPx,
    };
};

const absoluteMinFramePx = (): number =>
    FLIP_COIN_FRAME_BASE_PX * FLIP_COIN_STAGE_MIN_SCALE;

const clampGridToHeightBudget = (
    layout: FlipCoinGridLayout,
    coinCount: number,
    maxHeightPx: number,
): FlipCoinGridLayout => {
    if (maxHeightPx <= 0 || layout.gridHeightPx <= maxHeightPx) {
        return layout;
    }

    const gapTotalH = (layout.rows - 1) * FLIP_COIN_GRID_GAP_PX;
    const frameSizePx = Math.max(
        1,
        Math.floor((maxHeightPx - gapTotalH) / layout.rows),
    );

    return buildGridLayout(coinCount, layout.columns, frameSizePx);
};

const clampGridToWidthBudget = (
    layout: FlipCoinGridLayout,
    coinCount: number,
    containerWidth: number,
): FlipCoinGridLayout => {
    if (containerWidth <= 0 || layout.gridWidthPx <= containerWidth) {
        return layout;
    }

    const gapTotalW = (layout.columns - 1) * FLIP_COIN_GRID_GAP_PX;
    const frameSizePx = Math.max(
        1,
        Math.floor((containerWidth - gapTotalW) / layout.columns),
    );

    return buildGridLayout(coinCount, layout.columns, frameSizePx);
};

const sideForColumnCount = (
    count: number,
    cols: number,
    containerWidth: number,
    maxHeightPx: number,
): number => {
    const rows = Math.ceil(count / cols);
    const gapTotalW = (cols - 1) * FLIP_COIN_GRID_GAP_PX;
    const gapTotalH = (rows - 1) * FLIP_COIN_GRID_GAP_PX;
    return Math.min(
        (containerWidth - gapTotalW) / cols,
        (maxHeightPx - gapTotalH) / rows,
        FLIP_COIN_FRAME_BASE_PX,
    );
};

const rowUnevenness = (coinCount: number, columns: number): number => {
    const rows = Math.ceil(coinCount / columns);
    const lastRowCount = coinCount - (rows - 1) * columns;
    if (rows <= 1 || lastRowCount >= columns) {
        return 0;
    }
    return columns - lastRowCount;
};

/**
 * Largest square frames that fit `coinCount` inside the play panel.
 * Same side/clamp formula as roll-a-dice; when several column counts tie on
 * the largest side, prefers balanced rows (4+4 over 6+2), then the widest row.
 */
export const computeFlipCoinGridLayout = ({
    coinCount,
    containerWidth,
    maxHeightPx,
}: FlipCoinGridLayoutInput): FlipCoinGridLayout => {
    const count = Math.max(1, coinCount);

    if (containerWidth <= 0 || maxHeightPx <= 0) {
        return buildGridLayout(count, count, FLIP_COIN_FRAME_BASE_PX);
    }

    let bestSide = 0;
    for (let cols = 1; cols <= count; cols += 1) {
        const side = sideForColumnCount(
            count,
            cols,
            containerWidth,
            maxHeightPx,
        );
        if (side > bestSide) {
            bestSide = side;
        }
    }

    let bestColumns = 1;
    let bestUnevenness = Number.POSITIVE_INFINITY;
    for (let cols = 1; cols <= count; cols += 1) {
        const side = sideForColumnCount(
            count,
            cols,
            containerWidth,
            maxHeightPx,
        );
        if (side !== bestSide) {
            continue;
        }

        const unevenness = rowUnevenness(count, cols);
        if (
            unevenness < bestUnevenness ||
            (unevenness === bestUnevenness && cols > bestColumns)
        ) {
            bestUnevenness = unevenness;
            bestColumns = cols;
        }
    }

    const absoluteMin = absoluteMinFramePx();
    const frameSide =
        count === 1
            ? Math.floor(Math.max(FLIP_COIN_MIN_DIAMETER_PX, bestSide))
            : Math.floor(Math.max(absoluteMin, bestSide));

    let layout = buildGridLayout(count, bestColumns, frameSide);

    if (count > 1) {
        layout = clampGridToHeightBudget(layout, count, maxHeightPx);
        layout = clampGridToWidthBudget(layout, count, containerWidth);
    }

    return layout;
};

export const getFlipCoinItemsInRow = (
    row: number,
    coinCount: number,
    layout: Pick<FlipCoinGridLayout, "columns" | "rows">,
): number => {
    if (row < layout.rows - 1) {
        return layout.columns;
    }
    return coinCount - layout.columns * (layout.rows - 1);
};

const rowOffsetX = (
    row: number,
    coinCount: number,
    layout: FlipCoinGridLayout,
): number => {
    const itemsInRow = getFlipCoinItemsInRow(row, coinCount, layout);
    if (itemsInRow >= layout.columns) {
        return 0;
    }

    const rowWidth =
        itemsInRow * layout.frameSizePx +
        (itemsInRow - 1) * layout.gapPx;
    return (layout.gridWidthPx - rowWidth) / 2;
};

/** Center of the square frame cell for coin at `index` (CSS grid order, Three.js y-up). */
export const getFlipCoinCellCenter = (
    index: number,
    layout: FlipCoinGridLayout,
    coinCount: number,
): { x: number; y: number } => {
    const col = index % layout.columns;
    const row = Math.floor(index / layout.columns);
    const stride = layout.frameSizePx + layout.gapPx;
    const offsetX = rowOffsetX(row, coinCount, layout);
    return {
        x: offsetX + col * stride + layout.frameSizePx / 2,
        y:
            layout.gridHeightPx -
            (row * stride + layout.frameSizePx / 2),
    };
};

/**
 * Hit-test in grid pixel space (origin top-left, y down) - matches the canvas DOM box.
 * Returns the coin index under the point, or null.
 */
export const getFlipCoinIndexAtPoint = (
    layout: FlipCoinGridLayout,
    coinCount: number,
    x: number,
    y: number,
): number | null => {
    const half = layout.frameSizePx / 2;

    for (let index = 0; index < coinCount; index += 1) {
        const center = getFlipCoinCellCenter(index, layout, coinCount);
        const screenCenterY = layout.gridHeightPx - center.y;

        if (
            x >= center.x - half &&
            x <= center.x + half &&
            y >= screenCenterY - half &&
            y <= screenCenterY + half
        ) {
            return index;
        }
    }

    return null;
};

/**
 * Single-coin helper - wraps grid layout for one coin.
 * Kept for tests and backward compatibility.
 */
export const computeFlipCoinStageLayout = ({
    containerWidth,
    maxHeightPx,
}: FlipCoinStageLayoutInput): FlipCoinStageLayout => {
    const grid = computeFlipCoinGridLayout({
        coinCount: 1,
        containerWidth,
        maxHeightPx,
    });

    return {
        diameterPx: grid.frameSizePx,
        scale: grid.scale,
        stageSizePx: grid.frameSizePx,
    };
};
