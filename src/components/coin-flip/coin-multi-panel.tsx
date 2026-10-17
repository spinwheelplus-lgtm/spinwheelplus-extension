import { X } from "lucide-react";
import { useState } from "react";

import { CoinEditPopover } from "@/components/coin-flip/coin-edit-popover";
import { CoinFaceControls } from "@/components/coin-flip/coin-face-controls";
import { CoinLabeledThumb } from "@/components/coin-flip/coin-labeled-thumb";
import { CoinSectionHeading } from "@/components/coin-flip/coin-section-heading";
import { CoinTableActions } from "@/components/coin-flip/coin-table-actions";
import FlipACoinCoinThumb from "@/components/coin-flip/coin-thumb";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import type { FlipCoinMetal } from "@/lib/coin-flip/flip-a-coin-assets";
import { flipCoinSideLabelsForStyle, type FlipCoinFaceStyle } from "@/lib/coin-flip/flip-coin-face-style";
import { localizeFlipCoinSideLabels } from "@/lib/coin-flip/localize-coin-face-labels";
import { FLIP_COIN_METAL_OPTIONS } from "@/lib/coin-flip/flip-a-coin-metal-options";
import {
  FLIP_A_COIN_COIN_TILE_ENABLED_CLASS,
  FLIP_A_COIN_REMOVE_BUTTON_CLASS,
  FLIP_A_COIN_SECTION_HINT_CLASS,
  FLIP_A_COIN_SUBPANEL_CLASS,
} from "@/lib/coin-flip/flip-a-coin-surface-classes";
import type { FlipCoinClickFlipMode, FlipCoinSlot } from "@/types/coin-flip";
import { MAX_FLIP_COIN_COUNT } from "@/types/coin-flip";

type CoinMultiPanelProps = {
  coinSlots: readonly FlipCoinSlot[];
  onAddCoin: (metal: FlipCoinMetal) => void;
  onRemoveCoin: (id: string) => void;
  onUpdateMetal: (id: string, metal: FlipCoinMetal) => void;
  faceStyle: FlipCoinFaceStyle;
  onFaceStyleChange: (style: FlipCoinFaceStyle) => void;
  disabled: boolean;
  clickFlipMode: FlipCoinClickFlipMode;
  isDefaultCoinTable: boolean;
  onImportCoins: (
    slots: FlipCoinSlot[],
    clickFlipMode?: FlipCoinClickFlipMode,
    faceStyle?: FlipCoinFaceStyle,
  ) => void;
  onResetCoins: () => void;
};

