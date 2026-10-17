import {
    computeFaceUprightAxes,
    computeOutwardNormal,
    type PolyhedronFaceSpec,
    type Vec3,
} from "@/lib/dice-roller/polyhedron-face-geometry";

type FaceGroup = {
    start: number;
    count: number;
    materialIndex: number;
};

const cross = (a: Vec3, b: Vec3): Vec3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
];

const dot = (a: Vec3, b: Vec3): number =>
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const normalize = (v: Vec3): Vec3 => {
    const len = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / len, v[1] / len, v[2] / len];
};

const subtract = (a: Vec3, b: Vec3): Vec3 => [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
];

/** CSS (y down) → Three.js (y up). */
const cssToThree = (v: Vec3): Vec3 => [v[0], -v[1], v[2]];

/**
 * UV from the CSS face-local layout (same axes as the CSS clip-path box):
 * s = screen-right, t = screen-down once the face lands upright.
 * With default texture flipY, canvas row 0 (top) maps to v=1, so v = 1 - t̂.
 * Rendering is pixel-equivalent to CSS because die rotations are conjugated
 * by the Y-flip (see roll-a-dice-webgl-grid) - no extra mirroring needed.
 */
const buildFaceUvs = (
    cssVertices: readonly Vec3[],
): readonly [number, number][] => {
    const { uAxis, vAxis } = computeFaceUprightAxes(cssVertices);
    const projected = cssVertices.map(
        (v): [number, number] => [dot(v, uAxis), dot(v, vAxis)],
    );
    const minS = Math.min(...projected.map((p) => p[0]));
    const maxS = Math.max(...projected.map((p) => p[0]));
    const minT = Math.min(...projected.map((p) => p[1]));
    const maxT = Math.max(...projected.map((p) => p[1]));
    const spanS = maxS - minS || 1;
    const spanT = maxT - minT || 1;

    return projected.map(
        ([s, t]): [number, number] => [
            (s - minS) / spanS,
            1 - (t - minT) / spanT,
        ],
    );
};

const pushTriangle = (
    positions: number[],
    normals: number[],
    uvs: number[],
    faceNormal: Vec3,
    a: Vec3,
    b: Vec3,
    c: Vec3,
    uvA: [number, number],
    uvB: [number, number],
    uvC: [number, number],
): void => {
    let vb = b;
    let vc = c;
    let uvb = uvB;
    let uvc = uvC;

    const triNormal = normalize(
        cross(subtract(vb, a), subtract(vc, a)),
    );
    if (dot(triNormal, faceNormal) < 0) {
        vb = c;
        vc = b;
        uvb = uvC;
        uvc = uvB;
    }

    for (const [v, uv] of [
        [a, uvA],
        [vb, uvb],
        [vc, uvc],
    ] as const) {
        positions.push(v[0], v[1], v[2]);
        normals.push(faceNormal[0], faceNormal[1], faceNormal[2]);
        uvs.push(uv[0], uv[1]);
    }
};

/** Builds non-indexed groups for multi-material mesh (CSS y-down → Three y-up). */
export const buildPolyhedronBufferGeometry = (
    specs: readonly PolyhedronFaceSpec[],
): {
    positions: Float32Array;
    normals: Float32Array;
    uvs: Float32Array;
    groups: FaceGroup[];
    /** Per face: polygon centroid in UV space - where the digit belongs. */
    faceUvCentroids: readonly [number, number][];
} => {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const groups: FaceGroup[] = [];
    const faceUvCentroids: [number, number][] = [];
    let vertexCount = 0;

    specs.forEach((spec, materialIndex) => {
        const cssVerts = spec.vertices;
        const verts = cssVerts.map(cssToThree);
        const normal = computeOutwardNormal(verts);
        const faceUvs = buildFaceUvs(cssVerts);
        faceUvCentroids.push([
            faceUvs.reduce((sum, uv) => sum + uv[0], 0) / faceUvs.length,
            faceUvs.reduce((sum, uv) => sum + uv[1], 0) / faceUvs.length,
        ]);
        const groupStart = vertexCount;

        for (let i = 1; i < verts.length - 1; i += 1) {
            pushTriangle(
                positions,
                normals,
                uvs,
                normal,
                verts[0]!,
                verts[i]!,
                verts[i + 1]!,
                faceUvs[0]!,
                faceUvs[i]!,
                faceUvs[i + 1]!,
            );
            vertexCount += 3;
        }

        groups.push({
            start: groupStart,
            count: vertexCount - groupStart,
            materialIndex,
        });
    });

    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        uvs: new Float32Array(uvs),
        groups,
        faceUvCentroids,
    };
};
