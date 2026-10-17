import { resolveItemSliceColor } from "@/lib/item-color";
import type { WheelItem } from "@/lib/types";

export const TWO_PI = Math.PI * 2;

export type SliceLayout = {
  item: WheelItem;
  start: number;
  span: number;
  color: string;
};

export const layoutSlices = (
  items: WheelItem[],
  colors: string[],
): SliceLayout[] => {
  if (items.length === 0) return [];
  const total = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  if (total <= 0) return [];
  let angle = -Math.PI / 2;
  return items.map((item, index) => {
    const span = TWO_PI * ((item.weight || 1) / total);
    const start = angle;
    angle += span;
    const color = resolveItemSliceColor(item.bgColor, index, colors);
    return { item, start, span, color };
  });
};
