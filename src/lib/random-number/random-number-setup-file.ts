import { clampRandomNumberBound } from "@/lib/random-number/clamp-random-number-bound";
import { clampRandomNumberCustomCount } from "@/lib/random-number/parse-random-number-custom-count";
import {
  RANDOM_NUMBER_COUNT_PRESETS,
  type RandomNumberCountMode,
} from "@/types/random-number";

export const RANDOM_NUMBER_SETUP_FORMAT = "spinwheelplus.random-number" as const;
export const RANDOM_NUMBER_SETUP_VERSION = 1 as const;
export const RANDOM_NUMBER_SETUP_FILE_NAME = "spinwheelplus-random-number.json";

const EXCLUDE_MAX = 2000;

export type RandomNumberSetupFile = {
  min: number;
  max: number;
  exclude: string;
  countMode: RandomNumberCountMode;
  customCount: number;
  allowDuplicates: boolean;
  rollAnimation: boolean;
  soundEnabled: boolean;
};

export type ParseRandomNumberSetupResult =
  | { ok: true; setup: RandomNumberSetupFile }
  | { ok: false };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isCountMode = (value: unknown): value is RandomNumberCountMode => {
  if (value === "custom") return true;
  return (
    typeof value === "number" &&
    (RANDOM_NUMBER_COUNT_PRESETS as readonly number[]).includes(value)
  );
};

export const parseRandomNumberSetupText = (
  text: string,
): ParseRandomNumberSetupResult => {
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return { ok: false };
  }
  if (!isRecord(raw)) return { ok: false };
  if (raw.format !== RANDOM_NUMBER_SETUP_FORMAT) return { ok: false };
  if (raw.version !== RANDOM_NUMBER_SETUP_VERSION) return { ok: false };
  if (typeof raw.min !== "number" || !Number.isFinite(raw.min)) return { ok: false };
  if (typeof raw.max !== "number" || !Number.isFinite(raw.max)) return { ok: false };
  if (typeof raw.exclude !== "string") return { ok: false };
  if (!isCountMode(raw.count_mode)) return { ok: false };
  if (typeof raw.custom_count !== "number" || !Number.isFinite(raw.custom_count)) {
    return { ok: false };
  }
  if (typeof raw.allow_duplicates !== "boolean") return { ok: false };
  if (typeof raw.roll_animation !== "boolean") return { ok: false };
  if (typeof raw.sound_enabled !== "boolean") return { ok: false };

  return {
    ok: true,
    setup: {
      min: clampRandomNumberBound(raw.min),
      max: clampRandomNumberBound(raw.max),
      exclude: raw.exclude.slice(0, EXCLUDE_MAX),
      countMode: raw.count_mode,
      customCount: clampRandomNumberCustomCount(raw.custom_count),
      allowDuplicates: raw.allow_duplicates,
      rollAnimation: raw.roll_animation,
      soundEnabled: raw.sound_enabled,
    },
  };
};

export const buildRandomNumberSetupText = (
  setup: RandomNumberSetupFile,
): string =>
  JSON.stringify(
    {
      format: RANDOM_NUMBER_SETUP_FORMAT,
      version: RANDOM_NUMBER_SETUP_VERSION,
      min: setup.min,
      max: setup.max,
      exclude: setup.exclude,
      count_mode: setup.countMode,
      custom_count: setup.customCount,
      allow_duplicates: setup.allowDuplicates,
      roll_animation: setup.rollAnimation,
      sound_enabled: setup.soundEnabled,
    },
    null,
    2,
  );

export const downloadRandomNumberSetup = (setup: RandomNumberSetupFile): void => {
  const blob = new Blob([buildRandomNumberSetupText(setup)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = RANDOM_NUMBER_SETUP_FILE_NAME;
  anchor.click();
  URL.revokeObjectURL(url);
};
