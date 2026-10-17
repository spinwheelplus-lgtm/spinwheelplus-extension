/** Builds roll-engine callbacks for any polyhedral die from its face set. */

import { secureRandomInt } from "@/lib/random-number/secure-random-int";
import {
    buildRollRotation,
    formatDiceTransform,
    randomizeInitialPose,
} from "@/lib/dice-roller/dice-roll-shared";
import {
    buildPolyOrientation,
    type PolyhedronFaceRender,
} from "@/lib/dice-roller/polyhedron-face-geometry";
import type {
    DiceInitialPose,
    DiceRotation,
} from "@/types/dice-roller";

export type PolyDiceEngine = {
    pickFace: () => number;
    buildRollRotation: (face: number, current: DiceRotation) => DiceRotation;
    randomizeInitialPose: () => DiceInitialPose;
    formatCubeTransform: (rotation: DiceRotation) => string;
};

export const createPolyDiceEngine = (
    faces: readonly PolyhedronFaceRender[],
    sides: number,
    label: string,
): PolyDiceEngine => {
    const orientation = buildPolyOrientation(faces);
    const pickFace = (): number => secureRandomInt(1, sides);

    return {
        pickFace,
        buildRollRotation: (face, current) =>
            buildRollRotation(orientation, face, current, label),
        randomizeInitialPose: () => randomizeInitialPose(orientation, pickFace),
        formatCubeTransform: formatDiceTransform,
    };
};
