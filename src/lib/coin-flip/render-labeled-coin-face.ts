const FACE_SIZE = 512;
const RIM_SRC = "/flip-a-coin/coin-rim.webp";

let rimImagePromise: Promise<HTMLImageElement> | null = null;

const loadCoinRimImage = (): Promise<HTMLImageElement> => {
    if (rimImagePromise == null) {
        rimImagePromise = new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => {
                rimImagePromise = null;
                reject(new Error("Could not load coin rim"));
            };
            image.src = RIM_SRC;
        });
    }
    return rimImagePromise;
};

const labelFontFamily = (label: string): string =>
    /[^\u0000-\u007F]/u.test(label)
        ? '"Segoe UI", Arial, "Noto Sans", sans-serif'
        : '"Arial Black", Impact, sans-serif';

const fitLabelFontSize = (
    context: CanvasRenderingContext2D,
    label: string,
    family: string,
): number => {
    const maxWidth = FACE_SIZE * 0.62;
    let fontSize = Math.floor(FACE_SIZE * 0.28);
    while (fontSize > 28) {
        context.font = `800 ${fontSize}px ${family}`;
        if (context.measureText(label).width <= maxWidth) {
            return fontSize;
        }
        fontSize -= 4;
    }
    return fontSize;
};

/** Face fill, fixed gold rim, fixed gold letters. Browser only. */
export const renderLabeledCoinFace = async (
    color: string,
    label: string,
): Promise<HTMLCanvasElement> => {
    const rim = await loadCoinRimImage();
    const canvas = document.createElement("canvas");
    canvas.width = FACE_SIZE;
    canvas.height = FACE_SIZE;
    const context = canvas.getContext("2d");
    if (context == null) {
        throw new Error("Could not draw coin face");
    }

    context.clearRect(0, 0, FACE_SIZE, FACE_SIZE);
    context.fillStyle = color;
    context.beginPath();
    context.arc(FACE_SIZE / 2, FACE_SIZE / 2, FACE_SIZE / 2, 0, Math.PI * 2);
    context.fill();
    context.drawImage(rim, 0, 0, FACE_SIZE, FACE_SIZE);

    const text = label.toUpperCase();
    const family = labelFontFamily(text);
    const fontSize = fitLabelFontSize(context, text, family);
    context.font = `800 ${fontSize}px ${family}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = "rgba(90, 48, 0, 0.55)";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = Math.max(2, Math.round(fontSize * 0.06));

    const gradient = context.createLinearGradient(
        0,
        FACE_SIZE * 0.34,
        0,
        FACE_SIZE * 0.7,
    );
    gradient.addColorStop(0, "#fff1a8");
    gradient.addColorStop(0.45, "#f0c14b");
    gradient.addColorStop(1, "#b8860b");
    context.fillStyle = gradient;
    context.fillText(text, FACE_SIZE / 2, FACE_SIZE / 2 + fontSize * 0.02);

    return canvas;
};
