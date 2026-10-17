import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_RANDOM_NAME_URL,
} from "@/lib/constants";

export const RANDOM_NAME_ABOUT_FEATURES_HEADING =
  "What you can do on this picker";

export const RANDOM_NAME_ABOUT_FEATURES_LEAD =
  "This side panel picks one name from a list next to the tab you are on. Paste or import names, skip duplicates, drop the winner after a pick, then copy or download history. Draws stay on this device. Open the same tool on SpinWheelPlus when you want a larger screen.";

export const RANDOM_NAME_ABOUT_FEATURES: readonly AboutFeatureItem[] = [
  {
    id: "list",
    title: "Names list",
    desc: "One name per line. Paste from the clipboard, import a .txt file, shuffle the order, or clear the list.",
  },
  {
    id: "duplicates",
    title: "Skip duplicate names",
    desc: "On: only the first line for each name counts (letter case does not matter). Off: extra lines work like extra tickets.",
  },
  {
    id: "remove-winner",
    title: "Remove winner after selection",
    desc: "On: the winner leaves the list after each pick. That is the usual setup for first, second, and third place.",
  },
  {
    id: "roll",
    title: "Roll animation",
    desc: "Optional ~2.5s shuffle. The winner is chosen first with crypto.getRandomValues(); the animation is display-only.",
  },
  {
    id: "history",
    title: "History on this device",
    desc: "Recent picks stay in this browser (up to 100). Restore a row, copy a name, or download a .txt file.",
  },
  {
    id: "fairness-audit",
    title: "Fairness you can test",
    desc: "Each pick uses crypto.getRandomValues() in this browser. The fairness audit on the site publishes sample runs you can read.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
];

export const RANDOM_NAME_ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    question: "Is this random name picker free?",
    answer:
      "Yes. The extension and the site tool are free for normal use. No account is required to pick a name.",
  },
  {
    question: "Do I need an account to pick names?",
    answer:
      "No. Your list, options, and history stay on this device. Sign in on SpinWheelPlus only if you want to save custom spin wheels to your account.",
  },
  {
    question: "Are the draws fair?",
    answer:
      "Every pick chooses a random index with crypto.getRandomValues() in this browser. Each name in the pool has the same odds. Run the fairness audit if you want sample checks on the site.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
  {
    question: "Can I pick several names in one go?",
    answer:
      "Each tap picks one name. For several unique winners, turn on Remove winner after selection and keep picking.",
  },
  {
    question: "What does Skip duplicate names do?",
    answer:
      "When it is on, only the first line for each name counts; extra copies are ignored (case does not matter). When it is off, duplicate lines work like extra raffle tickets.",
  },
  {
    question: "What does Remove winner after selection do?",
    answer:
      "After each pick, that name is removed from your list so they cannot win again until you add them back.",
  },
  {
    question: "Does the roll animation change the winner?",
    answer:
      "No. The name is chosen the instant you pick. Roll Animation only plays a ~2.5 second shuffle on screen. It does not change who won.",
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

export const RANDOM_NAME_SITE_CTA_HREF = SITE_RANDOM_NAME_URL;
export const RANDOM_NAME_SITE_CTA_LABEL = "Open Random Name Picker on SpinWheelPlus";
export const RANDOM_NAME_SITE_CTA_TITLE =
  "Open the Random Name Picker on SpinWheelPlus";
export const RANDOM_NAME_SITE_CTA_NOTE =
  "Same picker in a full browser tab.";
