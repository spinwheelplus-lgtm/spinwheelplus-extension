import { Button } from "@/components/ui/button";
import { useMessages } from "@/lib/i18n/use-messages";
import { cn } from "@/lib/cn";

type ResultPopupFooterProps = {
  showCloseButton: boolean;
  showRemoveButton: boolean;
  removeButtonEnabled: boolean;
  onClose: () => void;
  onRemove: () => void;
  className?: string;
  tone?: "default" | "on-dark";
};

export const ResultPopupFooter = ({
  showCloseButton,
  showRemoveButton,
  removeButtonEnabled,
  onClose,
  onRemove,
  className,
  tone = "default",
}: ResultPopupFooterProps) => {
  const messages = useMessages();
  if (!showCloseButton && !showRemoveButton) return null;
  const onDark = tone === "on-dark";

  return (
    <div
      className={cn(
        "shrink-0 space-y-2 border-t px-4 py-3",
        onDark ? "border-white/15 bg-black/25" : "border-border bg-muted/40",
        className,
      )}
    >
      <div className="flex flex-row items-center justify-end gap-2">
        {showCloseButton ? (
          <Button
            type="button"
            variant="outline"
            className={cn(
              "shrink-0",
              onDark &&
                "border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white",
            )}
            onClick={onClose}
          >
            {messages.ui.common.close}
          </Button>
        ) : null}
        {showRemoveButton ? (
          <Button
            type="button"
            className="shrink-0"
            disabled={!removeButtonEnabled}
            title={messages.ui.common.winner}
            onClick={onRemove}
          >
            {messages.ui.entries.remove}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
