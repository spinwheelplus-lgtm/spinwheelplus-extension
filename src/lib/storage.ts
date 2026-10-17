import type { WheelItem, WheelPersistState } from "@/lib/types";

const STORAGE_KEY = "spinwheelplus.sidepanel.v2";

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

export const itemsForPersist = (items: readonly WheelItem[]): WheelItem[] =>
  items.map((item) => ({
    id: item.id,
    label: item.label,
    weight: item.weight,
    imageId: item.imageId,
    bgColor: item.bgColor,
    inactive: item.inactive,
  }));

export const loadPersistedWheel = async (): Promise<WheelPersistState | null> => {
  try {
    if (hasChromeStorage()) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return (result[STORAGE_KEY] as WheelPersistState | undefined) ?? null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WheelPersistState) : null;
  } catch {
    return null;
  }
};

export const savePersistedWheel = async (state: WheelPersistState): Promise<void> => {
  const payload: WheelPersistState = {
    ...state,
    items: itemsForPersist(state.items),
  };
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [STORAGE_KEY]: payload });
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota or private mode: keep working in memory.
  }
};
