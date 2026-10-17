import { ChevronDown, Download, File, RotateCcw, Upload } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { downloadFlipCoinTable } from "@/lib/coin-flip/export-flip-coin-table";
import { parseFlipCoinTableImportText } from "@/lib/coin-flip/flip-a-coin-table-export-format";
import type { FlipCoinFaceStyle } from "@/lib/coin-flip/flip-coin-face-style";
import type { FlipCoinClickFlipMode, FlipCoinSlot } from "@/types/coin-flip";

type CoinTableActionsProps = {
  coinSlots: readonly FlipCoinSlot[];
  clickFlipMode: FlipCoinClickFlipMode;
  faceStyle: FlipCoinFaceStyle;
  disabled: boolean;
  isDefaultCoinTable: boolean;
  onImportCoins: (
    slots: FlipCoinSlot[],
    clickFlipMode?: FlipCoinClickFlipMode,
    faceStyle?: FlipCoinFaceStyle,
  ) => void;
  onResetCoins: () => void;
  className?: string;
};

export const CoinTableActions = ({
  coinSlots,
  clickFlipMode,
  faceStyle,
  disabled,
  isDefaultCoinTable,
  onImportCoins,
  onResetCoins,
  className,
}: CoinTableActionsProps) => {
  const messages = useMessages();
  const common = messages.ui.common;
  const coinUi = messages.ui.coin;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    if (!setupOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setSetupOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setSetupOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [setupOpen]);

  return (
    <nav
      aria-label={coinUi.nav}
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 sm:justify-start",
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={async (event: ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file == null) return;
          try {
            const parsed = parseFlipCoinTableImportText(await file.text());
            if (!parsed.ok) {
              toast.error(parsed.error);
              return;
            }
            onImportCoins(parsed.slots, parsed.clickFlipMode, parsed.faceStyle);
            toast.success(coinUi.setupImported);
          } catch {
            toast.error(common.couldNotReadFile);
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        disabled={disabled || isDefaultCoinTable}
        aria-label={coinUi.reset}
        onClick={onResetCoins}
      >
        <RotateCcw className="size-4 shrink-0" aria-hidden />
        {common.resetDefault}
      </Button>
      <div ref={menuRef} className="relative" data-prevent-spin-space="">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          aria-label={messages.wheelFile}
          aria-expanded={setupOpen}
          aria-haspopup="menu"
          onClick={() => setSetupOpen((value) => !value)}
        >
          <File className="size-4 shrink-0" aria-hidden />
          {messages.wheelFile}
          <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
        </Button>
        {setupOpen ? (
          <div className="absolute top-9 left-0 z-40 min-w-44 rounded-xl border border-border bg-popover p-1 shadow-lg">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted disabled:opacity-50"
              disabled={coinSlots.length === 0}
              onClick={() => {
                downloadFlipCoinTable(coinSlots, clickFlipMode, faceStyle);
                toast.success(coinUi.setupDownload);
                setSetupOpen(false);
              }}
            >
              <Download className="size-4 shrink-0" aria-hidden />
              {common.exportSetup}
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted disabled:opacity-50"
              disabled={disabled}
              onClick={() => {
                setSetupOpen(false);
                fileInputRef.current?.click();
              }}
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              {common.importSetup}
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};
