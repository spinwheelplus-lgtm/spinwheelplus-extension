import { useEffect, useRef, useState } from "react";
import {
    MathUtils,
    OrthographicCamera,
    Scene,
    SRGBColorSpace,
    WebGLRenderer,
} from "three";

import type { DiceStagePose } from "@/lib/dice-roller/roll-a-dice-classes";
import {
    DICE_ROLL_ANIMATION_MS,
    DICE_TILT_UNLOAD_MS,
} from "@/lib/dice-roller/dice-roll-shared";
import { getDiceDisplayScale } from "@/lib/dice-roller/dice-display-scale";
import {
    getDiceCellCenter,
    getDiceIndexAtPoint,
    type DiceFrameLayout,
} from "@/lib/dice-roller/roll-a-dice-stage-layout";
import {
    createDieMesh,
    updateDieMeshAppearance,
    type DieMeshBundle,
} from "@/lib/dice-roller/webgl/create-die-mesh";
import type { DiceRotation, RollDiceClickRollMode, RollDiceSlot } from "@/types/dice-roller";

type RollADiceWebGLGridProps = {
    diceSlots: readonly RollDiceSlot[];
    stagePose: DiceStagePose;
    isRolling: boolean;
    reduceMotion: boolean;
    layout: DiceFrameLayout;
    onRollAll: () => void;
    onRollDie: (id: string) => void;
    clickRollMode: RollDiceClickRollMode;
    rollDisabled?: boolean;
};

type DieRuntime = {
    bundle: DieMeshBundle;
    sides: RollDiceSlot["sides"];
    appearanceKey: string;
    spinRx: number;
    spinRy: number;
    targetRx: number;
    targetRy: number;
    spinFromRx: number;
    spinFromRy: number;
    spinStartMs: number;
    spinDurationMs: number;
    tiltRx: number;
    tiltRy: number;
    targetTiltRx: number;
    targetTiltRy: number;
    tiltFromRx: number;
    tiltFromRy: number;
    tiltStartMs: number;
    tiltDurationMs: number;
};

type WebGLHost = {
    scene: Scene;
    camera: OrthographicCamera;
    renderer: WebGLRenderer;
};

const TILT_WAITING = { rx: -22, ry: -28 };
const TILT_FLAT = { rx: 0, ry: 0 };

const appearanceKey = (slot: RollDiceSlot): string =>
    [
        slot.appearance.bodyColor,
        slot.appearance.markColor,
        slot.appearance.d6FaceStyle,
        slot.appearance.d6FaceWords.join("\u001f"),
    ].join("|");

const applyDieLayout = (
    bundle: DieMeshBundle,
    index: number,
    layout: DiceFrameLayout,
    sides: RollDiceSlot["sides"],
    diceCount: number,
): void => {
    const { x, y } = getDiceCellCenter(index, layout, diceCount);
    bundle.root.position.set(x, y, 0);
    bundle.root.scale.setScalar(layout.scale * getDiceDisplayScale(sides));
};

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

const isRuntimeAnimating = (runtime: DieRuntime, now: number): boolean => {
    const spinMs = Math.max(runtime.spinDurationMs, 1);
    const tiltMs = Math.max(runtime.tiltDurationMs, 1);
    const spinT = Math.min(1, (now - runtime.spinStartMs) / spinMs);
    const tiltT = Math.min(1, (now - runtime.tiltStartMs) / tiltMs);
    return spinT < 1 || tiltT < 1;
};

const getTiltTarget = (stagePose: DiceStagePose): DiceRotation =>
    stagePose === "waiting" ? TILT_WAITING : TILT_FLAT;

const applySpin = (runtime: DieRuntime, now: number): void => {
    const t = Math.min(1, (now - runtime.spinStartMs) / runtime.spinDurationMs);
    const eased = easeOutCubic(t);
    runtime.spinRx =
        runtime.spinFromRx + (runtime.targetRx - runtime.spinFromRx) * eased;
    runtime.spinRy =
        runtime.spinFromRy + (runtime.targetRy - runtime.spinFromRy) * eased;
    // CSS→Three conjugation by the Y-flip: rotateX(θ) → rotation.x = -θ,
    // rotateY(θ) unchanged. Group order (Y outer, X inner) matches
    // CSS `rotateY(ry) rotateX(rx)`.
    runtime.bundle.spinXGroup.rotation.x = -MathUtils.degToRad(runtime.spinRx);
    runtime.bundle.spinYGroup.rotation.y = MathUtils.degToRad(runtime.spinRy);
};

