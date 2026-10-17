import { CircleHelp } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type HelpTipProps = {
  helpLabel: string;
  helpTitle: string;
  helpText: ReactNode;
};

const helpTipClosers = new Set<() => void>();

const HELP_TIP_WIDTH_PX = 256;
const HELP_TIP_GAP_PX = 8;
const HELP_TIP_VIEW_MARGIN_PX = 8;

const placeHelpTipPanel = (
  trigger: DOMRect,
  panelWidth: number,
  panelHeight: number,
): { top: number; left: number } => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let left = trigger.left;
  const overflowRight =
    left + panelWidth > viewportWidth - HELP_TIP_VIEW_MARGIN_PX;
  if (overflowRight || trigger.left > viewportWidth / 2) {
    left = trigger.right - panelWidth;
  }
  left = Math.min(
    Math.max(HELP_TIP_VIEW_MARGIN_PX, left),
    Math.max(
      HELP_TIP_VIEW_MARGIN_PX,
      viewportWidth - HELP_TIP_VIEW_MARGIN_PX - panelWidth,
    ),
  );

  const below = trigger.bottom + HELP_TIP_GAP_PX;
  const fitsBelow =
    panelHeight === 0 ||
    below + panelHeight <= viewportHeight - HELP_TIP_VIEW_MARGIN_PX;
  let top = fitsBelow
    ? below
    : trigger.top - HELP_TIP_GAP_PX - panelHeight;
  if (top < HELP_TIP_VIEW_MARGIN_PX) {
    top = HELP_TIP_VIEW_MARGIN_PX;
  }
  if (
    panelHeight > 0 &&
    top + panelHeight > viewportHeight - HELP_TIP_VIEW_MARGIN_PX
  ) {
    top = Math.max(
      HELP_TIP_VIEW_MARGIN_PX,
      viewportHeight - HELP_TIP_VIEW_MARGIN_PX - panelHeight,
    );
  }
  return { top, left };
};

export const dismissOpenHelpTips = (): boolean => {
  if (helpTipClosers.size === 0) return false;
  [...helpTipClosers].forEach((fn) => fn());
  return true;
};

export const HelpTip = ({ helpLabel, helpTitle, helpText }: HelpTipProps) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const rootRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    const trigger = rootRef.current?.getBoundingClientRect();
    if (!trigger) return;
    const panelBox = panelRef.current?.getBoundingClientRect();
    setCoords(
      placeHelpTipPanel(
        trigger,
        panelBox?.width || HELP_TIP_WIDTH_PX,
        panelBox?.height ?? 0,
      ),
    );
  }, [open, helpText]);

  useEffect(() => {
    if (!open) return undefined;

    const close = () => setOpen(false);
    helpTipClosers.forEach((fn) => fn());
    helpTipClosers.add(close);

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
    };
    const onScrollOrResize = () => setOpen(false);

    const scroller = rootRef.current?.closest(".overflow-y-auto");
    scroller?.addEventListener("scroll", onScrollOrResize);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      helpTipClosers.delete(close);
      scroller?.removeEventListener("scroll", onScrollOrResize);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  return (
    <span ref={rootRef} className="inline-flex">
      <button
        type="button"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
        aria-label={helpLabel}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        title={helpTitle}
        data-prevent-spin-space=""
        onClick={() => setOpen((value) => !value)}
      >
        <CircleHelp className="size-3.5" aria-hidden />
      </button>
      {open
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              role="note"
              className="fixed z-60 w-64 rounded-lg border border-border bg-card p-3 text-left shadow-lg"
              style={{
                top: coords?.top ?? 0,
                left: coords?.left ?? 0,
                visibility: coords ? "visible" : "hidden",
              }}
            >
              <p className="text-sm font-semibold">{helpTitle}</p>
              <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {helpText}
              </div>
            </div>,
            document.body,
          )
        : null}
    </span>
  );
};
