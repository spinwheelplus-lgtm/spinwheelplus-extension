import { HEX_COLOR_PATTERN, readHexColor } from "@/lib/item-color";

/** Hub stroke when `centerHubOutline` is missing or not a 6-digit hex. */
export const DEFAULT_CENTER_HUB_OUTLINE = "#ffffff";

/**
 * A saved wheel without `centerHubOutline` painted the ring with `pointerColor`.
 * Keep that color once. An invalid outline falls back to white.
 */
export const resolveStoredCenterHubOutline = (
  rawOutline: unknown,
  legacyPointerColor: unknown,
): string => {
  if (typeof rawOutline === "string" && HEX_COLOR_PATTERN.test(rawOutline.trim())) {
    return rawOutline.trim();
  }
  if (rawOutline == null) {
    return readHexColor(legacyPointerColor, DEFAULT_CENTER_HUB_OUTLINE);
  }
  return DEFAULT_CENTER_HUB_OUTLINE;
};
