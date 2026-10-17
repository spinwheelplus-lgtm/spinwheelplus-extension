import type { D6FaceStyle } from "@/lib/dice-roller/d6-cube-geometry";

export type DiceSides = 4 | 6 | 8 | 10 | 12 | 20;

export const SUPPORTED_DICE_SIDES = [
	4, 6, 8, 10, 12, 20,
] as const satisfies readonly DiceSides[];

/** Max dice on the table at once. */
export const MAX_ROLL_DICE_COUNT = 25;

/** Canvas tap behavior when multiple dice are on the table. */
export type RollDiceClickRollMode = "all" | "one";

/** Shipped default for Settings → Click on dice. */
export const DEFAULT_ROLL_DICE_CLICK_ROLL_MODE: RollDiceClickRollMode = "all";

/** Max roll results kept on this device. */
export const ROLL_DICE_HISTORY_LIMIT = 200;

export const DICE_ROLLER_STORE_PERSIST_KEY = "spinwheelplus.dice-roller.v1";

export type DiceRotation = {
	rx: number;
	ry: number;
};

export type DiceInitialPose = {
	rotation: DiceRotation;
	face: number;
};

/** Per-die colors and D6 face display on the roll table. */
export type RollDiceAppearance = {
	bodyColor: string;
	markColor: string;
	d6FaceStyle: D6FaceStyle;
	/** Six labels, index 0 is face 1. Blank faces paint the number. */
	d6FaceWords: readonly string[];
};

/** One die on the roll table (multi-dice mode). */
export type RollDiceSlot = {
	id: string;
	sides: DiceSides;
	rotation: DiceRotation;
	result: number | null;
	appearance: RollDiceAppearance;
};

/** Saved roll outcome - `null` in `values` renders as X in the breakdown. */
export type RollDiceHistoryEntry = {
	id: string;
	rolledAt: number;
	/** Sum of die faces (X counts as 0). Omitted in legacy persisted rows. */
	dice_total?: number;
	/** RPG bonus/penalty. Omitted in legacy persisted rows. */
	modifier?: number;
	/** Final result (dice total + modifier). */
	total: number;
	values: Array<number | null>;
	/** Word shown for each face. Null means that face counted as a number. */
	labels?: Array<string | null>;
};
