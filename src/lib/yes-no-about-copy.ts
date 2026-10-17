import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_YES_NO_URL,
} from "@/lib/constants";

export const YES_NO_ABOUT_FEATURES_HEADING =
  "What you can do on this Yes or No";

export const YES_NO_ABOUT_FEATURES_LEAD =
  "This side panel picks Yes, No, Maybe, True, False, or answers you typed. Ask again with Space or Enter. History stays on this device. Open the same tool on SpinWheelPlus when you want a larger screen.";

export const YES_NO_ABOUT_FEATURES: readonly AboutFeatureItem[] = [
  {
    id: "modes",
    title: "Four answer modes",
    desc: "Yes or No (50/50), Yes / No / Maybe, True / False, or Custom Answers with one option per line. Each option in the pool has equal odds.",
  },
  {
    id: "ask",
    title: "Ask Again",
    desc: "Tap Ask Again or press Space. RNG is crypto.getRandomValues().",
  },
  {
    id: "motion",
    title: "Animation and sound",
    desc: "Answer Picker, Flip, Fade, or Typewriter. Sound is optional. The answer is chosen before the animation plays.",
  },
  {
    id: "history",
    title: "History on this device",
    desc: "Recent answers stay in this browser (up to 200). Download a .txt file or clear the list.",
  },
  {
    id: "fairness-audit",
    title: "Fairness you can test",
    desc: "Each ask uses crypto.getRandomValues() in this browser. The fairness audit on the site publishes sample runs you can read.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
];

export const YES_NO_ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    question: "Is the yes or no generator free?",
    answer:
      "Yes. The extension and the site tool are free for normal use. No account is required to ask.",
  },
  {
    question: "Are Yes and No 50/50?",
    answer:
      "In Yes or No mode, yes. Each ask draws from crypto.getRandomValues() in this browser. Maybe mode is three equal paths. Custom mode splits evenly across the lines you typed.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
  {
    question: "Can I use Maybe or my own answers?",
    answer:
      "Yes. Switch Answer Mode to Yes / No / Maybe, True / False, or Custom Answers.",
  },
  {
    question: "Do animations or sound rig the result?",
    answer:
      "No. The pick happens first. Animation and sound only present it.",
  },
  {
    question: "Can I see past answers?",
    answer:
      "Yes. Recent answers stay on this device (up to 200), with Download .txt if you want a file.",
  },
  {
    question: "Should I use this for big life decisions?",
    answer:
      "No. Use your own judgment for anything that actually matters. This tool is for stuck loops and low-stakes picks.",
  },
  {
    question: "What if I want Heads or Tails instead?",
    answer:
      "Use Coin Flip in this panel. For numbers, try Dice Roller or Random Number.",
  },
  {
    question: "Is my answer history private?",
    answer:
      "Yes here. History stays in this browser's extension storage. See the Privacy Policy for how SpinWheelPlus handles data on the website.",
    href: SITE_PRIVACY_URL,
    linkLabel: "Privacy Policy",
    linkTitle: "SpinWheelPlus Privacy Policy",
  },
];

export const YES_NO_SITE_CTA_HREF = SITE_YES_NO_URL;
export const YES_NO_SITE_CTA_LABEL = "Open Yes or No on SpinWheelPlus";
export const YES_NO_SITE_CTA_TITLE = "Open the Yes or No tool on SpinWheelPlus";
export const YES_NO_SITE_CTA_NOTE = "Same generator in a full browser tab.";
