import {
  Check,
  Copy,
  Download,
  History,
  Lightbulb,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelLeftClose,
  RefreshCw,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { RandomTeamCaptainBanner } from "@/components/random-team/random-team-captain-banner";
import { RandomTeamHistorySection } from "@/components/random-team/random-team-history-section";
import { RandomTeamStatsBar } from "@/components/random-team/random-team-stats-bar";
import { RandomTeamTeamCard } from "@/components/random-team/random-team-team-card";
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { formatRandomNameGeneratedAt } from "@/lib/random-name/format-random-name-time";
import {
  downloadTeamsText,
  formatTeamsPlainText,
} from "@/lib/random-team/export-teams";
import { useImmersiveStore } from "@/store/immersive-store";
import { useRandomTeamStore } from "@/store/random-team-store";

const COPY_ALL_KEY = "random-team-copy-all";
const RESULTS_FRAME_MIN_CLASS = "min-h-[32rem]";
const FULLSCREEN_BACKGROUND =
  "radial-gradient(at 0% 0%, rgba(51, 105, 232, 0.3) 0px, rgba(0, 0, 0, 0) 50%), radial-gradient(at 98% 1%, rgba(213, 15, 37, 0.3) 0px, rgba(0, 0, 0, 0) 50%), var(--background)";

type RandomTeamResultsPanelProps = {
  onGenerate: () => void;
  onRegenerate: () => void;
  optionsDocked: boolean;
  onToggleOptionsDock: () => void;
};

export const RandomTeamResultsPanel = ({
  onGenerate,
  onRegenerate,
  optionsDocked,
  onToggleOptionsDock,
}: RandomTeamResultsPanelProps) => {
  const messages = useMessages();
  const teamUi = messages.ui.team;
  const common = messages.ui.common;
  const teams = useRandomTeamStore((state) => state.random_team_teams);
  const generatedAt = useRandomTeamStore(
    (state) => state.random_team_generated_at,
  );
  const balanced = useRandomTeamStore((state) => state.random_team_balanced);
  const history = useRandomTeamStore((state) => state.random_team_history);
  const activeHistoryId = useRandomTeamStore(
    (state) => state.random_team_active_history_id,
  );
  const clearCaptains = useRandomTeamStore(
    (state) => state.clearRandomTeamCaptains,
  );
  const clearResults = useRandomTeamStore(
    (state) => state.clearRandomTeamResults,
  );
  const applyRandomTeamNames = useRandomTeamStore(
    (state) => state.applyRandomTeamNames,
  );
  const setTeamName = useRandomTeamStore((state) => state.setRandomTeamName);
  const moveMember = useRandomTeamStore((state) => state.moveRandomTeamMember);
  const restoreHistoryEntry = useRandomTeamStore(
    (state) => state.restoreRandomTeamHistoryEntry,
  );
  const clearHistory = useRandomTeamStore(
    (state) => state.clearRandomTeamHistory,
  );

  const isExpanded = useImmersiveStore((state) => state.immersive);
  const toggleImmersive = useImmersiveStore((state) => state.toggleImmersive);
  const { copyText, isCopied } = useCopyFeedback();
  const copyAllCopied = isCopied(COPY_ALL_KEY);
  const hasTeams = teams.length > 0;

  const optionsDockToggleLabel = optionsDocked
    ? common.hideNamesPanel
    : common.showNamesPanel;
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

        <header className="shrink-0 pr-10">
          <h2 className="text-xl font-semibold sm:text-2xl">{teamUi.heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {teamUi.appearHere}
          </p>
        </header>

        <div className="mt-4 flex min-h-[300px] min-w-0 flex-1 flex-col gap-4">
          {hasTeams ? (
            <>
              <RandomTeamCaptainBanner
                teams={teams}
                onClearCaptains={() => {
                  clearCaptains();
                  toast.success(teamUi.captainsCleared);
                }}
              />
              <div
                className="grid min-h-[300px] flex-1 gap-3 overflow-y-auto sm:grid-cols-2"
                aria-label={teamUi.generatedTeams}
              >
                {teams.map((team) => (
                  <RandomTeamTeamCard
                    key={team.id}
                    team={team}
                    teams={teams}
                    onRename={(name) => setTeamName(team.id, name)}
                    onMoveMember={moveMember}
                  />
                ))}
              </div>
              <RandomTeamStatsBar teams={teams} balanced={balanced} />
              {generatedAt ? (
                <p className="shrink-0 text-xs text-muted-foreground">
                  {fillTemplate(teamUi.generatedOn, {
                    time: formatRandomNameGeneratedAt(generatedAt),
                  })}
                </p>
              ) : null}
            </>
          ) : (
            <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/60 px-6 py-12 text-center">
              <History
                className="mb-3 size-8 text-muted-foreground/60"
                aria-hidden
              />
              <p className="text-sm text-muted-foreground">
                {teamUi.emptyHint}
              </p>
            </div>
          )}

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              type="button"
              size="lg"
              className="h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:min-w-50 sm:flex-1"
              onClick={onGenerate}
            >
              <Sparkles className="size-4" aria-hidden />
              {teamUi.generate}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:w-auto"
              disabled={!hasTeams}
              onClick={onRegenerate}
            >
              <RefreshCw className="size-4" aria-hidden />
              {common.regenerate}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:w-auto",
                copyAllCopied &&
                  "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
              )}
              disabled={!hasTeams}
              aria-label={copyAllCopied ? common.copied : common.copyAll}
              onClick={() => {
                if (!hasTeams) return;
                void copyText(formatTeamsPlainText(teams), COPY_ALL_KEY);
              }}
            >
              {copyAllCopied ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              {copyAllCopied ? common.copied : common.copyAll}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:w-auto"
              disabled={!hasTeams}
              onClick={() => {
                applyRandomTeamNames();
                toast.success(teamUi.namesUpdated);
              }}
            >
              <Wand2 className="size-4" aria-hidden />
              {common.randomNames}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full shrink-0 gap-2 whitespace-nowrap text-base sm:w-auto"
              disabled={!hasTeams}
              onClick={() => {
                downloadTeamsText(teams);
                toast.success(common.downloadStarted);
              }}
            >
              <Download className="size-4" aria-hidden />
              {common.downloadTxt}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full shrink-0 gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              disabled={!hasTeams}
              onClick={clearResults}
            >
              <Trash2 className="size-4" aria-hidden />
              {common.clearAll}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 flex-col gap-3">
          <RandomTeamHistorySection
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
              <span>{teamUi.tip}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
