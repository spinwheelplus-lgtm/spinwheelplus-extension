export type SpinStyle = "style1" | "style2";

export const DEFAULT_SPIN_STYLE: SpinStyle = "style1";
export const DEFAULT_STYLE2_STOP_STRENGTH = 3;
export const STYLE2_STOP_STRENGTH_MIN = 1;
export const STYLE2_STOP_STRENGTH_MAX = 5;

export const SPIN_STYLE_OPTIONS = [
  { label: "Auto Stop (Default)", value: "style1" },
  { label: "Manual Stop", value: "style2" },
] as const;

export const readSpinStyle = (value: unknown): SpinStyle =>
  value === "style2" ? "style2" : "style1";

export const readStyle2StopStrength = (value: unknown): number => {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return DEFAULT_STYLE2_STOP_STRENGTH;
  return Math.min(
    STYLE2_STOP_STRENGTH_MAX,
    Math.max(STYLE2_STOP_STRENGTH_MIN, n),
  );
};
