import { ChevronDown, Download, File, RotateCcw, Upload } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { downloadRollDiceTable } from "@/lib/dice-roller/export-roll-dice-table";
import { parseRollDiceTableImportText } from "@/lib/dice-roller/roll-a-dice-table-export-format";
import type { RollDiceClickRollMode, RollDiceSlot } from "@/types/dice-roller";

type DiceTableActionsProps = {
  diceSlots: readonly RollDiceSlot[];
  modifier: number;
  clickRollMode: RollDiceClickRollMode;
  disabled: boolean;
  isDefaultDiceTable: boolean;
  onImportDice: (
    slots: RollDiceSlot[],
    modifier?: number,
    clickRollMode?: RollDiceClickRollMode,
  ) => void;
  onResetDice: () => void;
  className?: string;
};

export const DiceTableActions = ({
  diceSlots,
  modifier,
  clickRollMode,
  disabled,
  isDefaultDiceTable,
  onImportDice,
  onResetDice,
  className,
}: DiceTableActionsProps) => {
  const messages = useMessages();
  const diceUi = messages.ui.dice;
  const common = messages.ui.common;
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

  const handleExport = () => {
    downloadRollDiceTable(diceSlots, modifier, clickRollMode);
    toast.success(diceUi.setupDownload);
    setSetupOpen(false);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file == null) return;
    try {
      const text = await file.text();
      const parsed = parseRollDiceTableImportText(text);
      if (!parsed.ok) {
        toast.error(parsed.error);
        return;
      }
      onImportDice(parsed.slots, parsed.modifier, parsed.clickRollMode);
      toast.success(diceUi.setupImported);
    } catch {
      toast.error(common.couldNotReadFile);
    }
  };

  return (
    <nav
      aria-label={diceUi.nav}
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
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        disabled={disabled || isDefaultDiceTable}
        aria-label={diceUi.reset}
        onClick={onResetDice}
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
              disabled={diceSlots.length === 0}
              onClick={handleExport}
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
