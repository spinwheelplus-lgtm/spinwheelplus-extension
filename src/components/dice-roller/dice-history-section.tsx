import { DiceHistoryActions } from "@/components/dice-roller/dice-history-actions";
import { DiceSectionHeading } from "@/components/dice-roller/dice-section-heading";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { formatRollDiceHistoryRelativeTime } from "@/lib/dice-roller/format-roll-dice-history-time";
import { getRollDiceHistoryRowCopy } from "@/lib/dice-roller/roll-dice-history-entry";
import {
  ROLL_A_DICE_HISTORY_ITEM_CLASS,
  ROLL_A_DICE_MUTED_TEXT_CLASS,
  ROLL_A_DICE_RESULT_TOTAL_INLINE_CLASS,
  ROLL_A_DICE_STANDALONE_PANEL_CLASS,
} from "@/lib/dice-roller/roll-a-dice-surface-classes";
import {
  ROLL_DICE_HISTORY_LIMIT,
  type RollDiceHistoryEntry,
} from "@/types/dice-roller";

type DiceHistorySectionProps = {
  history: readonly RollDiceHistoryEntry[];
  historyReady: boolean;
  onClearHistory: () => void;
};

export const DiceHistorySection = ({
  history,
  historyReady,
  onClearHistory,
}: DiceHistorySectionProps) => {
  const diceUi = useMessages().ui.dice;
  return (
  <div className={ROLL_A_DICE_STANDALONE_PANEL_CLASS}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <DiceSectionHeading
          title={
            <>
              {diceUi.resultsTitle}
              {historyReady && history.length > 0 ? (
                <span
                  className={cn("ml-1.5 font-normal", ROLL_A_DICE_MUTED_TEXT_CLASS)}
                >
                  ({history.length})
                </span>
              ) : null}
            </>
          }
          helpLabel={diceUi.resultsTitle}
          helpTitle={diceUi.resultsTitle}
          helpText={fillTemplate(diceUi.historyHelp, { max: ROLL_DICE_HISTORY_LIMIT })}
        />
      </div>
      {historyReady && history.length > 0 ? (
        <DiceHistoryActions history={history} onClear={onClearHistory} />
      ) : null}
    </div>

    {!historyReady ? (
      <p className={cn("mt-4 text-sm", ROLL_A_DICE_MUTED_TEXT_CLASS)} aria-hidden>
        &nbsp;
      </p>
    ) : history.length === 0 ? (
      <p className={cn("mt-4 text-sm", ROLL_A_DICE_MUTED_TEXT_CLASS)}>
        {diceUi.emptyHistory}
      </p>
    ) : (
      <ul
        className="mt-4 max-h-[350px] space-y-2 overflow-y-auto overscroll-contain pr-1"
        aria-label={diceUi.recent}
      >
        {history.map((entry) => {
          const row = getRollDiceHistoryRowCopy(entry);
          return (
            <li key={entry.id} className={ROLL_A_DICE_HISTORY_ITEM_CLASS}>
              <div className="min-w-0">
                <p className="tabular-nums text-foreground">
                  <span className={ROLL_A_DICE_RESULT_TOTAL_INLINE_CLASS}>
                    {row.primary}
                  </span>
                  {row.modifierLabel != null ? (
                    <span className={cn("ml-2 text-xs", ROLL_A_DICE_MUTED_TEXT_CLASS)}>
                      {row.modifierLabel}
                    </span>
                  ) : null}
                  {row.breakdown != null ? (
                    <span className={cn("ml-2 text-xs", ROLL_A_DICE_MUTED_TEXT_CLASS)}>
                      {row.breakdown}
                    </span>
                  ) : null}
                </p>
              </div>
              <span
                className={cn("shrink-0 text-[0.65rem]", ROLL_A_DICE_MUTED_TEXT_CLASS)}
              >
                {formatRollDiceHistoryRelativeTime(entry.rolledAt)}
              </span>
            </li>
          );
        })}
      </ul>
    )}
  </div>
  );
};
