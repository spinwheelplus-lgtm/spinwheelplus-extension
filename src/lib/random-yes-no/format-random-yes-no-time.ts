import {
  formatActiveDateTime,
  formatActiveRelativeTime,
} from "@/lib/i18n/format-active-time";

export const formatRandomYesNoGeneratedAt = (timestamp: number): string =>
  formatActiveDateTime(timestamp);

export const formatRandomYesNoRelativeTime = (timestamp: number): string =>
  formatActiveRelativeTime(timestamp, 45);
