import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { formatRandomNameRelativeTime } from "@/lib/random-name/format-random-name-time";
import type { RandomNameHistoryEntry } from "@/types/random-name";

const RANK_BADGE_CLASSES = [
  "bg-violet-600 text-white",
  "bg-emerald-600 text-white",
  "bg-orange-500 text-white",
  "bg-sky-600 text-white",
  "bg-rose-500 text-white",
  "bg-amber-500 text-white",
  "bg-indigo-600 text-white",
  "bg-teal-600 text-white",
  "bg-fuchsia-600 text-white",
  "bg-cyan-600 text-white",
] as const;

type RandomNameHistoryPreviewProps = {
  entries: readonly RandomNameHistoryEntry[];
  activeHistoryId: string | null;
  onSelectEntry: (id: string) => void;
};

export const RandomNameHistoryPreview = ({
  entries,
  activeHistoryId,
  onSelectEntry,
}: RandomNameHistoryPreviewProps) => {
  const { copyText, isCopied } = useCopyFeedback();
  const { common, name: nameUi } = useMessages().ui;

  return (
    <div
      className="overflow-x-auto pb-1"
      role="region"
      aria-label={nameUi.recent}
    >
      <div className="flex w-max min-w-0 gap-3">
        {entries.map((entry, index) => {
          const isActive = entry.id === activeHistoryId;
          const entryCopied = isCopied(entry.id);
          const rankClass =
            RANK_BADGE_CLASSES[index % RANK_BADGE_CLASSES.length]!;
          return (
            <div
              key={entry.id}
              className={cn(
                "flex w-44 shrink-0 flex-col rounded-xl border border-border bg-card p-3",
                isActive && "border-primary ring-2 ring-primary/20",
              )}
            >
              <button
                type="button"
                onClick={() => onSelectEntry(entry.id)}
                aria-label={`Load pick: ${entry.name}`}
                aria-current={isActive ? "true" : undefined}
                className="min-w-0 flex-1 text-left"
              >
                <p
                  className="line-clamp-2 break-words text-sm font-medium text-foreground"
                  title={entry.name}
                >
                  {entry.name}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatRandomNameRelativeTime(entry.generatedAt)}
                </p>
              </button>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                    rankClass,
                  )}
                  aria-hidden
                >
                  {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 shrink-0 px-2",
                    entryCopied && "text-emerald-700 dark:text-emerald-400",
                  )}
                  aria-label={
                    entryCopied
                      ? `${common.copied} ${entry.name}`
                      : `${common.copy} ${entry.name}`
                  }
                  onClick={() => void copyText(entry.name, entry.id)}
                >
                  {entryCopied ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    <Copy className="size-3.5" aria-hidden />
                  )}
                  {entryCopied ? common.copied : common.copy}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
