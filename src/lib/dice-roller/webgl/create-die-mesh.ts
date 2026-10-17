import {
    BufferAttribute,
    BufferGeometry,
    CanvasTexture,
    Group,
    Mesh,
    MeshBasicMaterial,
    SRGBColorSpace,
    type Texture,
} from "three";

import type { DiceSides, RollDiceAppearance } from "@/types/dice-roller";

import { computeOutwardNormal } from "@/lib/dice-roller/polyhedron-face-geometry";
import type { Vec3 } from "@/lib/dice-roller/polyhedron-face-geometry";
import { buildPolyhedronBufferGeometry } from "@/lib/dice-roller/webgl/build-polyhedron-buffer-geometry";
import { getDiceTypeDefinition } from "@/lib/dice-roller/dice-type-registry";
import {
    createDieFaceCanvas,
    resolveDieFaceContent,
    type DieFaceContent,
} from "@/lib/dice-roller/webgl/create-die-face-texture";
import { getDiceFaceSpecs } from "@/lib/dice-roller/webgl/dice-face-specs-registry";

/** CSS y-down → Three.js y-up (same as geometry builder). */
const cssToThree = (v: Vec3): Vec3 => [v[0], -v[1], v[2]];

/** Matches polyhedron-face-geometry light, with Y flipped for Three space. */
const LIGHT_DIRECTION: Vec3 = [-0.45, 0.7, 0.55];

const faceLightFactor = (normal: Vec3): number => {
    const len = Math.hypot(normal[0], normal[1], normal[2]) || 1;
    const dot =
        (normal[0] / len) * LIGHT_DIRECTION[0] +
        (normal[1] / len) * LIGHT_DIRECTION[1] +
        (normal[2] / len) * LIGHT_DIRECTION[2];
    return (dot + 1) / 2;
};

/** Bump when buffer UV/layout or mesh scale changes so dev HMR does not reuse stale geometry. */
const GEOMETRY_CACHE_KEY = 6;

type DieGeometryEntry = {
    geometry: BufferGeometry;
};

const geometryCache = new Map<string, DieGeometryEntry>();

type CachedFaceTexture = {
    texture: CanvasTexture;
    refCount: number;
};

/** Shared face textures - reused when many dice share the same colors/style. */
const faceTextureCache = new Map<string, CachedFaceTexture>();

const faceTextureCacheKey = (
    sides: DiceSides,
    value: number,
    appearance: RollDiceAppearance,
    faceContent: DieFaceContent,
    lightFactor: number,
    word: string,
): string =>
    [
        GEOMETRY_CACHE_KEY,
        sides,
        value,
        appearance.bodyColor,
        appearance.markColor,
        faceContent,
        lightFactor.toFixed(3),
        word,
    ].join("|");

const acquireFaceTexture = (
    sides: DiceSides,
    value: number,
    appearance: RollDiceAppearance,
    faceContent: DieFaceContent,
    lightFactor: number,
    word: string,
): CanvasTexture => {
    const key = faceTextureCacheKey(
        sides,
        value,
        appearance,
        faceContent,
        lightFactor,
        word,
    );
    const cached = faceTextureCache.get(key);
    if (cached != null) {
        cached.refCount += 1;
        return cached.texture;
    }

    const anchor = getFaceMarkAnchor(sides, value);
    const canvas = createDieFaceCanvas(
        value,
        appearance.bodyColor,
        appearance.markColor,
        faceContent,
        { u: anchor.u, v: anchor.v },
        lightFactor,
        word,
    );
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    faceTextureCache.set(key, { texture, refCount: 1 });
    return texture;
};

const releaseFaceTexture = (texture: Texture | null | undefined): void => {
    if (texture == null || !(texture instanceof CanvasTexture)) {
        texture?.dispose();
        return;
    }
    for (const [key, entry] of faceTextureCache.entries()) {
        if (entry.texture !== texture) {
            continue;
        }
        entry.refCount -= 1;
        if (entry.refCount <= 0) {
            texture.dispose();
            faceTextureCache.delete(key);
        }
        return;
    }
    texture.dispose();
};

const disposeMaterials = (materials: MeshBasicMaterial[]): void => {
    for (const material of materials) {
        releaseFaceTexture(material.map);
        material.dispose();
    }
};

