import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_SHUFFLE_LIST_URL,
} from "@/lib/constants";

export const SHUFFLE_LIST_ABOUT_FEATURES_HEADING =
  "What you can do on this shuffler";

export const SHUFFLE_LIST_ABOUT_FEATURES_LEAD =
  "This side panel mixes a list into a new order next to the tab you are on. It does not pick one winner. Paste or import lines, drop blanks or duplicates, then copy or download the mix. History stays on this device. Open the same tool on SpinWheelPlus when you want a larger screen.";

export const SHUFFLE_LIST_ABOUT_FEATURES: readonly AboutFeatureItem[] = [
  {
    id: "list",
    title: "Your list",
    desc: "One item per line. Paste from the clipboard, import a .txt file, or clear the list.",
  },
  {
    id: "ignore-empty",
    title: "Ignore empty lines",
    desc: "On: blank lines are stripped before the mix. Off: empty lines stay as empty slots.",
  },
  {
    id: "duplicates",
    title: "Remove duplicate items",
    desc: "On: only the first copy of each line is kept (letter case does not matter). Off: extra copies stay as extra tickets.",
  },
  {
    id: "sound",
    title: "Reveal sound",
    desc: "Optional short tone when a new mix appears. The order is already chosen; sound does not change it. Restore from history stays quiet.",
  },
  {
    id: "order",
    title: "Fair random order",
    desc: "Fisher-Yates with crypto.getRandomValues() in this browser. Each full ordering of your list is equally likely.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
  {
    id: "history",
    title: "History on this device",
    desc: "Recent mixes stay in this browser (up to 50). Restore a card, copy a mix, or download a .txt file.",
  },
];

export const SHUFFLE_LIST_ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    question: "Is this shuffle list tool free?",
    answer:
      "Yes. Shuffle and copy with no account. Sign in on SpinWheelPlus only if you use other features later.",
  },
  {
    question: "How random is it?",
    answer:
      "Fisher-Yates plus browser crypto (crypto.getRandomValues()). Not a fixed seed. Fine for class, meetings, and casual draws. Regulated lotteries are a different job.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
  {
    question: "What do the Options do?",
    answer:
      "Ignore empty lines strips blanks. Remove duplicate items keeps the first copy of each line. Handy after messy spreadsheet exports.",
  },
  {
    question: "Can I undo?",
    answer:
      "Yes, from Recent Shuffles on this device. Clear history when you are done. Wipe browser data and that local history goes too.",
  },
  {
    question: "Can I shuffle again?",
    answer: "Anytime. Each press is a new order.",
  },
  {
    question: "What can I put on the list?",
    answer:
      "Names, chores, talk titles, songs, prompts: one thing per line. Very long lists still shuffle; reading 100+ lines out loud is the hard part, not the math.",
  },
  {
    question: "Does this pick a winner?",
    answer:
      "No. You get the same items in a new order. Use Random Name Picker when you need one name.",
  },
  {
    question: "Is my list and history private?",
    answer:
      "Yes here. The list and history stay in this browser's extension storage. See the Privacy Policy for how SpinWheelPlus handles data on the website.",
    href: SITE_PRIVACY_URL,
    linkLabel: "Privacy Policy",
    linkTitle: "SpinWheelPlus Privacy Policy",
  },
];

export const SHUFFLE_LIST_SITE_CTA_HREF = SITE_SHUFFLE_LIST_URL;
export const SHUFFLE_LIST_SITE_CTA_LABEL =
  "Open Shuffle List on SpinWheelPlus";
export const SHUFFLE_LIST_SITE_CTA_TITLE =
  "Open Shuffle List on SpinWheelPlus";
export const SHUFFLE_LIST_SITE_CTA_NOTE = "Same shuffler in a full browser tab.";
