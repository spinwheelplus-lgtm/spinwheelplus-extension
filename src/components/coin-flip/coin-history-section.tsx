import { CoinHistoryActions } from "@/components/coin-flip/coin-history-actions";
import { CoinSectionHeading } from "@/components/coin-flip/coin-section-heading";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  formatFlipCoinHistoryBreakdown,
  formatFlipCoinHistorySummary,
  speakClassicCoinWords,
} from "@/lib/coin-flip/format-flip-coin-history-entry";
import { formatFlipCoinHistoryRelativeTime } from "@/lib/coin-flip/format-flip-coin-history-time";
import {
  FLIP_A_COIN_HISTORY_ITEM_CLASS,
  FLIP_A_COIN_MUTED_TEXT_CLASS,
  FLIP_A_COIN_RESULT_TOTAL_INLINE_CLASS,
  FLIP_A_COIN_STANDALONE_PANEL_CLASS,
} from "@/lib/coin-flip/flip-a-coin-surface-classes";
import {
  FLIP_COIN_HISTORY_LIMIT,
  type FlipCoinHistoryEntry,
} from "@/types/coin-flip";

type CoinHistorySectionProps = {
  history: readonly FlipCoinHistoryEntry[];
  historyReady: boolean;
  onClearHistory: () => void;
};

export const CoinHistorySection = ({
  history,
  historyReady,
  onClearHistory,
}: CoinHistorySectionProps) => {
  const coinUi = useMessages().ui.coin;
  return (
  <div className={FLIP_A_COIN_STANDALONE_PANEL_CLASS}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <CoinSectionHeading
        title={
          <>
            {coinUi.resultsTitle}
            {historyReady && history.length > 0 ? (
              <span className={cn("ml-1.5 font-normal", FLIP_A_COIN_MUTED_TEXT_CLASS)}>
                ({history.length})
              </span>
            ) : null}
          </>
        }
        helpLabel={coinUi.resultsTitle}
        helpTitle={coinUi.resultsTitle}
        helpText={fillTemplate(coinUi.historyHelp, { max: FLIP_COIN_HISTORY_LIMIT })}
      />
      {historyReady && history.length > 0 ? (
        <CoinHistoryActions history={history} onClear={onClearHistory} />
      ) : null}
    </div>
    {!historyReady ? (
      <p className={cn("mt-4 text-sm", FLIP_A_COIN_MUTED_TEXT_CLASS)} aria-hidden>
        &nbsp;
      </p>
    ) : history.length === 0 ? (
      <p className={cn("mt-4 text-sm", FLIP_A_COIN_MUTED_TEXT_CLASS)}>
        {coinUi.emptyHistory}
      </p>
    ) : (
      <ul
        className="mt-4 max-h-[300px] space-y-2 overflow-y-auto pr-1"
        aria-label={coinUi.recent}
      >
        {history.map((entry) => {
          const breakdown = formatFlipCoinHistoryBreakdown(entry);
          return (
            <li key={entry.id} className={FLIP_A_COIN_HISTORY_ITEM_CLASS}>
              <div className="min-w-0">
                <p className="tabular-nums text-foreground">
                  <span className={FLIP_A_COIN_RESULT_TOTAL_INLINE_CLASS}>
                    {speakClassicCoinWords(
                      formatFlipCoinHistorySummary(entry),
                      coinUi.heads,
                      coinUi.tails,
                    )}
                  </span>
                  {breakdown != null ? (
                    <span className={cn("ml-2 text-xs", FLIP_A_COIN_MUTED_TEXT_CLASS)}>
                      {breakdown}
                    </span>
                  ) : null}
                </p>
              </div>
              <span className={cn("shrink-0 text-[0.65rem]", FLIP_A_COIN_MUTED_TEXT_CLASS)}>
                {formatFlipCoinHistoryRelativeTime(entry.flipped_at)}
              </span>
            </li>
          );
        })}
      </ul>
    )}
  </div>
  );
};
