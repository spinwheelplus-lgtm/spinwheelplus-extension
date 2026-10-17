import {
  deduplicateNameListFirstWins,
  parseNameList,
  resolveNameListForPick,
} from "@/lib/random-name/parse-name-list";
import { pickRandomName } from "@/lib/random-name/pick-random-name";

export type RandomNameDrawResult =
  | {
      ok: true;
      name: string;
      index: number;
      pool: string[];
    }
  | { ok: false; error: string };

export const computeRandomNameDraw = (
  namesInput: string,
  deduplicate: boolean,
): RandomNameDrawResult => {
  const names = resolveNameListForPick(namesInput, deduplicate);
  return pickRandomName(names);
};

export const getRandomNamePickPoolSize = (
  namesInput: string,
  deduplicate: boolean,
): number => resolveNameListForPick(namesInput, deduplicate).length;

export const getRandomNameRawLineCount = (namesInput: string): number =>
  parseNameList(namesInput).length;

export const getRandomNameDuplicateLineCount = (namesInput: string): number => {
  const raw = parseNameList(namesInput);
  const unique = deduplicateNameListFirstWins(raw);
  return Math.max(0, raw.length - unique.length);
};
