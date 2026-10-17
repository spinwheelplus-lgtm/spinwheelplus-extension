import { formatRandomNumberGeneratedAt } from "@/lib/random-number/format-random-number-time";
import type { RandomNumberHistoryEntry } from "@/types/random-number";

export const formatRandomNumberHistoryExport = (
  entries: readonly RandomNumberHistoryEntry[],
): string =>
  entries
    .map(
      (entry) =>
        `${formatRandomNumberGeneratedAt(entry.generatedAt)}: ${entry.numbers.join(", ")}`,
    )
    .join("\n");

export const downloadRandomNumberHistory = (
  entries: readonly RandomNumberHistoryEntry[],
): void => {
  if (entries.length === 0) return;

  const blob = new Blob([formatRandomNumberHistoryExport(entries)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "random-number-history.txt";
  anchor.click();
  URL.revokeObjectURL(url);
};
