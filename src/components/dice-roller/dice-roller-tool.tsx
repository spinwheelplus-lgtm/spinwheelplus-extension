import { useCallback, useEffect, useRef, useState } from "react";

import { DiceHistorySection } from "@/components/dice-roller/dice-history-section";
import { DiceMultiPanel } from "@/components/dice-roller/dice-multi-panel";
import { DiceTablePanel } from "@/components/dice-roller/dice-table-panel";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useRandomToolActionShortcut } from "@/hooks/use-random-tool-action-shortcut";
import { cn } from "@/lib/cn";
import { buildRollDiceHistoryEntry } from "@/lib/dice-roller/build-roll-dice-history-entry";
import { rollDiceSlotCanScoreNumber, summarizeRollDiceSlots } from "@/lib/dice-roller/summarize-roll-dice-results";
import {
  applyRollDiceSlotSides,
  createRollDiceSlot,
} from "@/lib/dice-roller/create-roll-dice-slot";
import {
  DICE_ROLL_ANIMATION_MS,
  DICE_TILT_UNLOAD_MS,
} from "@/lib/dice-roller/dice-roll-shared";
import { getDiceTypeDefinition } from "@/lib/dice-roller/dice-type-registry";
import {
  createDefaultRollDiceTableSlots,
  isDefaultRollDiceSetup,
  prependRollDiceHistoryEntry,
} from "@/lib/dice-roller/persist";
import { playRollDiceRevealSound } from "@/lib/dice-roller/play-roll-dice-reveal-sound";
import type { DiceStagePose } from "@/lib/dice-roller/roll-a-dice-classes";
import { ROLL_A_DICE_TOOL_SHELL_CLASS } from "@/lib/dice-roller/roll-a-dice-surface-classes";
import { computeRollDiceFinalTotal } from "@/lib/dice-roller/roll-dice-modifier";
import { useDiceRollerStore } from "@/store/dice-roller-store";
import { useImmersiveStore } from "@/store/immersive-store";
import {
  DEFAULT_ROLL_DICE_CLICK_ROLL_MODE,
  MAX_ROLL_DICE_COUNT,
  type DiceRotation,
  type DiceSides,
  type RollDiceAppearance,
  type RollDiceClickRollMode,
  type RollDiceSlot,
} from "@/types/dice-roller";

type PendingRoll = {
  id: string;
  face: number;
  rotation: DiceRotation;
};

const hydrateRotationRefs = (
  target: Record<string, DiceRotation>,
  slots: readonly RollDiceSlot[],
): void => {
  for (const key of Object.keys(target)) {
    delete target[key];
  }
  for (const slot of slots) {
    target[slot.id] = slot.rotation;
  }
};

