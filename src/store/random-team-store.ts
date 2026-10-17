import { create } from "zustand";

import { createItemId } from "@/lib/random";
import { cloneRandomTeamGroups } from "@/lib/random-team/clone-teams";
import {
  generateRandomTeams,
  validateRandomTeamGeneration,
} from "@/lib/random-team/generate-teams";
import {
  appendMembersFromText,
  createRandomTeamMember,
  getCaptainCount,
  resolveMembersForGeneration,
} from "@/lib/random-team/member-input";
import {
  loadRandomTeamPersist,
  RANDOM_TEAM_PERSIST_DEFAULTS,
  saveRandomTeamPersist,
  type RandomTeamPersistState,
} from "@/lib/random-team/persist";
import { playRandomTeamRevealSound } from "@/lib/random-team/play-random-team-reveal-sound";
import { pickRandomTeamNames } from "@/lib/random-team/random-team-name-pool";
import type { RandomTeamSetupFile } from "@/lib/random-team/random-team-setup-file";
import { syncTeamSettingsForMembers } from "@/lib/random-team/sync-team-settings";
import { clampTeamCount, clampTeamSize, resolveTeamLimits } from "@/lib/random-team/team-limits";
import {
  RANDOM_TEAM_HISTORY_LIMIT,
  RANDOM_TEAM_MAX_MEMBERS,
  type RandomTeamHistoryEntry,
  type RandomTeamSplitMode,
} from "@/types/random-team";

type RandomTeamStoreState = RandomTeamPersistState & {
  ready: boolean;
  hydrate: () => Promise<void>;
  setRandomTeamMemberName: (id: string, name: string) => void;
  toggleRandomTeamCaptain: (id: string) => void;
  clearRandomTeamCaptains: () => void;
  addRandomTeamMembersFromText: (text: string, replace?: boolean) => void;
  addRandomTeamMember: (afterId?: string | null, name?: string) => string | null;
  removeRandomTeamMember: (id: string) => void;
  clearRandomTeamMembers: () => void;
  setRandomTeamSplitMode: (mode: RandomTeamSplitMode) => void;
  setRandomTeamTeamCount: (value: number) => void;
  setRandomTeamTeamSize: (value: number) => void;
  setRandomTeamBalanced: (value: boolean) => void;
  setRandomTeamShuffleBefore: (value: boolean) => void;
  setRandomTeamUseCaptains: (value: boolean) => void;
  setRandomTeamAllowDifferentSizes: (value: boolean) => void;
  setRandomTeamDeduplicate: (value: boolean) => void;
  setRandomTeamSoundEnabled: (value: boolean) => void;
  applyRandomTeamSetup: (setup: RandomTeamSetupFile) => void;
  generateRandomTeamGroups: () => string | null;
  regenerateRandomTeamGroups: () => string | null;
  clearRandomTeamResults: () => void;
  setRandomTeamName: (teamId: string, name: string) => void;
  applyRandomTeamNames: () => void;
  moveRandomTeamMember: (
    memberId: string,
    fromTeamId: string,
    toTeamId: string,
    toIndex: number,
  ) => void;
  clearRandomTeamHistory: () => void;
  restoreRandomTeamHistoryEntry: (id: string) => void;
  toggleRandomTeamInputDocked: () => void;
};

const getGenerationOptions = (state: RandomTeamPersistState) => ({
  splitMode: state.random_team_split_mode,
  teamCountSetting: state.random_team_team_count,
  teamSizeSetting: state.random_team_team_size,
  balanced: state.random_team_balanced,
  shuffleBeforeSplit: state.random_team_shuffle_before,
  useCaptains: state.random_team_use_captains,
  allowDifferentSizes: state.random_team_allow_different_sizes,
  deduplicate: state.random_team_deduplicate,
});

const persistSlice = (state: RandomTeamStoreState): RandomTeamPersistState => ({
  random_team_members: state.random_team_members,
  random_team_split_mode: state.random_team_split_mode,
  random_team_team_count: state.random_team_team_count,
  random_team_team_size: state.random_team_team_size,
  random_team_balanced: state.random_team_balanced,
  random_team_shuffle_before: state.random_team_shuffle_before,
  random_team_use_captains: state.random_team_use_captains,
  random_team_allow_different_sizes: state.random_team_allow_different_sizes,
  random_team_deduplicate: state.random_team_deduplicate,
  random_team_sound_enabled: state.random_team_sound_enabled,
  random_team_teams: state.random_team_teams,
  random_team_generated_at: state.random_team_generated_at,
  random_team_history: state.random_team_history,
  random_team_active_history_id: state.random_team_active_history_id,
  random_team_input_docked: state.random_team_input_docked,
});

let persistTimer: number | null = null;

const schedulePersist = (): void => {
  if (persistTimer != null) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    void saveRandomTeamPersist(persistSlice(useRandomTeamStore.getState()));
  }, 200);
};

