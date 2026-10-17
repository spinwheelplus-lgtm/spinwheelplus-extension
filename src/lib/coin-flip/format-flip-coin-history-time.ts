import {
  formatActiveDateTime,
  formatActiveRelativeTime,
} from "@/lib/i18n/format-active-time";

export const formatFlipCoinHistoryGeneratedAt = (timestamp: number): string =>
  formatActiveDateTime(timestamp);

export const formatFlipCoinHistoryRelativeTime = (timestamp: number): string =>
  formatActiveRelativeTime(timestamp, 45);
