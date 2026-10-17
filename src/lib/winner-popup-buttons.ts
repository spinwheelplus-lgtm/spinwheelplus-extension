export type WinnerPopupButtonMode =
  | "close_only"
  | "remove_only"
  | "close_and_remove";

export const DEFAULT_WINNER_POPUP_BUTTON_MODE: WinnerPopupButtonMode =
  "close_and_remove";

export const WINNER_POPUP_BUTTON_MODE_OPTIONS = [
  { label: "Close", value: "close_only" },
  { label: "Remove", value: "remove_only" },
  { label: "Close & Remove", value: "close_and_remove" },
] as const;

export const readWinnerPopupButtonMode = (
  value: unknown,
): WinnerPopupButtonMode => {
  if (value === "close" || value === "close_only") return "close_only";
  if (value === "remove" || value === "remove_only") return "remove_only";
  if (value === "close_and_remove") return "close_and_remove";
  return DEFAULT_WINNER_POPUP_BUTTON_MODE;
};
