import { createItemId } from "@/lib/random";
import { parseNameList } from "@/lib/random-name/parse-name-list";
import type { RandomTeamMemberInput } from "@/types/random-team";

export const createRandomTeamMember = (
  name: string,
  isCaptain = false,
): RandomTeamMemberInput => ({
  id: createItemId(),
  name,
  isCaptain,
});

export const parseMembersFromText = (text: string): RandomTeamMemberInput[] =>
  parseNameList(text).map((name) => createRandomTeamMember(name));

export const appendMembersFromText = (
  existing: readonly RandomTeamMemberInput[],
  text: string,
): RandomTeamMemberInput[] => [...existing, ...parseMembersFromText(text)];

export const resolveMembersForGeneration = (
  members: readonly RandomTeamMemberInput[],
  deduplicate: boolean,
): RandomTeamMemberInput[] => {
  if (!deduplicate) {
    return members.filter((member) => member.name.trim().length > 0);
  }

  const seen = new Set<string>();
  const resolved: RandomTeamMemberInput[] = [];

  for (const member of members) {
    const trimmed = member.name.trim();
    if (!trimmed) continue;
    const key = trimmed.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    resolved.push({ ...member, name: trimmed });
  }

  return resolved;
};

export const getCaptainCount = (
  members: readonly RandomTeamMemberInput[],
): number => members.filter((member) => member.isCaptain).length;
