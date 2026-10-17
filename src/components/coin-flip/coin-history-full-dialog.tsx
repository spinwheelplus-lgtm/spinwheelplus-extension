import { History, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

import { CoinHistoryActions } from "@/components/coin-flip/coin-history-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  formatFlipCoinHistoryBreakdown,
  formatFlipCoinHistorySummary,
  speakClassicCoinWords,
} from "@/lib/coin-flip/format-flip-coin-history-entry";
import {
  formatFlipCoinHistoryGeneratedAt,
  formatFlipCoinHistoryRelativeTime,
} from "@/lib/coin-flip/format-flip-coin-history-time";
import { FLIP_A_COIN_RESULT_TOTAL_LG_CLASS } from "@/lib/coin-flip/flip-a-coin-surface-classes";
import { SPIN_HISTORY_DIALOG_HEADER_BACKGROUND } from "@/lib/spin-history";
import {
  FLIP_COIN_HISTORY_LIMIT,
  type FlipCoinHistoryEntry,
} from "@/types/coin-flip";

type CoinHistoryFullDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: readonly FlipCoinHistoryEntry[];
  onClearHistory: () => void;
};

const CLOSE_MS = 200;

export const CoinHistoryFullDialog = ({
  open,
  onOpenChange,
  history,
  onClearHistory,
}: CoinHistoryFullDialogProps) => {
  const [leaving, setLeaving] = useState(false);
  const closeTimer = useRef(0);
  const coinUi = useMessages().ui.coin;

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
    closeTimer.current = window.setTimeout(() => onOpenChange(false), CLOSE_MS);
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
                  {coinUi.allResults}
                </Drawer.Title>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={coinUi.closeHistory}
                onClick={requestClose}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
            <Drawer.Description className="sr-only">
              {fillTemplate(coinUi.historyHelp, {
                max: FLIP_COIN_HISTORY_LIMIT,
              })}
            </Drawer.Description>
            <ul
              className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4"
              aria-label={coinUi.allResults}
            >
              {history.map((entry) => {
                const breakdown = formatFlipCoinHistoryBreakdown(entry);
                return (
                  <li key={entry.id}>
                    <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="tabular-nums">
                          <span className={FLIP_A_COIN_RESULT_TOTAL_LG_CLASS}>
                            {speakClassicCoinWords(
                              formatFlipCoinHistorySummary(entry),
                              coinUi.heads,
                              coinUi.tails,
                            )}
                          </span>
                          {breakdown != null ? (
                            <span className="ml-2 text-sm text-muted-foreground">
                              {breakdown}
                            </span>
                          ) : null}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatFlipCoinHistoryRelativeTime(entry.flipped_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.65rem] text-muted-foreground">
                        {formatFlipCoinHistoryGeneratedAt(entry.flipped_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <CoinHistoryActions
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
