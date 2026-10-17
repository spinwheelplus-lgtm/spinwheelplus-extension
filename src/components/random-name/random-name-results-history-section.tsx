import { ChevronDown } from "lucide-react";

import { RandomNameHistoryActions } from "@/components/random-name/random-name-history-actions";
import { RandomNameHistoryPreview } from "@/components/random-name/random-name-history-preview";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { useRandomNameStore } from "@/store/random-name-store";
import type { RandomNameHistoryEntry } from "@/types/random-name";

type RandomNameResultsHistorySectionProps = {
  history: readonly RandomNameHistoryEntry[];
  activeHistoryId: string | null;
  onSelectEntry: (id: string) => void;
  onClearHistory: () => void;
};

export const RandomNameResultsHistorySection = ({
  history,
  activeHistoryId,
  onSelectEntry,
  onClearHistory,
}: RandomNameResultsHistorySectionProps) => {
  const common = useMessages().ui.common;
  const historyPanelOpen = useRandomNameStore(
    (state) => state.random_name_history_panel_open,
  );
  const setHistoryPanelOpen = useRandomNameStore(
    (state) => state.setRandomNameHistoryPanelOpen,
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
            aria-controls="random-name-history-panel"
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
          <RandomNameHistoryActions history={history} onClear={onClearHistory} />
        ) : null}
      </div>
      {historyPanelOpen ? (
        <div id="random-name-history-panel">
          <RandomNameHistoryPreview
            entries={history}
            activeHistoryId={activeHistoryId}
            onSelectEntry={onSelectEntry}
          />
        </div>
      ) : null}
    </div>
  );
};
