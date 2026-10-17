import { SquarePen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

import { DiceTypeIcon } from "@/components/dice-roller/dice-type-add-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  D6_FACE_WORD_MAX_LENGTH,
  D6_NUMBER_FACE_WORDS,
  D6_YES_NO_FACE_WORDS,
  normalizeD6FaceWordInput,
} from "@/lib/dice-roller/d6-face-words";
import {
  DICE_TYPE_OPTIONS,
  getDiceTypeDefinition,
} from "@/lib/dice-roller/dice-type-registry";
import {
  D6_FACE_STYLE_OPTIONS,
  DEFAULT_DICE_BODY_COLORS,
} from "@/lib/dice-roller/roll-a-dice-appearance";
import {
  ROLL_A_DICE_CHIP_ACTIVE_CLASS,
  ROLL_A_DICE_DIE_TYPE_ACTIVE_CLASS,
} from "@/lib/dice-roller/roll-a-dice-surface-classes";
import { SPIN_HISTORY_DIALOG_HEADER_BACKGROUND } from "@/lib/spin-history";
import type {
  DiceSides,
  RollDiceAppearance,
  RollDiceSlot,
} from "@/types/dice-roller";

type DiceEditDialogProps = {
  slot: RollDiceSlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateAppearance: (id: string, patch: Partial<RollDiceAppearance>) => void;
  onChangeDieSides: (id: string, sides: DiceSides) => void;
  disabled?: boolean;
};

type ColorSwatchTileProps = {
  label: string;
  value: string;
  disabled: boolean;
  ariaLabel: string;
  onChange: (value: string) => void;
};

const ColorSwatchTile = ({
  label,
  value,
  disabled,
  ariaLabel,
  onChange,
}: ColorSwatchTileProps) => (
  <label
    className={cn(
      "flex min-w-18 flex-col items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-2.5",
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    )}
  >
    <span className="relative size-12 overflow-hidden rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] ring-1 ring-black/10">
      <span
        className="absolute inset-0"
        style={{ backgroundColor: value }}
        aria-hidden
      />
      <input
        type="color"
        aria-label={ariaLabel}
        value={value}
        disabled={disabled}
        className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </span>
    <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
  </label>
);

const CLOSE_MS = 200;

