import {
  RANDOM_YES_NO_ANIMATION_TYPES,
  RANDOM_YES_NO_ANSWER_MODES,
  type RandomYesNoAnimationType,
  type RandomYesNoAnswerMode,
} from "@/types/random-yes-no";

export const YES_NO_SETUP_FORMAT = "spinwheelplus.yes-or-no" as const;
export const YES_NO_SETUP_VERSION = 1 as const;
export const YES_NO_SETUP_FILE_NAME = "spinwheelplus-yes-or-no.json";

const CUSTOM_ANSWERS_MAX = 20_000;

export type YesNoSetupFile = {
  answerMode: RandomYesNoAnswerMode;
  customAnswers: string;
  animation: RandomYesNoAnimationType;
  soundEnabled: boolean;
};

export type ParseYesNoSetupResult =
  | { ok: true; setup: YesNoSetupFile }
  | { ok: false };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isAnswerMode = (value: unknown): value is RandomYesNoAnswerMode =>
  typeof value === "string" &&
  (RANDOM_YES_NO_ANSWER_MODES as readonly string[]).includes(value);

const isAnimation = (value: unknown): value is RandomYesNoAnimationType =>
  typeof value === "string" &&
  (RANDOM_YES_NO_ANIMATION_TYPES as readonly string[]).includes(value);

export const parseYesNoSetupText = (text: string): ParseYesNoSetupResult => {
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return { ok: false };
  }
  if (!isRecord(raw)) return { ok: false };
  if (raw.format !== YES_NO_SETUP_FORMAT) return { ok: false };
  if (raw.version !== YES_NO_SETUP_VERSION) return { ok: false };
  if (!isAnswerMode(raw.answer_mode)) return { ok: false };
  if (typeof raw.custom_answers !== "string") return { ok: false };
  if (!isAnimation(raw.animation)) return { ok: false };
  if (typeof raw.sound_enabled !== "boolean") return { ok: false };

  return {
    ok: true,
    setup: {
      answerMode: raw.answer_mode,
      customAnswers: raw.custom_answers.slice(0, CUSTOM_ANSWERS_MAX),
      animation: raw.animation,
      soundEnabled: raw.sound_enabled,
    },
  };
};

export const buildYesNoSetupText = (setup: YesNoSetupFile): string =>
  JSON.stringify(
    {
      format: YES_NO_SETUP_FORMAT,
      version: YES_NO_SETUP_VERSION,
      answer_mode: setup.answerMode,
      custom_answers: setup.customAnswers,
      animation: setup.animation,
      sound_enabled: setup.soundEnabled,
    },
    null,
    2,
  );

export const downloadYesNoSetup = (setup: YesNoSetupFile): void => {
  const blob = new Blob([buildYesNoSetupText(setup)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = YES_NO_SETUP_FILE_NAME;
  anchor.click();
  URL.revokeObjectURL(url);
};
