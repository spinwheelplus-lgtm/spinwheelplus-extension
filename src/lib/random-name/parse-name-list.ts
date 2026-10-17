export const parseNameList = (input: string): string[] =>
  input
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

export const formatNameList = (names: readonly string[]): string =>
  names.join("\n");

export const removeNameAtIndex = (
  names: readonly string[],
  index: number,
): string[] => names.filter((_, itemIndex) => itemIndex !== index);

export const deduplicateNameListFirstWins = (
  names: readonly string[],
): string[] => {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const name of names) {
    const key = name.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(name);
  }

  return unique;
};

export const resolveNameListForPick = (
  input: string,
  deduplicate: boolean,
): string[] => {
  const names = parseNameList(input);
  return deduplicate ? deduplicateNameListFirstWins(names) : names;
};

export const removeFirstNameMatch = (
  names: readonly string[],
  target: string,
  ignoreCase: boolean,
): string[] => {
  const index = names.findIndex((name) =>
    ignoreCase
      ? name.toLocaleLowerCase() === target.toLocaleLowerCase()
      : name === target,
  );

  if (index < 0) return [...names];
  return removeNameAtIndex(names, index);
};
