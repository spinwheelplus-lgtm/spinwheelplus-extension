export const parseExcludeNumbers = (input: string): Set<number> => {
  const excluded = new Set<number>();
  for (const part of input.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const value = Number.parseInt(trimmed, 10);
    if (Number.isFinite(value)) {
      excluded.add(value);
    }
  }
  return excluded;
};
