import { ChevronDown, Download, File, Upload } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  downloadWheelFile,
  parseWheelFileText,
  type ParsedWheelFile,
} from "@/lib/wheel-file";
import { useLocaleStore } from "@/store/locale-store";
import { useWheelStore } from "@/store/wheel-store";

type WheelFileMenuProps = {
  disabled?: boolean;
};

export const WheelFileMenu = ({ disabled = false }: WheelFileMenuProps) => {
  const messages = useLocaleStore((state) => state.messages);
  const { common } = messages.ui;
  const items = useWheelStore((state) => state.items);
  const customize = useWheelStore((state) => state.customize);
  const replaceImportedWheel = useWheelStore((state) => state.replaceImportedWheel);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<ParsedWheelFile | null>(null);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!pending) return undefined;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || busy) return;
      event.preventDefault();
      setPending(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pending, busy]);

  const handleExport = async () => {
    setOpen(false);
    try {
      await downloadWheelFile(customize, items);
      toast.success(messages.wheelExported);
    } catch {
      toast.error(common.couldNotReadFile);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseWheelFileText(text);
      if (!parsed.ok) {
        toast.error(messages.wheelFileInvalid);
        return;
      }
      setPending(parsed.file);
    } catch {
      toast.error(common.couldNotReadFile);
    }
  };

  const handleReplace = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      const applied = await replaceImportedWheel(pending);
      if (applied) toast.success(messages.wheelImported);
    } catch {
      toast.error(common.couldNotReadFile);
    } finally {
      setBusy(false);
      setPending(null);
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
      <div ref={menuRef} className="relative" data-prevent-spin-space="">
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="h-9 gap-2 px-3"
          disabled={disabled || busy}
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
            className="absolute top-10 right-0 z-40 min-w-44 rounded-xl border border-border bg-popover p-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
              onClick={() => void handleExport()}
            >
              <Download className="size-4 shrink-0" aria-hidden />
              {messages.exportWheel}
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
              onClick={() => {
                setOpen(false);
                fileInputRef.current?.click();
              }}
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              {messages.importWheel}
            </button>
          </div>
        ) : null}
      </div>
      {pending ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          data-prevent-spin-space=""
          onClick={() => {
            if (!busy) setPending(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={titleId} className="text-base font-semibold">
              {messages.importReplaceTitle}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {messages.importReplaceBody}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                ref={cancelRef}
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setPending(null)}
              >
                {common.cancel}
              </Button>
              <Button
                type="button"
                disabled={busy}
                onClick={() => void handleReplace()}
              >
                {messages.importReplace}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
