import { useCallback } from "react";
import { toast } from "sonner";

import { RandomYesNoOptionsPanel } from "@/components/random-yes-no/random-yes-no-options-panel";
import { RandomYesNoResultCard } from "@/components/random-yes-no/random-yes-no-result-card";
import { useRandomToolActionShortcut } from "@/hooks/use-random-tool-action-shortcut";
import { useRandomYesNoAsk } from "@/hooks/use-random-yes-no-ask";
import { cn } from "@/lib/cn";
import { useImmersiveStore } from "@/store/immersive-store";
import { useRandomYesNoStore } from "@/store/random-yes-no-store";

export const RandomYesNoTool = () => {
  const storeReady = useRandomYesNoStore((state) => state.ready);
  const immersive = useImmersiveStore((state) => state.immersive);
  const optionsDocked = useRandomYesNoStore(
    (state) => state.random_yes_no_options_docked,
  );
  const toggleOptionsDocked = useRandomYesNoStore(
    (state) => state.toggleRandomYesNoOptionsDocked,
  );
  const { ask, isAnimating, display } = useRandomYesNoAsk();

  const handleAsk = useCallback(() => {
    const errorMessage = ask();
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [ask]);

  useRandomToolActionShortcut(handleAsk, {
    disabled: isAnimating || !storeReady,
  });

  return (
    <div
      className={cn(
        "grid gap-4",
        immersive
          ? "min-h-full flex-1 grid-cols-1 grid-rows-1"
          : cn(
              "min-h-[max(100%,32rem)]",
              optionsDocked &&
                "lg:grid-cols-[minmax(240px,350px)_minmax(0,1fr)] lg:items-stretch",
            ),
      )}
    >
      {immersive ? null : (
        <div
          className={cn(
            "order-2 min-w-0",
            optionsDocked && "lg:order-1 lg:h-full",
          )}
        >
          <RandomYesNoOptionsPanel disabled={isAnimating} />
        </div>
      )}
      <div
        className={cn(
          "order-1 flex min-w-0 flex-col",
          immersive ? "h-full min-h-full" : "h-full min-h-[32rem]",
          optionsDocked && !immersive && "lg:order-2",
        )}
      >
        <RandomYesNoResultCard
          display={display}
          isAnimating={isAnimating}
          optionsDocked={optionsDocked}
          onToggleOptionsDock={toggleOptionsDocked}
          onAsk={handleAsk}
        />
      </div>
    </div>
  );
};
