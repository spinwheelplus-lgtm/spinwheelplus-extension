import type { RandomYesNoAnswerMode } from "@/types/random-yes-no";

const YES_NO_POOL = ["YES", "NO"] as const;
const YES_NO_MAYBE_POOL = ["YES", "NO", "MAYBE"] as const;
const TRUE_FALSE_POOL = ["TRUE", "FALSE"] as const;

export const resolveRandomYesNoAnswerPool = (
  mode: RandomYesNoAnswerMode,
  customAnswers: readonly string[],
): readonly string[] => {
  switch (mode) {
    case "yes_no":
      return YES_NO_POOL;
    case "yes_no_maybe":
      return YES_NO_MAYBE_POOL;
    case "true_false":
      return TRUE_FALSE_POOL;
    case "custom":
      return customAnswers;
  }
};
