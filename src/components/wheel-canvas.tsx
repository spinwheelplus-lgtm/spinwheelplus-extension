import { useEffect, useRef, useState } from "react";

import { DEFAULT_RIM_DOT_COLOR } from "@/lib/constants";
import { bakeWheelCanvas } from "@/lib/wheel-draw";
import {
  measureWheelLayoutSide,
  snapWheelEngineSideCeil,
  WHEEL_LAYOUT_RESIZE_DEBOUNCE_MS,
} from "@/lib/wheel-layout";
import { layoutSlices } from "@/lib/wheel-slices";
import { cn } from "@/lib/cn";
import type { SliceImageFit, WheelItem } from "@/lib/types";

export { layoutSlices };

type WheelCanvasProps = {
  items: WheelItem[];
  themeColors: string[];
  rotation: number;
  rimEnabled?: boolean;
  rimBorderColors?: string[];
  rimDotColor?: readonly string[];
  hideItemNames?: boolean;
  revealSliceIndex?: number | null;
  showDivider?: boolean;
  wheelShadow?: boolean;
  imageFit?: SliceImageFit;
  highlightSliceIndex?: number | null;
  onSpin?: () => void;
  spinning?: boolean;
  canStop?: boolean;
  className?: string;
};

const imageCache = new Map<string, HTMLImageElement>();

const getCachedImage = (
  src: string,
  onReady: () => void,
): HTMLImageElement | null => {
  const cached = imageCache.get(src);
  if (cached?.complete && cached.naturalWidth > 0) return cached;
  if (cached) return null;
  const image = new Image();
  image.onload = onReady;
  image.src = src;
  imageCache.set(src, image);
  return null;
};

const visualCacheKey = (
  items: WheelItem[],
  themeColors: string[],
  rimEnabled: boolean,
  rimBorderColors: string[],
  rimDotColor: readonly string[],
  hideItemNames: boolean,
  revealSliceIndex: number | null,
  showDivider: boolean,
  wheelShadow: boolean,
  imageFit: SliceImageFit,
  cssSize: number,
  pixelRatio: number,
  imageTick: number,
): string =>
  JSON.stringify({
    items: items.map((item) => [
      item.id,
      item.label,
      item.weight,
      item.bgColor ?? "",
      item.imageDataUrl ?? "",
      item.inactive === true,
    ]),
    themeColors,
    rimEnabled,
    rimBorderColors,
    rimDotColor,
    hideItemNames,
    revealSliceIndex,
    showDivider,
    wheelShadow,
    imageFit,
    cssSize,
    pixelRatio,
    imageTick,
  });

export const WheelCanvas = ({
  items,
  themeColors,
  rotation,
  rimEnabled = true,
  rimBorderColors = [],
  rimDotColor = [DEFAULT_RIM_DOT_COLOR],
  hideItemNames = false,
  revealSliceIndex = null,
  showDivider = false,
  wheelShadow = false,
  imageFit = "box",
  highlightSliceIndex = null,
  onSpin,
  spinning = false,
  canStop = false,
  className,
}: WheelCanvasProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<HTMLCanvasElement | null>(null);
  const cacheKeyRef = useRef("");
  const [cssSize, setCssSize] = useState(0);
  const [pixelRatio, setPixelRatio] = useState(1);
  const [imageTick, setImageTick] = useState(0);
  const [blinkOn, setBlinkOn] = useState(true);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const applySize = (): void => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const measured = measureWheelLayoutSide(canvas, wrap);
      if (measured < 2) return;
      const side = snapWheelEngineSideCeil(measured);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      setCssSize((prev) => (prev === side ? prev : side));
      setPixelRatio((prev) => (prev === dpr ? prev : dpr));
    };

    applySize();
    let debounceId: ReturnType<typeof setTimeout> | null = null;
    const schedule = (): void => {
      if (debounceId != null) clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        debounceId = null;
        applySize();
      }, WHEEL_LAYOUT_RESIZE_DEBOUNCE_MS);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(wrap);
    const canvas = canvasRef.current;
    if (canvas) observer.observe(canvas);
    window.addEventListener("orientationchange", applySize);
    return () => {
      if (debounceId != null) clearTimeout(debounceId);
      observer.disconnect();
      window.removeEventListener("orientationchange", applySize);
    };
  }, []);

  useEffect(() => {
    if (highlightSliceIndex == null) {
      setBlinkOn(true);
      return;
    }
    let frame = 0;
    const loop = (now: number) => {
      const on = now % 700 < 350;
      setBlinkOn((prev) => (prev === on ? prev : on));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [highlightSliceIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cssSize < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bump = () => setImageTick((n) => n + 1);
    const key = visualCacheKey(
      items,
      themeColors,
      rimEnabled,
      rimBorderColors,
      rimDotColor,
      hideItemNames,
      revealSliceIndex,
      showDivider,
      wheelShadow,
      imageFit,
      cssSize,
      pixelRatio,
      imageTick,
    );
    if (cacheKeyRef.current !== key) {
      cacheRef.current = bakeWheelCanvas({
        items,
        themeColors,
        rimEnabled,
        rimBorderColors,
        rimDotColor,
        hideItemNames,
        revealSliceIndex,
        showDivider,
        wheelShadow,
        imageFit,
        cssSize,
        pixelRatio,
        getImage: (src) => getCachedImage(src, bump),
      });
      cacheKeyRef.current = key;
    }

    const baked = cacheRef.current;
    const pixelW = Math.round(cssSize * pixelRatio);
    if (canvas.width !== pixelW) {
      canvas.width = pixelW;
      canvas.height = pixelW;
    }
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, cssSize, cssSize);
    if (!baked) return;

    const cx = cssSize / 2;
    const cy = cssSize / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);
    ctx.drawImage(baked, 0, 0, baked.width, baked.height, 0, 0, cssSize, cssSize);

    const slices = layoutSlices(items, themeColors);
    const highlightSlice =
      highlightSliceIndex != null ? slices[highlightSliceIndex] : undefined;
    if (highlightSlice) {
      const glowRadius = cssSize / 2 - 8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(
        cx,
        cy,
        glowRadius,
        highlightSlice.start,
        highlightSlice.start + highlightSlice.span,
      );
      ctx.closePath();
      ctx.fillStyle = blinkOn
        ? "rgba(255,255,255,0.42)"
        : "rgba(255,255,255,0.12)";
      ctx.fill();
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(4, cssSize * 0.012);
      ctx.strokeStyle = blinkOn ? "#ffffff" : "rgba(255,255,255,0.45)";
      ctx.stroke();
    }
    ctx.restore();
  }, [
    items,
    themeColors,
    rotation,
    imageTick,
    rimEnabled,
    rimBorderColors,
    rimDotColor,
    hideItemNames,
    revealSliceIndex,
    showDivider,
    wheelShadow,
    imageFit,
    highlightSliceIndex,
    blinkOn,
    cssSize,
    pixelRatio,
  ]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas
        ref={canvasRef}
        className={cn(
          "block size-full",
          onSpin && (!spinning || canStop) && "cursor-pointer",
        )}
        aria-label={
          canStop
            ? "Stop the wheel"
            : spinning
              ? "Wheel drawing surface"
              : "Spin the wheel"
        }
        onClick={spinning && !canStop ? undefined : onSpin}
      />
    </div>
  );
};
