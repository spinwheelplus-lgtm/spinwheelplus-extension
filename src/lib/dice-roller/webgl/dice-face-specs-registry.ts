import { D4_FACE_SPECS } from "@/lib/dice-roller/d4-tetrahedron-geometry";
import { D6_FACE_SPECS } from "@/lib/dice-roller/d6-cube-geometry";
import { D8_FACE_SPECS } from "@/lib/dice-roller/d8-octahedron-geometry";
import { D10_FACE_SPECS } from "@/lib/dice-roller/d10-trapezohedron-geometry";
import { D12_FACE_SPECS } from "@/lib/dice-roller/d12-dodecahedron-geometry";
import { D20_FACE_SPECS } from "@/lib/dice-roller/d20-icosahedron-geometry";
import type { PolyhedronFaceSpec } from "@/lib/dice-roller/polyhedron-face-geometry";
import type { DiceSides } from "@/types/dice-roller";

export const DICE_FACE_SPECS_BY_SIDES: Record<
    DiceSides,
    readonly PolyhedronFaceSpec[]
> = {
    4: D4_FACE_SPECS,
    6: D6_FACE_SPECS,
    8: D8_FACE_SPECS,
    10: D10_FACE_SPECS,
    12: D12_FACE_SPECS,
    20: D20_FACE_SPECS,
};

export const getDiceFaceSpecs = (sides: DiceSides): readonly PolyhedronFaceSpec[] =>
    DICE_FACE_SPECS_BY_SIDES[sides];
