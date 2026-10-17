import { useEffect, useState, type CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { randomUnit } from "@/lib/random";
import {
  WINNER_EFFECT_CONFETTI,
  WINNER_EFFECT_FIREWORKS,
  isActiveWinnerEffect,
  resolveWinnerEffect,
  type WinnerEffectId,
} from "@/lib/winner-effect";
import { useWheelStore } from "@/store/wheel-store";

const EFFECT_COLORS = [
  "#3369e8",
  "#d50f25",
  "#eeb211",
  "#009925",
  "#f97316",
  "#ffffff",
];

const CONFETTI_COUNT = 84;
const CONFETTI_MS = 1700;
const FIREWORK_BURSTS = 5;
const FIREWORK_SPARKS = 24;
const FIREWORKS_MS = 1400;

type ConfettiBit = {
  kind: "confetti";
  color: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
};

type FireworkSpark = {
  kind: "firework";
  color: string;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
  dx: number;
  dy: number;
};

type EffectBit = ConfettiBit | FireworkSpark;

const pickColor = (index: number): string =>
  EFFECT_COLORS[index % EFFECT_COLORS.length] ?? "#3369e8";

const buildConfettiBits = (): ConfettiBit[] =>
  Array.from({ length: CONFETTI_COUNT }, (_, index) => ({
    kind: "confetti" as const,
    color: pickColor(index),
    left: 2 + randomUnit() * 96,
    delay: randomUnit() * 280,
    duration: 1050 + randomUnit() * 550,
    size: 5 + randomUnit() * 8,
    drift: (randomUnit() < 0.5 ? -1 : 1) * (10 + randomUnit() * 28),
  }));

const buildFireworkSparks = (): FireworkSpark[] => {
  const sparks: FireworkSpark[] = [];
  for (let burst = 0; burst < FIREWORK_BURSTS; burst += 1) {
    const originX = 22 + randomUnit() * 56;
    const originY = 14 + randomUnit() * 32;
    const burstDelay = burst * 180;
    for (let i = 0; i < FIREWORK_SPARKS; i += 1) {
      const angle = (Math.PI * 2 * i) / FIREWORK_SPARKS + randomUnit() * 0.4;
      const dist = 28 + randomUnit() * 42;
      sparks.push({
        kind: "firework",
        color: pickColor(burst * FIREWORK_SPARKS + i),
        left: originX,
        top: originY,
        delay: burstDelay + randomUnit() * 40,
        duration: 620 + randomUnit() * 280,
        size: 3 + randomUnit() * 4,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
      });
    }
  }
  return sparks;
};

const buildBits = (effect: WinnerEffectId): EffectBit[] => {
  if (effect === WINNER_EFFECT_CONFETTI) return buildConfettiBits();
  if (effect === WINNER_EFFECT_FIREWORKS) return buildFireworkSparks();
  return [];
};

export const WinnerEffectOverlay = () => {
  const seq = useWheelStore((s) => s.winnerEffectSeq);
  const [bits, setBits] = useState<EffectBit[]>([]);

  useEffect(() => {
    if (seq < 1) {
      setBits([]);
      return;
    }
    const effect = resolveWinnerEffect(
      useWheelStore.getState().customize.winnerEffect,
    );
    if (!isActiveWinnerEffect(effect)) {
      setBits([]);
      return;
    }
    setBits(buildBits(effect));
    const ms = effect === WINNER_EFFECT_FIREWORKS ? FIREWORKS_MS : CONFETTI_MS;
    const timer = window.setTimeout(() => setBits([]), ms);
    return () => window.clearTimeout(timer);
  }, [seq]);

  if (bits.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      aria-hidden
    >
      {bits.map((bit, index) =>
        bit.kind === "confetti" ? (
          <span
            key={`c-${seq}-${index}`}
            className="confetti-bit absolute top-0 rounded-sm"
            style={
              {
                backgroundColor: bit.color,
                left: `${bit.left}%`,
                width: bit.size,
                height: bit.size * 0.65,
                animationDelay: `${bit.delay}ms`,
                animationDuration: `${bit.duration}ms`,
                "--confetti-drift": `${bit.drift}px`,
              } as CSSProperties
            }
          />
        ) : (
          <span
            key={`f-${seq}-${index}`}
            className={cn("firework-spark absolute rounded-full")}
            style={
              {
                backgroundColor: bit.color,
                left: `${bit.left}%`,
                top: `${bit.top}%`,
                width: bit.size,
                height: bit.size,
                animationDelay: `${bit.delay}ms`,
                animationDuration: `${bit.duration}ms`,
                "--spark-dx": `${bit.dx}px`,
                "--spark-dy": `${bit.dy}px`,
              } as CSSProperties
            }
          />
        ),
      )}
    </div>
  );
};