export const CoinMultiPanel = ({
  coinSlots,
  onAddCoin,
  onRemoveCoin,
  onUpdateMetal,
  faceStyle,
  onFaceStyleChange,
  disabled,
  clickFlipMode,
  isDefaultCoinTable,
  onImportCoins,
  onResetCoins,
}: CoinMultiPanelProps) => {
  const coinUi = useMessages().ui.coin;
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const atMax = coinSlots.length >= MAX_FLIP_COIN_COUNT;
  const canRemove = coinSlots.length > 1;
  const labeled = faceStyle.mode === "labeled";
  const sideLabels = localizeFlipCoinSideLabels(
    flipCoinSideLabelsForStyle(faceStyle),
    coinUi,
  );

  return (
    <div className={FLIP_A_COIN_SUBPANEL_CLASS}>
      <CoinFaceControls
        faceStyle={faceStyle}
        disabled={disabled}
        onChange={onFaceStyleChange}
      />
      <CoinSectionHeading
        className="mt-4"
        title={coinUi.addCoin}
        helpLabel={coinUi.addCoinHelp}
        helpTitle={coinUi.addCoin}
        helpText={fillTemplate(coinUi.addHelp, { max: MAX_FLIP_COIN_COUNT })}
      />
      <div
        className="mt-3 flex flex-wrap items-start justify-center gap-2.5 sm:justify-start"
        role="group"
        aria-label={coinUi.addCoin}
      >
        {labeled ? (
          <button
            type="button"
            disabled={disabled || atMax}
            onClick={() => onAddCoin("gold")}
            className={cn(
              "rounded-full p-0.5 ring-2 ring-transparent",
              disabled || atMax
                ? "cursor-not-allowed opacity-45"
                : FLIP_A_COIN_COIN_TILE_ENABLED_CLASS,
            )}
            aria-label={`Add ${sideLabels.heads} / ${sideLabels.tails} coin`}
          >
            <CoinLabeledThumb
              color={faceStyle.headsColor}
              label={sideLabels.heads}
              variant="add"
            />
          </button>
        ) : (
          FLIP_COIN_METAL_OPTIONS.map((option) => {
          const isDisabled = disabled || atMax;
          return (
            <button
              key={option.metal}
              type="button"
              disabled={isDisabled}
              onClick={() => onAddCoin(option.metal)}
              className={cn(
                "rounded-full p-0.5 ring-2 ring-transparent",
                isDisabled
                  ? "cursor-not-allowed opacity-45"
                  : FLIP_A_COIN_COIN_TILE_ENABLED_CLASS,
              )}
              aria-label={`Add ${option.label} coin`}
            >
              <FlipACoinCoinThumb metal={option.metal} variant="add" />
            </button>
          );
        })
        )}
      </div>
      <CoinSectionHeading
        className="mt-4"
        title={
          <>
            {fillTemplate(coinUi.yourCoinsCount, {
              count: coinSlots.length,
              max: MAX_FLIP_COIN_COUNT,
            })}
          </>
        }
        helpLabel={coinUi.yourCoins}
        helpTitle={coinUi.yourCoins}
        helpText={
          labeled ? coinUi.yourCoinsHelpLabeled : coinUi.yourCoinsHelpClassic
        }
      />
      {coinSlots.length === 0 ? (
        <p className={FLIP_A_COIN_SECTION_HINT_CLASS}>{coinUi.empty}</p>
      ) : (
        <ul
          className="mt-3 flex flex-wrap items-start justify-center gap-2.5 sm:justify-start"
          aria-label={coinUi.tableAria}
        >
          {coinSlots.map((slot, index) => {
            const option = FLIP_COIN_METAL_OPTIONS.find(
              (item) => item.metal === slot.metal,
            );
            const coinLabel = labeled
              ? `${sideLabels.heads} / ${sideLabels.tails}`
              : (option?.label ?? slot.metal);
            return (
              <li key={slot.id}>
                <div className="flex flex-col items-center gap-1.5">
                  {labeled ? (
                    <CoinLabeledThumb
                      color={faceStyle.headsColor}
                      label={sideLabels.heads}
                      variant="slot"
                    />
                  ) : (
                    <CoinEditPopover
                      metal={slot.metal}
                      open={editingSlotId === slot.id}
                      onOpenChange={(nextOpen) => {
                        setEditingSlotId(nextOpen ? slot.id : null);
                      }}
                      onConfirm={(metal) => onUpdateMetal(slot.id, metal)}
                      disabled={disabled}
                      triggerLabel={`Edit ${coinLabel} coin ${index + 1}`}
                    >
                      <FlipACoinCoinThumb metal={slot.metal} variant="slot" />
                    </CoinEditPopover>
                  )}
                  <button
                    type="button"
                    className={FLIP_A_COIN_REMOVE_BUTTON_CLASS}
                    disabled={disabled || !canRemove}
                    onClick={() => onRemoveCoin(slot.id)}
                    aria-label={`Remove ${coinLabel} coin ${index + 1}`}
                  >
                    <X className="size-3.5 shrink-0" strokeWidth={2.75} aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <CoinTableActions
        className="mt-4"
        coinSlots={coinSlots}
        clickFlipMode={clickFlipMode}
        faceStyle={faceStyle}
        disabled={disabled}
        isDefaultCoinTable={isDefaultCoinTable}
        onImportCoins={onImportCoins}
        onResetCoins={onResetCoins}
      />
    </div>
  );
};
