import {
  Check,
  Copy,
  Lightbulb,
  Loader2,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelLeftClose,
  Sparkles,
  Shuffle,
} from "lucide-react";

import { RandomYesNoAnswerFrame } from "@/components/random-yes-no/random-yes-no-answer-frame";
import { RandomYesNoHistorySection } from "@/components/random-yes-no/random-yes-no-history-section";
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import type { RandomYesNoDisplayState } from "@/hooks/use-random-yes-no-ask";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { useImmersiveStore } from "@/store/immersive-store";
import { useRandomYesNoStore } from "@/store/random-yes-no-store";

const RESULT_COPY_KEY = "random-yes-no-result";

const RESULTS_FRAME_MIN_CLASS = "min-h-[32rem]";

const FULLSCREEN_BACKGROUND =
  "radial-gradient(at 0% 0%, rgba(51, 105, 232, 0.3) 0px, rgba(0, 0, 0, 0) 50%), radial-gradient(at 98% 1%, rgba(213, 15, 37, 0.3) 0px, rgba(0, 0, 0, 0) 50%), var(--background)";

type RandomYesNoResultCardProps = {
  display: RandomYesNoDisplayState;
  isAnimating: boolean;
  optionsDocked: boolean;
  onToggleOptionsDock: () => void;
  onAsk: () => void;
};

export const RandomYesNoResultCard = ({
  display,
  isAnimating,
  optionsDocked,
  onToggleOptionsDock,
  onAsk,
}: RandomYesNoResultCardProps) => {
  const currentAnswer = useRandomYesNoStore(
    (state) => state.random_yes_no_current_answer,
  );
  const generatedAt = useRandomYesNoStore(
    (state) => state.random_yes_no_current_generated_at,
  );
  const messages = useMessages();
  const isExpanded = useImmersiveStore((state) => state.immersive);
  const toggleImmersive = useImmersiveStore((state) => state.toggleImmersive);
  const { copyText, isCopied } = useCopyFeedback();
  const resultCopied = isCopied(RESULT_COPY_KEY);

  const showResult = Boolean(currentAnswer) || isAnimating;
  const hasResult = Boolean(currentAnswer);
  const optionsDockToggleLabel = optionsDocked
    ? messages.ui.common.hideOptionsPanel
    : messages.ui.common.showOptionsPanel;
  const panelFullscreenLabel = isExpanded ? messages.exitZoom : messages.zoom;

  return (
    <div
      className={cn(
        "relative flex h-full w-full min-h-0 flex-col",
        isExpanded ? "min-h-svh" : RESULTS_FRAME_MIN_CLASS,
      )}
    >
      {!isExpanded ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-12 -left-4 z-10 hidden size-10 rounded-full bg-card shadow-md ring-1 ring-border hover:bg-muted lg:inline-flex"
          title={optionsDockToggleLabel}
          onClick={onToggleOptionsDock}
          aria-label={optionsDockToggleLabel}
          aria-expanded={optionsDocked}
        >
          {optionsDocked ? (
            <PanelLeftClose className="size-5" aria-hidden />
          ) : (
            <PanelLeft className="size-5" aria-hidden />
          )}
        </Button>
      ) : null}

      <div
        style={isExpanded ? { background: FULLSCREEN_BACKGROUND } : undefined}
        className={cn(
          "relative flex h-full min-h-0 flex-1 flex-col rounded-xl p-4 shadow-sm ring-1 ring-border",
          !isExpanded && cn("bg-card overflow-visible", RESULTS_FRAME_MIN_CLASS),
          isExpanded && "min-h-svh rounded-none ring-0 shadow-none",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => toggleImmersive()}
          aria-label={panelFullscreenLabel}
          aria-pressed={isExpanded}
        >
          {isExpanded ? (
            <Minimize2 className="size-4" aria-hidden />
          ) : (
            <Maximize2 className="size-4" aria-hidden />
          )}
        </Button>

        <header className="shrink-0 pr-10 text-center">
          <div className="flex items-center justify-center gap-2.5">
            <Sparkles className="size-5 text-primary" aria-hidden />
            <h2 className="text-xl font-semibold sm:text-2xl">
              {messages.ui.yesNo.answerIs}
            </h2>
            <Sparkles className="size-5 text-primary" aria-hidden />
          </div>
        </header>

        <div className="mt-4 flex min-h-[300px] min-w-0 flex-1 flex-col gap-4">
          <div className="relative mx-auto mt-6 w-full min-h-[300px] max-w-2xl flex-1">
            <RandomYesNoAnswerFrame
              showResult={showResult}
              isAnimating={isAnimating}
              isExpanded={isExpanded}
              display={display}
              committedAnswer={currentAnswer}
              generatedAt={generatedAt}
            />
          </div>

          <div className="mx-auto flex w-full max-w-2xl shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              type="button"
              size="lg"
              className="h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:min-w-50 sm:flex-1 disabled:bg-primary/45 disabled:text-primary-foreground disabled:opacity-100"
              disabled={isAnimating}
              aria-busy={isAnimating}
              onClick={onAsk}
            >
              {isAnimating ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Shuffle className="size-4" aria-hidden />
              )}
              {isAnimating ? messages.ui.yesNo.asking : messages.ui.yesNo.askAgain}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:ml-auto sm:w-auto",
                resultCopied &&
                  "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
              )}
              disabled={!hasResult || isAnimating}
              aria-label={
                resultCopied ? messages.ui.common.copied : messages.ui.yesNo.copyAnswer
              }
              onClick={() => {
                if (currentAnswer) {
                  void copyText(currentAnswer, RESULT_COPY_KEY);
                }
              }}
            >
              {resultCopied ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              {resultCopied ? messages.ui.common.copied : messages.ui.common.copy}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 flex-col gap-3">
          <RandomYesNoHistorySection disabled={isAnimating} />
          <div className="flex flex-col gap-2 rounded-xl bg-primary/8 px-4 py-3 text-sm ring-1 ring-border">
            <p className="flex min-w-0 items-start gap-2 text-muted-foreground">
              <Lightbulb
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <span>{messages.ui.yesNo.tip}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
