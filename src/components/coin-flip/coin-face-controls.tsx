import { Button } from "@/components/ui/button";
import { CoinSectionHeading } from "@/components/coin-flip/coin-section-heading";
import { cn } from "@/lib/cn";
import { localizeFlipCoinSideLabels } from "@/lib/coin-flip/localize-coin-face-labels";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  createLabeledFlipCoinFaceStyle,
  FLIP_COIN_FACE_COLORS,
  FLIP_COIN_FACE_PAIRS,
  flipCoinSideLabelsForStyle,
  type FlipCoinFacePairId,
  type FlipCoinFaceStyle,
} from "@/lib/coin-flip/flip-coin-face-style";

type CoinFaceControlsProps = {
  faceStyle: FlipCoinFaceStyle;
  disabled: boolean;
  onChange: (style: FlipCoinFaceStyle) => void;
};

export const CoinFaceControls = ({
  faceStyle,
  disabled,
  onChange,
}: CoinFaceControlsProps) => {
  const coinUi = useMessages().ui.coin;
  const pairLabel: Record<string, string> = {
    "yes-no": coinUi.yesNo,
    "win-lose": coinUi.winLose,
    "odd-even": coinUi.oddEven,
  };
  const labels =
    faceStyle.mode === "labeled"
      ? localizeFlipCoinSideLabels(flipCoinSideLabelsForStyle(faceStyle), coinUi)
      : null;

  const selectPair = (pairId: FlipCoinFacePairId) => {
    if (faceStyle.mode === "labeled" && faceStyle.pairId === pairId) {
      return;
    }
    onChange(createLabeledFlipCoinFaceStyle(pairId));
  };

  const selectColor = (side: "heads" | "tails", hex: string) => {
    if (faceStyle.mode !== "labeled") {
      return;
    }
    onChange({
      ...faceStyle,
      headsColor: side === "heads" ? hex : faceStyle.headsColor,
      tailsColor: side === "tails" ? hex : faceStyle.tailsColor,
    });
  };

  return (
    <div>
      <CoinSectionHeading
        title={coinUi.faces}
        helpLabel={coinUi.faces}
        helpTitle={coinUi.faces}
        helpText={coinUi.facesHelp}
      />
      <div
        className="mt-3 flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={coinUi.facesAria}
      >
        <Button
          type="button"
          size="sm"
          variant={faceStyle.mode === "classic" ? "default" : "outline"}
          disabled={disabled}
          aria-checked={faceStyle.mode === "classic"}
          role="radio"
          onClick={() => onChange({ mode: "classic" })}
        >
          {coinUi.classic}
        </Button>
        {FLIP_COIN_FACE_PAIRS.map((pair) => {
          const selected =
            faceStyle.mode === "labeled" && faceStyle.pairId === pair.id;
          return (
            <Button
              key={pair.id}
              type="button"
              size="sm"
              variant={selected ? "default" : "outline"}
              disabled={disabled}
              aria-checked={selected}
              role="radio"
              onClick={() => selectPair(pair.id)}
            >
              {pairLabel[pair.id] ?? pair.label}
            </Button>
          );
        })}
      </div>
      {faceStyle.mode === "labeled" && labels != null ? (
        <div className="mt-3 space-y-2">
          {(
            [
              ["heads", labels.heads, faceStyle.headsColor],
              ["tails", labels.tails, faceStyle.tailsColor],
            ] as const
          ).map(([side, word, selectedHex]) => (
            <div key={side} className="flex flex-wrap items-center gap-2">
              <span className="w-16 text-xs font-medium text-muted-foreground">
                {word}
              </span>
              <div
                className="flex flex-wrap gap-1.5"
                role="radiogroup"
                aria-label={`${word} color`}
              >
                {FLIP_COIN_FACE_COLORS.map((color) => {
                  const selected = selectedHex === color.hex;
                  return (
                    <button
                      key={`${side}-${color.id}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={`${word} ${color.id}`}
                      disabled={disabled}
                      className={cn(
                        "size-6 rounded-full border border-black/15 shadow-sm",
                        selected
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                          : "ring-1 ring-transparent",
                        disabled && "cursor-not-allowed opacity-45",
                      )}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => selectColor(side, color.hex)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            {fillTemplate(coinUi.onEvery, {
              name:
                faceStyle.mode === "labeled"
                  ? pairLabel[faceStyle.pairId] ?? ""
                  : "",
            })}
          </p>
        </div>
      ) : null}
    </div>
  );
};
