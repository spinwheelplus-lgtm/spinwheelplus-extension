export const RANDOM_YES_NO_ANSWER_SLOT_CLASS =
  "relative flex h-32 w-full items-center justify-center px-2 sm:h-36";

export const RANDOM_YES_NO_EMPTY_ANSWER_LABEL = "N/A";

export const RANDOM_YES_NO_ANSWER_TEXT_BASE_CLASS =
  "max-h-full max-w-full text-center font-extrabold leading-none tracking-tight break-words";

export const RANDOM_YES_NO_ANSWER_TEXT_ANIMATING_CLASS =
  "text-[clamp(2.25rem,10vw,3.75rem)]";

export const resolveRandomYesNoAnswerTextScaleClass = (
  text: string,
  isExpanded = false,
): string => {
  if (isExpanded) {
    if (text.length > 14) {
      return "text-5xl leading-tight sm:text-6xl md:text-7xl";
    }
    if (text.length > 8) {
      return "text-6xl leading-tight sm:text-7xl md:text-8xl";
    }
    return "text-7xl leading-tight sm:text-8xl md:text-9xl";
  }
  if (text.length > 14) {
    return "text-[clamp(2rem,9vw,3.25rem)]";
  }
  if (text.length > 8) {
    return "text-[clamp(2.5rem,11vw,4rem)]";
  }
  return "text-[clamp(3rem,14vw,5rem)]";
};
