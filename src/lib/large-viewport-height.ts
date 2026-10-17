let cachedHeightPx: number | null = null;
let cachedViewportKey: string | null = null;

const viewportCacheKey = (): string => {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.innerWidth}x${window.innerHeight}`;
};

/** Read `100lvh` via a CSS probe (not `window.innerHeight`). */
export const measureLargeViewportHeightPx = (): number => {
  if (typeof document === "undefined") {
    return 0;
  }

  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none;";
  document.documentElement.appendChild(probe);
  const heightPx = probe.getBoundingClientRect().height;
  probe.remove();

  return heightPx;
};

/**
 * `100lvh` in px. Re-reads when the window inner size changes.
 * Same-size ResizeObserver passes reuse the last probe (no debounce).
 */
export const getLargeViewportHeightPx = (): number => {
  const key = viewportCacheKey();
  if (cachedHeightPx == null || cachedViewportKey !== key) {
    cachedHeightPx = measureLargeViewportHeightPx();
    cachedViewportKey = key;
  }
  return cachedHeightPx;
};

export const resetLargeViewportHeightCache = (): void => {
  cachedHeightPx = null;
  cachedViewportKey = null;
};
