import { formatRandomNameGeneratedAt } from "@/lib/random-name/format-random-name-time";
import type { RandomTeamGroup, RandomTeamHistoryEntry } from "@/types/random-team";

export const formatTeamsPlainText = (teams: readonly RandomTeamGroup[]): string =>
  teams
    .map((team) => {
      const memberLines = team.members
        .map((member, index) => {
          const prefix = member.isCaptain
            ? `${index + 1}. ${member.name} (Captain)`
            : `${index + 1}. ${member.name}`;
          return prefix;
        })
        .join("\n");
      return `${team.name}\n${memberLines}`;
    })
    .join("\n\n");

export const downloadTeamsText = (teams: readonly RandomTeamGroup[]): void => {
  if (teams.length === 0) return;
  const blob = new Blob([formatTeamsPlainText(teams)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "teams.txt";
  anchor.click();
  URL.revokeObjectURL(url);
};

export const formatRandomTeamHistoryExport = (
  entries: readonly RandomTeamHistoryEntry[],
): string =>
  entries
    .map((entry) => {
      const stamp = formatRandomNameGeneratedAt(entry.generatedAt);
      return `${stamp} (${entry.teamCount} teams, ${entry.memberCount} members)\n${formatTeamsPlainText(entry.teams)}`;
    })
    .join("\n\n");

export const downloadRandomTeamHistory = (
  entries: readonly RandomTeamHistoryEntry[],
): void => {
  if (entries.length === 0) return;
  const blob = new Blob([formatRandomTeamHistoryExport(entries)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "random-team-history.txt";
  anchor.click();
  URL.revokeObjectURL(url);
};
