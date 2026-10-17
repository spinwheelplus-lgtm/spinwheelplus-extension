import { RANDOM_TEAM_SAMPLE_MEMBERS } from "@/lib/random-team/sample-member-list";
import {
  RANDOM_TEAM_HISTORY_LIMIT,
  RANDOM_TEAM_STORE_PERSIST_KEY,
  type RandomTeamGroup,
  type RandomTeamHistoryEntry,
  type RandomTeamMemberInput,
  type RandomTeamSplitMode,
} from "@/types/random-team";

export type RandomTeamPersistState = {
  random_team_members: RandomTeamMemberInput[];
  random_team_split_mode: RandomTeamSplitMode;
  random_team_team_count: number;
  random_team_team_size: number;
  random_team_balanced: boolean;
  random_team_shuffle_before: boolean;
  random_team_use_captains: boolean;
  random_team_allow_different_sizes: boolean;
  random_team_deduplicate: boolean;
  random_team_sound_enabled: boolean;
  random_team_teams: RandomTeamGroup[];
  random_team_generated_at: number | null;
  random_team_history: RandomTeamHistoryEntry[];
  random_team_active_history_id: string | null;
  random_team_input_docked: boolean;
};

export const RANDOM_TEAM_PERSIST_DEFAULTS: RandomTeamPersistState = {
  random_team_members: [...RANDOM_TEAM_SAMPLE_MEMBERS],
  random_team_split_mode: "count",
  random_team_team_count: 3,
  random_team_team_size: 4,
  random_team_balanced: true,
  random_team_shuffle_before: true,
  random_team_use_captains: true,
  random_team_allow_different_sizes: false,
  random_team_deduplicate: false,
  random_team_sound_enabled: true,
  random_team_teams: [],
  random_team_generated_at: null,
  random_team_history: [],
  random_team_active_history_id: null,
  random_team_input_docked: true,
};

const hasChromeStorage = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

const parseMember = (value: unknown): RandomTeamMemberInput | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || row.id.length === 0) return null;
  if (typeof row.name !== "string") return null;
  return {
    id: row.id,
    name: row.name,
    isCaptain: row.isCaptain === true,
  };
};

const parseMembers = (value: unknown): RandomTeamMemberInput[] | null => {
  if (!Array.isArray(value)) return null;
  const members: RandomTeamMemberInput[] = [];
  for (const item of value) {
    const member = parseMember(item);
    if (member) members.push(member);
  }
  return members;
};

const parseTeam = (value: unknown): RandomTeamGroup | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || row.id.length === 0) return null;
  if (typeof row.name !== "string") return null;
  const members = parseMembers(row.members);
  if (!members) return null;
  const colorIndex =
    typeof row.colorIndex === "number" && Number.isFinite(row.colorIndex)
      ? row.colorIndex
      : 0;
  return { id: row.id, name: row.name, colorIndex, members };
};

const parseTeams = (value: unknown): RandomTeamGroup[] | null => {
  if (!Array.isArray(value)) return null;
  const teams: RandomTeamGroup[] = [];
  for (const item of value) {
    const team = parseTeam(item);
    if (team) teams.push(team);
  }
  return teams;
};

const parseHistory = (value: unknown): RandomTeamHistoryEntry[] => {
  if (!Array.isArray(value)) return [];
  const rows: RandomTeamHistoryEntry[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    if (typeof row.id !== "string" || row.id.length === 0) continue;
    if (typeof row.generatedAt !== "number" || !Number.isFinite(row.generatedAt)) {
      continue;
    }
    const teams = parseTeams(row.teams);
    if (!teams) continue;
    const splitMode =
      row.splitMode === "size" || row.splitMode === "count"
        ? row.splitMode
        : "count";
    rows.push({
      id: row.id,
      teams,
      generatedAt: row.generatedAt,
      memberCount:
        typeof row.memberCount === "number" ? row.memberCount : 0,
      teamCount: typeof row.teamCount === "number" ? row.teamCount : teams.length,
      splitMode,
      teamCountSetting:
        typeof row.teamCountSetting === "number" ? row.teamCountSetting : 3,
      teamSizeSetting:
        typeof row.teamSizeSetting === "number" ? row.teamSizeSetting : 4,
    });
    if (rows.length >= RANDOM_TEAM_HISTORY_LIMIT) break;
  }
  return rows;
};

export const parseRandomTeamPersist = (
  value: unknown,
): Partial<RandomTeamPersistState> | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const parsed: Partial<RandomTeamPersistState> = {};

  const members = parseMembers(row.random_team_members);
  if (members) parsed.random_team_members = members;
  if (row.random_team_split_mode === "count" || row.random_team_split_mode === "size") {
    parsed.random_team_split_mode = row.random_team_split_mode;
  }
  if (typeof row.random_team_team_count === "number") {
    parsed.random_team_team_count = row.random_team_team_count;
  }
  if (typeof row.random_team_team_size === "number") {
    parsed.random_team_team_size = row.random_team_team_size;
  }
  if (typeof row.random_team_balanced === "boolean") {
    parsed.random_team_balanced = row.random_team_balanced;
  }
  if (typeof row.random_team_shuffle_before === "boolean") {
    parsed.random_team_shuffle_before = row.random_team_shuffle_before;
  }
  if (typeof row.random_team_use_captains === "boolean") {
    parsed.random_team_use_captains = row.random_team_use_captains;
  }
  if (typeof row.random_team_allow_different_sizes === "boolean") {
    parsed.random_team_allow_different_sizes =
      row.random_team_allow_different_sizes;
  }
  if (typeof row.random_team_deduplicate === "boolean") {
    parsed.random_team_deduplicate = row.random_team_deduplicate;
  }
  if (typeof row.random_team_sound_enabled === "boolean") {
    parsed.random_team_sound_enabled = row.random_team_sound_enabled;
  }
  const teams = parseTeams(row.random_team_teams);
  if (teams) parsed.random_team_teams = teams;
  if (
    row.random_team_generated_at === null ||
    typeof row.random_team_generated_at === "number"
  ) {
    parsed.random_team_generated_at = row.random_team_generated_at;
  }
  if (Array.isArray(row.random_team_history)) {
    parsed.random_team_history = parseHistory(row.random_team_history);
  }
  if (
    row.random_team_active_history_id === null ||
    typeof row.random_team_active_history_id === "string"
  ) {
    parsed.random_team_active_history_id = row.random_team_active_history_id;
  }
  if (typeof row.random_team_input_docked === "boolean") {
    parsed.random_team_input_docked = row.random_team_input_docked;
  }

  return parsed;
};

export const loadRandomTeamPersist =
  async (): Promise<Partial<RandomTeamPersistState> | null> => {
    try {
      if (hasChromeStorage()) {
        const result = await chrome.storage.local.get(
          RANDOM_TEAM_STORE_PERSIST_KEY,
        );
        return parseRandomTeamPersist(result[RANDOM_TEAM_STORE_PERSIST_KEY]);
      }
      const raw = localStorage.getItem(RANDOM_TEAM_STORE_PERSIST_KEY);
      return raw ? parseRandomTeamPersist(JSON.parse(raw) as unknown) : null;
    } catch {
      return null;
    }
  };

export const saveRandomTeamPersist = async (
  state: RandomTeamPersistState,
): Promise<void> => {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({
        [RANDOM_TEAM_STORE_PERSIST_KEY]: state,
      });
      return;
    }
    localStorage.setItem(RANDOM_TEAM_STORE_PERSIST_KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode: keep working in memory.
  }
};
