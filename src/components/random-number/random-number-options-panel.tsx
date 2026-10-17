import { Settings2 } from "lucide-react";

import { RandomNumberFileMenu } from "@/components/random-number/random-number-file-menu";
import { Button } from "@/components/ui/button";
import { HelpTip } from "@/components/ui/help-tip";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  RANDOM_NUMBER_BOUND_MAX,
  RANDOM_NUMBER_BOUND_MIN,
  parseRandomNumberBoundInput,
} from "@/lib/random-number/clamp-random-number-bound";
import {
  parseRandomNumberCustomCountInput,
  RANDOM_NUMBER_CUSTOM_COUNT_MAX,
  RANDOM_NUMBER_CUSTOM_COUNT_MIN,
} from "@/lib/random-number/parse-random-number-custom-count";
import {
  getRandomNumberResolvedCount,
  useRandomNumberStore,
} from "@/store/random-number-store";
import { RANDOM_NUMBER_COUNT_PRESETS } from "@/types/random-number";

export const RandomNumberOptionsPanel = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const messages = useMessages();
  const numberUi = messages.ui.number;
  const min = useRandomNumberStore((state) => state.random_number_min);
  const max = useRandomNumberStore((state) => state.random_number_max);
  const excludeInput = useRandomNumberStore(
    (state) => state.random_number_exclude_input,
  );
  const countMode = useRandomNumberStore(
    (state) => state.random_number_count_mode,
  );
  const customCount = useRandomNumberStore(
    (state) => state.random_number_custom_count,
  );
  const allowDuplicates = useRandomNumberStore(
    (state) => state.random_number_allow_duplicates,
  );
  const rollAnimation = useRandomNumberStore(
    (state) => state.random_number_roll_animation,
  );
  const soundEnabled = useRandomNumberStore(
    (state) => state.random_number_sound_enabled,
  );
  const setMin = useRandomNumberStore((state) => state.setRandomNumberMin);
  const setMax = useRandomNumberStore((state) => state.setRandomNumberMax);
  const setExcludeInput = useRandomNumberStore(
    (state) => state.setRandomNumberExcludeInput,
  );
  const setCountMode = useRandomNumberStore(
    (state) => state.setRandomNumberCountMode,
  );
  const setCustomCount = useRandomNumberStore(
    (state) => state.setRandomNumberCustomCount,
  );
  const setAllowDuplicates = useRandomNumberStore(
    (state) => state.setRandomNumberAllowDuplicates,
  );
  const setRollAnimation = useRandomNumberStore(
    (state) => state.setRandomNumberRollAnimation,
  );
  const setSoundEnabled = useRandomNumberStore(
    (state) => state.setRandomNumberSoundEnabled,
  );

  const resolvedCount = getRandomNumberResolvedCount({
    random_number_count_mode: countMode,
    random_number_custom_count: customCount,
  });

  const rangeInverted = min > max;

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl bg-card p-4 shadow-sm ring-1 ring-border",
        disabled && "opacity-80",
      )}
      aria-busy={disabled}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Settings2 className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">{messages.ui.common.options}</h2>
          <p className="text-sm text-muted-foreground">{numberUi.optionsLead}</p>
        </div>
        <RandomNumberFileMenu disabled={disabled} />
      </div>

      <fieldset
        disabled={disabled}
        className="m-0 flex min-w-0 flex-1 flex-col gap-5 border-0 p-0"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="random-number-min" className="text-sm font-medium">
              {numberUi.min}
            </label>
            <Input
              id="random-number-min"
              type="number"
              inputMode="numeric"
              min={RANDOM_NUMBER_BOUND_MIN}
              max={RANDOM_NUMBER_BOUND_MAX}
              value={min}
              className="text-base"
              onChange={(event) => {
                const next = parseRandomNumberBoundInput(event.target.value);
                if (next != null) setMin(next);
              }}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="random-number-max" className="text-sm font-medium">
              {numberUi.max}
            </label>
            <Input
              id="random-number-max"
              type="number"
              inputMode="numeric"
              min={RANDOM_NUMBER_BOUND_MIN}
              max={RANDOM_NUMBER_BOUND_MAX}
              value={max}
              className="text-base"
              onChange={(event) => {
                const next = parseRandomNumberBoundInput(event.target.value);
                if (next != null) setMax(next);
              }}
            />
          </div>
        </div>

        {rangeInverted ? (
          <p className="text-xs text-amber-700 dark:text-amber-400" role="status">
            {numberUi.rangeInverted}
          </p>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="random-number-exclude" className="text-sm font-medium">
            {numberUi.exclude}
          </label>
          <Input
            id="random-number-exclude"
            type="text"
            placeholder={numberUi.excludePlaceholder}
            value={excludeInput}
            className="text-base"
            onChange={(event) => setExcludeInput(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{numberUi.howMany}</p>
          <div className="flex flex-wrap gap-2">
            {RANDOM_NUMBER_COUNT_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                size="sm"
                variant={countMode === preset ? "default" : "outline"}
                className={cn(
                  "min-w-10 rounded-full px-3",
                  countMode === preset && "shadow-sm",
                )}
                onClick={() => setCountMode(preset)}
                aria-pressed={countMode === preset}
              >
                {preset}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              variant={countMode === "custom" ? "default" : "outline"}
              className={cn(
                "rounded-full px-3",
                countMode === "custom" && "shadow-sm",
              )}
              onClick={() => setCountMode("custom")}
              aria-pressed={countMode === "custom"}
            >
              {numberUi.custom}
            </Button>
          </div>
          {countMode === "custom" ? (
            <Input
              id="random-number-custom-count"
              type="number"
              inputMode="numeric"
              min={RANDOM_NUMBER_CUSTOM_COUNT_MIN}
              max={RANDOM_NUMBER_CUSTOM_COUNT_MAX}
              value={customCount}
              className="text-base"
              onChange={(event) => {
                const next = parseRandomNumberCustomCountInput(
                  event.target.value,
                );
                if (next != null) setCustomCount(next);
              }}
              aria-label={numberUi.customCount}
            />
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
          <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
            {numberUi.repeat}
            <HelpTip
              helpLabel={numberUi.repeat}
              helpTitle={numberUi.repeat}
              helpText={numberUi.repeatHelp}
            />
          </p>
          <Switch
            id="random-number-duplicates"
            checked={allowDuplicates}
            onCheckedChange={setAllowDuplicates}
            aria-label={numberUi.repeatAria}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
          <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
            {numberUi.roll}
            <HelpTip
              helpLabel={numberUi.roll}
              helpTitle={numberUi.roll}
              helpText={numberUi.rollHelp}
            />
          </p>
          <Switch
            id="random-number-roll-animation"
            checked={rollAnimation}
            onCheckedChange={setRollAnimation}
            aria-label={numberUi.rollAria}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
          <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
            {numberUi.revealSound}
            <HelpTip
              helpLabel={numberUi.revealSound}
              helpTitle={numberUi.revealSound}
              helpText={numberUi.soundHelp}
            />
          </p>
          <Switch
            id="random-number-sound"
            checked={soundEnabled}
            disabled={disabled}
            onCheckedChange={setSoundEnabled}
            aria-label={numberUi.soundAria}
          />
        </div>
      </fieldset>

      <p className="sr-only" aria-live="polite">
        {disabled
          ? numberUi.locked
          : fillTemplate(numberUi.selected, { count: resolvedCount })}
      </p>
    </div>
  );
};
