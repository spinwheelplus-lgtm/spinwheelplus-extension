export const ITEM_IMAGE_UPLOAD_MAX_WIDTH_PX = 350;
export const ITEM_IMAGE_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ITEM_IMAGE_WEBP_QUALITY = 0.82;

const ACCEPTED_MIME_PREFIX = "image/";

const formatMaxFileSizeMb = (): string =>
  `${Math.round(ITEM_IMAGE_MAX_FILE_BYTES / (1024 * 1024))} MB`;

const loadImageFromFile = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read the selected image."));
    };
    image.src = objectUrl;
  });

const scaleDimensionsToMaxWidth = (
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
): { width: number; height: number } => {
  if (naturalWidth <= 0 || naturalHeight <= 0) {
    throw new Error("The image has invalid dimensions.");
  }
  if (naturalWidth <= maxWidth) {
    return { width: naturalWidth, height: naturalHeight };
  }
  const scale = maxWidth / naturalWidth;
  return {
    width: maxWidth,
    height: Math.max(1, Math.round(naturalHeight * scale)),
  };
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

const encodeCanvasAsImageBlob = async (
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> => {
  const webpBlob = await canvasToBlob(canvas, "image/webp", quality);
  if (webpBlob) return webpBlob;
  const jpegBlob = await canvasToBlob(canvas, "image/jpeg", quality);
  if (!jpegBlob) {
    throw new Error("Your browser could not encode the image.");
  }
  return jpegBlob;
};

/** User file → resize (width ≤ 350px) → WebP (or JPEG fallback) Blob. */
export const processItemImageFile = async (file: File): Promise<Blob> => {
  if (!file.type.startsWith(ACCEPTED_MIME_PREFIX)) {
    throw new Error("Please choose an image file (JPEG, PNG, WebP, GIF).");
  }

  if (file.size > ITEM_IMAGE_MAX_FILE_BYTES) {
    throw new Error(
      `"${file.name}" exceeds the ${formatMaxFileSizeMb()} limit.`,
    );
  }

  const image = await loadImageFromFile(file);
  const { width, height } = scaleDimensionsToMaxWidth(
    image.naturalWidth,
    image.naturalHeight,
    ITEM_IMAGE_UPLOAD_MAX_WIDTH_PX,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }
  ctx.drawImage(image, 0, 0, width, height);
  return encodeCanvasAsImageBlob(canvas, ITEM_IMAGE_WEBP_QUALITY);
};
