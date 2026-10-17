import { HeaderZoomButton } from "@/components/header-zoom-button";
import { SidepanelToolMenu } from "@/components/sidepanel-tool-menu";
import { APP_HOME_PATH } from "@/lib/tool-menu";
import { useAppViewStore } from "@/store/app-view-store";
import { useLocaleStore } from "@/store/locale-store";

export const SidepanelChromeHeader = () => {
  const goHome = useAppViewStore((s) => s.goHome);
  const messages = useLocaleStore((s) => s.messages);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3">
      <a
        href={`#${APP_HOME_PATH}`}
        className="flex min-w-0 items-center font-bold text-foreground no-underline"
        title={messages.spinTheWheel}
        aria-label={messages.spinTheWheel}
        onClick={(event) => {
          event.preventDefault();
          goHome();
        }}
      >
        <img
          src="./img/logo64.png"
          alt=""
          width={40}
          height={40}
          className="mr-2 size-10"
        />
        <span className="truncate">
          SpinWheel
          <span className="text-primary">Plus</span>
        </span>
      </a>
      <div className="flex shrink-0 items-center gap-3">
        <HeaderZoomButton />
        <SidepanelToolMenu />
      </div>
    </header>
  );
};
