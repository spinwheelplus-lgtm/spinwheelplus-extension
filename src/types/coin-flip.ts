import type { FlipCoinMetal } from "@/lib/coin-flip/flip-a-coin-assets";
import type { FlipCoinHistoryFaceLabels } from "@/lib/coin-flip/flip-coin-face-style";
import type { FlipCoinSide } from "@/lib/coin-flip/plan-coin-flip";

export const MAX_FLIP_COIN_COUNT = 25;
export const FLIP_COIN_HISTORY_LIMIT = 200;
export const COIN_FLIP_STORE_PERSIST_KEY = "spinwheelplus.coin-flip.v1";

export type FlipCoinClickFlipMode = "all" | "one";
export const DEFAULT_FLIP_COIN_CLICK_FLIP_MODE: FlipCoinClickFlipMode = "all";

export type FlipCoinSlot = {
  id: string;
  metal: FlipCoinMetal;
};

export type FlipCoinHistoryEntry = {
  id: string;
  flipped_at: number;
  values: ReadonlyArray<FlipCoinSide | null>;
  /** Words on the faces at flip time. Absent on classic metal flips. */
  face_labels?: FlipCoinHistoryFaceLabels;
};
