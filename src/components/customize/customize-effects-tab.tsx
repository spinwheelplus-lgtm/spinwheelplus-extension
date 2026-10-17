import { Play } from "lucide-react";

import {
  FieldCard,
  FieldLabelHelp,
  FieldRange,
  FieldRow,
  NativeSelect,
  Section,
  fieldControlClass,
} from "@/components/customize/customize-fields";
import { ResultPopupSkinDemoDialog } from "@/components/result-popup-skin-demo-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import {
  SPIN_DURATION_SEC_MAX,
  SPIN_DURATION_SEC_MIN,
} from "@/lib/constants";
import { pickWheelTextColor } from "@/lib/item-color";
import { resolveResultPopupSkin } from "@/lib/result-popup-skin";
import { playTick } from "@/lib/sounds";
import {
  STYLE2_STOP_STRENGTH_MAX,
  STYLE2_STOP_STRENGTH_MIN,
  readSpinStyle,
  readStyle2StopStrength,
} from "@/lib/spin-style";
import type { CustomizeState } from "@/lib/types";
import {
  WINNER_EFFECT_CONFETTI,
  WINNER_EFFECT_FIREWORKS,
  WINNER_EFFECT_NONE,
  isActiveWinnerEffect,
  resolveWinnerEffect,
} from "@/lib/winner-effect";
import { readWinnerPopupButtonMode } from "@/lib/winner-popup-buttons";
import { useMessages } from "@/lib/i18n/use-messages";
import { useCustomizeUiStore } from "@/store/customize-ui-store";
import { useWheelStore } from "@/store/wheel-store";

type CustomizeEffectsTabProps = {
  customize: CustomizeState;
  setCustomize: (patch: Partial<CustomizeState>) => void;
};

