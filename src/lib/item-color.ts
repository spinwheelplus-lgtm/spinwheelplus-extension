export const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
export const DEFAULT_SLICE_COLOR = "#3369e8";
/** Advanced color button pie: first N Your Themes colors only. */
export const THEME_ITEM_COLOR_PREVIEW_LIMIT = 5;

export const themeItemColorPreviewPalette = (
  themeColors: readonly string[],
  fallback: string = DEFAULT_SLICE_COLOR,
): string[] => {
  const palette = themeColors
    .map((color) => color.trim())
    .filter(Boolean)
    .slice(0, THEME_ITEM_COLOR_PREVIEW_LIMIT);
  return palette.length > 0 ? palette : [fallback];
};

export const hasCustomItemColor = (bgColor: string | undefined): boolean =>
  typeof bgColor === "string" && HEX_COLOR_PATTERN.test(bgColor);

export const readHexColor = (value: unknown, fallback: string): string =>
  typeof value === "string" && HEX_COLOR_PATTERN.test(value.trim())
    ? value.trim()
    : fallback;

export const resolveItemSliceColor = (
  bgColor: string | undefined,
  index: number,
  themeColors: readonly string[],
): string => {
  if (hasCustomItemColor(bgColor)) return bgColor as string;
  return themeColors[index % themeColors.length] ?? DEFAULT_SLICE_COLOR;
};

export const contrastOnColor = (hex: string): string => {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return "#111827";
  const r = Number.parseInt(raw.slice(0, 2), 16) / 255;
  const g = Number.parseInt(raw.slice(2, 4), 16) / 255;
  const b = Number.parseInt(raw.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.62 ? "#111827" : "#ffffff";
};

/** YIQ midpoint used on the site wheel: dark ink on yellows/oranges. */
const WHEEL_TEXT_YIQ_LIGHT_FILL_MIN = 128;

export const pickWheelTextColor = (
  bgColor: string | null | undefined,
): string => {
  const hex = String(bgColor ?? "").replace("#", "");
  if (!/^[\da-fA-F]{6}$/i.test(hex)) return "#ffffff";
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= WHEEL_TEXT_YIQ_LIGHT_FILL_MIN ? "#0c0c0c" : "#fafafa";
};
