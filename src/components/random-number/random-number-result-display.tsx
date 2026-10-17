import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import type { RandomNumberDisplayScale } from "@/lib/random-number/result-display-scale";
import type { RandomNumberDisplaySlice } from "@/lib/random-number/slice-random-number-display";

type RandomNumberResultDisplayProps = {
  showResultGrid: boolean;
  isRolling: boolean;
  prefersReducedMotion: boolean;
  resultDisplay: RandomNumberDisplaySlice;
  displayScale: RandomNumberDisplayScale;
};

export const RandomNumberResultDisplay = ({
  showResultGrid,
  isRolling,
  prefersReducedMotion,
  resultDisplay,
  displayScale,
}: RandomNumberResultDisplayProps) => {
  const empty = useMessages().ui.number.empty;
  if (!showResultGrid) {
    return (
      <div className="flex min-h-44 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/50 px-6 py-16 text-center">
        <p
          className="text-4xl font-medium tabular-nums text-muted-foreground/60 sm:text-5xl"
          aria-hidden
        >
          --
        </p>
        <p className="sr-only">{empty}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-44 flex-1 flex-col">
      <div
        className={cn("grid flex-1 gap-3", displayScale.gridClass)}
        aria-busy={isRolling}
        aria-live={isRolling ? "polite" : undefined}
        role="status"
      >
        {resultDisplay.visible.map((value, index) => (
          <div
            key={`${isRolling ? "roll" : "result"}-${index}-${value}`}
            className={cn(
              "flex items-center justify-center rounded-xl border border-border bg-card px-4 py-6 text-primary shadow-sm",
              displayScale.tileClass,
              isRolling && !prefersReducedMotion && "animate-pulse",
            )}
          >
            <span
              className={cn("tabular-nums leading-none", displayScale.textClass)}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      {resultDisplay.hiddenCount > 0 ? (
        <p className="mt-3 shrink-0 text-center text-sm text-muted-foreground">
          +{resultDisplay.hiddenCount} more not shown ({resultDisplay.totalCount}{" "}
          total). Copy All includes every number.
        </p>
      ) : null}
    </div>
  );
};
