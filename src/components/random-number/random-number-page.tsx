import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { AboutFaq } from "@/components/about-faq";
import { AboutFeatures } from "@/components/about-features";
import { BrandMark } from "@/components/brand-mark";
import { RandomNumberOptionsPanel } from "@/components/random-number/random-number-options-panel";
import { RandomNumberResultsPanel } from "@/components/random-number/random-number-results-panel";
import { SidepanelChromeHeader } from "@/components/sidepanel-chrome-header";
import { SiteEditorCta } from "@/components/site-editor-cta";
import { useRandomNumberGenerate } from "@/hooks/use-random-number-generate";
import { useRandomToolActionShortcut } from "@/hooks/use-random-tool-action-shortcut";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { RANDOM_NUMBER_SITE_CTA_HREF } from "@/lib/random-number-about-copy";
import { useImmersiveStore } from "@/store/immersive-store";
import { useRandomNumberStore } from "@/store/random-number-store";

export const RandomNumberPage = () => {
  useEffect(() => {
    void useRandomNumberStore.getState().hydrate();
  }, []);

  const ready = useRandomNumberStore((state) => state.ready);
  const { generate, isRolling, rollingDisplay } = useRandomNumberGenerate();
  const optionsDocked = useRandomNumberStore(
    (state) => state.random_number_options_docked,
  );
  const toggleOptionsDocked = useRandomNumberStore(
    (state) => state.toggleRandomNumberOptionsDocked,
  );
  const immersive = useImmersiveStore((state) => state.immersive);
  const messages = useMessages();
  const about = messages.about.number;

  const handleGenerate = useCallback(() => {
    const errorMessage = generate();
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [generate]);

  useRandomToolActionShortcut(handleGenerate, { disabled: isRolling });

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
          immersive ? "min-h-0 flex-1 overflow-y-auto overflow-x-hidden" : undefined
        }
      >
      <section
        aria-label={messages.ui.number.region}
        className={cn(
          "flex min-w-0 flex-col",
          immersive ? "h-full min-h-0 p-0" : "px-3 py-3",
        )}
      >
        {!ready ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {messages.ui.number.loading}
          </p>
        ) : (
          <div
            className={cn(
              "grid gap-4",
              immersive
                ? "h-full min-h-0 grid-cols-1"
                : cn(
                    "min-h-[max(100%,32rem)]",
                    optionsDocked &&
                      "lg:grid-cols-[minmax(240px,350px)_minmax(0,1fr)] lg:items-stretch",
                  ),
            )}
          >
            {immersive ? null : (
              <div
                className={cn(
                  "order-2 min-w-0",
                  optionsDocked && "lg:order-1 lg:h-full",
                )}
              >
                <RandomNumberOptionsPanel disabled={isRolling} />
              </div>
            )}
            <div
              className={cn(
                "order-1 flex min-w-0 flex-col",
                immersive ? "h-full min-h-0 flex-1" : "min-h-[32rem]",
                optionsDocked && !immersive && "lg:order-2",
              )}
            >
              <RandomNumberResultsPanel
                onGenerate={handleGenerate}
                optionsDocked={optionsDocked}
                onToggleOptionsDock={toggleOptionsDocked}
                isRolling={isRolling}
                rollingDisplay={rollingDisplay}
              />
            </div>
          </div>
        )}
      </section>
      {immersive ? null : (
        <>
          <AboutFeatures
            heading={about.featuresHeading}
            lead={about.featuresLead}
            items={about.features}
            headingId="rng-about-features-heading"
            panelId="rng-about-features-panel"
          />
          <AboutFaq
            faqs={about.faqs}
            headingId="rng-about-faq-heading"
            panelId="rng-about-faq-panel"
          />
          <BrandMark />
          <SiteEditorCta
            className="mb-4"
            href={RANDOM_NUMBER_SITE_CTA_HREF}
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
