export const WINNER_EFFECT_NONE = "none";
export const WINNER_EFFECT_CONFETTI = "triggerConfetti";
export const WINNER_EFFECT_FIREWORKS = "triggerFireworks";

export const WINNER_EFFECT_IDS = [
  WINNER_EFFECT_CONFETTI,
  WINNER_EFFECT_FIREWORKS,
  WINNER_EFFECT_NONE,
] as const;

export type WinnerEffectId = (typeof WINNER_EFFECT_IDS)[number];

export const DEFAULT_WINNER_EFFECT: WinnerEffectId = WINNER_EFFECT_CONFETTI;

export const WINNER_EFFECT_SELECT_OPTIONS: ReadonlyArray<{
  value: WinnerEffectId;
  label: string;
}> = [
  { value: WINNER_EFFECT_CONFETTI, label: "Confetti" },
  { value: WINNER_EFFECT_FIREWORKS, label: "Fireworks" },
  { value: WINNER_EFFECT_NONE, label: "None" },
];

const EFFECT_ID_SET = new Set<string>(WINNER_EFFECT_IDS);

const WINNER_EFFECT_ALIASES: Readonly<Record<string, WinnerEffectId>> = {
  confetti: WINNER_EFFECT_CONFETTI,
  fireworks: WINNER_EFFECT_FIREWORKS,
};

export const isWinnerEffectId = (value: unknown): value is WinnerEffectId =>
  typeof value === "string" && EFFECT_ID_SET.has(value);

export const isActiveWinnerEffect = (effect: WinnerEffectId): boolean =>
  effect !== WINNER_EFFECT_NONE;

/** Prefer `winnerEffect`. Legacy `confetti: false` maps to None. Missing both is Confetti. */
export const resolveWinnerEffect = (
  raw: unknown,
  confettiFlag?: unknown,
): WinnerEffectId => {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (isWinnerEffectId(trimmed)) return trimmed;
    const value = trimmed.toLowerCase();
    if (WINNER_EFFECT_ALIASES[value]) return WINNER_EFFECT_ALIASES[value];
  }
  if (confettiFlag === false) return WINNER_EFFECT_NONE;
  return DEFAULT_WINNER_EFFECT;
};
