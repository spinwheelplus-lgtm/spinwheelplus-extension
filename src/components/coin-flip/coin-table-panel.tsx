import { Check, Copy } from "lucide-react";
import { lazy, Suspense, useCallback, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";

import FlipACoinWebGLSkeleton from "@/components/coin-flip/coin-webgl-skeleton";
import { CoinSessionMenu } from "@/components/coin-flip/coin-session-menu";
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import type { FlipCoinPhase } from "@/hooks/use-flip-coin";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { flipCoinSideLabelsForStyle, type FlipCoinFaceStyle } from "@/lib/coin-flip/flip-coin-face-style";
import { localizeFlipCoinSideLabels } from "@/lib/coin-flip/localize-coin-face-labels";
import { FLIP_A_COIN_COIN_AREA_CLASS } from "@/lib/coin-flip/flip-a-coin-classes";
import {
  computeFlipCoinGridLayout,
  FLIP_COIN_CHROME_VERTICAL_GAP_PX,
  FLIP_COIN_SKELETON_MIN_HEIGHT_PX,
  type FlipCoinGridLayout,
} from "@/lib/coin-flip/flip-a-coin-stage-layout";
import {
  FLIP_A_COIN_MUTED_TEXT_CLASS,
  FLIP_A_COIN_PRIMARY_ACTION_BUTTON_CLASS,
  FLIP_A_COIN_RESULT_TOTAL_CLASS,
} from "@/lib/coin-flip/flip-a-coin-surface-classes";
import {
  FLIP_COIN_PANEL_MAX_HEIGHT_CLASS,
  getFlipCoinTableHeightBudgetPx,
  resetFlipCoinViewportCapCache,
} from "@/lib/coin-flip/flip-a-coin-viewport-cap";
import {
  formatFlipCoinResultBreakdown,
  formatFlipCoinResultCopy,
  formatFlipCoinResultsSummary,
} from "@/lib/coin-flip/format-flip-coin-results";
import type {
  FlipCoinSide,
  FlipCoinWebGLRequest,
} from "@/lib/coin-flip/plan-coin-flip";
import { useCoinFlipStore } from "@/store/coin-flip-store";
import { useImmersiveStore } from "@/store/immersive-store";
import type {
  FlipCoinClickFlipMode,
  FlipCoinHistoryEntry,
  FlipCoinSlot,
} from "@/types/coin-flip";

const FlipACoinWebGL = lazy(() => import("@/components/coin-flip/coin-webgl"));

const COPY_RESULT_KEY = "flip-coin-copy-result";

type CoinTablePanelProps = {
  coinSlots: readonly FlipCoinSlot[];
  hasHydrated: boolean;
  flip: () => void;
  flipOne: (coinId: string) => void;
  handleFlipComplete: (requestId: number) => void;
  flipRequest: FlipCoinWebGLRequest | null;
  phase: FlipCoinPhase;
  results: ReadonlyMap<string, FlipCoinSide>;
  isFlipping: boolean;
  clickFlipMode: FlipCoinClickFlipMode;
  faceStyle: FlipCoinFaceStyle;
  flipHistory: readonly FlipCoinHistoryEntry[];
  onClearFlipHistory: () => void;
};

export const CoinTablePanel = ({
  coinSlots,
  hasHydrated,
  flip,
  flipOne,
  handleFlipComplete,
  flipRequest,
  phase,
  results,
  isFlipping,
  clickFlipMode,
  faceStyle,
  flipHistory,
  onClearFlipHistory,
}: CoinTablePanelProps) => {
  const messages = useMessages();
  const coinUi = messages.ui.coin;
  const common = messages.ui.common;
  const { copyText, isCopied } = useCopyFeedback();
  const immersive = useImmersiveStore((state) => state.immersive);
  const clickMode = useCoinFlipStore((state) => state.clickFlipMode);
  const panelRef = useRef<HTMLDivElement>(null);
  const coinAreaRef = useRef<HTMLDivElement>(null);
  const chromeTopRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const [gridLayout, setGridLayout] = useState<FlipCoinGridLayout | null>(null);

  const coinIds = coinSlots.map((slot) => slot.id);

  const recalcStageLayout = useCallback(() => {
    const coinArea = coinAreaRef.current;
    const chromeHeight =
      (chromeTopRef.current?.offsetHeight ?? 0) +
      (chromeRef.current?.offsetHeight ?? 0) +
      FLIP_COIN_CHROME_VERTICAL_GAP_PX;
    const panelHeight = panelRef.current?.clientHeight ?? 0;

    if (coinArea == null) {
      setGridLayout(null);
      return;
    }

    const tWidth = coinArea.clientWidth;
    const maxHeightPx = getFlipCoinTableHeightBudgetPx({
      chromeHeight,
      panelHeight,
      immersive,
    });

    setGridLayout(
      computeFlipCoinGridLayout({
        coinCount: coinSlots.length,
        containerWidth: tWidth,
        maxHeightPx,
      }),
    );
  }, [coinSlots.length, immersive]);

  useLayoutEffect(() => {
    recalcStageLayout();
    const panel = panelRef.current;
    const coinArea = coinAreaRef.current;
    const chrome = chromeRef.current;
    const chromeTop = chromeTopRef.current;
    if (panel == null || coinArea == null) return undefined;

    const observer = new ResizeObserver(() => {
      recalcStageLayout();
    });
    observer.observe(panel);
    observer.observe(coinArea);
    if (chromeTop != null) observer.observe(chromeTop);
    if (chrome != null) observer.observe(chrome);
    window.addEventListener("resize", recalcStageLayout);
    const handleOrientationChange = (): void => {
      resetFlipCoinViewportCapCache();
      recalcStageLayout();
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recalcStageLayout);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [recalcStageLayout]);

  const flipDisabled = isFlipping || !hasHydrated || coinSlots.length === 0;
  const flipAllMode = coinSlots.length > 1;
  const flipButtonLabel = isFlipping
    ? coinUi.flipping
    : flipAllMode
      ? coinUi.flipAllShort
      : coinUi.flipShort;
  const flipButtonAriaLabel = isFlipping
    ? coinUi.flippingAria
    : flipAllMode
      ? coinUi.flipAll
      : coinUi.flipOne;

  const isMultiCoin = coinSlots.length > 1;
  const showResultValues = phase === "settled" && results.size > 0;
  const hasUnresolvedResults =
    isMultiCoin && coinIds.some((coinId) => !results.has(coinId));
  const sideLabels = flipCoinSideLabelsForStyle(faceStyle);
  const spokenLabels = localizeFlipCoinSideLabels(
    faceStyle.mode === "classic"
      ? { ...sideLabels, heads: coinUi.heads, tails: coinUi.tails }
      : sideLabels,
    coinUi,
  );
  const chromeMessage = showResultValues
    ? isMultiCoin
      ? coinUi.landedMany
      : coinUi.landedOne
    : fillTemplate(coinUi.flipFor, {
        heads: spokenLabels.heads,
        tails: spokenLabels.tails,
      });
  const resultSummary =
    showResultValues && !isMultiCoin
      ? formatFlipCoinResultsSummary(results, spokenLabels)
      : showResultValues && isMultiCoin && !hasUnresolvedResults
        ? formatFlipCoinResultsSummary(results, spokenLabels)
        : null;
  const breakdownLine =
    isMultiCoin && showResultValues
      ? formatFlipCoinResultBreakdown(coinIds, results, spokenLabels)
      : null;
  const copyResultCopied = isCopied(COPY_RESULT_KEY);

  const handleCopyResult = useCallback(() => {
    if (!showResultValues) return;
    void copyText(
      formatFlipCoinResultCopy(coinIds, results, spokenLabels),
      COPY_RESULT_KEY,
    ).then((ok) => {
      if (ok) toast.success(common.resultCopied);
    });
  }, [coinIds, common.resultCopied, copyText, results, showResultValues, spokenLabels]);

  const keyboardHint =
    coinSlots.length > 1
      ? clickFlipMode === "one"
        ? coinUi.spaceAllTap
        : coinUi.spaceAll
      : coinUi.spaceOne;

  return (
    <div
      ref={panelRef}
      className={cn(
        "relative flex min-h-0 w-full flex-col overflow-hidden text-center",
        immersive
          ? "h-full min-h-full flex-1"
          : cn("mb-2.5", FLIP_COIN_PANEL_MAX_HEIGHT_CLASS),
      )}
      aria-label={coinUi.tableAria}
    >
      <div ref={chromeTopRef} className="relative z-20 mb-5 shrink-0 text-center">
        <p
          className="text-sm font-medium text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          {chromeMessage}
        </p>
      </div>

      <div
        ref={coinAreaRef}
        className={cn(
          FLIP_A_COIN_COIN_AREA_CLASS,
          immersive ? "min-h-0 flex-1 overflow-hidden" : "shrink-0",
        )}
        style={
          !immersive && gridLayout != null
            ? { height: gridLayout.gridHeightPx }
            : !immersive
              ? { minHeight: FLIP_COIN_SKELETON_MIN_HEIGHT_PX }
              : undefined
        }
        aria-live="polite"
      >
        {!hasHydrated || gridLayout == null ? (
          <FlipACoinWebGLSkeleton />
        ) : (
          <Suspense fallback={<FlipACoinWebGLSkeleton />}>
            <FlipACoinWebGL
              coinSlots={coinSlots}
              faceStyle={faceStyle}
              layout={gridLayout}
              flipRequest={flipRequest}
              onFlipComplete={handleFlipComplete}
              onFlipAll={flip}
              onFlipCoin={flipOne}
              clickFlipMode={clickMode}
              flipDisabled={isFlipping}
            />
          </Suspense>
        )}
      </div>

      <div ref={chromeRef} className="relative z-20 mt-5 shrink-0 text-center">
        <button
          type="button"
          className={FLIP_A_COIN_PRIMARY_ACTION_BUTTON_CLASS}
          onClick={flip}
          disabled={flipDisabled}
          aria-label={flipButtonAriaLabel}
          aria-busy={isFlipping}
        >
          {flipButtonLabel}
        </button>
        <p
          className={cn(
            "mt-2.5 px-2 text-[0.78rem] leading-relaxed",
            FLIP_A_COIN_MUTED_TEXT_CLASS,
          )}
        >
          {keyboardHint}
        </p>
        {coinSlots.length > 0 ? (
          <div
            className="flex w-full flex-col items-center gap-2 px-14"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <p
                className={cn(
                  "min-w-0 text-center text-sm leading-snug tabular-nums",
                  FLIP_A_COIN_MUTED_TEXT_CLASS,
                )}
              >
                {coinUi.result}:{" "}
                {!showResultValues || resultSummary == null ? (
                  <strong className={FLIP_A_COIN_RESULT_TOTAL_CLASS}>-----</strong>
                ) : (
                  <strong
                    className={cn(
                      FLIP_A_COIN_RESULT_TOTAL_CLASS,
                      "text-base",
                    )}
                  >
                    {resultSummary}
                  </strong>
                )}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 shrink-0 gap-1.5 px-2.5"
                disabled={!showResultValues}
                aria-label={
                  copyResultCopied ? common.resultCopied : common.copyResult
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
            {isMultiCoin ? (
              <p
                className={cn(
                  "min-h-[1.125rem] text-xs tabular-nums",
                  FLIP_A_COIN_MUTED_TEXT_CLASS,
                )}
              >
                {showResultValues && breakdownLine != null ? (
                  <strong className={FLIP_A_COIN_RESULT_TOTAL_CLASS}>
                    {breakdownLine}
                  </strong>
                ) : (
                  "-----"
                )}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      <CoinSessionMenu
        history={flipHistory}
        onClearHistory={onClearFlipHistory}
        settingsDisabled={isFlipping}
      />
    </div>
  );
};
