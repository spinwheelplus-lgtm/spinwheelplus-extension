import { create } from "zustand";

import {
  ITEM_IMAGE_MAX_COUNT,
  MAX_WHEEL_ITEMS,
  SPIN_DURATION_SEC_MAX,
  SPIN_DURATION_SEC_MIN,
  clampTitleFontSize,
} from "@/lib/constants";
import { createDefaultState } from "@/lib/defaults";
import { readHexColor } from "@/lib/item-color";
import { readStoredRimDotColors } from "@/lib/rim-dot-color";
import {
  normalizeWheelItem,
  readEntriesViewMode,
  readShowCopySection,
  wheelItemsAreEqual,
} from "@/lib/normalize-item";
import {
  SPIN_HISTORY_LIMIT,
  createSpinHistoryEntry,
  parseSpinHistory,
} from "@/lib/spin-history";
import {
  attachCachedItemImageUrls,
  beginItemImageGeneration,
  clearAllItemImages,
  hydrateItemImageUrls,
  itemImageEpoch,
  pruneUnusedItemImages,
  putItemImageBlob,
} from "@/lib/item-image-session";
import { createItemId } from "@/lib/random";
import { readStoredCustomize } from "@/lib/read-stored-customize";
import { loadPersistedWheel, savePersistedWheel } from "@/lib/storage";
import type { ParsedWheelFile } from "@/lib/wheel-file";
import { MAX_RIM_BORDER_COLORS, MAX_THEME_COLORS } from "@/lib/theme-library";
import type {
  CustomizeState,
  EntriesViewMode,
  SliceImageFit,
  SpinHistoryEntry,
  WheelItem,
} from "@/lib/types";
import { readSliceRepeat } from "@/lib/visual-items";
import { readSpinStyle, readStyle2StopStrength } from "@/lib/spin-style";
import { resolveResultPopupSkin } from "@/lib/result-popup-skin";
import { isActiveWinnerEffect, resolveWinnerEffect } from "@/lib/winner-effect";
import { readWinnerPopupButtonMode } from "@/lib/winner-popup-buttons";

let persistTimer: number | null = null;

type WheelStore = {
  ready: boolean;
  items: WheelItem[];
  customize: CustomizeState;
  entriesViewMode: EntriesViewMode;
  spinHistory: SpinHistoryEntry[];
  showAboutFeatures: boolean;
  showAboutFaq: boolean;
  spinning: boolean;
  rotation: number;
  winnerId: string | null;
  winnerSliceIndex: number | null;
  winnerEffectSeq: number;
  hydrate: () => Promise<void>;
  setItems: (items: WheelItem[]) => void;
  setCustomize: (patch: Partial<CustomizeState>) => void;
  setEntriesViewMode: (mode: EntriesViewMode) => void;
  appendSpinHistory: (name: string, itemId?: string) => void;
  clearSpinHistory: () => void;
  setShowAboutFeatures: (show: boolean) => void;
  setShowAboutFaq: (show: boolean) => void;
  resetNew: () => void;
  replaceImportedWheel: (file: ParsedWheelFile) => Promise<boolean>;
  setSpinning: (spinning: boolean) => void;
  setRotation: (rotation: number) => void;
  setWinnerId: (winnerId: string | null) => void;
  setWinnerSliceIndex: (index: number | null) => void;
  completeSpinResult: (
    winnerId: string | null,
    winnerSliceIndex: number | null,
  ) => void;
  removeItem: (id: string) => void;
  playWinnerEffect: () => void;
};

const persistSoon = (get: () => WheelStore): void => {
  if (persistTimer) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    const {
      items,
      customize,
      entriesViewMode,
      spinHistory,
      showAboutFeatures,
      showAboutFaq,
    } = get();
    void savePersistedWheel({
      items,
      customize,
      entriesViewMode,
      spinHistory,
      showAboutFeatures,
      showAboutFaq,
    });
  }, 280);
};