const withSyncedTeamSettings = (
  state: RandomTeamStoreState,
  patch: Partial<RandomTeamStoreState>,
): Partial<RandomTeamStoreState> => {
  const next = { ...state, ...patch };
  const resolved = resolveMembersForGeneration(
    next.random_team_members,
    next.random_team_deduplicate,
  );
  const synced = syncTeamSettingsForMembers(next, resolved);
  return { ...patch, ...synced };
};

export const getRandomTeamMemberCount = (
  state: Pick<
    RandomTeamPersistState,
    "random_team_members" | "random_team_deduplicate"
  >,
): number =>
  resolveMembersForGeneration(
    state.random_team_members,
    state.random_team_deduplicate,
  ).length;

export const useRandomTeamStore = create<RandomTeamStoreState>((set, get) => ({
  ready: false,
  ...RANDOM_TEAM_PERSIST_DEFAULTS,
  hydrate: async () => {
    const saved = await loadRandomTeamPersist();
    set({ ...RANDOM_TEAM_PERSIST_DEFAULTS, ...(saved ?? {}), ready: true });
  },
  setRandomTeamMemberName: (id, name) => {
    set((state) =>
      withSyncedTeamSettings(state, {
        random_team_members: state.random_team_members.map((member) =>
          member.id === id ? { ...member, name } : member,
        ),
      }),
    );
    schedulePersist();
  },
  toggleRandomTeamCaptain: (id) => {
    set((state) =>
      withSyncedTeamSettings(state, {
        random_team_members: state.random_team_members.map((member) =>
          member.id === id
            ? { ...member, isCaptain: !member.isCaptain }
            : member,
        ),
      }),
    );
    schedulePersist();
  },
  clearRandomTeamCaptains: () => {
    set((state) => ({
      random_team_members: state.random_team_members.map((member) => ({
        ...member,
        isCaptain: false,
      })),
      random_team_teams: state.random_team_teams.map((team) => ({
        ...team,
        members: team.members.map((member) => ({
          ...member,
          isCaptain: false,
        })),
      })),
    }));
    schedulePersist();
  },
  addRandomTeamMembersFromText: (text, replace = false) => {
    set((state) => {
      const nextMembers = (
        replace
          ? appendMembersFromText([], text)
          : appendMembersFromText(state.random_team_members, text)
      ).slice(0, RANDOM_TEAM_MAX_MEMBERS);
      return withSyncedTeamSettings(state, {
        random_team_members: nextMembers,
      });
    });
    schedulePersist();
  },
  addRandomTeamMember: (afterId = null, name = "") => {
    const state = get();
    if (state.random_team_members.length >= RANDOM_TEAM_MAX_MEMBERS) {
      return null;
    }
    const newMember = createRandomTeamMember(name.trim());
    const nextMembers = [...state.random_team_members];
    const index = afterId
      ? nextMembers.findIndex((member) => member.id === afterId)
      : -1;
    if (index < 0) {
      nextMembers.push(newMember);
    } else {
      nextMembers.splice(index + 1, 0, newMember);
    }
    set((current) =>
      withSyncedTeamSettings(current, { random_team_members: nextMembers }),
    );
    schedulePersist();
    return newMember.id;
  },
  removeRandomTeamMember: (id) => {
    set((state) =>
      withSyncedTeamSettings(state, {
        random_team_members: state.random_team_members.filter(
          (member) => member.id !== id,
        ),
      }),
    );
    schedulePersist();
  },
  clearRandomTeamMembers: () => {
    set({
      random_team_members: [],
      random_team_teams: [],
      random_team_generated_at: null,
      random_team_active_history_id: null,
    });
    schedulePersist();
  },
  setRandomTeamSplitMode: (mode) => {
    set({ random_team_split_mode: mode });
    schedulePersist();
  },
  setRandomTeamTeamCount: (value) => {
    set((state) => {
      const resolved = resolveMembersForGeneration(
        state.random_team_members,
        state.random_team_deduplicate,
      );
      return {
        random_team_team_count: clampTeamCount(
          value,
          resolved.length,
          getCaptainCount(resolved),
          state.random_team_use_captains,
        ),
      };
    });
    schedulePersist();
  },
  setRandomTeamTeamSize: (value) => {
    set((state) => {
      const resolved = resolveMembersForGeneration(
        state.random_team_members,
        state.random_team_deduplicate,
      );
      return {
        random_team_team_size: clampTeamSize(value, resolved.length),
      };
    });
    schedulePersist();
  },
  setRandomTeamBalanced: (value) => {
    set({ random_team_balanced: value });
    schedulePersist();
  },
  setRandomTeamShuffleBefore: (value) => {
    set({ random_team_shuffle_before: value });
    schedulePersist();
  },
  setRandomTeamUseCaptains: (value) => {
    set((state) =>
      withSyncedTeamSettings(state, { random_team_use_captains: value }),
    );
    schedulePersist();
  },
  setRandomTeamAllowDifferentSizes: (value) => {
    set({ random_team_allow_different_sizes: value });
    schedulePersist();
  },
  setRandomTeamDeduplicate: (value) => {
    set((state) =>
      withSyncedTeamSettings(state, { random_team_deduplicate: value }),
    );
    schedulePersist();
  },
  setRandomTeamSoundEnabled: (value) => {
    set({ random_team_sound_enabled: value });
    schedulePersist();
  },
  applyRandomTeamSetup: (setup) => {
    const members = setup.members.map((member) =>
      createRandomTeamMember(member.name, member.isCaptain),
    );
    set((state) =>
      withSyncedTeamSettings(state, {
        random_team_members: members,
        random_team_split_mode: setup.splitMode,
        random_team_team_count: setup.teamCount,
        random_team_team_size: setup.teamSize,
        random_team_balanced: setup.balanced,
        random_team_shuffle_before: setup.shuffleBefore,
        random_team_use_captains: setup.useCaptains,
        random_team_allow_different_sizes: setup.allowDifferentSizes,
        random_team_deduplicate: setup.deduplicate,
        random_team_sound_enabled: setup.soundEnabled,
      }),
    );
    schedulePersist();
  },
  generateRandomTeamGroups: () => {
    const state = get();
    const members = resolveMembersForGeneration(
      state.random_team_members,
      state.random_team_deduplicate,
    );
    const validation = validateRandomTeamGeneration({
      members,
      ...getGenerationOptions(state),
    });
    if (validation) return validation;

    const teams = generateRandomTeams({
      members,
      ...getGenerationOptions(state),
    });
    const generatedAt = Date.now();
    const limits = resolveTeamLimits({
      members,
      splitMode: state.random_team_split_mode,
      teamCountSetting: state.random_team_team_count,
      teamSizeSetting: state.random_team_team_size,
      useCaptains: state.random_team_use_captains,
    });
    const entry: RandomTeamHistoryEntry = {
      id: createItemId(),
      teams: cloneRandomTeamGroups(teams),
      generatedAt,
      memberCount: members.length,
      teamCount: limits.resolvedTeamCount,
      splitMode: state.random_team_split_mode,
      teamCountSetting: state.random_team_team_count,
      teamSizeSetting: state.random_team_team_size,
    };

    set({
      random_team_teams: teams,
      random_team_generated_at: generatedAt,
      random_team_active_history_id: entry.id,
      random_team_history: [entry, ...state.random_team_history].slice(
        0,
        RANDOM_TEAM_HISTORY_LIMIT,
      ),
    });
    if (state.random_team_sound_enabled) {
      playRandomTeamRevealSound();
    }
    schedulePersist();
    return null;
  },
  regenerateRandomTeamGroups: () => get().generateRandomTeamGroups(),
  clearRandomTeamResults: () => {
    set({
      random_team_teams: [],
      random_team_generated_at: null,
      random_team_active_history_id: null,
    });
    schedulePersist();
  },
  setRandomTeamName: (teamId, name) => {
    set((state) => ({
      random_team_teams: state.random_team_teams.map((team) =>
        team.id === teamId ? { ...team, name: name.trim() || team.name } : team,
      ),
    }));
    schedulePersist();
  },
  applyRandomTeamNames: () => {
    set((state) => {
      if (state.random_team_teams.length === 0) return state;
      const names = pickRandomTeamNames(state.random_team_teams.length);
      return {
        random_team_teams: state.random_team_teams.map((team, index) => ({
          ...team,
          name: names[index] ?? team.name,
        })),
      };
    });
    schedulePersist();
  },
  moveRandomTeamMember: (memberId, fromTeamId, toTeamId, toIndex) => {
    set((state) => {
      const teams = cloneRandomTeamGroups(state.random_team_teams);
      const fromTeam = teams.find((team) => team.id === fromTeamId);
      const toTeam = teams.find((team) => team.id === toTeamId);
      if (!fromTeam || !toTeam) return state;

      const memberIndex = fromTeam.members.findIndex(
        (member) => member.id === memberId,
      );
      if (memberIndex < 0) return state;

      const [member] = fromTeam.members.splice(memberIndex, 1);
      if (!member) return state;

      const insertIndex = Math.min(Math.max(0, toIndex), toTeam.members.length);
      toTeam.members.splice(insertIndex, 0, member);
      return { random_team_teams: teams };
    });
    schedulePersist();
  },
  clearRandomTeamHistory: () => {
    set({
      random_team_history: [],
      random_team_active_history_id: null,
    });
    schedulePersist();
  },
  restoreRandomTeamHistoryEntry: (id) => {
    set((state) => {
      const entry = state.random_team_history.find((item) => item.id === id);
      if (!entry) return state;
      return {
        random_team_teams: cloneRandomTeamGroups(entry.teams),
        random_team_generated_at: entry.generatedAt,
        random_team_active_history_id: entry.id,
        random_team_split_mode: entry.splitMode,
        random_team_team_count: entry.teamCountSetting,
        random_team_team_size: entry.teamSizeSetting,
      };
    });
    schedulePersist();
  },
  toggleRandomTeamInputDocked: () => {
    set((state) => ({
      random_team_input_docked: !state.random_team_input_docked,
    }));
    schedulePersist();
  },
}));
