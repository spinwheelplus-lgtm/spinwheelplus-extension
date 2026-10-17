import type { D6FaceStyle } from "@/lib/dice-roller/d6-cube-geometry";
import { EMPTY_D6_FACE_WORDS } from "@/lib/dice-roller/d6-face-words";
import type { DiceSides, RollDiceAppearance } from "@/types/dice-roller";

/** Default body fill per die type (matches add-dice icon palette). */
export const DEFAULT_DICE_BODY_COLORS: Record<DiceSides, string> = {
    4: "#28A745",
    6: "#39C3E6",
    8: "#8B3FF8",
    10: "#E93A97",
    12: "#E53935",
    20: "#FF7A00",
};

export const DEFAULT_DICE_MARK_COLOR = "#ffffff";

export const createDefaultDiceAppearance = (
    sides: DiceSides,
): RollDiceAppearance => ({
    bodyColor: DEFAULT_DICE_BODY_COLORS[sides],
    markColor: DEFAULT_DICE_MARK_COLOR,
    d6FaceStyle: "number",
    d6FaceWords: EMPTY_D6_FACE_WORDS,
});

export const D6_FACE_STYLE_OPTIONS: readonly {
    value: D6FaceStyle;
    label: string;
}[] = [
    { value: "number", label: "Numbers" },
    { value: "pip", label: "Dots" },
    { value: "words", label: "Words" },
];

const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value));

/** Parses `#rgb` or `#rrggbb` into HSL components for shaded face gradients. */
export const hexToHsl = (
    hex: string,
): { h: number; s: number; l: number } => {
    const normalized = hex.trim().replace(/^#/, "");
    const expanded =
        normalized.length === 3
            ? normalized
                  .split("")
                  .map((char) => char + char)
                  .join("")
            : normalized;

    const int = Number.parseInt(expanded, 16);
    const r = ((int >> 16) & 255) / 255;
    const g = ((int >> 8) & 255) / 255;
    const b = (int & 255) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const l = (max + min) / 2;

    if (delta === 0) {
        return { h: 0, s: 0, l: l * 100 };
    }

    const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    let h = 0;

    if (max === r) {
        h = (g - b) / delta + (g < b ? 6 : 0);
    } else if (max === g) {
        h = (b - r) / delta + 2;
    } else {
        h = (r - g) / delta + 4;
    }

    return {
        h: (h / 6) * 360,
        s: s * 100,
        l: l * 100,
    };
};

/** Face gradient from a custom body color and lighting factor (0-1). */
export const buildColoredFaceGradient = (
    lightFactor: number,
    bodyColor: string,
): string => {
    const { h, s, l } = hexToHsl(bodyColor);
    const saturation = clamp(s, 35, 100);
    const baseLightness = clamp(l * 0.72 + lightFactor * 22, 22, 78);
    const stop = (delta: number): string =>
        `hsl(${h.toFixed(1)} ${saturation.toFixed(1)}% ${clamp(baseLightness + delta, 12, 88).toFixed(1)}%)`;

    return `linear-gradient(160deg, ${stop(9)} 0%, ${stop(0)} 52%, ${stop(-7)} 100%)`;
};
