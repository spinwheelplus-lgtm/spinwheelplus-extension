import { useEffect } from "react";

import { shouldSkipImmersiveEscape } from "@/lib/keyboard";
import { useImmersiveStore } from "@/store/immersive-store";

/** Escape exits in-panel Zoom when it is not serving another UI task. */
export const useImmersiveEscape = (): void => {
  const immersive = useImmersiveStore((state) => state.immersive);
  const setImmersive = useImmersiveStore((state) => state.setImmersive);

  useEffect(() => {
    if (!immersive) return undefined;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      if (event.repeat) return;
      if (shouldSkipImmersiveEscape(event)) return;
      event.preventDefault();
      setImmersive(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [immersive, setImmersive]);
};
