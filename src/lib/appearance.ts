/** Keep in sync with public/appearance-boot.js (FOUC, classic script). */
export const APPEARANCE_STORAGE_KEY = "spinwheelplus.appearance";

export type AppearancePreference = "light" | "dark" | "system";
export type ResolvedAppearance = "light" | "dark";

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

export const parseAppearancePreference = (
  value: unknown,
): AppearancePreference | null => {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return null;
};

export const resolveAppearance = (
  preference: AppearancePreference,
): ResolvedAppearance => {
  if (preference === "light" || preference === "dark") return preference;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyAppearanceClass = (
  preference: AppearancePreference,
): ResolvedAppearance => {
  const resolved = resolveAppearance(preference);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  return resolved;
};

export const loadAppearancePreference =
  async (): Promise<AppearancePreference | null> => {
    try {
      if (hasChromeStorage()) {
        const result = await chrome.storage.local.get(APPEARANCE_STORAGE_KEY);
        const parsed = parseAppearancePreference(
          result[APPEARANCE_STORAGE_KEY],
        );
        if (parsed) {
          localStorage.setItem(APPEARANCE_STORAGE_KEY, parsed);
          return parsed;
        }
      }
      return parseAppearancePreference(
        localStorage.getItem(APPEARANCE_STORAGE_KEY),
      );
    } catch {
      return null;
    }
  };

export const saveAppearancePreference = async (
  preference: AppearancePreference,
): Promise<void> => {
  try {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, preference);
    if (hasChromeStorage()) {
      await chrome.storage.local.set({
        [APPEARANCE_STORAGE_KEY]: preference,
      });
    }
  } catch {
    // Quota or private mode: keep working in memory.
  }
};
