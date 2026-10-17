import { Clock3, Trophy } from "lucide-react";

import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { formatRandomNameGeneratedAt } from "@/lib/random-name/format-random-name-time";

type RandomNameWinnerDisplayProps = {
  showWinner: boolean;
  isRolling: boolean;
  isExpanded: boolean;
  prefersReducedMotion: boolean;
  displayName: string | null;
  pickedAt: number | null;
};

export const RandomNameWinnerDisplay = ({
  showWinner,
  isRolling,
  isExpanded,
  prefersReducedMotion,
  displayName,
  pickedAt,
}: RandomNameWinnerDisplayProps) => {
  const messages = useMessages();
  const nameUi = messages.ui.name;
  if (!showWinner) {
    return (
      <div className="relative flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/45 px-6 pt-14 pb-10 text-center">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <span className="absolute top-4 left-6 size-2 rotate-12 rounded-sm bg-violet-400/35" />
          <span className="absolute top-10 right-10 size-2 rounded-full bg-emerald-400/35" />
          <span className="absolute bottom-8 left-12 size-2 rotate-45 rounded-sm bg-amber-400/35" />
          <span className="absolute right-6 bottom-6 size-2 rounded-full bg-sky-400/35" />
        </div>
        <span className="absolute -top-8 left-1/2 z-10 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-background/45">
          <Trophy className="size-8" aria-hidden />
        </span>
        <p className="relative text-3xl font-medium text-muted-foreground/60 sm:text-4xl">
          -
        </p>
        <p className="relative mt-3 text-sm text-muted-foreground">
          {nameUi.emptyPick}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-border bg-card px-6 pt-14 pb-10 text-center shadow-sm",
        isRolling && !prefersReducedMotion && "animate-pulse",
      )}
      aria-busy={isRolling}
      aria-live={isRolling ? "polite" : undefined}
      role="status"
    >
      <span className="absolute -top-8 left-1/2 z-10 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-card">
        <Trophy className="size-8" aria-hidden />
      </span>
      <p className="relative text-sm font-medium tracking-wide text-muted-foreground uppercase sm:text-base">
        {messages.ui.common.winner}
      </p>
      <p
        className={cn(
          "relative mt-3 w-full min-w-0 overflow-hidden font-bold break-words text-6xl leading-tight text-primary line-clamp-2 sm:text-7xl md:text-6xl",
          isExpanded && "line-clamp-3 text-7xl sm:text-8xl md:text-9xl",
          isRolling && "tabular-nums",
        )}
        title={displayName ?? undefined}
      >
        {displayName}
      </p>
      {!isRolling && pickedAt ? (
        <p className="relative mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 className="size-3.5 shrink-0" aria-hidden />
          {fillTemplate(nameUi.pickedOn, {
            time: formatRandomNameGeneratedAt(pickedAt),
          })}
        </p>
      ) : null}
    </div>
  );
};
