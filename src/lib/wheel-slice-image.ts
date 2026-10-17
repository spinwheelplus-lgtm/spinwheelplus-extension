import type { SliceImageFit } from "@/lib/types";

export type SlicePhotoRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type SlicePhotoDraw = {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

const wedgeRadialLabelFits = (
  halfSweep: number,
  outerRadius: number,
  innerRadius: number,
  textWidth: number,
  fontHeight: number,
): boolean => {
  if (!(outerRadius > 0) || textWidth < 0 || fontHeight < 0) return false;
  if (textWidth === 0 && fontHeight === 0) return true;
  const halfH = fontHeight / 2;
  if (halfH >= outerRadius) return false;
  const outerAlong = Math.sqrt(outerRadius * outerRadius - halfH * halfH);
  const sinHalf = Math.sin(halfSweep);
  if (!(sinHalf > 0)) return false;
  const radiusWhereHeightFits =
    (fontHeight * Math.cos(halfSweep)) / (2 * sinHalf);
  const innerAlong = Math.max(radiusWhereHeightFits, innerRadius);
  return outerAlong - innerAlong >= textWidth;
};

const wheelLabelFitHeight = (inkHeight: number): number => inkHeight / 0.88;

export const sliceFillCoverRect = (
  radius: number,
  sweep: number,
): SlicePhotoRect | null => {
  if (!(radius > 0) || !(sweep > 0)) return null;
  const half = Math.min(sweep / 2, Math.PI);
  if (half >= Math.PI) {
    return { x: -radius, y: -radius, w: radius * 2, h: radius * 2 };
  }
  const sinH = Math.sin(half);
  const cosH = Math.cos(half);
  if (half > Math.PI / 2) {
    const x = radius * cosH;
    return { x, y: -radius, w: radius - x, h: radius * 2 };
  }
  const y = radius * sinH;
  return { x: 0, y: -y, w: radius, h: y * 2 };
};

export const coverImageInRect = (
  imageWidth: number,
  imageHeight: number,
  rect: SlicePhotoRect,
): SlicePhotoDraw | null => {
  if (!(rect.w > 0 && rect.h > 0)) return null;
  if (!(imageWidth > 0 && imageHeight > 0)) return null;
  const scale = Math.max(rect.w / imageWidth, rect.h / imageHeight);
  const dw = imageWidth * scale;
  const dh = imageHeight * scale;
  return {
    dx: rect.x + (rect.w - dw) / 2,
    dy: rect.y + (rect.h - dh) / 2,
    dw,
    dh,
  };
};

export const slicePhotoBoxDraw = (
  imageWidth: number,
  imageHeight: number,
  sweep: number,
  innerRadius: number,
  outerRadius: number,
  radialPad = 0,
): SlicePhotoDraw | null => {
  if (!(imageWidth > 0 && imageHeight > 0)) return null;
  if (!(outerRadius > innerRadius) || !(sweep > 0)) return null;
  const halfSweep = Math.min(sweep / 2, Math.PI / 2 - 0.02);
  if (!(halfSweep > 0)) return null;

  const fitsScale = (scale: number): boolean => {
    if (!(scale > 0)) return false;
    const drawW = imageWidth * scale;
    const drawH = imageHeight * scale;
    return wedgeRadialLabelFits(
      halfSweep,
      outerRadius,
      innerRadius,
      drawW + Math.max(0, radialPad),
      wheelLabelFitHeight(drawH),
    );
  };

  const scaleHi = Math.min(
    outerRadius / imageWidth,
    (2 * outerRadius) / imageHeight,
  );
  if (!(scaleHi > 0)) return null;
  const scaleLo = scaleHi * 1e-4;
  if (!fitsScale(scaleLo)) return null;

  let lo = scaleLo;
  let hi = scaleHi;
  if (fitsScale(hi)) {
    lo = hi;
  } else {
    for (let k = 0; k < 24; k += 1) {
      const mid = (lo + hi) / 2;
      if (fitsScale(mid)) lo = mid;
      else hi = mid;
    }
  }

  const dw = imageWidth * lo;
  const dh = imageHeight * lo;
  const halfH = dh / 2;
  if (!(halfH < outerRadius)) return null;
  const outerAlong = Math.sqrt(outerRadius * outerRadius - halfH * halfH);
  return {
    dx: outerAlong - dw,
    dy: -halfH,
    dw,
    dh,
  };
};

export const drawSlicePhoto = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  radius: number,
  sweep: number,
  imageFit: SliceImageFit,
  innerRadius: number,
  outerRadius: number,
  radialPad: number,
): boolean => {
  const nw = image.naturalWidth;
  const nh = image.naturalHeight;
  if (imageFit === "fill") {
    const rect = sliceFillCoverRect(radius, sweep);
    if (!rect) return false;
    const draw = coverImageInRect(nw, nh, rect);
    if (!draw) return false;
    ctx.drawImage(image, draw.dx, draw.dy, draw.dw, draw.dh);
    return true;
  }
  const draw = slicePhotoBoxDraw(
    nw,
    nh,
    sweep,
    innerRadius,
    outerRadius,
    radialPad,
  );
  if (!draw) return false;
  ctx.drawImage(image, draw.dx, draw.dy, draw.dw, draw.dh);
  return true;
};
