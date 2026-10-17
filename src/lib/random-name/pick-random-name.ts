import { readMessages } from "@/lib/i18n/use-messages";
import { secureRandomInt } from "@/lib/random-number/secure-random-int";

export type PickRandomNameSuccess = {
  ok: true;
  name: string;
  index: number;
  pool: string[];
};

export type PickRandomNameFailure = {
  ok: false;
  error: string;
};

export type PickRandomNameResult = PickRandomNameSuccess | PickRandomNameFailure;

export const pickRandomName = (
  names: readonly string[],
): PickRandomNameResult => {
  if (names.length === 0) {
    return { ok: false, error: readMessages().ui.name.addName };
  }

  const index = secureRandomInt(0, names.length - 1);
  const name = names[index];
  if (name == null) {
    return { ok: false, error: readMessages().ui.name.couldNotPick };
  }

  return { ok: true, name, index, pool: [...names] };
};
