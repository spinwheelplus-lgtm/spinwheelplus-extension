type RandomYesNoAnswerVisual = {
  textClass: string;
  badgeClass: string;
};

const PRESET_VISUALS: Record<string, RandomYesNoAnswerVisual> = {
  YES: {
    textClass: "text-emerald-600 dark:text-emerald-400",
    badgeClass:
      "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  NO: {
    textClass: "text-red-600 dark:text-red-400",
    badgeClass:
      "bg-red-500/12 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  },
  MAYBE: {
    textClass: "text-amber-600 dark:text-amber-400",
    badgeClass:
      "bg-amber-500/12 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  TRUE: {
    textClass: "text-violet-600 dark:text-violet-400",
    badgeClass:
      "bg-violet-500/12 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  FALSE: {
    textClass: "text-rose-600 dark:text-rose-400",
    badgeClass:
      "bg-rose-500/12 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  },
};

const CUSTOM_PALETTE: RandomYesNoAnswerVisual[] = [
  {
    textClass: "text-sky-600 dark:text-sky-400",
    badgeClass:
      "bg-sky-500/12 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  {
    textClass: "text-fuchsia-600 dark:text-fuchsia-400",
    badgeClass:
      "bg-fuchsia-500/12 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
  },
  {
    textClass: "text-teal-600 dark:text-teal-400",
    badgeClass:
      "bg-teal-500/12 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  },
  {
    textClass: "text-indigo-600 dark:text-indigo-400",
    badgeClass:
      "bg-indigo-500/12 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
];

const hashAnswerLabel = (label: string): number => {
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const resolveRandomYesNoAnswerVisual = (
  answer: string,
): RandomYesNoAnswerVisual => {
  const preset = PRESET_VISUALS[answer.trim().toUpperCase()];
  if (preset) return preset;
  return CUSTOM_PALETTE[hashAnswerLabel(answer) % CUSTOM_PALETTE.length]!;
};
