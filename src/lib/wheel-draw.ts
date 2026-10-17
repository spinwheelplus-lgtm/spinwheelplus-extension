import { DEFAULT_RIM_DOT_COLOR, ITEM_IMAGE_MAX_COUNT } from "@/lib/constants";
import { pickWheelTextColor } from "@/lib/item-color";
import type { SliceImageFit, WheelItem } from "@/lib/types";
import { WHEEL_BLIND_SLICE_LABEL } from "@/lib/visual-items";
import { drawSlicePhoto } from "@/lib/wheel-slice-image";
import { layoutSlices, TWO_PI, type SliceLayout } from "@/lib/wheel-slices";

const DESIGN_SIZE = 1000;
const TEXT_START = 0.28;
const TEXT_OUTER_INSET_PX = 10;
const PADDING_PX = 10;
const RIM_WHEEL_INNER_OVERLAP_PX = 1.25;
const WHEEL_OUTER_SAFE_INSET_PX = 2;
const RIM_COLOR_WIDTH = 30;
const TEXT_RADIAL_PAD_PX = 6;
const FONT_SHARED_BEYOND_ITEM_COUNT = 40;
const LABEL_DISPLAY_MAX = 20;
const LABEL_ELLIPSIS = "...";
const LABEL_PREFIX_LEN = LABEL_DISPLAY_MAX - [...LABEL_ELLIPSIS].length;
const EMPTY_WHEEL_COLOR = "#4a4a4a";
const LABEL_FONT_STACK = 'system-ui, "Segoe UI", sans-serif';

export type BakeWheelOptions = {
  items: WheelItem[];
  themeColors: string[];
  rimEnabled: boolean;
  rimBorderColors: string[];
  rimDotColor: readonly string[];
  hideItemNames: boolean;
  revealSliceIndex?: number | null;
  showDivider: boolean;
  wheelShadow: boolean;
  imageFit: SliceImageFit;
  cssSize: number;
  pixelRatio: number;
  getImage: (src: string) => HTMLImageElement | null;
};

const fontSizeMaxForItemCount = (n: number): number => {
  const c = Math.floor(n);
  if (!Number.isFinite(c) || c < 1) return 60;
  if (c <= 2) return 110;
  if (c <= 5) return 100;
  if (c <= 10) return 90;
  if (c <= 15) return 80;
  if (c <= 20) return 70;
  return 90;
};

const fitLabel = (name: string): string => {
  const chars = Array.from(name);
  if (chars.length <= LABEL_DISPLAY_MAX) return name;
  return chars.slice(0, LABEL_PREFIX_LEN).join("") + LABEL_ELLIPSIS;
};

const sliceIsRevealed = (
  hideItemNames: boolean,
  index: number,
  revealSliceIndex: number | null | undefined,
): boolean => !hideItemNames || index === revealSliceIndex;

const displaySliceLabel = (label: string, revealed: boolean): string =>
  revealed ? fitLabel(label) : WHEEL_BLIND_SLICE_LABEL;

const labelFont = (px: number): string => `400 ${px}px ${LABEL_FONT_STACK}`;

const wedgeRadialLabelFits = (
  halfSweep: number,
  outerRadius: number,
  innerRadius: number,
  textWidth: number,
  fontHeight: number,
): boolean => {
  if (!(outerRadius > 0) || textWidth < 0 || fontHeight < 0) return false;
  if (textWidth === 0 && fontHeight === 0) return true;
  const halfH = fontHeight / 2;
  if (halfH >= outerRadius) return false;
  const outerAlong = Math.sqrt(outerRadius * outerRadius - halfH * halfH);
  const sinHalf = Math.sin(halfSweep);
  if (!(sinHalf > 0)) return false;
  const radiusWhereHeightFits =
    (fontHeight * Math.cos(halfSweep)) / (2 * sinHalf);
  const innerAlong = Math.max(radiusWhereHeightFits, innerRadius);
  return outerAlong - innerAlong >= textWidth;
};

const wheelLabelFitHeight = (inkHeight: number): number => inkHeight / 0.88;

const wheelLabelOpticalCenterY = (ascent: number, descent: number): number => {
  if (!Number.isFinite(ascent) || !Number.isFinite(descent)) return 0;
  return (ascent - descent) / 2;
};

const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[\da-fA-F]{6}$/.test(h)) return [128, 128, 128];
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
};

const lerpHex = (hexA: string, hexB: string, t: number): string => {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
};

