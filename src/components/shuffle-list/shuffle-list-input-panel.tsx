import { ClipboardPaste, List, Settings2, Trash2, Upload } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { toast } from "sonner";

import { ShuffleListFileMenu } from "@/components/shuffle-list/shuffle-list-file-menu";
import { Button } from "@/components/ui/button";
import { HelpTip } from "@/components/ui/help-tip";
import { Switch } from "@/components/ui/switch";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  getShuffleListPreparedCount,
  useShuffleListStore,
} from "@/store/shuffle-list-store";

export const ShuffleListInputPanel = () => {
  const messages = useMessages();
  const shuffleUi = messages.ui.shuffle;
  const common = messages.ui.common;
  const listInput = useShuffleListStore((state) => state.shuffle_list_input);
  const ignoreEmptyLines = useShuffleListStore(
    (state) => state.shuffle_list_ignore_empty_lines,
  );
  const removeDuplicates = useShuffleListStore(
    (state) => state.shuffle_list_remove_duplicates,
  );
  const soundEnabled = useShuffleListStore(
    (state) => state.shuffle_list_sound_enabled,
  );
  const setListInput = useShuffleListStore((state) => state.setShuffleListInput);
  const setIgnoreEmptyLines = useShuffleListStore(
    (state) => state.setShuffleListIgnoreEmptyLines,
  );
  const setRemoveDuplicates = useShuffleListStore(
    (state) => state.setShuffleListRemoveDuplicates,
  );
  const setSoundEnabled = useShuffleListStore(
    (state) => state.setShuffleListSoundEnabled,
  );
  const clearListInput = useShuffleListStore(
    (state) => state.clearShuffleListInput,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const preparedCount = getShuffleListPreparedCount({
    shuffle_list_input: listInput,
    shuffle_list_ignore_empty_lines: ignoreEmptyLines,
    shuffle_list_remove_duplicates: removeDuplicates,
  });

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
      toast.success(shuffleUi.listPasted);
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
      toast.success(shuffleUi.listImported);
    } catch {
      toast.error(common.couldNotReadThatFile);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <List className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">{shuffleUi.enterList}</h2>
          <p className="text-sm text-muted-foreground">{shuffleUi.perLine}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <ShuffleListFileMenu />
          <p className="font-medium whitespace-nowrap text-muted-foreground">
            {fillTemplate(shuffleUi.itemCount, { count: preparedCount })}
          </p>
        </div>
      </div>

      <fieldset className="m-0 flex min-w-0 flex-1 flex-col gap-4 border-0 p-0">
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <label htmlFor="shuffle-list-input" className="sr-only">
            {shuffleUi.listLabel}
          </label>
          <textarea
            id="shuffle-list-input"
            value={listInput}
            onChange={(event) => setListInput(event.target.value)}
            placeholder={shuffleUi.placeholder}
            spellCheck={false}
            className="min-h-48 w-full min-w-0 flex-1 resize-y rounded-xl border border-border bg-background px-3 py-2 font-sans text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            variant="destructive"
            size="sm"
            onClick={clearListInput}
            disabled={listInput.length === 0}
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
              {shuffleUi.ignoreEmpty}
              <HelpTip
                helpLabel={shuffleUi.ignoreEmpty}
                helpTitle={shuffleUi.ignoreEmpty}
                helpText={shuffleUi.ignoreHelp}
              />
            </p>
            <Switch
              id="shuffle-list-ignore-empty"
              checked={ignoreEmptyLines}
              onCheckedChange={setIgnoreEmptyLines}
              aria-label={shuffleUi.ignoreAria}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
            <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
              {shuffleUi.removeDuplicates}
              <HelpTip
                helpLabel={shuffleUi.removeDuplicates}
                helpTitle={shuffleUi.removeDuplicates}
                helpText={shuffleUi.removeHelp}
              />
            </p>
            <Switch
              id="shuffle-list-remove-duplicates"
              checked={removeDuplicates}
              onCheckedChange={setRemoveDuplicates}
              aria-label={shuffleUi.removeAria}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
            <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
              {shuffleUi.revealSound}
              <HelpTip
                helpLabel={shuffleUi.revealSound}
                helpTitle={shuffleUi.revealSound}
                helpText={shuffleUi.soundHelp}
              />
            </p>
            <Switch
              id="shuffle-list-sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              aria-label={shuffleUi.soundAria}
            />
          </div>
        </div>
      </fieldset>

      <p className="sr-only" aria-live="polite">
        {fillTemplate(shuffleUi.ready, { count: preparedCount })}
      </p>
    </div>
  );
};
