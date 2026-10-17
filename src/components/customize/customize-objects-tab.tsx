import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  FieldCard,
  Section,
  STRIPPED_NATIVE_COLOR_INPUT_CLASS,
  SWATCH_REMOVE_BADGE_CLASS,
  moreButtonClass,
  moreIconClass,
  rimSwatchFrameClass,
} from "@/components/customize/customize-fields";
import { cn } from "@/lib/cn";
import { DEFAULT_RIM_DOT_COLOR } from "@/lib/constants";
import {
  MAX_RIM_DOT_COLORS,
  secondRimDotColorFor,
} from "@/lib/rim-dot-color";
import {
  MAX_RIM_BORDER_COLORS,
  THEME_COLOR_ADD_POOL,
} from "@/lib/theme-library";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import type { CustomizeState } from "@/lib/types";

type CustomizeObjectsTabProps = {
  customize: CustomizeState;
  setCustomize: (patch: Partial<CustomizeState>) => void;
};

export const CustomizeObjectsTab = ({
  customize,
  setCustomize,
}: CustomizeObjectsTabProps) => {
  const copy = useMessages().ui.customize;
  const canAddRimColor =
    customize.rimBorderColors.length < MAX_RIM_BORDER_COLORS;
  const rimDotColors = customize.rimDotColor;
  const firstRimDotColor = rimDotColors[0] ?? DEFAULT_RIM_DOT_COLOR;
  const secondRimDotColor = rimDotColors[1];

  const addRimBorderColor = () => {
    if (!canAddRimColor) {
      toast.error(fillTemplate(copy.keepRimColors, { max: MAX_RIM_BORDER_COLORS }));
      return;
    }
    const next =
      THEME_COLOR_ADD_POOL[
        customize.rimBorderColors.length % THEME_COLOR_ADD_POOL.length
      ] ?? "#3369e8";
    setCustomize({
      rimBorderColors: [...customize.rimBorderColors, next],
    });
  };

  const removeRimBorderColor = (index: number) => {
    if (customize.rimBorderColors.length <= 1) {
      toast.error(copy.keepOneRimColor);
      return;
    }
    setCustomize({
      rimBorderColors: customize.rimBorderColors.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <Section
        title={copy.rim}
        trailing={
          <Switch
            checked={customize.rimEnabled}
            aria-label={copy.toggleRim}
            title={copy.toggleRim}
            onCheckedChange={(checked) => setCustomize({ rimEnabled: checked })}
          />
        }
      >
        {customize.rimEnabled ? (
          <FieldCard>
            <div className="space-y-2">
              <span className="block text-sm font-medium">{copy.borderColor}</span>
              <div className="flex flex-wrap gap-4">
                {customize.rimBorderColors.map((color, index) => (
                  <div
                    key={`rim-border-${index}`}
                    className="relative inline-flex shrink-0"
                  >
                    <span className={rimSwatchFrameClass(color)}>
                      <input
                        aria-label={`Border color ${index + 1}`}
                        className={STRIPPED_NATIVE_COLOR_INPUT_CLASS}
                        title={`Pick rim border color ${index + 1}`}
                        type="color"
                        value={color}
                        onChange={(event) => {
                          const next = [...customize.rimBorderColors];
                          next[index] = event.target.value;
                          setCustomize({ rimBorderColors: next });
                        }}
                      />
                    </span>
                    {customize.rimBorderColors.length > 1 ? (
                      <button
                        type="button"
                        className={SWATCH_REMOVE_BADGE_CLASS}
                        aria-label={copy.removeRimBorder}
                        title={copy.removeRimBorder}
                        onClick={(event) => {
                          event.preventDefault();
                          removeRimBorderColor(index);
                        }}
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    ) : null}
                  </div>
                ))}
                {canAddRimColor ? (
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("size-12 rounded-xl p-0", moreButtonClass)}
                    aria-label={copy.addRimBorder}
                    title={copy.addRimBorder}
                    onClick={addRimBorderColor}
                  >
                    <Plus className={cn("size-6", moreIconClass)} aria-hidden />
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <span className="block text-sm font-medium">{copy.dotColor}</span>
              <div className="flex flex-wrap items-center gap-4">
                <span className={rimSwatchFrameClass(firstRimDotColor)}>
                  <input
                    aria-label={copy.pickRimDot}
                    className={STRIPPED_NATIVE_COLOR_INPUT_CLASS}
                    title={copy.pickRimDot}
                    type="color"
                    value={firstRimDotColor}
                    onChange={(event) =>
                      setCustomize({
                        rimDotColor: secondRimDotColor
                          ? [event.target.value, secondRimDotColor]
                          : [event.target.value],
                      })
                    }
                  />
                </span>
                {secondRimDotColor ? (
                  <div className="relative inline-flex shrink-0">
                    <span className={rimSwatchFrameClass(secondRimDotColor)}>
                      <input
                        aria-label={copy.pickSecondRimDot}
                        className={STRIPPED_NATIVE_COLOR_INPUT_CLASS}
                        title={copy.pickSecondRimDot}
                        type="color"
                        value={secondRimDotColor}
                        onChange={(event) =>
                          setCustomize({
                            rimDotColor: [firstRimDotColor, event.target.value],
                          })
                        }
                      />
                    </span>
                    <button
                      type="button"
                      className={SWATCH_REMOVE_BADGE_CLASS}
                      aria-label={copy.removeSecondRimDot}
                      title={copy.removeSecondRimDot}
                      onClick={(event) => {
                        event.preventDefault();
                        setCustomize({ rimDotColor: [firstRimDotColor] });
                      }}
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </div>
                ) : rimDotColors.length < MAX_RIM_DOT_COLORS ? (
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("size-12 rounded-xl p-0", moreButtonClass)}
                    aria-label={copy.addRimDot}
                    title={copy.addRimDot}
                    onClick={() =>
                      setCustomize({
                        rimDotColor: [
                          firstRimDotColor,
                          secondRimDotColorFor(firstRimDotColor),
                        ],
                      })
                    }
                  >
                    <Plus className={cn("size-6", moreIconClass)} aria-hidden />
                  </Button>
                ) : null}
              </div>
            </div>
          </FieldCard>
        ) : null}
      </Section>
      <Section title={copy.center}>
        <FieldCard>
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="block text-sm font-medium">{copy.hubFill}</span>
              <span className={rimSwatchFrameClass(customize.centerColor)}>
                <input
                  aria-label={copy.hubFillAria}
                  className={STRIPPED_NATIVE_COLOR_INPUT_CLASS}
                  title={copy.pickHubFill}
                  type="color"
                  value={customize.centerColor}
                  onChange={(event) =>
                    setCustomize({ centerColor: event.target.value })
                  }
                />
              </span>
            </div>
            <div className="space-y-2">
              <span className="block text-sm font-medium">{copy.hubOutline}</span>
              <span className={rimSwatchFrameClass(customize.centerHubOutline)}>
                <input
                  aria-label={copy.hubOutlineAria}
                  className={STRIPPED_NATIVE_COLOR_INPUT_CLASS}
                  title={copy.pickHubOutline}
                  type="color"
                  value={customize.centerHubOutline}
                  onChange={(event) =>
                    setCustomize({ centerHubOutline: event.target.value })
                  }
                />
              </span>
            </div>
          </div>
        </FieldCard>
      </Section>
    </div>
  );
};
