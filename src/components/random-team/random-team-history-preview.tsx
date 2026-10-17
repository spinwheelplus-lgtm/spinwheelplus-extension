import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { formatRandomNameRelativeTime } from "@/lib/random-name/format-random-name-time";
import { localizeDefaultTeamName } from "@/lib/random-team/default-team-names";
import { formatTeamsPlainText } from "@/lib/random-team/export-teams";
import type { RandomTeamHistoryEntry } from "@/types/random-team";

type RandomTeamHistoryPreviewProps = {
  entries: readonly RandomTeamHistoryEntry[];
  activeHistoryId: string | null;
  onSelectEntry: (id: string) => void;
};

export const RandomTeamHistoryPreview = ({
  entries,
  activeHistoryId,
  onSelectEntry,
}: RandomTeamHistoryPreviewProps) => {
  const { copyText, isCopied } = useCopyFeedback();
  const { common, team: teamUi } = useMessages().ui;

  return (
    <div
      className="overflow-x-auto pb-1"
      role="region"
      aria-label={teamUi.recent}
    >
      <div className="flex w-max min-w-0 gap-3">
        {entries.map((entry) => {
          const isActive = entry.id === activeHistoryId;
          const entryCopied = isCopied(entry.id);
          const preview = entry.teams
            .map((team) => localizeDefaultTeamName(team.name, teamUi.defaultName))
            .join(", ");
          return (
            <div
              key={entry.id}
              className={cn(
                "flex w-56 shrink-0 flex-col rounded-xl border border-border bg-card p-3",
                isActive && "border-primary ring-2 ring-primary/20",
              )}
            >
              <button
                type="button"
                onClick={() => onSelectEntry(entry.id)}
                aria-label={fillTemplate(teamUi.restoreTeams, {
                  count: entry.teamCount,
                })}
                aria-current={isActive ? "true" : undefined}
                className="min-w-0 flex-1 text-left"
              >
                <p className="text-sm font-medium text-foreground">
                  {fillTemplate(teamUi.countTeams, { count: entry.teamCount })}
                </p>
                <p
                  className="mt-1 line-clamp-3 text-xs text-muted-foreground"
                  title={preview}
                >
                  {preview}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatRandomNameRelativeTime(entry.generatedAt)}
                </p>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "mt-2 h-8 self-end px-2",
                  entryCopied && "text-emerald-700 dark:text-emerald-400",
                )}
                aria-label={entryCopied ? common.copied : common.copy}
                onClick={() =>
                  void copyText(formatTeamsPlainText(entry.teams), entry.id)
                }
              >
                {entryCopied ? (
                  <Check className="size-3.5" aria-hidden />
                ) : (
                  <Copy className="size-3.5" aria-hidden />
                )}
                {entryCopied ? common.copied : common.copy}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
