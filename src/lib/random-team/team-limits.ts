import { getCaptainCount } from "@/lib/random-team/member-input";
import type {
  RandomTeamMemberInput,
  RandomTeamSplitMode,
} from "@/types/random-team";

export type RandomTeamLimits = {
  minTeams: number;
  maxTeams: number;
  resolvedTeamCount: number;
};

export const getTeamCountBounds = (
  memberCount: number,
  captainCount: number,
  useCaptains: boolean,
): { minTeams: number; maxTeams: number } => {
  const minTeams = useCaptains ? Math.max(1, captainCount) : 1;
  const maxTeams = Math.max(minTeams, memberCount);
  return { minTeams, maxTeams };
};

export const clampTeamCount = (
  value: number,
  memberCount: number,
  captainCount: number,
  useCaptains: boolean,
): number => {
  const { minTeams, maxTeams } = getTeamCountBounds(
    memberCount,
    captainCount,
    useCaptains,
  );
  return Math.min(maxTeams, Math.max(minTeams, value));
};

export const clampTeamSize = (value: number, memberCount: number): number => {
  if (memberCount <= 0) return 1;
  return Math.min(memberCount, Math.max(1, value));
};

export const deriveTeamCountFromSize = (
  memberCount: number,
  teamSize: number,
): number => {
  if (memberCount <= 0 || teamSize <= 0) return 1;
  return Math.ceil(memberCount / teamSize);
};

export const resolveTeamLimits = ({
  members,
  splitMode,
  teamCountSetting,
  teamSizeSetting,
  useCaptains,
}: {
  members: readonly RandomTeamMemberInput[];
  splitMode: RandomTeamSplitMode;
  teamCountSetting: number;
  teamSizeSetting: number;
  useCaptains: boolean;
}): RandomTeamLimits => {
  const memberCount = members.length;
  const captainCount = getCaptainCount(members);
  const { minTeams, maxTeams } = getTeamCountBounds(
    memberCount,
    captainCount,
    useCaptains,
  );

  const resolvedTeamCount =
    splitMode === "count"
      ? clampTeamCount(
          teamCountSetting,
          memberCount,
          captainCount,
          useCaptains,
        )
      : clampTeamCount(
          deriveTeamCountFromSize(memberCount, teamSizeSetting),
          memberCount,
          captainCount,
          useCaptains,
        );

  return { minTeams, maxTeams, resolvedTeamCount };
};
