/**
 * D6 cube: 6 square faces from the 8 corners of (±s, ±s, ±s).
 * Same shared face pipeline as D8-D20. Opposite faces sum to 7
 * (front 1, right 2, top 3, bottom 4, left 5, back 6 - ex_dice layout).
 */

import {
    buildPolyhedronFaces,
    normalizeFaceSpecs,
    type PolyhedronFaceSpec,
    type Vec3,
} from "@/lib/dice-roller/polyhedron-face-geometry";

/** Half edge before normalization to the shared circumradius. */
const D6_HALF_PX = 90;

/** Axis-aligned square face: fixed axis/sign, other two axes at ±s (y down). */
const squareFace = (axis: 0 | 1 | 2, sign: -1 | 1): Vec3[] => {
    const s = D6_HALF_PX;
    const corners: Vec3[] = [];
    for (const [u, v] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
    ] as const) {
        const p: [number, number, number] = [0, 0, 0];
        p[axis] = sign * s;
        p[(axis + 1) % 3] = u * s;
        p[(axis + 2) % 3] = v * s;
        corners.push(p);
    }
    return corners;
};

export const D6_FACE_SPECS: readonly PolyhedronFaceSpec[] = normalizeFaceSpecs([
    { value: 1, vertices: squareFace(2, 1) },
    { value: 2, vertices: squareFace(0, 1) },
    { value: 3, vertices: squareFace(1, -1) },
    { value: 4, vertices: squareFace(1, 1) },
    { value: 5, vertices: squareFace(0, -1) },
    { value: 6, vertices: squareFace(2, -1) },
]);

export const D6_FACES = buildPolyhedronFaces(D6_FACE_SPECS);

/** Face sub-style for D6 only: digits or classic pips. */
export type D6FaceStyle = "number" | "pip" | "words";

export const isD6FaceStyle = (value: unknown): value is D6FaceStyle =>
    value === "number" || value === "pip" || value === "words";

/** Active cells of a 3×3 grid (1-9, row-major) per die value. */
const D6_PIP_LAYOUT: Record<number, readonly number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
};

/** Pip centers as CSS percentages inside the square face box. */
export const getD6PipPositions = (
    value: number,
): readonly { left: string; top: string }[] =>
    (D6_PIP_LAYOUT[value] ?? []).map((cell) => {
        const col = (cell - 1) % 3;
        const row = Math.floor((cell - 1) / 3);
        return { left: `${25 + col * 25}%`, top: `${25 + row * 25}%` };
    });
