/** Shared roll-a-dice 3D stage constants. */

/** Base die size at layout scale 1 - multi-dice layout shrinks from this cap automatically. */
export const DICE_STAGE_SIZE_PX = 200;

/**
 * 3D mesh circumradius (world units) at layout scale 1.
 * Ratio calibrated when DICE_STAGE_SIZE_PX was 180 and circumradius was 110.
 */
const DICE_CIRCUMRADIUS_TO_STAGE_RATIO = 110 / 180;
export const DICE_CIRCUMRADIUS_PX =
	DICE_STAGE_SIZE_PX * DICE_CIRCUMRADIUS_TO_STAGE_RATIO;

/** Viewport width multiplier for each die cell (perspective overflow). */
export const DICE_STAGE_VIEWPORT_WIDTH_RATIO = 1.45;

export const getDiceStageViewportWidthPx = (
	stageSizePx: number = DICE_STAGE_SIZE_PX,
): number => stageSizePx * DICE_STAGE_VIEWPORT_WIDTH_RATIO;

/** Extra inset so tilted waiting-pose dice are not clipped by the cell box. */
export const DICE_STAGE_TILT_PAD_TOP_PX = 32;
export const DICE_STAGE_TILT_PAD_BOTTOM_PX = 20;
export const DICE_STAGE_TILT_PAD_X_PX = 6;

export const getDiceStageCoreHeightPx = (
	stageSizePx: number = DICE_STAGE_SIZE_PX,
): number =>
	stageSizePx + DICE_STAGE_TILT_PAD_TOP_PX + DICE_STAGE_TILT_PAD_BOTTOM_PX;

export const getDiceStageCellWidthPx = (
	stageSizePx: number = DICE_STAGE_SIZE_PX,
): number =>
	getDiceStageViewportWidthPx(stageSizePx) + DICE_STAGE_TILT_PAD_X_PX * 2;

/**
 * Presentation of the whole die:
 * - `waiting`: idle showcase - tilted 3D view before the roll.
 * - `rolling`: straight-on while the inner cube spins.
 * - `result`: straight-on so the landed face reads clearly (no extra zoom).
 */
export type DiceStagePose = "waiting" | "rolling" | "result";
