import type { SpinStyle } from "@/lib/spin-style";
import type { WinnerEffectId } from "@/lib/winner-effect";
import type { WinnerPopupButtonMode } from "@/lib/winner-popup-buttons";

export type { SpinStyle, WinnerEffectId, WinnerPopupButtonMode };

export type EntriesViewMode = "text" | "advanced";

export type WheelItem = {
  id: string;
  label: string;
  weight: number;
  /** IndexedDB key. Persisted. Bytes are not in chrome.storage. */
  imageId?: string;
  /** Session object URL from the blob cache. Never persist. */
  imageDataUrl?: string;
  bgColor?: string;
  inactive?: boolean;
};

export type SliceImageFit = "box" | "fill";

export type SpinHistoryEntry = {
  id: string;
  name: string;
  itemId?: string;
  timestamp: number;
};

export type CustomizeState = {
  title: string;
  showHeader: boolean;
  titleFontSize: number;
  titleColor: string;
  titlePanelColor: string;
  themeColors: string[];
  spinDurationSec: number;
  spinStyle: SpinStyle;
  style2StopStrength: number;
  soundEnabled: boolean;
  winnerEffect: WinnerEffectId;
  idleSpin: boolean;
  rimEnabled: boolean;
  rimBorderColors: string[];
  /** One or two hex colors. Two colors alternate by slice. */
  rimDotColor: string[];
  wheelShadow: boolean;
  centerColor: string;
  /** Hub ring. Missing or invalid on an older save falls back in the store. */
  centerHubOutline: string;
  pointerColor: string;
  removeDuplicateNames: boolean;
  hideItemNames: boolean;
  sliceRepeat: number;
  imageFit: SliceImageFit;
  showDivider: boolean;
  winnerHighlight: boolean;
  winnerPopup: boolean;
  winnerPopupSkin: string;
  winnerTitle: string;
  winnerPopupButtonMode: WinnerPopupButtonMode;
};

export type WheelPersistState = {
  items: WheelItem[];
  customize: CustomizeState;
  entriesViewMode: EntriesViewMode;
  spinHistory: SpinHistoryEntry[];
  showAboutFeatures: boolean;
  showAboutFaq: boolean;
};
