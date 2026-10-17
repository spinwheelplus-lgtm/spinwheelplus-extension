/** Inclusive integer in [min, max] using `crypto.getRandomValues`. */
export const secureRandomInt = (min: number, max: number): number => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error("Range must be finite numbers.");
  }
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  const range = high - low + 1;
  if (range <= 0) {
    throw new Error("Invalid range.");
  }

  const maxUint = 0xffffffff;
  const limit = Math.floor(maxUint / range) * range;
  const buffer = new Uint32Array(1);

  let sample = 0;
  do {
    crypto.getRandomValues(buffer);
    sample = buffer[0] ?? 0;
  } while (sample >= limit);

  return low + (sample % range);
};
