import { formatRandomYesNoGeneratedAt } from "@/lib/random-yes-no/format-random-yes-no-time";
import type { RandomYesNoHistoryEntry } from "@/types/random-yes-no";

export const formatRandomYesNoHistoryExport = (
  entries: readonly RandomYesNoHistoryEntry[],
): string =>
  entries
    .map((entry) => {
      const line = `${formatRandomYesNoGeneratedAt(entry.generatedAt)}: ${entry.answer}`;
      const question = entry.question.trim();
      return question ? `${line}\n  Q: ${question}` : line;
    })
    .join("\n");

export const downloadRandomYesNoHistory = (
  entries: readonly RandomYesNoHistoryEntry[],
): void => {
  if (entries.length === 0) {
    return;
  }

  const blob = new Blob([formatRandomYesNoHistoryExport(entries)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "random-yes-no-history.txt";
  anchor.click();
  URL.revokeObjectURL(url);
};
