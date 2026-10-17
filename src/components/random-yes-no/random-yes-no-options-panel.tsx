import { Settings2 } from "lucide-react";
import { useState } from "react";

import { YesNoFileMenu } from "@/components/random-yes-no/yes-no-file-menu";
import { RandomYesNoCustomAnswersDialog } from "@/components/random-yes-no/random-yes-no-custom-answers-dialog";
import { HelpTip } from "@/components/ui/help-tip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  RANDOM_YES_NO_ANIMATION_OPTIONS,
  RANDOM_YES_NO_ANSWER_MODE_OPTIONS,
  randomYesNoAnimationPillClass,
  randomYesNoModePillClass,
} from "@/lib/random-yes-no/random-yes-no-options-config";
import { useRandomYesNoStore } from "@/store/random-yes-no-store";
import type { RandomYesNoAnswerMode } from "@/types/random-yes-no";

const OPTION_PILL_CLASS =
  "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60";

type RandomYesNoOptionsPanelProps = {
  disabled?: boolean;
};

export const RandomYesNoOptionsPanel = ({
  disabled = false,
}: RandomYesNoOptionsPanelProps) => {
  const yesNoUi = useMessages().ui.yesNo;
  const modeLabel: Record<string, string> = {
    yes_no: yesNoUi.modeYesNo,
    yes_no_maybe: yesNoUi.modeMaybe,
    true_false: yesNoUi.modeTrueFalse,
    custom: yesNoUi.modeCustom,
  };
  const animLabel: Record<string, string> = {
    picker: yesNoUi.animPicker,
    flip: yesNoUi.animFlip,
    fade: yesNoUi.animFade,
    typewriter: yesNoUi.animTypewriter,
  };
  const answerMode = useRandomYesNoStore(
    (state) => state.random_yes_no_answer_mode,
  );
  const animationType = useRandomYesNoStore(
    (state) => state.random_yes_no_animation_type,
  );
  const soundEnabled = useRandomYesNoStore(
    (state) => state.random_yes_no_sound_enabled,
  );
  const customAnswersText = useRandomYesNoStore(
    (state) => state.random_yes_no_custom_answers_text,
  );
  const setAnswerMode = useRandomYesNoStore(
    (state) => state.setRandomYesNoAnswerMode,
  );
  const setAnimationType = useRandomYesNoStore(
    (state) => state.setRandomYesNoAnimationType,
  );
  const setSoundEnabled = useRandomYesNoStore(
    (state) => state.setRandomYesNoSoundEnabled,
  );
  const setCustomAnswersText = useRandomYesNoStore(
    (state) => state.setRandomYesNoCustomAnswersText,
  );

  const [customDialogOpen, setCustomDialogOpen] = useState(false);

  const handleAnswerModeSelect = (mode: RandomYesNoAnswerMode): void => {
    if (disabled) return;
    setAnswerMode(mode);
    if (mode === "custom") {
      setCustomDialogOpen(true);
    }
  };

  return (
    <>
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
            <h2 className="text-base font-semibold">{yesNoUi.options}</h2>
            <p className="text-sm text-muted-foreground">{yesNoUi.lead}</p>
          </div>
          <YesNoFileMenu disabled={disabled} />
        </div>

        <fieldset
          disabled={disabled}
          className="m-0 flex min-w-0 flex-1 flex-col gap-4 border-0 p-0"
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {yesNoUi.answerMode}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {RANDOM_YES_NO_ANSWER_MODE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const selected = answerMode === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected}
                    onClick={() => handleAnswerModeSelect(option.id)}
                    className={cn(
                      OPTION_PILL_CLASS,
                      randomYesNoModePillClass(selected),
                    )}
                  >
                    <Icon
                      className={cn("size-4", option.iconClass)}
                      aria-hidden
                    />
                    {modeLabel[option.id] ?? option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {yesNoUi.animation}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {RANDOM_YES_NO_ANIMATION_OPTIONS.map((option) => {
                const Icon = option.icon;
                const selected = animationType === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected}
                    onClick={() => setAnimationType(option.id)}
                    className={cn(
                      OPTION_PILL_CLASS,
                      randomYesNoAnimationPillClass(selected),
                    )}
                  >
                    <Icon
                      className="size-4 text-violet-600 dark:text-violet-400"
                      aria-hidden
                    />
                    {animLabel[option.id] ?? option.label}
                    {option.recommended ? <span aria-hidden>*</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
            <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
              {yesNoUi.revealSound}
              <HelpTip
                helpLabel={yesNoUi.revealSound}
                helpTitle={yesNoUi.revealSound}
                helpText={yesNoUi.soundHelp}
              />
            </p>
            <Switch
              id="random-yes-no-sound"
              checked={soundEnabled}
              disabled={disabled}
              onCheckedChange={setSoundEnabled}
              aria-label={yesNoUi.soundAria}
            />
          </div>
        </fieldset>
      </div>

      {customDialogOpen ? (
        <RandomYesNoCustomAnswersDialog
          open={customDialogOpen}
          onOpenChange={setCustomDialogOpen}
          value={customAnswersText}
          onSave={setCustomAnswersText}
        />
      ) : null}
    </>
  );
};
