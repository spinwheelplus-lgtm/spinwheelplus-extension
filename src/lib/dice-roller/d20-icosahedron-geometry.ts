/**
 * D20 regular icosahedron: 12 vertices (cyclic permutations of (0, ±s, ±s·φ))
 * form 20 equilateral-triangle faces. Opposite faces sum to 21.
 */

import {
    buildPolyhedronFaces,
    normalizeFaceSpecs,
    type PolyhedronFaceSpec,
    type Vec3,
} from "@/lib/dice-roller/polyhedron-face-geometry";

const PHI = (1 + Math.sqrt(5)) / 2;

/** Half edge-length; circumradius = s·√(1+φ²) ≈ 87.5px, fits the 180px stage. */
const D20_SCALE_PX = 46;

const buildVertices = (): Vec3[] => {
    const s = D20_SCALE_PX;
    const vertices: Vec3[] = [];
    for (const a of [-1, 1]) {
        for (const b of [-1, 1]) {
            vertices.push([0, a * s, b * s * PHI]);
            vertices.push([a * s, b * s * PHI, 0]);
            vertices.push([a * s * PHI, 0, b * s]);
        }
    }
    return vertices;
};

const D20_VERTICES = buildVertices();

const D20_FACE_INDICES: readonly { value: number; indices: readonly number[] }[] =
    [
        { value: 1, indices: [0, 1, 2] },
        { value: 2, indices: [0, 1, 7] },
        { value: 3, indices: [0, 2, 6] },
        { value: 4, indices: [0, 6, 8] },
        { value: 5, indices: [0, 7, 8] },
        { value: 6, indices: [1, 2, 5] },
        { value: 7, indices: [1, 3, 5] },
        { value: 8, indices: [1, 3, 7] },
        { value: 9, indices: [2, 4, 5] },
        { value: 10, indices: [2, 4, 6] },
        { value: 11, indices: [3, 7, 11] },
        { value: 12, indices: [7, 8, 11] },
        { value: 13, indices: [4, 6, 10] },
        { value: 14, indices: [6, 8, 10] },
        { value: 15, indices: [8, 10, 11] },
        { value: 16, indices: [4, 5, 9] },
        { value: 17, indices: [3, 5, 9] },
        { value: 18, indices: [3, 9, 11] },
        { value: 19, indices: [4, 9, 10] },
        { value: 20, indices: [9, 10, 11] },
    ];

export const D20_FACE_SPECS: readonly PolyhedronFaceSpec[] = normalizeFaceSpecs(
    D20_FACE_INDICES.map(({ value, indices }) => ({
        value,
        vertices: indices.map((i) => D20_VERTICES[i]!),
    })),
);

export const D20_FACES = buildPolyhedronFaces(D20_FACE_SPECS);
