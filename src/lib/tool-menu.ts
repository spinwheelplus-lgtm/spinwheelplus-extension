import {
  Binary,
  Coins,
  Dice5,
  Disc3,
  Hash,
  Shuffle,
  Users,
  UserSearch,
  type LucideIcon,
} from "lucide-react";

export const APP_HOME_PATH = "/";
export const APP_HOME_VIEW = "wheel" as const;

export type AppView = typeof APP_HOME_VIEW | ToolMenuId;

export type ToolMenuId =
  | "wheel"
  | "random-number"
  | "random-name"
  | "dice-roller"
  | "coin-flip"
  | "yes-or-no"
  | "shuffle-list"
  | "random-team";

export type ToolMenuItem = {
  id: ToolMenuId;
  label: string;
  path: string;
  icon: LucideIcon;
};

/** First item is home (`/`). Random Number through Team Generator are live. */
export const TOOL_MENU_ITEMS: readonly ToolMenuItem[] = [
  { id: "wheel", label: "Spin the wheel", path: APP_HOME_PATH, icon: Disc3 },
  {
    id: "random-number",
    label: "Random Number",
    path: "/random-number",
    icon: Hash,
  },
  {
    id: "random-name",
    label: "Random Name Picker",
    path: "/random-name",
    icon: UserSearch,
  },
  {
    id: "dice-roller",
    label: "Dice Roller",
    path: "/dice-roller",
    icon: Dice5,
  },
  { id: "coin-flip", label: "Coin Flip", path: "/coin-flip", icon: Coins },
  { id: "yes-or-no", label: "Yes or No", path: "/yes-or-no", icon: Binary },
  {
    id: "shuffle-list",
    label: "Shuffle List",
    path: "/shuffle-list",
    icon: Shuffle,
  },
  {
    id: "random-team",
    label: "Team Generator",
    path: "/random-team",
    icon: Users,
  },
] as const;
