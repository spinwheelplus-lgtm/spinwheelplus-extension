import { X } from "lucide-react";
import { useState } from "react";

import { DiceEditDialog } from "@/components/dice-roller/dice-edit-dialog";
import { DiceModifierControl } from "@/components/dice-roller/dice-modifier-control";
import { DiceSectionHeading } from "@/components/dice-roller/dice-section-heading";
import { DiceTableActions } from "@/components/dice-roller/dice-table-actions";
import {
  DICE_TYPE_ICON_SIZE_CLASS,
  DiceTypeIcon,
} from "@/components/dice-roller/dice-type-add-icons";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { DICE_TYPE_OPTIONS } from "@/lib/dice-roller/dice-type-registry";
import {
  ROLL_A_DICE_DIE_TILE_ENABLED_CLASS,
  ROLL_A_DICE_REMOVE_BUTTON_CLASS,
  ROLL_A_DICE_SECTION_HINT_CLASS,
  ROLL_A_DICE_SUBPANEL_CLASS,
} from "@/lib/dice-roller/roll-a-dice-surface-classes";
import type {
  DiceSides,
  RollDiceAppearance,
  RollDiceClickRollMode,
  RollDiceSlot,
} from "@/types/dice-roller";
import { MAX_ROLL_DICE_COUNT } from "@/types/dice-roller";

const DICE_ROW_CLASS =
  "mt-3 flex flex-wrap items-start justify-center gap-2.5 sm:justify-start";
const DICE_ADD_TILE_CLASS =
  "rounded-md p-0.5 ring-2 ring-transparent transition-[transform,filter,box-shadow,ring-color] duration-150";
const DICE_TILE_DISABLED_CLASS = "cursor-not-allowed opacity-45";
const DICE_SLOT_ITEM_CLASS = "flex flex-col items-center gap-1.5";
const DICE_EDIT_BUTTON_CLASS =
  "rounded-md p-0.5 ring-2 ring-transparent transition-[transform,filter,box-shadow,ring-color] duration-150";

type DiceMultiPanelProps = {
  diceSlots: readonly RollDiceSlot[];
  onAddDie: (sides: DiceSides) => void;
  onRemoveDie: (id: string) => void;
  onUpdateAppearance: (id: string, patch: Partial<RollDiceAppearance>) => void;
  onChangeDieSides: (id: string, sides: DiceSides) => void;
  onResetDice: () => void;
  onImportDice: (
    slots: RollDiceSlot[],
    modifier?: number,
    clickRollMode?: RollDiceClickRollMode,
  ) => void;
  isDefaultDiceTable: boolean;
  disabled: boolean;
  modifier: number;
  clickRollMode: RollDiceClickRollMode;
  onModifierChange: (value: number) => void;
};

export const DiceMultiPanel = ({
  diceSlots,
  onAddDie,
  onRemoveDie,
  onUpdateAppearance,
  onChangeDieSides,
  onResetDice,
  onImportDice,
  isDefaultDiceTable,
  disabled,
  modifier,
  clickRollMode,
  onModifierChange,
}: DiceMultiPanelProps) => {
  const diceUi = useMessages().ui.dice;
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const atMaxDice = diceSlots.length >= MAX_ROLL_DICE_COUNT;
  const canRemove = diceSlots.length > 1;
  const editingSlot =
    diceSlots.find((slot) => slot.id === editingSlotId) ?? null;

  return (
    <div className={ROLL_A_DICE_SUBPANEL_CLASS}>
      <DiceSectionHeading
        title={diceUi.addDice}
        helpLabel={diceUi.addDiceHelp}
        helpTitle={diceUi.addDice}
        helpText={fillTemplate(diceUi.addHelp, { max: MAX_ROLL_DICE_COUNT })}
      />
      <div className={DICE_ROW_CLASS} role="group" aria-label={diceUi.addDice}>
        {DICE_TYPE_OPTIONS.map((option) => {
          const isDisabled = disabled || atMaxDice;
          return (
            <button
              key={option.sides}
              type="button"
              disabled={isDisabled}
              onClick={() => onAddDie(option.sides)}
              className={cn(
                DICE_ADD_TILE_CLASS,
                isDisabled
                  ? DICE_TILE_DISABLED_CLASS
                  : ROLL_A_DICE_DIE_TILE_ENABLED_CLASS,
              )}
              aria-label={`Add ${option.label}`}
            >
              <DiceTypeIcon
                sides={option.sides}
                variant="add"
                className={DICE_TYPE_ICON_SIZE_CLASS}
              />
            </button>
          );
        })}
        <div
          className="mx-0.5 h-12 w-px shrink-0 self-center bg-border"
          aria-hidden
        />
        <DiceModifierControl
          modifier={modifier}
          onModifierChange={onModifierChange}
          disabled={disabled}
        />
      </div>
      <DiceSectionHeading
        className="mt-4"
        title={
          <>
            {fillTemplate(diceUi.yourDiceCount, {
              count: diceSlots.length,
              max: MAX_ROLL_DICE_COUNT,
            })}
          </>
        }
        helpLabel={diceUi.yourDice}
        helpTitle={diceUi.yourDice}
        helpText={diceUi.yourDiceHelp}
      />
      {diceSlots.length === 0 ? (
        <p className={ROLL_A_DICE_SECTION_HINT_CLASS}>
          {diceUi.empty}
        </p>
      ) : null}
      {diceSlots.length > 0 ? (
        <ul className={DICE_ROW_CLASS} aria-label={diceUi.tableAria}>
          {diceSlots.map((slot, index) => {
            const option = DICE_TYPE_OPTIONS.find(
              (item) => item.sides === slot.sides,
            );
            const dieLabel = option?.label ?? `D${slot.sides}`;
            return (
              <li key={slot.id}>
                <div className={DICE_SLOT_ITEM_CLASS}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setEditingSlotId(slot.id)}
                    className={cn(
                      DICE_EDIT_BUTTON_CLASS,
                      disabled
                        ? DICE_TILE_DISABLED_CLASS
                        : ROLL_A_DICE_DIE_TILE_ENABLED_CLASS,
                    )}
                    aria-label={`Edit ${dieLabel} die ${index + 1}`}
                  >
                    <DiceTypeIcon
                      sides={slot.sides}
                      variant="slot"
                      className={DICE_TYPE_ICON_SIZE_CLASS}
                      bodyColor={slot.appearance.bodyColor}
                      markColor={slot.appearance.markColor}
                    />
                  </button>
                  <button
                    type="button"
                    className={ROLL_A_DICE_REMOVE_BUTTON_CLASS}
                    disabled={disabled || !canRemove}
                    onClick={() => onRemoveDie(slot.id)}
                    aria-label={`Remove ${dieLabel} die ${index + 1}`}
                  >
                    <X
                      className="size-3.5 shrink-0"
                      strokeWidth={2.75}
                      aria-hidden
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      <DiceTableActions
        className="mt-4"
        diceSlots={diceSlots}
        modifier={modifier}
        clickRollMode={clickRollMode}
        disabled={disabled}
        isDefaultDiceTable={isDefaultDiceTable}
        onImportDice={(slots, nextModifier, nextClickRollMode) => {
          setEditingSlotId(null);
          onImportDice(slots, nextModifier, nextClickRollMode);
        }}
        onResetDice={() => {
          setEditingSlotId(null);
          onResetDice();
        }}
      />
      <DiceEditDialog
        slot={editingSlot}
        open={editingSlot != null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setEditingSlotId(null);
        }}
        onUpdateAppearance={onUpdateAppearance}
        onChangeDieSides={onChangeDieSides}
        disabled={disabled}
      />
    </div>
  );
};
