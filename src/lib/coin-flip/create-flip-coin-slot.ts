import { createItemId } from "@/lib/random";
import {
    FLIP_A_COIN_DEFAULT_METAL,
    type FlipCoinMetal,
} from "@/lib/coin-flip/flip-a-coin-assets";
import type { FlipCoinSlot } from "@/types/coin-flip";

export const createFlipCoinSlot = (
    metal: FlipCoinMetal = FLIP_A_COIN_DEFAULT_METAL,
): FlipCoinSlot => ({
    id: createItemId(),
    metal,
});

export const createDefaultFlipCoinSlots = (): FlipCoinSlot[] => [
    createFlipCoinSlot(FLIP_A_COIN_DEFAULT_METAL),
];

export const createFlipCoinSlotsFromMetals = (
    metals: readonly FlipCoinMetal[],
): FlipCoinSlot[] => metals.map((metal) => createFlipCoinSlot(metal));
