import { formatRandomNameGeneratedAt } from "@/lib/random-name/format-random-name-time";
import type { RandomNameHistoryEntry } from "@/types/random-name";

export const formatRandomNameHistoryExport = (
  entries: readonly RandomNameHistoryEntry[],
): string =>
  entries
    .map(
      (entry) =>
        `${formatRandomNameGeneratedAt(entry.generatedAt)}: ${entry.name}`,
    )
    .join("\n");

export const downloadRandomNameHistory = (
  entries: readonly RandomNameHistoryEntry[],
): void => {
  if (entries.length === 0) return;

  const blob = new Blob([formatRandomNameHistoryExport(entries)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "random-name-history.txt";
  anchor.click();
  URL.revokeObjectURL(url);
};
