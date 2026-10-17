import { secureRandomInt } from "@/lib/random-number/secure-random-int";

export const RANDOM_NUMBER_ROLL_DURATION_MS = 2500;

export const RANDOM_NUMBER_ROLL_TICK_MS = 70;

export const pickRandomNumberRollFrame = (
  count: number,
  pool: readonly number[],
): number[] => {
  if (count < 1 || pool.length === 0) {
    return [];
  }

  return Array.from({ length: count }, () => {
    const index = secureRandomInt(0, pool.length - 1);
    return pool[index]!;
  });
};
