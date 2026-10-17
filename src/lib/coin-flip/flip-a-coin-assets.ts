export type FlipCoinMetal = "gold" | "silver" | "copper";

export type FlipCoinAssetSet = {
    headsSrc: string;
    tailsSrc: string;
    /** Hex edge color for Three.js coin rim. */
    edgeColor: number;
};

const coinAssetUrl = (file: string): string => {
    if (typeof document === "undefined") {
        return `./flip-a-coin/${file}`;
    }
    return new URL(`./flip-a-coin/${file}`, document.baseURI).href;
};

export const FLIP_A_COIN_DEFAULT_METAL: FlipCoinMetal = "gold";

export const FLIP_A_COIN_ASSETS: Record<FlipCoinMetal, FlipCoinAssetSet> = {
    gold: {
        headsSrc: coinAssetUrl("gold-heads.webp"),
        tailsSrc: coinAssetUrl("gold-tails.webp"),
        edgeColor: 0xa97d11,
    },
    silver: {
        headsSrc: coinAssetUrl("silver-heads.webp"),
        tailsSrc: coinAssetUrl("silver-tails.webp"),
        edgeColor: 0x808080,
    },
    copper: {
        headsSrc: coinAssetUrl("copper-heads.webp"),
        tailsSrc: coinAssetUrl("copper-tails.webp"),
        edgeColor: 0xb87333,
    },
};

/** Design diameter (world units / px at scale 1). */
export const FLIP_COIN_BASE_DIAMETER_PX = 220;

/** Rim thickness at design diameter. */
export const FLIP_COIN_BASE_THICKNESS_PX = 14;
