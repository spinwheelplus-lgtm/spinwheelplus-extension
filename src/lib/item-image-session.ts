import { ITEM_IMAGE_MAX_COUNT } from "@/lib/constants";
import {
  idbClearItemImages,
  idbDeleteItemImages,
  idbGetItemImages,
  idbListItemImageIds,
  idbPutItemImage,
} from "@/lib/item-image-idb";
import { createItemId } from "@/lib/random";
import type { WheelItem } from "@/lib/types";

let imageEpoch = 0;
const objectUrls = new Map<string, string>();

export const createItemImageId = (): string => `img-${createItemId()}`;

const revokeObjectUrl = (imageId: string): void => {
  const url = objectUrls.get(imageId);
  if (!url) return;
  URL.revokeObjectURL(url);
  objectUrls.delete(imageId);
};

const rememberBlob = (imageId: string, blob: Blob): string => {
  revokeObjectUrl(imageId);
  const url = URL.createObjectURL(blob);
  objectUrls.set(imageId, url);
  return url;
};

export const revokeAllItemImageObjectUrls = (): void => {
  for (const imageId of [...objectUrls.keys()]) {
    revokeObjectUrl(imageId);
  }
};

export const itemImageEpoch = (): number => imageEpoch;

/** Call first on New so in-flight puts are discarded. */
export const beginItemImageGeneration = (): number => {
  imageEpoch += 1;
  revokeAllItemImageObjectUrls();
  return imageEpoch;
};

const liveImageIdSet = (
  items: readonly Pick<WheelItem, "imageId">[],
): Set<string> => {
  const live = new Set<string>();
  for (const item of items) {
    const id = item.imageId?.trim();
    if (id) live.add(id);
  }
  return live;
};

export const attachCachedItemImageUrls = (
  items: readonly WheelItem[],
): WheelItem[] =>
  items.map((item) => {
    const imageId = item.imageId?.trim();
    if (!imageId) {
      return { ...item, imageId: undefined, imageDataUrl: undefined };
    }
    return {
      ...item,
      imageId,
      imageDataUrl: objectUrls.get(imageId),
    };
  });

export const hydrateItemImageUrls = async (
  items: readonly WheelItem[],
): Promise<WheelItem[]> => {
  const epoch = imageEpoch;
  const ids = [...liveImageIdSet(items)];
  const missing = ids.filter((id) => !objectUrls.has(id));
  if (missing.length > 0) {
    try {
      const blobs = await idbGetItemImages(missing);
      if (epoch !== imageEpoch) return attachCachedItemImageUrls(items);
      for (const [id, blob] of blobs) {
        rememberBlob(id, blob);
      }
    } catch {
      // Keep labels; thumbs stay empty until a later hydrate.
    }
  }
  return attachCachedItemImageUrls(items);
};

export const putItemImageBlob = async (blob: Blob): Promise<string> => {
  const epoch = imageEpoch;
  const imageId = createItemImageId();
  await idbPutItemImage(imageId, blob);
  if (epoch !== imageEpoch) {
    try {
      await idbDeleteItemImages([imageId]);
    } catch {
      // New already cleared or is clearing the store.
    }
    throw new Error("Image was discarded because a new wheel started.");
  }
  rememberBlob(imageId, blob);
  return imageId;
};

export const pruneUnusedItemImages = async (
  items: readonly Pick<WheelItem, "imageId">[],
): Promise<void> => {
  const live = liveImageIdSet(items);
  let stored: string[] = [];
  try {
    stored = await idbListItemImageIds();
  } catch {
    return;
  }
  const unused = stored.filter((id) => !live.has(id));
  if (unused.length === 0) return;
  unused.forEach(revokeObjectUrl);
  try {
    await idbDeleteItemImages(unused);
  } catch {
    // Next prune or New retries.
  }
};

export const clearAllItemImages = async (): Promise<void> => {
  revokeAllItemImageObjectUrls();
  try {
    await idbClearItemImages();
  } catch {
    // Next New retries.
  }
};

export const countItemsWithImage = (
  items: readonly Pick<WheelItem, "imageId">[],
): number => items.filter((item) => Boolean(item.imageId?.trim())).length;

export const remainingItemImageSlots = (
  items: readonly Pick<WheelItem, "imageId">[],
): number => Math.max(0, ITEM_IMAGE_MAX_COUNT - countItemsWithImage(items));
