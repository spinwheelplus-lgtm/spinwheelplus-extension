import { readStyle2StopStrength } from "@/lib/spin-style";
import { TWO_PI } from "@/lib/wheel-slices";

/** Homepage default (`stateIdleSpeed`); engine fallback 0.14 feels faster. */
export const WHEEL_IDLE_TURNS_PER_SEC = 0.05;

const POINTER_ANGLE = -Math.PI / 2;
export const SPIN_TICK_MS = 1000 / 60;
const TICK_MS = SPIN_TICK_MS;
const MAX_TURNS_PER_SECOND = 2.8;
const STYLE2_MAX_TURNS_PER_SECOND = 1.8;
const STYLE2_ACCEL_SEC = 0.5;
const STYLE2_DELAY_MIN_MS = 300;
const STYLE2_DELAY_MAX_MS = 700;
const STRENGTH_EXTRA_ROUNDS: ReadonlyArray<readonly [number, number]> = [
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
];

/** Land slightly inside the winning slice, not always dead-center. */
export const landingAngleInSlice = (
  start: number,
  span: number,
  unit: number,
): number => {
  const end = start + span;
  const center = start + span / 2;
  const sixDeg = (6 * Math.PI) / 180;
  if (span < sixDeg) return center;
  const margin = Math.PI / 180;
  const safeStart = start + Math.min(margin, span / 2 - 1e-6);
  const safeEnd = end - Math.min(margin, span / 2 - 1e-6);
  if (safeEnd <= safeStart) return center;
  return safeStart + unit * (safeEnd - safeStart);
};

export const remainingOffsetToPointer = (
  currentAngle: number,
  landingAngle: number,
): number =>
  (((POINTER_ANGLE - landingAngle - currentAngle) % TWO_PI) + TWO_PI) % TWO_PI;

/**
 * Accel → hold → decel → crawl, then scale so the wheel stops on `targetOffset`
 * plus whole turns (same profile as the Next.js style1 engine).
 */
export const buildStyle1Deltas = (
  durationMs: number,
  targetOffset: number,
): number[] => {
  const T = Math.max(durationMs / 1000, TICK_MS / 1000);
  const ticksPerSecond = 1000 / TICK_MS;
  const totalTicks = Math.max(1, Math.round(T * ticksPerSecond));

  const accelTime = Math.min(T * 0.12, 2.5);
  let decelTime = Math.min(T * 0.5, 6);
  let crawlTime = Math.min(T * 0.25, 3);
  if (T <= 3) {
    crawlTime = Math.min(T * 0.3, 3);
    const remainder = Math.max(T - accelTime - crawlTime, 0);
    decelTime = Math.min(decelTime, Math.max(remainder * 0.6, 0.3));
  }

  const accelTicks = Math.max(1, Math.round(accelTime * ticksPerSecond));
  let decelTicks = Math.max(1, Math.round(decelTime * ticksPerSecond));
  let crawlTicks = Math.max(1, Math.round(crawlTime * ticksPerSecond));
  let holdTicks = Math.max(
    0,
    totalTicks - accelTicks - decelTicks - crawlTicks,
  );

  if (holdTicks === 0 && accelTicks + decelTicks + crawlTicks > totalTicks) {
    const overflow = accelTicks + decelTicks + crawlTicks - totalTicks;
    const cutDecel = Math.min(overflow, Math.max(0, decelTicks - 1));
    decelTicks -= cutDecel;
    if (overflow > cutDecel && crawlTicks > 1) {
      crawlTicks = Math.max(1, crawlTicks - (overflow - cutDecel));
    }
    holdTicks = Math.max(
      0,
      totalTicks - accelTicks - decelTicks - crawlTicks,
    );
  }

  const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
  const decelCurve = (t: number) => 0.08 + 0.92 * (1 - t) ** 2.5;
  const crawlCurve = (t: number) => 0.06 * (1 - t) ** 2;
  const maxRadPerTick = (MAX_TURNS_PER_SECOND * TWO_PI) / ticksPerSecond;
  const rawDeltas: number[] = [];

  for (let i = 0; i < accelTicks; i += 1) {
    const t = (i + 1) / accelTicks;
    rawDeltas.push(maxRadPerTick * easeOutQuad(t));
  }
  for (let i = 0; i < holdTicks; i += 1) rawDeltas.push(maxRadPerTick);
  for (let i = 0; i < decelTicks; i += 1) {
    const t = (i + 1) / decelTicks;
    rawDeltas.push(Math.max(maxRadPerTick * decelCurve(t), 1e-6));
  }
  for (let i = 0; i < crawlTicks; i += 1) {
    const t = (i + 1) / crawlTicks;
    const speedFactor = Math.max(crawlCurve(t), 1e-6 / maxRadPerTick);
    rawDeltas.push(maxRadPerTick * speedFactor);
  }

  const rawTotal = rawDeltas.reduce((sum, d) => sum + d, 0);
  if (rawTotal <= 0) return [targetOffset];

  let fullTurns = Math.max(1, Math.round((rawTotal - targetOffset) / TWO_PI));
  if (T <= 3) fullTurns = Math.min(fullTurns, 6);
  const stopAngle = fullTurns * TWO_PI + targetOffset;
  const scale = stopAngle / rawTotal;
  const deltas = rawDeltas.map((d) => d * scale);

  const actualSum = deltas.reduce((sum, d) => sum + d, 0);
  const err = stopAngle - actualSum;
  if (Math.abs(err) > 1e-10 && deltas.length > 0) {
    const tailCount = Math.min(8, Math.max(1, Math.floor(deltas.length * 0.05)));
    const perTick = err / tailCount;
    for (let i = deltas.length - tailCount; i < deltas.length; i += 1) {
      if (i >= 0) deltas[i] += perTick;
    }
  }
  return deltas;
};

