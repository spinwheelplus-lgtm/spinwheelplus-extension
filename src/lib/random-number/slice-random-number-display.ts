import { RANDOM_NUMBER_RESULT_DISPLAY_LIMIT } from "@/types/random-number";

export type RandomNumberDisplaySlice = {
  visible: number[];
  hiddenCount: number;
  totalCount: number;
};

export const sliceRandomNumberDisplay = (
  numbers: readonly number[],
): RandomNumberDisplaySlice => {
  const totalCount = numbers.length;
  if (totalCount <= RANDOM_NUMBER_RESULT_DISPLAY_LIMIT) {
    return {
      visible: [...numbers],
      hiddenCount: 0,
      totalCount,
    };
  }

  return {
    visible: numbers.slice(0, RANDOM_NUMBER_RESULT_DISPLAY_LIMIT),
    hiddenCount: totalCount - RANDOM_NUMBER_RESULT_DISPLAY_LIMIT,
    totalCount,
  };
};
