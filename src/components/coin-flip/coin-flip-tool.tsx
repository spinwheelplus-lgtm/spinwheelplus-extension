import { useCallback, useMemo } from "react";

import { CoinHistorySection } from "@/components/coin-flip/coin-history-section";
import { CoinMultiPanel } from "@/components/coin-flip/coin-multi-panel";
import { CoinTablePanel } from "@/components/coin-flip/coin-table-panel";
import { useFlipCoin } from "@/hooks/use-flip-coin";
import { useRandomToolActionShortcut } from "@/hooks/use-random-tool-action-shortcut";
import { cn } from "@/lib/cn";
import { buildFlipCoinHistoryEntry } from "@/lib/coin-flip/build-flip-coin-history-entry";
import { createFlipCoinSlot } from "@/lib/coin-flip/create-flip-coin-slot";
import type { FlipCoinMetal } from "@/lib/coin-flip/flip-a-coin-assets";
import { FLIP_A_COIN_TOOL_SHELL_CLASS } from "@/lib/coin-flip/flip-a-coin-surface-classes";
import {
  createDefaultFlipCoinTableSlots,
  isDefaultFlipCoinSetup,
  prependFlipCoinHistoryEntry,
} from "@/lib/coin-flip/persist";
import {
  DEFAULT_FLIP_COIN_FACE_STYLE,
  flipCoinHistoryFaceLabelsForStyle,
  type FlipCoinFaceStyle,
} from "@/lib/coin-flip/flip-coin-face-style";
import { playFlipCoinRevealSound } from "@/lib/coin-flip/play-flip-coin-reveal-sound";
import { useCoinFlipStore } from "@/store/coin-flip-store";
import { useImmersiveStore } from "@/store/immersive-store";
import {
  DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
  MAX_FLIP_COIN_COUNT,
  type FlipCoinClickFlipMode,
  type FlipCoinSlot,
} from "@/types/coin-flip";

