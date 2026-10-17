import { create } from "zustand";

import {
  applyLocale,
  loadLocalePreference,
  resolveLocale,
  saveLocalePreference,
  type AppLocale,
  type LocalePreference,
} from "@/lib/i18n/locale";
import { messagesFor, type ShellMessages } from "@/lib/i18n/messages";

type LocaleStore = {
  preference: LocalePreference;
  resolved: AppLocale;
  messages: ShellMessages;
  ready: boolean;
  hydrate: () => Promise<void>;
  setPreference: (preference: LocalePreference) => void;
};

const apply = (
  preference: LocalePreference,
): Pick<LocaleStore, "preference" | "resolved" | "messages"> => {
  const resolved = resolveLocale(preference);
  applyLocale(resolved);
  return { preference, resolved, messages: messagesFor(resolved) };
};

let languageListenerBound = false;

const bindBrowserLanguage = (): void => {
  if (languageListenerBound || typeof window === "undefined") return;
  languageListenerBound = true;
  window.addEventListener("languagechange", () => {
    if (useLocaleStore.getState().preference !== "browser") return;
    useLocaleStore.setState(apply("browser"));
  });
};

export const useLocaleStore = create<LocaleStore>((set) => ({
  ...apply("browser"),
  ready: false,
  hydrate: async () => {
    bindBrowserLanguage();
    const saved = await loadLocalePreference();
    set({ ...apply(saved ?? "browser"), ready: true });
  },
  setPreference: (preference) => {
    set(apply(preference));
    void saveLocalePreference(preference);
  },
}));
