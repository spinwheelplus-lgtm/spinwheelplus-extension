import {
  Check,
  Clock3,
  Copy,
  Lightbulb,
  Loader2,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelLeftClose,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";

import { RandomNumberResultDisplay } from "@/components/random-number/random-number-result-display";
import { RandomNumberResultsHistorySection } from "@/components/random-number/random-number-results-history-section";
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/cn";
import { formatRandomNumberGeneratedAt } from "@/lib/random-number/format-random-number-time";
import { getRandomNumberDisplayScale } from "@/lib/random-number/result-display-scale";
import { sliceRandomNumberDisplay } from "@/lib/random-number/slice-random-number-display";
import {
  getRandomNumberResolvedCount,
  useRandomNumberStore,
} from "@/store/random-number-store";
import { useImmersiveStore } from "@/store/immersive-store";

const COPY_ALL_KEY = "random-number-copy-all";

/** Shared results frame: below this size the page scrolls instead of clipping copy. */
const RESULTS_FRAME_MIN_CLASS = "min-h-[32rem]";

const FULLSCREEN_BACKGROUND =
  "radial-gradient(at 0% 0%, rgba(51, 105, 232, 0.3) 0px, rgba(0, 0, 0, 0) 50%), radial-gradient(at 98% 1%, rgba(213, 15, 37, 0.3) 0px, rgba(0, 0, 0, 0) 50%), var(--background)";

type RandomNumberResultsPanelProps = {
  onGenerate: () => void;
  optionsDocked: boolean;
  onToggleOptionsDock: () => void;
  isRolling: boolean;
  rollingDisplay: number[];
};

export const RandomNumberResultsPanel = ({
  onGenerate,
  optionsDocked,
  onToggleOptionsDock,
  isRolling,
  rollingDisplay,
}: RandomNumberResultsPanelProps) => {
  const messages = useMessages();
  const numberUi = messages.ui.number;
  const numbers = useRandomNumberStore(
    (state) => state.random_number_current_numbers,
  );
  const generatedAt = useRandomNumberStore(
    (state) => state.random_number_current_generated_at,
  );
  const history = useRandomNumberStore((state) => state.random_number_history);
  const activeHistoryId = useRandomNumberStore(
    (state) => state.random_number_active_history_id,
  );
  const countMode = useRandomNumberStore(
    (state) => state.random_number_count_mode,
  );
  const customCount = useRandomNumberStore(
    (state) => state.random_number_custom_count,
  );
  const clearHistory = useRandomNumberStore(
    (state) => state.clearRandomNumberHistory,
  );
  const restoreHistoryEntry = useRandomNumberStore(
    (state) => state.restoreRandomNumberHistoryEntry,
  );

  const isExpanded = useImmersiveStore((state) => state.immersive);
  const toggleImmersive = useImmersiveStore((state) => state.toggleImmersive);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { copyText, isCopied } = useCopyFeedback();
  const copyAllCopied = isCopied(COPY_ALL_KEY);

  const resolvedCount = getRandomNumberResolvedCount({
    random_number_count_mode: countMode,
    random_number_custom_count: customCount,
  });

  const hasResults = numbers.length > 0;
  const visibleNumbers = isRolling ? rollingDisplay : numbers;
  const showResultGrid = isRolling || hasResults;
  const displayCount = isRolling
    ? rollingDisplay.length
    : hasResults
      ? numbers.length
      : resolvedCount;

  const resultDisplay = useMemo(
    () => sliceRandomNumberDisplay(visibleNumbers),
    [visibleNumbers],
  );

  const displayScale = useMemo(
    () =>
      getRandomNumberDisplayScale(
        resultDisplay.visible.length || resolvedCount,
      ),
    [resultDisplay.visible.length, resolvedCount],
  );

  const optionsDockToggleLabel = optionsDocked
    ? messages.ui.common.hideOptionsPanel
    : messages.ui.common.showOptionsPanel;

  const panelFullscreenLabel = isExpanded ? messages.exitZoom : messages.zoom;

  const handleCopyAll = () => {
    if (numbers.length === 0) return;
    void copyText(numbers.join(", "), COPY_ALL_KEY);
  };

  return (
    <div className={cn("relative flex w-full flex-col", RESULTS_FRAME_MIN_CLASS, isExpanded && "h-full min-h-0")}>
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
          "relative flex flex-1 flex-col overflow-visible rounded-xl p-4 shadow-sm ring-1 ring-border",
          RESULTS_FRAME_MIN_CLASS,
          !isExpanded && "bg-card",
          isExpanded && "h-full min-h-0 overflow-y-auto rounded-none ring-0 shadow-none",
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

        <header className="shrink-0 pr-10">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold">{numberUi.heading}</h2>
              <p className="text-sm text-muted-foreground">{numberUi.resultsLead}</p>
            </div>
          </div>
        </header>

        <div className="mt-4 flex flex-1 flex-col gap-4">
          <RandomNumberResultDisplay
            showResultGrid={showResultGrid}
            isRolling={isRolling}
            prefersReducedMotion={prefersReducedMotion}
            resultDisplay={resultDisplay}
            displayScale={displayScale}
          />

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              type="button"
              size="lg"
              className="h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:min-w-50 sm:flex-1 disabled:bg-primary/45 disabled:text-primary-foreground disabled:opacity-100"
              onClick={onGenerate}
              disabled={isRolling}
              aria-busy={isRolling}
            >
              {isRolling ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <RefreshCw className="size-4" aria-hidden />
              )}
              {isRolling ? messages.ui.number.rolling : messages.ui.number.generate}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:ml-auto sm:w-auto",
                copyAllCopied &&
                  "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
              )}
              disabled={!hasResults || isRolling}
              aria-label={
                copyAllCopied ? messages.ui.common.copied : messages.ui.common.copyAll
              }
              onClick={handleCopyAll}
            >
              {copyAllCopied ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              {copyAllCopied ? messages.ui.common.copied : messages.ui.common.copyAll}
            </Button>
          </div>

          {!isRolling && generatedAt ? (
            <p className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="size-4 shrink-0" aria-hidden />
              {fillTemplate(numberUi.generatedOn, {
                time: formatRandomNumberGeneratedAt(generatedAt),
              })}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex shrink-0 flex-col gap-3">
          <RandomNumberResultsHistorySection
            history={history}
            activeHistoryId={activeHistoryId}
            onSelectEntry={restoreHistoryEntry}
            onClearHistory={clearHistory}
          />

          <div className="flex flex-col gap-2 rounded-xl bg-primary/8 px-4 py-3 text-sm ring-1 ring-border sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="flex min-w-0 items-start gap-2 text-muted-foreground">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>{numberUi.tip}</span>
            </p>
            <p className="shrink-0 font-medium whitespace-nowrap text-foreground">
              {fillTemplate(numberUi.countLine, { count: displayCount })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
