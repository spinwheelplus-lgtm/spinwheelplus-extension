import {
  ArrowDownAZ,
  ArrowUpZA,
  FileText,
  Grid3X3,
  ImagePlus,
  Loader2,
  Shuffle,
  Trash2,
} from "lucide-react";
import { useRef, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import type { EntriesViewMode } from "@/lib/types";

export type EntriesSortDirection = "asc" | "desc";

type EntriesToolbarProps = {
  viewMode: EntriesViewMode;
  sortDirection: EntriesSortDirection;
  itemCount: number;
  disabled?: boolean;
  isAddingImages?: boolean;
  onViewModeChange: (mode: EntriesViewMode) => void;
  onAddImages: (files: File[]) => void | Promise<void>;
  onShuffle: () => void;
  onSort: () => void;
  onClear: () => void;
};

export const EntriesToolbar = ({
  viewMode,
  sortDirection,
  itemCount,
  disabled = false,
  isAddingImages = false,
  onViewModeChange,
  onAddImages,
  onShuffle,
  onSort,
  onClear,
}: EntriesToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const entries = useMessages().ui.entries;
  const canReorder = itemCount > 1;
  const sortLabel = sortDirection === "asc" ? entries.sortAz : entries.sortZa;
  const SortIcon = sortDirection === "asc" ? ArrowDownAZ : ArrowUpZA;
  const textActive = viewMode === "text";
  const advancedActive = viewMode === "advanced";
  const addBusy = disabled || isAddingImages;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.currentTarget.files;
    if (!files || files.length === 0) return;
    void onAddImages(Array.from(files));
    event.currentTarget.value = "";
  };

  return (
    <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
      <input
        ref={fileInputRef}
        id="entries-toolbar-add-images"
        name="entries-toolbar-add-images"
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-label={entries.addImages}
        onChange={handleFileChange}
      />
      <div className="inline-flex w-fit rounded-xl border border-border bg-muted/40 p-1">
        <Button
          variant="outline"
          size="icon"
          disabled={disabled}
          aria-pressed={textActive}
          aria-label={entries.textView}
          title={entries.textView}
          className={cn(
            textActive
              ? "border-primary bg-background text-primary shadow-sm hover:bg-background hover:text-primary dark:text-sky-400 dark:hover:text-sky-400"
              : "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted",
          )}
          onClick={() => onViewModeChange("text")}
        >
          <FileText />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={disabled}
          aria-pressed={advancedActive}
          aria-label={entries.advancedView}
          title={entries.advancedView}
          className={cn(
            advancedActive
              ? "border-primary bg-background text-primary shadow-sm hover:bg-background hover:text-primary dark:text-sky-400 dark:hover:text-sky-400"
              : "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted",
          )}
          onClick={() => onViewModeChange("advanced")}
        >
          <Grid3X3 />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={addBusy}
          onClick={() => {
            if (addBusy) return;
            fileInputRef.current?.click();
          }}
          aria-label={entries.addImage}
          title={entries.addImage}
        >
          {isAddingImages ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : (
            <ImagePlus aria-hidden />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={disabled || !canReorder}
          onClick={onShuffle}
          aria-label={entries.shuffleEntries}
          title={entries.shuffleEntries}
        >
          <Shuffle />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={disabled || !canReorder}
          onClick={onSort}
          aria-label={sortLabel}
          title={sortLabel}
        >
          <SortIcon />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          disabled={disabled || itemCount === 0}
          onClick={onClear}
          aria-label={entries.clearEntries}
          title={entries.clearEntries}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};
