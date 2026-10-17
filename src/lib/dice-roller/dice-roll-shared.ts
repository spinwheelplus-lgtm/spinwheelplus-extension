import { secureRandomInt } from "@/lib/random-number/secure-random-int";
import type { DiceRotation } from "@/types/dice-roller";

/** Matches `.dice-tilt` transition in ex_dice CSS. */
export const DICE_TILT_UNLOAD_MS = 550;

/** Matches `.dice-cube--rolling` transition duration. */
export const DICE_ROLL_ANIMATION_MS = 1650;

export const bumpDiceRotation = (
    current: number,
    targetMod: number,
    minFullSpins: number,
): number => {
    const cur = ((current % 360) + 360) % 360;
    const tgt = ((targetMod % 360) + 360) % 360;
    let delta = tgt - cur;
    if (delta <= 0) {
        delta += 360;
    }
    delta += 360 * minFullSpins;
    return current + delta;
};

export const formatDiceTransform = (rotation: DiceRotation): string =>
    `rotateY(${rotation.ry}deg) rotateX(${rotation.rx}deg)`;

export const buildRollRotation = (
    orientation: Record<number, DiceRotation>,
    face: number,
    current: DiceRotation,
    sidesLabel: string,
): DiceRotation => {
    const target = orientation[face];
    if (!target) {
        throw new Error(`Invalid ${sidesLabel} face: ${face}`);
    }

    const minSpinsX = secureRandomInt(2, 4);
    const minSpinsY = secureRandomInt(2, 4);

    return {
        rx: bumpDiceRotation(current.rx, target.rx, minSpinsX),
        ry: bumpDiceRotation(current.ry, target.ry, minSpinsY),
    };
};

export const randomizeInitialPose = (
    orientation: Record<number, DiceRotation>,
    pickFace: () => number,
): { rotation: DiceRotation; face: number } => {
    const face = pickFace();
    const target = orientation[face]!;

    return {
        face,
        rotation: {
            rx: target.rx + 360 * secureRandomInt(0, 4),
            ry: target.ry + 360 * secureRandomInt(0, 4),
        },
    };
};
