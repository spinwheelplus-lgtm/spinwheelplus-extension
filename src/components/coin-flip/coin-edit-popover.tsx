import { useEffect, useRef, useState, type ReactNode } from "react";

import FlipACoinCoinThumb from "@/components/coin-flip/coin-thumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import type { FlipCoinMetal } from "@/lib/coin-flip/flip-a-coin-assets";
import { FLIP_COIN_METAL_OPTIONS } from "@/lib/coin-flip/flip-a-coin-metal-options";
import {
  FLIP_A_COIN_COIN_TILE_ENABLED_CLASS,
  FLIP_A_COIN_METAL_ACTIVE_CLASS,
  FLIP_A_COIN_MUTED_TEXT_CLASS,
} from "@/lib/coin-flip/flip-a-coin-surface-classes";

type CoinEditPopoverProps = {
  metal: FlipCoinMetal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (metal: FlipCoinMetal) => void;
  disabled?: boolean;
  triggerLabel: string;
  children: ReactNode;
};

export const CoinEditPopover = ({
  metal,
  open,
  onOpenChange,
  onConfirm,
  disabled = false,
  triggerLabel,
  children,
}: CoinEditPopoverProps) => {
  const messages = useMessages();
  const coinUi = messages.ui.coin;
  const metalLabel = {
    gold: coinUi.gold,
    silver: coinUi.silver,
    copper: coinUi.copper,
  };
  const [draftMetal, setDraftMetal] = useState<FlipCoinMetal>(metal);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setDraftMetal(metal);
  }, [metal, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      onOpenChange(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={rootRef} className="relative" data-prevent-spin-space="">
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "rounded-full p-0.5 ring-2 ring-transparent transition-[transform,filter,box-shadow,ring-color] duration-150",
          disabled
            ? "cursor-not-allowed opacity-45"
            : FLIP_A_COIN_COIN_TILE_ENABLED_CLASS,
        )}
        aria-label={triggerLabel}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        {children}
      </button>
      {open ? (
        <div className="absolute top-16 left-0 z-40 w-64 rounded-xl border border-border bg-popover p-3 shadow-lg">
          <p className="text-sm font-semibold">{coinUi.style}</p>
          <p className={cn("text-xs", FLIP_A_COIN_MUTED_TEXT_CLASS)}>
            {coinUi.styleHelp}
          </p>
          <div
            className="mt-3 flex flex-wrap items-center justify-center gap-2.5"
            role="radiogroup"
            aria-label={coinUi.metal}
          >
            {FLIP_COIN_METAL_OPTIONS.map((option) => {
              const isActive = draftMetal === option.metal;
              return (
                <button
                  key={option.metal}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  disabled={disabled}
                  onClick={() => setDraftMetal(option.metal)}
                  className={cn(
                    "rounded-full p-0.5 ring-2 ring-transparent",
                    isActive && FLIP_A_COIN_METAL_ACTIVE_CLASS,
                    disabled
                      ? "cursor-not-allowed opacity-45"
                      : FLIP_A_COIN_COIN_TILE_ENABLED_CLASS,
                  )}
                  aria-label={metalLabel[option.metal]}
                >
                  <FlipACoinCoinThumb metal={option.metal} variant="add" />
                </button>
              );
            })}
          </div>
          <p className={cn("mt-2 text-center text-xs", FLIP_A_COIN_MUTED_TEXT_CLASS)}>
            {fillTemplate(coinUi.selectedMetal, {
              name: metalLabel[draftMetal],
            })}
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {messages.ui.common.cancel}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onConfirm(draftMetal);
                onOpenChange(false);
              }}
            >
              {messages.ui.common.ok}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
