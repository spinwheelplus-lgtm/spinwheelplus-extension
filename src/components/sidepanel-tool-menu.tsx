import { AppWindow, ExternalLink, Menu, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { LanguagePicker } from "@/components/language-picker";
import { ThemeAppearancePicker } from "@/components/theme-appearance-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { SITE_URL } from "@/lib/constants";
import { extensionTabUrl, openExternalUrl } from "@/lib/extension-tab-url";
import { openStoreReview } from "@/lib/store-review";
import { APP_HOME_VIEW, TOOL_MENU_ITEMS } from "@/lib/tool-menu";
import { useAppViewStore } from "@/store/app-view-store";
import { useLocaleStore } from "@/store/locale-store";
import { useStoreReviewStore } from "@/store/store-review-store";

const MENU_ID = "sidepanel-tool-menu";

const MENU_ACTION_CLASS =
  "mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-base text-foreground hover:bg-muted";

const OPEN_ACTION_CLASS =
  "flex cursor-pointer flex-col items-center gap-1.5 rounded-lg px-1.5 py-2.5 text-center text-[0.6875rem] font-medium text-muted-foreground outline-none transition-all hover:bg-background/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:bg-muted/60";

export const SidepanelToolMenu = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const view = useAppViewStore((s) => s.view);
  const goHome = useAppViewStore((s) => s.goHome);
  const setView = useAppViewStore((s) => s.setView);
  const markRated = useStoreReviewStore((s) => s.markRated);
  const messages = useLocaleStore((s) => s.messages);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
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

  return (
    <div ref={rootRef} className="relative justify-self-end" data-prevent-spin-space="">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "size-9 rounded-full border-border bg-card p-0 text-foreground shadow-md",
          "hover:bg-muted",
          open && "bg-muted",
        )}
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-haspopup="dialog"
        aria-label={open ? messages.closeMenu : messages.openMenu}
        title={open ? messages.closeMenu : messages.openMenu}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X className="size-5" strokeWidth={2.25} />
        ) : (
          <Menu className="size-5" strokeWidth={2.25} />
        )}
      </Button>
      {open ? (
        <nav
          id={MENU_ID}
          aria-label={messages.menu}
          className="absolute top-11 right-0 z-50 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-border/80 bg-popover p-2 shadow-xl"
        >
          {TOOL_MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isCurrent = item.id === view;
            return (
              <a
                key={item.id}
                href={`#${item.path}`}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-base no-underline",
                  isCurrent
                    ? "bg-primary/10 font-medium text-primary hover:bg-primary/15"
                    : "text-foreground hover:bg-muted",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  setOpen(false);
                  if (item.id === APP_HOME_VIEW) {
                    goHome();
                    return;
                  }
                  if (item.id === "random-number") {
                    setView("random-number");
                    return;
                  }
                  if (item.id === "random-name") {
                    setView("random-name");
                    return;
                  }
                  if (item.id === "dice-roller") {
                    setView("dice-roller");
                    return;
                  }
                  if (item.id === "coin-flip") {
                    setView("coin-flip");
                    return;
                  }
                  if (item.id === "yes-or-no") {
                    setView("yes-or-no");
                    return;
                  }
                  if (item.id === "shuffle-list") {
                    setView("shuffle-list");
                    return;
                  }
                  if (item.id === "random-team") {
                    setView("random-team");
                    return;
                  }
                  toast.message(messages.comingSoon);
                }}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isCurrent ? "text-primary" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
                {messages.tools[item.id]}
              </a>
            );
          })}
          <div className="mt-1 border-t border-border/80 px-1 pt-2 pb-1">
            <ThemeAppearancePicker />
            <LanguagePicker />
            <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-muted/70 p-1 dark:bg-muted/40">
              <button
                type="button"
                className={OPEN_ACTION_CLASS}
                onClick={() => {
                  setOpen(false);
                  openExternalUrl(SITE_URL);
                }}
              >
                <ExternalLink className="size-5 shrink-0" strokeWidth={2} aria-hidden />
                <span className="leading-tight">{messages.openWebsite}</span>
              </button>
              <button
                type="button"
                className={OPEN_ACTION_CLASS}
                onClick={() => {
                  setOpen(false);
                  openExternalUrl(extensionTabUrl());
                }}
              >
                <AppWindow className="size-5 shrink-0" strokeWidth={2} aria-hidden />
                <span className="leading-tight">{messages.openTab}</span>
              </button>
            </div>
            <button
              type="button"
              className={MENU_ACTION_CLASS}
              onClick={() => {
                markRated();
                setOpen(false);
                openStoreReview();
              }}
            >
              <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
              {messages.rateApp}
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
};
