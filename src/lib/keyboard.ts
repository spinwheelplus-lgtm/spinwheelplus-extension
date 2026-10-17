export const isEditableKeyboardTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};

const isVisibleOverlay = (el: Element): boolean => {
  if (!(el instanceof HTMLElement) || el.hidden) return false;
  return el.getClientRects().length > 0;
};

const ESCAPE_OVERLAY_SELECTOR = [
  '[role="dialog"]',
  '[role="alertdialog"]',
  '[role="menu"]',
  '[role="listbox"]',
  "[data-dialog-panel]",
  "[data-vaul-drawer]",
].join(",");

export const hasVisibleEscapeOverlay = (): boolean => {
  const nodes = document.querySelectorAll(ESCAPE_OVERLAY_SELECTOR);
  for (const node of nodes) {
    if (isVisibleOverlay(node)) return true;
  }
  return false;
};

/** True when Escape should close an input, menu, or dialog instead of Zoom. */
export const shouldSkipImmersiveEscape = (event: KeyboardEvent): boolean => {
  if (event.defaultPrevented) return true;
  if (event.altKey || event.ctrlKey || event.metaKey) return true;
  if (isEditableKeyboardTarget(event.target)) return true;
  return hasVisibleEscapeOverlay();
};
