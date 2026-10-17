import { useEffect, useState } from "react";

import type { RandomYesNoDisplayState } from "@/hooks/use-random-yes-no-ask";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { resolveRandomYesNoAnswerVisual } from "@/lib/random-yes-no/answer-visual";
import { localizeYesNoPresetAnswer } from "@/lib/random-yes-no/localize-preset-answer";
import {
  RANDOM_YES_NO_FADE_TRANSITION_MS,
  RANDOM_YES_NO_FLIP_TRANSITION_MS,
} from "@/lib/random-yes-no/random-yes-no-animation-timing";
import {
  RANDOM_YES_NO_ANSWER_SLOT_CLASS,
  RANDOM_YES_NO_ANSWER_TEXT_ANIMATING_CLASS,
  RANDOM_YES_NO_ANSWER_TEXT_BASE_CLASS,
  resolveRandomYesNoAnswerTextScaleClass,
} from "@/lib/random-yes-no/random-yes-no-answer-layout";

type RandomYesNoAnimatedAnswerProps = {
  display: RandomYesNoDisplayState;
  committedAnswer: string | null;
  isAnimating: boolean;
  placeholder?: string;
  isExpanded?: boolean;
  slotClassName?: string;
};

export const RandomYesNoAnimatedAnswer = ({
  display,
  committedAnswer,
  isAnimating,
  placeholder = "?",
  isExpanded = false,
  slotClassName,
}: RandomYesNoAnimatedAnswerProps) => {
  const [fadeVisible, setFadeVisible] = useState(true);
  const text = isAnimating
    ? display.text || placeholder
    : committedAnswer ?? display.text ?? placeholder;

  const yesNoUi = useMessages().ui.yesNo;
  const shown = localizeYesNoPresetAnswer(text, yesNoUi);
  const visual = resolveRandomYesNoAnswerVisual(text);
  const settledScaleSource = committedAnswer ?? text;
  const textScaleClass = isAnimating
    ? RANDOM_YES_NO_ANSWER_TEXT_ANIMATING_CLASS
    : resolveRandomYesNoAnswerTextScaleClass(settledScaleSource, isExpanded);

  useEffect(() => {
    if (display.animationType !== "fade" || !isAnimating) {
      setFadeVisible(true);
      return undefined;
    }

    setFadeVisible(false);
    const timerId = window.setTimeout(
      () => setFadeVisible(true),
      RANDOM_YES_NO_FADE_TRANSITION_MS / 2,
    );
    return () => window.clearTimeout(timerId);
  }, [display.animationType, display.text, isAnimating]);

  const glowClass =
    !isAnimating && text !== placeholder
      ? "drop-shadow-[0_0_28px_rgba(16,185,129,0.45)] dark:drop-shadow-[0_0_28px_rgba(52,211,153,0.35)]"
      : "";

  return (
    <div
      className={cn(RANDOM_YES_NO_ANSWER_SLOT_CLASS, slotClassName)}
      style={{ perspective: "900px" }}
    >
      <p
        className={cn(
          RANDOM_YES_NO_ANSWER_TEXT_BASE_CLASS,
          textScaleClass,
          visual.textClass,
          glowClass,
          display.animationType === "fade" &&
            isAnimating &&
            "transition-opacity ease-out",
          display.animationType === "fade" &&
            isAnimating &&
            !fadeVisible &&
            "opacity-0",
          display.animationType === "flip" &&
            isAnimating &&
            "transition-transform ease-in-out",
        )}
        style={{
          ...(display.animationType === "flip" && isAnimating
            ? {
                transform: `rotateY(${display.flipRotation}deg)`,
                transformStyle: "preserve-3d",
                transitionDuration: `${RANDOM_YES_NO_FLIP_TRANSITION_MS}ms`,
              }
            : {}),
          ...(display.animationType === "fade" && isAnimating
            ? {
                transitionDuration: `${RANDOM_YES_NO_FADE_TRANSITION_MS}ms`,
              }
            : {}),
        }}
      >
        {shown}
      </p>
    </div>
  );
};