const applyTilt = (runtime: DieRuntime, now: number): void => {
    const t = Math.min(1, (now - runtime.tiltStartMs) / runtime.tiltDurationMs);
    const eased = easeOutCubic(t);
    runtime.tiltRx =
        runtime.tiltFromRx + (runtime.targetTiltRx - runtime.tiltFromRx) * eased;
    runtime.tiltRy =
        runtime.tiltFromRy + (runtime.targetTiltRy - runtime.tiltFromRy) * eased;
    // CSS tilt `rotateX(tx) rotateY(ty)` with the same X-negation as spin.
    runtime.bundle.tiltXGroup.rotation.x = -MathUtils.degToRad(runtime.tiltRx);
    runtime.bundle.tiltYGroup.rotation.y = MathUtils.degToRad(runtime.tiltRy);
};

const syncCamera = (
    host: WebGLHost,
    layout: DiceFrameLayout,
): void => {
    const { gridWidthPx, gridHeightPx } = layout;
    // Frustum bounds are offsets from the camera axis, so the camera sits at
    // the grid center and the frustum spans ±half - world region = 0..w, 0..h.
    host.camera.left = -gridWidthPx / 2;
    host.camera.right = gridWidthPx / 2;
    host.camera.top = gridHeightPx / 2;
    host.camera.bottom = -gridHeightPx / 2;
    host.camera.position.set(gridWidthPx / 2, gridHeightPx / 2, 1200);
    host.camera.lookAt(gridWidthPx / 2, gridHeightPx / 2, 0);
    host.camera.updateProjectionMatrix();
    host.renderer.setSize(gridWidthPx, gridHeightPx, false);
};

