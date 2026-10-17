/**
 * D10 pentagonal trapezohedron: two apexes plus a zigzag ring of 10
 * vertices (upper/lower pentagons offset by 36°). Kite faces are planar
 * when the apex height satisfies C = h·(1+cos36°)/(1−cos36°).
 * Opposite faces sum to 11 (odd values around the top apex).
 */

import {
    buildPolyhedronFaces,
    normalizeFaceSpecs,
    type PolyhedronFaceSpec,
    type Vec3,
} from "@/lib/dice-roller/polyhedron-face-geometry";

const D10_RING_RADIUS_PX = 78;
const D10_RING_OFFSET_PX = 9.4;

const STEP_RAD = (36 * Math.PI) / 180;

const D10_APEX_PX =
    (D10_RING_OFFSET_PX * (1 + Math.cos(STEP_RAD))) / (1 - Math.cos(STEP_RAD));

/** Zigzag ring vertex i at azimuth 36°·i (even = upper, odd = lower; y down). */
const ringVertex = (i: number): Vec3 => [
    D10_RING_RADIUS_PX * Math.sin(STEP_RAD * i),
    i % 2 === 0 ? -D10_RING_OFFSET_PX : D10_RING_OFFSET_PX,
    D10_RING_RADIUS_PX * Math.cos(STEP_RAD * i),
];

const TOP_APEX: Vec3 = [0, -D10_APEX_PX, 0];
const BOTTOM_APEX: Vec3 = [0, D10_APEX_PX, 0];

const D10_TOP_VALUES = [1, 3, 5, 7, 9] as const;
const D10_BOTTOM_VALUES = [4, 2, 10, 8, 6] as const;

export const D10_FACE_SPECS: readonly PolyhedronFaceSpec[] = normalizeFaceSpecs([
    ...D10_TOP_VALUES.map(
        (value, k): PolyhedronFaceSpec => ({
            value,
            vertices: [
                TOP_APEX,
                ringVertex(2 * k),
                ringVertex(2 * k + 1),
                ringVertex((2 * k + 2) % 10),
            ],
        }),
    ),
    ...D10_BOTTOM_VALUES.map(
        (value, k): PolyhedronFaceSpec => ({
            value,
            vertices: [
                BOTTOM_APEX,
                ringVertex(2 * k + 1),
                ringVertex((2 * k + 2) % 10),
                ringVertex((2 * k + 3) % 10),
            ],
        }),
    ),
]);

export const D10_FACES = buildPolyhedronFaces(D10_FACE_SPECS);
