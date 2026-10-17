import { useEffect } from "react";

import { AboutFaq } from "@/components/about-faq";
import { AboutFeatures } from "@/components/about-features";
import { BrandMark } from "@/components/brand-mark";
import { RandomYesNoTool } from "@/components/random-yes-no/random-yes-no-tool";
import { SidepanelChromeHeader } from "@/components/sidepanel-chrome-header";
import { SiteEditorCta } from "@/components/site-editor-cta";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { YES_NO_SITE_CTA_HREF } from "@/lib/yes-no-about-copy";
import { useImmersiveStore } from "@/store/immersive-store";
import { useRandomYesNoStore } from "@/store/random-yes-no-store";

export const RandomYesNoPage = () => {
  useEffect(() => {
    void useRandomYesNoStore.getState().hydrate();
  }, []);

  const ready = useRandomYesNoStore((state) => state.ready);
  const immersive = useImmersiveStore((state) => state.immersive);
  const messages = useMessages();
  const about = messages.about.yesNo;

  return (
    <div
      className={
        immersive
          ? "flex h-svh max-h-svh flex-col overflow-hidden"
          : "flex min-h-full flex-col"
      }
    >
      {immersive ? null : <SidepanelChromeHeader />}
      <div
        className={
          immersive
            ? "min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
            : undefined
        }
      >
        <section
          aria-label={messages.ui.yesNo.region}
          className={cn(
            "flex min-w-0 flex-col",
            immersive ? "flex min-h-full flex-col p-0" : "w-full px-3 py-3",
          )}
        >
          {!ready ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {messages.ui.yesNo.loading}
            </p>
          ) : (
            <RandomYesNoTool />
          )}
        </section>
        {immersive ? null : (
          <>
            <AboutFeatures
              heading={about.featuresHeading}
              lead={about.featuresLead}
              items={about.features}
              headingId="yes-no-about-features-heading"
              panelId="yes-no-about-features-panel"
            />
            <AboutFaq
              faqs={about.faqs}
              headingId="yes-no-about-faq-heading"
              panelId="yes-no-about-faq-panel"
            />
            <BrandMark />
            <SiteEditorCta
              className="mb-4"
              href={YES_NO_SITE_CTA_HREF}
              label={about.ctaLabel}
              title={about.ctaTitle}
              note={about.ctaNote}
            />
          </>
        )}
      </div>
    </div>
  );
};
