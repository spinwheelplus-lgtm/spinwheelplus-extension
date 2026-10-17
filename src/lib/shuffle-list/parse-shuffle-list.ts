import { deduplicateNameListFirstWins } from "@/lib/random-name/parse-name-list";

export const parseShuffleListLines = (
  input: string,
  ignoreEmptyLines: boolean,
): string[] => {
  const lines = input.split(/\r?\n/u);
  if (ignoreEmptyLines) {
    return lines.map((line) => line.trim()).filter((line) => line.length > 0);
  }
  return lines;
};

export type PrepareShuffleListOptions = {
  ignoreEmptyLines: boolean;
  removeDuplicates: boolean;
};

export const prepareShuffleListItems = (
  input: string,
  options: PrepareShuffleListOptions,
): string[] => {
  const lines = parseShuffleListLines(input, options.ignoreEmptyLines);
  return options.removeDuplicates
    ? deduplicateNameListFirstWins(lines)
    : lines;
};