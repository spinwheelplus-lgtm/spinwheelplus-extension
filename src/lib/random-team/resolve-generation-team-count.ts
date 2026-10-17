import { getCaptainCount } from "@/lib/random-team/member-input";
import {
  clampTeamCount,
  clampTeamSize,
  deriveTeamCountFromSize,
} from "@/lib/random-team/team-limits";
import type {
  RandomTeamMemberInput,
  RandomTeamSplitMode,
} from "@/types/random-team";

type ResolveGenerationTeamCountInput = {
  members: readonly RandomTeamMemberInput[];
  splitMode: RandomTeamSplitMode;
  teamCountSetting: number;
  teamSizeSetting: number;
  useCaptains: boolean;
};

export const resolveGenerationTeamCount = ({
  members,
  splitMode,
  teamCountSetting,
  teamSizeSetting,
  useCaptains,
}: ResolveGenerationTeamCountInput): number => {
  const captainCount = getCaptainCount(members);
  const effectiveUseCaptains = useCaptains && captainCount > 0;

  if (splitMode === "count") {
    return clampTeamCount(
      teamCountSetting,
      members.length,
      captainCount,
      effectiveUseCaptains,
    );
  }

  return clampTeamCount(
    deriveTeamCountFromSize(
      members.length,
      clampTeamSize(teamSizeSetting, members.length),
    ),
    members.length,
    captainCount,
    effectiveUseCaptains,
  );
};