const parseCssPercent = (value: string | number | undefined): number => {
    if (value == null) {
        return 0.5;
    }
    if (typeof value === "number") {
        return value;
    }
    const parsed = Number.parseFloat(value.replace("%", "").trim());
    return Number.isFinite(parsed) ? parsed / 100 : 0.5;
};

/** Same mark anchor as CSS `PolyhedronFaceRender.numberStyle` (left/top %). */
const getFaceMarkAnchor = (
    sides: DiceSides,
    faceValue: number,
): { u: number; v: number } => {
    const face = getDiceTypeDefinition(sides).faces.find(
        (entry) => entry.value === faceValue,
    );
    const left = parseCssPercent(face?.numberStyle.left as string | undefined);
    const top = parseCssPercent(face?.numberStyle.top as string | undefined);
    // Canvas-space anchor: same left/top percentages as the CSS number span.
    return { u: left, v: top };
};

const getDieGeometry = (sides: DiceSides): DieGeometryEntry => {
    const cacheKey = `${sides}:${GEOMETRY_CACHE_KEY}`;
    const cached = geometryCache.get(cacheKey);
    if (cached != null) {
        return cached;
    }

    const specs = getDiceFaceSpecs(sides);
    const built = buildPolyhedronBufferGeometry(specs);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(built.positions, 3));
    geometry.setAttribute("normal", new BufferAttribute(built.normals, 3));
    geometry.setAttribute("uv", new BufferAttribute(built.uvs, 2));
    geometry.clearGroups();
    for (const group of built.groups) {
        geometry.addGroup(group.start, group.count, group.materialIndex);
    }
    const entry: DieGeometryEntry = {
        geometry,
    };
    geometryCache.set(cacheKey, entry);
    return entry;
};

export type DieMeshBundle = {
    root: Group;
    tiltXGroup: Group;
    tiltYGroup: Group;
    spinXGroup: Group;
    spinYGroup: Group;
    mesh: Mesh;
    dispose: () => void;
};

export const createDieMesh = (
    sides: DiceSides,
    appearance: RollDiceAppearance,
): DieMeshBundle => {
    const specs = getDiceFaceSpecs(sides);
    const { geometry } = getDieGeometry(sides);

    const materials = specs.map((spec) => {
        const normal = computeOutwardNormal(spec.vertices.map(cssToThree));
        const face = resolveDieFaceContent(sides, appearance, spec.value);
        return new MeshBasicMaterial({
            map: acquireFaceTexture(
                sides,
                spec.value,
                appearance,
                face.content,
                faceLightFactor(normal),
                face.word,
            ),
        });
    });

    const mesh = new Mesh(geometry, materials);
    // Vertices already sit at DICE_CIRCUMRADIUS_PX; per-cell scale is applied on root.
    mesh.scale.setScalar(1);

    // Hierarchy mirrors the CSS wrappers:
    //   tilt `rotateX(tx) rotateY(ty)`  → tiltX ∘ tiltY   (X outer)
    //   spin `rotateY(ry) rotateX(rx)`  → spinY ∘ spinX   (Y outer)
    const spinXGroup = new Group();
    spinXGroup.add(mesh);

    const spinYGroup = new Group();
    spinYGroup.add(spinXGroup);

    const tiltYGroup = new Group();
    tiltYGroup.add(spinYGroup);

    const tiltXGroup = new Group();
    tiltXGroup.add(tiltYGroup);

    const root = new Group();
    root.add(tiltXGroup);

    const dispose = (): void => {
        disposeMaterials(materials);
    };

    return { root, tiltXGroup, tiltYGroup, spinXGroup, spinYGroup, mesh, dispose };
};

export const updateDieMeshAppearance = (
    bundle: DieMeshBundle,
    sides: DiceSides,
    appearance: RollDiceAppearance,
): void => {
    const specs = getDiceFaceSpecs(sides);
    const materials = bundle.mesh.material;
    const list = Array.isArray(materials) ? materials : [materials];

    list.forEach((material, index) => {
        if (!(material instanceof MeshBasicMaterial)) {
            return;
        }
        const spec = specs[index];
        if (spec == null) {
            return;
        }
        const normal = computeOutwardNormal(spec.vertices.map(cssToThree));
        const face = resolveDieFaceContent(sides, appearance, spec.value);
        releaseFaceTexture(material.map);
        material.map = acquireFaceTexture(
            sides,
            spec.value,
            appearance,
            face.content,
            faceLightFactor(normal),
            face.word,
        );
        material.needsUpdate = true;
    });
};
