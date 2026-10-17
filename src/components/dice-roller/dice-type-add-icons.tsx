import { SquarePen } from "lucide-react";
import type { CSSProperties } from "react";

import { DEFAULT_DICE_BODY_COLORS } from "@/lib/dice-roller/roll-a-dice-appearance";
import { cn } from "@/lib/cn";
import type { DiceSides } from "@/types/dice-roller";

export const DICE_TYPE_ICON_SIZE_CLASS = "size-12";

type DiceTypeIconProps = {
    sides: DiceSides;
    className?: string;
    /** `add` - side count; `slot` - edit pen on table dice */
    variant?: "add" | "slot";
    bodyColor?: string;
    markColor?: string;
};

type DieIconSpec = {
    kind: "triangle" | "rect" | "hex" | "decagon" | "dodecagon";
    label: string;
    labelX: number;
    labelY: number;
};

/** Shared label size in SVG user units (viewBox 0-100) for add-row side counts. */
const ADD_DICE_LABEL_FONT_SIZE = 32;

/** Shared inset so every silhouette reads at the same visual weight. */
const INSET = 8;
const CENTER = 50;

const DICE_ICON_SPECS: Record<DiceSides, DieIconSpec> = {
    4: {
        kind: "triangle",
        label: "4",
        labelX: CENTER,
        labelY: 66,
    },
    6: {
        kind: "rect",
        label: "6",
        labelX: CENTER,
        labelY: CENTER,
    },
    8: {
        kind: "hex",
        label: "8",
        labelX: CENTER,
        labelY: CENTER,
    },
    10: {
        kind: "decagon",
        label: "10",
        labelX: CENTER,
        labelY: CENTER,
    },
    12: {
        kind: "dodecagon",
        label: "12",
        labelX: CENTER,
        labelY: CENTER,
    },
    20: {
        kind: "hex",
        label: "20",
        labelX: CENTER,
        labelY: CENTER,
    },
};

const renderDieShape = (kind: DieIconSpec["kind"], fill: string) => {
    switch (kind) {
        case "triangle":
            return (
                <polygon
                    points={`${CENTER},${INSET} ${100 - INSET},${100 - INSET} ${INSET},${100 - INSET}`}
                    fill={fill}
                />
            );
        case "rect":
            return (
                <rect
                    x={INSET}
                    y={INSET}
                    width={100 - INSET * 2}
                    height={100 - INSET * 2}
                    rx={3}
                    fill={fill}
                />
            );
        case "decagon":
            return (
                <polygon
                    points={`28,${INSET} 72,${INSET} ${100 - INSET},${CENTER} 72,${100 - INSET} 28,${100 - INSET} ${INSET},${CENTER}`}
                    fill={fill}
                />
            );
        case "dodecagon":
            return (
                <polygon
                    points={`32,${INSET} 68,${INSET} ${100 - INSET},32 ${100 - INSET},68 68,${100 - INSET} 32,${100 - INSET} ${INSET},68 ${INSET},32`}
                    fill={fill}
                />
            );
        case "hex":
        default:
            return (
                <polygon
                    points={`${CENTER},${INSET} ${100 - INSET},28  ${100 - INSET},72  ${CENTER},${100 - INSET} ${INSET},72  ${INSET},28`}
                    fill={fill}
                />
            );
    }
};

const getOverlayStyle = (spec: DieIconSpec): CSSProperties => ({
    left: `${spec.labelX}%`,
    top: `${spec.labelY}%`,
    transform: "translate(-50%, -50%)",
});

/** Colored die silhouette - number for add row, pen for table slots. */
export const DiceTypeIcon = ({
    sides,
    className,
    variant = "add",
    bodyColor,
    markColor = "#ffffff",
}: DiceTypeIconProps) => {
    const spec = DICE_ICON_SPECS[sides];
    const fill = bodyColor ?? DEFAULT_DICE_BODY_COLORS[sides];

    return (
        <div className={cn("relative inline-block shrink-0", className)}>
            <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
                {renderDieShape(spec.kind, fill)}
                {variant === "add" ? (
                    <text
                        x={spec.labelX}
                        y={spec.labelY}
                        fill={markColor}
                        fontSize={ADD_DICE_LABEL_FONT_SIZE}
                        fontWeight={700}
                        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
                        textAnchor="middle"
                        dominantBaseline="central"
                    >
                        {spec.label}
                    </text>
                ) : null}
            </svg>
            {variant === "slot" ? (
                <div
                    className="pointer-events-none absolute"
                    style={{
                        ...getOverlayStyle(spec),
                        color: markColor,
                    }}
                >
                    <SquarePen
                        className="size-4"
                        strokeWidth={2.25}
                        aria-hidden
                    />
                </div>
            ) : null}
        </div>
    );
};
