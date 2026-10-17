import { ChevronDown } from "lucide-react";
import { useMemo } from "react";

import { RandomYesNoHistoryActions } from "@/components/random-yes-no/random-yes-no-history-actions";
import { RandomYesNoHistoryPreview } from "@/components/random-yes-no/random-yes-no-history-preview";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { useRandomYesNoStore } from "@/store/random-yes-no-store";

type RandomYesNoHistorySectionProps = {
  disabled?: boolean;
};

export const RandomYesNoHistorySection = ({
  disabled = false,
}: RandomYesNoHistorySectionProps) => {
  const common = useMessages().ui.common;
  const history = useRandomYesNoStore((state) => state.random_yes_no_history);
  const currentAnswer = useRandomYesNoStore(
    (state) => state.random_yes_no_current_answer,
  );
  const generatedAt = useRandomYesNoStore(
    (state) => state.random_yes_no_current_generated_at,
  );
  const restoreEntry = useRandomYesNoStore(
    (state) => state.restoreRandomYesNoHistoryEntry,
  );
  const clearHistory = useRandomYesNoStore(
    (state) => state.clearRandomYesNoHistory,
  );
  const historyPanelOpen = useRandomYesNoStore(
    (state) => state.random_yes_no_history_panel_open,
  );
  const setHistoryPanelOpen = useRandomYesNoStore(
    (state) => state.setRandomYesNoHistoryPanelOpen,
  );

  const activeHistoryId = useMemo(() => {
    const match = history.find(
      (entry) =>
        entry.generatedAt === generatedAt && entry.answer === currentAnswer,
    );
    return match?.id ?? null;
  }, [currentAnswer, generatedAt, history]);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="shrink-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryPanelOpen(!historyPanelOpen)}
            aria-expanded={historyPanelOpen}
            aria-controls="random-yes-no-history-panel"
            aria-label={
              historyPanelOpen
                ? common.collapseHistory
                : common.expandHistory
            }
            className="flex items-center gap-2 rounded-lg py-1 text-left hover:text-primary"
          >
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                historyPanelOpen && "rotate-180",
              )}
              aria-hidden
            />
            <span className="text-sm font-semibold">
              {fillTemplate(common.recentHistory, { count: history.length })}
            </span>
          </button>
        </div>
        {historyPanelOpen ? (
          <RandomYesNoHistoryActions history={history} onClear={clearHistory} />
        ) : null}
      </div>
      {historyPanelOpen ? (
        <div id="random-yes-no-history-panel">
          <RandomYesNoHistoryPreview
            entries={history}
            activeHistoryId={activeHistoryId}
            onSelectEntry={restoreEntry}
            disabled={disabled}
          />
        </div>
      ) : null}
    </div>
  );
};
