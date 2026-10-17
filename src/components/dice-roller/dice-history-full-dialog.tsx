import { History, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

import { DiceHistoryActions } from "@/components/dice-roller/dice-history-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  formatRollDiceHistoryGeneratedAt,
  formatRollDiceHistoryRelativeTime,
} from "@/lib/dice-roller/format-roll-dice-history-time";
import { getRollDiceHistoryRowCopy } from "@/lib/dice-roller/roll-dice-history-entry";
import { ROLL_A_DICE_RESULT_TOTAL_LG_CLASS } from "@/lib/dice-roller/roll-a-dice-surface-classes";
import { SPIN_HISTORY_DIALOG_HEADER_BACKGROUND } from "@/lib/spin-history";
import type { RollDiceHistoryEntry } from "@/types/dice-roller";
import { ROLL_DICE_HISTORY_LIMIT } from "@/types/dice-roller";

type DiceHistoryFullDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: readonly RollDiceHistoryEntry[];
  onClearHistory: () => void;
};

const CLOSE_MS = 200;

export const DiceHistoryFullDialog = ({
  open,
  onOpenChange,
  history,
  onClearHistory,
}: DiceHistoryFullDialogProps) => {
  const [leaving, setLeaving] = useState(false);
  const closeTimer = useRef(0);
  const diceUi = useMessages().ui.dice;

  useEffect(() => {
    if (open) setLeaving(false);
  }, [open]);

  useEffect(
    () => () => window.clearTimeout(closeTimer.current),
    [],
  );

  const requestClose = () => {
    if (!open || leaving) return;
    setLeaving(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      onOpenChange(false);
    }, CLOSE_MS);
  };

  return (
    <Drawer.Root
      open={open}
      dismissible
      shouldScaleBackground={false}
      onOpenChange={(next) => {
        if (next) onOpenChange(true);
        else requestClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/45 transition-opacity duration-200",
            leaving && "opacity-0",
          )}
          onClick={requestClose}
        />
        <Drawer.Content
          className={cn(
            "fixed z-50 flex items-center justify-center bg-transparent p-0 shadow-none outline-none after:hidden",
            "!inset-0 !top-0 !right-0 !bottom-0 !left-0 !mt-0 !h-full !max-h-none !w-full !max-w-none",
            "!translate-x-0 !translate-y-0",
          )}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) requestClose();
          }}
        >
          <div
            className={cn(
              "pointer-events-auto flex max-h-[90%] w-[min(90%,32rem)] flex-col overflow-hidden rounded-2xl bg-card shadow-xl",
              "transition-transform duration-200 ease-in",
              leaving ? "translate-y-[120%]" : "translate-y-0",
            )}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div
              className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 py-3"
              style={{ background: SPIN_HISTORY_DIALOG_HEADER_BACKGROUND }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <History className="size-5 shrink-0 text-primary" aria-hidden />
                <Drawer.Title className="text-base font-semibold">
                  {diceUi.allResults}
                </Drawer.Title>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label={diceUi.closeHistory}
                onClick={requestClose}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
            <Drawer.Description className="sr-only">
              {fillTemplate(diceUi.savedRolls, {
                count: history.length,
                max: ROLL_DICE_HISTORY_LIMIT,
              })}
            </Drawer.Description>
            <p className="shrink-0 border-b border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
              {fillTemplate(diceUi.savedRolls, {
                count: history.length,
                max: ROLL_DICE_HISTORY_LIMIT,
              })}
            </p>
            <ul
              className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-y-contain px-4 py-4"
              aria-label={diceUi.allResults}
            >
              {history.map((entry) => {
                const row = getRollDiceHistoryRowCopy(entry);
                return (
                  <li key={entry.id}>
                    <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="tabular-nums">
                          <span className={ROLL_A_DICE_RESULT_TOTAL_LG_CLASS}>
                            {row.primary}
                          </span>
                          {row.modifierLabel != null ? (
                            <span className="ml-2 text-sm text-muted-foreground">
                              {row.modifierLabel}
                            </span>
                          ) : null}
                          {row.breakdown != null ? (
                            <span className="ml-2 text-sm text-muted-foreground">
                              {row.breakdown}
                            </span>
                          ) : null}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatRollDiceHistoryRelativeTime(entry.rolledAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.65rem] text-muted-foreground">
                        {formatRollDiceHistoryGeneratedAt(entry.rolledAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <DiceHistoryActions
              history={history}
              onClear={onClearHistory}
              showClose
              onClose={requestClose}
              className="shrink-0 border-t border-border/60 bg-muted/20 px-4 py-3"
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
