import { History, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

import { ShuffleListHistoryActions } from "@/components/shuffle-list/shuffle-list-history-actions";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  formatRandomNameGeneratedAt,
  formatRandomNameRelativeTime,
} from "@/lib/random-name/format-random-name-time";
import { SPIN_HISTORY_DIALOG_HEADER_BACKGROUND } from "@/lib/spin-history";
import type { ShuffleListHistoryEntry } from "@/types/shuffle-list";

type ShuffleListHistoryFullDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: readonly ShuffleListHistoryEntry[];
  activeHistoryId: string | null;
  onSelectEntry: (id: string) => void;
  onClearHistory: () => void;
};

const CLOSE_MS = 200;

export const ShuffleListHistoryFullDialog = ({
  open,
  onOpenChange,
  history,
  activeHistoryId,
  onSelectEntry,
  onClearHistory,
}: ShuffleListHistoryFullDialogProps) => {
  const [leaving, setLeaving] = useState(false);
  const closeTimer = useRef(0);
  const { common, shuffle: shuffleUi } = useMessages().ui;

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
                  {common.fullHistory}
                </Drawer.Title>
              </div>
              <button
                type="button"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={shuffleUi.closeHistory}
                title={common.close}
                onClick={requestClose}
              >
                <X className="size-4" />
              </button>
            </div>
            <Drawer.Description className="sr-only">
              {fillTemplate(shuffleUi.savedLead, { count: history.length })}
            </Drawer.Description>
            <ul
              className="flex-1 space-y-2 overflow-y-auto px-4 py-4"
              aria-label={shuffleUi.allHistory}
            >
              {history.map((entry) => {
                const isActive = entry.id === activeHistoryId;
                const preview = entry.items.slice(0, 4).join(", ");
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectEntry(entry.id);
                        requestClose();
                      }}
                      className={cn(
                        "w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-left hover:bg-muted",
                        isActive && "border-primary bg-card ring-2 ring-primary/20",
                      )}
                    >
                      <p className="text-sm font-medium text-foreground">
                        {fillTemplate(shuffleUi.itemCount, {
                          count: entry.items.length,
                        })}
                      </p>
                      <p
                        className="mt-1 line-clamp-2 text-xs text-muted-foreground"
                        title={entry.items.join(", ")}
                      >
                        {preview}
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {formatRandomNameRelativeTime(entry.generatedAt)}
                        <span className="mx-1.5 text-foreground/25">·</span>
                        {formatRandomNameGeneratedAt(entry.generatedAt)}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
            <ShuffleListHistoryActions
              className="border-t border-border bg-muted/25 px-4 py-3"
              history={history}
              onClear={onClearHistory}
              showClose
              onClose={requestClose}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