export const DiceRollerTool = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const immersive = useImmersiveStore((state) => state.immersive);
  const ready = useDiceRollerStore((state) => state.ready);
  const diceSlots = useDiceRollerStore((state) => state.diceSlots);
  const setDiceSlots = useDiceRollerStore((state) => state.setDiceSlots);
  const rollModifier = useDiceRollerStore((state) => state.rollModifier);
  const setRollModifier = useDiceRollerStore((state) => state.setRollModifier);
  const clickRollMode = useDiceRollerStore((state) => state.clickRollMode);
  const setClickRollMode = useDiceRollerStore((state) => state.setClickRollMode);
  const rollHistory = useDiceRollerStore((state) => state.rollHistory);
  const setRollHistory = useDiceRollerStore((state) => state.setRollHistory);

  const rotationRefs = useRef<Record<string, DiceRotation>>({});
  const pendingRollRef = useRef<PendingRoll[]>([]);
  const rollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tiltTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const diceSlotsRef = useRef<RollDiceSlot[]>(diceSlots);
  const [stagePose, setStagePose] = useState<DiceStagePose>("waiting");
  const [isRolling, setIsRolling] = useState(false);
  const [hasHydratedPose, setHasHydratedPose] = useState(false);

  diceSlotsRef.current = diceSlots;

  const clearTimers = useCallback(() => {
    if (rollTimerRef.current != null) {
      clearTimeout(rollTimerRef.current);
      rollTimerRef.current = null;
    }
    if (tiltTimerRef.current != null) {
      clearTimeout(tiltTimerRef.current);
      tiltTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    hydrateRotationRefs(rotationRefs.current, diceSlots);
    setStagePose("waiting");
    setHasHydratedPose(true);
    return clearTimers;
    // Hydrate pose once after store ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, clearTimers]);

  const finishRoll = useCallback(() => {
    const pending = pendingRollRef.current;
    const pendingById = new Map(pending.map((item) => [item.id, item]));
    const prev = diceSlotsRef.current;
    const nextSlots = prev.map((slot) => {
      const roll = pendingById.get(slot.id);
      return roll != null
        ? { ...slot, result: roll.face, rotation: roll.rotation }
        : slot;
    });

    const historyEntry = buildRollDiceHistoryEntry(
      nextSlots,
      useDiceRollerStore.getState().rollModifier,
    );
    if (historyEntry != null) {
      setRollHistory(
        prependRollDiceHistoryEntry(
          useDiceRollerStore.getState().rollHistory,
          historyEntry,
        ),
      );
    }

    setDiceSlots(nextSlots);
    setIsRolling(false);
    setStagePose("result");
    if (useDiceRollerStore.getState().soundOn) {
      playRollDiceRevealSound();
    }
  }, [setDiceSlots, setRollHistory]);

  const commitRollForSlots = useCallback(
    (targetSlots: readonly RollDiceSlot[]) => {
      if (targetSlots.length === 0) return;

      const pending: PendingRoll[] = targetSlots.map((slot) => {
        const definition = getDiceTypeDefinition(slot.sides);
        const face = definition.pickFace();
        const current = rotationRefs.current[slot.id] ?? slot.rotation;
        const nextRotation = definition.buildRollRotation(face, current);
        rotationRefs.current[slot.id] = nextRotation;
        return { id: slot.id, face, rotation: nextRotation };
      });

      const pendingIds = new Set(pending.map((item) => item.id));
      const pendingById = new Map(pending.map((item) => [item.id, item]));
      pendingRollRef.current = pending;
      setIsRolling(true);
      setDiceSlots(
        diceSlotsRef.current.map((slot) => {
          const isSingleDieRoll =
            targetSlots.length === 1 && diceSlotsRef.current.length > 1;
          if (!pendingIds.has(slot.id)) {
            return isSingleDieRoll ? { ...slot, result: null } : slot;
          }
          const roll = pendingById.get(slot.id)!;
          return { ...slot, rotation: roll.rotation, result: null };
        }),
      );

      if (prefersReducedMotion) {
        finishRoll();
        return;
      }

      rollTimerRef.current = setTimeout(() => {
        finishRoll();
      }, DICE_ROLL_ANIMATION_MS);
    },
    [finishRoll, prefersReducedMotion, setDiceSlots],
  );

  const commitRoll = useCallback(() => {
    commitRollForSlots(diceSlots);
  }, [commitRollForSlots, diceSlots]);

  const commitRollDie = useCallback(
    (id: string) => {
      const slot = diceSlots.find((entry) => entry.id === id);
      if (slot != null) commitRollForSlots([slot]);
    },
    [commitRollForSlots, diceSlots],
  );

  const startRoll = useCallback(
    (rollAction: () => void) => {
      if (isRolling || !hasHydratedPose || diceSlots.length === 0) return;
      clearTimers();
      const wasWaiting = stagePose === "waiting";
      setStagePose("rolling");
      // Arm Rolling before the tilt delay. Zustand rotation can land in a
      // later paint than this flag; WebGL must not treat that as a snap.
      setIsRolling(true);
      if (wasWaiting && !prefersReducedMotion) {
        tiltTimerRef.current = setTimeout(() => {
          rollAction();
        }, DICE_TILT_UNLOAD_MS);
        return;
      }
      rollAction();
    },
    [
      clearTimers,
      diceSlots.length,
      hasHydratedPose,
      isRolling,
      prefersReducedMotion,
      stagePose,
    ],
  );

  const handleRoll = useCallback(() => {
    startRoll(commitRoll);
  }, [commitRoll, startRoll]);

  const handleRollDie = useCallback(
    (id: string) => {
      if (!diceSlots.some((slot) => slot.id === id)) return;
      startRoll(() => commitRollDie(id));
    },
    [commitRollDie, diceSlots, startRoll],
  );

  const handleAddDie = useCallback(
    (sides: DiceSides) => {
      if (isRolling || diceSlots.length >= MAX_ROLL_DICE_COUNT) return;
      clearTimers();
      setIsRolling(false);
      setStagePose("waiting");
      const slot = createRollDiceSlot(sides);
      rotationRefs.current[slot.id] = slot.rotation;
      setDiceSlots([...diceSlots, slot]);
    },
    [clearTimers, diceSlots, isRolling, setDiceSlots],
  );

  const handleRemoveDie = useCallback(
    (id: string) => {
      if (isRolling || diceSlots.length <= 1) return;
      clearTimers();
      setIsRolling(false);
      setStagePose("waiting");
      setDiceSlots(diceSlots.filter((slot) => slot.id !== id));
      delete rotationRefs.current[id];
    },
    [clearTimers, diceSlots, isRolling, setDiceSlots],
  );

  const handleUpdateAppearance = useCallback(
    (id: string, patch: Partial<RollDiceAppearance>) => {
      if (isRolling) return;
      setDiceSlots(
        diceSlots.map((slot) =>
          slot.id === id
            ? { ...slot, appearance: { ...slot.appearance, ...patch } }
            : slot,
        ),
      );
    },
    [diceSlots, isRolling, setDiceSlots],
  );

  const handleChangeDieSides = useCallback(
    (id: string, sides: DiceSides) => {
      if (isRolling) return;
      setDiceSlots(
        diceSlots.map((slot) => {
          if (slot.id !== id) return slot;
          const next = applyRollDiceSlotSides(slot, sides);
          rotationRefs.current[id] = next.rotation;
          return next;
        }),
      );
    },
    [diceSlots, isRolling, setDiceSlots],
  );

  const handleClearRollHistory = useCallback(() => {
    setRollHistory([]);
  }, [setRollHistory]);

  const handleResetDice = useCallback(() => {
    if (isRolling) return;
    clearTimers();
    pendingRollRef.current = [];
    setIsRolling(false);
    setStagePose("waiting");
    const defaults = createDefaultRollDiceTableSlots();
    hydrateRotationRefs(rotationRefs.current, defaults);
    setDiceSlots(defaults);
    setRollModifier(0);
    setClickRollMode(DEFAULT_ROLL_DICE_CLICK_ROLL_MODE);
  }, [clearTimers, isRolling, setClickRollMode, setDiceSlots, setRollModifier]);

  const handleImportDice = useCallback(
    (
      slots: RollDiceSlot[],
      modifier?: number,
      nextClickRollMode?: RollDiceClickRollMode,
    ) => {
      if (isRolling || slots.length === 0) return;
      clearTimers();
      pendingRollRef.current = [];
      setIsRolling(false);
      setStagePose("waiting");
      hydrateRotationRefs(rotationRefs.current, slots);
      setDiceSlots([...slots]);
      if (modifier != null) setRollModifier(modifier);
      if (nextClickRollMode != null) setClickRollMode(nextClickRollMode);
      setHasHydratedPose(true);
    },
    [clearTimers, isRolling, setClickRollMode, setDiceSlots, setRollModifier],
  );

  useRandomToolActionShortcut(handleRoll, {
    disabled: isRolling || diceSlots.length === 0,
  });

  const rollSummary = summarizeRollDiceSlots(diceSlots);
  const diceTotal = rollSummary.diceTotal;
  const finalTotal =
    diceTotal != null
      ? computeRollDiceFinalTotal(diceTotal, rollModifier)
      : null;
  const isDefaultDiceTable = isDefaultRollDiceSetup(
    diceSlots,
    rollModifier,
    clickRollMode,
  );

  return (
    <>
      <div
        className={cn(
          immersive
            ? "flex min-h-full flex-1 flex-col p-3"
            : ROLL_A_DICE_TOOL_SHELL_CLASS,
        )}
      >
        <DiceTablePanel
          diceSlots={diceSlots}
          stagePose={stagePose}
          isRolling={isRolling}
          reduceMotion={prefersReducedMotion}
          hasHydrated={hasHydratedPose}
          onRoll={handleRoll}
          onRollDie={handleRollDie}
          diceTotal={diceTotal}
          finalTotal={finalTotal}
          modifier={rollModifier}
          wordOnly={rollSummary.isWordOnly}
          scoresNumbers={diceSlots.some(rollDiceSlotCanScoreNumber)}
          faceLabels={rollSummary.labels ?? null}
          showTotal={!isRolling}
          rollHistory={rollHistory}
          onClearRollHistory={handleClearRollHistory}
        />
        {immersive ? null : (
          <DiceMultiPanel
            diceSlots={diceSlots}
            onAddDie={handleAddDie}
            onRemoveDie={handleRemoveDie}
            onUpdateAppearance={handleUpdateAppearance}
            onChangeDieSides={handleChangeDieSides}
            onResetDice={handleResetDice}
            onImportDice={handleImportDice}
            isDefaultDiceTable={isDefaultDiceTable}
            disabled={isRolling}
            modifier={rollModifier}
            onModifierChange={setRollModifier}
            clickRollMode={clickRollMode}
          />
        )}
      </div>
      {immersive ? null : (
        <DiceHistorySection
          history={rollHistory}
          historyReady={ready}
          onClearHistory={handleClearRollHistory}
        />
      )}
    </>
  );
};
