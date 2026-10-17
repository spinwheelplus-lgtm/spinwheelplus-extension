import { CustomizeEffectsTab } from "@/components/customize/customize-effects-tab";
import {
  FieldCard,
  FieldColorBar,
  FieldLabel,
  FieldLabelHelp,
  FieldRange,
  FieldRow,
  Section,
} from "@/components/customize/customize-fields";
import { Switch } from "@/components/ui/switch";
import {
  TITLE_FONT_SIZE_MAX,
  TITLE_FONT_SIZE_MIN,
} from "@/lib/constants";
import { useMessages } from "@/lib/i18n/use-messages";
import type { CustomizeState } from "@/lib/types";

type CustomizePageTabProps = {
  customize: CustomizeState;
  setCustomize: (patch: Partial<CustomizeState>) => void;
};

export const CustomizePageTab = ({
  customize,
  setCustomize,
}: CustomizePageTabProps) => {
  const copy = useMessages().ui.customize;
  const headerOn = customize.showHeader;
  const headerHelp = {
    helpLabel: copy.showHeader,
    helpTitle: copy.showHeader,
    helpText: copy.headerHelp,
  };

  return (
    <div className="space-y-6">
      <Section
        title={copy.header}
        titleHelp={headerHelp}
        trailing={
          <Switch
            checked={headerOn}
            aria-label={copy.showHeader}
            title={copy.showHeader}
            onCheckedChange={(checked) => setCustomize({ showHeader: checked })}
          />
        }
      >
        <FieldCard>
          <FieldRow>
            <FieldLabel>{copy.titleLabel}</FieldLabel>
            <input
              value={customize.title}
              maxLength={80}
              disabled={!headerOn}
              placeholder={copy.titlePlaceholder}
              className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm font-normal disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={copy.wheelTitle}
              title={copy.wheelTitle}
              onChange={(event) => setCustomize({ title: event.target.value })}
            />
          </FieldRow>
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.fontSize}
              helpTitle={copy.fontSize}
              helpText={copy.fontSizeHelp}
            >
              {copy.fontSizeLabel}
            </FieldLabelHelp>
            <FieldRange
              min={TITLE_FONT_SIZE_MIN}
              max={TITLE_FONT_SIZE_MAX}
              disabled={!headerOn}
              value={customize.titleFontSize}
              suffix="px"
              ariaLabel={copy.fontSizeAria}
              title={copy.fontSizeAria}
              onValueChange={(titleFontSize) => setCustomize({ titleFontSize })}
            />
          </FieldRow>
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.textColor}
              helpTitle={copy.textColor}
              helpText={copy.textColorHelp}
            >
              {copy.textColorLabel}
            </FieldLabelHelp>
            <FieldColorBar
              value={customize.titleColor}
              disabled={!headerOn}
              ariaLabel={copy.textColorAria}
              title={copy.textColorAria}
              onChange={(titleColor) => setCustomize({ titleColor })}
            />
          </FieldRow>
          <FieldRow>
            <FieldLabelHelp
              helpLabel={copy.panelColor}
              helpTitle={copy.panelColor}
              helpText={copy.panelColorHelp}
            >
              {copy.panelColorLabel}
            </FieldLabelHelp>
            <FieldColorBar
              value={customize.titlePanelColor}
              disabled={!headerOn}
              ariaLabel={copy.panelColorAria}
              title={copy.panelColorAria}
              onChange={(titlePanelColor) => setCustomize({ titlePanelColor })}
            />
          </FieldRow>
        </FieldCard>
      </Section>
      <CustomizeEffectsTab customize={customize} setCustomize={setCustomize} />
    </div>
  );
};
