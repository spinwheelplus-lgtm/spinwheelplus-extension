export const SITE_URL = "https://spinwheelplus.com";
export const SITE_FAIRNESS_AUDIT_URL = `${SITE_URL}/randomness-audit`;
export const SITE_PRIVACY_URL = `${SITE_URL}/legal/privacy-policy`;
export const SITE_RANDOM_NUMBER_URL = `${SITE_URL}/tools/random-number`;
export const SITE_RANDOM_NAME_URL = `${SITE_URL}/tools/random-name`;
export const SITE_DICE_ROLLER_URL = `${SITE_URL}/tools/dice-roller`;
export const SITE_COIN_FLIP_URL = `${SITE_URL}/tools/coin-flip`;
export const SITE_YES_NO_URL = `${SITE_URL}/tools/random-yes-no`;
export const SITE_SHUFFLE_LIST_URL = `${SITE_URL}/tools/shuffle-list`;
export const SITE_RANDOM_TEAM_URL = `${SITE_URL}/tools/random-team-generator`;

export const MAX_WHEEL_ITEMS = 1000;
/** Slice photos stored in IndexedDB. Same cap as the site canvas. */
export const ITEM_IMAGE_MAX_COUNT = 100;
export const MIN_WHEEL_ITEMS = 0;
export const MIN_SPIN_ITEMS = 1;
export const SPIN_DURATION_SEC_MIN = 2;
export const SPIN_DURATION_SEC_MAX = 30;

export const DEFAULT_THEME_COLORS = [
  "#3369e8",
  "#d50f25",
  "#eeb211",
  "#009925",
] as const;

export const DEFAULT_WHEEL_TITLE = "Spin the wheel online - free";
export const TITLE_FONT_SIZE_MIN = 14;
export const TITLE_FONT_SIZE_MAX = 72;
export const DEFAULT_TITLE_FONT_SIZE = 24;
export const DEFAULT_TITLE_COLOR = "#000000";
export const DEFAULT_TITLE_PANEL_COLOR = "#f0d7ad";
export const DEFAULT_RIM_DOT_COLOR = "#fcf400";
export const DEFAULT_CENTER_COLOR = "#111827";
export const DEFAULT_POINTER_COLOR = "#ffffff";

export const clampTitleFontSize = (value: number): number => {
  if (!Number.isFinite(value)) return DEFAULT_TITLE_FONT_SIZE;
  return Math.min(
    TITLE_FONT_SIZE_MAX,
    Math.max(TITLE_FONT_SIZE_MIN, Math.round(value)),
  );
};

export const DEFAULT_NAMES = [
  "Olivia",
  "Liam",
  "Sophia",
  "Noah",
  "Emma",
  "James",
  "Ava",
  "Ethan",
  "Mia",
  "Lucas",
] as const;
