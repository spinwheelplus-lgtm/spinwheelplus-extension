import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { playRandomYesNoRevealSound } from "@/lib/random-yes-no/play-random-yes-no-reveal-sound";
import {
  runRandomYesNoAnimation,
  type RandomYesNoAnimationFrame,
} from "@/lib/random-yes-no/run-random-yes-no-animation";
import { useRandomYesNoStore } from "@/store/random-yes-no-store";
import type { RandomYesNoAnimationType } from "@/types/random-yes-no";

export type RandomYesNoDisplayState = {
  text: string;
  animationType: RandomYesNoAnimationType;
  flipRotation: number;
};

const INITIAL_DISPLAY: RandomYesNoDisplayState = {
  text: "",
  animationType: "picker",
  flipRotation: 0,
};

export const useRandomYesNoAsk = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationType = useRandomYesNoStore(
    (state) => state.random_yes_no_animation_type,
  );
  const soundEnabled = useRandomYesNoStore(
    (state) => state.random_yes_no_sound_enabled,
  );
  const pickForMode = useRandomYesNoStore(
    (state) => state.pickRandomYesNoAnswerForMode,
  );
  const commitAnswer = useRandomYesNoStore(
    (state) => state.commitRandomYesNoAnswer,
  );

  const [isAnimating, setIsAnimating] = useState(false);
  const [display, setDisplay] = useState<RandomYesNoDisplayState>(
    INITIAL_DISPLAY,
  );
  const runnerRef = useRef<ReturnType<typeof runRandomYesNoAnimation> | null>(
    null,
  );

  const cancelAnimation = useCallback(() => {
    runnerRef.current?.cancel();
    runnerRef.current = null;
  }, []);

  useEffect(() => () => cancelAnimation(), [cancelAnimation]);

  const handleFrame = useCallback((frame: RandomYesNoAnimationFrame) => {
    setDisplay((current) => ({
      text: frame.text,
      animationType: frame.kind,
      flipRotation:
        frame.kind === "flip" && frame.flip
          ? current.flipRotation + 180
          : current.flipRotation,
    }));
  }, []);

  const ask = useCallback((): string | null => {
    if (isAnimating) return null;

    const pick = pickForMode();
    if (!pick.ok) return pick.error;

    const { answer: finalAnswer, pool } = pick;

    cancelAnimation();
    setIsAnimating(true);
    setDisplay({
      text: prefersReducedMotion ? finalAnswer : "",
      animationType,
      flipRotation: 0,
    });

    const finish = (): void => {
      commitAnswer(finalAnswer);
      if (soundEnabled) {
        playRandomYesNoRevealSound();
      }
      setDisplay((current) => ({
        text: finalAnswer,
        animationType,
        flipRotation: current.flipRotation,
      }));
      setIsAnimating(false);
      runnerRef.current = null;
    };

    if (prefersReducedMotion) {
      finish();
      return null;
    }

    runnerRef.current = runRandomYesNoAnimation({
      type: animationType,
      pool,
      finalAnswer,
      onFrame: handleFrame,
      onComplete: finish,
      reducedMotion: prefersReducedMotion,
    });

    return null;
  }, [
    animationType,
    cancelAnimation,
    commitAnswer,
    handleFrame,
    isAnimating,
    pickForMode,
    prefersReducedMotion,
    soundEnabled,
  ]);

  return {
    ask,
    isAnimating,
    display,
  };
};
