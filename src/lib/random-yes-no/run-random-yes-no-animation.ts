import { secureRandomInt } from "@/lib/random-number/secure-random-int";
import {
  RANDOM_YES_NO_FADE_STEP_MS,
  RANDOM_YES_NO_FLIP_STEP_MS,
  RANDOM_YES_NO_PICKER_DURATION_MS,
  RANDOM_YES_NO_PICKER_SETTLE_MS,
  RANDOM_YES_NO_TYPEWRITER_START_DELAY_MS,
  RANDOM_YES_NO_TYPEWRITER_TOTAL_MS,
} from "@/lib/random-yes-no/random-yes-no-animation-timing";
import type { RandomYesNoAnimationType } from "@/types/random-yes-no";

export type RandomYesNoAnimationFrame = {
  text: string;
  kind: RandomYesNoAnimationType;
  flip?: boolean;
};

export type RandomYesNoAnimationRunner = {
  cancel: () => void;
};

const PICKER_FRAME_COUNT = 18;
const FLIP_FRAME_COUNT = 5;
const FADE_FRAME_COUNT = 9;

const buildPickerStepDelays = (frameCount: number): number[] => {
  const stepCount = Math.max(frameCount - 1, 1);
  const delays: number[] = [];
  for (let i = 0; i < stepCount; i += 1) {
    const progress = stepCount <= 1 ? 1 : i / (stepCount - 1);
    delays.push(Math.round(42 + progress * progress * 210));
  }
  return delays;
};

export const buildPickerFrames = (
  pool: readonly string[],
  finalAnswer: string,
): RandomYesNoAnimationFrame[] => {
  const frames: RandomYesNoAnimationFrame[] = [];
  for (let i = 0; i < PICKER_FRAME_COUNT - 1; i += 1) {
    frames.push({
      text: pool[secureRandomInt(0, pool.length - 1)]!,
      kind: "picker",
    });
  }
  frames.push({ text: finalAnswer, kind: "picker" });
  return frames;
};

export const buildFlipFrames = (
  pool: readonly string[],
  finalAnswer: string,
): RandomYesNoAnimationFrame[] => {
  const frames: RandomYesNoAnimationFrame[] = [];
  for (let i = 0; i < FLIP_FRAME_COUNT - 1; i += 1) {
    frames.push({
      text: pool[secureRandomInt(0, pool.length - 1)]!,
      kind: "flip",
      flip: true,
    });
  }
  frames.push({ text: finalAnswer, kind: "flip", flip: true });
  return frames;
};

export const buildFadeFrames = (
  pool: readonly string[],
  finalAnswer: string,
): RandomYesNoAnimationFrame[] => {
  const frames: RandomYesNoAnimationFrame[] = [];
  for (let i = 0; i < FADE_FRAME_COUNT - 1; i += 1) {
    frames.push({
      text: pool[secureRandomInt(0, pool.length - 1)]!,
      kind: "fade",
    });
  }
  frames.push({ text: finalAnswer, kind: "fade" });
  return frames;
};

export const buildTypewriterFrames = (
  finalAnswer: string,
): RandomYesNoAnimationFrame[] => {
  const frames: RandomYesNoAnimationFrame[] = [
    { text: "", kind: "typewriter" },
  ];
  for (let i = 1; i <= finalAnswer.length; i += 1) {
    frames.push({
      text: finalAnswer.slice(0, i),
      kind: "typewriter",
    });
  }
  return frames;
};

type RunRandomYesNoAnimationOptions = {
  type: RandomYesNoAnimationType;
  pool: readonly string[];
  finalAnswer: string;
  onFrame: (frame: RandomYesNoAnimationFrame) => void;
  onComplete: () => void;
  reducedMotion: boolean;
};