export const CustomizeEffectsTab = ({
  customize,
  setCustomize,
}: CustomizeEffectsTabProps) => {
  const copy = useMessages().ui.customize;
  const isManualStop = customize.spinStyle === "style2";
  const popupStyleDemoOpen = useCustomizeUiStore((s) => s.resultPopupDemoOpen);
  const setPopupStyleDemoOpen = useCustomizeUiStore(
    (s) => s.setResultPopupDemoOpen,
  );
  const popupSkin = resolveResultPopupSkin(customize.winnerPopupSkin);
  const popupEnabled = customize.winnerPopup;
  const winnerEffect = resolveWinnerEffect(customize.winnerEffect);
  const playWinnerEffect = useWheelStore((s) => s.playWinnerEffect);
  const effectEnabled = isActiveWinnerEffect(winnerEffect);

  return (
    <div className="space-y-6">
      <Section title={copy.spinSettings}>
        <FieldCard>
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.spinStyle}
              helpTitle={copy.spinStyle}
              helpText={
                <>
                  {copy.spinStyleHelpLead}
                  <br />
                  <strong>{copy.autoStop}</strong>: {copy.autoStopHelp}
                  <br />
                  <strong>{copy.manualStop}</strong>: {copy.manualStopHelp}
                </>
              }
            >
              {copy.spinStyleLabel}
            </FieldLabelHelp>
            <NativeSelect
              ariaLabel={copy.spinStyle}
              value={customize.spinStyle}
              options={[
                { label: copy.autoStopOption, value: "style1" },
                { label: copy.manualStop, value: "style2" },
              ]}
              onValueChange={(value) =>
                setCustomize({ spinStyle: readSpinStyle(value) })
              }
            />
          </FieldRow>
          {isManualStop ? (
            <FieldRow>
              <FieldLabelHelp
                helpLabel={copy.spinStrength}
                helpTitle={copy.spinStrength}
                helpText={copy.spinStrengthHelp}
              >
                {copy.spinStrengthLabel}
              </FieldLabelHelp>
              <FieldRange
                min={STYLE2_STOP_STRENGTH_MIN}
                max={STYLE2_STOP_STRENGTH_MAX}
                value={customize.style2StopStrength}
                ariaLabel={copy.spinStrength}
                title={copy.spinStrength}
                onValueChange={(style2StopStrength) =>
                  setCustomize({
                    style2StopStrength: readStyle2StopStrength(
                      style2StopStrength,
                    ),
                  })
                }
              />
            </FieldRow>
          ) : (
            <FieldRow>
              <FieldLabelHelp
                helpLabel={copy.duration}
                helpTitle={copy.duration}
                helpText={copy.durationHelp}
              >
                {copy.durationLabel}
              </FieldLabelHelp>
              <FieldRange
                min={SPIN_DURATION_SEC_MIN}
                max={SPIN_DURATION_SEC_MAX}
                value={customize.spinDurationSec}
                suffix="s"
                ariaLabel={copy.durationAria}
                title={copy.durationAria}
                onValueChange={(spinDurationSec) =>
                  setCustomize({ spinDurationSec })
                }
              />
            </FieldRow>
          )}
        </FieldCard>
      </Section>
      <Section title={copy.soundsAndResult}>
        <FieldCard className="space-y-3">
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.soundEffects}
              helpTitle={copy.soundEffects}
              helpText={copy.soundEffectsHelp}
            >
              {copy.soundEffectsLabel}
            </FieldLabelHelp>
            <div className={cn(fieldControlClass, "justify-end")}>
              <Switch
                checked={customize.soundEnabled}
                aria-label={copy.soundEffects}
                onCheckedChange={(checked) => {
                  setCustomize({ soundEnabled: checked });
                  if (checked) playTick();
                }}
              />
            </div>
          </FieldRow>
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.winnerEffect}
              helpTitle={copy.winnerEffect}
              helpText={copy.winnerEffectHelp}
            >
              {copy.winnerEffectLabel}
            </FieldLabelHelp>
            <div className={fieldControlClass}>
              <NativeSelect
                ariaLabel={copy.winnerEffect}
                value={winnerEffect}
                options={[
                  { value: WINNER_EFFECT_CONFETTI, label: copy.confetti },
                  { value: WINNER_EFFECT_FIREWORKS, label: copy.fireworks },
                  { value: WINNER_EFFECT_NONE, label: copy.none },
                ]}
                onValueChange={(value) =>
                  setCustomize({
                    winnerEffect: resolveWinnerEffect(value),
                  })
                }
              />
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                disabled={!effectEnabled}
                title={copy.previewWinnerEffect}
                aria-label={copy.previewWinnerEffect}
                onClick={() => playWinnerEffect()}
              >
                <Play className="size-4" aria-hidden />
              </Button>
            </div>
          </FieldRow>
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.highlightSlice}
              helpTitle={copy.highlightSlice}
              helpText={copy.highlightSliceHelp}
            >
              {copy.highlightSliceLabel}
            </FieldLabelHelp>
            <div className={cn(fieldControlClass, "justify-end")}>
              <Switch
                checked={customize.winnerHighlight}
                aria-label={copy.highlightSlice}
                onCheckedChange={(checked) =>
                  setCustomize({ winnerHighlight: checked })
                }
              />
            </div>
          </FieldRow>
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.showPopup}
              helpTitle={copy.showPopup}
              helpText={copy.showPopupHelp}
            >
              {copy.showPopupLabel}
            </FieldLabelHelp>
            <div className={cn(fieldControlClass, "justify-end")}>
              <Switch
                checked={popupEnabled}
                aria-label={copy.showPopup}
                onCheckedChange={(checked) =>
                  setCustomize({ winnerPopup: checked })
                }
              />
            </div>
          </FieldRow>
          <div
            className={
              popupEnabled
                ? "ml-3 space-y-3 border-l-2 border-border/45 pl-3"
                : "ml-3 space-y-3 border-l-2 border-border/45 pl-3 opacity-50"
            }
          >
            <FieldRow>
              <FieldLabelHelp
                helpLabel={copy.popupStyle}
                helpTitle={copy.popupStyle}
                helpText={copy.popupStyleHelp}
              >
                {copy.popupStyleLabel}
              </FieldLabelHelp>
              <div className={fieldControlClass}>
                <NativeSelect
                  ariaLabel={copy.popupStyle}
                  value={popupSkin}
                  options={[
                    { value: "classic" as const, label: copy.skinCard },
                    { value: "tape" as const, label: copy.skinTape },
                    { value: "chalk" as const, label: copy.skinChalk },
                    { value: "broadcast" as const, label: copy.skinBroadcast },
                  ]}
                  disabled={!popupEnabled}
                  onValueChange={(value) =>
                    setCustomize({
                      winnerPopupSkin: resolveResultPopupSkin(value),
                    })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  disabled={!popupEnabled}
                  title={copy.previewPopup}
                  aria-label={copy.previewPopup}
                  onClick={() => setPopupStyleDemoOpen(true)}
                >
                  <Play className="size-4" aria-hidden />
                </Button>
              </div>
            </FieldRow>
            <FieldRow>
              <FieldLabelHelp
                helpLabel={copy.popupMessage}
                helpTitle={copy.popupMessage}
                helpText={copy.popupMessageHelp}
              >
                {copy.popupMessageLabel}
              </FieldLabelHelp>
              <div className={fieldControlClass}>
                <Input
                  value={customize.winnerTitle}
                  placeholder={copy.popupMessagePlaceholder}
                  disabled={!popupEnabled}
                  aria-label={copy.popupMessage}
                  onChange={(event) =>
                    setCustomize({ winnerTitle: event.currentTarget.value })
                  }
                />
              </div>
            </FieldRow>
            <FieldRow>
              <FieldLabelHelp
                helpLabel={copy.popupButtons}
                helpTitle={copy.popupButtons}
                helpText={copy.popupButtonsHelp}
              >
                {copy.popupButtonsLabel}
              </FieldLabelHelp>
              <NativeSelect
                ariaLabel={copy.popupButtons}
                value={customize.winnerPopupButtonMode}
                options={[
                  { label: copy.closeOnly, value: "close_only" },
                  { label: copy.removeOnly, value: "remove_only" },
                  { label: copy.closeAndRemove, value: "close_and_remove" },
                ]}
                disabled={!popupEnabled}
                onValueChange={(value) =>
                  setCustomize({
                    winnerPopupButtonMode: readWinnerPopupButtonMode(value),
                  })
                }
              />
            </FieldRow>
          </div>
        </FieldCard>
      </Section>
      <ResultPopupSkinDemoDialog
        open={popupStyleDemoOpen}
        onOpenChange={setPopupStyleDemoOpen}
        skin={popupSkin}
        title={customize.winnerTitle}
        headerStyle={{
          backgroundColor: customize.themeColors[0],
          color: pickWheelTextColor(customize.themeColors[0]),
        }}
      />
    </div>
  );
};
