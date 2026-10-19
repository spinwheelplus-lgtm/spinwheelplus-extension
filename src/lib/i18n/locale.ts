export const LOCALE_STORAGE_KEY = "spinwheelplus.locale";

export const APP_LOCALES = [
  "en",
  "vi",
  "es",
  "pt",
  "de",
  "fr",
  "ja",
  "it",
  "ko",
  "nl",
  "zh-Hans",
  "zh-Hant",
  "th",
  "fi",
  "uk",
] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export type LocalePreference = "browser" | AppLocale;

/** Native name shown in the menu. Add a row when you add a locale. */
export const LOCALE_NATIVE_NAME: Record<AppLocale, string> = {
  en: "English",
  vi: "Tiếng Việt",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  fr: "Français",
  ja: "日本語",
  it: "Italiano",
  ko: "한국어",
  nl: "Nederlands",
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文",
  th: "ภาษาไทย",
  fi: "Suomi",
  uk: "Українська",
};

/**
 * Menu order by internet reach. Traditional Chinese sits directly under
 * Simplified so the two scripts stay together. The picker keeps Browser first.
 */
export const MENU_LOCALES = [
  "en",
  "zh-Hans",
  "zh-Hant",
  "es",
  "pt",
  "fr",
  "ja",
  "de",
  "ko",
  "vi",
  "th",
  "it",
  "uk",
  "nl",
  "fi",
] as const satisfies readonly AppLocale[];

/** Date and relative-time formatting. Add a row with a new locale. */
export const LOCALE_BCP47: Record<AppLocale, string> = {
  en: "en-US",
  vi: "vi-VN",
  es: "es-419",
  pt: "pt-BR",
  de: "de-DE",
  fr: "fr-FR",
  ja: "ja-JP",
  it: "it-IT",
  ko: "ko-KR",
  nl: "nl-NL",
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-TW",
  th: "th-TH",
  fi: "fi-FI",
  uk: "uk-UA",
};

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

const isAppLocale = (value: string): value is AppLocale =>
  (APP_LOCALES as readonly string[]).includes(value);

export const parseLocalePreference = (value: unknown): LocalePreference | null => {
  if (value === "browser") return "browser";
  if (typeof value === "string" && isAppLocale(value)) return value;
  return null;
};

const chineseFromTag = (tag: string): AppLocale | null => {
  const lower = tag.toLowerCase();
  if (!lower.startsWith("zh")) return null;
  if (
    lower.includes("hant") ||
    lower.includes("-tw") ||
    lower.includes("-hk") ||
    lower.includes("-mo")
  ) {
    return "zh-Hant";
  }
  return "zh-Hans";
};

export const localeFromBrowser = (): AppLocale => {
  const tags =
    typeof navigator !== "undefined" && navigator.languages?.length
      ? navigator.languages
      : [typeof navigator !== "undefined" ? navigator.language : "en"];
  for (const tag of tags) {
    const chinese = chineseFromTag(tag);
    if (chinese) return chinese;
    const base = tag.toLowerCase().split("-")[0];
    if (isAppLocale(base)) return base;
  }
  return "en";
};

export const resolveLocale = (preference: LocalePreference): AppLocale =>
  preference === "browser" ? localeFromBrowser() : preference;

export const applyLocale = (locale: AppLocale): void => {
  document.documentElement.lang = locale;
};

export const loadLocalePreference = async (): Promise<LocalePreference | null> => {
  try {
    if (hasChromeStorage()) {
      const result = await chrome.storage.local.get(LOCALE_STORAGE_KEY);
      const parsed = parseLocalePreference(result[LOCALE_STORAGE_KEY]);
      if (parsed) {
        localStorage.setItem(LOCALE_STORAGE_KEY, parsed);
        return parsed;
      }
    }
    return parseLocalePreference(localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return null;
  }
};

export const saveLocalePreference = async (
  preference: LocalePreference,
): Promise<void> => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, preference);
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [LOCALE_STORAGE_KEY]: preference });
    }
  } catch {
    // Quota or private mode: keep working in memory.
  }
};

export const fillTemplate = (
  template: string,
  vars: Record<string, string | number>,
): string => template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
