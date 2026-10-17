import { Maximize2, Minimize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useImmersiveStore } from "@/store/immersive-store";
import { useLocaleStore } from "@/store/locale-store";

export const HeaderZoomButton = () => {
  const immersive = useImmersiveStore((s) => s.immersive);
  const toggleImmersive = useImmersiveStore((s) => s.toggleImmersive);
  const messages = useLocaleStore((s) => s.messages);
  const zoomLabel = immersive ? messages.exitZoom : messages.zoom;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "size-9 rounded-full border-border bg-card p-0 text-foreground shadow-md",
        "hover:bg-muted",
        immersive && "bg-muted",
      )}
      aria-label={zoomLabel}
      title={zoomLabel}
      aria-pressed={immersive}
      onClick={() => toggleImmersive()}
    >
      {immersive ? (
        <Minimize2 className="size-4" strokeWidth={2.25} aria-hidden />
      ) : (
        <Maximize2 className="size-4" strokeWidth={2.25} aria-hidden />
      )}
    </Button>
  );
};
