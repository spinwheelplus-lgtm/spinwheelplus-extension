/** Theme-aware Flip a Coin panel classes (mirrors roll-a-dice surface tokens). */

export const FLIP_A_COIN_TOOL_SHELL_CLASS =
    "w-full rounded-2xl border border-border/80 bg-muted/55 px-3 py-4 text-center shadow-sm ring-1 ring-foreground/10 dark:bg-muted/30 sm:px-5 sm:py-6";

export const FLIP_A_COIN_TOOL_SHELL_SKELETON_CLASS =
    "w-full min-h-[420px] animate-pulse rounded-2xl border border-border/80 bg-muted/55 ring-1 ring-foreground/10 dark:bg-muted/30";

export const FLIP_A_COIN_SUBPANEL_CLASS =
    "mt-5 rounded-xl border border-border/80 bg-card/85 px-4 py-4 text-left shadow-sm ring-1 ring-foreground/8 dark:bg-card/55";

/** Sibling card after the coin shell (Flip results). Matches the dice results card. */
export const FLIP_A_COIN_STANDALONE_PANEL_CLASS =
    "mt-3 w-full rounded-2xl border border-border/80 bg-card px-4 py-4 text-left shadow-sm ring-1 ring-foreground/10 dark:bg-card/80";

export const FLIP_A_COIN_MUTED_TEXT_CLASS = "text-muted-foreground";

export const FLIP_A_COIN_SECTION_HINT_CLASS =
    "mt-1 text-xs text-muted-foreground";

export const FLIP_A_COIN_SECTION_TITLE_CLASS =
    "m-0 text-base font-semibold leading-none text-foreground";

export const FLIP_A_COIN_SECTION_HELP_TRIGGER_CLASS =
    "size-6 cursor-pointer text-muted-foreground transition-[transform,background-color,color] duration-150 hover:bg-muted hover:text-foreground active:scale-95 active:bg-muted/80";

export const FLIP_A_COIN_COIN_TILE_ENABLED_CLASS =
    "cursor-pointer hover:scale-[1.05] hover:brightness-110 hover:shadow-[0_4px_14px_rgba(0,0,0,0.16)] hover:ring-foreground/20 active:scale-95 dark:hover:shadow-[0_4px_14px_rgba(0,0,0,0.35)]";

export const FLIP_A_COIN_REMOVE_BUTTON_CLASS =
    "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-sm ring-2 ring-background transition-[transform,background-color,box-shadow] duration-150 hover:scale-105 hover:bg-red-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";

export const FLIP_A_COIN_METAL_ACTIVE_CLASS =
    "ring-2 ring-amber-500/60 dark:ring-amber-400/50";

export const FLIP_A_COIN_RESULT_TOTAL_CLASS =
    "text-[1.35rem] font-bold text-amber-600 dark:text-amber-400";

export const FLIP_A_COIN_RESULT_TOTAL_INLINE_CLASS =
    "text-base font-bold text-amber-600 dark:text-amber-400";

export const FLIP_A_COIN_RESULT_TOTAL_LG_CLASS =
    "text-lg font-bold text-amber-600 dark:text-amber-400";

export const FLIP_A_COIN_HISTORY_ITEM_CLASS =
    "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 dark:bg-muted/20";

/** Primary flip action - matches roll-a-dice table panel button. */
export const FLIP_A_COIN_PRIMARY_ACTION_BUTTON_CLASS =
    "appearance-none border-0 px-12 py-4 text-base font-semibold rounded-[10px] cursor-pointer bg-gradient-to-b from-[#f0b84a] to-[#e8a838] text-[#1a1208] shadow-[0_4px_14px_rgba(232,168,56,0.3)] transition-[filter,transform] duration-150 hover:brightness-105 active:scale-[0.98] disabled:opacity-88 disabled:cursor-wait motion-safe:disabled:animate-pulse sm:px-20";
