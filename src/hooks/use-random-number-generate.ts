import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { playRandomNumberRevealSound } from "@/lib/random-number/play-random-number-reveal-sound";
import {
  pickRandomNumberRollFrame,
  RANDOM_NUMBER_ROLL_DURATION_MS,
  RANDOM_NUMBER_ROLL_TICK_MS,
} from "@/lib/random-number/random-number-roll-frame";
import { useRandomNumberStore } from "@/store/random-number-store";

export const useRandomNumberGenerate = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rollAnimation = useRandomNumberStore(
    (state) => state.random_number_roll_animation,
  );
  const soundEnabled = useRandomNumberStore(
    (state) => state.random_number_sound_enabled,
  );
  const computeDraw = useRandomNumberStore(
    (state) => state.computeRandomNumberDraw,
  );
  const commitDraw = useRandomNumberStore(
    (state) => state.commitRandomNumberDraw,
  );

  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplay, setRollingDisplay] = useState<number[]>([]);
  const rollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRollTimer = useCallback(() => {
    if (rollTimerRef.current != null) {
      clearInterval(rollTimerRef.current);
      rollTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearRollTimer(), [clearRollTimer]);

  const generate = useCallback((): string | null => {
    if (isRolling) {
      return null;
    }

    const draw = computeDraw();
    if (!draw.ok) {
      return draw.error;
    }

    const reveal = (): void => {
      commitDraw(draw.numbers);
      if (soundEnabled) {
        playRandomNumberRevealSound();
      }
    };

    if (!rollAnimation || prefersReducedMotion) {
      reveal();
      return null;
    }

    const count = draw.numbers.length;
    setIsRolling(true);
    setRollingDisplay(pickRandomNumberRollFrame(count, draw.pool));

    const endAt = Date.now() + RANDOM_NUMBER_ROLL_DURATION_MS;
    clearRollTimer();

    rollTimerRef.current = setInterval(() => {
      if (Date.now() >= endAt) {
        clearRollTimer();
        reveal();
        setRollingDisplay([]);
        setIsRolling(false);
        return;
      }

      setRollingDisplay(pickRandomNumberRollFrame(count, draw.pool));
    }, RANDOM_NUMBER_ROLL_TICK_MS);

    return null;
  }, [
    clearRollTimer,
    commitDraw,
    computeDraw,
    isRolling,
    rollAnimation,
    prefersReducedMotion,
    soundEnabled,
  ]);

  return {
    generate,
    isRolling,
    rollingDisplay,
  };
};