/** Single WebGL canvas for the dice table - Three.js is imported only in this chunk. */
const RollADiceWebGLGrid = ({
    diceSlots,
    stagePose,
    isRolling,
    reduceMotion,
    layout,
    onRollAll,
    onRollDie,
    clickRollMode,
    rollDisabled = false,
}: RollADiceWebGLGridProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hostRef = useRef<WebGLHost | null>(null);
    const diceRef = useRef<Map<string, DieRuntime>>(new Map());
    const rafRef = useRef(0);
    const scheduleRenderRef = useRef<() => void>(() => {});
    const diceSlotsRef = useRef(diceSlots);
    const layoutRef = useRef(layout);
    const onRollAllRef = useRef(onRollAll);
    const onRollDieRef = useRef(onRollDie);
    const clickRollModeRef = useRef(clickRollMode);
    const rollDisabledRef = useRef(rollDisabled);
    const isRollingRef = useRef(isRolling);
    const lastPoseRef = useRef<Map<string, DiceRotation>>(new Map());
    const [glEpoch, setGlEpoch] = useState(0);

    diceSlotsRef.current = diceSlots;
    layoutRef.current = layout;
    onRollAllRef.current = onRollAll;
    onRollDieRef.current = onRollDie;
    clickRollModeRef.current = clickRollMode;
    rollDisabledRef.current = rollDisabled;
    isRollingRef.current = isRolling;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas == null) {
            return undefined;
        }

        const scene = new Scene();
        const camera = new OrthographicCamera(0, 1, 0, 1, 0.1, 4000);
        const renderer = new WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = SRGBColorSpace;

        hostRef.current = { scene, camera, renderer };
        syncCamera(hostRef.current, layout);
        setGlEpoch((epoch) => epoch + 1);

        const tick = (now: number): void => {
            let animating = false;
            for (const runtime of diceRef.current.values()) {
                applySpin(runtime, now);
                applyTilt(runtime, now);
                if (isRuntimeAnimating(runtime, now)) {
                    animating = true;
                }
            }
            renderer.render(scene, camera);
            if (animating) {
                rafRef.current = window.requestAnimationFrame(tick);
            } else {
                rafRef.current = 0;
            }
        };

        const scheduleRender = (): void => {
            if (rafRef.current !== 0) {
                return;
            }
            rafRef.current = window.requestAnimationFrame(tick);
        };
        scheduleRenderRef.current = scheduleRender;
        scheduleRender();

        const handleVisibilityChange = (): void => {
            if (document.visibilityState === "visible") {
                scheduleRender();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const diceMap = diceRef.current;

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            window.cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
            scheduleRenderRef.current = () => {};
            for (const [id, runtime] of diceMap.entries()) {
                lastPoseRef.current.set(id, {
                    rx: runtime.spinRx,
                    ry: runtime.spinRy,
                });
                scene.remove(runtime.bundle.root);
                runtime.bundle.dispose();
            }
            diceMap.clear();
            renderer.dispose();
            hostRef.current = null;
        };
        // Mount once; layout/size updates handled below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const host = hostRef.current;
        if (host == null) {
            return;
        }
        const currentLayout = layoutRef.current;
        syncCamera(host, currentLayout);
        diceSlotsRef.current.forEach((slot, index) => {
            const runtime = diceRef.current.get(slot.id);
            if (runtime == null) {
                return;
            }
            applyDieLayout(
                runtime.bundle,
                index,
                currentLayout,
                slot.sides,
                diceSlotsRef.current.length,
            );
        });
        scheduleRenderRef.current();
    }, [layout, glEpoch]);

    useEffect(() => {
        const host = hostRef.current;
        if (host == null) {
            return;
        }

        const currentLayout = layoutRef.current;
        const now = performance.now();
        const tiltTarget = getTiltTarget(stagePose);
        const tiltDuration = reduceMotion ? 1 : DICE_TILT_UNLOAD_MS;
        const spinDuration = reduceMotion ? 1 : DICE_ROLL_ANIMATION_MS;
        const nextIds = new Set(diceSlots.map((slot) => slot.id));

        for (const [id, runtime] of diceRef.current.entries()) {
            if (!nextIds.has(id)) {
                host.scene.remove(runtime.bundle.root);
                runtime.bundle.dispose();
                diceRef.current.delete(id);
                lastPoseRef.current.delete(id);
            }
        }

        diceSlots.forEach((slot, index) => {
            let runtime = diceRef.current.get(slot.id);
            const nextKey = appearanceKey(slot);

            if (runtime == null) {
                const bundle = createDieMesh(slot.sides, slot.appearance);
                applyDieLayout(
                    bundle,
                    index,
                    currentLayout,
                    slot.sides,
                    diceSlots.length,
                );
                host.scene.add(bundle.root);
                const lastPose = lastPoseRef.current.get(slot.id);
                const spinFromRx =
                    lastPose?.rx ??
                    (isRolling ? slot.rotation.rx - 720 : slot.rotation.rx);
                const spinFromRy =
                    lastPose?.ry ??
                    (isRolling ? slot.rotation.ry - 720 : slot.rotation.ry);
                const shouldSpin =
                    isRolling &&
                    (spinFromRx !== slot.rotation.rx ||
                        spinFromRy !== slot.rotation.ry);
                runtime = {
                    bundle,
                    sides: slot.sides,
                    appearanceKey: nextKey,
                    spinRx: spinFromRx,
                    spinRy: spinFromRy,
                    targetRx: slot.rotation.rx,
                    targetRy: slot.rotation.ry,
                    spinFromRx,
                    spinFromRy,
                    spinStartMs: now,
                    spinDurationMs: shouldSpin ? spinDuration : 1,
                    tiltRx: tiltTarget.rx,
                    tiltRy: tiltTarget.ry,
                    targetTiltRx: tiltTarget.rx,
                    targetTiltRy: tiltTarget.ry,
                    tiltFromRx: tiltTarget.rx,
                    tiltFromRy: tiltTarget.ry,
                    tiltStartMs: now,
                    tiltDurationMs: 1,
                };
                applySpin(runtime, now);
                applyTilt(runtime, now);
                diceRef.current.set(slot.id, runtime);
                lastPoseRef.current.set(slot.id, {
                    rx: runtime.spinRx,
                    ry: runtime.spinRy,
                });
                return;
            }

            if (runtime.sides !== slot.sides) {
                host.scene.remove(runtime.bundle.root);
                runtime.bundle.dispose();
                const bundle = createDieMesh(slot.sides, slot.appearance);
                applyDieLayout(
                    bundle,
                    index,
                    currentLayout,
                    slot.sides,
                    diceSlots.length,
                );
                host.scene.add(bundle.root);
                runtime = {
                    bundle,
                    sides: slot.sides,
                    appearanceKey: nextKey,
                    spinRx: runtime.spinRx,
                    spinRy: runtime.spinRy,
                    targetRx: runtime.targetRx,
                    targetRy: runtime.targetRy,
                    spinFromRx: runtime.spinFromRx,
                    spinFromRy: runtime.spinFromRy,
                    spinStartMs: runtime.spinStartMs,
                    spinDurationMs: runtime.spinDurationMs,
                    tiltRx: runtime.tiltRx,
                    tiltRy: runtime.tiltRy,
                    targetTiltRx: runtime.targetTiltRx,
                    targetTiltRy: runtime.targetTiltRy,
                    tiltFromRx: runtime.tiltFromRx,
                    tiltFromRy: runtime.tiltFromRy,
                    tiltStartMs: runtime.tiltStartMs,
                    tiltDurationMs: runtime.tiltDurationMs,
                };
                applySpin(runtime, now);
                applyTilt(runtime, now);
                diceRef.current.set(slot.id, runtime);
                return;
            }

            if (runtime.appearanceKey !== nextKey) {
                runtime.appearanceKey = nextKey;
                updateDieMeshAppearance(
                    runtime.bundle,
                    slot.sides,
                    slot.appearance,
                );
            }

            if (
                runtime.targetRx !== slot.rotation.rx ||
                runtime.targetRy !== slot.rotation.ry
            ) {
                runtime.spinFromRx = runtime.spinRx;
                runtime.spinFromRy = runtime.spinRy;
                runtime.targetRx = slot.rotation.rx;
                runtime.targetRy = slot.rotation.ry;
                runtime.spinStartMs = now;
                runtime.spinDurationMs = reduceMotion ? 1 : spinDuration;
            }

            lastPoseRef.current.set(slot.id, {
                rx: runtime.spinRx,
                ry: runtime.spinRy,
            });

            if (
                runtime.targetTiltRx !== tiltTarget.rx ||
                runtime.targetTiltRy !== tiltTarget.ry
            ) {
                runtime.tiltFromRx = runtime.tiltRx;
                runtime.tiltFromRy = runtime.tiltRy;
                runtime.targetTiltRx = tiltTarget.rx;
                runtime.targetTiltRy = tiltTarget.ry;
                runtime.tiltStartMs = now;
                runtime.tiltDurationMs = tiltDuration;
            }
        });
        scheduleRenderRef.current();
    }, [diceSlots, glEpoch, isRolling, reduceMotion, stagePose]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas == null) {
            return undefined;
        }

        const handlePointerUp = (event: PointerEvent) => {
            if (rollDisabledRef.current || isRollingRef.current) {
                return;
            }

            const canvasEl = canvasRef.current;
            const currentLayout = layoutRef.current;
            const slots = diceSlotsRef.current;
            if (canvasEl == null || currentLayout == null) {
                return;
            }

            if (clickRollModeRef.current === "all" || slots.length <= 1) {
                onRollAllRef.current();
                return;
            }

            const rect = canvasEl.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) {
                return;
            }

            const x =
                ((event.clientX - rect.left) / rect.width) *
                currentLayout.gridWidthPx;
            const y =
                ((event.clientY - rect.top) / rect.height) *
                currentLayout.gridHeightPx;
            const index = getDiceIndexAtPoint(
                currentLayout,
                slots.length,
                x,
                y,
            );

            if (index == null) {
                return;
            }

            const slot = slots[index];
            if (slot != null) {
                onRollDieRef.current(slot.id);
            }
        };

        canvas.addEventListener("pointerup", handlePointerUp);
        return () => {
            canvas.removeEventListener("pointerup", handlePointerUp);
        };
    }, []);

    const canRollDie = !rollDisabled && !isRolling;

    return (
        <div
            className="mx-auto w-full"
            style={{
                maxWidth: layout.gridWidthPx,
                aspectRatio: `${layout.gridWidthPx} / ${layout.gridHeightPx}`,
            }}
            aria-label={`${diceSlots.length} dice on the table`}
        >
            <canvas
                ref={canvasRef}
                className={canRollDie ? "block size-full cursor-pointer" : "block size-full"}
                aria-hidden
            />
        </div>
    );
};

export default RollADiceWebGLGrid;
