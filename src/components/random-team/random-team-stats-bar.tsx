import { useMessages } from "@/lib/i18n/use-messages";
import { computeRandomTeamStats } from "@/lib/random-team/compute-team-stats";
import type { RandomTeamGroup } from "@/types/random-team";

type RandomTeamStatsBarProps = {
  teams: readonly RandomTeamGroup[];
  balanced: boolean;
};

export const RandomTeamStatsBar = ({
  teams,
  balanced,
}: RandomTeamStatsBarProps) => {
  const teamUi = useMessages().ui.team;
  const stats = computeRandomTeamStats(teams, balanced);
  const distribution =
    stats.distributionLabel === "Balanced"
      ? teamUi.distBalanced
      : stats.distributionLabel === "Mixed"
        ? teamUi.distMixed
        : stats.distributionLabel === "Custom"
          ? teamUi.distCustom
          : stats.distributionLabel;

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-background p-3 sm:grid-cols-4">
      <Stat label={teamUi.totalMembers} value={String(stats.totalMembers)} />
      <Stat label={teamUi.totalTeams} value={String(stats.totalTeams)} />
      <Stat label={teamUi.avgSize} value={String(stats.averageTeamSize)} />
      <Stat label={teamUi.distribution} value={distribution} />
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
  </div>
);
