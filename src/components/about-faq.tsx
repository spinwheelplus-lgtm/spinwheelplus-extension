import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { renderLinkedCopy } from "@/components/about-inline-link";
import {
  ABOUT_BODY_CLASS,
  ABOUT_LABEL_CLASS,
  AboutPanelSection,
  AboutSectionHeader,
} from "@/components/about-section-header";
import { type AboutFaqItem } from "@/lib/about-copy";
import { cn } from "@/lib/cn";
import { useLocaleStore } from "@/store/locale-store";
import { useWheelStore } from "@/store/wheel-store";

type FaqRowProps = {
  faq: AboutFaqItem;
  index: number;
  open: boolean;
  onToggle: () => void;
};

const FaqRow = ({ faq, index, open, onToggle }: FaqRowProps) => {
  const headingId = `about-faq-${index}-h`;
  const panelId = `about-faq-${index}-p`;
  return (
    <div>
      <h3 id={headingId} className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            "flex w-full items-center justify-between gap-2 py-3 text-left",
            ABOUT_LABEL_CLASS,
          )}
        >
          <span className="min-w-0">{faq.question}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 shrink-0 text-primary transition-transform duration-200 dark:text-sky-400",
              open && "rotate-180",
            )}
          />
        </button>
      </h3>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headingId}
          className="pb-3"
        >
          <p className={ABOUT_BODY_CLASS}>
            {renderLinkedCopy(
              faq.answer,
              faq.href,
              faq.linkLabel,
              faq.linkTitle,
            )}
          </p>
        </div>
      ) : null}
    </div>
  );
};

const FAQ_PANEL_ID = "about-faq-panel";

type AboutFaqProps = {
  heading?: string;
  faqs?: readonly AboutFaqItem[];
  headingId?: string;
  panelId?: string;
};

export const AboutFaq = ({
  heading,
  faqs,
  headingId = "about-faq-heading",
  panelId = FAQ_PANEL_ID,
}: AboutFaqProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const showAboutFaq = useWheelStore((s) => s.showAboutFaq);
  const setShowAboutFaq = useWheelStore((s) => s.setShowAboutFaq);
  const messages = useLocaleStore((s) => s.messages);
  const resolvedHeading = heading ?? messages.faqHeading;
  const resolvedFaqs = faqs ?? messages.faqs;

  return (
    <AboutPanelSection labelledBy={headingId}>
      <AboutSectionHeader
        headingId={headingId}
        panelId={panelId}
        title={resolvedHeading}
        expanded={showAboutFaq}
        hideLabel={messages.hideFaq}
        showLabel={messages.showFaq}
        onToggle={() => setShowAboutFaq(!showAboutFaq)}
      />
      {showAboutFaq ? (
        <div
          id={panelId}
          className="mt-1 divide-y divide-border border-t border-border"
        >
          {resolvedFaqs.map((faq, index) => (
            <FaqRow
              key={faq.question}
              faq={faq}
              index={index}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      ) : null}
    </AboutPanelSection>
  );
};