export const CoinFlipTool = () => {
  const immersive = useImmersiveStore((state) => state.immersive);
  const ready = useCoinFlipStore((state) => state.ready);
  const coinSlots = useCoinFlipStore((state) => state.coinSlots);
  const setCoinSlots = useCoinFlipStore((state) => state.setCoinSlots);
  const clickFlipMode = useCoinFlipStore((state) => state.clickFlipMode);
  const setClickFlipMode = useCoinFlipStore((state) => state.setClickFlipMode);
  const soundOn = useCoinFlipStore((state) => state.soundOn);
  const faceStyle = useCoinFlipStore((state) => state.faceStyle);
  const setFaceStyle = useCoinFlipStore((state) => state.setFaceStyle);
  const flipHistory = useCoinFlipStore((state) => state.flipHistory);
  const setFlipHistory = useCoinFlipStore((state) => state.setFlipHistory);

  const coinIds = useMemo(
    () => coinSlots.map((slot) => slot.id),
    [coinSlots],
  );

  const {
    flip,
    flipOne,
    handleFlipComplete,
    resetFlipState,
    flipRequest,
    phase,
    results,
    isFlipping,
  } = useFlipCoin(coinIds);

  useRandomToolActionShortcut(flip, {
    disabled: isFlipping || !ready || coinSlots.length === 0,
  });

  const applyCoinSetup = useCallback(
    (
      slots: FlipCoinSlot[],
      nextClickFlipMode?: FlipCoinClickFlipMode,
      nextFaceStyle?: FlipCoinFaceStyle,
    ) => {
      if (slots.length === 0 || isFlipping) return;
      resetFlipState();
      setCoinSlots(slots);
      if (nextClickFlipMode != null) setClickFlipMode(nextClickFlipMode);
      if (nextFaceStyle != null) setFaceStyle(nextFaceStyle);
    },
    [isFlipping, resetFlipState, setClickFlipMode, setCoinSlots, setFaceStyle],
  );

  const onFlipComplete = useCallback(
    (requestId: number) => {
      const settledResults = handleFlipComplete(requestId);
      if (settledResults != null) {
        const entry = buildFlipCoinHistoryEntry(
          coinIds,
          settledResults,
          flipCoinHistoryFaceLabelsForStyle(faceStyle),
        );
        if (entry != null) {
          const history = useCoinFlipStore.getState().flipHistory;
          setFlipHistory(prependFlipCoinHistoryEntry(history, entry));
        }
      }
      if (soundOn) playFlipCoinRevealSound();
    },
    [coinIds, faceStyle, handleFlipComplete, setFlipHistory, soundOn],
  );

  const handleClearHistory = useCallback(() => {
    setFlipHistory([]);
  }, [setFlipHistory]);

  const handleAddCoin = useCallback(
    (metal: FlipCoinMetal) => {
      if (isFlipping) return;
      if (coinSlots.length >= MAX_FLIP_COIN_COUNT) return;
      setCoinSlots([...coinSlots, createFlipCoinSlot(metal)]);
    },
    [coinSlots, isFlipping, setCoinSlots],
  );

  const handleRemoveCoin = useCallback(
    (id: string) => {
      if (isFlipping || coinSlots.length <= 1) return;
      setCoinSlots(coinSlots.filter((slot) => slot.id !== id));
    },
    [coinSlots, isFlipping, setCoinSlots],
  );

  const handleUpdateMetal = useCallback(
    (id: string, metal: FlipCoinMetal) => {
      if (isFlipping) return;
      setCoinSlots(
        coinSlots.map((slot) => (slot.id === id ? { ...slot, metal } : slot)),
      );
    },
    [coinSlots, isFlipping, setCoinSlots],
  );

  const handleImportCoins = useCallback(
    (
      slots: FlipCoinSlot[],
      nextClickFlipMode?: FlipCoinClickFlipMode,
      nextFaceStyle?: FlipCoinFaceStyle,
    ) => {
      applyCoinSetup(slots, nextClickFlipMode, nextFaceStyle);
    },
    [applyCoinSetup],
  );

  const handleResetCoins = useCallback(() => {
    if (isFlipping) return;
    applyCoinSetup(
      createDefaultFlipCoinTableSlots(),
      DEFAULT_FLIP_COIN_CLICK_FLIP_MODE,
      DEFAULT_FLIP_COIN_FACE_STYLE,
    );
  }, [applyCoinSetup, isFlipping]);

  const isDefaultCoinTable = isDefaultFlipCoinSetup(
    coinSlots,
    clickFlipMode,
    faceStyle,
  );

  return (
    <>
      <div
        className={cn(
          immersive
            ? "flex min-h-full flex-1 flex-col p-3"
            : FLIP_A_COIN_TOOL_SHELL_CLASS,
        )}
      >
        <CoinTablePanel
          coinSlots={coinSlots}
          hasHydrated={ready}
          flip={flip}
          flipOne={flipOne}
          handleFlipComplete={onFlipComplete}
          flipRequest={flipRequest}
          phase={phase}
          results={results}
          isFlipping={isFlipping}
          clickFlipMode={clickFlipMode}
          faceStyle={faceStyle}
          flipHistory={flipHistory}
          onClearFlipHistory={handleClearHistory}
        />
        {immersive ? null : (
          <CoinMultiPanel
            coinSlots={coinSlots}
            onAddCoin={handleAddCoin}
            onRemoveCoin={handleRemoveCoin}
            onUpdateMetal={handleUpdateMetal}
            faceStyle={faceStyle}
            onFaceStyleChange={setFaceStyle}
            disabled={isFlipping}
            clickFlipMode={clickFlipMode}
            isDefaultCoinTable={isDefaultCoinTable}
            onImportCoins={handleImportCoins}
            onResetCoins={handleResetCoins}
          />
        )}
      </div>
      {immersive ? null : (
        <CoinHistorySection
          history={flipHistory}
          historyReady={ready}
          onClearHistory={handleClearHistory}
        />
      )}
    </>
  );
};
