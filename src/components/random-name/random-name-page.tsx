import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { AboutFaq } from "@/components/about-faq";
import { AboutFeatures } from "@/components/about-features";
import { BrandMark } from "@/components/brand-mark";
import { RandomNameNamesPanel } from "@/components/random-name/random-name-names-panel";
import { RandomNameResultsPanel } from "@/components/random-name/random-name-results-panel";
import { SidepanelChromeHeader } from "@/components/sidepanel-chrome-header";
import { SiteEditorCta } from "@/components/site-editor-cta";
import { useRandomNamePick } from "@/hooks/use-random-name-pick";
import { useRandomToolActionShortcut } from "@/hooks/use-random-tool-action-shortcut";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { RANDOM_NAME_SITE_CTA_HREF } from "@/lib/random-name-about-copy";
import { useImmersiveStore } from "@/store/immersive-store";
import { useRandomNameStore } from "@/store/random-name-store";

export const RandomNamePage = () => {
  useEffect(() => {
    void useRandomNameStore.getState().hydrate();
  }, []);

  const ready = useRandomNameStore((state) => state.ready);
  const { pick, isRolling, rollingDisplay } = useRandomNamePick();
  const optionsDocked = useRandomNameStore(
    (state) => state.random_name_options_docked,
  );
  const toggleOptionsDocked = useRandomNameStore(
    (state) => state.toggleRandomNameOptionsDocked,
  );
  const immersive = useImmersiveStore((state) => state.immersive);
  const messages = useMessages();
  const about = messages.about.name;

  const handlePick = useCallback(() => {
    const errorMessage = pick();
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [pick]);

  useRandomToolActionShortcut(handlePick, { disabled: isRolling });

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
          aria-label={messages.ui.name.region}
          className={cn(
            "flex min-w-0 flex-col",
            immersive ? "flex min-h-full flex-col p-0" : "px-3 py-3",
          )}
        >
          {!ready ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {messages.ui.name.loading}
            </p>
          ) : (
            <div
              className={cn(
                "grid gap-4",
                immersive
                  ? "min-h-full flex-1 grid-cols-1 grid-rows-1"
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
                  <RandomNameNamesPanel disabled={isRolling} />
                </div>
              )}
              <div
                className={cn(
                  "order-1 flex min-w-0 flex-col",
                  immersive ? "h-full min-h-full" : "h-full min-h-[32rem]",
                  optionsDocked && !immersive && "lg:order-2",
                )}
              >
                <RandomNameResultsPanel
                  onPick={handlePick}
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
              headingId="rnp-about-features-heading"
              panelId="rnp-about-features-panel"
            />
            <AboutFaq
              faqs={about.faqs}
              headingId="rnp-about-faq-heading"
              panelId="rnp-about-faq-panel"
            />
            <BrandMark />
            <SiteEditorCta
              className="mb-4"
              href={RANDOM_NAME_SITE_CTA_HREF}
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
