import { List, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { parseCustomAnswers } from "@/lib/random-yes-no/parse-custom-answers";
import { SPIN_HISTORY_DIALOG_HEADER_BACKGROUND } from "@/lib/spin-history";
import {
  RANDOM_YES_NO_DEFAULT_CUSTOM_ANSWERS_TEXT,
  RANDOM_YES_NO_MIN_CUSTOM_ANSWERS,
} from "@/types/random-yes-no";

type RandomYesNoCustomAnswersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSave: (value: string) => void;
};

const CLOSE_MS = 200;

export const RandomYesNoCustomAnswersDialog = ({
  open,
  onOpenChange,
  value,
  onSave,
}: RandomYesNoCustomAnswersDialogProps) => {
  const [draft, setDraft] = useState(value);
  const [leaving, setLeaving] = useState(false);
  const { common, yesNo: yesNoUi } = useMessages().ui;
  const closeTimer = useRef(0);

  useEffect(() => {
    if (open) {
      setDraft(value);
      setLeaving(false);
    }
  }, [open, value]);

  useEffect(
    () => () => window.clearTimeout(closeTimer.current),
    [],
  );

  const requestClose = () => {
    if (!open || leaving) return;
    setLeaving(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => onOpenChange(false), CLOSE_MS);
  };

  const answerCount = parseCustomAnswers(draft).length;
  const canSave = answerCount >= RANDOM_YES_NO_MIN_CUSTOM_ANSWERS;

  return (
    <Drawer.Root
      open={open}
      dismissible
      shouldScaleBackground={false}
      onOpenChange={(next) => {
        if (next) onOpenChange(true);
        else requestClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/45 transition-opacity duration-200",
            leaving && "opacity-0",
          )}
          onClick={requestClose}
        />
        <Drawer.Content
          className={cn(
            "fixed z-50 flex items-center justify-center bg-transparent p-0 shadow-none outline-none after:hidden",
            "!inset-0 !top-0 !right-0 !bottom-0 !left-0 !mt-0 !h-full !max-h-none !w-full !max-w-none",
            "!translate-x-0 !translate-y-0",
          )}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) requestClose();
          }}
        >
          <div
            className={cn(
              "pointer-events-auto flex max-h-[90%] w-[min(90%,28rem)] flex-col overflow-hidden rounded-2xl bg-card shadow-xl",
              "transition-transform duration-200 ease-in",
              leaving ? "translate-y-[120%]" : "translate-y-0",
            )}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div
              className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 py-3"
              style={{ background: SPIN_HISTORY_DIALOG_HEADER_BACKGROUND }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <List className="size-5 shrink-0 text-primary" aria-hidden />
                <Drawer.Title className="text-base font-semibold">
                  {yesNoUi.modeCustom}
                </Drawer.Title>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={yesNoUi.closeCustom}
                onClick={requestClose}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
            <Drawer.Description className="sr-only">
              {fillTemplate(yesNoUi.minAnswers, {
                count: RANDOM_YES_NO_MIN_CUSTOM_ANSWERS,
              })}
            </Drawer.Description>
            <div className="space-y-2 px-4 py-4">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={8}
                spellCheck={false}
                aria-label={yesNoUi.customOptions}
                className="min-h-44 w-full resize-y rounded-xl border border-border/80 bg-background/55 px-3 py-2 text-sm leading-relaxed outline-none ring-1 ring-foreground/12 focus-visible:ring-2 focus-visible:ring-ring dark:bg-background/20"
                placeholder={RANDOM_YES_NO_DEFAULT_CUSTOM_ANSWERS_TEXT}
              />
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>
                  {fillTemplate(yesNoUi.minAnswers, {
                    count: RANDOM_YES_NO_MIN_CUSTOM_ANSWERS,
                  })}
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    canSave && "text-foreground",
                  )}
                >
                  {fillTemplate(yesNoUi.answerCount, { count: answerCount })}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border/60 bg-muted/20 px-4 py-3.5">
              <Button
                type="button"
                variant="outline"
                className="min-w-28 rounded-xl"
                onClick={requestClose}
              >
                {common.cancel}
              </Button>
              <Button
                type="button"
                disabled={!canSave}
                className="min-w-28 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:bg-violet-600/45 disabled:text-white disabled:opacity-100"
                onClick={() => {
                  onSave(draft);
                  requestClose();
                }}
              >
                {common.save}
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