const runPickerAnimation = (
  frames: RandomYesNoAnimationFrame[],
  onFrame: (frame: RandomYesNoAnimationFrame) => void,
  onComplete: () => void,
  isCancelled: () => boolean,
): (() => void) => {
  const delays = buildPickerStepDelays(frames.length);
  const totalStepMs = delays.reduce((sum, delay) => sum + delay, 0);
  const scale =
    totalStepMs > 0 ? RANDOM_YES_NO_PICKER_DURATION_MS / totalStepMs : 1;

  let index = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const advance = (): void => {
    if (isCancelled()) return;

    onFrame(frames[index]!);

    if (index >= frames.length - 1) {
      timeoutId = setTimeout(() => {
        if (!isCancelled()) {
          onComplete();
        }
      }, RANDOM_YES_NO_PICKER_SETTLE_MS);
      return;
    }

    index += 1;
    const delay = Math.round((delays[index - 1] ?? 120) * scale);
    timeoutId = setTimeout(advance, delay);
  };

  advance();

  return () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }
  };
};

const runSteppedAnimation = (
  frames: RandomYesNoAnimationFrame[],
  stepMs: number,
  onFrame: (frame: RandomYesNoAnimationFrame) => void,
  onComplete: () => void,
  isCancelled: () => boolean,
): (() => void) => {
  let index = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const advance = (): void => {
    if (isCancelled()) return;

    onFrame(frames[index]!);

    if (index >= frames.length - 1) {
      onComplete();
      return;
    }

    index += 1;
    timeoutId = setTimeout(advance, stepMs);
  };

  advance();

  return () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }
  };
};

const runTypewriterAnimation = (
  frames: RandomYesNoAnimationFrame[],
  onFrame: (frame: RandomYesNoAnimationFrame) => void,
  onComplete: () => void,
  isCancelled: () => boolean,
): (() => void) => {
  let index = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const charSteps = Math.max(frames.length - 1, 1);
  const charDelay = Math.max(
    45,
    Math.floor(
      (RANDOM_YES_NO_TYPEWRITER_TOTAL_MS -
        RANDOM_YES_NO_TYPEWRITER_START_DELAY_MS) /
        charSteps,
    ),
  );

  const advance = (): void => {
    if (isCancelled()) return;

    onFrame(frames[index]!);

    if (index >= frames.length - 1) {
      onComplete();
      return;
    }

    index += 1;
    const delay =
      index === 1 ? RANDOM_YES_NO_TYPEWRITER_START_DELAY_MS : charDelay;
    timeoutId = setTimeout(advance, delay);
  };

  advance();

  return () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }
  };
};

export const runRandomYesNoAnimation = ({
  type,
  pool,
  finalAnswer,
  onFrame,
  onComplete,
  reducedMotion,
}: RunRandomYesNoAnimationOptions): RandomYesNoAnimationRunner => {
  let cancelled = false;
  let stopRunner: (() => void) | null = null;

  const cancel = (): void => {
    cancelled = true;
    stopRunner?.();
    stopRunner = null;
  };

  const isCancelled = (): boolean => cancelled;

  if (reducedMotion || pool.length === 0) {
    onFrame({ text: finalAnswer, kind: type });
    onComplete();
    return { cancel };
  }

  switch (type) {
    case "picker":
      stopRunner = runPickerAnimation(
        buildPickerFrames(pool, finalAnswer),
        onFrame,
        onComplete,
        isCancelled,
      );
      break;
    case "flip":
      stopRunner = runSteppedAnimation(
        buildFlipFrames(pool, finalAnswer),
        RANDOM_YES_NO_FLIP_STEP_MS,
        onFrame,
        onComplete,
        isCancelled,
      );
      break;
    case "fade":
      stopRunner = runSteppedAnimation(
        buildFadeFrames(pool, finalAnswer),
        RANDOM_YES_NO_FADE_STEP_MS,
        onFrame,
        onComplete,
        isCancelled,
      );
      break;
    case "typewriter":
      stopRunner = runTypewriterAnimation(
        buildTypewriterFrames(finalAnswer),
        onFrame,
        onComplete,
        isCancelled,
      );
      break;
  }

  return { cancel };
};
