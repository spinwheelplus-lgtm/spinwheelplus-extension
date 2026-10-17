import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_RANDOM_NUMBER_URL,
} from "@/lib/constants";

export const RANDOM_NUMBER_ABOUT_FEATURES_HEADING =
  "What you can do on this generator";

export const RANDOM_NUMBER_ABOUT_FEATURES_LEAD =
  "This side panel picks integers next to the tab you are on. Set a range, exclude values, generate one number or a batch, then copy or download the history. Draws stay on this device. Open the same tool on SpinWheelPlus when you want a larger screen.";

export const RANDOM_NUMBER_ABOUT_FEATURES: readonly AboutFeatureItem[] = [
  {
    id: "range",
    title: "Min and max",
    desc: "Draw from -1,000,000 to 1,000,000. If min is greater than max, the tool still works: values are treated as low to high.",
  },
  {
    id: "exclude",
    title: "Exclude list",
    desc: "Skip tickets or IDs with a comma-separated list. Excluded values never appear until you remove them.",
  },
  {
    id: "batch",
    title: "One draw or a batch",
    desc: "Presets 1, 2, 3, 5, or 10, or Custom up to 500 numbers in one Generate.",
  },
  {
    id: "repeat",
    title: "Repeat in one draw",
    desc: "On: the same number can show twice in that result. Off: every value in that generate must be unique.",
  },
  {
    id: "roll",
    title: "Roll animation",
    desc: "Optional ~2.5s shuffle. The final numbers are chosen first with crypto.getRandomValues(); the animation is display-only.",
  },
  {
    id: "history",
    title: "History on this device",
    desc: "Recent draws stay in this browser. Restore a row, copy the latest result, or download a .txt file.",
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

export const RANDOM_NUMBER_ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    question: "Is this random number generator free?",
    answer:
      "Yes. The extension and the site tool are free for normal use. No account is required to generate numbers.",
  },
  {
    question: "Do I need an account to generate numbers?",
    answer:
      "No. Options and history stay on this device. Sign in on SpinWheelPlus only if you want to save custom spin wheels to your account.",
  },
  {
    question: "Are the numbers truly random?",
    answer:
      "Each draw uses crypto.getRandomValues() in this browser. Every integer in your range keeps an equal, independent chance. Run the fairness audit if you want sample checks on the site.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
  {
    question: "What number range can I use?",
    answer:
      "Any integers from -1,000,000 through 1,000,000. Use a small range for raffle tickets or a wide range for sample IDs.",
  },
  {
    question: "Can I generate more than one number at a time?",
    answer:
      "Yes. Use a preset or Custom, up to 500 numbers per Generate.",
  },
  {
    question: "Can I exclude certain numbers from the draw?",
    answer:
      "Yes. Add comma-separated values to Exclude Numbers. They stay out of the pool until you delete them from the list.",
  },
  {
    question: "Can the same number appear twice in one draw?",
    answer:
      "Yes when Repeat in One Draw is on. Turn it off for unique values in that generate. If you ask for more unique numbers than the range allows after exclusions, you get an error.",
  },
  {
    question: "Does roll animation change the result?",
    answer:
      "No. The final numbers are chosen immediately. The shuffle on screen is display-only and does not affect fairness.",
  },
  {
    question: "Is my draw history private?",
    answer:
      "Yes here. History stays in this browser's extension storage. See the Privacy Policy for how SpinWheelPlus handles data on the website.",
    href: SITE_PRIVACY_URL,
    linkLabel: "Privacy Policy",
    linkTitle: "SpinWheelPlus Privacy Policy",
  },
];

export const RANDOM_NUMBER_SITE_CTA_HREF = SITE_RANDOM_NUMBER_URL;
export const RANDOM_NUMBER_SITE_CTA_LABEL = "Open Random Number on SpinWheelPlus";
export const RANDOM_NUMBER_SITE_CTA_TITLE =
  "Open the Random Number generator on SpinWheelPlus";
export const RANDOM_NUMBER_SITE_CTA_NOTE =
  "Same generator in a full browser tab.";
