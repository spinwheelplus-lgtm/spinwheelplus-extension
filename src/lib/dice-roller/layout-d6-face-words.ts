import { D6_FACE_WORD_MAX_LENGTH } from "@/lib/dice-roller/d6-face-words";

const TEXTURE_SIZE = 256;
const SAFE_INSET_RATIO = 0.1;
const LINE_HEIGHT_RATIO = 1.22;

const FONT_TIERS = [
    { fontSize: 30, maxLines: 1 },
    { fontSize: 22, maxLines: 2 },
    { fontSize: 16, maxLines: 3 },
] as const;

export type D6FaceWordLayout = {
    fontSize: number;
    lines: readonly string[];
};

const faceWordFont = (fontSize: number): string =>
    `700 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;

const wrapFaceWordLines = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number,
): string[] | null => {
    const words = text.split(" ").filter((word) => word.length > 0);
    if (words.length === 0) {
        return null;
    }

    const lines: string[] = [];
    let current = "";

    for (const word of words) {
        const next = current === "" ? word : `${current} ${word}`;
        if (ctx.measureText(next).width <= maxWidth) {
            current = next;
            continue;
        }

        if (current === "") {
            return null;
        }

        lines.push(current);
        current = word;
        if (lines.length >= maxLines) {
            return null;
        }
    }

    if (current !== "") {
        lines.push(current);
    }

    return lines.length > 0 && lines.length <= maxLines ? lines : null;
};

const clipFaceWordLines = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number,
): string[] => {
    const words = text.split(" ").filter((word) => word.length > 0);
    const lines: string[] = [];
    let current = "";

    const pushCurrent = () => {
        if (current !== "") {
            lines.push(current);
            current = "";
        }
    };

    for (const word of words) {
        if (lines.length >= maxLines) {
            break;
        }

        const next = current === "" ? word : `${current} ${word}`;
        if (ctx.measureText(next).width <= maxWidth) {
            current = next;
            continue;
        }

        pushCurrent();
        if (lines.length >= maxLines) {
            break;
        }

        if (ctx.measureText(word).width <= maxWidth) {
            current = word;
            continue;
        }

        let clipped = "";
        for (const char of word) {
            const trial = `${clipped}${char}`;
            if (ctx.measureText(trial).width > maxWidth) {
                break;
            }
            clipped = trial;
        }
        if (clipped !== "") {
            lines.push(clipped);
        }
        current = "";
        break;
    }

    pushCurrent();
    return lines.slice(0, maxLines);
};

/** Fit a face label into 1, 2, or 3 lines. The last size clips overflow. */
export const layoutD6FaceWords = (
    ctx: CanvasRenderingContext2D,
    text: string,
): D6FaceWordLayout => {
    const clipped = [...text].slice(0, D6_FACE_WORD_MAX_LENGTH).join("");
    const maxWidth = TEXTURE_SIZE * (1 - SAFE_INSET_RATIO * 2);
    const scale = TEXTURE_SIZE / 128;

    for (const [index, tier] of FONT_TIERS.entries()) {
        const fontSize = Math.round(tier.fontSize * scale);
        ctx.font = faceWordFont(fontSize);
        const isLast = index === FONT_TIERS.length - 1;
        const lines = isLast
            ? clipFaceWordLines(ctx, clipped, maxWidth, tier.maxLines)
            : wrapFaceWordLines(ctx, clipped, maxWidth, tier.maxLines);
        if (lines != null && lines.length > 0) {
            return { fontSize, lines };
        }
    }

    return { fontSize: Math.round(16 * scale), lines: [] };
};

export const D6_FACE_WORD_TEXTURE_SIZE = TEXTURE_SIZE;
export const D6_FACE_WORD_LINE_HEIGHT_RATIO = LINE_HEIGHT_RATIO;
export const d6FaceWordFont = faceWordFont;
