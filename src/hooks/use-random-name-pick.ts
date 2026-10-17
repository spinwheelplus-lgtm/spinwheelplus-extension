import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { playRandomNameRevealSound } from "@/lib/random-name/play-random-name-reveal-sound";
import {
  pickRandomNameRollFrame,
  RANDOM_NAME_ROLL_DURATION_MS,
  RANDOM_NAME_ROLL_TICK_MS,
} from "@/lib/random-name/random-name-roll-frame";
import { useRandomNameStore } from "@/store/random-name-store";

export const useRandomNamePick = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rollAnimation = useRandomNameStore(
    (state) => state.random_name_roll_animation,
  );
  const soundEnabled = useRandomNameStore(
    (state) => state.random_name_sound_enabled,
  );
  const computePick = useRandomNameStore(
    (state) => state.computeRandomNamePick,
  );
  const commitPick = useRandomNameStore(
    (state) => state.commitRandomNamePick,
  );

  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplay, setRollingDisplay] = useState<string | null>(null);
  const rollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRollTimer = useCallback(() => {
    if (rollTimerRef.current != null) {
      clearInterval(rollTimerRef.current);
      rollTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearRollTimer(), [clearRollTimer]);

  const pick = useCallback((): string | null => {
    if (isRolling) {
      return null;
    }

    const draw = computePick();
    if (!draw.ok) {
      return draw.error;
    }

    const reveal = (): void => {
      commitPick(draw.name, draw.index);
      if (soundEnabled) {
        playRandomNameRevealSound();
      }
    };

    if (!rollAnimation || prefersReducedMotion) {
      reveal();
      return null;
    }

    setIsRolling(true);
    setRollingDisplay(pickRandomNameRollFrame(draw.pool));

    const endAt = Date.now() + RANDOM_NAME_ROLL_DURATION_MS;
    clearRollTimer();

    rollTimerRef.current = setInterval(() => {
      if (Date.now() >= endAt) {
        clearRollTimer();
        reveal();
        setRollingDisplay(null);
        setIsRolling(false);
        return;
      }

      setRollingDisplay(pickRandomNameRollFrame(draw.pool));
    }, RANDOM_NAME_ROLL_TICK_MS);

    return null;
  }, [
    clearRollTimer,
    commitPick,
    computePick,
    isRolling,
    rollAnimation,
    prefersReducedMotion,
    soundEnabled,
  ]);

  return {
    pick,
    isRolling,
    rollingDisplay,
  };
};
