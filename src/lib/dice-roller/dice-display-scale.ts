import type { DiceSides } from "@/types/dice-roller";

/**
 * Static per-type screen scale - same mesh, roll, and textures; only the
 * placed size in the grid cell changes so D4/D6 read closer to D20 height.
 */
export const DICE_DISPLAY_SCALE_BY_SIDES: Record<DiceSides, number> = {
    4: 1.2,
    6: 1.28,
    8: 1.12,
    10: 1.06,
    12: 1.03,
    20: 1,
};

export const getDiceDisplayScale = (sides: DiceSides): number =>
    DICE_DISPLAY_SCALE_BY_SIDES[sides];
