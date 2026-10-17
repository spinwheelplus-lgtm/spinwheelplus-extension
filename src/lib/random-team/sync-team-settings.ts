import { getCaptainCount } from "@/lib/random-team/member-input";
import { clampTeamCount, clampTeamSize } from "@/lib/random-team/team-limits";
import type { RandomTeamMemberInput } from "@/types/random-team";

type TeamSettingsSlice = {
  random_team_team_count: number;
  random_team_team_size: number;
  random_team_use_captains: boolean;
};

export const syncTeamSettingsForMembers = (
  settings: TeamSettingsSlice,
  resolvedMembers: readonly RandomTeamMemberInput[],
): TeamSettingsSlice => {
  const memberCount = resolvedMembers.length;
  const captainCount = getCaptainCount(resolvedMembers);

  return {
    random_team_team_count: clampTeamCount(
      settings.random_team_team_count,
      memberCount,
      captainCount,
      settings.random_team_use_captains,
    ),
    random_team_team_size: clampTeamSize(
      settings.random_team_team_size,
      memberCount,
    ),
    random_team_use_captains: settings.random_team_use_captains,
  };
};
