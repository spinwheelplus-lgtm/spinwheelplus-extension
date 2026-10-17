import { RANDOM_YES_NO_MIN_CUSTOM_ANSWERS } from "@/types/random-yes-no";

/** One non-empty trimmed line per answer. */
export const parseCustomAnswers = (raw: string): string[] => {
  const seen = new Set<string>();
  const answers: string[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    answers.push(trimmed);
  }

  return answers;
};

export const validateCustomAnswers = (
  answers: readonly string[],
): string | null => {
  if (answers.length < RANDOM_YES_NO_MIN_CUSTOM_ANSWERS) {
    return `Minimum ${RANDOM_YES_NO_MIN_CUSTOM_ANSWERS} answers required`;
  }
  return null;
};
