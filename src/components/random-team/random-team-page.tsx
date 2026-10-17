import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { AboutFaq } from "@/components/about-faq";
import { AboutFeatures } from "@/components/about-features";
import { BrandMark } from "@/components/brand-mark";
import { RandomTeamInputPanel } from "@/components/random-team/random-team-input-panel";
import { RandomTeamResultsPanel } from "@/components/random-team/random-team-results-panel";
import { SidepanelChromeHeader } from "@/components/sidepanel-chrome-header";
import { SiteEditorCta } from "@/components/site-editor-cta";
import { useRandomToolActionShortcut } from "@/hooks/use-random-tool-action-shortcut";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { RANDOM_TEAM_SITE_CTA_HREF } from "@/lib/random-team-about-copy";
import { useImmersiveStore } from "@/store/immersive-store";
import {
  getRandomTeamMemberCount,
  useRandomTeamStore,
} from "@/store/random-team-store";

export const RandomTeamPage = () => {
  useEffect(() => {
    void useRandomTeamStore.getState().hydrate();
  }, []);

  const ready = useRandomTeamStore((state) => state.ready);
  const memberCount = useRandomTeamStore((state) =>
    getRandomTeamMemberCount(state),
  );
  const generateTeams = useRandomTeamStore(
    (state) => state.generateRandomTeamGroups,
  );
  const optionsDocked = useRandomTeamStore(
    (state) => state.random_team_input_docked,
  );
  const toggleOptionsDocked = useRandomTeamStore(
    (state) => state.toggleRandomTeamInputDocked,
  );
  const immersive = useImmersiveStore((state) => state.immersive);
  const messages = useMessages();
  const about = messages.about.team;

  const handleGenerate = useCallback(() => {
    const errorMessage = generateTeams();
    if (errorMessage) toast.error(errorMessage);
  }, [generateTeams]);

  const handleRegenerate = useCallback(() => {
    const errorMessage = useRandomTeamStore
      .getState()
      .regenerateRandomTeamGroups();
    if (errorMessage) toast.error(errorMessage);
  }, []);

  useRandomToolActionShortcut(handleGenerate, {
    disabled: !ready || memberCount === 0,
  });

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
          aria-label={messages.ui.team.region}
          className={cn(
            "flex min-w-0 flex-col",
            immersive ? "flex min-h-full flex-col p-0" : "px-3 py-3",
          )}
        >
          {!ready ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {messages.ui.team.loading}
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
                        "lg:grid-cols-[minmax(240px,350px)_minmax(0,1fr)] lg:items-start",
                    ),
              )}
            >
              {immersive ? null : (
                <div
                  className={cn(
                    "order-2 min-w-0",
                    optionsDocked && "lg:order-1",
                  )}
                >
                  <RandomTeamInputPanel />
                </div>
              )}
              <div
                className={cn(
                  "order-1 flex min-w-0 flex-col",
                  immersive ? "h-full min-h-full" : "h-full min-h-[32rem]",
                  optionsDocked && !immersive && "lg:order-2",
                )}
              >
                <RandomTeamResultsPanel
                  onGenerate={handleGenerate}
                  onRegenerate={handleRegenerate}
                  optionsDocked={optionsDocked}
                  onToggleOptionsDock={toggleOptionsDocked}
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
              headingId="rt-about-features-heading"
              panelId="rt-about-features-panel"
            />
            <AboutFaq
              faqs={about.faqs}
              headingId="rt-about-faq-heading"
              panelId="rt-about-faq-panel"
            />
            <BrandMark />
            <SiteEditorCta
              className="mb-4"
              href={RANDOM_TEAM_SITE_CTA_HREF}
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
