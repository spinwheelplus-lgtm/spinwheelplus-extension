import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import {
  SITE_DICE_ROLLER_URL,
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

export const DICE_ROLLER_ABOUT_FEATURES_HEADING =
  "What you can do on this roller";

export const DICE_ROLLER_ABOUT_FEATURES_LEAD =
  "This side panel rolls polyhedral dice next to the tab you are on. Mix D4 through D20, add a +/- modifier, then copy or download history. Rolls stay on this device. Open the same tool on SpinWheelPlus when you want a larger screen.";

export const DICE_ROLLER_ABOUT_FEATURES: readonly AboutFeatureItem[] = [
  {
    id: "table",
    title: "3D dice table",
    desc: "Add up to 25 dice (D4, D6, D8, D10, D12, D20). Tap Roll or press Space. The table uses crypto.getRandomValues() for each face.",
  },
  {
    id: "modifier",
    title: "Roll modifier",
    desc: "Add a bonus or penalty from -99 to +99. It applies to the total, not to how each die lands. Handy for RPG checks like 2d6+3.",
  },
  {
    id: "setup",
    title: "Colors and setup files",
    desc: "Edit a die for face and mark colors, D6 numbers, dots, or six face words. A blank word face shows its number. Export or import a JSON setup. There is no share link in the extension.",
  },
  {
    id: "click",
    title: "Click on dice",
    desc: "Roll all dice on a tap (default), or roll one die at a time from the gear menu.",
  },
  {
    id: "history",
    title: "History on this device",
    desc: "Recent rolls stay in this browser (up to 200). Download a .txt file or clear the list when you start a new session.",
  },
  {
    id: "fairness-audit",
    title: "Fairness you can test",
    desc: "Each face uses crypto.getRandomValues() in this browser. The fairness audit on the site publishes sample runs you can read.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
];

export const DICE_ROLLER_ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    question: "Is the dice roller free?",
    answer:
      "Yes. The extension and the site tool are free for normal use. No account is required to roll.",
  },
  {
    question: "Are dice rolls random?",
    answer:
      "Yes. Each roll draws random bytes from crypto.getRandomValues() in this browser, so every face keeps equal odds.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
  {
    question: "Can I roll more than one die?",
    answer:
      "Yes. Add up to 25 dice on the table (D4 through D20) and roll them together. With three or more dice, the button reads Roll all.",
  },
  {
    question: "Can I re-roll just one die?",
    answer:
      "Yes. In Dice table options, set Click on dice to Roll one die, then tap a single die. The default is Roll all dice.",
  },
  {
    question: "Can I add a modifier like 2d6+3?",
    answer:
      "Yes. Set a +/- modifier from the Add dice row (-99 to +99). It applies to numbered faces. A roll that lands only on words skips the modifier.",
  },
  {
    question: "Can I put words on a D6?",
    answer:
      "Yes. Edit a D6 and choose Words. Type a label for each face, or use Number or Yes / No. A blank face still shows its number and counts in the total.",
  },
  {
    question: "Can I copy or export my rolls?",
    answer:
      "Yes. Copy the latest total from the table, download roll history as .txt, or export/import your dice setup as JSON from Setup.",
  },
  {
    question: "Do you have a D100 die?",
    answer:
      "There is no separate D100 die type. Use D10 for percentile-style play, or combine dice types on one table (for example 2d10) and read the total yourself.",
  },
  {
    question: "Is my roll history private?",
    answer:
      "Yes here. History stays in this browser's extension storage. See the Privacy Policy for how SpinWheelPlus handles data on the website.",
    href: SITE_PRIVACY_URL,
    linkLabel: "Privacy Policy",
    linkTitle: "SpinWheelPlus Privacy Policy",
  },
];

export const DICE_ROLLER_SITE_CTA_HREF = SITE_DICE_ROLLER_URL;
export const DICE_ROLLER_SITE_CTA_LABEL = "Open Dice Roller on SpinWheelPlus";
export const DICE_ROLLER_SITE_CTA_TITLE =
  "Open the Dice Roller on SpinWheelPlus";
export const DICE_ROLLER_SITE_CTA_NOTE =
  "Same 3D table in a full browser tab.";
