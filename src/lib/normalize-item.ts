import { hasCustomItemColor } from "@/lib/item-color";
import { createItemId } from "@/lib/random";
import type { EntriesViewMode, WheelItem } from "@/lib/types";

const readImageId = (value: string | undefined): string | undefined => {
  const id = value?.trim();
  return id ? id : undefined;
};

export const normalizeWheelItem = (item: WheelItem): WheelItem => ({
  id: item.id || createItemId(),
  label: item.label.trim(),
  weight: item.weight > 0 ? item.weight : 1,
  imageId: readImageId(item.imageId),
  imageDataUrl: item.imageDataUrl,
  bgColor: hasCustomItemColor(item.bgColor) ? item.bgColor : undefined,
  inactive: item.inactive === true ? true : undefined,
});

export const wheelItemsAreEqual = (
  left: readonly WheelItem[],
  right: readonly WheelItem[],
): boolean =>
  left.length === right.length &&
  left.every((item, index) => {
    const other = right[index];
    return (
      other !== undefined &&
      item.id === other.id &&
      item.label === other.label &&
      item.weight === other.weight &&
      item.imageId === other.imageId &&
      item.imageDataUrl === other.imageDataUrl &&
      item.bgColor === other.bgColor &&
      item.inactive === other.inactive
    );
  });

export const readEntriesViewMode = (value: unknown): EntriesViewMode =>
  value === "advanced" ? "advanced" : "text";

/** Missing or invalid values default to shown. Legacy `showAboutSections` applies to both. */
export const readShowCopySection = (
  value: unknown,
  legacyCombined: unknown,
): boolean => {
  if (value === true || value === false) return value;
  return legacyCombined !== false;
};
