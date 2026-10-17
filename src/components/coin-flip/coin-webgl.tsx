import { useEffect, useRef, useState } from "react";
import {
    OrthographicCamera,
    Scene,
    SRGBColorSpace,
    WebGLRenderer,
} from "three";

import type { FlipCoinMetal } from "@/lib/coin-flip/flip-a-coin-assets";
import {
    flipCoinMeshVisualKey,
    flipCoinSideLabelsForStyle,
    type FlipCoinFaceStyle,
    type FlipCoinSideLabels,
} from "@/lib/coin-flip/flip-coin-face-style";
import { localizeFlipCoinSideLabels } from "@/lib/coin-flip/localize-coin-face-labels";
import { useMessages } from "@/lib/i18n/use-messages";
import {
    getFlipCoinCellCenter,
    getFlipCoinIndexAtPoint,
    type FlipCoinGridLayout,
} from "@/lib/coin-flip/flip-a-coin-stage-layout";
import type {
    FlipCoinAnimationPlan,
    FlipCoinWebGLRequest,
} from "@/lib/coin-flip/plan-coin-flip";
import {
    applyCoinMeshSpin,
    createCoinMesh,
    type CoinMeshBundle,
    type CoinMeshFaceSource,
} from "@/lib/coin-flip/webgl/create-coin-mesh";
import type { FlipCoinClickFlipMode, FlipCoinSlot } from "@/types/coin-flip";

type FlipACoinWebGLProps = {
    coinSlots: readonly FlipCoinSlot[];
    faceStyle: FlipCoinFaceStyle;
    layout: FlipCoinGridLayout;
    flipRequest: FlipCoinWebGLRequest | null;
    onFlipComplete: (requestId: number) => void;
    onFlipAll: () => void;
    onFlipCoin: (coinId: string) => void;
    clickFlipMode: FlipCoinClickFlipMode;
    flipDisabled?: boolean;
};

type WebGLHost = {
    scene: Scene;
    camera: OrthographicCamera;
    renderer: WebGLRenderer;
};

const meshSourceForSlot = (
    metal: FlipCoinMetal,
    style: FlipCoinFaceStyle,
    labels: FlipCoinSideLabels,
): CoinMeshFaceSource => {
    if (style.mode === "classic") {
        return { kind: "metal", metal };
    }
    return {
        kind: "labeled",
        headsColor: style.headsColor,
        tailsColor: style.tailsColor,
        headsLabel: labels.heads,
        tailsLabel: labels.tails,
    };
};

type CoinRuntime = {
    bundle: CoinMeshBundle;
    visualKey: string;
    spinRx: number;
    spinRy: number;
    targetRx: number;
    targetRy: number;
    spinFromRx: number;
    spinFromRy: number;
    spinStartMs: number;
    spinDurationMs: number;
    pendingRequestId: number | null;
    appliedFlipRequestId: number | null;
};

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

const applyCoinLayout = (
    bundle: CoinMeshBundle,
    index: number,
    layout: FlipCoinGridLayout,
    coinCount: number,
): void => {
    const { x, y } = getFlipCoinCellCenter(index, layout, coinCount);
    bundle.root.position.set(x, y, 0);
    bundle.root.scale.setScalar(layout.scale);
};

const syncCamera = (host: WebGLHost, layout: FlipCoinGridLayout): void => {
    const { gridWidthPx, gridHeightPx } = layout;
    host.camera.left = -gridWidthPx / 2;
    host.camera.right = gridWidthPx / 2;
    host.camera.top = gridHeightPx / 2;
    host.camera.bottom = -gridHeightPx / 2;
    host.camera.position.set(gridWidthPx / 2, gridHeightPx / 2, 1200);
    host.camera.lookAt(gridWidthPx / 2, gridHeightPx / 2, 0);
    host.camera.updateProjectionMatrix();
    host.renderer.setSize(gridWidthPx, gridHeightPx, false);
};

const applySpin = (runtime: CoinRuntime, now: number): void => {
    const t = Math.min(
        1,
        (now - runtime.spinStartMs) / Math.max(1, runtime.spinDurationMs),
    );
    const eased = easeOutCubic(t);
    runtime.spinRx =
        runtime.spinFromRx + (runtime.targetRx - runtime.spinFromRx) * eased;
    runtime.spinRy =
        runtime.spinFromRy + (runtime.targetRy - runtime.spinFromRy) * eased;
    applyCoinMeshSpin(runtime.bundle, runtime.spinRx, runtime.spinRy);
};

