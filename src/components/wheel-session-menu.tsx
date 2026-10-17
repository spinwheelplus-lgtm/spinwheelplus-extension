import {
  History,
  Maximize2,
  Minimize2,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { useWheelStore } from "@/store/wheel-store";

const MENU_ID = "sidepanel-wheel-session-menu";

const ROW_CLASS =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

type WheelSessionMenuProps = {
  immersive: boolean;
  spinning: boolean;
  onOpenHistory: () => void;
  onToggleImmersive: () => void;
};

export const WheelSessionMenu = ({
  immersive,
  spinning,
  onOpenHistory,
  onToggleImmersive,
}: WheelSessionMenuProps) => {
  const messages = useMessages();
  const wheel = messages.ui.wheel;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const soundEnabled = useWheelStore((s) => s.customize.soundEnabled);
  const setCustomize = useWheelStore((s) => s.setCustomize);

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
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className={cn(
          "pointer-events-auto size-11 rounded-full border border-border/80 bg-card p-0 text-foreground shadow-md",
          "hover:bg-muted",
          open && "bg-muted",
        )}
        aria-label={wheel.displayOptions}
        title={wheel.displayOptions}
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-haspopup="dialog"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <Settings className="size-5" aria-hidden />
      </Button>
      {open ? (
        <div
          id={MENU_ID}
          role="dialog"
          aria-label={wheel.displayOptions}
          className="pointer-events-auto absolute right-0 bottom-full z-30 mb-2.5 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg"
        >
          <div className="flex flex-col">
            <button
              type="button"
              className={ROW_CLASS}
              onClick={() => {
                onToggleImmersive();
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
          </div>
          <div className="my-1 h-px bg-border/60" role="separator" />
          <div className="flex flex-col">
            <button
              type="button"
              className={ROW_CLASS}
              disabled={spinning}
              onClick={() => {
                if (spinning) return;
                onOpenHistory();
                setOpen(false);
              }}
            >
              <History className="size-4 shrink-0" aria-hidden />
              <span>{messages.ui.common.viewResultHistory}</span>
            </button>
            <button
              type="button"
              className={ROW_CLASS}
              onClick={() => {
                setCustomize({ soundEnabled: !soundEnabled });
              }}
            >
              {soundEnabled ? (
                <Volume2 className="size-4 shrink-0" aria-hidden />
              ) : (
                <VolumeX className="size-4 shrink-0" aria-hidden />
              )}
              <span>{soundEnabled ? wheel.soundOn : wheel.soundOff}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
