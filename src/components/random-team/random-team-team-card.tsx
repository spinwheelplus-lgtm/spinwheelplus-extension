import { Crown, Pencil } from "lucide-react";
import { useState, type DragEvent } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { localizeDefaultTeamName } from "@/lib/random-team/default-team-names";
import { getRandomTeamColorClass } from "@/lib/random-team/team-colors";
import type { RandomTeamGroup } from "@/types/random-team";

type DragPayload = {
  memberId: string;
  fromTeamId: string;
};

const parseDragPayload = (raw: string): DragPayload | null => {
  try {
    const data = JSON.parse(raw) as DragPayload;
    if (
      typeof data.memberId !== "string" ||
      typeof data.fromTeamId !== "string"
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

type RandomTeamTeamCardProps = {
  team: RandomTeamGroup;
  teams: readonly RandomTeamGroup[];
  onRename: (name: string) => void;
  onMoveMember: (
    memberId: string,
    fromTeamId: string,
    toTeamId: string,
    toIndex: number,
  ) => void;
};

export const RandomTeamTeamCard = ({
  team,
  teams,
  onRename,
  onMoveMember,
}: RandomTeamTeamCardProps) => {
  const teamUi = useMessages().ui.team;
  const shownName = localizeDefaultTeamName(team.name, teamUi.defaultName);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(shownName);
  const [isOver, setIsOver] = useState(false);
  const colors = getRandomTeamColorClass(team.colorIndex);

  const commitRename = () => {
    const trimmed = draftName.trim();
    if (trimmed) onRename(trimmed);
    else setDraftName(shownName);
    setEditing(false);
  };

  const handleDrop = (event: DragEvent<HTMLElement>, toIndex: number) => {
    event.preventDefault();
    setIsOver(false);
    const payload = parseDragPayload(
      event.dataTransfer.getData("application/json"),
    );
    if (!payload) return;
    onMoveMember(payload.memberId, payload.fromTeamId, team.id, toIndex);
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card p-4 shadow-sm",
        colors.border,
        isOver && "ring-2 ring-primary/25",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => handleDrop(event, team.members.length)}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
            colors.icon,
          )}
          aria-hidden
        >
          {shownName.replace(/^(?:Team|Đội|Equipo|Equipe|Squadra|チーム|팀|ทีม|Joukkue|Команда)\s+/u, "").charAt(0) || "T"}
        </span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <Input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitRename();
                if (event.key === "Escape") {
                  setDraftName(shownName);
                  setEditing(false);
                }
              }}
              className="h-8 text-sm"
              aria-label={teamUi.teamName}
              autoFocus
            />
          ) : (
            <p className="truncate text-sm font-semibold">{shownName}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {fillTemplate(teamUi.memberCount, { count: team.members.length })}
          </p>
        </div>
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={fillTemplate(teamUi.renameTeam, { name: shownName })}
          onClick={() => {
            setDraftName(shownName);
            setEditing(true);
          }}
        >
          <Pencil className="size-3.5" aria-hidden />
        </button>
      </div>

      <ul className="min-h-12 space-y-2">
        {team.members.map((member, index) => (
          <li
            key={member.id}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData(
                "application/json",
                JSON.stringify({
                  memberId: member.id,
                  fromTeamId: team.id,
                } satisfies DragPayload),
              );
              event.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.stopPropagation();
              handleDrop(event, index);
            }}
            className="flex items-center gap-2 rounded-lg bg-muted/50 px-2 py-2"
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                colors.badge,
              )}
              aria-hidden
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">{member.name}</span>
            {member.isCaptain ? (
              <Crown
                className="size-4 shrink-0 text-amber-500"
                aria-label={teamUi.captain}
              />
            ) : null}
            {teams.length > 1 ? (
              <select
                className="max-w-24 truncate rounded-md border border-border bg-background px-1 py-0.5 text-xs"
                value={team.id}
                aria-label={fillTemplate(teamUi.moveMember, { name: member.name })}
                onChange={(event) => {
                  const toTeamId = event.target.value;
                  if (toTeamId === team.id) return;
                  const dest = teams.find((item) => item.id === toTeamId);
                  onMoveMember(
                    member.id,
                    team.id,
                    toTeamId,
                    dest?.members.length ?? 0,
                  );
                }}
              >
                {teams.map((item) => (
                  <option key={item.id} value={item.id}>
                    {localizeDefaultTeamName(item.name, teamUi.defaultName)}
                  </option>
                ))}
              </select>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};