export const spinDeltaAtElapsed = (
  deltas: number[],
  elapsedMs: number,
): { delta: number; done: boolean } => {
  const durationMs = deltas.length * TICK_MS;
  if (elapsedMs >= durationMs) {
    return {
      delta: deltas.reduce((sum, d) => sum + d, 0),
      done: true,
    };
  }
  const t = elapsedMs / TICK_MS;
  const index = Math.min(deltas.length - 1, Math.floor(t));
  const frac = t - index;
  let delta = 0;
  for (let i = 0; i < index; i += 1) delta += deltas[i] ?? 0;
  delta += (deltas[index] ?? 0) * frac;
  return { delta, done: false };
};

export const sliceIndexUnderPointer = (
  rotation: number,
  slices: { start: number; span: number }[],
): number => {
  if (slices.length === 0) return -1;
  const pointer =
    ((POINTER_ANGLE - rotation) % TWO_PI + TWO_PI) % TWO_PI;
  for (let i = 0; i < slices.length; i += 1) {
    const entry = slices[i];
    if (!entry) continue;
    const local = ((entry.start + Math.PI / 2) % TWO_PI + TWO_PI) % TWO_PI;
    const rel = (pointer - local + TWO_PI) % TWO_PI;
    if (rel < entry.span) return i;
  }
  return 0;
};

export type Style2Phase =
  | "accel"
  | "constant"
  | "delay"
  | "extraRounds"
  | "decel";

export type Style2Session = {
  phase: Style2Phase;
  rotation: number;
  accelIndex: number;
  accelTicks: number;
  constantRad: number;
  delayTicksLeft: number;
  extraRadLeft: number;
  decelDeltas: number[];
  decelTick: number;
  winnerIndex: number;
  landingAngle: number;
};

export const createStyle2Session = (rotation: number): Style2Session => {
  const ticksPerSecond = 1000 / TICK_MS;
  return {
    phase: "accel",
    rotation,
    accelIndex: 0,
    accelTicks: Math.max(1, Math.round(STYLE2_ACCEL_SEC * ticksPerSecond)),
    constantRad: (STYLE2_MAX_TURNS_PER_SECOND * TWO_PI) / ticksPerSecond,
    delayTicksLeft: 0,
    extraRadLeft: 0,
    decelDeltas: [],
    decelTick: 0,
    winnerIndex: -1,
    landingAngle: 0,
  };
};

