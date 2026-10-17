import {
  Check,
  Copy,
  Download,
  Lightbulb,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelLeftClose,
  Shuffle,
} from "lucide-react";
import { toast } from "sonner";

import { ShuffleListHistorySection } from "@/components/shuffle-list/shuffle-list-history-section";
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { downloadShuffleListText } from "@/lib/shuffle-list/export-shuffle-list";
import { formatRandomNameGeneratedAt } from "@/lib/random-name/format-random-name-time";
import {
  getShuffleListPreparedCount,
  useShuffleListStore,
} from "@/store/shuffle-list-store";
import { useImmersiveStore } from "@/store/immersive-store";

const COPY_RESULT_KEY = "shuffle-list-result";

const RESULTS_FRAME_MIN_CLASS = "min-h-[32rem]";

const FULLSCREEN_BACKGROUND =
  "radial-gradient(at 0% 0%, rgba(51, 105, 232, 0.3) 0px, rgba(0, 0, 0, 0) 50%), radial-gradient(at 98% 1%, rgba(213, 15, 37, 0.3) 0px, rgba(0, 0, 0, 0) 50%), var(--background)";

type ShuffleListResultsPanelProps = {
  onShuffle: () => void;
  optionsDocked: boolean;
  onToggleOptionsDock: () => void;
};

export const ShuffleListResultsPanel = ({
  onShuffle,
  optionsDocked,
  onToggleOptionsDock,
}: ShuffleListResultsPanelProps) => {
  const messages = useMessages();
  const shuffleUi = messages.ui.shuffle;
  const common = messages.ui.common;
  const listInput = useShuffleListStore((state) => state.shuffle_list_input);
  const ignoreEmptyLines = useShuffleListStore(
    (state) => state.shuffle_list_ignore_empty_lines,
  );
  const removeDuplicates = useShuffleListStore(
    (state) => state.shuffle_list_remove_duplicates,
  );
  const currentItems = useShuffleListStore(
    (state) => state.shuffle_list_current_items,
  );
  const shuffledAt = useShuffleListStore(
    (state) => state.shuffle_list_current_shuffled_at,
  );
  const history = useShuffleListStore((state) => state.shuffle_list_history);
  const activeHistoryId = useShuffleListStore(
    (state) => state.shuffle_list_active_history_id,
  );
  const clearHistory = useShuffleListStore(
    (state) => state.clearShuffleListHistory,
  );
  const restoreHistoryEntry = useShuffleListStore(
    (state) => state.restoreShuffleListHistoryEntry,
  );

  const isExpanded = useImmersiveStore((state) => state.immersive);
  const toggleImmersive = useImmersiveStore((state) => state.toggleImmersive);
  const { copyText, isCopied } = useCopyFeedback();
  const resultCopied = isCopied(COPY_RESULT_KEY);

  const preparedCount = getShuffleListPreparedCount({
    shuffle_list_input: listInput,
    shuffle_list_ignore_empty_lines: ignoreEmptyLines,
    shuffle_list_remove_duplicates: removeDuplicates,
  });
  const hasResult = currentItems.length > 0;
  const canShuffle = preparedCount > 0;

  const optionsDockToggleLabel = optionsDocked
    ? common.hideListPanel
    : common.showListPanel;

  const panelFullscreenLabel = isExpanded ? messages.exitZoom : messages.zoom;

  const handleCopy = () => {
    if (!hasResult) return;
    void copyText(currentItems.join("\n"), COPY_RESULT_KEY);
  };

  const handleDownload = () => {
    if (!hasResult) return;
    downloadShuffleListText(currentItems);
    toast.success(common.downloadStarted);
  };

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

        <header className="shrink-0 pr-10">
          <h2 className="text-xl font-semibold sm:text-2xl">{shuffleUi.result}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{shuffleUi.subtitle}</p>
        </header>

        <div className="mt-4 flex min-h-[300px] min-w-0 flex-1 flex-col gap-4">
          {hasResult ? (
            <ol
              className="min-h-[300px] flex-1 space-y-0 overflow-y-auto rounded-xl border border-border bg-background shadow-sm"
              aria-label={shuffleUi.resultAria}
            >
              {currentItems.map((item, index) => (
                <li
                  key={`${index}-${item}`}
                  className={cn(
                    "flex gap-3 px-4 py-3 text-sm",
                    index % 2 === 1 && "bg-primary/5",
                  )}
                >
                  <span className="w-6 shrink-0 font-semibold tabular-nums text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span className="min-w-0 flex-1 break-words">
                    {item.length > 0 ? item : " "}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/60 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Shuffle your list to see the new order here.
              </p>
            </div>
          )}

          {shuffledAt ? (
            <p className="shrink-0 text-xs text-muted-foreground">
              {fillTemplate(shuffleUi.shuffledOn, {
                time: formatRandomNameGeneratedAt(shuffledAt),
              })}
            </p>
          ) : null}

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              type="button"
              size="lg"
              className="h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:min-w-50 sm:flex-1"
              onClick={onShuffle}
              disabled={!canShuffle}
            >
              <Shuffle className="size-4" aria-hidden />
              {shuffleUi.shuffleNow}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:w-auto",
                resultCopied &&
                  "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
              )}
              disabled={!hasResult}
              aria-label={
                resultCopied ? common.copied : common.copy
              }
              onClick={handleCopy}
            >
              {resultCopied ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              {resultCopied ? common.copied : common.copy}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:w-auto"
              disabled={!hasResult}
              onClick={handleDownload}
            >
              <Download className="size-4" aria-hidden />
              {common.downloadTxt}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 flex-col gap-3">
          <ShuffleListHistorySection
            history={history}
            activeHistoryId={activeHistoryId}
            onSelectEntry={restoreHistoryEntry}
            onClearHistory={clearHistory}
          />

          <div className="flex flex-col gap-2 rounded-xl bg-primary/8 px-4 py-3 text-sm ring-1 ring-border">
            <p className="flex min-w-0 items-start gap-2 text-muted-foreground">
              <Lightbulb
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <span>{shuffleUi.tip}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
