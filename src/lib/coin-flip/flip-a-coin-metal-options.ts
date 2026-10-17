import type { FlipCoinMetal } from "@/lib/coin-flip/flip-a-coin-assets";
import { FLIP_A_COIN_ASSETS } from "@/lib/coin-flip/flip-a-coin-assets";

export type FlipCoinMetalOption = {
    metal: FlipCoinMetal;
    label: string;
    previewSrc: string;
};

export const FLIP_COIN_METAL_OPTIONS: readonly FlipCoinMetalOption[] = [
    {
        metal: "gold",
        label: "Gold",
        previewSrc: FLIP_A_COIN_ASSETS.gold.headsSrc,
    },
    {
        metal: "silver",
        label: "Silver",
        previewSrc: FLIP_A_COIN_ASSETS.silver.headsSrc,
    },
    {
        metal: "copper",
        label: "Copper",
        previewSrc: FLIP_A_COIN_ASSETS.copper.headsSrc,
    },
] as const;

export const getFlipCoinMetalLabel = (metal: FlipCoinMetal): string =>
    FLIP_COIN_METAL_OPTIONS.find((option) => option.metal === metal)?.label ??
    metal;
