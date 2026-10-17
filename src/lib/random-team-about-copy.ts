import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_RANDOM_TEAM_URL,
} from "@/lib/constants";

export const RANDOM_TEAM_ABOUT_FEATURES_HEADING =
  "What you can do on this generator";

export const RANDOM_TEAM_ABOUT_FEATURES_LEAD =
  "This side panel splits a roster into teams next to the tab you are on. It does not pick one winner. Paste names, crown captains, generate, then copy or download. History stays on this device.";

export const RANDOM_TEAM_ABOUT_FEATURES: readonly AboutFeatureItem[] = [
  {
    id: "list",
    title: "Names list",
    desc: "Add one name per row. Paste, import a .txt or .csv, or clear. Crown a name to mark a captain. Cap is 300 names.",
  },
  {
    id: "split",
    title: "Count or size",
    desc: "Split by number of teams or by target team size. Keep teams balanced, or allow uneven sizes.",
  },
  {
    id: "captains",
    title: "Captains",
    desc: "Each crowned name lands first on a different random team. Everyone else fills in around them.",
  },
  {
    id: "adjust",
    title: "Adjust after generate",
    desc: "Drag a name onto another team, or pick a team from the row menu. Rename a squad, then Copy All.",
  },
  {
    id: "sound",
    title: "Reveal sound",
    desc: "Optional short tone when a new split appears. Restore from history stays quiet.",
  },
  {
    id: "fairness",
    title: "Fair random split",
    desc: "Fisher-Yates with crypto.getRandomValues() in this browser. Chance fairness, not skill balance.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
];

export const RANDOM_TEAM_ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    question: "Is the team generator free?",
    answer: "Yes. Split as often as you need. No account is required.",
  },
  {
    question: "Are teams assigned fairly?",
    answer:
      "Names are shuffled with Fisher-Yates and crypto.getRandomValues() in this browser. Keep teams balanced keeps sizes within one person when the numbers allow it. That is chance fairness, not skill balance.",
    href: SITE_FAIRNESS_AUDIT_URL,
    linkLabel: "fairness audit",
    linkTitle: "Run the SpinWheelPlus fairness audit",
  },
  {
    question: "How many teams can I create?",
    answer:
      "As many as you have members. Pick Number of Teams or a target Team Size. With captains on, you need at least one team per captain.",
  },
  {
    question: "Can I assign team captains?",
    answer:
      "Yes. Crown a name, turn on Use team captains, and each captain lands first on a separate random team.",
  },
  {
    question: "Can I adjust teams after generating?",
    answer:
      "Yes. Drag a name onto another team, or choose a team in the row menu. Rename a squad, then Copy All.",
  },
  {
    question: "Can I regenerate teams?",
    answer:
      "Tap Regenerate for a new split. Older mixes stay in Recent Generations if you want to Restore one.",
  },
  {
    question: "Does this pick one winner?",
    answer:
      "No. You get groups. Use Random Name Picker for one name, or Shuffle List for a new order without teams.",
  },
  {
    question: "Is my list and history private?",
    answer:
      "Yes here. Names, teams, and history stay in this browser's extension storage. See the Privacy Policy for the website.",
    href: SITE_PRIVACY_URL,
    linkLabel: "Privacy Policy",
    linkTitle: "SpinWheelPlus Privacy Policy",
  },
];

export const RANDOM_TEAM_SITE_CTA_HREF = SITE_RANDOM_TEAM_URL;
export const RANDOM_TEAM_SITE_CTA_LABEL =
  "Open Random Team Generator on SpinWheelPlus";
export const RANDOM_TEAM_SITE_CTA_TITLE =
  "Open Random Team Generator on SpinWheelPlus";
export const RANDOM_TEAM_SITE_CTA_NOTE =
  "Same generator in a full browser tab.";
