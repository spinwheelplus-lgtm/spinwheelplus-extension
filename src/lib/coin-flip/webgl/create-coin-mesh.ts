import {
    CanvasTexture,
    CylinderGeometry,
    Group,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    SRGBColorSpace,
    TextureLoader,
    type Texture,
} from "three";

import {
    FLIP_A_COIN_ASSETS,
    FLIP_COIN_BASE_DIAMETER_PX,
    FLIP_COIN_BASE_THICKNESS_PX,
    type FlipCoinMetal,
} from "@/lib/coin-flip/flip-a-coin-assets";
import { renderLabeledCoinFace } from "@/lib/coin-flip/render-labeled-coin-face";

export type CoinSpinRig = {
    root: Group;
    spinYGroup: Group;
    spinXGroup: Group;
    /** In-plane correction so the far face stays upright during the X tumble. */
    faceRollGroup: Group;
};

export type CoinMeshBundle = CoinSpinRig & {
    dispose: () => void;
};

const RADIUS = FLIP_COIN_BASE_DIAMETER_PX / 2;
const THICKNESS = FLIP_COIN_BASE_THICKNESS_PX;
const SEGMENTS = 64;
const LABELED_EDGE_COLOR = 0xd4a017;

export type CoinMeshFaceSource =
    | { kind: "metal"; metal: FlipCoinMetal }
    | {
          kind: "labeled";
          headsColor: string;
          tailsColor: string;
          headsLabel: string;
          tailsLabel: string;
      };

/**
 * Cylinder top/bottom UVs are sideways after `rotation.x = π/2`.
 * Rotate maps so coin art reads upright (lion / text the right way up).
 */
const orientFaceTexture = (texture: Texture): Texture => {
    texture.colorSpace = SRGBColorSpace;
    texture.center.set(0.5, 0.5);
    texture.rotation = Math.PI / 2;
    texture.needsUpdate = true;
    return texture;
};

const loadFaceTexture = async (url: string): Promise<Texture> =>
    orientFaceTexture(await new TextureLoader().loadAsync(url));

/** Parents `mesh` under the spin rig. Cylinder +Y becomes the face toward the camera. */
export const mountCoinSpinRig = (mesh: Mesh): CoinSpinRig => {
    mesh.rotation.x = Math.PI / 2;

    const faceRollGroup = new Group();
    const spinXGroup = new Group();
    const spinYGroup = new Group();
    const root = new Group();
    faceRollGroup.add(mesh);
    spinXGroup.add(faceRollGroup);
    spinYGroup.add(spinXGroup);
    root.add(spinYGroup);

    return {
        root,
        spinYGroup,
        spinXGroup,
        faceRollGroup,
    };
};

/**
 * X tumble past a half turn shows the far face upside down.
 * Roll it back on that half of the spin, switching only while the coin is edge-on.
 */
export const applyCoinMeshSpin = (
    bundle: CoinSpinRig,
    spinRxDeg: number,
    spinRyDeg: number,
): void => {
    const phase = ((spinRxDeg % 360) + 360) % 360;
    const farSideFacingCamera = phase > 90 && phase < 270;
    bundle.faceRollGroup.rotation.z = farSideFacingCamera ? Math.PI : 0;
    bundle.spinXGroup.rotation.x = -MathUtils.degToRad(spinRxDeg);
    bundle.spinYGroup.rotation.y = MathUtils.degToRad(spinRyDeg);
};

const loadLabeledFaceTexture = async (
    color: string,
    label: string,
): Promise<Texture> => {
    const canvas = await renderLabeledCoinFace(color, label);
    return orientFaceTexture(new CanvasTexture(canvas));
};

/**
 * Coin = thin cylinder (Y-up), then rotated so the top face looks at the camera.
 * Materials: [side, top/heads, bottom/tails].
 */
export const createCoinMesh = async (
    source: CoinMeshFaceSource,
): Promise<CoinMeshBundle> => {
    const faceMaps =
        source.kind === "metal"
            ? await Promise.all([
                  loadFaceTexture(FLIP_A_COIN_ASSETS[source.metal].headsSrc),
                  loadFaceTexture(FLIP_A_COIN_ASSETS[source.metal].tailsSrc),
              ])
            : await Promise.all([
                  loadLabeledFaceTexture(source.headsColor, source.headsLabel),
                  loadLabeledFaceTexture(source.tailsColor, source.tailsLabel),
              ]);
    const [headsMap, tailsMap] = faceMaps;
    const edgeColor =
        source.kind === "metal"
            ? FLIP_A_COIN_ASSETS[source.metal].edgeColor
            : LABELED_EDGE_COLOR;

    const geometry = new CylinderGeometry(RADIUS, RADIUS, THICKNESS, SEGMENTS);
    const sideMat = new MeshBasicMaterial({ color: edgeColor });
    const headsMat = new MeshBasicMaterial({ map: headsMap });
    const tailsMat = new MeshBasicMaterial({ map: tailsMap });

    const mesh = new Mesh(geometry, [sideMat, headsMat, tailsMat]);
    const rig = mountCoinSpinRig(mesh);

    return {
        ...rig,
        dispose: () => {
            geometry.dispose();
            sideMat.dispose();
            headsMat.dispose();
            tailsMat.dispose();
            headsMap.dispose();
            tailsMap.dispose();
        },
    };
};
