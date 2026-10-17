/**
 * D8 regular octahedron: vertices at (±s,0,0), (0,±s,0), (0,0,±s);
 * one equilateral-triangle face per octant. Opposite faces sum to 9.
 */

import {
    buildPolyhedronFaces,
    normalizeFaceSpecs,
    type PolyhedronFaceSpec,
    type Vec3,
} from "@/lib/dice-roller/polyhedron-face-geometry";

const D8_VERTEX_PX = 90;

const OCTANT_VALUES: readonly { signs: Vec3; value: number }[] = [
    { signs: [1, 1, 1], value: 1 },
    { signs: [1, 1, -1], value: 2 },
    { signs: [1, -1, 1], value: 3 },
    { signs: [-1, 1, 1], value: 4 },
    { signs: [1, -1, -1], value: 5 },
    { signs: [-1, 1, -1], value: 6 },
    { signs: [-1, -1, 1], value: 7 },
    { signs: [-1, -1, -1], value: 8 },
];

export const D8_FACE_SPECS: readonly PolyhedronFaceSpec[] = normalizeFaceSpecs(
    OCTANT_VALUES.map(({ signs: [sx, sy, sz], value }) => ({
        value,
        vertices: [
            [sx * D8_VERTEX_PX, 0, 0],
            [0, sy * D8_VERTEX_PX, 0],
            [0, 0, sz * D8_VERTEX_PX],
        ],
    })),
);

export const D8_FACES = buildPolyhedronFaces(D8_FACE_SPECS);
