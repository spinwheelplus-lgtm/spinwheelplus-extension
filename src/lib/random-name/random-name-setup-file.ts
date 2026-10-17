export const RANDOM_NAME_SETUP_FORMAT = "spinwheelplus.random-name" as const;
export const RANDOM_NAME_SETUP_VERSION = 1 as const;
export const RANDOM_NAME_SETUP_FILE_NAME = "spinwheelplus-random-name.json";

const NAMES_MAX = 200_000;

export type RandomNameSetupFile = {
  names: string;
  removeWinner: boolean;
  deduplicate: boolean;
  rollAnimation: boolean;
  soundEnabled: boolean;
};

export type ParseRandomNameSetupResult =
  | { ok: true; setup: RandomNameSetupFile }
  | { ok: false };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const parseRandomNameSetupText = (
  text: string,
): ParseRandomNameSetupResult => {
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return { ok: false };
  }
  if (!isRecord(raw)) return { ok: false };
  if (raw.format !== RANDOM_NAME_SETUP_FORMAT) return { ok: false };
  if (raw.version !== RANDOM_NAME_SETUP_VERSION) return { ok: false };
  if (typeof raw.names !== "string") return { ok: false };
  if (typeof raw.remove_winner !== "boolean") return { ok: false };
  if (typeof raw.deduplicate !== "boolean") return { ok: false };
  if (typeof raw.roll_animation !== "boolean") return { ok: false };
  if (typeof raw.sound_enabled !== "boolean") return { ok: false };

  return {
    ok: true,
    setup: {
      names: raw.names.slice(0, NAMES_MAX),
      removeWinner: raw.remove_winner,
      deduplicate: raw.deduplicate,
      rollAnimation: raw.roll_animation,
      soundEnabled: raw.sound_enabled,
    },
  };
};

export const buildRandomNameSetupText = (setup: RandomNameSetupFile): string =>
  JSON.stringify(
    {
      format: RANDOM_NAME_SETUP_FORMAT,
      version: RANDOM_NAME_SETUP_VERSION,
      names: setup.names,
      remove_winner: setup.removeWinner,
      deduplicate: setup.deduplicate,
      roll_animation: setup.rollAnimation,
      sound_enabled: setup.soundEnabled,
    },
    null,
    2,
  );

export const downloadRandomNameSetup = (setup: RandomNameSetupFile): void => {
  const blob = new Blob([buildRandomNameSetupText(setup)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = RANDOM_NAME_SETUP_FILE_NAME;
  anchor.click();
  URL.revokeObjectURL(url);
};
