import { History, Trash2, Trophy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  SPIN_HISTORY_DIALOG_HEADER_BACKGROUND,
  formatSpinHistoryTimestamp,
  getSpinHistoryAccent,
} from "@/lib/spin-history";
import { resolveSpinHistoryRowDisplay } from "@/lib/spin-history-display";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { useWheelStore } from "@/store/wheel-store";

type SpinHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CLOSE_MS = 200;

export const SpinHistoryDialog = ({
  open,
  onOpenChange,
}: SpinHistoryDialogProps) => {
  const rows = useWheelStore((s) => s.spinHistory);
  const items = useWheelStore((s) => s.items);
  const clearSpinHistory = useWheelStore((s) => s.clearSpinHistory);
  const { common, wheel: wheelUi } = useMessages().ui;
  const latest = rows[0];
  const hasRows = rows.length > 0;
  const [leaving, setLeaving] = useState(false);
  const closeTimer = useRef(0);

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

  const latestDisplay = latest
    ? resolveSpinHistoryRowDisplay({
        name: latest.name,
        imageSrc: items.find((entry) => entry.id === latest.itemId)
          ?.imageDataUrl,
      })
    : null;

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
          data-vaul-animate={leaving ? "false" : undefined}
          onClick={requestClose}
        />
        <Drawer.Content
          data-vaul-animate={leaving ? "false" : undefined}
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
            data-dialog-panel
            className={cn(
              "pointer-events-auto flex max-h-[90%] w-[min(90%,600px)] flex-col overflow-hidden rounded-2xl bg-card shadow-xl",
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
              <History className="size-5 shrink-0 text-primary dark:text-sky-400" aria-hidden />
              <Drawer.Title className="text-base font-semibold">
                {common.resultHistory}
              </Drawer.Title>
            </div>
            <button
              type="button"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={common.close}
              title={common.close}
              onClick={requestClose}
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <Drawer.Description className="sr-only">
            Spin results from this wheel, newest first.
          </Drawer.Description>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 py-4">
            {hasRows && latest ? (
              <>
                <div className="relative shrink-0 overflow-hidden rounded-2xl border border-emerald-200/70 bg-emerald-50 p-4 dark:border-emerald-800/70 dark:bg-emerald-950/50">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-emerald-50 shadow-sm ring-4 ring-emerald-100 dark:ring-emerald-900">
                      <Trophy className="size-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-xs tracking-wide text-muted-foreground uppercase">
                        Latest Result
                      </p>
                      <p
                        className="truncate text-xl leading-tight font-bold text-emerald-700 dark:text-emerald-300"
                        title={latestDisplay?.ariaLabel}
                      >
                        {latestDisplay?.label || latestDisplay?.ariaLabel}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {fillTemplate(wheelUi.historyLead, { count: rows.length })}
                </p>
                <ul
                  className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overscroll-contain"
                  aria-label={wheelUi.historyList}
                >
                  {rows.map((item, index) => {
                    const accent = getSpinHistoryAccent(index);
                    const display = resolveSpinHistoryRowDisplay({
                      name: item.name,
                      imageSrc: items.find((entry) => entry.id === item.itemId)
                        ?.imageDataUrl,
                    });
                    return (
                      <li
                        key={item.id}
                        className="flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/25 py-1 pr-1.5 pl-2"
                        aria-label={`${display.ariaLabel}, ${formatSpinHistoryTimestamp(item.timestamp)}`}
                      >
                        <span
                          className={cn(
                            "inline-flex size-7 shrink-0 items-center justify-center rounded-[6px] text-[10px] leading-none font-semibold tabular-nums",
                            accent.badgeClassName,
                          )}
                        >
                          #{index + 1}
                        </span>
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          {display.imageSrc ? (
                            <img
                              src={display.imageSrc}
                              alt=""
                              className="size-7 rounded object-cover"
                            />
                          ) : (
                            <span
                              className={cn(
                                "min-w-0 flex-1 truncate text-left text-base font-medium",
                                accent.nameClassName,
                              )}
                            >
                              {display.label}
                            </span>
                          )}
                          <span className="shrink-0 text-right text-[10px] leading-none whitespace-nowrap text-muted-foreground">
                            {formatSpinHistoryTimestamp(item.timestamp)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-border/80 bg-muted/25 px-4 py-3">
            <div className="flex gap-2">
              {hasRows ? (
                <Button
                  type="button"
                  variant="destructive"
                  className="min-w-0 flex-1 gap-2 border border-destructive/25"
                  title={common.clearAllHistory}
                  onClick={() => {
                    clearSpinHistory();
                    requestClose();
                  }}
                >
                  <Trash2 className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{common.clearAllHistory}</span>
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "bg-background",
                  hasRows ? "min-w-0 flex-1" : "w-full",
                )}
                title={common.close}
                onClick={requestClose}
              >
                {common.close}
              </Button>
            </div>
          </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
