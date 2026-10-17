import type { RandomTeamGroup } from "@/types/random-team";

export type RandomTeamStats = {
  totalMembers: number;
  totalTeams: number;
  averageTeamSize: number;
  distributionLabel: string;
};

export const computeRandomTeamStats = (
  teams: readonly RandomTeamGroup[],
  balanced: boolean,
): RandomTeamStats => {
  const sizes = teams.map((team) => team.members.length);
  const totalMembers = sizes.reduce((sum, size) => sum + size, 0);
  const totalTeams = teams.length;
  const averageTeamSize =
    totalTeams > 0 ? Math.round((totalMembers / totalTeams) * 10) / 10 : 0;

  const minSize = sizes.length > 0 ? Math.min(...sizes) : 0;
  const maxSize = sizes.length > 0 ? Math.max(...sizes) : 0;
  const isBalanced = maxSize - minSize <= 1;

  let distributionLabel = "Custom";
  if (totalTeams === 0) {
    distributionLabel = "-";
  } else if (isBalanced || balanced) {
    distributionLabel = "Balanced";
  } else {
    distributionLabel = "Mixed";
  }

  return {
    totalMembers,
    totalTeams,
    averageTeamSize,
    distributionLabel,
  };
};
