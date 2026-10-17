/**
 * D12 regular dodecahedron: the 20 canonical vertices (unit cube corners
 * plus golden-ratio rectangles), grouped into 12 regular-pentagon faces.
 * Face index lists are in perimeter order; opposite faces sum to 13.
 */

import {
    buildPolyhedronFaces,
    normalizeFaceSpecs,
    type PolyhedronFaceSpec,
    type Vec3,
} from "@/lib/dice-roller/polyhedron-face-geometry";

const PHI = (1 + Math.sqrt(5)) / 2;

/** Half cube-edge; circumradius = s·√3 ≈ 86.6px, fits the 180px stage. */
const D12_SCALE_PX = 50;

const buildVertices = (): Vec3[] => {
    const s = D12_SCALE_PX;
    const vertices: Vec3[] = [];
    for (const x of [-1, 1]) {
        for (const y of [-1, 1]) {
            for (const z of [-1, 1]) {
                vertices.push([x * s, y * s, z * s]);
            }
        }
    }
    for (const a of [-1, 1]) {
        for (const b of [-1, 1]) {
            vertices.push([0, (a * s) / PHI, b * s * PHI]);
            vertices.push([(a * s) / PHI, b * s * PHI, 0]);
            vertices.push([a * s * PHI, 0, (b * s) / PHI]);
        }
    }
    return vertices;
};

const D12_VERTICES = buildVertices();

const D12_FACE_INDICES: readonly { value: number; indices: readonly number[] }[] =
    [
        { value: 1, indices: [0, 9, 1, 13, 10] },
        { value: 2, indices: [14, 8, 0, 10, 2] },
        { value: 3, indices: [4, 15, 9, 0, 8] },
        { value: 4, indices: [11, 17, 3, 13, 1] },
        { value: 5, indices: [15, 5, 11, 1, 9] },
        { value: 6, indices: [3, 12, 2, 10, 13] },
        { value: 7, indices: [16, 19, 5, 15, 4] },
        { value: 8, indices: [18, 6, 14, 2, 12] },
        { value: 9, indices: [6, 16, 4, 8, 14] },
        { value: 10, indices: [7, 18, 12, 3, 17] },
        { value: 11, indices: [5, 19, 7, 17, 11] },
        { value: 12, indices: [19, 16, 6, 18, 7] },
    ];

export const D12_FACE_SPECS: readonly PolyhedronFaceSpec[] = normalizeFaceSpecs(
    D12_FACE_INDICES.map(({ value, indices }) => ({
        value,
        vertices: indices.map((i) => D12_VERTICES[i]!),
    })),
);

export const D12_FACES = buildPolyhedronFaces(D12_FACE_SPECS);
