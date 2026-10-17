import { useEffect, useRef } from "react";

import {
  hasVisibleEscapeOverlay,
  isEditableKeyboardTarget,
} from "@/lib/keyboard";

const isSpaceKey = (event: KeyboardEvent): boolean =>
  event.key === " " || event.code === "Space";

export const useRandomToolActionShortcut = (
  action: () => void,
  { disabled = false }: { disabled?: boolean } = {},
) => {
  const actionRef = useRef(action);
  const disabledRef = useRef(disabled);
  actionRef.current = action;
  disabledRef.current = disabled;

  useEffect(() => {
    const onSpace = (event: KeyboardEvent) => {
      if (!isSpaceKey(event)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditableKeyboardTarget(event.target)) return;

      event.preventDefault();
      event.stopPropagation();
      if (event.type !== "keydown") return;
      if (event.repeat) return;
      if (disabledRef.current) return;
      if (hasVisibleEscapeOverlay()) return;
      if (
        event.target instanceof Element &&
        event.target.closest("[data-prevent-spin-space]")
      ) {
        return;
      }
      actionRef.current();
    };

    const onEnter = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (disabledRef.current) return;
      if (isEditableKeyboardTarget(event.target)) return;
      if (hasVisibleEscapeOverlay()) return;
      if (
        event.target instanceof Element &&
        event.target.closest("[data-prevent-spin-space]")
      ) {
        return;
      }
      event.preventDefault();
      actionRef.current();
    };

    window.addEventListener("keydown", onSpace, true);
    window.addEventListener("keyup", onSpace, true);
    window.addEventListener("keydown", onEnter);
    return () => {
      window.removeEventListener("keydown", onSpace, true);
      window.removeEventListener("keyup", onSpace, true);
      window.removeEventListener("keydown", onEnter);
    };
  }, []);
};
