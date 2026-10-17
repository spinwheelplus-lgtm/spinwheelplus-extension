import { LOCALE_BCP47 } from "@/lib/i18n/locale";
import { readMessages } from "@/lib/i18n/use-messages";
import { useLocaleStore } from "@/store/locale-store";

const activeBcp47 = (): string => LOCALE_BCP47[useLocaleStore.getState().resolved];

export const formatActiveDateTime = (timestamp: number): string =>
  new Intl.DateTimeFormat(activeBcp47(), {
    dateStyle: "long",
    timeStyle: "medium",
  }).format(new Date(timestamp));

export const formatActiveRelativeTime = (
  timestamp: number,
  justNowUnderSeconds = 0,
): string => {
  const diffSeconds = Math.round((timestamp - Date.now()) / 1000);
  if (justNowUnderSeconds > 0 && Math.abs(diffSeconds) < justNowUnderSeconds) {
    return readMessages().ui.common.justNow;
  }

  const formatter = new Intl.RelativeTimeFormat(activeBcp47(), { numeric: "auto" });
  if (Math.abs(diffSeconds) < 60) return formatter.format(diffSeconds, "second");

  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, "minute");

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");

  return formatter.format(Math.round(diffHours / 24), "day");
};
