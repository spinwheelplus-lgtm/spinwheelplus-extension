import type { RandomTeamGroup } from "@/types/random-team";

export const cloneRandomTeamGroups = (
  teams: readonly RandomTeamGroup[],
): RandomTeamGroup[] =>
  teams.map((team) => ({
    ...team,
    members: team.members.map((member) => ({ ...member })),
  }));
