import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import { MAX_WHEEL_ITEMS } from "@/lib/constants";
import { handleTiptapEmptySurfaceMouseDown } from "@/lib/focus-tiptap-empty-surface";
import { itemsFromTiptapDoc, tiptapDocFromItems } from "@/lib/tiptap-items";
import { useWheelStore } from "@/store/wheel-store";

const clipboardHasImage = (data: DataTransfer | null): boolean => {
  if (!data) return false;
  if ([...data.files].some((file) => file.type.startsWith("image/"))) {
    return true;
  }
  return [...data.items].some((item) => item.type.startsWith("image/"));
};

const sameItems = (
  left: ReturnType<typeof itemsFromTiptapDoc>,
  right: ReturnType<typeof itemsFromTiptapDoc>,
): boolean =>
  left.length === right.length &&
  left.every(
    (item, index) =>
      item.label === right[index]?.label &&
      item.imageId === right[index]?.imageId &&
      item.imageDataUrl === right[index]?.imageDataUrl &&
      item.weight === right[index]?.weight &&
      item.bgColor === right[index]?.bgColor &&
      item.inactive === right[index]?.inactive,
  );

export const EntriesTextEditor = () => {
  const entriesUi = useMessages().ui.entries;
  const items = useWheelStore((s) => s.items);
  const setItems = useWheelStore((s) => s.setItems);
  const spinning = useWheelStore((s) => s.spinning);
  const skipNext = useRef(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const editor = useEditor({
    immediatelyRender: false,
    editable: !spinning,
    extensions: [
      Document,
      Paragraph,
      Text,
      History,
      Image.configure({ allowBase64: true, inline: true }),
      Placeholder.configure({
        placeholder: entriesUi.onePerLine,
      }),
    ],
    content: tiptapDocFromItems(items),
    editorProps: {
      attributes: {
        class: "entries-editor outline-none",
        "aria-label": entriesUi.wheelEntries,
      },
      handlePaste: (_view, event) => clipboardHasImage(event.clipboardData),
      handleDrop: (_view, event) => clipboardHasImage(event.dataTransfer),
    },
    onUpdate: ({ editor: instance }) => {
      if (skipNext.current || useWheelStore.getState().spinning) return;
      const next = itemsFromTiptapDoc(instance.getJSON(), itemsRef.current);
      if (next.length > MAX_WHEEL_ITEMS) {
        toast.error(fillTemplate(entriesUi.keepEntries, { max: MAX_WHEEL_ITEMS }));
        return;
      }
      const onlyBlank =
        next.length === 1 &&
        !next[0]?.label.trim() &&
        !next[0]?.imageDataUrl;
      const nextItems = onlyBlank ? [] : next;
      if (sameItems(nextItems, itemsRef.current)) return;
      setItems(nextItems);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!spinning);
  }, [editor, spinning]);

  useEffect(() => {
    if (!editor) return;
    const placeholder = editor.extensionManager.extensions.find(
      (extension) => extension.name === "placeholder",
    );
    if (placeholder) placeholder.options.placeholder = entriesUi.onePerLine;
    editor.view.dom.setAttribute("aria-label", entriesUi.wheelEntries);
  }, [editor, entriesUi.onePerLine, entriesUi.wheelEntries]);

  useEffect(() => {
    if (!editor) return;
    const current = itemsFromTiptapDoc(editor.getJSON(), items);
    if (sameItems(current, items)) return;
    skipNext.current = true;
    editor.commands.setContent(tiptapDocFromItems(items), {
      emitUpdate: false,
    });
    skipNext.current = false;
  }, [editor, items]);

  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-background",
        spinning ? "pointer-events-none opacity-60" : "cursor-text",
      )}
      aria-disabled={spinning}
      onMouseDownCapture={(event) =>
        handleTiptapEmptySurfaceMouseDown(event, editor, !spinning)
      }
    >
      <EditorContent
        editor={editor}
        className="min-h-full [&_.entries-editor]:box-border [&_.entries-editor]:min-h-full"
      />
    </div>
  );
};
