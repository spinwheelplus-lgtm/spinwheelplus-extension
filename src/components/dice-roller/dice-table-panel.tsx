import { Check, Copy } from "lucide-react";
import { lazy, Suspense, useCallback, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { DiceGridSkeleton } from "@/components/dice-roller/dice-grid-skeleton";
import { DiceSessionMenu } from "@/components/dice-roller/dice-session-menu";

const DiceWebglGrid = lazy(
  () => import("@/components/dice-roller/dice-webgl-grid"),
);
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { formatRollDiceBreakdown } from "@/lib/dice-roller/format-roll-dice-breakdown";
import { formatRollDiceResultCopy } from "@/lib/dice-roller/format-roll-dice-result-copy";
import type { DiceStagePose } from "@/lib/dice-roller/roll-a-dice-classes";
import {
  computeDiceFrameLayout,
  type DiceFrameLayout,
} from "@/lib/dice-roller/roll-a-dice-stage-layout";
import {
  ROLL_A_DICE_MUTED_TEXT_CLASS,
  ROLL_A_DICE_RESULT_TOTAL_CLASS,
} from "@/lib/dice-roller/roll-a-dice-surface-classes";
import {
  DICE_TABLE_PANEL_MAX_HEIGHT_CLASS,
  getDiceTableHeightBudgetPx,
  resetDiceViewportCapCache,
} from "@/lib/dice-roller/roll-a-dice-viewport-cap";
import { formatRollDiceModifierLabel } from "@/lib/dice-roller/roll-dice-modifier";
import { useDiceRollerStore } from "@/store/dice-roller-store";
import { useImmersiveStore } from "@/store/immersive-store";
import type { RollDiceHistoryEntry, RollDiceSlot } from "@/types/dice-roller";

const COPY_RESULT_KEY = "roll-dice-copy-result";

type DiceTablePanelProps = {
  diceSlots: readonly RollDiceSlot[];
  stagePose: DiceStagePose;
  isRolling: boolean;
  reduceMotion: boolean;
  hasHydrated: boolean;
  onRoll: () => void;
  onRollDie: (id: string) => void;
  diceTotal: number | null;
  finalTotal: number | null;
  modifier: number;
  wordOnly: boolean;
  scoresNumbers: boolean;
  faceLabels: readonly (string | null)[] | null;
  showTotal: boolean;
  rollHistory: readonly RollDiceHistoryEntry[];
  onClearRollHistory: () => void;
};

export const DiceTablePanel = ({
  diceSlots,
  stagePose,
  isRolling,
  reduceMotion,
  hasHydrated,
  onRoll,
  onRollDie,
  diceTotal,
  finalTotal,
  modifier,
  wordOnly,
  scoresNumbers,
  faceLabels,
  showTotal,
  rollHistory,
  onClearRollHistory,
}: DiceTablePanelProps) => {
  const messages = useMessages();
  const diceUi = messages.ui.dice;
  const common = messages.ui.common;
  const clickRollMode = useDiceRollerStore((state) => state.clickRollMode);
  const immersive = useImmersiveStore((state) => state.immersive);
  const { copyText, isCopied } = useCopyFeedback();
  const panelRef = useRef<HTMLDivElement>(null);
  const diceAreaRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const [frameLayout, setFrameLayout] = useState<DiceFrameLayout | null>(null);

  const recalcFrameLayout = useCallback(() => {
    const diceArea = diceAreaRef.current;
    const chromeHeight = chromeRef.current?.offsetHeight ?? 0;
    const panelHeight = panelRef.current?.clientHeight ?? 0;

    if (diceArea == null || diceSlots.length === 0) {
      setFrameLayout(null);
      return;
    }

    const tWidth = diceArea.clientWidth;
    const tHeight = getDiceTableHeightBudgetPx({
      chromeHeight,
      panelHeight,
      immersive,
    });

    setFrameLayout(
      computeDiceFrameLayout({
        diceCount: diceSlots.length,
        containerWidth: tWidth,
        maxHeightPx: tHeight,
      }),
    );
  }, [diceSlots.length, immersive]);

  useLayoutEffect(() => {
    recalcFrameLayout();
    const panel = panelRef.current;
    const diceArea = diceAreaRef.current;
    const chrome = chromeRef.current;
    if (panel == null || diceArea == null) return undefined;

    const observer = new ResizeObserver(() => {
      recalcFrameLayout();
    });
    observer.observe(panel);
    observer.observe(diceArea);
    if (chrome != null) observer.observe(chrome);
    window.addEventListener("resize", recalcFrameLayout);
    const handleOrientationChange = (): void => {
      resetDiceViewportCapCache();
      recalcFrameLayout();
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recalcFrameLayout);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [recalcFrameLayout]);

  const rollDisabled = isRolling || !hasHydrated || diceSlots.length === 0;
  const rollAllMode = diceSlots.length > 2;
  const rollButtonLabel = isRolling
    ? diceUi.rolling
    : rollAllMode
      ? diceUi.rollAllShort
      : diceUi.rollShort;
  const rollButtonAriaLabel = isRolling
    ? diceUi.rollingAria
    : rollAllMode
      ? diceUi.rollAll
      : diceUi.rollDice;
  const showResultValues =
    showTotal && (wordOnly || (diceTotal != null && finalTotal != null));
  const hasModifier = modifier !== 0 && !wordOnly && scoresNumbers;
  const faceValues = diceSlots.map((slot) => slot.result);
  const wordLine = wordOnly
    ? formatRollDiceBreakdown(faceValues, faceLabels)
    : null;
  const breakdownLine =
    diceSlots.length > 1 && showResultValues && !wordOnly
      ? formatRollDiceBreakdown(faceValues, faceLabels)
      : null;
  const copyResultCopied = isCopied(COPY_RESULT_KEY);

  const keyboardHint =
    diceSlots.length > 1
      ? clickRollMode === "one"
        ? diceUi.spaceAllTap
        : diceUi.spaceAll
      : diceUi.spaceOne;

  const handleCopyResult = useCallback(() => {
    if (
      !showResultValues ||
      (!wordOnly && (diceTotal == null || finalTotal == null))
    ) {
      return;
    }
    const values = diceSlots.map((slot) => slot.result);
    void copyText(
      formatRollDiceResultCopy(
        diceTotal ?? 0,
        values,
        wordOnly ? 0 : modifier,
        faceLabels,
      ),
      COPY_RESULT_KEY,
    ).then((ok) => {
      if (ok) toast.success(common.resultCopied);
    });
  }, [
    copyText,
    diceSlots,
    diceTotal,
    faceLabels,
    finalTotal,
    modifier,
    showResultValues,
    wordOnly,
  ]);

  return (
    <div
      ref={panelRef}
      className={cn(
        "relative flex min-h-0 w-full flex-col text-center",
        immersive
          ? "h-full min-h-full flex-1"
          : cn("mb-2.5", DICE_TABLE_PANEL_MAX_HEIGHT_CLASS),
      )}
      aria-label={diceUi.tableAria}
    >
      <div
        ref={diceAreaRef}
        className={cn(
          "relative z-0 flex w-full items-center justify-center",
          immersive ? "min-h-0 flex-1 overflow-hidden" : "shrink-0 overflow-visible",
        )}
        style={
          !immersive && frameLayout != null
            ? { height: frameLayout.gridHeightPx }
            : undefined
        }
        aria-live="polite"
      >
        {!hasHydrated ? (
          <DiceGridSkeleton layout={frameLayout} diceCount={diceSlots.length} />
        ) : diceSlots.length === 0 ? (
          <p className={cn("text-sm", ROLL_A_DICE_MUTED_TEXT_CLASS)}>
            {diceUi.emptyTable}
          </p>
        ) : frameLayout == null ? (
          <DiceGridSkeleton layout={null} />
        ) : (
          <Suspense
            fallback={
              <DiceGridSkeleton
                layout={frameLayout}
                diceCount={diceSlots.length}
              />
            }
          >
            <DiceWebglGrid
              diceSlots={diceSlots}
              stagePose={stagePose}
              isRolling={isRolling}
              reduceMotion={reduceMotion}
              layout={frameLayout}
              onRollAll={onRoll}
              onRollDie={onRollDie}
              clickRollMode={clickRollMode}
              rollDisabled={rollDisabled}
            />
          </Suspense>
        )}
      </div>

      <div ref={chromeRef} className="relative z-20 shrink-0 pt-1">
        <button
          type="button"
          className="appearance-none cursor-pointer rounded-[10px] border-0 bg-gradient-to-b from-[#f0b84a] to-[#e8a838] px-20 py-4 text-base font-semibold text-[#1a1208] shadow-[0_4px_14px_rgba(232,168,56,0.3)] transition-[filter,transform] duration-150 hover:brightness-105 active:scale-[0.98] disabled:cursor-wait disabled:opacity-88 motion-safe:disabled:animate-pulse"
          onClick={onRoll}
          disabled={rollDisabled}
          aria-label={rollButtonAriaLabel}
          aria-busy={isRolling}
        >
          {rollButtonLabel}
        </button>
        <p className={cn("mt-2.5 text-[0.78rem]", ROLL_A_DICE_MUTED_TEXT_CLASS)}>
          {keyboardHint}
        </p>
        {diceSlots.length > 0 ? (
          <div className="flex flex-col items-center gap-1 px-14">
            <div
              className="flex flex-wrap items-center justify-center gap-2"
              aria-live="polite"
            >
              <p
                className={cn(
                  "text-[0.95rem] tabular-nums",
                  ROLL_A_DICE_MUTED_TEXT_CLASS,
                )}
              >
                {wordOnly ? (
                  <strong className={ROLL_A_DICE_RESULT_TOTAL_CLASS}>
                    {showResultValues ? wordLine : "-----"}
                  </strong>
                ) : hasModifier ? (
                  <>
                    Dice:{" "}
                    {showResultValues && diceTotal != null ? diceTotal : "-----"}
                    {" · "}
                    {formatRollDiceModifierLabel(modifier)}
                    {" · "}
                    Final:{" "}
                    <strong className={ROLL_A_DICE_RESULT_TOTAL_CLASS}>
                      {showResultValues && finalTotal != null
                        ? finalTotal
                        : "-----"}
                    </strong>
                  </>
                ) : (
                  <>
                    {diceUi.total}:{" "}
                    <strong className={ROLL_A_DICE_RESULT_TOTAL_CLASS}>
                      {showResultValues ? finalTotal : "-----"}
                    </strong>
                  </>
                )}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 px-2.5"
                disabled={
                  !showResultValues ||
                  (!wordOnly && (diceTotal == null || finalTotal == null))
                }
                aria-label={
                  copyResultCopied ? common.resultCopied : diceUi.copyRoll
                }
                onClick={handleCopyResult}
              >
                {copyResultCopied ? (
                  <Check className="size-4 shrink-0" aria-hidden />
                ) : (
                  <Copy className="size-4 shrink-0" aria-hidden />
                )}
                <span className="sr-only">
                  {copyResultCopied ? common.copied : common.copyResult}
                </span>
              </Button>
            </div>
            <p
              className={cn(
                "min-h-[1.125rem] text-xs tabular-nums",
                ROLL_A_DICE_MUTED_TEXT_CLASS,
              )}
            >
              {wordOnly
                ? ""
                : showResultValues && breakdownLine != null
                  ? breakdownLine
                  : "-----"}
            </p>
          </div>
        ) : null}
      </div>
      <DiceSessionMenu
        history={rollHistory}
        onClearHistory={onClearRollHistory}
        settingsDisabled={isRolling}
      />
    </div>
  );
};
