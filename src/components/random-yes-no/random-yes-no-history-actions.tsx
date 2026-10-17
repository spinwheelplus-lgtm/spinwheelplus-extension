import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { downloadRandomYesNoHistory } from "@/lib/random-yes-no/export-random-yes-no-history";
import type { RandomYesNoHistoryEntry } from "@/types/random-yes-no";

type RandomYesNoHistoryActionsProps = {
  history: readonly RandomYesNoHistoryEntry[];
  onClear: () => void;
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
};

export const RandomYesNoHistoryActions = ({
  history,
  onClear,
  showClose = false,
  onClose,
  className,
}: RandomYesNoHistoryActionsProps) => {
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
        disabled={history.length === 0}
        aria-label={common.downloadTxt}
        onClick={() => {
          downloadRandomYesNoHistory(history);
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
        {common.close}
      </Button>
    ) : null}
  </div>
  );
};