const isSpinning = (runtime: CoinRuntime, now: number): boolean =>
    (now - runtime.spinStartMs) / Math.max(1, runtime.spinDurationMs) < 1;

const startFlipOnRuntime = (
    runtime: CoinRuntime,
    requestId: number,
    plan: FlipCoinAnimationPlan,
    reduceMotion: boolean,
): void => {
    if (runtime.appliedFlipRequestId === requestId) {
        return;
    }

    const now = performance.now();
    const durationMs = reduceMotion
        ? 1
        : Math.max(1, Math.round(plan.durationSeconds * 1000));

    runtime.spinFromRx = runtime.spinRx;
    runtime.spinFromRy = runtime.spinRy;
    runtime.targetRx = runtime.spinRx + plan.spinTurns * 360;

    const normalizedY = ((runtime.spinRy % 360) + 360) % 360;
    let deltaY = plan.finalRotateY - normalizedY;
    if (deltaY < -180) deltaY += 360;
    if (deltaY > 180) deltaY -= 360;
    runtime.targetRy = runtime.spinRy + deltaY;
    runtime.spinStartMs = now;
    runtime.spinDurationMs = durationMs;
    runtime.pendingRequestId = requestId;
    runtime.appliedFlipRequestId = requestId;
};

const resetCoinToNeutral = (runtime: CoinRuntime, now: number): void => {
    runtime.spinRx = 0;
    runtime.spinRy = 0;
    runtime.targetRx = 0;
    runtime.targetRy = 0;
    runtime.spinFromRx = 0;
    runtime.spinFromRy = 0;
    runtime.spinStartMs = now;
    runtime.spinDurationMs = 1;
    runtime.pendingRequestId = null;
    runtime.appliedFlipRequestId = null;
    applySpin(runtime, now);
};

const applyFlipRequest = (
    request: FlipCoinWebGLRequest,
    coinRef: Map<string, CoinRuntime>,
    options?: { resetOthersToNeutral?: boolean },
): boolean => {
    const planIds = new Set(request.plans.map((plan) => plan.coinId));
    const now = performance.now();
    let anyStarted = false;

    if (options?.resetOthersToNeutral) {
        for (const [coinId, runtime] of coinRef.entries()) {
            if (!planIds.has(coinId)) {
                resetCoinToNeutral(runtime, now);
            }
        }
    }

    for (const { coinId, plan } of request.plans) {
        const runtime = coinRef.get(coinId);
        if (runtime == null) {
            continue;
        }
        if (runtime.appliedFlipRequestId === request.id) {
            anyStarted = true;
            continue;
        }
        startFlipOnRuntime(
            runtime,
            request.id,
            plan,
            request.reduceMotion,
        );
        anyStarted = true;
    }
    return anyStarted;
};

const checkRequestComplete = (
    requestId: number,
    coinRef: Map<string, CoinRuntime>,
    plans: FlipCoinWebGLRequest["plans"],
    onComplete: (id: number) => void,
): void => {
    if (plans.length === 0) {
        return;
    }

    for (const { coinId } of plans) {
        const runtime = coinRef.get(coinId);
        if (runtime == null) {
            return;
        }
        if (runtime.appliedFlipRequestId !== requestId) {
            return;
        }
        if (runtime.pendingRequestId === requestId) {
            return;
        }
    }

    onComplete(requestId);
};

