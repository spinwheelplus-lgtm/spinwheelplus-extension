export const RANDOM_TEAM_COLOR_CLASSES = [
  {
    icon: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/25",
    badge: "bg-emerald-600 text-white",
  },
  {
    icon: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    border: "border-sky-500/25",
    badge: "bg-sky-600 text-white",
  },
  {
    icon: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
    border: "border-violet-500/25",
    badge: "bg-violet-600 text-white",
  },
  {
    icon: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
    border: "border-orange-500/25",
    badge: "bg-orange-500 text-white",
  },
  {
    icon: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    border: "border-rose-500/25",
    badge: "bg-rose-500 text-white",
  },
  {
    icon: "bg-amber-500/15 text-amber-800 dark:text-amber-400",
    border: "border-amber-500/25",
    badge: "bg-amber-500 text-white",
  },
] as const;

export const getRandomTeamColorClass = (colorIndex: number) =>
  RANDOM_TEAM_COLOR_CLASSES[
    ((colorIndex % RANDOM_TEAM_COLOR_CLASSES.length) +
      RANDOM_TEAM_COLOR_CLASSES.length) %
      RANDOM_TEAM_COLOR_CLASSES.length
  ]!;
