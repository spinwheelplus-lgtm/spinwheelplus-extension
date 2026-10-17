import { secureRandomInt } from "@/lib/random-number/secure-random-int";

export type FlipCoinSide = "heads" | "tails";

export type FlipCoinAnimationPlan = {
    result: FlipCoinSide;
    spinTurns: number;
    durationSeconds: number;
    finalRotateY: 0 | 180;
};

export type FlipCoinFlipPlan = {
    coinId: string;
    plan: FlipCoinAnimationPlan;
};

/** Imperative flip command for the Three.js coin stage. */
export type FlipCoinWebGLRequest = {
    id: number;
    plans: readonly FlipCoinFlipPlan[];
    reduceMotion: boolean;
};

/** Fair heads/tails + cosmetic spin timing (reference: ex_flipcoin PNCoin). */
export const planCoinFlip = (): FlipCoinAnimationPlan => {
    const isHeads = secureRandomInt(0, 1) === 0;
    const spinTurns = secureRandomInt(15, 24);
    const durationSeconds = Number(
        (secureRandomInt(300, 599) / 100 + 3).toFixed(2),
    );

    return {
        result: isHeads ? "heads" : "tails",
        spinTurns,
        durationSeconds,
        finalRotateY: isHeads ? 0 : 180,
    };
};

export const formatFlipCoinResult = (side: FlipCoinSide): string =>
    side === "heads" ? "Heads" : "Tails";
