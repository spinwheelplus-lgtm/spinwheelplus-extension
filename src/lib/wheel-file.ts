import { ITEM_IMAGE_MAX_COUNT, MAX_WHEEL_ITEMS } from "@/lib/constants";
import { idbGetItemImages } from "@/lib/item-image-idb";
import type { CustomizeState, WheelItem } from "@/lib/types";

export const WHEEL_FILE_FORMAT = "spinwheelplus.wheel";
export const WHEEL_FILE_VERSION = 1;
export const WHEEL_FILE_NAME = "spinwheelplus-wheel.json";

const LABEL_MAX = 500;
const IMAGE_BASE64_MAX = 400_000;

export type WheelFileItem = {
  label: string;
  weight: number;
  bgColor?: string;
  inactive?: boolean;
  imageBlob?: Blob;
};

export type ParsedWheelFile = {
  customize: unknown;
  items: WheelFileItem[];
};

type WheelFileExportItem = {
  label: string;
  weight: number;
  bgColor?: string;
  inactive?: true;
  image?: string;
};

const bytesToBase64 = (bytes: Uint8Array): string => {
  const chunk = 0x8000;
  let binary = "";
  for (let index = 0; index < bytes.length; index += chunk) {
    const slice = bytes.subarray(index, index + chunk);
    let part = "";
    for (const byte of slice) part += String.fromCharCode(byte);
    binary += part;
  }
  return btoa(binary);
};

const base64ToBlob = (value: string): Blob | null => {
  const trimmed = value.trim();
  const payload = trimmed.includes(",")
    ? (trimmed.split(",").pop() ?? "")
    : trimmed;
  if (!payload || payload.length > IMAGE_BASE64_MAX) return null;
  try {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new Blob([bytes], { type: "image/webp" });
  } catch {
    return null;
  }
};

const readWeight = (value: unknown): number => {
  const weight = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(weight) || weight <= 0) return 1;
  return Math.min(1_000_000, weight);
};

const readItem = (value: unknown, imagesLeft: { count: number }): WheelFileItem | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as {
    label?: unknown;
    weight?: unknown;
    bgColor?: unknown;
    inactive?: unknown;
    image?: unknown;
  };
  const label =
    typeof row.label === "string" ? row.label.trim().slice(0, LABEL_MAX) : "";
  const bgColor =
    typeof row.bgColor === "string" && row.bgColor.trim()
      ? row.bgColor.trim()
      : undefined;
  let imageBlob: Blob | undefined;
  if (typeof row.image === "string" && imagesLeft.count > 0) {
    const blob = base64ToBlob(row.image);
    if (blob) {
      imageBlob = blob;
      imagesLeft.count -= 1;
    }
  }
  return {
    label,
    weight: readWeight(row.weight),
    bgColor,
    inactive: row.inactive === true ? true : undefined,
    imageBlob,
  };
};

export const parseWheelFileText = (
  text: string,
): { ok: true; file: ParsedWheelFile } | { ok: false } => {
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return { ok: false };
  }
  if (!raw || typeof raw !== "object") return { ok: false };
  const body = raw as {
    format?: unknown;
    version?: unknown;
    customize?: unknown;
    items?: unknown;
  };
  if (body.format !== WHEEL_FILE_FORMAT || body.version !== WHEEL_FILE_VERSION) {
    return { ok: false };
  }
  if (!Array.isArray(body.items)) return { ok: false };
  const imagesLeft = { count: ITEM_IMAGE_MAX_COUNT };
  const items = body.items
    .slice(0, MAX_WHEEL_ITEMS)
    .map((row) => readItem(row, imagesLeft))
    .filter((row): row is WheelFileItem => row !== null);
  return { ok: true, file: { customize: body.customize, items } };
};

export const buildWheelFileText = async (
  customize: CustomizeState,
  items: readonly WheelItem[],
): Promise<string> => {
  const slice = items.slice(0, MAX_WHEEL_ITEMS);
  const ids = slice
    .map((item) => item.imageId?.trim() ?? "")
    .filter((id) => id.length > 0);
  const blobs = await idbGetItemImages(ids);
  let imagesUsed = 0;
  const exported: WheelFileExportItem[] = [];
  for (const item of slice) {
    const row: WheelFileExportItem = {
      label: item.label,
      weight: item.weight > 0 ? item.weight : 1,
    };
    if (item.bgColor) row.bgColor = item.bgColor;
    if (item.inactive) row.inactive = true;
    const imageId = item.imageId?.trim();
    const blob = imageId ? blobs.get(imageId) : undefined;
    if (blob && imagesUsed < ITEM_IMAGE_MAX_COUNT) {
      const bytes = new Uint8Array(await blob.arrayBuffer());
      row.image = bytesToBase64(bytes);
      imagesUsed += 1;
    }
    exported.push(row);
  }

  return JSON.stringify({
    format: WHEEL_FILE_FORMAT,
    version: WHEEL_FILE_VERSION,
    customize,
    items: exported,
  });
};

export const downloadWheelFile = async (
  customize: CustomizeState,
  items: readonly WheelItem[],
): Promise<void> => {
  const text = await buildWheelFileText(customize, items);
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = WHEEL_FILE_NAME;
  anchor.click();
  URL.revokeObjectURL(url);
};
