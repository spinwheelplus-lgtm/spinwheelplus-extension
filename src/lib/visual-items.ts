import type { CustomizeState, WheelItem } from "@/lib/types";

export const WHEEL_SLICE_REPEAT_MIN = 1;
export const WHEEL_SLICE_REPEAT_MAX = 5;
export const WHEEL_SLICE_REPEAT_MAX_ITEMS = 200;
export const WHEEL_BLIND_SLICE_LABEL = "?????";

export const canApplySliceRepeat = (itemCount: number): boolean =>
  itemCount < WHEEL_SLICE_REPEAT_MAX_ITEMS;

export const readSliceRepeat = (value: number): number => {
  const rounded = Math.round(value);
  if (rounded < WHEEL_SLICE_REPEAT_MIN) return WHEEL_SLICE_REPEAT_MIN;
  if (rounded > WHEEL_SLICE_REPEAT_MAX) return WHEEL_SLICE_REPEAT_MAX;
  return rounded;
};

export const resolveSliceRepeat = (value: number, itemCount: number): number => {
  if (!canApplySliceRepeat(itemCount)) return WHEEL_SLICE_REPEAT_MIN;
  return readSliceRepeat(value);
};

const expandItemsBySliceRepeat = (
  items: readonly WheelItem[],
  repeat: number,
): WheelItem[] => {
  const times = readSliceRepeat(repeat);
  if (times <= 1 || items.length === 0) {
    return items.map((item) => ({ ...item }));
  }
  const out: WheelItem[] = [];
  for (let copy = 0; copy < times; copy += 1) {
    for (const item of items) {
      out.push({ ...item });
    }
  }
  return out;
};

const sliceNameKey = (label: string): string =>
  label.trim().normalize("NFC").toLowerCase();

export const hasWheelSliceContent = (item: WheelItem): boolean =>
  item.label.trim().length > 0 ||
  Boolean(item.imageId?.trim() || item.imageDataUrl?.trim());

export const removeDuplicateSlices = (
  items: readonly WheelItem[],
): WheelItem[] => {
  const seen = new Set<string>();
  const out: WheelItem[] = [];
  for (const item of items) {
    if (item.imageId || item.imageDataUrl) {
      out.push({ ...item });
      continue;
    }
    const key = sliceNameKey(item.label);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...item });
  }
  return out;
};

/** Canvas and spin list only. The entries editor keeps the source rows. */
export const mapItemsForSpin = (
  items: readonly WheelItem[],
  customize: Pick<CustomizeState, "sliceRepeat" | "removeDuplicateNames">,
): WheelItem[] => {
  const active = items.filter(
    (item) => item.inactive !== true && hasWheelSliceContent(item),
  );
  const skipRepeat = customize.removeDuplicateNames;
  let next = expandItemsBySliceRepeat(
    active,
    skipRepeat
      ? WHEEL_SLICE_REPEAT_MIN
      : resolveSliceRepeat(customize.sliceRepeat, active.length),
  );
  if (customize.removeDuplicateNames) {
    next = removeDuplicateSlices(next);
  }
  return next;
};
