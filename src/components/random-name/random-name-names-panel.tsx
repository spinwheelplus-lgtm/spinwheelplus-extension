import { ClipboardPaste, List, Settings2, Shuffle, Trash2, Upload } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { toast } from "sonner";

import { RandomNameFileMenu } from "@/components/random-name/random-name-file-menu";
import { Button } from "@/components/ui/button";
import { HelpTip } from "@/components/ui/help-tip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  getRandomNameCount,
  getRandomNameLineCount,
  useRandomNameStore,
} from "@/store/random-name-store";

export const RandomNameNamesPanel = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const messages = useMessages();
  const nameUi = messages.ui.name;
  const common = messages.ui.common;
  const listInput = useRandomNameStore((state) => state.random_name_list_input);
  const removeWinner = useRandomNameStore(
    (state) => state.random_name_remove_winner,
  );
  const deduplicateNames = useRandomNameStore(
    (state) => state.random_name_deduplicate_names,
  );
  const rollAnimation = useRandomNameStore(
    (state) => state.random_name_roll_animation,
  );
  const soundEnabled = useRandomNameStore(
    (state) => state.random_name_sound_enabled,
  );
  const setListInput = useRandomNameStore(
    (state) => state.setRandomNameListInput,
  );
  const setRemoveWinner = useRandomNameStore(
    (state) => state.setRandomNameRemoveWinner,
  );
  const setDeduplicateNames = useRandomNameStore(
    (state) => state.setRandomNameDeduplicateNames,
  );
  const setRollAnimation = useRandomNameStore(
    (state) => state.setRandomNameRollAnimation,
  );
  const setSoundEnabled = useRandomNameStore(
    (state) => state.setRandomNameSoundEnabled,
  );
  const shuffleList = useRandomNameStore(
    (state) => state.shuffleRandomNameList,
  );
  const clearList = useRandomNameStore((state) => state.clearRandomNameList);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameCount = getRandomNameCount(listInput, deduplicateNames);
  const lineCount = getRandomNameLineCount(listInput);
  const duplicateLineCount = deduplicateNames
    ? Math.max(0, lineCount - nameCount)
    : 0;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        toast.error(common.clipboardEmpty);
        return;
      }
      setListInput(
        listInput.trim()
          ? `${listInput.trimEnd()}\n${text.trim()}`
          : text.trim(),
      );
      toast.success(nameUi.namesPasted);
    } catch {
      toast.error(common.couldNotReadClipboard);
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      setListInput(text.trim());
      toast.success(nameUi.namesImported);
    } catch {
      toast.error(common.couldNotReadThatFile);
    }
  };

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
          <List className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">{nameUi.heading}</h2>
          <p className="text-sm text-muted-foreground">{nameUi.perLine}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <RandomNameFileMenu disabled={disabled} />
          <div className="text-right">
            <p className="font-medium whitespace-nowrap text-muted-foreground">
              {fillTemplate(nameUi.countLine, { count: nameCount })}
            </p>
            {duplicateLineCount > 0 ? (
              <p className="text-xs text-muted-foreground">
                {fillTemplate(nameUi.duplicatesSkipped, { count: duplicateLineCount })}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <fieldset
        disabled={disabled}
        className="m-0 flex min-w-0 flex-1 flex-col gap-4 border-0 p-0"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <label htmlFor="random-name-list" className="sr-only">
            Names list
          </label>
          <textarea
            id="random-name-list"
            value={listInput}
            onChange={(event) => setListInput(event.target.value)}
            placeholder={nameUi.placeholder}
            spellCheck={false}
            className="min-h-48 w-full min-w-0 flex-1 resize-y rounded-xl border border-border bg-background px-3 py-2 font-sans text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handlePaste()}
          >
            <ClipboardPaste className="size-4" aria-hidden />
            {common.paste}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-4" aria-hidden />
            {common.import}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            className="sr-only"
            aria-hidden
            onChange={(event) => void handleImportFile(event)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={shuffleList}
            disabled={lineCount < 2}
          >
            <Shuffle className="size-4" aria-hidden />
            {common.shuffle}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={clearList}
            disabled={lineCount === 0 && !listInput.trim()}
          >
            <Trash2 className="size-4" aria-hidden />
            {common.clear}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Settings2 className="size-4 text-primary" aria-hidden />
            {common.options}
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
            <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
              {nameUi.skipDuplicates}
              <HelpTip
                helpLabel={nameUi.skipDuplicates}
                helpTitle={nameUi.skipDuplicates}
                helpText={nameUi.skipHelp}
              />
            </p>
            <Switch
              id="random-name-deduplicate"
              checked={deduplicateNames}
              onCheckedChange={setDeduplicateNames}
              aria-label={nameUi.skipAria}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
            <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
              {nameUi.removeWinner}
              <HelpTip
                helpLabel={nameUi.removeWinner}
                helpTitle={nameUi.removeWinner}
                helpText={nameUi.removeHelp}
              />
            </p>
            <Switch
              id="random-name-remove-winner"
              checked={removeWinner}
              onCheckedChange={setRemoveWinner}
              aria-label={nameUi.removeAria}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
            <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
              {nameUi.roll}
              <HelpTip
                helpLabel={nameUi.roll}
                helpTitle={nameUi.roll}
                helpText={nameUi.rollHelp}
              />
            </p>
            <Switch
              id="random-name-roll-animation"
              checked={rollAnimation}
              onCheckedChange={setRollAnimation}
              aria-label={nameUi.rollAria}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
            <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
              {nameUi.revealSound}
              <HelpTip
                helpLabel={nameUi.revealSound}
                helpTitle={nameUi.revealSound}
                helpText={nameUi.soundHelp}
              />
            </p>
            <Switch
              id="random-name-sound"
              checked={soundEnabled}
              disabled={disabled}
              onCheckedChange={setSoundEnabled}
              aria-label={nameUi.soundAria}
            />
          </div>
        </div>
      </fieldset>

      <p className="sr-only" aria-live="polite">
        {disabled
          ? nameUi.locked
          : fillTemplate(nameUi.countLine, { count: nameCount })}
      </p>
    </div>
  );
};
