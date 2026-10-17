import {
  formatActiveDateTime,
  formatActiveRelativeTime,
} from "@/lib/i18n/format-active-time";

export const formatRandomNameGeneratedAt = (timestamp: number): string =>
  formatActiveDateTime(timestamp);

export const formatRandomNameRelativeTime = (timestamp: number): string =>
  formatActiveRelativeTime(timestamp);
