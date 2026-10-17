export type RandomTeamSplitMode = "count" | "size";

export type RandomTeamMemberInput = {
  id: string;
  name: string;
  isCaptain: boolean;
};

export type RandomTeamMemberSlot = {
  id: string;
  name: string;
  isCaptain: boolean;
};

export type RandomTeamGroup = {
  id: string;
  name: string;
  colorIndex: number;
  members: RandomTeamMemberSlot[];
};

export type RandomTeamHistoryEntry = {
  id: string;
  teams: RandomTeamGroup[];
  generatedAt: number;
  memberCount: number;
  teamCount: number;
  splitMode: RandomTeamSplitMode;
  teamCountSetting: number;
  teamSizeSetting: number;
};

export const RANDOM_TEAM_HISTORY_PREVIEW_LIMIT = 12;

export const RANDOM_TEAM_HISTORY_LIMIT = 50;

export const RANDOM_TEAM_MAX_MEMBERS = 300;

export const RANDOM_TEAM_STORE_PERSIST_KEY = "spinwheelplus.random-team.v1";
