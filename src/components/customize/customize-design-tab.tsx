import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CustomizeObjectsTab } from "@/components/customize/customize-objects-tab";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  FieldCard,
  FieldLabelHelp,
  FieldRow,
  NativeSelect,
  Section,
  STRIPPED_NATIVE_COLOR_INPUT_CLASS,
  SWATCH_REMOVE_BADGE_CLASS,
  moreButtonClass,
  moreIconClass,
  rimSwatchFrameClass,
  themePreviewBackground,
} from "@/components/customize/customize-fields";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  FEATURED_THEME_LIBRARY,
  MAX_THEME_COLORS,
  THEME_COLOR_ADD_POOL,
  THEME_LIBRARY,
} from "@/lib/theme-library";
import type { CustomizeState, SliceImageFit } from "@/lib/types";
import {
  WHEEL_SLICE_REPEAT_MAX_ITEMS,
  canApplySliceRepeat,
} from "@/lib/visual-items";

const SLICE_REPEAT_OPTIONS = [
  { label: "x1", value: "1" },
  { label: "x2", value: "2" },
  { label: "x3", value: "3" },
  { label: "x4", value: "4" },
  { label: "x5", value: "5" },
];

const TOGGLE_PAIR_GRID_CLASS =
  "grid grid-cols-1 gap-x-4 gap-y-3 min-[520px]:grid-cols-2";

type CustomizeDesignTabProps = {
  customize: CustomizeState;
  itemCount: number;
  setCustomize: (patch: Partial<CustomizeState>) => void;
};

