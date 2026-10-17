import { DEFAULT_CENTER_HUB_OUTLINE } from "@/lib/center-hub-outline";
import {
  DEFAULT_CENTER_COLOR,
  DEFAULT_NAMES,
  DEFAULT_POINTER_COLOR,
  DEFAULT_THEME_COLORS,
  DEFAULT_TITLE_COLOR,
  DEFAULT_TITLE_FONT_SIZE,
  DEFAULT_TITLE_PANEL_COLOR,
  DEFAULT_WHEEL_TITLE,
} from "@/lib/constants";
import { createItemId } from "@/lib/random";
import { pickRandomRimDotColorPair } from "@/lib/rim-dot-color";
import {
  DEFAULT_WINNER_POPUP_TITLE,
  pickRandomResultPopupSkin,
} from "@/lib/result-popup-skin";
import {
  DEFAULT_SPIN_STYLE,
  DEFAULT_STYLE2_STOP_STRENGTH,
} from "@/lib/spin-style";
import type { CustomizeState, WheelItem, WheelPersistState } from "@/lib/types";
import { DEFAULT_WINNER_EFFECT } from "@/lib/winner-effect";
import { DEFAULT_WINNER_POPUP_BUTTON_MODE } from "@/lib/winner-popup-buttons";

export const createDefaultItems = (): WheelItem[] =>
  DEFAULT_NAMES.map((name) => ({
    id: createItemId(),
    label: name,
    weight: 1,
  }));

export const createDefaultCustomize = (): CustomizeState => ({
  title: DEFAULT_WHEEL_TITLE,
  showHeader: true,
  titleFontSize: DEFAULT_TITLE_FONT_SIZE,
  titleColor: DEFAULT_TITLE_COLOR,
  titlePanelColor: DEFAULT_TITLE_PANEL_COLOR,
  themeColors: [...DEFAULT_THEME_COLORS],
  spinDurationSec: 6,
  spinStyle: DEFAULT_SPIN_STYLE,
  style2StopStrength: DEFAULT_STYLE2_STOP_STRENGTH,
  soundEnabled: true,
  winnerEffect: DEFAULT_WINNER_EFFECT,
  idleSpin: true,
  rimEnabled: true,
  rimBorderColors: [...DEFAULT_THEME_COLORS],
  rimDotColor: [...pickRandomRimDotColorPair()],
  wheelShadow: false,
  centerColor: DEFAULT_CENTER_COLOR,
  centerHubOutline: DEFAULT_CENTER_HUB_OUTLINE,
  pointerColor: DEFAULT_POINTER_COLOR,
  removeDuplicateNames: false,
  hideItemNames: false,
  sliceRepeat: 1,
  imageFit: "box",
  showDivider: false,
  winnerHighlight: true,
  winnerPopup: true,
  winnerPopupSkin: pickRandomResultPopupSkin(),
  winnerTitle: DEFAULT_WINNER_POPUP_TITLE,
  winnerPopupButtonMode: DEFAULT_WINNER_POPUP_BUTTON_MODE,
});

export const createDefaultState = (): WheelPersistState => ({
  items: createDefaultItems(),
  customize: createDefaultCustomize(),
  entriesViewMode: "text",
  spinHistory: [],
  showAboutFeatures: true,
  showAboutFaq: true,
});
