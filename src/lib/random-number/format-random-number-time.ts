import {
  formatActiveDateTime,
  formatActiveRelativeTime,
} from "@/lib/i18n/format-active-time";

export const formatRandomNumberGeneratedAt = (timestamp: number): string =>
  formatActiveDateTime(timestamp);

export const formatRandomNumberRelativeTime = (timestamp: number): string =>
  formatActiveRelativeTime(timestamp);
