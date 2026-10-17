import { FLIP_COIN_PANEL_MAX_HEIGHT_RATIO } from "@/lib/coin-flip/flip-a-coin-stage-layout";
import {
  getLargeViewportHeightPx,
  measureLargeViewportHeightPx,
  resetLargeViewportHeightCache,
} from "@/lib/large-viewport-height";

/** Tailwind cap class - `lvh` = large viewport (stable when mobile browser chrome shows/hides). */
export const FLIP_COIN_PANEL_MAX_HEIGHT_CLASS = "max-h-[95lvh]";

export { measureLargeViewportHeightPx };

/** Panel cap in px: `95lvh` equivalent for grid layout math. */
export const getFlipCoinPanelViewportCapPx = (): number =>
  Math.floor(getLargeViewportHeightPx() * FLIP_COIN_PANEL_MAX_HEIGHT_RATIO);

/**
 * Height budget for the 3D grid. Zoom uses remaining panel height.
 * Normal view uses live 95lvh minus chrome (same as CSS max-h-[95lvh]).
 */
export const getFlipCoinTableHeightBudgetPx = ({
  chromeHeight,
  panelHeight,
  immersive,
}: {
  chromeHeight: number;
  panelHeight: number;
  immersive: boolean;
}): number => {
  const viewportCap = getFlipCoinPanelViewportCapPx();
  const viewportBudget = Math.max(0, viewportCap - chromeHeight);
  const panelBudget =
    panelHeight > 0
      ? Math.max(0, panelHeight - chromeHeight)
      : viewportBudget;

  return immersive ? panelBudget : viewportBudget;
};

export const resetFlipCoinViewportCapCache = (): void => {
  resetLargeViewportHeightCache();
};
