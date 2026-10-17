import { Clock3, Trophy } from "lucide-react";

import { RandomYesNoAnimatedAnswer } from "@/components/random-yes-no/random-yes-no-animated-answer";
import type { RandomYesNoDisplayState } from "@/hooks/use-random-yes-no-ask";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { formatRandomYesNoGeneratedAt } from "@/lib/random-yes-no/format-random-yes-no-time";

type RandomYesNoAnswerFrameProps = {
  showResult: boolean;
  isAnimating: boolean;
  isExpanded: boolean;
  display: RandomYesNoDisplayState;
  committedAnswer: string | null;
  generatedAt: number | null;
};

export const RandomYesNoAnswerFrame = ({
  showResult,
  isAnimating,
  isExpanded,
  display,
  committedAnswer,
  generatedAt,
}: RandomYesNoAnswerFrameProps) => {
  const yesNoUi = useMessages().ui.yesNo;
  if (!showResult) {
    return (
      <div
        className="relative flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/45 px-6 pt-14 pb-10 text-center"
        aria-label={yesNoUi.emptyAria}
      >
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
          {yesNoUi.tapAsk}
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-border bg-card px-6 pt-14 pb-10 text-center shadow-sm"
      aria-busy={isAnimating}
      aria-live={isAnimating ? "polite" : undefined}
      role="status"
    >
      <span className="absolute -top-8 left-1/2 z-10 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-card">
        <Trophy className="size-8" aria-hidden />
      </span>
      <p className="relative text-sm font-medium tracking-wide text-muted-foreground uppercase sm:text-base">
        {yesNoUi.answerLabel}
      </p>
      <RandomYesNoAnimatedAnswer
        display={display}
        committedAnswer={committedAnswer}
        isAnimating={isAnimating}
        isExpanded={isExpanded}
        slotClassName={cn(
          "h-auto w-full",
          isExpanded ? "min-h-32 sm:min-h-40" : "min-h-24 sm:min-h-28",
        )}
      />
      {!isAnimating && generatedAt ? (
        <p className="relative mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 className="size-3.5 shrink-0" aria-hidden />
          {fillTemplate(yesNoUi.askedOn, {
            time: formatRandomYesNoGeneratedAt(generatedAt),
          })}
        </p>
      ) : null}
    </div>
  );
};