const colorToTransparent = (color: string): string => {
  const rgb = hexToRgb(color);
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.1)`;
};

const makeRimConicGradient = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  colors: string[],
): string | CanvasGradient => {
  if (typeof ctx.createConicGradient !== "function") {
    return colors[0] ?? "#ccc";
  }
  const gradient = ctx.createConicGradient(0, cx, cy);
  if (colors.length === 0) return "#ccc";
  if (colors.length === 1) {
    const only = colors[0] ?? "#ccc";
    gradient.addColorStop(0, only);
    gradient.addColorStop(1, only);
    return gradient;
  }
  const n = colors.length;
  const stepsPerSegment = 16;
  for (let i = 0; i < n; i += 1) {
    const current = colors[i] ?? "#ccc";
    const next = colors[(i + 1) % n] ?? current;
    for (let k = 0; k <= stepsPerSegment; k += 1) {
      const localT = k / stepsPerSegment;
      gradient.addColorStop((i + localT) / n, lerpHex(current, next, localT));
    }
  }
  return gradient;
};

const applyCanvasHints = (ctx: CanvasRenderingContext2D): void => {
  const extra = ctx as CanvasRenderingContext2D & {
    textRendering?: string;
    fontKerning?: string;
    imageSmoothingQuality?: string;
  };
  extra.imageSmoothingEnabled = true;
  extra.imageSmoothingQuality = "high";
  extra.textRendering = "optimizeLegibility";
  extra.fontKerning = "normal";
};

const fontSizeForSegment = (
  ctx: CanvasRenderingContext2D,
  label: string,
  startX: number,
  outerTextX: number,
  sweep: number,
  scale: number,
  itemCount: number,
): number => {
  const pad = TEXT_RADIAL_PAD_PX * scale;
  const lo = 9 * scale;
  const hi = fontSizeMaxForItemCount(itemCount) * scale;
  if (!(outerTextX > startX) || !label.length) return lo;
  const halfSweep = Math.min(sweep / 2, Math.PI / 2 - 0.02);
  if (!(halfSweep > 0)) return lo;

  const fits = (px: number): boolean => {
    ctx.font = labelFont(px);
    ctx.textBaseline = "middle";
    const m = ctx.measureText(label);
    const a = m.actualBoundingBoxAscent;
    const d = m.actualBoundingBoxDescent;
    const h =
      Number.isFinite(a) && Number.isFinite(d) && (a > 0 || d > 0)
        ? a + d
        : px * 1.15;
    return wedgeRadialLabelFits(
      halfSweep,
      outerTextX,
      startX,
      m.width + pad,
      wheelLabelFitHeight(h),
    );
  };

  if (!fits(lo)) return lo;
  if (fits(hi)) return hi;
  let low = lo;
  let high = hi;
  for (let k = 0; k < 16; k += 1) {
    const mid = (low + high) / 2;
    if (fits(mid)) low = mid;
    else high = mid;
  }
  return low;
};

const drawInnerShadow = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
): void => {
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0.9, "rgba(0,0,0,0)");
  gradient.addColorStop(0.95, "rgba(0,0,0,0.2)");
  gradient.addColorStop(0.99, "rgba(0,0,0,0.3)");
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TWO_PI);
  ctx.fill();
  ctx.restore();
};

const drawRimDot = (
  ctx: CanvasRenderingContext2D,
  origin: number,
  distance: number,
  angleMid: number,
  rimWidth: number,
  dotColor: string,
): void => {
  const x = origin + Math.cos(angleMid) * distance;
  const y = origin + Math.sin(angleMid) * distance;
  const r = rimWidth * 0.5;
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, dotColor);
  gradient.addColorStop(0.3, dotColor);
  gradient.addColorStop(1, colorToTransparent(dotColor));
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TWO_PI);
  ctx.fill();
  ctx.restore();
};

const applyRim = (
  base: HTMLCanvasElement,
  size: number,
  wheelRadius: number,
  scale: number,
  pixelRatio: number,
  colors: string[],
  slices: SliceLayout[],
  dotColors: readonly string[],
): HTMLCanvasElement => {
  const half = size / 2;
  const rimWidth = RIM_COLOR_WIDTH * scale;
  const overlap = RIM_WHEEL_INNER_OVERLAP_PX * scale;
  const shrink = (half - rimWidth + overlap) / wheelRadius;
  const rimCanvas = document.createElement("canvas");
  rimCanvas.width = Math.round(size * pixelRatio);
  rimCanvas.height = Math.round(size * pixelRatio);
  const rctx = rimCanvas.getContext("2d");
  if (!rctx || !(shrink > 0)) return base;
  rctx.scale(pixelRatio, pixelRatio);
  applyCanvasHints(rctx);

  rctx.save();
  rctx.translate(half, half);
  rctx.scale(shrink, shrink);
  rctx.translate(-half, -half);
  rctx.drawImage(base, 0, 0, base.width, base.height, 0, 0, size, size);
  rctx.restore();

  const radius = half;
  const rimStrokeRadius = radius - rimWidth / 2;
  rctx.save();
  rctx.beginPath();
  rctx.arc(radius, radius, rimStrokeRadius, 0, TWO_PI);
  rctx.lineWidth = rimWidth;
  rctx.strokeStyle = makeRimConicGradient(rctx, radius, radius, colors);
  rctx.stroke();
  rctx.restore();

  const dotDistance = radius - rimWidth / 2;
  const palette =
    dotColors.length > 0 ? dotColors : [DEFAULT_RIM_DOT_COLOR];
  for (let index = 0; index < slices.length; index += 1) {
    const slice = slices[index];
    if (!slice) continue;
    drawRimDot(
      rctx,
      radius,
      dotDistance,
      slice.start + slice.span / 2,
      rimWidth,
      palette[index % palette.length] ?? DEFAULT_RIM_DOT_COLOR,
    );
  }
  return rimCanvas;
};

export const bakeWheelCanvas = (
  options: BakeWheelOptions,
): HTMLCanvasElement | null => {
  const {
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
    getImage,
  } = options;
  if (cssSize < 2) return null;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cssSize * pixelRatio);
  canvas.height = Math.round(cssSize * pixelRatio);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(pixelRatio, pixelRatio);
  applyCanvasHints(ctx);

  const size = cssSize;
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / DESIGN_SIZE;
  const half = size / 2;
  const radius = rimEnabled
    ? half - PADDING_PX * scale
    : half - WHEEL_OUTER_SAFE_INSET_PX * scale;
  const slices = layoutSlices(items, themeColors);
  const startX = radius * TEXT_START;
  const outerTextX = radius * 0.97 - TEXT_OUTER_INSET_PX * scale;

  if (slices.length === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.fillStyle = EMPTY_WHEEL_COLOR;
    ctx.fill();
  } else if (slices.length === 1) {
    const only = slices[0];
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.fillStyle = only?.color ?? EMPTY_WHEEL_COLOR;
    ctx.fill();
  } else {
    for (const slice of slices) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, slice.start, slice.start + slice.span);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
    }
  }

  let sharedAutoFontSize: number | null = null;
  if (slices.length > FONT_SHARED_BEYOND_ITEM_COUNT) {
    let bestLen = -1;
    let bestLabel = "";
    let bestSweep = TWO_PI;
    slices.forEach((slice, index) => {
      const lab = displaySliceLabel(
        slice.item.label,
        sliceIsRevealed(hideItemNames, index, revealSliceIndex),
      );
      if (!lab) return;
      const len = Array.from(lab).length;
      if (len > bestLen || (len === bestLen && slice.span < bestSweep)) {
        bestLen = len;
        bestLabel = lab;
        bestSweep = slice.span;
      }
    });
    if (bestLabel) {
      sharedAutoFontSize = fontSizeForSegment(
        ctx,
        bestLabel,
        startX,
        outerTextX,
        bestSweep,
        scale,
        slices.length,
      );
    }
  }

  slices.forEach((slice, index) => {
    const sweep = slice.span;
    const mid = slice.start + sweep / 2;
    const revealed = sliceIsRevealed(hideItemNames, index, revealSliceIndex);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(mid);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, -sweep / 2, sweep / 2);
    ctx.closePath();
    ctx.clip();

    const imageSrc =
      revealed && index < ITEM_IMAGE_MAX_COUNT
        ? (slice.item.imageDataUrl ?? "")
        : "";
    let drewSliceImage = false;
    if (imageSrc) {
      const image = getImage(imageSrc);
      if (image) {
        drewSliceImage = drawSlicePhoto(
          ctx,
          image,
          radius,
          sweep,
          imageFit,
          startX,
          outerTextX,
          TEXT_RADIAL_PAD_PX * scale,
        );
      }
    }

    const label = displaySliceLabel(slice.item.label, revealed);
    if (label) {
      const fontSize =
        sharedAutoFontSize ??
        fontSizeForSegment(
          ctx,
          label,
          startX,
          outerTextX,
          sweep,
          scale,
          slices.length,
        );
      ctx.font = labelFont(fontSize);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "transparent";
      const ink = ctx.measureText(label);
      const textY = wheelLabelOpticalCenterY(
        ink.actualBoundingBoxAscent,
        ink.actualBoundingBoxDescent,
      );
      if (drewSliceImage) {
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.lineWidth = Math.max(2 * scale, fontSize * 0.18);
        ctx.strokeStyle = "rgba(0,0,0,0.75)";
        ctx.strokeText(label, outerTextX, textY);
        ctx.fillStyle = "#ffffff";
      } else {
        ctx.fillStyle = pickWheelTextColor(slice.color);
      }
      ctx.fillText(label, outerTextX, textY);
    }
    ctx.restore();
  });

  if (showDivider && slices.length > 1) {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = Math.max(0.5, 2 * scale);
    for (const slice of slices) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(slice.start) * radius,
        cy + Math.sin(slice.start) * radius,
      );
      ctx.stroke();
    }
  }

  if (wheelShadow) {
    drawInnerShadow(ctx, cx, cy, radius);
  }

  if (!rimEnabled) return canvas;
  return applyRim(
    canvas,
    size,
    radius,
    scale,
    pixelRatio,
    rimBorderColors,
    slices,
    rimDotColor,
  );
};

