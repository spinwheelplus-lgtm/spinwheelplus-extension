import { RANDOM_TEAM_MAX_MEMBERS } from "@/types/random-team";

export const RANDOM_TEAM_SETUP_FORMAT = "spinwheelplus.random-team" as const;
export const RANDOM_TEAM_SETUP_VERSION = 1 as const;
export const RANDOM_TEAM_SETUP_FILE_NAME = "spinwheelplus-random-team.json";

const NAME_MAX = 2_000;
const SETTING_MAX = 10_000;

export type RandomTeamSetupMember = {
  name: string;
  isCaptain: boolean;
};

export type RandomTeamSetupFile = {
  members: RandomTeamSetupMember[];
  splitMode: "count" | "size";
  teamCount: number;
  teamSize: number;
  balanced: boolean;
  shuffleBefore: boolean;
  useCaptains: boolean;
  allowDifferentSizes: boolean;
  deduplicate: boolean;
  soundEnabled: boolean;
};

export type ParseRandomTeamSetupResult =
  | { ok: true; setup: RandomTeamSetupFile }
  | { ok: false };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isSettingCount = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= 1 &&
  value <= SETTING_MAX;

const readMembers = (value: unknown): RandomTeamSetupMember[] | null => {
  if (!Array.isArray(value) || value.length > RANDOM_TEAM_MAX_MEMBERS) {
    return null;
  }
  const members: RandomTeamSetupMember[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (typeof item.name !== "string") return null;
    if (typeof item.is_captain !== "boolean") return null;
    members.push({
      name: item.name.slice(0, NAME_MAX),
      isCaptain: item.is_captain,
    });
  }
  return members;
};

export const parseRandomTeamSetupText = (
  text: string,
): ParseRandomTeamSetupResult => {
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return { ok: false };
  }
  if (!isRecord(raw)) return { ok: false };
  if (raw.format !== RANDOM_TEAM_SETUP_FORMAT) return { ok: false };
  if (raw.version !== RANDOM_TEAM_SETUP_VERSION) return { ok: false };
  const members = readMembers(raw.members);
  if (!members) return { ok: false };
  if (raw.split_mode !== "count" && raw.split_mode !== "size") return { ok: false };
  if (!isSettingCount(raw.team_count)) return { ok: false };
  if (!isSettingCount(raw.team_size)) return { ok: false };
  if (typeof raw.balanced !== "boolean") return { ok: false };
  if (typeof raw.shuffle_before !== "boolean") return { ok: false };
  if (typeof raw.use_captains !== "boolean") return { ok: false };
  if (typeof raw.allow_different_sizes !== "boolean") return { ok: false };
  if (typeof raw.deduplicate !== "boolean") return { ok: false };
  if (typeof raw.sound_enabled !== "boolean") return { ok: false };

  return {
    ok: true,
    setup: {
      members,
      splitMode: raw.split_mode,
      teamCount: raw.team_count,
      teamSize: raw.team_size,
      balanced: raw.balanced,
      shuffleBefore: raw.shuffle_before,
      useCaptains: raw.use_captains,
      allowDifferentSizes: raw.allow_different_sizes,
      deduplicate: raw.deduplicate,
      soundEnabled: raw.sound_enabled,
    },
  };
};

export const buildRandomTeamSetupText = (setup: RandomTeamSetupFile): string =>
  JSON.stringify(
    {
      format: RANDOM_TEAM_SETUP_FORMAT,
      version: RANDOM_TEAM_SETUP_VERSION,
      members: setup.members.map((member) => ({
        name: member.name,
        is_captain: member.isCaptain,
      })),
      split_mode: setup.splitMode,
      team_count: setup.teamCount,
      team_size: setup.teamSize,
      balanced: setup.balanced,
      shuffle_before: setup.shuffleBefore,
      use_captains: setup.useCaptains,
      allow_different_sizes: setup.allowDifferentSizes,
      deduplicate: setup.deduplicate,
      sound_enabled: setup.soundEnabled,
    },
    null,
    2,
  );

export const downloadRandomTeamSetup = (setup: RandomTeamSetupFile): void => {
  const blob = new Blob([buildRandomTeamSetupText(setup)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = RANDOM_TEAM_SETUP_FILE_NAME;
  anchor.click();
  URL.revokeObjectURL(url);
};
