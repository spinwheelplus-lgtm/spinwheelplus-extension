import { fillTemplate } from "@/lib/i18n/locale";
import { readMessages } from "@/lib/i18n/use-messages";
import { secureRandomInt } from "@/lib/random-number/secure-random-int";

export type GenerateRandomNumbersInput = {
  min: number;
  max: number;
  excluded: ReadonlySet<number>;
  count: number;
  allowDuplicates: boolean;
};

export const buildRandomNumberPool = (
  min: number,
  max: number,
  excluded: ReadonlySet<number>,
): number[] => {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  const pool: number[] = [];
  for (let value = low; value <= high; value += 1) {
    if (!excluded.has(value)) {
      pool.push(value);
    }
  }
  return pool;
};

export const generateRandomNumbers = ({
  min,
  max,
  excluded,
  count,
  allowDuplicates,
}: GenerateRandomNumbersInput): number[] => {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(readMessages().ui.number.countAtLeast);
  }

  const pool = buildRandomNumberPool(min, max, excluded);
  if (pool.length === 0) {
    throw new Error(readMessages().ui.number.noneInRange);
  }

  if (!allowDuplicates && count > pool.length) {
    throw new Error(fillTemplate(readMessages().ui.number.uniqueLeft, { count: pool.length }));
  }

  const result: number[] = [];

  if (allowDuplicates) {
    for (let index = 0; index < count; index += 1) {
      const pickIndex = secureRandomInt(0, pool.length - 1);
      result.push(pool[pickIndex] ?? pool[0]!);
    }
    return result;
  }

  const workingPool = [...pool];
  for (let index = 0; index < count; index += 1) {
    const pickIndex = secureRandomInt(index, workingPool.length - 1);
    const picked = workingPool[pickIndex]!;
    workingPool[pickIndex] = workingPool[index]!;
    workingPool[index] = picked;
    result.push(picked);
  }

  return result;
};
