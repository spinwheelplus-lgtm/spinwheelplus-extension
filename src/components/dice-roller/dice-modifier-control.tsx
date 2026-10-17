import { useEffect, useRef, useState } from "react";

import { HelpTip } from "@/components/ui/help-tip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  ROLL_DICE_MODIFIER_MAX,
  ROLL_DICE_MODIFIER_MIN,
  formatRollDiceModifierButtonLabel,
  parseRollDiceModifierInput,
} from "@/lib/dice-roller/roll-dice-modifier";
import {
  ROLL_A_DICE_DIE_TILE_ENABLED_CLASS,
  ROLL_A_DICE_MUTED_TEXT_CLASS,
} from "@/lib/dice-roller/roll-a-dice-surface-classes";

const MODIFIER_TILE_CLASS =
  "flex size-12 shrink-0 items-center justify-center rounded-full bg-zinc-700 font-bold text-white shadow-sm ring-2 ring-transparent transition-[transform,filter,box-shadow,ring-color] duration-150 dark:bg-zinc-600";

type DiceModifierControlProps = {
  modifier: number;
  onModifierChange: (value: number) => void;
  disabled?: boolean;
};

export const DiceModifierControl = ({
  modifier,
  onModifierChange,
  disabled = false,
}: DiceModifierControlProps) => {
  const diceUi = useMessages().ui.dice;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(String(modifier));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setDraft(modifier === 0 ? "" : String(modifier));
  }, [modifier, open]);

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

  const handleConfirm = () => {
    onModifierChange(parseRollDiceModifierInput(draft));
    setOpen(false);
  };

  const buttonLabel = formatRollDiceModifierButtonLabel(modifier);

  return (
    <div ref={rootRef} className="relative" data-prevent-spin-space="">
      <button
        type="button"
        disabled={disabled}
        className={cn(
          MODIFIER_TILE_CLASS,
          modifier === 0 ? "text-[26px] leading-none" : "text-sm leading-none",
          disabled
            ? "cursor-not-allowed opacity-45"
            : ROLL_A_DICE_DIE_TILE_ENABLED_CLASS,
        )}
        aria-label={
          modifier === 0
            ? diceUi.modifier
            : `${diceUi.modifier} ${buttonLabel}`
        }
        aria-expanded={open}
        onClick={() => {
          setDraft(modifier === 0 ? "" : String(modifier));
          setOpen((value) => !value);
        }}
      >
        {buttonLabel}
      </button>
      {open ? (
        <div className="absolute top-14 left-0 z-40 w-64 rounded-xl border border-border bg-popover p-3 shadow-lg">
          <div className="flex items-center gap-0.5">
            <p className="text-sm font-semibold">{diceUi.modifier}</p>
            <HelpTip
              helpLabel={diceUi.modifier}
              helpTitle={diceUi.modifier}
              helpText={diceUi.modifierHelp}
            />
          </div>
          <p className={cn("text-xs", ROLL_A_DICE_MUTED_TEXT_CLASS)}>
            {fillTemplate(diceUi.modifierRange, {
              min: ROLL_DICE_MODIFIER_MIN,
              max: ROLL_DICE_MODIFIER_MAX,
            })}
          </p>
          <Input
            type="number"
            inputMode="numeric"
            className="mt-3 text-center tabular-nums"
            value={draft}
            min={ROLL_DICE_MODIFIER_MIN}
            max={ROLL_DICE_MODIFIER_MAX}
            step={1}
            placeholder="0"
            aria-label={diceUi.modifierValue}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleConfirm();
              }
            }}
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleConfirm}>
              OK
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
