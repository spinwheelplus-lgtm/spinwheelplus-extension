import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import { ShuffleListHistoryActions } from "@/components/shuffle-list/shuffle-list-history-actions";
import { ShuffleListHistoryFullDialog } from "@/components/shuffle-list/shuffle-list-history-full-dialog";
import { ShuffleListHistoryPreview } from "@/components/shuffle-list/shuffle-list-history-preview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import type { ShuffleListHistoryEntry } from "@/types/shuffle-list";
import { SHUFFLE_LIST_HISTORY_PREVIEW_LIMIT } from "@/types/shuffle-list";

type ShuffleListHistorySectionProps = {
  history: readonly ShuffleListHistoryEntry[];
  activeHistoryId: string | null;
  onSelectEntry: (id: string) => void;
  onClearHistory: () => void;
};

export const ShuffleListHistorySection = ({
  history,
  activeHistoryId,
  onSelectEntry,
  onClearHistory,
}: ShuffleListHistorySectionProps) => {
  const messages = useMessages();
  const common = messages.ui.common;
  const [fullHistoryOpen, setFullHistoryOpen] = useState(false);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(true);

  const previewHistory = useMemo(
    () => history.slice(0, SHUFFLE_LIST_HISTORY_PREVIEW_LIMIT),
    [history],
  );

  const hasMoreHistory = history.length > SHUFFLE_LIST_HISTORY_PREVIEW_LIMIT;

  const handleClearHistory = () => {
    onClearHistory();
    setFullHistoryOpen(false);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="shrink-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryPanelOpen((open) => !open)}
            aria-expanded={historyPanelOpen}
            aria-controls="shuffle-list-history-panel"
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
              {fillTemplate(messages.ui.shuffle.recentShuffles, {
                count: history.length,
              })}
            </span>
          </button>
          {historyPanelOpen && hasMoreHistory ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-sky-500/30 bg-sky-500/10 text-sky-800 hover:bg-sky-500/15 dark:bg-sky-500/15 dark:text-sky-300"
              onClick={() => setFullHistoryOpen(true)}
            >
              {common.showFull}
            </Button>
          ) : null}
        </div>
        {historyPanelOpen ? (
          <ShuffleListHistoryActions
            history={history}
            onClear={handleClearHistory}
          />
        ) : null}
      </div>
      {historyPanelOpen ? (
        <div id="shuffle-list-history-panel">
          <ShuffleListHistoryPreview
            entries={previewHistory}
            activeHistoryId={activeHistoryId}
            onSelectEntry={onSelectEntry}
          />
        </div>
      ) : null}
      <ShuffleListHistoryFullDialog
        open={fullHistoryOpen}
        onOpenChange={setFullHistoryOpen}
        history={history}
        activeHistoryId={activeHistoryId}
        onSelectEntry={onSelectEntry}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};
