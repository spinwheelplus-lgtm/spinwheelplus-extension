import { Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { getRandomTeamColorClass } from "@/lib/random-team/team-colors";
import type { RandomTeamGroup } from "@/types/random-team";

type RandomTeamCaptainBannerProps = {
  teams: readonly RandomTeamGroup[];
  onClearCaptains: () => void;
};

export const RandomTeamCaptainBanner = ({
  teams,
  onClearCaptains,
}: RandomTeamCaptainBannerProps) => {
  const captainAssignments = teams.flatMap((team) => {
    const captain = team.members.find((member) => member.isCaptain);
    if (!captain) return [];
    return [{ captainName: captain.name, teamName: team.name, team }];
  });

  if (captainAssignments.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-200">
            <Crown className="size-4 shrink-0" aria-hidden />
            Captains are placed first in their teams
          </p>
          <ul className="flex flex-wrap gap-2 text-sm text-amber-900/90 dark:text-amber-100/90">
            {captainAssignments.map(({ captainName, teamName, team }) => {
              const colors = getRandomTeamColorClass(team.colorIndex);
              return (
                <li
                  key={`${team.id}-${captainName}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1"
                >
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      colors.badge,
                    )}
                  >
                    {captainName}
                  </span>
                  <span>to {teamName}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-amber-500/30 bg-background/70"
          onClick={onClearCaptains}
        >
          Clear Captains
        </Button>
      </div>
    </div>
  );
};
