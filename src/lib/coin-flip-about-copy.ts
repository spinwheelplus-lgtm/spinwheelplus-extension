import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import {
  SITE_COIN_FLIP_URL,
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

export const COIN_FLIP_ABOUT_FEATURES_HEADING =
  "What you can do on this coin flip";

export const COIN_FLIP_ABOUT_FEATURES_LEAD =
  "This side panel tosses Heads or Tails next to the tab you are on. Mix gold, silver, and copper coins, flip one or flip all, then copy or download history. Flips stay on this device. Open the same tool on SpinWheelPlus when you want a larger screen.";

export const COIN_FLIP_ABOUT_FEATURES: readonly AboutFeatureItem[] = [
  {
    id: "table",
    title: "3D coin table",
    desc: "Add up to 25 coins. Tap Flip or press Space. Each toss uses crypto.getRandomValues() so Heads and Tails stay 50/50.",
  },
  {
    id: "metals",
    title: "Gold, silver, copper",
    desc: "Pick a metal when you add a coin, or switch the whole table to Yes / No, Win / Lose, or Odd / Even. Setup exports JSON. There is no share link in the extension.",
  },
  {
    id: "click",
    title: "Click on coin",
    desc: "Flip all coins on a tap (default), or flip one coin at a time from the gear menu.",
  },
  {
    id: "history",
    title: "History on this device",
    desc: "Recent flips stay in this browser (up to 200). Download a .txt file or clear the list when you start a new session.",
  },
  {
    id: "fairness-audit",
    title: "Fairness you can test",
    desc: "Each flip uses crypto.getRandomValues() in this browser. The fairness audit on the site publishes sample runs you can read.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
];

export const COIN_FLIP_ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    question: "Is the coin flip free?",
    answer:
      "Yes. The extension and the site tool are free for normal use. No account is required to flip.",
  },
  {
    question: "Is Heads or Tails truly 50/50?",
    answer:
      "Yes for games, class demos, and everyday calls. Each flip draws random bytes from crypto.getRandomValues() in this browser. It is not a certified casino or lottery RNG.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
  {
    question: "Can I put words on the coins?",
    answer:
      "Yes. Under Faces, choose Yes / No, Win / Lose, or Odd / Even. That pair applies to every coin. Classic keeps gold, silver, and copper.",
  },
  {
    question: "Can I flip more than one coin?",
    answer:
      "Yes. Add up to 25 coins (gold, silver, or copper) and flip them together. With two or more coins, the button reads Flip all.",
  },
  {
    question: "Can I re-flip just one coin?",
    answer:
      "Yes. In Coin table options, set Click on coin to Flip one coin, then tap a single coin. The default is Flip all coins.",
  },
  {
    question: "Can I copy or export my flips?",
    answer:
      "Yes. Copy the latest result from the table, download flip history as .txt, or export/import your coin setup as JSON from Setup.",
  },
  {
    question: "Is my flip history private?",
    answer:
      "Yes here. History stays in this browser's extension storage. See the Privacy Policy for how SpinWheelPlus handles data on the website.",
    href: SITE_PRIVACY_URL,
    linkLabel: "Privacy Policy",
    linkTitle: "SpinWheelPlus Privacy Policy",
  },
];

export const COIN_FLIP_SITE_CTA_HREF = SITE_COIN_FLIP_URL;
export const COIN_FLIP_SITE_CTA_LABEL = "Open Coin Flip on SpinWheelPlus";
export const COIN_FLIP_SITE_CTA_TITLE = "Open the Coin Flip on SpinWheelPlus";
export const COIN_FLIP_SITE_CTA_NOTE = "Same 3D table in a full browser tab.";
