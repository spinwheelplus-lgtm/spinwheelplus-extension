import { useEffect } from "react";

import { AboutFaq } from "@/components/about-faq";
import { AboutFeatures } from "@/components/about-features";
import { BrandMark } from "@/components/brand-mark";
import { CoinFlipTool } from "@/components/coin-flip/coin-flip-tool";
import { SidepanelChromeHeader } from "@/components/sidepanel-chrome-header";
import { SiteEditorCta } from "@/components/site-editor-cta";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { COIN_FLIP_SITE_CTA_HREF } from "@/lib/coin-flip-about-copy";
import { useCoinFlipStore } from "@/store/coin-flip-store";
import { useImmersiveStore } from "@/store/immersive-store";

export const CoinFlipPage = () => {
  useEffect(() => {
    void useCoinFlipStore.getState().hydrate();
  }, []);

  const ready = useCoinFlipStore((state) => state.ready);
  const immersive = useImmersiveStore((state) => state.immersive);
  const messages = useMessages();
  const about = messages.about.coin;

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
          immersive ? "flex min-h-0 flex-1 flex-col overflow-hidden" : undefined
        }
      >
        <section
          aria-label={messages.ui.coin.region}
          className={cn(
            "flex min-w-0 flex-col",
            immersive ? "flex min-h-0 flex-1 flex-col p-0" : "w-full px-3 py-3",
          )}
        >
          {!ready ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {messages.ui.coin.loading}
            </p>
          ) : (
            <CoinFlipTool />
          )}
        </section>
        {immersive ? null : (
          <>
            <AboutFeatures
              heading={about.featuresHeading}
              lead={about.featuresLead}
              items={about.features}
              headingId="coin-about-features-heading"
              panelId="coin-about-features-panel"
            />
            <AboutFaq
              faqs={about.faqs}
              headingId="coin-about-faq-heading"
              panelId="coin-about-faq-panel"
            />
            <BrandMark />
            <SiteEditorCta
              className="mb-4"
              href={COIN_FLIP_SITE_CTA_HREF}
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
