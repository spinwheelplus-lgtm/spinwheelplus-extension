/** Same gap as Next.js `WHEEL_SPIN_TICK_THROTTLE_MS`. */
export const SPIN_TICK_THROTTLE_MS = 50;

let audioContext: AudioContext | null = null;
let lastTickAt = 0;
let tickOscillators: OscillatorNode[] = [];

const getContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  return audioContext;
};

const tone = (
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
): OscillatorNode => {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
  return oscillator;
};

const stopTickSources = (): void => {
  tickOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {
      // Already ended.
    }
  });
  tickOscillators = [];
};

export const unlockAudio = (): void => {
  const ctx = getContext();
  if (ctx) void ctx.resume();
};

export const resetTickThrottle = (): void => {
  lastTickAt = 0;
};

export const stopTick = (): void => {
  stopTickSources();
};

export const playTick = (): void => {
  const now = performance.now();
  if (now - lastTickAt < SPIN_TICK_THROTTLE_MS) return;
  lastTickAt = now;
  const ctx = getContext();
  if (!ctx) return;
  void ctx.resume();
  stopTickSources();
  tickOscillators.push(tone(ctx, 1960, ctx.currentTime, 0.028, "triangle", 0.07));
};

export const playWin = (): void => {
  stopTick();
  const ctx = getContext();
  if (!ctx) return;
  void ctx.resume();
  const t = ctx.currentTime;
  tone(ctx, 523.25, t, 0.12, "sine", 0.06);
  tone(ctx, 659.25, t + 0.1, 0.16, "sine", 0.06);
  tone(ctx, 783.99, t + 0.22, 0.22, "sine", 0.05);
};
