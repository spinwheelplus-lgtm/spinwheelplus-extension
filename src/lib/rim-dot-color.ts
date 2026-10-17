import { DEFAULT_RIM_DOT_COLOR } from "@/lib/constants";
import { randomIndex } from "@/lib/random";

const HEX6 = /^#?([0-9a-fA-F]{6})$/;

/** Invert is kept only when some channel moves at least this far from the source. */
const MIN_INVERT_CHANNEL_DELTA = 40;

const YIQ_LIGHT_MIN = 128;

/** Customize and stored JSON keep at most two rim-dot colors. */
export const MAX_RIM_DOT_COLORS = 2;

/**
 * Factory rim-dot pairs. Second hex is the stored channel inverse of the first.
 * New copies one pair. Add looks this table up before inverting.
 */
export const DEFAULT_RIM_DOT_COLOR_PAIRS: readonly (readonly [string, string])[] =
  [
    ["#FF0000", "#00FFFF"],
    ["#FFA500", "#005AFF"],
    ["#FFFF00", "#0000FF"],
    ["#008000", "#FF7FFF"],
    ["#4B0082", "#B4FF7D"],
    ["#EE82EE", "#117D11"],
  ];

const parseRgb = (hex: string): [number, number, number] | null => {
  const match = HEX6.exec(hex.trim());
  if (!match?.[1]) return null;
  const raw = match[1];
  return [
    parseInt(raw.slice(0, 2), 16),
    parseInt(raw.slice(2, 4), 16),
    parseInt(raw.slice(4, 6), 16),
  ];
};

const toHex = (r: number, g: number, b: number): string =>
  `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;

const readHex = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;
  const rgb = parseRgb(raw);
  if (!rgb) return null;
  return toHex(rgb[0], rgb[1], rgb[2]);
};

/** Mate from `DEFAULT_RIM_DOT_COLOR_PAIRS`, either direction. Null when the hex is not in the table. */
export const pairedRimDotColor = (hex: string): string | null => {
  const key = hex.trim().toLowerCase();
  for (const [first, second] of DEFAULT_RIM_DOT_COLOR_PAIRS) {
    if (first.toLowerCase() === key) return second.toLowerCase();
    if (second.toLowerCase() === key) return first.toLowerCase();
  }
  return null;
};

/**
 * Second rim-dot color when the user adds a swatch.
 * Each channel is `255 - channel`. A near-gray invert snaps to black or white.
 */
export const invertRimDotColor = (hex: string): string => {
  const rgb = parseRgb(hex);
  if (!rgb) return "#000000";
  const inverted: [number, number, number] = [
    255 - rgb[0],
    255 - rgb[1],
    255 - rgb[2],
  ];
  const maxDelta = Math.max(
    Math.abs(inverted[0] - rgb[0]),
    Math.abs(inverted[1] - rgb[1]),
    Math.abs(inverted[2] - rgb[2]),
  );
  if (maxDelta < MIN_INVERT_CHANNEL_DELTA) {
    const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return yiq >= YIQ_LIGHT_MIN ? "#000000" : "#ffffff";
  }
  return toHex(inverted[0], inverted[1], inverted[2]);
};

/**
 * Legacy string or stored array → 1 or 2 hex colors.
 * Empty when nothing valid is present.
 */
export const readRimDotColors = (raw: unknown): string[] => {
  if (typeof raw === "string") {
    const hex = readHex(raw);
    return hex ? [hex] : [];
  }
  if (!Array.isArray(raw)) return [];
  const colors: string[] = [];
  for (const value of raw) {
    if (colors.length >= MAX_RIM_DOT_COLORS) break;
    const hex = readHex(value);
    if (hex) colors.push(hex);
  }
  return colors;
};

/** Saved wheels: a legacy string stays one color. Missing or invalid becomes the yellow fallback. */
export const readStoredRimDotColors = (raw: unknown): string[] => {
  const colors = readRimDotColors(raw);
  if (colors.length > 0) return colors;
  return [DEFAULT_RIM_DOT_COLOR];
};

/** One factory pair for New and reset. */
export const pickRandomRimDotColorPair = (): [string, string] => {
  const pair =
    DEFAULT_RIM_DOT_COLOR_PAIRS[
      randomIndex(DEFAULT_RIM_DOT_COLOR_PAIRS.length)
    ] ?? DEFAULT_RIM_DOT_COLOR_PAIRS[0];
  return [pair[0].toLowerCase(), pair[1].toLowerCase()];
};

/** Second swatch: table mate when the first color is a factory hex, otherwise channel invert. */
export const secondRimDotColorFor = (first: string): string =>
  pairedRimDotColor(first) ?? invertRimDotColor(first);
