import {
  formatActiveDateTime,
  formatActiveRelativeTime,
} from "@/lib/i18n/format-active-time";

export const formatRollDiceHistoryGeneratedAt = (timestamp: number): string =>
  formatActiveDateTime(timestamp);

export const formatRollDiceHistoryRelativeTime = (timestamp: number): string =>
  formatActiveRelativeTime(timestamp, 45);
