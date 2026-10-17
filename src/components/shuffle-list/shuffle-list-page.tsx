import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { AboutFaq } from "@/components/about-faq";
import { AboutFeatures } from "@/components/about-features";
import { BrandMark } from "@/components/brand-mark";
import { ShuffleListInputPanel } from "@/components/shuffle-list/shuffle-list-input-panel";
import { ShuffleListResultsPanel } from "@/components/shuffle-list/shuffle-list-results-panel";
import { SidepanelChromeHeader } from "@/components/sidepanel-chrome-header";
import { SiteEditorCta } from "@/components/site-editor-cta";
import { useRandomToolActionShortcut } from "@/hooks/use-random-tool-action-shortcut";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import { SHUFFLE_LIST_SITE_CTA_HREF } from "@/lib/shuffle-list-about-copy";
import { useImmersiveStore } from "@/store/immersive-store";
import {
  getShuffleListPreparedCount,
  useShuffleListStore,
} from "@/store/shuffle-list-store";

export const ShuffleListPage = () => {
  useEffect(() => {
    void useShuffleListStore.getState().hydrate();
  }, []);

  const ready = useShuffleListStore((state) => state.ready);
  const preparedCount = useShuffleListStore((state) =>
    getShuffleListPreparedCount({
      shuffle_list_input: state.shuffle_list_input,
      shuffle_list_ignore_empty_lines: state.shuffle_list_ignore_empty_lines,
      shuffle_list_remove_duplicates: state.shuffle_list_remove_duplicates,
    }),
  );
  const shuffleList = useShuffleListStore((state) => state.shuffleList);
  const optionsDocked = useShuffleListStore(
    (state) => state.shuffle_list_options_docked,
  );
  const toggleOptionsDocked = useShuffleListStore(
    (state) => state.toggleShuffleListOptionsDocked,
  );
  const immersive = useImmersiveStore((state) => state.immersive);
  const messages = useMessages();
  const about = messages.about.shuffle;

  const handleShuffle = useCallback(() => {
    const errorMessage = shuffleList();
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [shuffleList]);

  useRandomToolActionShortcut(handleShuffle, {
    disabled: !ready || preparedCount === 0,
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
          aria-label={messages.ui.shuffle.region}
          className={cn(
            "flex min-w-0 flex-col",
            immersive ? "flex min-h-full flex-col p-0" : "px-3 py-3",
          )}
        >
          {!ready ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {messages.ui.shuffle.loading}
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
                  <ShuffleListInputPanel />
                </div>
              )}
              <div
                className={cn(
                  "order-1 flex min-w-0 flex-col",
                  immersive ? "h-full min-h-full" : "h-full min-h-[32rem]",
                  optionsDocked && !immersive && "lg:order-2",
                )}
              >
                <ShuffleListResultsPanel
                  onShuffle={handleShuffle}
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
              headingId="sl-about-features-heading"
              panelId="sl-about-features-panel"
            />
            <AboutFaq
              faqs={about.faqs}
              headingId="sl-about-faq-heading"
              panelId="sl-about-faq-panel"
            />
            <BrandMark />
            <SiteEditorCta
              className="mb-4"
              href={SHUFFLE_LIST_SITE_CTA_HREF}
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
