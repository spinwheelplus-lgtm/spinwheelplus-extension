import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import { RandomTeamHistoryActions } from "@/components/random-team/random-team-history-actions";
import { RandomTeamHistoryFullDialog } from "@/components/random-team/random-team-history-full-dialog";
import { RandomTeamHistoryPreview } from "@/components/random-team/random-team-history-preview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import type { RandomTeamHistoryEntry } from "@/types/random-team";
import { RANDOM_TEAM_HISTORY_PREVIEW_LIMIT } from "@/types/random-team";

type RandomTeamHistorySectionProps = {
  history: readonly RandomTeamHistoryEntry[];
  activeHistoryId: string | null;
  onSelectEntry: (id: string) => void;
  onClearHistory: () => void;
};

export const RandomTeamHistorySection = ({
  history,
  activeHistoryId,
  onSelectEntry,
  onClearHistory,
}: RandomTeamHistorySectionProps) => {
  const messages = useMessages();
  const common = messages.ui.common;
  const [fullHistoryOpen, setFullHistoryOpen] = useState(false);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(true);

  const previewHistory = useMemo(
    () => history.slice(0, RANDOM_TEAM_HISTORY_PREVIEW_LIMIT),
    [history],
  );
  const hasMoreHistory = history.length > RANDOM_TEAM_HISTORY_PREVIEW_LIMIT;

  const handleClearHistory = () => {
    onClearHistory();
    setFullHistoryOpen(false);
  };

  if (history.length === 0) return null;

  return (
    <div className="shrink-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryPanelOpen((open) => !open)}
            aria-expanded={historyPanelOpen}
            aria-controls="random-team-history-panel"
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
              {fillTemplate(messages.ui.team.recentGenerations, {
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
          <RandomTeamHistoryActions
            history={history}
            onClear={handleClearHistory}
          />
        ) : null}
      </div>
      {historyPanelOpen ? (
        <div id="random-team-history-panel">
          <RandomTeamHistoryPreview
            entries={previewHistory}
            activeHistoryId={activeHistoryId}
            onSelectEntry={onSelectEntry}
          />
        </div>
      ) : null}
      <RandomTeamHistoryFullDialog
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
