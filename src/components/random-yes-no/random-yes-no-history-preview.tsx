import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { localizeYesNoPresetAnswer } from "@/lib/random-yes-no/localize-preset-answer";
import { formatRandomYesNoRelativeTime } from "@/lib/random-yes-no/format-random-yes-no-time";
import type { RandomYesNoHistoryEntry } from "@/types/random-yes-no";

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

type RandomYesNoHistoryPreviewProps = {
  entries: readonly RandomYesNoHistoryEntry[];
  activeHistoryId: string | null;
  onSelectEntry: (id: string) => void;
  disabled?: boolean;
};

export const RandomYesNoHistoryPreview = ({
  entries,
  activeHistoryId,
  onSelectEntry,
  disabled = false,
}: RandomYesNoHistoryPreviewProps) => {
  const { copyText, isCopied } = useCopyFeedback();
  const { common, yesNo: yesNoUi } = useMessages().ui;

  return (
    <div
      className="overflow-x-auto pb-1"
      role="region"
      aria-label={yesNoUi.recent}
    >
      <div className="flex w-max min-w-0 gap-3">
        {entries.map((entry, index) => {
          const isActive = entry.id === activeHistoryId;
          const entryCopied = isCopied(entry.id);
          const rankClass =
            RANK_BADGE_CLASSES[index % RANK_BADGE_CLASSES.length]!;
          const shownAnswer = localizeYesNoPresetAnswer(entry.answer, yesNoUi);
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
                disabled={disabled}
                onClick={() => onSelectEntry(entry.id)}
                aria-label={`${common.copy} ${shownAnswer}`}
                aria-current={isActive ? "true" : undefined}
                className="min-w-0 flex-1 text-left disabled:opacity-60"
              >
                <p
                  className="line-clamp-2 break-words text-sm font-medium text-foreground"
                  title={shownAnswer}
                >
                  {shownAnswer}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatRandomYesNoRelativeTime(entry.generatedAt)}
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
                      ? `${common.copied} ${shownAnswer}`
                      : `${common.copy} ${shownAnswer}`
                  }
                  onClick={() => void copyText(shownAnswer, entry.id)}
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
