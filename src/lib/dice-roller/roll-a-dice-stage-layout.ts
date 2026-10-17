import {
    getDiceStageCellWidthPx,
    getDiceStageCoreHeightPx,
} from "@/lib/dice-roller/roll-a-dice-classes";

export const DICE_TABLE_MAX_HEIGHT_RATIO = 0.95;
export const DICE_STAGE_MIN_SCALE = 0.2;

/** Gap between dice frames - matches mystery-box `gap-4` (16px). */
export const DICE_GRID_GAP_PX = 16;

/**
 * Side of the square frame (`i-w = i-h`) around one die at scale 1.
 * A square always covers the die's 3D overhang in every direction, so a
 * tilted die can never poke out of its own cell ("mất đầu đuôi").
 */
export const DICE_FRAME_BASE_PX = Math.ceil(
    Math.max(getDiceStageCellWidthPx(), getDiceStageCoreHeightPx()),
);

export type DiceFrameLayoutInput = {
    diceCount: number;
    /** t-w: measured width of the dice area. */
    containerWidth: number;
    /** t-h: height budget (95lvh panel cap minus the Roll block). */
    maxHeightPx: number;
};

export type DiceFrameLayout = {
    /** i: square frame side in px (already scaled). */
    frameSizePx: number;
    /** Uniform scale (≤ 1) applied to the die inside its frame. */
    scale: number;
    columns: number;
    rows: number;
    gapPx: number;
    /** Exact grid footprint - pin these on the wrapper / dice area. */
    gridWidthPx: number;
    gridHeightPx: number;
};

const buildLayout = (
    diceCount: number,
    columns: number,
    frameSizePx: number,
): DiceFrameLayout => {
    const rows = Math.ceil(diceCount / columns);
    const gapPx = DICE_GRID_GAP_PX;
    return {
        frameSizePx,
        scale: frameSizePx / DICE_FRAME_BASE_PX,
        columns,
        rows,
        gapPx,
        gridWidthPx: columns * frameSizePx + (columns - 1) * gapPx,
        gridHeightPx: rows * frameSizePx + (rows - 1) * gapPx,
    };
};

const absoluteMinFramePx = (): number =>
    DICE_FRAME_BASE_PX * DICE_STAGE_MIN_SCALE;

const clampGridToHeightBudget = (
    layout: DiceFrameLayout,
    diceCount: number,
    maxHeightPx: number,
): DiceFrameLayout => {
    if (maxHeightPx <= 0 || layout.gridHeightPx <= maxHeightPx) {
        return layout;
    }

    const gapTotalH = (layout.rows - 1) * DICE_GRID_GAP_PX;
    const frameSizePx = Math.max(
        1,
        Math.floor((maxHeightPx - gapTotalH) / layout.rows),
    );

    return buildLayout(diceCount, layout.columns, frameSizePx);
};

const clampGridToWidthBudget = (
    layout: DiceFrameLayout,
    diceCount: number,
    containerWidth: number,
): DiceFrameLayout => {
    if (containerWidth <= 0 || layout.gridWidthPx <= containerWidth) {
        return layout;
    }

    const gapTotalW = (layout.columns - 1) * DICE_GRID_GAP_PX;
    const frameSizePx = Math.max(
        1,
        Math.floor((containerWidth - gapTotalW) / layout.columns),
    );

    return buildLayout(diceCount, layout.columns, frameSizePx);
};

/**
 * Largest square frames that fit `diceCount` inside the play panel.
 * Mirrors mystery-box `computeMysteryBoxStageGridLayout`.
 */
export const computeDiceFrameLayout = ({
    diceCount,
    containerWidth,
    maxHeightPx,
}: DiceFrameLayoutInput): DiceFrameLayout => {
    const count = Math.max(1, diceCount);

    if (containerWidth <= 0 || maxHeightPx <= 0) {
        return buildLayout(count, count, DICE_FRAME_BASE_PX);
    }

    let bestSide = 0;
    let bestColumns = count;

    for (let cols = 1; cols <= count; cols += 1) {
        const rows = Math.ceil(count / cols);
        const gapTotalW = (cols - 1) * DICE_GRID_GAP_PX;
        const gapTotalH = (rows - 1) * DICE_GRID_GAP_PX;
        const side = Math.min(
            (containerWidth - gapTotalW) / cols,
            (maxHeightPx - gapTotalH) / rows,
            DICE_FRAME_BASE_PX,
        );

        if (side > bestSide) {
            bestSide = side;
            bestColumns = cols;
        }
    }

    const absoluteMin = absoluteMinFramePx();
    const frameSide = Math.floor(Math.max(absoluteMin, bestSide));

    let layout = buildLayout(count, bestColumns, frameSide);

    if (count > 1) {
        layout = clampGridToHeightBudget(layout, count, maxHeightPx);
        layout = clampGridToWidthBudget(layout, count, containerWidth);
    }

    return layout;
};

export const getDiceItemsInRow = (
    row: number,
    diceCount: number,
    layout: Pick<DiceFrameLayout, "columns" | "rows">,
): number => {
    if (row < layout.rows - 1) {
        return layout.columns;
    }
    return diceCount - layout.columns * (layout.rows - 1);
};

/**
 * Horizontal inset so an incomplete last row sits centered under full rows.
 * Same leftover math as coin-flip `rowOffsetX`.
 */
export const getDiceLastRowOffsetX = (
    diceCount: number,
    layout: DiceFrameLayout,
): number => {
    const lastRowCount = getDiceItemsInRow(
        layout.rows - 1,
        diceCount,
        layout,
    );
    if (lastRowCount <= 0 || lastRowCount >= layout.columns) {
        return 0;
    }

    const rowWidth =
        lastRowCount * layout.frameSizePx + (lastRowCount - 1) * layout.gapPx;
    return (layout.gridWidthPx - rowWidth) / 2;
};

const rowOffsetX = (
    row: number,
    diceCount: number,
    layout: DiceFrameLayout,
): number => {
    const itemsInRow = getDiceItemsInRow(row, diceCount, layout);
    if (itemsInRow >= layout.columns) {
        return 0;
    }

    const rowWidth =
        itemsInRow * layout.frameSizePx + (itemsInRow - 1) * layout.gapPx;
    return (layout.gridWidthPx - rowWidth) / 2;
};

/** Center of the square frame cell for dice at `index` (CSS grid order, Three.js y-up). */
export const getDiceCellCenter = (
    index: number,
    layout: DiceFrameLayout,
    diceCount: number,
): { x: number; y: number } => {
    const col = index % layout.columns;
    const row = Math.floor(index / layout.columns);
    const stride = layout.frameSizePx + layout.gapPx;
    const offsetX = rowOffsetX(row, diceCount, layout);
    return {
        x: offsetX + col * stride + layout.frameSizePx / 2,
        y:
            layout.gridHeightPx -
            (row * stride + layout.frameSizePx / 2),
    };
};

/**
 * Hit-test in grid pixel space (origin top-left, y down) - matches the canvas DOM box.
 * Returns the die index under the point, or null.
 */
export const getDiceIndexAtPoint = (
    layout: DiceFrameLayout,
    diceCount: number,
    x: number,
    y: number,
): number | null => {
    const half = layout.frameSizePx / 2;

    for (let index = 0; index < diceCount; index += 1) {
        const center = getDiceCellCenter(index, layout, diceCount);
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
