import { createItemId } from "@/lib/random";
import type { SpinHistoryEntry } from "@/lib/types";

export const SPIN_HISTORY_LIMIT = 100;

export const SPIN_HISTORY_DIALOG_HEADER_BACKGROUND =
  "radial-gradient(at 0% 0%, rgba(51, 105, 232, 0.3) 0px, rgba(0, 0, 0, 0) 80%), radial-gradient(at 98% 1%, rgba(213, 15, 37, 0.3) 0px, rgba(0, 0, 0, 0) 80%), transparent";

const HISTORY_ACCENTS = [
  {
    badgeClassName:
      "bg-violet-100 text-violet-800 dark:bg-violet-900/70 dark:text-violet-100",
    nameClassName: "text-blue-700 dark:text-blue-300",
  },
  {
    badgeClassName:
      "bg-sky-100 text-sky-800 dark:bg-sky-900/70 dark:text-sky-100",
    nameClassName: "text-blue-600 dark:text-blue-300",
  },
  {
    badgeClassName:
      "bg-rose-100 text-rose-800 dark:bg-rose-900/70 dark:text-rose-100",
    nameClassName: "text-orange-600 dark:text-orange-300",
  },
  {
    badgeClassName:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-100",
    nameClassName: "text-emerald-700 dark:text-emerald-300",
  },
  {
    badgeClassName:
      "bg-amber-100 text-amber-900 dark:bg-amber-900/70 dark:text-amber-100",
    nameClassName: "text-amber-800 dark:text-amber-200",
  },
] as const;

const pad2 = (value: number): string => String(value).padStart(2, "0");

export const getSpinHistoryAccent = (index: number) => {
  const n = HISTORY_ACCENTS.length;
  const i = ((index % n) + n) % n;
  return HISTORY_ACCENTS[i] ?? HISTORY_ACCENTS[0];
};

export const formatSpinHistoryTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
};

const isHistoryEntry = (value: unknown): value is SpinHistoryEntry => {
  if (value === null || typeof value !== "object") return false;
  const item = value as Partial<SpinHistoryEntry>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.timestamp === "number" &&
    Number.isFinite(item.timestamp)
  );
};

export const parseSpinHistory = (value: unknown): SpinHistoryEntry[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(isHistoryEntry).slice(0, SPIN_HISTORY_LIMIT);
};

export const createSpinHistoryEntry = (
  name: string,
  itemId?: string,
  timestamp = Date.now(),
): SpinHistoryEntry => {
  const trimmedId = itemId?.trim();
  return {
    id: createItemId(),
    name: name.trim() || "Untitled",
    timestamp,
    ...(trimmedId ? { itemId: trimmedId } : {}),
  };
};
