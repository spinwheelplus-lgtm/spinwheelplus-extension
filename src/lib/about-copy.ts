import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";

export type AboutFeatureItem = {
  id: string;
  title: string;
  desc: string;
  href?: string;
  linkLabel?: string;
  linkTitle?: string;
};

export type AboutFaqItem = {
  question: string;
  answer: string;
  href?: string;
  linkLabel?: string;
  linkTitle?: string;
};

export const ABOUT_FEATURES_HEADING = "What you can do on this wheel";

export const ABOUT_FEATURES_LEAD =
  "This side panel is a custom spinner next to the tab you are on, not a fixed name list. Add labels, change how it looks and sounds, then spin. The list stays on this device. Open the full editor on SpinWheelPlus when you need a share link, embed, or account save.";

export const ABOUT_FEATURES: readonly AboutFeatureItem[] = [
  {
    id: "weighted-slices",
    title: "Weighted slices",
    desc: "Give a slice a higher weight when bonus raffle entries should win more often. The wider slice is the odds. Add an image to a slice in Advanced view. Tell your audience if the draw is not even.",
  },
  {
    id: "images-themes",
    title: "Images and themes",
    desc: "Set a color theme, rim, hub, and title. Paste an image onto a slice. Page backgrounds and Unsplash live on the full editor.",
  },
  {
    id: "sounds-winner",
    title: "Sounds and winner popup",
    desc: "Turn spin and win sounds on, pick Confetti or Fireworks when the pointer stops, then Close or Remove the winner so the next draw has a new name.",
  },
  {
    id: "entries-history",
    title: "Entries and history",
    desc: "Edit as text or Advanced rows. Shuffle, sort, and clear. Result history stays on this device.",
  },
  {
    id: "beside-tab",
    title: "Spin beside the current tab",
    desc: "Keep Docs, Meet, or a class page open and spin here. Click the wheel or press Space.",
  },
  {
    id: "full-editor",
    title: "Share, embed, and save",
    desc: "Open the full editor on SpinWheelPlus to copy a link, embed the wheel, add a backdrop, or save to your account.",
  },
  {
    id: "fairness-audit",
    title: "Fairness you can test",
    desc: "Each spin uses crypto.getRandomValues() in this browser. The fairness audit publishes a 111-name, 10,000-spin sample (4 runs) and chi-square checks by wheel size.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
];

export const ABOUT_FAQ_HEADING = "Frequently Asked Questions";

export const ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    question: "Is SpinWheelPlus free?",
    answer:
      "Yes for normal use: this extension and the site editor. If we ever add paid extras, they will be optional. We will not paywall your first test spin.",
  },
  {
    question: "Do I need an account to use the spin wheel?",
    answer:
      "No. The extension loads and stores the wheel on this device. Sign in on SpinWheelPlus when you want wheels saved to your account.",
  },
  {
    question: "Is the spin wheel truly random?",
    answer:
      "Each spin uses crypto.getRandomValues() in this browser, not a seed we picked. Run the fairness audit if you want thousands of picks on your device. Fair for class and streams; not a licensed lottery.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
  {
    question: "How do weighted slices work?",
    answer:
      "Give a slice a higher weight in Advanced view and it takes up more of the wheel, so it wins more often. Handy for extra raffle tickets or making one option slightly more likely. The math is visible; we are not changing counts behind the scenes. The fairness audit on the site tests equal weights only.",
  },
  {
    question: "Can I share my wheel with someone else?",
    answer:
      "Not from this side panel. Open the full editor on SpinWheelPlus to copy a share link. A co-host can open the same wheel there.",
    href: SITE_URL,
    linkLabel: "full editor on SpinWheelPlus",
    linkTitle: "Open the SpinWheelPlus editor",
  },
  {
    question: "Can I put the wheel on a stream or website?",
    answer:
      "Use the full editor on SpinWheelPlus for embed or a hosted spin page. This extension stays beside the current tab so you can spin while you present.",
  },
  {
    question: "Is my wheel list private?",
    answer:
      "Yes here. Entries stay in this browser's extension storage until you open the full editor and Share or Save. Do not put sensitive student data on a Public link. See the Privacy Policy for retention and deletion.",
    href: SITE_PRIVACY_URL,
    linkLabel: "Privacy Policy",
    linkTitle: "SpinWheelPlus Privacy Policy",
  },
  {
    question: "How many entries can I add to the wheel?",
    answer:
      "Up to 1000. Past about 120 names the slices get hard to read on a projector. Split a huge list into two wheels if you need to.",
  },
];
