import { D4_FACES } from "@/lib/dice-roller/d4-tetrahedron-geometry";
import { D6_FACES } from "@/lib/dice-roller/d6-cube-geometry";
import { D8_FACES } from "@/lib/dice-roller/d8-octahedron-geometry";
import { D10_FACES } from "@/lib/dice-roller/d10-trapezohedron-geometry";
import { D12_FACES } from "@/lib/dice-roller/d12-dodecahedron-geometry";
import { D20_FACES } from "@/lib/dice-roller/d20-icosahedron-geometry";
import { createPolyDiceEngine } from "@/lib/dice-roller/poly-dice-engine";
import type { PolyhedronFaceRender } from "@/lib/dice-roller/polyhedron-face-geometry";
import type {
    DiceInitialPose,
    DiceRotation,
    DiceSides,
} from "@/types/dice-roller";
import { SUPPORTED_DICE_SIDES } from "@/types/dice-roller";

export type DiceRenderKind =
    | "d4-tetrahedron"
    | "d6-cube"
    | "d8-octahedron"
    | "d10-trapezohedron"
    | "d12-dodecahedron"
    | "d20-icosahedron";

export type DiceTypeDefinition = {
    sides: DiceSides;
    label: string;
    shortLabel: string;
    description: string;
    renderKind: DiceRenderKind;
    faces: readonly PolyhedronFaceRender[];
    pickFace: () => number;
    buildRollRotation: (face: number, current: DiceRotation) => DiceRotation;
    randomizeInitialPose: () => DiceInitialPose;
    formatCubeTransform: (rotation: DiceRotation) => string;
};

const defineDiceType = (
    sides: DiceSides,
    renderKind: DiceRenderKind,
    faces: readonly PolyhedronFaceRender[],
    description: string,
): DiceTypeDefinition => ({
    sides,
    label: `D${sides}`,
    shortLabel: String(sides),
    description,
    renderKind,
    faces,
    ...createPolyDiceEngine(faces, sides, `D${sides}`),
});

export const DICE_TYPE_REGISTRY: Record<DiceSides, DiceTypeDefinition> = {
    4: defineDiceType(
        4,
        "d4-tetrahedron",
        D4_FACES,
        "Four-sided die - common in tabletop RPGs for small damage rolls.",
    ),
    6: defineDiceType(
        6,
        "d6-cube",
        D6_FACES,
        "Classic six-sided die for board games and tabletop RPGs.",
    ),
    8: defineDiceType(
        8,
        "d8-octahedron",
        D8_FACES,
        "Eight-sided octahedron - a staple for weapon damage rolls.",
    ),
    10: defineDiceType(
        10,
        "d10-trapezohedron",
        D10_FACES,
        "Ten-sided die - used for percentages and d100 rolls.",
    ),
    12: defineDiceType(
        12,
        "d12-dodecahedron",
        D12_FACES,
        "Twelve-sided dodecahedron - big damage dice for barbarians.",
    ),
    20: defineDiceType(
        20,
        "d20-icosahedron",
        D20_FACES,
        "Twenty-sided icosahedron - the iconic attack and skill-check die.",
    ),
};

export const DICE_TYPE_OPTIONS = SUPPORTED_DICE_SIDES.map(
    (sides) => DICE_TYPE_REGISTRY[sides],
);

export const getDiceTypeDefinition = (sides: DiceSides): DiceTypeDefinition =>
    DICE_TYPE_REGISTRY[sides];
