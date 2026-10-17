import { readMessages } from "@/lib/i18n/use-messages";
import type { FlipCoinSideLabels } from "@/lib/coin-flip/flip-coin-face-style";

type CoinFaceWords = {
  faceYes: string;
  faceNo: string;
  faceYesInitial: string;
  faceNoInitial: string;
  faceWin: string;
  faceLose: string;
  faceWinInitial: string;
  faceLoseInitial: string;
  faceOdd: string;
  faceEven: string;
  faceOddInitial: string;
  faceEvenInitial: string;
};

const samePair = (
  heads: string,
  tails: string,
  headsWords: readonly string[],
  tailsWords: readonly string[],
): boolean => headsWords.includes(heads) && tailsWords.includes(tails);

/** Painted pair words follow the active language. Stored English Yes/No still matches. */
export const localizeFlipCoinSideLabels = (
  labels: FlipCoinSideLabels,
  words: CoinFaceWords,
): FlipCoinSideLabels => {
  if (samePair(labels.heads, labels.tails, ["Yes", "Có", "Sí", "Sim", "Ja", "Oui", "はい", "Si", "예", "是"], ["No", "Không", "Não", "Nein", "Nee", "Non", "いいえ", "아니요", "否"])) {
    return {
      heads: words.faceYes,
      tails: words.faceNo,
      headsInitial: words.faceYesInitial,
      tailsInitial: words.faceNoInitial,
    };
  }
  if (samePair(labels.heads, labels.tails, ["Win", "Thắng", "Gana", "Ganha", "Sieg", "Winst", "Gagne", "勝ち", "Vinci", "승", "赢", "贏"], ["Lose", "Thua", "Pierde", "Perde", "Niederlage", "Verlies", "Perd", "負け", "Perdi", "패", "输", "輸"])) {
    return {
      heads: words.faceWin,
      tails: words.faceLose,
      headsInitial: words.faceWinInitial,
      tailsInitial: words.faceLoseInitial,
    };
  }
  if (samePair(labels.heads, labels.tails, ["Odd", "Lẻ", "Impar", "Ímpar", "Ungerade", "Oneven", "Impair", "奇数", "Dispari", "홀", "单", "單"], ["Even", "Chẵn", "Par", "Gerade", "Pair", "偶数", "Pari", "짝", "双", "雙"])) {
    return {
      heads: words.faceOdd,
      tails: words.faceEven,
      headsInitial: words.faceOddInitial,
      tailsInitial: words.faceEvenInitial,
    };
  }
  return labels;
};

export const localizeFlipCoinSideLabelsNow = (
  labels: FlipCoinSideLabels,
): FlipCoinSideLabels =>
  localizeFlipCoinSideLabels(labels, readMessages().ui.coin);
