import { secureRandomInt } from "@/lib/random-number/secure-random-int";
import type { RandomTeamMemberSlot } from "@/types/random-team";

export const shuffleMemberSlots = (
  slots: readonly RandomTeamMemberSlot[],
): RandomTeamMemberSlot[] => {
  if (slots.length < 2) return [...slots];

  const working = [...slots];
  for (let index = working.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(0, index);
    const current = working[index]!;
    working[index] = working[swapIndex]!;
    working[swapIndex] = current;
  }
  return working;
};
