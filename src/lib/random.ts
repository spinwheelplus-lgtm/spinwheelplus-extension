export const createItemId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
};

/** Uniform value in [0, 1) from the Web Crypto CSPRNG. */
export const randomUnit = (): number => {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] / 2 ** 32;
};

/** Uniform integer in [0, length). */
export const randomIndex = (length: number): number => {
  if (length <= 1) return 0;
  return Math.floor(randomUnit() * length);
};

export const pickWeightedIndex = (weights: number[]): number => {
  const safe = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 1));
  const total = safe.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return 0;
  let cursor = randomUnit() * total;
  for (let i = 0; i < safe.length; i += 1) {
    cursor -= safe[i];
    if (cursor <= 0) return i;
  }
  return safe.length - 1;
};
