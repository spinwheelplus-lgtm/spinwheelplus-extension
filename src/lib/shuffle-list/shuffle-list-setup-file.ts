export const SHUFFLE_LIST_SETUP_FORMAT = "spinwheelplus.shuffle-list" as const;
export const SHUFFLE_LIST_SETUP_VERSION = 1 as const;
export const SHUFFLE_LIST_SETUP_FILE_NAME = "spinwheelplus-shuffle-list.json";

const ITEMS_MAX = 200_000;

export type ShuffleListSetupFile = {
  items: string;
  ignoreEmptyLines: boolean;
  removeDuplicates: boolean;
  soundEnabled: boolean;
};

export type ParseShuffleListSetupResult =
  | { ok: true; setup: ShuffleListSetupFile }
  | { ok: false };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const parseShuffleListSetupText = (
  text: string,
): ParseShuffleListSetupResult => {
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return { ok: false };
  }
  if (!isRecord(raw)) return { ok: false };
  if (raw.format !== SHUFFLE_LIST_SETUP_FORMAT) return { ok: false };
  if (raw.version !== SHUFFLE_LIST_SETUP_VERSION) return { ok: false };
  if (typeof raw.items !== "string") return { ok: false };
  if (typeof raw.ignore_empty_lines !== "boolean") return { ok: false };
  if (typeof raw.remove_duplicates !== "boolean") return { ok: false };
  if (typeof raw.sound_enabled !== "boolean") return { ok: false };

  return {
    ok: true,
    setup: {
      items: raw.items.slice(0, ITEMS_MAX),
      ignoreEmptyLines: raw.ignore_empty_lines,
      removeDuplicates: raw.remove_duplicates,
      soundEnabled: raw.sound_enabled,
    },
  };
};

export const buildShuffleListSetupText = (
  setup: ShuffleListSetupFile,
): string =>
  JSON.stringify(
    {
      format: SHUFFLE_LIST_SETUP_FORMAT,
      version: SHUFFLE_LIST_SETUP_VERSION,
      items: setup.items,
      ignore_empty_lines: setup.ignoreEmptyLines,
      remove_duplicates: setup.removeDuplicates,
      sound_enabled: setup.soundEnabled,
    },
    null,
    2,
  );

export const downloadShuffleListSetup = (setup: ShuffleListSetupFile): void => {
  const blob = new Blob([buildShuffleListSetupText(setup)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = SHUFFLE_LIST_SETUP_FILE_NAME;
  anchor.click();
  URL.revokeObjectURL(url);
};
