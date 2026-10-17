import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { pickWheelTextColor } from "@/lib/item-color";
import { randomIndex } from "@/lib/random";

export const RESULT_POPUP_SKIN_IDS = [
  "classic",
  "tape",
  "chalk",
  "broadcast",
] as const;

export type ResultPopupSkinId = (typeof RESULT_POPUP_SKIN_IDS)[number];

/** Invalid saved values. New wheels use `pickRandomResultPopupSkin`. */
export const DEFAULT_RESULT_POPUP_SKIN: ResultPopupSkinId = "tape";

export const pickRandomResultPopupSkin = (): ResultPopupSkinId =>
  RESULT_POPUP_SKIN_IDS[randomIndex(RESULT_POPUP_SKIN_IDS.length)] ??
  DEFAULT_RESULT_POPUP_SKIN;

export const DEFAULT_WINNER_POPUP_TITLE = "Congratulations!";

export const RESULT_POPUP_SKIN_OPTIONS: ReadonlyArray<{
  id: ResultPopupSkinId;
  label: string;
}> = [
  { id: "classic", label: "Card" },
  { id: "tape", label: "Tape" },
  { id: "chalk", label: "Chalk" },
  { id: "broadcast", label: "Lower-third" },
];

export const RESULT_POPUP_SKIN_SELECT_OPTIONS: ReadonlyArray<{
  value: ResultPopupSkinId;
  label: string;
}> = RESULT_POPUP_SKIN_OPTIONS.map((option) => ({
  value: option.id,
  label: option.label,
}));

const SKIN_ID_SET = new Set<string>(RESULT_POPUP_SKIN_IDS);

const RESULT_POPUP_SKIN_ALIASES: Readonly<Record<string, ResultPopupSkinId>> = {
  burst: "broadcast",
  glass: "classic",
  arcade: "chalk",
  card: "classic",
};

export const isResultPopupSkinId = (
  value: unknown,
): value is ResultPopupSkinId =>
  typeof value === "string" && SKIN_ID_SET.has(value);

export const resolveResultPopupSkin = (raw: unknown): ResultPopupSkinId => {
  if (typeof raw !== "string") return DEFAULT_RESULT_POPUP_SKIN;
  const value = raw.trim().toLowerCase();
  if (isResultPopupSkinId(value)) return value;
  return RESULT_POPUP_SKIN_ALIASES[value] ?? DEFAULT_RESULT_POPUP_SKIN;
};

export const readWinnerPopupEnabled = (value: unknown): boolean =>
  value !== false;

export const readWinnerPopupTitle = (value: unknown): string => {
  if (typeof value !== "string") return DEFAULT_WINNER_POPUP_TITLE;
  const text = value.trim();
  return text.length > 0 ? text : DEFAULT_WINNER_POPUP_TITLE;
};

const TAPE_FALLBACK_FILL = "#ffb000";

export const resolveResultPopupTapeStyle = (
  headerStyle?: CSSProperties,
): Pick<CSSProperties, "backgroundColor" | "color"> => {
  const backgroundColor =
    typeof headerStyle?.backgroundColor === "string" &&
    headerStyle.backgroundColor.trim() !== ""
      ? headerStyle.backgroundColor.trim()
      : TAPE_FALLBACK_FILL;
  const color =
    typeof headerStyle?.color === "string" && headerStyle.color.trim() !== ""
      ? headerStyle.color.trim()
      : pickWheelTextColor(backgroundColor);
  return { backgroundColor, color };
};

export const resultPopupSkinUsesDarkChrome = (
  skin: ResultPopupSkinId,
): boolean =>
  skin === "tape" || skin === "chalk" || skin === "broadcast";

export const RESULT_POPUP_DIALOG_MAX_HEIGHT_CLASS = "max-h-[min(90dvh,36rem)]";

export const RESULT_POPUP_CARD_SHELL_CLASS =
  "flex min-h-0 w-full max-h-full flex-1 flex-col";

export const RESULT_POPUP_BODY_SCROLL_CLASS =
  "@container min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain";

export const RESULT_POPUP_TITLE_CLAMP_CLASS =
  "line-clamp-2 min-w-0 max-w-full break-words";

export const RESULT_POPUP_WINNER_NAME_CLASS = "min-w-0 break-words";

export const RESULT_POPUP_TAPE_NAME_CLASS =
  "min-w-0 max-w-full line-clamp-2 text-center";

export const RESULT_POPUP_TAPE_EXTRA_PANEL_CLASS =
  "mx-auto mt-2 w-[min(calc(100%-2rem),32rem)] max-h-[min(42dvh,22rem)] space-y-4 rounded-2xl bg-black/75 px-4 py-4 text-center shadow-[0_12px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/15 backdrop-blur-md";

export const RESULT_POPUP_IMAGE_CLASS =
  "h-auto w-auto max-h-[200cqw] max-w-full rounded-lg object-contain";

const RESULT_POPUP_DIALOG_SHELL_CLASS = cn(
  "flex min-h-0 min-w-0 w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[36rem]",
  RESULT_POPUP_DIALOG_MAX_HEIGHT_CLASS,
);

export const resultPopupDialogContentClassName = (
  skin: ResultPopupSkinId,
): string => {
  if (skin === "classic") return RESULT_POPUP_DIALOG_SHELL_CLASS;
  const framed = cn(
    RESULT_POPUP_DIALOG_SHELL_CLASS,
    "border-0 bg-transparent shadow-none ring-0",
  );
  if (skin === "chalk") return cn(framed, "px-2");
  if (skin === "tape") {
    return cn(
      "left-0 flex min-h-0 w-full max-w-none translate-x-0 flex-col gap-0 overflow-visible rounded-none border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-none",
      "max-h-[90dvh] pointer-events-none",
    );
  }
  if (skin === "broadcast") {
    return cn(
      "top-auto bottom-0 left-0 flex h-auto max-h-[90dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col justify-end gap-0 overflow-visible rounded-none border-0 bg-transparent p-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-none ring-0 sm:max-w-none",
    );
  }
  return framed;
};

export const resultPopupDialogContentStyle = (
  skin: ResultPopupSkinId,
): CSSProperties | undefined =>
  skin === "tape" ? { pointerEvents: "none" } : undefined;

export const resultPopupFooterRadiusClassName = (
  skin: ResultPopupSkinId,
): string | undefined => {
  if (skin === "classic") return undefined;
  if (skin === "tape") {
    return "mx-auto w-fit rounded-xl border-0 bg-black/55 py-2";
  }
  if (skin === "broadcast") {
    return "rounded-none border-0 bg-transparent px-0 py-0";
  }
  if (skin === "chalk") return "rounded-none";
  return "rounded-b-3xl";
};
