import type { Editor } from "@tiptap/core";
import type { MouseEvent } from "react";

type TiptapNodeLike = {
  type: { name: string };
  content: { size: number };
};

const isEmptyTiptapParagraphNode = (
  node: TiptapNodeLike | null | undefined,
): boolean => node?.type.name === "paragraph" && node.content.size === 0;

const isTiptapLineClickTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && Boolean(target.closest("p"));

const isScrollbarClick = (
  event: MouseEvent<HTMLDivElement>,
): boolean => {
  const scrollEl = event.currentTarget;
  const rect = scrollEl.getBoundingClientRect();
  return (
    event.clientX >= rect.left + scrollEl.clientWidth ||
    event.clientY >= rect.top + scrollEl.clientHeight
  );
};

/**
 * Clicking the empty area below the last line does not map to a ProseMirror
 * position. Focus the trailing empty line, or insert one so the user can type.
 */
export const focusTiptapEditorEmptySurface = (editor: Editor): boolean => {
  if (!editor.isEditable || editor.isDestroyed) return false;

  if (isEmptyTiptapParagraphNode(editor.state.doc.lastChild)) {
    return editor.chain().focus("end").run();
  }

  return editor
    .chain()
    .insertContentAt(editor.state.doc.content.size, {
      type: "paragraph",
    })
    .focus("end")
    .run();
};

export const handleTiptapEmptySurfaceMouseDown = (
  event: MouseEvent<HTMLDivElement>,
  editor: Editor | null,
  editable: boolean,
): void => {
  if (!editable || !editor) return;
  if (event.button !== 0) return;
  if (isTiptapLineClickTarget(event.target)) return;
  if (isScrollbarClick(event)) return;
  event.preventDefault();
  focusTiptapEditorEmptySurface(editor);
};
