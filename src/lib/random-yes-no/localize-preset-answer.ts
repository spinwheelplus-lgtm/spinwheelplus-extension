type YesNoPresetLabels = {
  presetYes: string;
  presetNo: string;
  presetMaybe: string;
  presetTrue: string;
  presetFalse: string;
};

/** Built-in YES/NO/MAYBE/TRUE/FALSE stay stored in English. Chrome shows the locale word. */
export const localizeYesNoPresetAnswer = (
  answer: string,
  labels: YesNoPresetLabels,
): string => {
  switch (answer) {
    case "YES":
      return labels.presetYes;
    case "NO":
      return labels.presetNo;
    case "MAYBE":
      return labels.presetMaybe;
    case "TRUE":
      return labels.presetTrue;
    case "FALSE":
      return labels.presetFalse;
    default:
      return answer;
  }
};
