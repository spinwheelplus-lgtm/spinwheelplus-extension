import { secureRandomInt } from "@/lib/random-number/secure-random-int";

export const shuffleNames = (names: readonly string[]): string[] => {
  const working = [...names];
  for (let index = working.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(0, index);
    const current = working[index]!;
    working[index] = working[swapIndex]!;
    working[swapIndex] = current;
  }
  return working;
};
