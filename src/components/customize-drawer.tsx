import { Palette, Settings, SlidersHorizontal, X } from "lucide-react";
import { Drawer } from "vaul";

import { CustomizeDesignTab } from "@/components/customize/customize-design-tab";
import { dismissOpenHelpTips } from "@/components/customize/customize-fields";
import { CustomizePageTab } from "@/components/customize/customize-page-tab";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  useCustomizeUiStore,
  type CustomizeTabId,
} from "@/store/customize-ui-store";
import { useLocaleStore } from "@/store/locale-store";
import { useWheelStore } from "@/store/wheel-store";

const TABS: { id: CustomizeTabId; label: string; icon: typeof Palette }[] = [
  { id: "design", label: "Design", icon: Palette },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
];

const customizeTriggerClass = cn(
  "h-9 gap-2 border-emerald-600/50 bg-emerald-50 px-3 font-semibold text-emerald-900 shadow-sm",
  "hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-950",
  "dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-100",
  "dark:hover:border-emerald-400 dark:hover:bg-emerald-900/70 dark:hover:text-emerald-50",
);

export const CustomizeTriggerButton = () => {
  const spinning = useWheelStore((s) => s.spinning);
  const openCustomize = useCustomizeUiStore((s) => s.openCustomize);
  const messages = useLocaleStore((s) => s.messages);

  return (
    <Button
      variant="outline"
      size="lg"
      disabled={spinning}
      className={customizeTriggerClass}
      aria-label={messages.customize}
      title={messages.customize}
      onClick={() => openCustomize()}
    >
      <Settings />
      {messages.customizeButton}
    </Button>
  );
};

export const CustomizeDrawer = () => {
  const open = useCustomizeUiStore((s) => s.open);
  const tab = useCustomizeUiStore((s) => s.tab);
  const resultPopupDemoOpen = useCustomizeUiStore((s) => s.resultPopupDemoOpen);
  const messages = useLocaleStore((s) => s.messages);
  const tabLabel = (id: CustomizeTabId): string =>
    id === "design" ? messages.design : messages.settings;
  const setOpen = useCustomizeUiStore((s) => s.setOpen);
  const setTab = useCustomizeUiStore((s) => s.setTab);
  const customize = useWheelStore((s) => s.customize);
  const setCustomize = useWheelStore((s) => s.setCustomize);
  const itemCount = useWheelStore((s) => s.items.length);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && resultPopupDemoOpen) return;
        setOpen(next);
      }}
      dismissible={!resultPopupDemoOpen}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-40 bg-black/45"
          onClick={() => {
            if (resultPopupDemoOpen) return;
            setOpen(false);
          }}
        />
        <Drawer.Content
          className={cn(
            "fixed z-50 flex items-center justify-center bg-transparent p-0 shadow-none outline-none after:hidden",
            "!inset-0 !top-0 !right-0 !bottom-0 !left-0 !mt-0 !h-full !max-h-none !w-full !max-w-none",
            "!translate-x-0 !translate-y-0",
          )}
          onPointerDownOutside={(event) => {
            if (resultPopupDemoOpen) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (resultPopupDemoOpen) {
              event.preventDefault();
              return;
            }
            if (dismissOpenHelpTips()) event.preventDefault();
          }}
          onPointerDown={(event) => {
            if (resultPopupDemoOpen) return;
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            data-dialog-panel
            className="pointer-events-auto flex max-h-[90%] w-[min(90%,600px)] flex-col overflow-hidden rounded-2xl bg-card text-foreground shadow-xl"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="relative shrink-0 border-b border-border px-4 pt-4 pr-12 pb-3">
            <Drawer.Title className="text-lg font-semibold">
              {messages.customize}
            </Drawer.Title>
            <Drawer.Description className="mt-1 text-sm text-muted-foreground">
              {messages.customizeLead}
            </Drawer.Description>
            <Drawer.Close asChild>
              <button
                type="button"
                className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={messages.closeCustomize}
                title={messages.close}
              >
                <X className="size-4" aria-hidden />
              </button>
            </Drawer.Close>
          </div>
          <div className="shrink-0 border-b border-border px-4 py-3">
            <div className="grid h-auto w-full min-w-0 grid-cols-2 rounded-lg bg-muted/60 p-1">
              {TABS.map(({ id, icon: Icon }) => {
                const label = tabLabel(id);
                return (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    "flex min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-all",
                    tab === id
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-transparent text-foreground hover:bg-muted/80",
                  )}
                  onClick={() => setTab(id)}
                  title={label}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{label}</span>
                </button>
                );
              })}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            {tab === "design" ? (
              <CustomizeDesignTab
                customize={customize}
                itemCount={itemCount}
                setCustomize={setCustomize}
              />
            ) : null}
            {tab === "settings" ? (
              <CustomizePageTab
                customize={customize}
                setCustomize={setCustomize}
              />
            ) : null}
          </div>
          <div className="shrink-0 border-t border-border p-4">
            <Drawer.Close asChild>
              <Button
                type="button"
                className="w-full bg-slate-700 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                title={messages.ui.common.done}
              >
                {messages.ui.common.done}
              </Button>
            </Drawer.Close>
          </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
