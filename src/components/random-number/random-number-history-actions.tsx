import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { downloadRandomNumberHistory } from "@/lib/random-number/export-random-number-history";
import type { RandomNumberHistoryEntry } from "@/types/random-number";

type RandomNumberHistoryActionsProps = {
  history: readonly RandomNumberHistoryEntry[];
  onClear: () => void;
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
};

export const RandomNumberHistoryActions = ({
  history,
  onClear,
  showClose = false,
  onClose,
  className,
}: RandomNumberHistoryActionsProps) => {
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
          downloadRandomNumberHistory(history);
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
