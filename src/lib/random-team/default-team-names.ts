import { fillTemplate } from "@/lib/i18n/locale";

const TEAM_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DEFAULT_TEAM_PREFIX =
  /^(?:Team|Đội|Equipo|Equipe|Squadra|チーム|팀|ทีม|Joukkue|Команда) ([A-Z])$/u;
const DEFAULT_TEAM_SUFFIX = /^([A-Z]) (?:组|組)$/u;

export const buildDefaultTeamName = (index: number): string => {
  const letter = TEAM_LETTERS[index % TEAM_LETTERS.length] ?? "A";
  return `Team ${letter}`;
};

/** Show the default team label in the active language. A renamed team stays as typed. */
export const localizeDefaultTeamName = (
  name: string,
  template: string,
): string => {
  const trimmed = name.trim();
  const letter =
    DEFAULT_TEAM_PREFIX.exec(trimmed)?.[1] ??
    DEFAULT_TEAM_SUFFIX.exec(trimmed)?.[1];
  if (!letter) return name;
  return fillTemplate(template, { letter });
};
