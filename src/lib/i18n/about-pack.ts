import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

/** One tool's about block. A new locale fills every pack. */
export type AboutPack = {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqs: readonly AboutFaqItem[];
  ctaLabel: string;
  ctaTitle: string;
  ctaNote: string;
};

export type ToolAbout = {
  number: AboutPack;
  name: AboutPack;
  dice: AboutPack;
  coin: AboutPack;
  yesNo: AboutPack;
  shuffle: AboutPack;
  team: AboutPack;
};
