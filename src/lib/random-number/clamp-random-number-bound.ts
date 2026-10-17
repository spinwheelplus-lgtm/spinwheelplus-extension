export const RANDOM_NUMBER_BOUND_MIN = -1_000_000;
export const RANDOM_NUMBER_BOUND_MAX = 1_000_000;

export const clampRandomNumberBound = (value: number): number =>
  Math.min(
    RANDOM_NUMBER_BOUND_MAX,
    Math.max(RANDOM_NUMBER_BOUND_MIN, Math.trunc(value)),
  );

export const parseRandomNumberBoundInput = (raw: string): number | null => {
  if (raw.trim() === "") {
    return null;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return null;
  }
  return clampRandomNumberBound(value);
};
