import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { useAppearanceStore } from "@/store/appearance-store";
import { useLocaleStore } from "@/store/locale-store";

const THEME_ICON_STROKE = 2;

const OPTIONS = [
  { id: "light" as const, labelKey: "light" as const, Icon: Sun },
  { id: "dark" as const, labelKey: "dark" as const, Icon: Moon },
  { id: "system" as const, labelKey: "system" as const, Icon: Monitor },
];

const ThemeAppearanceIcon = ({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) => (
  <Icon
    className={cn(
      "block shrink-0 [stroke-linecap:round] [stroke-linejoin:round]",
      className,
    )}
    strokeWidth={THEME_ICON_STROKE}
    aria-hidden
  />
);

export const ThemeAppearancePicker = () => {
  const preference = useAppearanceStore((s) => s.preference);
  const setPreference = useAppearanceStore((s) => s.setPreference);
  const messages = useLocaleStore((s) => s.messages);

  return (
    <div>
      <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {messages.appearance}
      </p>
      <div
        role="radiogroup"
        aria-label={messages.theme}
        className="grid grid-cols-3 gap-1 rounded-xl bg-muted/70 p-1 dark:bg-muted/40"
      >
        {OPTIONS.map(({ id, labelKey, Icon }) => {
          const label = messages[labelKey];
          const selected = preference === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-1.5 rounded-lg px-1.5 py-2.5 text-center text-[0.6875rem] font-medium outline-none transition-all",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border dark:bg-muted"
                  : "text-muted-foreground hover:bg-background/70 hover:text-foreground dark:hover:bg-muted/60",
              )}
              onClick={() => setPreference(id)}
            >
              {selected ? (
                <span className="absolute top-1.5 right-1.5 text-primary dark:text-sky-400 [&_svg]:size-3">
                  <Check aria-hidden strokeWidth={THEME_ICON_STROKE} />
                </span>
              ) : null}
              <ThemeAppearanceIcon icon={Icon} className="size-5" />
              <span className="leading-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

