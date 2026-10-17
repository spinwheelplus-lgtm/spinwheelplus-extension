import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import { renderLabeledCoinFace } from "@/lib/coin-flip/render-labeled-coin-face";

const THUMB_CLASS = {
  add: "size-12 rounded-full shadow-sm",
  slot: "size-14 rounded-full shadow-md ring-2 ring-foreground/10",
} as const;

type CoinLabeledThumbProps = {
  color: string;
  label: string;
  variant: "add" | "slot";
  className?: string;
};

export const CoinLabeledThumb = ({
  color,
  label,
  variant,
  className,
}: CoinLabeledThumbProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (canvas == null) {
      return undefined;
    }

    void renderLabeledCoinFace(color, label).then((source) => {
      if (cancelled) {
        return;
      }
      const size = variant === "add" ? 96 : 112;
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      context?.drawImage(source, 0, 0, size, size);
    });

    return () => {
      cancelled = true;
    };
  }, [color, label, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(THUMB_CLASS[variant], className)}
      aria-hidden
    />
  );
};
