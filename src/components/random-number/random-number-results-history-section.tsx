import { ChevronDown } from "lucide-react";

import { RandomNumberHistoryActions } from "@/components/random-number/random-number-history-actions";
import { RandomNumberHistoryPreview } from "@/components/random-number/random-number-history-preview";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { useRandomNumberStore } from "@/store/random-number-store";
import type { RandomNumberHistoryEntry } from "@/types/random-number";

type RandomNumberResultsHistorySectionProps = {
  history: readonly RandomNumberHistoryEntry[];
  activeHistoryId: string | null;
  onSelectEntry: (id: string) => void;
  onClearHistory: () => void;
};

export const RandomNumberResultsHistorySection = ({
  history,
  activeHistoryId,
  onSelectEntry,
  onClearHistory,
}: RandomNumberResultsHistorySectionProps) => {
  const common = useMessages().ui.common;
  const historyPanelOpen = useRandomNumberStore(
    (state) => state.random_number_history_panel_open,
  );
  const setHistoryPanelOpen = useRandomNumberStore(
    (state) => state.setRandomNumberHistoryPanelOpen,
  );

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
            aria-controls="random-number-history-panel"
            aria-label={
              historyPanelOpen ? common.collapseHistory : common.expandHistory
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
          <RandomNumberHistoryActions history={history} onClear={onClearHistory} />
        ) : null}
      </div>
      {historyPanelOpen ? (
        <div id="random-number-history-panel">
          <RandomNumberHistoryPreview
            entries={history}
            activeHistoryId={activeHistoryId}
            onSelectEntry={onSelectEntry}
          />
        </div>
      ) : null}
    </div>
  );
};
