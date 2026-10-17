import { isD6FaceStyle } from "@/lib/dice-roller/d6-cube-geometry";
import type { RollDiceAppearance, RollDiceSlot } from "@/types/dice-roller";

export const D6_FACE_WORD_COUNT = 6;
export const D6_FACE_WORD_MAX_LENGTH = 36;

export const EMPTY_D6_FACE_WORDS: readonly string[] = ["", "", "", "", "", ""];

/** Faces 1, 3, and 5 say Yes. Faces 2, 4, and 6 say No. */
export const D6_YES_NO_FACE_WORDS: readonly string[] = [
    "Yes",
    "No",
    "Yes",
    "No",
    "Yes",
    "No",
];

export const D6_NUMBER_FACE_WORDS: readonly string[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
];

const HIDDEN_CHAR_PATTERN =
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\uFEFF\u2060\u00AD]/g;

const isHexColor = (value: unknown): value is string =>
    typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value != null && !Array.isArray(value);

const clipWordLength = (value: string): string =>
    [...value].slice(0, D6_FACE_WORD_MAX_LENGTH).join("");

/** Strip hidden characters and fancy punctuation from a face label. */
const cleanFaceWordText = (value: string): string =>
    value
        .replace(HIDDEN_CHAR_PATTERN, "")
        .replace(/\u00A0/g, " ")
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\u2026/g, "...");

/** Keep one trailing space while typing, then cap the label length. */
export const normalizeD6FaceWordInput = (value: string): string => {
    const keepTrailingSpace = /[ \t\u00A0]$/u.test(value);
    const cleaned = cleanFaceWordText(value)
        .replace(/[\r\n\t]+/g, " ")
        .replace(/ {2,}/g, " ");
    const withSpace =
        keepTrailingSpace && cleaned !== "" && !cleaned.endsWith(" ")
            ? `${cleaned} `
            : cleaned;
    return clipWordLength(withSpace);
};

/** Label painted on a face. Blank means the face shows its number. */
export const displayD6FaceWord = (value: string): string => value.trim();

/** Word for a face value (1-6). Blank or out of range stays numeric. */
export const readD6FaceWord = (
    words: readonly string[],
    faceValue: number,
): string => {
    if (faceValue < 1 || faceValue > D6_FACE_WORD_COUNT) {
        return "";
    }
    return displayD6FaceWord(words[faceValue - 1] ?? "");
};

export const d6FaceWordsEqual = (
    left: readonly string[],
    right: readonly string[],
): boolean =>
    left.length === right.length &&
    left.every((word, index) => word === right[index]);

/**
 * Missing words become six blanks so older saves still load.
 * A bad list rejects the whole appearance.
 */
export const parseStoredD6FaceWords = (value: unknown): readonly string[] | null => {
    if (value == null) {
        return EMPTY_D6_FACE_WORDS;
    }

    if (!Array.isArray(value) || value.length !== D6_FACE_WORD_COUNT) {
        return null;
    }

    const words: string[] = [];
    for (const entry of value) {
        if (typeof entry !== "string") {
            return null;
        }
        words.push(clipWordLength(cleanFaceWordText(entry).replace(/[\r\n\t]+/g, " ")));
    }

    return words;
};

export const parseRollDiceAppearance = (
    value: unknown,
): RollDiceAppearance | null => {
    if (!isRecord(value)) {
        return null;
    }

    const { bodyColor, markColor, d6FaceStyle, d6FaceWords } = value;
    if (
        !isHexColor(bodyColor) ||
        !isHexColor(markColor) ||
        !isD6FaceStyle(d6FaceStyle)
    ) {
        return null;
    }

    const words = parseStoredD6FaceWords(d6FaceWords);
    if (words == null) {
        return null;
    }

    return {
        bodyColor,
        markColor,
        d6FaceStyle,
        d6FaceWords: words,
    };
};

/** Word painted for this result, or "" when the face stays numeric. */
export const resolveRollDiceSlotWord = (slot: RollDiceSlot): string => {
    if (slot.sides !== 6 || slot.appearance.d6FaceStyle !== "words") {
        return "";
    }

    const result = slot.result;
    if (result == null || result < 1 || result > D6_FACE_WORD_COUNT) {
        return "";
    }

    return displayD6FaceWord(slot.appearance.d6FaceWords[result - 1] ?? "");
};
