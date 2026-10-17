import {
  History,
  Maximize2,
  Minimize2,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CoinHistoryFullDialog } from "@/components/coin-flip/coin-history-full-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { useCoinFlipStore } from "@/store/coin-flip-store";
import { useImmersiveStore } from "@/store/immersive-store";
import type {
  FlipCoinClickFlipMode,
  FlipCoinHistoryEntry,
} from "@/types/coin-flip";

const MENU_ID = "coin-table-session-menu";
const ROW_CLASS =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

const CLICK_OPTIONS: ReadonlyArray<{
  value: FlipCoinClickFlipMode;
  label: string;
}> = [
  { value: "all", label: "Flip all coins" },
  { value: "one", label: "Flip one coin" },
];

type CoinSessionMenuProps = {
  history: readonly FlipCoinHistoryEntry[];
  onClearHistory: () => void;
  settingsDisabled?: boolean;
};

export const CoinSessionMenu = ({
  history,
  onClearHistory,
  settingsDisabled = false,
}: CoinSessionMenuProps) => {
  const messages = useMessages();
  const coinUi = messages.ui.coin;
  const wheel = messages.ui.wheel;
  const clickLabel = { all: coinUi.flipAll, one: coinUi.flipOne };
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const immersive = useImmersiveStore((state) => state.immersive);
  const toggleImmersive = useImmersiveStore((state) => state.toggleImmersive);
  const soundOn = useCoinFlipStore((state) => state.soundOn);
  const toggleSound = useCoinFlipStore((state) => state.toggleSound);
  const clickFlipMode = useCoinFlipStore((state) => state.clickFlipMode);
  const setClickFlipMode = useCoinFlipStore((state) => state.setClickFlipMode);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute right-3 bottom-3 z-30 overflow-visible"
      data-prevent-spin-space=""
    >
      <CoinHistoryFullDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={history}
        onClearHistory={() => {
          onClearHistory();
          setHistoryOpen(false);
        }}
      />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className={cn(
          "pointer-events-auto size-11 rounded-full border border-border/80 bg-card p-0 text-foreground shadow-md hover:bg-muted",
          open && "bg-muted",
        )}
        aria-label={coinUi.tableOptions}
        title={coinUi.tableOptions}
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((value) => !value)}
      >
        <Settings className="size-5" aria-hidden />
      </Button>
      {open ? (
        <div
          id={MENU_ID}
          role="dialog"
          aria-label={coinUi.tableOptions}
          className="pointer-events-auto absolute right-0 bottom-full z-40 mb-2.5 w-60 rounded-xl border border-border/80 bg-popover p-1.5 shadow-xl"
        >
          <button
            type="button"
            className={ROW_CLASS}
            onClick={() => {
              toggleImmersive();
              setOpen(false);
            }}
          >
            {immersive ? (
              <Minimize2 className="size-4 shrink-0" aria-hidden />
            ) : (
              <Maximize2 className="size-4 shrink-0" aria-hidden />
            )}
            <span>{immersive ? wheel.exitFullscreen : wheel.fullscreen}</span>
          </button>
          <div className="my-1 h-px bg-border/80" />
          <p className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
            {coinUi.clickOnCoin}
          </p>
          {CLICK_OPTIONS.map((option) => {
            const selected = clickFlipMode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={settingsDisabled}
                className={ROW_CLASS}
                onClick={() => setClickFlipMode(option.value)}
              >
                <span
                  className={cn(
                    "size-3.5 shrink-0 rounded-full border-2",
                    selected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/50 bg-transparent",
                  )}
                  aria-hidden
                />
                <span>{clickLabel[option.value]}</span>
              </button>
            );
          })}
          <div className="my-1 h-px bg-border/80" />
          <button
            type="button"
            className={ROW_CLASS}
            onClick={() => {
              setHistoryOpen(true);
              setOpen(false);
            }}
          >
            <History className="size-4 shrink-0" aria-hidden />
            <span>{coinUi.viewHistory}</span>
          </button>
          <button type="button" className={ROW_CLASS} onClick={toggleSound}>
            {soundOn ? (
              <Volume2 className="size-4 shrink-0" aria-hidden />
            ) : (
              <VolumeX className="size-4 shrink-0" aria-hidden />
            )}
            <span>{soundOn ? wheel.soundOn : wheel.soundOff}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
};
