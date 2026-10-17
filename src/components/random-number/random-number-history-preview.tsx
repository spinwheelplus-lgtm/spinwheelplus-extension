import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { formatRandomNumberRelativeTime } from "@/lib/random-number/format-random-number-time";
import type { RandomNumberHistoryEntry } from "@/types/random-number";

type RandomNumberHistoryPreviewProps = {
  entries: readonly RandomNumberHistoryEntry[];
  activeHistoryId: string | null;
  onSelectEntry: (id: string) => void;
};

export const RandomNumberHistoryPreview = ({
  entries,
  activeHistoryId,
  onSelectEntry,
}: RandomNumberHistoryPreviewProps) => {
  const numberUi = useMessages().ui.number;

  return (
  <div
    className="overflow-x-auto pb-1"
    role="region"
    aria-label={numberUi.recent}
  >
    <div className="flex w-max min-w-0 gap-3">
      {entries.map((entry) => {
        const isActive = entry.id === activeHistoryId;
        const previewLabel =
          entry.numbers.length > 6
            ? `${entry.numbers.slice(0, 6).join(", ")}...`
            : entry.numbers.join(", ");
        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelectEntry(entry.id)}
            aria-label={fillTemplate(numberUi.loadDraw, {
              preview: previewLabel,
            })}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "w-44 shrink-0 rounded-xl border border-border bg-card px-3 py-3 text-left transition-colors hover:bg-muted",
              isActive && "border-primary ring-2 ring-primary/20",
            )}
          >
            <p className="line-clamp-2 text-sm font-medium text-foreground">
              {entry.numbers.join(", ")}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {formatRandomNumberRelativeTime(entry.generatedAt)}
            </p>
          </button>
        );
      })}
    </div>
  </div>
  );
};
