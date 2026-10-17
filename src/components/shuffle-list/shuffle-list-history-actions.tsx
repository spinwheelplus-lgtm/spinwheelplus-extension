import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { downloadShuffleListHistory } from "@/lib/shuffle-list/export-shuffle-list";
import type { ShuffleListHistoryEntry } from "@/types/shuffle-list";

type ShuffleListHistoryActionsProps = {
  history: readonly ShuffleListHistoryEntry[];
  onClear: () => void;
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
};

export const ShuffleListHistoryActions = ({
  history,
  onClear,
  showClose = false,
  onClose,
  className,
}: ShuffleListHistoryActionsProps) => {
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
        aria-label={common.downloadTxt}
        onClick={() => {
          downloadShuffleListHistory(history);
          toast.success(common.historyDownloadStarted);
        }}
      >
        <Download className="size-4" aria-hidden />
        <span className="hidden sm:inline">{common.downloadTxt}</span>
      </Button>
      <Button type="button" variant="destructive" size="sm" onClick={onClear}>
        <Trash2 className="size-4" aria-hidden />
        {common.clear}
      </Button>
    </div>
    {showClose && onClose ? (
      <Button type="button" variant="outline" size="sm" onClick={onClose}>
        {common.close}
      </Button>
    ) : null}
  </div>
  );
};
