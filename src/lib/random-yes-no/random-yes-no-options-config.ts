import {
  Check,
  CircleHelp,
  Keyboard,
  Layers,
  List,
  Sparkles,
  SquareStack,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react";

import type { RandomYesNoAnswerMode } from "@/types/random-yes-no";

export type RandomYesNoAnswerModeOption = {
  id: RandomYesNoAnswerMode;
  label: string;
  icon: LucideIcon;
  iconClass: string;
};

export const RANDOM_YES_NO_ANSWER_MODE_OPTIONS: readonly RandomYesNoAnswerModeOption[] =
  [
    {
      id: "yes_no",
      label: "Yes or No",
      icon: Check,
      iconClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "yes_no_maybe",
      label: "Yes / No / Maybe",
      icon: CircleHelp,
      iconClass: "text-sky-600 dark:text-sky-400",
    },
    {
      id: "true_false",
      label: "True / False",
      icon: ToggleLeft,
      iconClass: "text-violet-600 dark:text-violet-400",
    },
    {
      id: "custom",
      label: "Custom Answers",
      icon: List,
      iconClass: "text-fuchsia-600 dark:text-fuchsia-400",
    },
  ] as const;

export type RandomYesNoAnimationOption = {
  id: "picker" | "flip" | "fade" | "typewriter";
  label: string;
  icon: LucideIcon;
  recommended?: boolean;
};

export const RANDOM_YES_NO_ANIMATION_OPTIONS: readonly RandomYesNoAnimationOption[] =
  [
    {
      id: "picker",
      label: "Answer Picker",
      icon: Sparkles,
      recommended: true,
    },
    {
      id: "flip",
      label: "Flip",
      icon: Layers,
    },
    {
      id: "fade",
      label: "Fade",
      icon: SquareStack,
    },
    {
      id: "typewriter",
      label: "Typewriter",
      icon: Keyboard,
    },
  ] as const;

export const randomYesNoModePillClass = (selected: boolean): string =>
  selected
    ? "border-emerald-500 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500/30"
    : "border-border/80 bg-background text-foreground hover:border-emerald-500/40 hover:bg-emerald-500/5";

export const randomYesNoAnimationPillClass = (selected: boolean): string =>
  selected
    ? "border-violet-500 bg-violet-500/10 text-foreground ring-1 ring-violet-500/30"
    : "border-border/80 bg-background text-foreground hover:border-violet-500/40 hover:bg-violet-500/5";
