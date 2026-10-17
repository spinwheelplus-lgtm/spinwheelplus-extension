import type { D6FaceStyle } from "@/lib/dice-roller/d6-cube-geometry";
import { getD6PipPositions } from "@/lib/dice-roller/d6-cube-geometry";
import { readD6FaceWord } from "@/lib/dice-roller/d6-face-words";
import {
    D6_FACE_WORD_LINE_HEIGHT_RATIO,
    D6_FACE_WORD_TEXTURE_SIZE,
    d6FaceWordFont,
    layoutD6FaceWords,
} from "@/lib/dice-roller/layout-d6-face-words";
import { hexToHsl } from "@/lib/dice-roller/roll-a-dice-appearance";
import type { RollDiceAppearance } from "@/types/dice-roller";

const TEXTURE_SIZE = 128;
const WORD_SAFE_INSET_RATIO = 0.1;

export type DieFaceContent = "number" | "pip" | "words";

const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value));

// Bake mild per-face shading into the texture so MeshBasicMaterial shows the
// picker color faithfully (no Lambert darkening on top).
const drawFaceBackground = (
    ctx: CanvasRenderingContext2D,
    bodyColor: string,
    lightFactor: number,
    size: number,
): void => {
    const { h, s, l } = hexToHsl(bodyColor);
    const saturation = clamp(s, 35, 100);
    const base = clamp(l + (lightFactor - 0.5) * 14, 8, 92);
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, `hsl(${h} ${saturation}% ${clamp(base + 6, 6, 96)}%)`);
    gradient.addColorStop(0.52, `hsl(${h} ${saturation}% ${base}%)`);
    gradient.addColorStop(1, `hsl(${h} ${saturation}% ${clamp(base - 6, 4, 94)}%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
};

const drawWordLabel = (
    ctx: CanvasRenderingContext2D,
    word: string,
    markColor: string,
    centerX: number,
    centerY: number,
): void => {
    const layout = layoutD6FaceWords(ctx, word);
    if (layout.lines.length === 0) {
        return;
    }

    const inset = D6_FACE_WORD_TEXTURE_SIZE * WORD_SAFE_INSET_RATIO;
    const box = D6_FACE_WORD_TEXTURE_SIZE - inset * 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(inset, inset, box, box);
    ctx.clip();
    ctx.fillStyle = markColor;
    ctx.font = d6FaceWordFont(layout.fontSize);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 0;

    const lineHeight = layout.fontSize * D6_FACE_WORD_LINE_HEIGHT_RATIO;
    const blockHeight = layout.lines.length * lineHeight;
    let y = centerY - blockHeight / 2 + lineHeight / 2;
    for (const line of layout.lines) {
        ctx.fillText(line, centerX, y);
        y += lineHeight;
    }
    ctx.restore();
};

const drawPips = (
    ctx: CanvasRenderingContext2D,
    value: number,
    markColor: string,
): void => {
    const radius = TEXTURE_SIZE * 0.08;
    for (const pip of getD6PipPositions(value)) {
        const left = Number.parseFloat(pip.left) / 100;
        const top = Number.parseFloat(pip.top) / 100;
        ctx.beginPath();
        ctx.arc(left * TEXTURE_SIZE, top * TEXTURE_SIZE, radius, 0, Math.PI * 2);
        ctx.fillStyle = markColor;
        ctx.fill();
    }
};

/** Digit anchor as canvas fractions (x right, y down); default = center. */
export type FaceUvCenter = { u: number; v: number };

/** Canvas texture source for one die face (number, D6 pips, or D6 words). */
export const createDieFaceCanvas = (
    value: number,
    bodyColor: string,
    markColor: string,
    faceContent: DieFaceContent,
    uvCenter?: FaceUvCenter,
    lightFactor = 0.5,
    word = "",
): HTMLCanvasElement => {
    const textureSize =
        faceContent === "words" ? D6_FACE_WORD_TEXTURE_SIZE : TEXTURE_SIZE;
    const canvas = document.createElement("canvas");
    canvas.width = textureSize;
    canvas.height = textureSize;
    const ctx = canvas.getContext("2d");
    if (ctx == null) {
        return canvas;
    }

    drawFaceBackground(ctx, bodyColor, lightFactor, textureSize);

    if (faceContent === "pip") {
        drawPips(ctx, value, markColor);
        return canvas;
    }

    const centerX = (uvCenter?.u ?? 0.5) * textureSize;
    const centerY = (uvCenter?.v ?? 0.5) * textureSize;

    if (faceContent === "words") {
        drawWordLabel(ctx, word, markColor, centerX, centerY);
        return canvas;
    }

    const fontSize = value >= 10 ? TEXTURE_SIZE * 0.3 : TEXTURE_SIZE * 0.38;
    ctx.fillStyle = markColor;
    ctx.font = `700 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 0;
    const label = String(value);
    ctx.fillText(label, centerX, centerY);
    if (value === 6 || value === 9) {
        const metrics = ctx.measureText(label);
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(centerX - metrics.width / 2, centerY + fontSize * 0.35);
        ctx.lineTo(centerX + metrics.width / 2, centerY + fontSize * 0.35);
        ctx.strokeStyle = markColor;
        ctx.lineWidth = Math.max(2, fontSize * 0.08);
        ctx.stroke();
    }

    return canvas;
};

export const getDieFaceContent = (
    sides: number,
    d6FaceStyle: D6FaceStyle,
): DieFaceContent =>
    sides === 6 && d6FaceStyle === "pip" ? "pip" : "number";

/** Words mode with a blank face falls back to the face number. */
export const resolveDieFaceContent = (
    sides: number,
    appearance: RollDiceAppearance,
    faceValue: number,
): { content: DieFaceContent; word: string } => {
    if (sides === 6 && appearance.d6FaceStyle === "words") {
        const word = readD6FaceWord(appearance.d6FaceWords, faceValue);
        if (word !== "") {
            return { content: "words", word };
        }
    }

    return {
        content: getDieFaceContent(sides, appearance.d6FaceStyle),
        word: "",
    };
};
