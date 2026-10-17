import type { CSSProperties } from "react";

/** Engine bitmap snap - ceil keeps canvas >= displayed CSS. */
export const WHEEL_LAYOUT_SIZE_SNAP_PX = 64;

/** Debounce ResizeObserver-driven layout sync. */
export const WHEEL_LAYOUT_RESIZE_DEBOUNCE_MS = 300;

export const snapWheelEngineSideCeil = (
  measuredSide: number,
  snapPx: number = WHEEL_LAYOUT_SIZE_SNAP_PX,
): number => {
  if (measuredSide < 2) return measuredSide;
  return Math.ceil(measuredSide / snapPx) * snapPx;
};

export const measureWheelLayoutSide = (
  canvas: HTMLElement,
  wrap: HTMLElement,
): number => {
  const canvasRect = canvas.getBoundingClientRect();
  let side = Math.floor(Math.min(canvasRect.width, canvasRect.height));
  if (side < 2) {
    const wrapRect = wrap.getBoundingClientRect();
    side = Math.floor(Math.min(wrapRect.width, wrapRect.height));
  }
  return side;
};

/**
 * Full-width frame around the square stage. Overlay controls (gear) sit here,
 * not inside the aspect-square shell.
 */
export const WHEEL_STAGE_FRAME_CLASS = "relative w-full min-w-0";

export const WHEEL_STAGE_FRAME_IMMERSIVE_CLASS =
  "relative flex min-h-0 w-full flex-1";

/**
 * Phone/sidepanel shell: width-led square, capped by svh so one screen holds
 * the wheel (same formula as the site ≤950px stage).
 */
export const WHEEL_STAGE_SHELL_CLASS =
  "relative mx-auto flex aspect-square h-auto w-full min-h-0 min-w-0 max-w-[min(100%,70svh)] self-center p-3 [container-type:size] landscape:max-w-[min(100%,85svh)]";

export const WHEEL_STAGE_SHELL_IMMERSIVE_CLASS =
  "relative mx-auto flex aspect-square h-full w-full min-h-0 min-w-0 max-h-full max-w-full self-center p-3 [container-type:size]";

export const WHEEL_STAGE_SQUARE_BOX_CLASS =
  "relative m-auto aspect-square size-full max-h-full max-w-full min-h-0 min-w-0";

export const WHEEL_STAGE_SQUARE_BOX_STYLE: CSSProperties = {
  width: "min(100cqw, 100cqh)",
  height: "min(100cqw, 100cqh)",
};
