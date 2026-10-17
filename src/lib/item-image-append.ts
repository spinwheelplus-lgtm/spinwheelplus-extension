import { MAX_WHEEL_ITEMS } from "@/lib/constants";
import { processItemImageFile } from "@/lib/item-image-file";
import {
  attachCachedItemImageUrls,
  putItemImageBlob,
  remainingItemImageSlots,
} from "@/lib/item-image-session";
import { createItemId } from "@/lib/random";
import type { WheelItem } from "@/lib/types";

export type ItemImageBatchResult = {
  items: WheelItem[];
  addedCount: number;
  skippedCount: number;
  failedFiles: { name: string; message: string }[];
};

const fileErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Could not process this image.";

export const appendItemsFromImageFiles = async (
  existingItems: readonly WheelItem[],
  files: readonly File[],
): Promise<ItemImageBatchResult> => {
  const itemSlots = Math.max(0, MAX_WHEEL_ITEMS - existingItems.length);
  const imageSlots = remainingItemImageSlots(existingItems);
  const maxNew = Math.min(files.length, itemSlots, imageSlots);
  const skippedCount = files.length - maxNew;
  const batch = files.slice(0, maxNew);
  const failedFiles: ItemImageBatchResult["failedFiles"] = [];
  const added: WheelItem[] = [];

  for (const file of batch) {
    try {
      const blob = await processItemImageFile(file);
      const imageId = await putItemImageBlob(blob);
      added.push({
        id: createItemId(),
        label: "",
        weight: 1,
        imageId,
      });
    } catch (error) {
      failedFiles.push({
        name: file.name,
        message: fileErrorMessage(error),
      });
    }
  }

  return {
    items: attachCachedItemImageUrls([...existingItems, ...added]),
    addedCount: added.length,
    skippedCount,
    failedFiles,
  };
};

export const assignItemImageFromFile = async (
  items: readonly WheelItem[],
  itemId: string,
  file: File,
): Promise<WheelItem[]> => {
  const blob = await processItemImageFile(file);
  const imageId = await putItemImageBlob(blob);
  return attachCachedItemImageUrls(
    items.map((item) =>
      item.id === itemId
        ? { ...item, imageId, imageDataUrl: undefined }
        : item,
    ),
  );
};
