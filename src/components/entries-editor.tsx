import { useState } from "react";
import { toast } from "sonner";

import { EntriesAdvancedList } from "@/components/entries-advanced-list";
import { EntriesTextEditor } from "@/components/entries-text-editor";
import {
  EntriesToolbar,
  type EntriesSortDirection,
} from "@/components/entries-toolbar";
import { ITEM_IMAGE_MAX_COUNT, MAX_WHEEL_ITEMS } from "@/lib/constants";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { appendItemsFromImageFiles } from "@/lib/item-image-append";
import { remainingItemImageSlots } from "@/lib/item-image-session";
import { useWheelStore } from "@/store/wheel-store";

export const EntriesEditor = () => {
  const items = useWheelStore((s) => s.items);
  const setItems = useWheelStore((s) => s.setItems);
  const spinning = useWheelStore((s) => s.spinning);
  const viewMode = useWheelStore((s) => s.entriesViewMode);
  const setEntriesViewMode = useWheelStore((s) => s.setEntriesViewMode);
  const [sortDirection, setSortDirection] = useState<EntriesSortDirection>("asc");
  const [isAddingImages, setIsAddingImages] = useState(false);
  const entries = useMessages().ui.entries;

  const onShuffle = () => {
    const next = [...items];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const bytes = new Uint32Array(1);
      crypto.getRandomValues(bytes);
      const j = bytes[0] % (i + 1);
      const current = next[i];
      const swapped = next[j];
      if (!current || !swapped) continue;
      next[i] = swapped;
      next[j] = current;
    }
    setItems(next);
    toast.success(entries.shuffled);
  };

  const onSort = () => {
    const factor = sortDirection === "asc" ? 1 : -1;
    const next = [...items].sort(
      (a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }) * factor,
    );
    setItems(next);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const onClear = () => {
    if (items.length === 0) return;
    setItems([]);
    toast.success(entries.cleared);
  };

  const onAddImages = async (files: File[]): Promise<void> => {
    if (files.length === 0 || spinning) return;

    const slotsLeft = remainingItemImageSlots(items);
    if (slotsLeft <= 0) {
      toast.warning(fillTemplate(entries.imagesFull, { max: ITEM_IMAGE_MAX_COUNT }));
      return;
    }

    if (items.length >= MAX_WHEEL_ITEMS) {
      toast.error(fillTemplate(entries.keepEntries, { max: MAX_WHEEL_ITEMS }));
      return;
    }

    setIsAddingImages(true);
    try {
      const result = await appendItemsFromImageFiles(items, files);
      if (result.skippedCount > 0 && result.addedCount > 0) {
        toast.warning(
          fillTemplate(entries.imagesPartial, {
            added: result.addedCount,
            skipped: result.skippedCount,
            max: ITEM_IMAGE_MAX_COUNT,
          }),
        );
      }

      if (result.addedCount === 0) {
        toast.error(entries.noImages);
        if (result.failedFiles[0]?.message) {
          toast.error(result.failedFiles[0].message);
        }
        return;
      }

      setItems(result.items);

      if (result.failedFiles.length > 0) {
        toast.error(fillTemplate(entries.filesFailed, { count: result.failedFiles.length }));
      } else if (result.skippedCount === 0) {
        toast.success(fillTemplate(entries.imagesAdded, { added: result.addedCount }));
      }
    } finally {
      setIsAddingImages(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <EntriesToolbar
        viewMode={viewMode}
        sortDirection={sortDirection}
        itemCount={items.length}
        disabled={spinning}
        isAddingImages={isAddingImages}
        onViewModeChange={setEntriesViewMode}
        onAddImages={onAddImages}
        onShuffle={onShuffle}
        onSort={onSort}
        onClear={onClear}
      />
      {viewMode === "advanced" ? <EntriesAdvancedList /> : <EntriesTextEditor />}
    </div>
  );
};