export const useWheelStore = create<WheelStore>((set, get) => ({
  ready: false,
  ...createDefaultState(),
  spinning: false,
  rotation: 0,
  winnerId: null,
  winnerSliceIndex: null,
  winnerEffectSeq: 0,
  hydrate: async () => {
    const saved = await loadPersistedWheel();
    if (saved && Array.isArray(saved.items) && saved.customize) {
      const items = await hydrateItemImageUrls(
        saved.items.slice(0, MAX_WHEEL_ITEMS).map((row) =>
          normalizeWheelItem({ ...row, imageDataUrl: undefined }),
        ),
      );
      set({
        items,
        customize: readStoredCustomize(saved.customize),
        entriesViewMode: readEntriesViewMode(saved.entriesViewMode),
        spinHistory: parseSpinHistory(saved.spinHistory),
        showAboutFeatures: readShowCopySection(
          saved.showAboutFeatures,
          (saved as { showAboutSections?: unknown }).showAboutSections,
        ),
        showAboutFaq: readShowCopySection(
          saved.showAboutFaq,
          (saved as { showAboutSections?: unknown }).showAboutSections,
        ),
        ready: true,
      });
      void pruneUnusedItemImages(items);
      return;
    }
    set({ ready: true });
  },
  setItems: (items) => {
    const next = attachCachedItemImageUrls(
      items.slice(0, MAX_WHEEL_ITEMS).map(normalizeWheelItem),
    );
    const current = get().items;
    if (wheelItemsAreEqual(current, next)) return;
    set({
      items: next,
      winnerSliceIndex: null,
    });
    persistSoon(get);
    void pruneUnusedItemImages(next);
  },
  setCustomize: (patch) => {
    const current = get().customize;
    const spinDurationSec = Math.min(
      SPIN_DURATION_SEC_MAX,
      Math.max(
        SPIN_DURATION_SEC_MIN,
        patch.spinDurationSec ?? current.spinDurationSec,
      ),
    );
    const themeColors = (patch.themeColors ?? current.themeColors)
      .map((c) => c.trim())
      .filter(Boolean)
      .slice(0, MAX_THEME_COLORS);
    const imageFit: SliceImageFit =
      patch.imageFit === "fill" || patch.imageFit === "box"
        ? patch.imageFit
        : current.imageFit;
    const rimBorderColors = (patch.rimBorderColors ?? current.rimBorderColors)
      .map((c) => c.trim())
      .filter(Boolean)
      .slice(0, MAX_RIM_BORDER_COLORS);
    set({
      customize: {
        ...current,
        ...patch,
        spinDurationSec,
        sliceRepeat: readSliceRepeat(patch.sliceRepeat ?? current.sliceRepeat),
        imageFit,
        titleFontSize: clampTitleFontSize(
          patch.titleFontSize ?? current.titleFontSize,
        ),
        titleColor: readHexColor(
          patch.titleColor ?? current.titleColor,
          current.titleColor,
        ),
        titlePanelColor: readHexColor(
          patch.titlePanelColor ?? current.titlePanelColor,
          current.titlePanelColor,
        ),
        showHeader: patch.showHeader ?? current.showHeader,
        spinStyle: readSpinStyle(patch.spinStyle ?? current.spinStyle),
        style2StopStrength: readStyle2StopStrength(
          patch.style2StopStrength ?? current.style2StopStrength,
        ),
        themeColors: themeColors.length > 0 ? themeColors : current.themeColors,
        rimBorderColors:
          rimBorderColors.length > 0 ? rimBorderColors : current.rimBorderColors,
        rimDotColor: readStoredRimDotColors(
          patch.rimDotColor ?? current.rimDotColor,
        ),
        centerHubOutline: readHexColor(
          patch.centerHubOutline ?? current.centerHubOutline,
          current.centerHubOutline,
        ),
        winnerHighlight:
          patch.winnerHighlight ?? current.winnerHighlight,
        winnerPopup: patch.winnerPopup ?? current.winnerPopup,
        winnerPopupSkin: resolveResultPopupSkin(
          patch.winnerPopupSkin ?? current.winnerPopupSkin,
        ),
        winnerTitle:
          typeof patch.winnerTitle === "string"
            ? patch.winnerTitle
            : current.winnerTitle,
        winnerPopupButtonMode: readWinnerPopupButtonMode(
          patch.winnerPopupButtonMode ?? current.winnerPopupButtonMode,
        ),
        winnerEffect: resolveWinnerEffect(
          patch.winnerEffect ?? current.winnerEffect,
        ),
      },
    });
    persistSoon(get);
  },
  setEntriesViewMode: (mode) => {
    set({ entriesViewMode: mode });
    persistSoon(get);
  },
  appendSpinHistory: (name, itemId) => {
    const entry = createSpinHistoryEntry(name, itemId);
    set({
      spinHistory: [entry, ...get().spinHistory].slice(0, SPIN_HISTORY_LIMIT),
    });
    persistSoon(get);
  },
  clearSpinHistory: () => {
    set({ spinHistory: [] });
    persistSoon(get);
  },
  setShowAboutFeatures: (show) => {
    if (get().showAboutFeatures === show) return;
    set({ showAboutFeatures: show });
    persistSoon(get);
  },
  setShowAboutFaq: (show) => {
    if (get().showAboutFaq === show) return;
    set({ showAboutFaq: show });
    persistSoon(get);
  },
  resetNew: () => {
    beginItemImageGeneration();
    const fresh = createDefaultState();
    set({
      items: fresh.items,
      customize: fresh.customize,
      spinHistory: [],
      winnerId: null,
      winnerSliceIndex: null,
      rotation: 0,
    });
    persistSoon(get);
    void clearAllItemImages();
  },
  replaceImportedWheel: async (file) => {
    const epoch = beginItemImageGeneration();
    await clearAllItemImages();
    if (itemImageEpoch() !== epoch) return false;
    const items: WheelItem[] = [];
    let images = 0;
    for (const row of file.items.slice(0, MAX_WHEEL_ITEMS)) {
      let imageId: string | undefined;
      if (row.imageBlob && images < ITEM_IMAGE_MAX_COUNT) {
        try {
          imageId = await putItemImageBlob(row.imageBlob);
          images += 1;
        } catch {
          if (itemImageEpoch() !== epoch) return false;
        }
      }
      if (itemImageEpoch() !== epoch) return false;
      items.push(
        normalizeWheelItem({
          id: createItemId(),
          label: row.label,
          weight: row.weight,
          imageId,
          bgColor: row.bgColor,
          inactive: row.inactive,
        }),
      );
    }
    if (itemImageEpoch() !== epoch) return false;
    set({
      items: attachCachedItemImageUrls(items),
      customize: readStoredCustomize(file.customize),
      spinHistory: [],
      winnerId: null,
      winnerSliceIndex: null,
      rotation: 0,
      spinning: false,
    });
    persistSoon(get);
    return true;
  },
  setSpinning: (spinning) => set({ spinning }),
  setRotation: (rotation) => set({ rotation }),
  setWinnerId: (winnerId) => set({ winnerId }),
  setWinnerSliceIndex: (index) => set({ winnerSliceIndex: index }),
  completeSpinResult: (winnerId, winnerSliceIndex) =>
    set({
      spinning: false,
      winnerId,
      winnerSliceIndex,
    }),
  removeItem: (id) => {
    const items = get().items;
    const next = attachCachedItemImageUrls(
      items.filter((item) => item.id !== id),
    );
    if (next.length === items.length) return;
    set({
      items: next,
      winnerSliceIndex: null,
    });
    persistSoon(get);
    void pruneUnusedItemImages(next);
  },
  playWinnerEffect: () => {
    const effect = resolveWinnerEffect(get().customize.winnerEffect);
    if (!isActiveWinnerEffect(effect)) return;
    set({ winnerEffectSeq: get().winnerEffectSeq + 1 });
  },
}));
