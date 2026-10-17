import { ChevronDown, Download, File, Upload } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  downloadRandomNumberSetup,
  parseRandomNumberSetupText,
} from "@/lib/random-number/random-number-setup-file";
import { useMessages } from "@/lib/i18n/use-messages";
import { useRandomNumberStore } from "@/store/random-number-store";

type RandomNumberFileMenuProps = {
  disabled?: boolean;
};

export const RandomNumberFileMenu = ({
  disabled = false,
}: RandomNumberFileMenuProps) => {
  const messages = useMessages();
  const common = messages.ui.common;
  const applySetup = useRandomNumberStore((state) => state.applyRandomNumberSetup);
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
    const state = useRandomNumberStore.getState();
    downloadRandomNumberSetup({
      min: state.random_number_min,
      max: state.random_number_max,
      exclude: state.random_number_exclude_input,
      countMode: state.random_number_count_mode,
      customCount: state.random_number_custom_count,
      allowDuplicates: state.random_number_allow_duplicates,
      rollAnimation: state.random_number_roll_animation,
      soundEnabled: state.random_number_sound_enabled,
    });
    toast.success(messages.numberSetupExported);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseRandomNumberSetupText(text);
      if (!parsed.ok) {
        toast.error(messages.numberFileInvalid);
        return;
      }
      applySetup(parsed.setup);
      toast.success(messages.numberSetupImported);
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
