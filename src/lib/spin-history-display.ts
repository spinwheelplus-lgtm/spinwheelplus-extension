export const SPIN_HISTORY_IMAGE_PRIZE_LABEL = "Image prize";
export const SPIN_HISTORY_UNTITLED_LABEL = "Untitled";

export type SpinHistoryRowDisplay = {
  label: string;
  ariaLabel: string;
  imageSrc: string | null;
};

/** Named slices stay text. Image-only slices show a live thumb. */
export const resolveSpinHistoryRowDisplay = ({
  name,
  imageSrc,
}: {
  name: string;
  imageSrc?: string | null;
}): SpinHistoryRowDisplay => {
  const label = name.trim();
  const img = imageSrc?.trim() || null;

  if (label) {
    return { label, ariaLabel: label, imageSrc: null };
  }

  if (img) {
    return {
      label: "",
      ariaLabel: SPIN_HISTORY_IMAGE_PRIZE_LABEL,
      imageSrc: img,
    };
  }

  return {
    label: SPIN_HISTORY_UNTITLED_LABEL,
    ariaLabel: SPIN_HISTORY_UNTITLED_LABEL,
    imageSrc: null,
  };
};
