import { secureRandomInt } from "@/lib/random-number/secure-random-int";

export const pickRandomYesNoAnswer = (pool: readonly string[]): string => {
  if (pool.length === 0) {
    throw new Error("Answer pool must not be empty.");
  }
  return pool[secureRandomInt(0, pool.length - 1)]!;
};
