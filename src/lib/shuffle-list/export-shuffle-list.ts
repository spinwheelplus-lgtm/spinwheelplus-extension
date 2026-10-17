import { formatRandomNameGeneratedAt } from "@/lib/random-name/format-random-name-time";
import type { ShuffleListHistoryEntry } from "@/types/shuffle-list";

export const formatShuffleListText = (items: readonly string[]): string =>
  items.join("\n");

export const downloadShuffleListText = (
  items: readonly string[],
  filename = "shuffled-list.txt",
): void => {
  if (items.length === 0) return;

  const blob = new Blob([formatShuffleListText(items)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const formatShuffleListHistoryExport = (
  entries: readonly ShuffleListHistoryEntry[],
): string =>
  entries
    .map((entry) => {
      const stamp = formatRandomNameGeneratedAt(entry.generatedAt);
      const count = entry.items.length;
      const noun = count === 1 ? "item" : "items";
      return `${stamp} (${count} ${noun})\n${formatShuffleListText(entry.items)}`;
    })
    .join("\n\n");

export const downloadShuffleListHistory = (
  entries: readonly ShuffleListHistoryEntry[],
): void => {
  if (entries.length === 0) return;

  const blob = new Blob([formatShuffleListHistoryExport(entries)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "shuffle-list-history.txt";
  anchor.click();
  URL.revokeObjectURL(url);
};
