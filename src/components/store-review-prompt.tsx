import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { openStoreReview, storeReviewIsDue } from "@/lib/store-review";
import { useLocaleStore } from "@/store/locale-store";
import { useStoreReviewStore } from "@/store/store-review-store";
import { useWheelStore } from "@/store/wheel-store";

export const StoreReviewPrompt = () => {
  const ready = useStoreReviewStore((s) => s.ready);
  const spinCount = useStoreReviewStore((s) => s.spinCount);
  const status = useStoreReviewStore((s) => s.status);
  const laterUntil = useStoreReviewStore((s) => s.laterUntil);
  const markRated = useStoreReviewStore((s) => s.markRated);
  const snooze = useStoreReviewStore((s) => s.snooze);
  const spinning = useWheelStore((s) => s.spinning);
  const winnerId = useWheelStore((s) => s.winnerId);
  const winnerPopup = useWheelStore((s) => s.customize.winnerPopup);
  const messages = useLocaleStore((s) => s.messages);

  const resultOpen = Boolean(winnerId) && winnerPopup;
  const due =
    ready &&
    !spinning &&
    !resultOpen &&
    storeReviewIsDue({ spinCount, status, laterUntil });

  if (!due) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-3">
      <div
        className="pointer-events-auto flex w-full max-w-md flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-lg"
        role="region"
        aria-label={messages.rateRegion}
      >
        <p className="text-sm text-foreground">{messages.enjoying}</p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              markRated();
              openStoreReview();
            }}
          >
            <Star className="fill-amber-300 text-amber-300" />
            {messages.rate}
          </Button>
          <Button size="sm" variant="outline" onClick={snooze}>
            {messages.notNow}
          </Button>
        </div>
      </div>
    </div>
  );
};
