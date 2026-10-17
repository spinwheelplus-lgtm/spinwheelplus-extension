import { resolveStoredCenterHubOutline } from "@/lib/center-hub-outline";
import { clampTitleFontSize } from "@/lib/constants";
import { createDefaultCustomize } from "@/lib/defaults";
import { readHexColor } from "@/lib/item-color";
import { readStoredRimDotColors } from "@/lib/rim-dot-color";
import {
  readWinnerPopupEnabled,
  readWinnerPopupTitle,
  resolveResultPopupSkin,
} from "@/lib/result-popup-skin";
import { readSpinStyle, readStyle2StopStrength } from "@/lib/spin-style";
import type { CustomizeState } from "@/lib/types";
import { resolveWinnerEffect } from "@/lib/winner-effect";
import { readWinnerPopupButtonMode } from "@/lib/winner-popup-buttons";

/** Same rules as a saved wheel. Missing fields fall back to a new wheel. */
export const readStoredCustomize = (raw: unknown): CustomizeState => {
  const defaults = createDefaultCustomize();
  if (!raw || typeof raw !== "object") return defaults;
  const savedCustom = raw as CustomizeState & {
    showRimDots?: boolean;
    confetti?: unknown;
  };
  const { confetti: savedConfetti, ...savedRest } = savedCustom;
  return {
    ...defaults,
    ...savedRest,
    rimEnabled:
      savedRest.rimEnabled ?? savedRest.showRimDots ?? defaults.rimEnabled,
    rimDotColor: readStoredRimDotColors(savedRest.rimDotColor),
    centerHubOutline: resolveStoredCenterHubOutline(
      savedRest.centerHubOutline,
      savedRest.pointerColor,
    ),
    titleFontSize: clampTitleFontSize(
      savedRest.titleFontSize ?? defaults.titleFontSize,
    ),
    titleColor: readHexColor(savedRest.titleColor, defaults.titleColor),
    titlePanelColor: readHexColor(
      savedRest.titlePanelColor,
      defaults.titlePanelColor,
    ),
    showHeader: savedRest.showHeader !== false,
    spinStyle: readSpinStyle(savedRest.spinStyle),
    style2StopStrength: readStyle2StopStrength(savedRest.style2StopStrength),
    winnerPopupButtonMode: readWinnerPopupButtonMode(
      savedRest.winnerPopupButtonMode,
    ),
    winnerPopup: readWinnerPopupEnabled(savedRest.winnerPopup),
    winnerPopupSkin: resolveResultPopupSkin(savedRest.winnerPopupSkin),
    winnerTitle: readWinnerPopupTitle(savedRest.winnerTitle),
    winnerEffect: resolveWinnerEffect(savedRest.winnerEffect, savedConfetti),
  };
};
