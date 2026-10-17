import { fillTemplate } from "@/lib/i18n/locale";
import { readMessages } from "@/lib/i18n/use-messages";
import { createItemId } from "@/lib/random";
import { secureRandomInt } from "@/lib/random-number/secure-random-int";
import { buildDefaultTeamName } from "@/lib/random-team/default-team-names";
import {
  getCaptainCount,
  resolveMembersForGeneration,
} from "@/lib/random-team/member-input";
import { resolveGenerationTeamCount } from "@/lib/random-team/resolve-generation-team-count";
import { shuffleMemberSlots } from "@/lib/random-team/shuffle-member-slots";
import { clampTeamSize, getTeamCountBounds } from "@/lib/random-team/team-limits";
import type {
  RandomTeamGroup,
  RandomTeamMemberInput,
  RandomTeamMemberSlot,
  RandomTeamSplitMode,
} from "@/types/random-team";

export type GenerateRandomTeamsOptions = {
  splitMode: RandomTeamSplitMode;
  teamCountSetting: number;
  teamSizeSetting: number;
  balanced: boolean;
  shuffleBeforeSplit: boolean;
  useCaptains: boolean;
  allowDifferentSizes: boolean;
  deduplicate: boolean;
};

export type GenerateRandomTeamsInput = {
  members: readonly RandomTeamMemberInput[];
} & GenerateRandomTeamsOptions;

const toMemberSlot = (member: RandomTeamMemberInput): RandomTeamMemberSlot => ({
  id: member.id,
  name: member.name,
  isCaptain: member.isCaptain,
});

const pickTeamsWithFewestMembers = (teams: RandomTeamGroup[]): number => {
  let targetIndex = 0;
  let minSize = teams[0]?.members.length ?? 0;

  for (let index = 1; index < teams.length; index += 1) {
    const size = teams[index]!.members.length;
    if (size < minSize) {
      minSize = size;
      targetIndex = index;
    }
  }

  return targetIndex;
};

const assignMembersBalanced = (
  teams: RandomTeamGroup[],
  pool: RandomTeamMemberSlot[],
): void => {
  for (const member of pool) {
    const targetIndex = pickTeamsWithFewestMembers(teams);
    teams[targetIndex]!.members.push(member);
  }
};

const assignMembersRoundRobin = (
  teams: RandomTeamGroup[],
  pool: RandomTeamMemberSlot[],
): void => {
  pool.forEach((member, index) => {
    teams[index % teams.length]!.members.push(member);
  });
};

export const validateRandomTeamGeneration = (
  input: GenerateRandomTeamsInput,
): string | null => {
  const members = resolveMembersForGeneration(input.members, input.deduplicate);

  if (members.length === 0) {
    return readMessages().ui.team.addName;
  }

  const captainCount = getCaptainCount(members);
  const useCaptains = input.useCaptains && captainCount > 0;
  const { minTeams, maxTeams } = getTeamCountBounds(
    members.length,
    captainCount,
    useCaptains,
  );

  const teamCount = resolveGenerationTeamCount({
    members,
    splitMode: input.splitMode,
    teamCountSetting: input.teamCountSetting,
    teamSizeSetting: input.teamSizeSetting,
    useCaptains: input.useCaptains,
  });

  if (teamCount < minTeams) {
    return `You need at least ${minTeams} team${minTeams === 1 ? "" : "s"} for ${captainCount} captain${captainCount === 1 ? "" : "s"}.`;
  }

  if (teamCount > maxTeams) {
    return fillTemplate(readMessages().ui.team.tooManyTeams, {
      teams: teamCount,
      members: members.length,
    });
  }

  if (input.splitMode === "size") {
    const size = clampTeamSize(input.teamSizeSetting, members.length);
    if (size > members.length) {
      return readMessages().ui.team.sizeTooBig;
    }
  }

  return null;
};

export const generateRandomTeams = (
  input: GenerateRandomTeamsInput,
): RandomTeamGroup[] => {
  const error = validateRandomTeamGeneration(input);
  if (error) {
    throw new Error(error);
  }

  const members = resolveMembersForGeneration(input.members, input.deduplicate);
  const useCaptains = input.useCaptains && getCaptainCount(members) > 0;

  const teamCount = resolveGenerationTeamCount({
    members,
    splitMode: input.splitMode,
    teamCountSetting: input.teamCountSetting,
    teamSizeSetting: input.teamSizeSetting,
    useCaptains: input.useCaptains,
  });

  const captains = useCaptains
    ? members.filter((member) => member.isCaptain).map(toMemberSlot)
    : [];

  const nonCaptainSlots = useCaptains
    ? members.filter((member) => !member.isCaptain).map(toMemberSlot)
    : members.map(toMemberSlot);

  const pool = input.shuffleBeforeSplit
    ? shuffleMemberSlots(nonCaptainSlots)
    : [...nonCaptainSlots];

  const teams: RandomTeamGroup[] = Array.from({ length: teamCount }, (_, index) => ({
    id: createItemId(),
    name: buildDefaultTeamName(index),
    colorIndex: index,
    members: [],
  }));

  if (useCaptains && captains.length > 0) {
    const teamIndices = Array.from({ length: teamCount }, (_, index) => index);
    for (let index = teamIndices.length - 1; index > 0; index -= 1) {
      const swapIndex = secureRandomInt(0, index);
      const current = teamIndices[index]!;
      teamIndices[index] = teamIndices[swapIndex]!;
      teamIndices[swapIndex] = current;
    }

    captains.forEach((captain, index) => {
      teams[teamIndices[index]!]!.members.push(captain);
    });
  }

  if (input.balanced || !input.allowDifferentSizes) {
    assignMembersBalanced(teams, pool);
  } else {
    assignMembersRoundRobin(teams, pool);
  }

  return teams;
};