export const DiceEditDialog = ({
  slot,
  open,
  onOpenChange,
  onUpdateAppearance,
  onChangeDieSides,
  disabled = false,
}: DiceEditDialogProps) => {
  const { dice: diceUi, common } = useMessages().ui;
  const faceStyleLabel = {
    number: diceUi.numbers,
    pip: diceUi.dots,
    words: diceUi.words,
  };
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

  if (slot == null) return null;

  const definition = getDiceTypeDefinition(slot.sides);
  const { appearance } = slot;
  const markLabel =
    slot.sides === 6 && appearance.d6FaceStyle === "pip"
      ? diceUi.dots
      : slot.sides === 6 && appearance.d6FaceStyle === "words"
        ? diceUi.textColor
        : diceUi.numbers;
  const markAriaLabel =
    slot.sides === 6 && appearance.d6FaceStyle === "words"
      ? diceUi.textColor
      : diceUi.markColor;

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
              "pointer-events-auto flex max-h-[90%] w-[min(90%,28rem)] flex-col overflow-hidden rounded-2xl bg-card shadow-xl",
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
                <SquarePen className="size-5 shrink-0 text-primary" aria-hidden />
                <Drawer.Title className="text-base font-semibold">
                  {fillTemplate(diceUi.editDie, { name: definition.label })}
                </Drawer.Title>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label={diceUi.closeEdit}
                onClick={requestClose}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
            <Drawer.Description className="sr-only">
              {diceUi.editLead}
            </Drawer.Description>
            <div className="space-y-4 overflow-y-auto px-4 py-4">
              <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                <p className="mb-2.5 text-sm font-semibold text-foreground">
                  {diceUi.dieType}
                </p>
                <div
                  className="flex flex-wrap justify-center gap-2 sm:justify-start"
                  role="radiogroup"
                  aria-label={diceUi.dieType}
                >
                  {DICE_TYPE_OPTIONS.map((option) => {
                    const isActive = slot.sides === option.sides;
                    return (
                      <button
                        key={option.sides}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        aria-label={option.label}
                        disabled={disabled}
                        onClick={() => {
                          if (!disabled && slot.sides !== option.sides) {
                            onChangeDieSides(slot.id, option.sides);
                          }
                        }}
                        className={cn(
                          "rounded-md p-0.5 transition-[transform,box-shadow] duration-150",
                          isActive
                            ? ROLL_A_DICE_DIE_TYPE_ACTIVE_CLASS
                            : "ring-1 ring-border/60 hover:brightness-105",
                          disabled
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer active:scale-95",
                        )}
                      >
                        <DiceTypeIcon
                          sides={option.sides}
                          variant="add"
                          className="size-10"
                          bodyColor={isActive ? appearance.bodyColor : undefined}
                          markColor={isActive ? appearance.markColor : undefined}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
              {slot.sides === 6 ? (
                <div
                  className="flex rounded-full border border-border/60 bg-muted/30 p-1"
                  role="radiogroup"
                  aria-label={diceUi.faceStyle}
                >
                  {D6_FACE_STYLE_OPTIONS.map((option) => {
                    const isActive = appearance.d6FaceStyle === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        disabled={disabled}
                        onClick={() => {
                          if (!disabled) {
                            onUpdateAppearance(slot.id, {
                              d6FaceStyle: option.value,
                            });
                          }
                        }}
                        className={cn(
                          "min-w-0 flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                          isActive
                            ? ROLL_A_DICE_CHIP_ACTIVE_CLASS
                            : "text-muted-foreground hover:text-foreground",
                          disabled && "cursor-not-allowed opacity-60",
                        )}
                      >
                        {faceStyleLabel[option.value]}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {slot.sides === 6 && appearance.d6FaceStyle === "words" ? (
                <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {diceUi.faceWords}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          onUpdateAppearance(slot.id, {
                            d6FaceWords: [...D6_NUMBER_FACE_WORDS],
                          });
                        }}
                      >
                        {diceUi.presetNumber}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          onUpdateAppearance(slot.id, {
                            d6FaceWords: [...D6_YES_NO_FACE_WORDS],
                          });
                        }}
                      >
                        {diceUi.presetYesNo}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {appearance.d6FaceWords.map((word, index) => (
                      <Input
                        key={index}
                        value={word}
                        maxLength={D6_FACE_WORD_MAX_LENGTH}
                        disabled={disabled}
                        aria-label={fillTemplate(diceUi.wordForFace, {
                          count: index + 1,
                        })}
                        placeholder={fillTemplate(diceUi.wordPlaceholder, {
                          count: index + 1,
                        })}
                        onChange={(event) => {
                          if (disabled) return;
                          const next = appearance.d6FaceWords.map(
                            (entry, wordIndex) =>
                              wordIndex === index
                                ? normalizeD6FaceWordInput(event.target.value)
                                : entry,
                          );
                          onUpdateAppearance(slot.id, { d6FaceWords: next });
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-foreground">
                    {diceUi.diceColors}
                  </span>
                  <div className="flex shrink-0 gap-2.5">
                    <ColorSwatchTile
                      label={diceUi.face}
                      value={appearance.bodyColor}
                      disabled={disabled}
                      ariaLabel={diceUi.faceColor}
                      onChange={(bodyColor) => {
                        if (!disabled) onUpdateAppearance(slot.id, { bodyColor });
                      }}
                    />
                    <ColorSwatchTile
                      label={markLabel}
                      value={appearance.markColor}
                      disabled={disabled}
                      ariaLabel={markAriaLabel}
                      onChange={(markColor) => {
                        if (!disabled) onUpdateAppearance(slot.id, { markColor });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-4 py-3">
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  onUpdateAppearance(slot.id, {
                    bodyColor: DEFAULT_DICE_BODY_COLORS[slot.sides],
                    markColor: "#ffffff",
                  });
                }}
              >
                {common.resetDefault}
              </Button>
              <Button type="button" onClick={requestClose}>
                {common.done}
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
