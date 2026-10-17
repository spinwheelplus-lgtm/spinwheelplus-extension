import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { downloadRollDiceHistory } from "@/lib/dice-roller/export-roll-dice-history";
import type { RollDiceHistoryEntry } from "@/types/dice-roller";

type DiceHistoryActionsProps = {
  history: readonly RollDiceHistoryEntry[];
  onClear: () => void;
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
};

export const DiceHistoryActions = ({
  history,
  onClear,
  showClose = false,
  onClose,
  className,
}: DiceHistoryActionsProps) => {
  const common = useMessages().ui.common;
  return (
  <div
    className={cn(
      "flex flex-wrap items-center gap-2",
      showClose ? "justify-between" : "justify-end",
      className,
    )}
  >
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="sm:gap-1.5"
        disabled={history.length === 0}
        aria-label={common.downloadTxt}
        onClick={() => {
          downloadRollDiceHistory(history);
          toast.success(common.historyDownloadStarted);
        }}
      >
        <Download className="size-4" aria-hidden />
        <span className="hidden sm:inline">{common.downloadTxt}</span>
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={history.length === 0}
        onClick={onClear}
      >
        <Trash2 className="size-4" aria-hidden />
        {common.clear}
      </Button>
    </div>
    {showClose && onClose ? (
      <Button type="button" variant="outline" size="sm" onClick={onClose}>
        {common.done}
      </Button>
    ) : null}
  </div>
  );
};
