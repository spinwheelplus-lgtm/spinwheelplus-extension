import { secureRandomInt } from "@/lib/random-number/secure-random-int";

export const RANDOM_NAME_ROLL_DURATION_MS = 2500;
export const RANDOM_NAME_ROLL_TICK_MS = 70;

export const pickRandomNameRollFrame = (pool: readonly string[]): string => {
  if (pool.length === 0) return "";
  const index = secureRandomInt(0, pool.length - 1);
  return pool[index] ?? "";
};
