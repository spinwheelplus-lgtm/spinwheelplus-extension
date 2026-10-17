export const truncateRandomYesNoAnswerLabel = (answer: string): string =>
  answer.length <= 5 ? answer : `${answer.slice(0, 4)}...`;
