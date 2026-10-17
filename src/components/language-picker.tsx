import { Languages } from "lucide-react";

import { LOCALE_NATIVE_NAME, MENU_LOCALES, type LocalePreference } from "@/lib/i18n/locale";
import { useLocaleStore } from "@/store/locale-store";

export const LanguagePicker = () => {
  const preference = useLocaleStore((s) => s.preference);
  const messages = useLocaleStore((s) => s.messages);
  const setPreference = useLocaleStore((s) => s.setPreference);

  return (
    <label className="mt-3 flex items-center gap-2 px-1">
      <Languages className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="shrink-0 text-sm font-medium text-foreground">
        {messages.languageLabel}
      </span>
      <select
        className="ml-auto h-9 min-w-0 flex-1 cursor-pointer rounded-xl border border-border bg-muted/70 px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-muted/40"
        aria-label={messages.languageLabel}
        value={preference}
        onChange={(event) => setPreference(event.target.value as LocalePreference)}
      >
          <option value="browser">{messages.browser}</option>
          {MENU_LOCALES.map((id) => (
            <option key={id} value={id}>
              {LOCALE_NATIVE_NAME[id]}
            </option>
          ))}
      </select>
    </label>
  );
};
