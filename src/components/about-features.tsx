import { renderLinkedCopy } from "@/components/about-inline-link";
import {
  ABOUT_BODY_CLASS,
  ABOUT_LABEL_CLASS,
  AboutPanelSection,
  AboutSectionHeader,
} from "@/components/about-section-header";
import { type AboutFeatureItem } from "@/lib/about-copy";
import { cn } from "@/lib/cn";
import { useLocaleStore } from "@/store/locale-store";
import { useWheelStore } from "@/store/wheel-store";

type AboutFeaturesProps = {
  heading?: string;
  lead?: string;
  items?: readonly AboutFeatureItem[];
  headingId?: string;
  panelId?: string;
};

export const AboutFeatures = ({
  heading,
  lead,
  items,
  headingId = "about-features-heading",
  panelId = "about-features-panel",
}: AboutFeaturesProps) => {
  const showAboutFeatures = useWheelStore((s) => s.showAboutFeatures);
  const setShowAboutFeatures = useWheelStore((s) => s.setShowAboutFeatures);
  const messages = useLocaleStore((s) => s.messages);
  const resolvedHeading = heading ?? messages.featuresHeading;
  const resolvedLead = lead ?? messages.featuresLead;
  const resolvedItems = items ?? messages.features;

  return (
    <AboutPanelSection labelledBy={headingId}>
      <AboutSectionHeader
        headingId={headingId}
        panelId={panelId}
        title={resolvedHeading}
        expanded={showAboutFeatures}
        hideLabel={messages.hideAbout}
        showLabel={messages.showAbout}
        onToggle={() => setShowAboutFeatures(!showAboutFeatures)}
      />
      {showAboutFeatures ? (
        <div id={panelId}>
          <p className={cn("mt-3", ABOUT_BODY_CLASS)}>{resolvedLead}</p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed">
            {resolvedItems.map((item) => (
              <li key={item.id}>
                <span className={ABOUT_LABEL_CLASS}>{item.title}. </span>
                <span className="text-muted-foreground">
                  {renderLinkedCopy(
                    item.desc,
                    item.href,
                    item.linkLabel,
                    item.linkTitle,
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </AboutPanelSection>
  );
};
