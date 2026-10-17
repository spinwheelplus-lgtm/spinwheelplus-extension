/**
 * D4 regular tetrahedron: 4 of the 8 cube corners - (1,1,1), (1,−1,−1),
 * (−1,1,−1), (−1,−1,1). Face k uses the 3 vertices other than vertex k.
 * A tetrahedron has no opposite faces, so numbering is 1-4 by excluded vertex.
 */

import {
    buildPolyhedronFaces,
    normalizeFaceSpecs,
    type PolyhedronFaceSpec,
    type Vec3,
} from "@/lib/dice-roller/polyhedron-face-geometry";

const TETRA_VERTICES: readonly Vec3[] = [
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
];

export const D4_FACE_SPECS: readonly PolyhedronFaceSpec[] = normalizeFaceSpecs(
    TETRA_VERTICES.map((_, excluded) => ({
        value: excluded + 1,
        vertices: TETRA_VERTICES.filter((__, i) => i !== excluded),
    })),
);

export const D4_FACES = buildPolyhedronFaces(D4_FACE_SPECS);
