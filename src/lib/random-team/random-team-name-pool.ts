import { shuffleNames } from "@/lib/random-name/shuffle-names";

const TEAM_NAME_POOL = [
  "Red Dragons",
  "Blue Sharks",
  "Green Tigers",
  "Purple Eagles",
  "Orange Lions",
  "Silver Wolves",
  "Golden Hawks",
  "Crimson Bears",
  "Neon Foxes",
  "Storm Riders",
  "Thunder Squad",
  "Pixel Pirates",
  "Cosmic Comets",
  "Solar Flares",
  "Midnight Owls",
] as const;

export const pickRandomTeamNames = (count: number): string[] => {
  if (count <= 0) return [];
  const shuffled = shuffleNames([...TEAM_NAME_POOL]);
  return shuffled.slice(0, count);
};