export const style2IsWaitingStop = (session: Style2Session): boolean =>
  session.phase === "accel" || session.phase === "constant";

const buildStyle2DecelDeltas = (stopAngle: number): number[] => {
  const ticksPerSecond = 1000 / TICK_MS;
  const maxRadPerTick = (STYLE2_MAX_TURNS_PER_SECOND * TWO_PI) / ticksPerSecond;
  const totalRotation = stopAngle + TWO_PI;
  const crawlTicks = 12;
  const crawlSumFactor =
    ((crawlTicks + 1) * (2 * crawlTicks + 1)) / (6 * crawlTicks);
  const q = (2 * totalRotation) / maxRadPerTick - 1;
  const disc = Math.max(0, q * q - 4 * crawlSumFactor);
  const mainTicks = Math.max(2, Math.round((q + Math.sqrt(disc)) / 2));
  const lastMainSpeed = maxRadPerTick / mainTicks;
  const deltas: number[] = [];
  for (let i = 0; i < mainTicks; i += 1) {
    deltas.push(Math.max(maxRadPerTick * (1 - i / mainTicks), 1e-6));
  }
  for (let i = 0; i < crawlTicks; i += 1) {
    const t = i / crawlTicks;
    deltas.push(Math.max(lastMainSpeed * (1 - t) * (1 - t), 1e-6));
  }
  const err = totalRotation - deltas.reduce((sum, d) => sum + d, 0);
  const last = deltas.length - 1;
  if (Math.abs(err) > 1e-10 && last >= 0) deltas[last] = (deltas[last] ?? 0) + err;
  return deltas;
};

export const requestStyle2Stop = (
  session: Style2Session,
  options: {
    winnerIndex: number;
    landingAngle: number;
    delayUnit: number;
    extraUnit: number;
    strength: number;
  },
): boolean => {
  if (!style2IsWaitingStop(session)) return false;
  session.winnerIndex = options.winnerIndex;
  const delayMs =
    STYLE2_DELAY_MIN_MS +
    options.delayUnit * (STYLE2_DELAY_MAX_MS - STYLE2_DELAY_MIN_MS);
  const ticksPerSecond = 1000 / TICK_MS;
  session.delayTicksLeft = Math.max(
    1,
    Math.round((ticksPerSecond * delayMs) / 1000),
  );
  const pair =
    STRENGTH_EXTRA_ROUNDS[readStyle2StopStrength(options.strength)] ??
    STRENGTH_EXTRA_ROUNDS[0];
  const extraRounds =
    pair[0] + Math.floor(options.extraUnit * (pair[1] - pair[0] + 1));
  session.extraRadLeft = extraRounds * TWO_PI;
  session.phase = "delay";
  session.decelDeltas = [];
  session.decelTick = 0;
  session.landingAngle = options.landingAngle;
  return true;
};

export const stepStyle2Tick = (session: Style2Session): boolean => {
  if (session.phase === "accel") {
    session.accelIndex += 1;
    const t = session.accelIndex / session.accelTicks;
    const d = session.constantRad * Math.min(1, t * t);
    session.rotation += d;
    if (session.accelIndex >= session.accelTicks) session.phase = "constant";
    return false;
  }
  if (session.phase === "constant") {
    session.rotation += session.constantRad;
    return false;
  }
  if (session.phase === "delay") {
    session.rotation += session.constantRad;
    session.delayTicksLeft -= 1;
    if (session.delayTicksLeft <= 0) session.phase = "extraRounds";
    return false;
  }
  if (session.phase === "extraRounds") {
    session.rotation += session.constantRad;
    session.extraRadLeft -= session.constantRad;
    if (session.extraRadLeft <= 0) {
      const stopAngle = remainingOffsetToPointer(
        session.rotation,
        session.landingAngle,
      );
      session.decelDeltas = buildStyle2DecelDeltas(stopAngle);
      session.decelTick = 0;
      session.phase = "decel";
    }
    return false;
  }
  const d = session.decelDeltas[session.decelTick] ?? 0;
  session.rotation += d;
  session.decelTick += 1;
  return session.decelTick >= session.decelDeltas.length;
};
