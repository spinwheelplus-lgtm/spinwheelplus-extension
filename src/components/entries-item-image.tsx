import { ImageIcon, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import type { WheelItem } from "@/lib/types";

type EntriesItemImageControlProps = {
  item: WheelItem;
  isUploading: boolean;
  disabled?: boolean;
  onPickClick: () => void;
  onRemove: () => void;
};

export const EntriesItemImageControl = ({
  item,
  isUploading,
  disabled = false,
  onPickClick,
  onRemove,
}: EntriesItemImageControlProps) => {
  const entries = useMessages().ui.entries;
  const hasImage = Boolean(item.imageId || item.imageDataUrl);

  return (
    <div className="relative size-10 shrink-0 overflow-visible">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "size-10 overflow-hidden rounded-xl p-0",
          !hasImage && "border-dashed",
        )}
        disabled={disabled || isUploading}
        aria-label={hasImage ? entries.replaceItemImage : entries.addItemImage}
        title={hasImage ? entries.replaceItemImage : entries.addItemImage}
        onClick={onPickClick}
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : hasImage && item.imageDataUrl ? (
          <img
            src={item.imageDataUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <ImageIcon className="size-4" aria-hidden />
        )}
      </Button>
      {hasImage && !isUploading ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          aria-label={entries.removeItemImage}
          title={entries.removeItemImage}
          className="absolute -top-2 -right-2 z-10 rounded-full border border-background bg-destructive p-0 text-white shadow-sm hover:bg-destructive/90 hover:text-white"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }}
        >
          <X strokeWidth={2.5} />
        </Button>
      ) : null}
    </div>
  );
};