/** WebGL canvas for one or more coins - Three.js is imported only in this chunk. */
const FlipACoinWebGL = ({
    coinSlots,
    faceStyle,
    layout,
    flipRequest,
    onFlipComplete,
    onFlipAll,
    onFlipCoin,
    clickFlipMode,
    flipDisabled = false,
}: FlipACoinWebGLProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hostRef = useRef<WebGLHost | null>(null);
    const coinRef = useRef<Map<string, CoinRuntime>>(new Map());
    const rafRef = useRef(0);
    const scheduleRenderRef = useRef<() => void>(() => {});
    const coinSlotsRef = useRef(coinSlots);
    const faceStyleRef = useRef(faceStyle);
    const layoutRef = useRef(layout);
    const flipRequestRef = useRef(flipRequest);
    const onFlipCompleteRef = useRef(onFlipComplete);
    const onFlipAllRef = useRef(onFlipAll);
    const onFlipCoinRef = useRef(onFlipCoin);
    const clickFlipModeRef = useRef(clickFlipMode);
    const flipDisabledRef = useRef(flipDisabled);
    const lastCompletedRequestIdRef = useRef(0);
    const coinUi = useMessages().ui.coin;
    const faceLabels = localizeFlipCoinSideLabels(
        flipCoinSideLabelsForStyle(faceStyle),
        coinUi,
    );
    const labelKey = `${faceLabels.heads}|${faceLabels.tails}`;
    const labelKeyRef = useRef(labelKey);
    labelKeyRef.current = labelKey;
    const [glEpoch, setGlEpoch] = useState(0);
    const completeFlipRequestRef = useRef<(requestId: number) => void>(() => {});

    completeFlipRequestRef.current = (requestId: number): void => {
        if (lastCompletedRequestIdRef.current === requestId) {
            return;
        }
        lastCompletedRequestIdRef.current = requestId;
        onFlipCompleteRef.current(requestId);
    };

    coinSlotsRef.current = coinSlots;
    layoutRef.current = layout;
    flipRequestRef.current = flipRequest;
    onFlipCompleteRef.current = onFlipComplete;
    onFlipAllRef.current = onFlipAll;
    onFlipCoinRef.current = onFlipCoin;
    clickFlipModeRef.current = clickFlipMode;
    faceStyleRef.current = faceStyle;
    flipDisabledRef.current = flipDisabled;

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
        syncCamera(hostRef.current, layoutRef.current);
        setGlEpoch((epoch) => epoch + 1);

        const tick = (now: number): void => {
            let animating = false;
            const currentRequest = flipRequestRef.current;

            for (const runtime of coinRef.current.values()) {
                applySpin(runtime, now);
                if (isSpinning(runtime, now)) {
                    animating = true;
                } else if (runtime.pendingRequestId != null) {
                    const doneId = runtime.pendingRequestId;
                    runtime.pendingRequestId = null;
                    if (currentRequest != null) {
                        checkRequestComplete(
                            doneId,
                            coinRef.current,
                            currentRequest.plans,
                            (requestId) => {
                                completeFlipRequestRef.current(requestId);
                            },
                        );
                    }
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

        const handleVisibilityChange = (): void => {
            if (document.visibilityState === "visible") {
                scheduleRender();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const coinsMap = coinRef.current;

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            window.cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
            scheduleRenderRef.current = () => {};
            for (const runtime of coinsMap.values()) {
                scene.remove(runtime.bundle.root);
                runtime.bundle.dispose();
            }
            coinsMap.clear();
            renderer.dispose();
            hostRef.current = null;
        };
    }, []);

    useEffect(() => {
        const host = hostRef.current;
        if (host == null) {
            return;
        }

        syncCamera(host, layout);

        coinSlotsRef.current.forEach((slot, index) => {
            const runtime = coinRef.current.get(slot.id);
            if (runtime != null) {
                applyCoinLayout(
                    runtime.bundle,
                    index,
                    layout,
                    coinSlotsRef.current.length,
                );
            }
        });

        scheduleRenderRef.current();
    }, [layout]);

    useEffect(() => {
        const host = hostRef.current;
        if (host == null) {
            return undefined;
        }

        const nextIds = new Set(coinSlots.map((slot) => slot.id));

        for (const [id, runtime] of coinRef.current.entries()) {
            if (!nextIds.has(id)) {
                host.scene.remove(runtime.bundle.root);
                runtime.bundle.dispose();
                coinRef.current.delete(id);
            }
        }

        let cancelled = false;

        coinSlots.forEach((slot, index) => {
            const existing = coinRef.current.get(slot.id);

            if (existing != null) {
                applyCoinLayout(
                    existing.bundle,
                    index,
                    layoutRef.current,
                    coinSlots.length,
                );
                const visualKey = `${flipCoinMeshVisualKey(slot.metal, faceStyle)}:${labelKey}`;
                if (existing.visualKey !== visualKey) {
                    host.scene.remove(existing.bundle.root);
                    existing.bundle.dispose();
                    coinRef.current.delete(slot.id);
                } else {
                    return;
                }
            }

            const visualKey = `${flipCoinMeshVisualKey(slot.metal, faceStyle)}:${labelKey}`;
            void createCoinMesh(meshSourceForSlot(slot.metal, faceStyle, faceLabels)).then((bundle) => {
                if (cancelled || hostRef.current == null) {
                    bundle.dispose();
                    return;
                }

                const stillCurrent = coinSlotsRef.current.some(
                    (item) =>
                        item.id === slot.id &&
                        `${flipCoinMeshVisualKey(item.metal, faceStyleRef.current)}:${labelKeyRef.current}` ===
                            visualKey,
                );
                if (!stillCurrent) {
                    bundle.dispose();
                    return;
                }

                if (coinRef.current.has(slot.id)) {
                    bundle.dispose();
                    return;
                }

                const slotIndex = coinSlotsRef.current.findIndex(
                    (item) => item.id === slot.id,
                );
                applyCoinLayout(
                    bundle,
                    slotIndex >= 0 ? slotIndex : index,
                    layoutRef.current,
                    coinSlotsRef.current.length,
                );
                host.scene.add(bundle.root);

                const runtime: CoinRuntime = {
                    bundle,
                    visualKey,
                    spinRx: 0,
                    spinRy: 0,
                    targetRx: 0,
                    targetRy: 0,
                    spinFromRx: 0,
                    spinFromRy: 0,
                    spinStartMs: performance.now(),
                    spinDurationMs: 1,
                    pendingRequestId: null,
                    appliedFlipRequestId: null,
                };
                coinRef.current.set(slot.id, runtime);
                applySpin(runtime, performance.now());

                const pendingRequest = flipRequestRef.current;
                if (pendingRequest != null) {
                    const resetOthers =
                        clickFlipModeRef.current === "one" &&
                        pendingRequest.plans.length === 1;
                    if (
                        applyFlipRequest(pendingRequest, coinRef.current, {
                            resetOthersToNeutral: resetOthers,
                        })
                    ) {
                        scheduleRenderRef.current();
                    }
                }

                scheduleRenderRef.current();
            });
        });

        scheduleRenderRef.current();

        return () => {
            cancelled = true;
        };
    }, [coinSlots, faceStyle, glEpoch, labelKey]);

    useEffect(() => {
        if (flipRequest != null) {
            return;
        }

        const now = performance.now();
        let didReset = false;
        for (const runtime of coinRef.current.values()) {
            if (runtime.pendingRequestId != null) {
                continue;
            }
            resetCoinToNeutral(runtime, now);
            didReset = true;
        }

        if (didReset) {
            scheduleRenderRef.current();
        }
    }, [flipRequest]);

    useEffect(() => {
        if (flipRequest == null) {
            return;
        }

        const resetOthers =
            clickFlipModeRef.current === "one" &&
            flipRequest.plans.length === 1;

        if (
            applyFlipRequest(flipRequest, coinRef.current, {
                resetOthersToNeutral: resetOthers,
            })
        ) {
            scheduleRenderRef.current();
        }
    }, [flipRequest]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas == null) {
            return undefined;
        }

        const handlePointerUp = (event: PointerEvent) => {
            if (flipDisabledRef.current) {
                return;
            }

            const canvasEl = canvasRef.current;
            const currentLayout = layoutRef.current;
            const slots = coinSlotsRef.current;
            if (canvasEl == null || currentLayout == null) {
                return;
            }

            if (clickFlipModeRef.current === "all" || slots.length <= 1) {
                onFlipAllRef.current();
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
            const index = getFlipCoinIndexAtPoint(
                currentLayout,
                slots.length,
                x,
                y,
            );
            const slot = index != null ? slots[index] : undefined;
            if (slot != null) {
                onFlipCoinRef.current(slot.id);
            }
        };

        canvas.addEventListener("pointerup", handlePointerUp);
        return () => {
            canvas.removeEventListener("pointerup", handlePointerUp);
        };
    }, []);

    const canFlip = !flipDisabled;

    return (
        <div
            className="mx-auto w-full"
            style={{
                maxWidth: layout.gridWidthPx,
                aspectRatio: `${layout.gridWidthPx} / ${layout.gridHeightPx}`,
            }}
            aria-label={`${coinSlots.length} coin${coinSlots.length === 1 ? "" : "s"} on the table`}
        >
            <canvas
                ref={canvasRef}
                className={
                    canFlip
                        ? "block size-full cursor-pointer"
                        : "block size-full"
                }
                aria-hidden
            />
        </div>
    );
};

export default FlipACoinWebGL;
