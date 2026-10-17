import { ChevronDown, Download, File, Upload } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  downloadYesNoSetup,
  parseYesNoSetupText,
} from "@/lib/random-yes-no/yes-no-setup-file";
import { useRandomYesNoStore } from "@/store/random-yes-no-store";

type YesNoFileMenuProps = {
  disabled?: boolean;
};

export const YesNoFileMenu = ({ disabled = false }: YesNoFileMenuProps) => {
  const messages = useMessages();
  const common = messages.ui.common;
  const applySetup = useRandomYesNoStore((state) => state.applyRandomYesNoSetup);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleExport = () => {
    setOpen(false);
    const state = useRandomYesNoStore.getState();
    downloadYesNoSetup({
      answerMode: state.random_yes_no_answer_mode,
      customAnswers: state.random_yes_no_custom_answers_text,
      animation: state.random_yes_no_animation_type,
      soundEnabled: state.random_yes_no_sound_enabled,
    });
    toast.success(messages.yesNoSetupExported);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseYesNoSetupText(text);
      if (!parsed.ok) {
        toast.error(messages.yesNoFileInvalid);
        return;
      }
      applySetup(parsed.setup);
      toast.success(messages.yesNoSetupImported);
    } catch {
      toast.error(common.couldNotReadFile);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => void handleFileChange(event)}
      />
      <div ref={menuRef} className="relative shrink-0" data-prevent-spin-space="">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          disabled={disabled}
          aria-label={messages.wheelFile}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
        >
          <File className="size-4 shrink-0" aria-hidden />
          {messages.wheelFile}
          <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
        </Button>
        {open ? (
          <div
            role="menu"
            className="absolute top-9 right-0 z-40 min-w-44 rounded-xl border border-border bg-popover p-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
              onClick={handleExport}
            >
              <Download className="size-4 shrink-0" aria-hidden />
              {common.exportSetup}
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
              disabled={disabled}
              onClick={() => {
                setOpen(false);
                fileInputRef.current?.click();
              }}
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              {common.importSetup}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};
