import { readMessages } from "@/lib/i18n/use-messages";
import {
  buildRandomNumberPool,
  generateRandomNumbers,
} from "@/lib/random-number/generate-random-numbers";
import { parseExcludeNumbers } from "@/lib/random-number/parse-exclude-numbers";

export type RandomNumberDrawParams = {
  min: number;
  max: number;
  excludeInput: string;
  count: number;
  allowDuplicates: boolean;
};

export type RandomNumberDrawSuccess = {
  ok: true;
  numbers: number[];
  pool: number[];
};

export type RandomNumberDrawFailure = {
  ok: false;
  error: string;
};

export type RandomNumberDrawResult =
  | RandomNumberDrawSuccess
  | RandomNumberDrawFailure;

export const computeRandomNumberDraw = (
  params: RandomNumberDrawParams,
): RandomNumberDrawResult => {
  const excluded = parseExcludeNumbers(params.excludeInput);

  try {
    const numbers = generateRandomNumbers({
      min: params.min,
      max: params.max,
      excluded,
      count: params.count,
      allowDuplicates: params.allowDuplicates,
    });
    const pool = buildRandomNumberPool(params.min, params.max, excluded);

    if (pool.length === 0) {
      return {
        ok: false,
        error: readMessages().ui.number.noneInRange,
      };
    }

    return { ok: true, numbers, pool };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : readMessages().ui.number.couldNotGenerate,
    };
  }
};
