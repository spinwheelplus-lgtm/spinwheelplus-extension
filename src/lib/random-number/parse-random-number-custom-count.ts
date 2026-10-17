export const RANDOM_NUMBER_CUSTOM_COUNT_MIN = 1;
export const RANDOM_NUMBER_CUSTOM_COUNT_MAX = 500;

export const clampRandomNumberCustomCount = (value: number): number => {
  if (!Number.isFinite(value)) {
    return RANDOM_NUMBER_CUSTOM_COUNT_MIN;
  }
  return Math.min(
    RANDOM_NUMBER_CUSTOM_COUNT_MAX,
    Math.max(RANDOM_NUMBER_CUSTOM_COUNT_MIN, Math.floor(value)),
  );
};

export const parseRandomNumberCustomCountInput = (
  raw: string,
): number | null => {
  if (raw.trim() === "") {
    return null;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return null;
  }
  return clampRandomNumberCustomCount(value);
};
