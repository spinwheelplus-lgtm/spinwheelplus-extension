import { useCallback, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  planCoinFlip,
  type FlipCoinSide,
  type FlipCoinWebGLRequest,
} from "@/lib/coin-flip/plan-coin-flip";

export type FlipCoinPhase = "idle" | "flipping" | "settled";

type FlipCoinRequestState = FlipCoinWebGLRequest & {
  results: ReadonlyMap<string, FlipCoinSide>;
};

export const useFlipCoin = (coinIds: readonly string[]) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const requestIdRef = useRef(0);
  const flipRequestRef = useRef<FlipCoinRequestState | null>(null);

  const [phase, setPhase] = useState<FlipCoinPhase>("idle");
  const [results, setResults] = useState<ReadonlyMap<string, FlipCoinSide>>(
    new Map(),
  );
  const [flipRequest, setFlipRequest] = useState<FlipCoinWebGLRequest | null>(
    null,
  );

  const flip = useCallback(() => {
    if (phase === "flipping" || coinIds.length === 0) return;

    const plans = coinIds.map((coinId) => ({
      coinId,
      plan: planCoinFlip(),
    }));
    const nextResults = new Map(
      plans.map(({ coinId, plan }) => [coinId, plan.result]),
    );
    const id = requestIdRef.current + 1;
    requestIdRef.current = id;
    const nextRequest: FlipCoinRequestState = {
      id,
      plans,
      reduceMotion: prefersReducedMotion,
      results: nextResults,
    };
    flipRequestRef.current = nextRequest;
    setPhase("flipping");
    setFlipRequest(nextRequest);
  }, [phase, coinIds, prefersReducedMotion]);

  const flipOne = useCallback(
    (coinId: string) => {
      if (phase === "flipping" || !coinIds.includes(coinId)) return;
      const plan = planCoinFlip();
      const settledResults = new Map<string, FlipCoinSide>([[coinId, plan.result]]);
      const id = requestIdRef.current + 1;
      requestIdRef.current = id;
      setResults(new Map());
      const nextRequest: FlipCoinRequestState = {
        id,
        plans: [{ coinId, plan }],
        reduceMotion: prefersReducedMotion,
        results: settledResults,
      };
      flipRequestRef.current = nextRequest;
      setPhase("flipping");
      setFlipRequest(nextRequest);
    },
    [coinIds, phase, prefersReducedMotion],
  );

  const handleFlipComplete = useCallback(
    (requestId: number): ReadonlyMap<string, FlipCoinSide> | null => {
      const request = flipRequestRef.current;
      if (request == null || request.id !== requestId) return null;
      setResults(request.results);
      setPhase("settled");
      return request.results;
    },
    [],
  );

  const resetFlipState = useCallback(() => {
    flipRequestRef.current = null;
    setPhase("idle");
    setResults(new Map());
    setFlipRequest(null);
  }, []);

  return {
    flip,
    flipOne,
    handleFlipComplete,
    resetFlipState,
    flipRequest,
    phase,
    results,
    isFlipping: phase === "flipping",
  };
};