export const CustomizeDesignTab = ({
  customize,
  itemCount,
  setCustomize,
}: CustomizeDesignTabProps) => {
  const copy = useMessages().ui.customize;
  const [showAllThemeLibrary, setShowAllThemeLibrary] = useState(false);
  const sliceRepeatAllowed = canApplySliceRepeat(itemCount);
  const sliceRepeatEnabled =
    sliceRepeatAllowed && !customize.removeDuplicateNames;
  const visibleThemeLibrary = showAllThemeLibrary
    ? THEME_LIBRARY
    : FEATURED_THEME_LIBRARY;
  const canAddThemeColor = customize.themeColors.length < MAX_THEME_COLORS;

  const addThemeColor = () => {
    if (!canAddThemeColor) {
      toast.error(fillTemplate(copy.keepThemeColors, { max: MAX_THEME_COLORS }));
      return;
    }
    const next =
      THEME_COLOR_ADD_POOL[
        customize.themeColors.length % THEME_COLOR_ADD_POOL.length
      ] ?? "#3369e8";
    setCustomize({ themeColors: [...customize.themeColors, next] });
  };

  const removeThemeColor = (index: number) => {
    if (customize.themeColors.length <= 2) {
      toast.error(copy.keepTwoThemeColors);
      return;
    }
    setCustomize({
      themeColors: customize.themeColors.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <Section title={copy.items}>
        <FieldCard className="space-y-3">
          <div className={TOGGLE_PAIR_GRID_CLASS}>
            <FieldRow className="min-w-0 justify-between gap-2">
              <FieldLabelHelp
                className="min-w-0"
                helpLabel={copy.removeDuplicate}
                helpTitle={copy.removeDuplicate}
                helpText={copy.removeDuplicateHelp}
              >
                {copy.removeDuplicateLabel}
              </FieldLabelHelp>
              <Switch
                checked={customize.removeDuplicateNames}
                aria-label={copy.removeDuplicate}
                onCheckedChange={(checked) =>
                  setCustomize({ removeDuplicateNames: checked })
                }
              />
            </FieldRow>
            <FieldRow className="min-w-0 justify-between gap-2">
              <FieldLabelHelp
                className="min-w-0"
                helpLabel={copy.hideItemNames}
                helpTitle={copy.hideItemNames}
                helpText={copy.hideItemNamesHelp}
              >
                {copy.hideItemNamesLabel}
              </FieldLabelHelp>
              <Switch
                checked={customize.hideItemNames}
                aria-label={copy.hideItemNames}
                onCheckedChange={(checked) =>
                  setCustomize({ hideItemNames: checked })
                }
              />
            </FieldRow>
          </div>
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.repeatSlices}
              helpTitle={copy.repeatSlices}
              helpText={copy.repeatSlicesHelp}
            >
              {copy.repeatSlicesLabel}
            </FieldLabelHelp>
            <NativeSelect
              ariaLabel={copy.repeatSlices}
              value={String(customize.sliceRepeat)}
              options={SLICE_REPEAT_OPTIONS}
              disabled={!sliceRepeatEnabled}
              onValueChange={(value) =>
                setCustomize({ sliceRepeat: Number(value) })
              }
            />
          </FieldRow>
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.imageFit}
              helpTitle={copy.imageFit}
              helpText={
                <>
                  <b>{copy.photoBox}</b>: {copy.photoBoxHelp}
                  <br />
                  <b>{copy.fillSlice}</b>: {copy.fillSliceHelp}
                </>
              }
            >
              {copy.imageFitLabel}
            </FieldLabelHelp>
            <NativeSelect
              ariaLabel={copy.imageFit}
              value={customize.imageFit}
              options={[
                { label: copy.photoBox, value: "box" },
                { label: copy.fillSlice, value: "fill" },
              ]}
              onValueChange={(value) =>
                setCustomize({ imageFit: value as SliceImageFit })
              }
            />
          </FieldRow>
          {customize.removeDuplicateNames ? (
            <p className="text-sm text-muted-foreground">
              {copy.repeatBlocked}
            </p>
          ) : sliceRepeatAllowed ? null : (
            <p className="text-sm text-muted-foreground">
              {fillTemplate(copy.repeatTooMany, { max: WHEEL_SLICE_REPEAT_MAX_ITEMS })}
            </p>
          )}
        </FieldCard>
      </Section>

      <Section title={copy.settings}>
        <FieldCard>
          <div className={TOGGLE_PAIR_GRID_CLASS}>
            <FieldRow className="min-w-0 justify-between gap-2">
              <FieldLabelHelp
                className="min-w-0"
                helpLabel={copy.shadow}
                helpTitle={copy.shadow}
                helpText={copy.shadowHelp}
              >
                {copy.shadowLabel}
              </FieldLabelHelp>
              <Switch
                checked={customize.wheelShadow}
                aria-label={copy.shadow}
                onCheckedChange={(checked) =>
                  setCustomize({ wheelShadow: checked })
                }
              />
            </FieldRow>
            <FieldRow className="min-w-0 justify-between gap-2">
              <FieldLabelHelp
                className="min-w-0"
                helpLabel={copy.divider}
                helpTitle={copy.divider}
                helpText={copy.dividerHelp}
              >
                {copy.dividerLabel}
              </FieldLabelHelp>
              <Switch
                checked={customize.showDivider}
                aria-label={copy.divider}
                onCheckedChange={(checked) =>
                  setCustomize({ showDivider: checked })
                }
              />
            </FieldRow>
            <FieldRow className="min-w-0 justify-between gap-2">
              <FieldLabelHelp
                className="min-w-0"
                helpLabel={copy.idle}
                helpTitle={copy.idle}
                helpText={copy.idleHelp}
              >
                {copy.idleLabel}
              </FieldLabelHelp>
              <Switch
                checked={customize.idleSpin}
                aria-label={copy.idle}
                onCheckedChange={(checked) => setCustomize({ idleSpin: checked })}
              />
            </FieldRow>
          </div>
        </FieldCard>
      </Section>

      <Section title={copy.yourThemes}>
        <FieldCard>
          <div className="flex flex-wrap gap-4">
            {customize.themeColors.map((color, index) => (
              <div
                key={`theme-swatch-${index}`}
                className="relative inline-flex shrink-0"
              >
                <span className={rimSwatchFrameClass(color)}>
                  <input
                    aria-label={`Theme color ${index + 1}`}
                    className={STRIPPED_NATIVE_COLOR_INPUT_CLASS}
                    title={`Pick theme color ${index + 1}`}
                    type="color"
                    value={color}
                    onChange={(event) => {
                      const next = [...customize.themeColors];
                      next[index] = event.target.value;
                      setCustomize({ themeColors: next });
                    }}
                  />
                </span>
                <button
                  type="button"
                  className={SWATCH_REMOVE_BADGE_CLASS}
                  aria-label={copy.removeThemeColor}
                  title={copy.removeThemeColor}
                  onClick={(event) => {
                    event.preventDefault();
                    removeThemeColor(index);
                  }}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            ))}
            {canAddThemeColor ? (
              <Button
                type="button"
                variant="outline"
                className={cn("size-12 rounded-xl p-0", moreButtonClass)}
                aria-label={copy.addThemeColor}
                title={copy.addThemeColor}
                onClick={addThemeColor}
              >
                <Plus className={cn("size-6", moreIconClass)} aria-hidden />
              </Button>
            ) : null}
          </div>
        </FieldCard>
      </Section>

      <Section title={copy.themeLibrary}>
        <FieldCard>
          <div className="flex flex-wrap gap-3">
            {visibleThemeLibrary.map((preset, index) => (
              <button
                key={`${preset.join("-")}-${index}`}
                type="button"
                className="size-12 overflow-hidden rounded-full border border-border p-0 shadow-sm"
                aria-label={`Apply theme preset ${index + 1}`}
                title={copy.applyTheme}
                onClick={() => {
                  setCustomize({
                    themeColors: [...preset],
                    rimBorderColors: [...preset],
                  });
                  toast.success(copy.themeApplied);
                }}
              >
                <span
                  className="block h-full w-full rounded-full"
                  style={{ background: themePreviewBackground([...preset]) }}
                />
              </button>
            ))}
            <Button
              type="button"
              variant="outline"
              className={cn("size-12 rounded-full p-0", moreButtonClass)}
              aria-expanded={showAllThemeLibrary}
              aria-label={
                showAllThemeLibrary
                  ? copy.showFeaturedThemes
                  : copy.showAllThemes
              }
              title={
                showAllThemeLibrary
                  ? copy.showFeaturedThemes
                  : copy.showAllThemes
              }
              onClick={() => setShowAllThemeLibrary((value) => !value)}
            >
              <Plus
                className={cn(
                  "size-5",
                  moreIconClass,
                  showAllThemeLibrary && "rotate-45",
                )}
                aria-hidden
              />
            </Button>
          </div>
        </FieldCard>
      </Section>
      <CustomizeObjectsTab customize={customize} setCustomize={setCustomize} />
    </div>
  );
};
