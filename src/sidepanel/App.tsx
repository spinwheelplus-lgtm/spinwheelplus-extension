import { History, RefreshCw } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AboutFaq } from "@/components/about-faq";
import { AboutFeatures } from "@/components/about-features";
import { BrandMark } from "@/components/brand-mark";
import {
  CustomizeDrawer,
  CustomizeTriggerButton,
} from "@/components/customize-drawer";
import { EntriesEditor } from "@/components/entries-editor";
import { RandomNamePage } from "@/components/random-name/random-name-page";
import { RandomNumberPage } from "@/components/random-number/random-number-page";
import { ShuffleListPage } from "@/components/shuffle-list/shuffle-list-page";
import { RandomTeamPage } from "@/components/random-team/random-team-page";
import { SidepanelChromeHeader } from "@/components/sidepanel-chrome-header";
import { SiteEditorCta } from "@/components/site-editor-cta";
import { StoreReviewPrompt } from "@/components/store-review-prompt";
import { SpinHistoryDialog } from "@/components/spin-history-dialog";
import { Button } from "@/components/ui/button";
import { layoutSlices, WheelCanvas } from "@/components/wheel-canvas";
import { WheelCenterHub } from "@/components/wheel-center-hub";
import { WheelHeader } from "@/components/wheel-header";
import { WheelFileMenu } from "@/components/wheel-file-menu";
import { WheelSessionMenu } from "@/components/wheel-session-menu";
import { WinnerDialog } from "@/components/winner-dialog";
import { WinnerEffectOverlay } from "@/components/winner-effect-overlay";
import { MAX_WHEEL_ITEMS, MIN_SPIN_ITEMS } from "@/lib/constants";
import { fillTemplate } from "@/lib/i18n/locale";
import { useImmersiveEscape } from "@/hooks/use-immersive-escape";
import { isEditableKeyboardTarget } from "@/lib/keyboard";
import { pickWeightedIndex, randomUnit } from "@/lib/random";
import { playTick, playWin, resetTickThrottle, stopTick, unlockAudio } from "@/lib/sounds";
import { mapItemsForSpin } from "@/lib/visual-items";
import {
  WHEEL_STAGE_FRAME_CLASS,
  WHEEL_STAGE_FRAME_IMMERSIVE_CLASS,
  WHEEL_STAGE_SHELL_CLASS,
  WHEEL_STAGE_SHELL_IMMERSIVE_CLASS,
  WHEEL_STAGE_SQUARE_BOX_CLASS,
  WHEEL_STAGE_SQUARE_BOX_STYLE,
} from "@/lib/wheel-layout";
import {
  WHEEL_IDLE_TURNS_PER_SEC,
  SPIN_TICK_MS,
  buildStyle1Deltas,
  createStyle2Session,
  landingAngleInSlice,
  remainingOffsetToPointer,
  requestStyle2Stop,
  sliceIndexUnderPointer,
  spinDeltaAtElapsed,
  stepStyle2Tick,
  style2IsWaitingStop,
  type Style2Session,
} from "@/lib/wheel-spin-motion";
import { useCustomizeUiStore } from "@/store/customize-ui-store";
import { useAppViewStore, viewFromLocationHash } from "@/store/app-view-store";
import { useImmersiveStore } from "@/store/immersive-store";
import { useLocaleStore } from "@/store/locale-store";
import { useStoreReviewStore } from "@/store/store-review-store";
import { useWheelStore } from "@/store/wheel-store";
import { APP_HOME_VIEW } from "@/lib/tool-menu";

const DiceRollerPage = lazy(() =>
  import("@/components/dice-roller/dice-roller-page").then((mod) => ({
    default: mod.DiceRollerPage,
  })),
);
const CoinFlipPage = lazy(() =>
  import("@/components/coin-flip/coin-flip-page").then((mod) => ({
    default: mod.CoinFlipPage,
  })),
);
const RandomYesNoPage = lazy(() =>
  import("@/components/random-yes-no/random-yes-no-page").then((mod) => ({
    default: mod.RandomYesNoPage,
  })),
);

const ToolPageFallback = ({ label }: { label: string }) => (
  <div className="flex min-h-full flex-col">
    <SidepanelChromeHeader />
    <div className="flex flex-1 items-center justify-center px-3 py-10 text-sm text-muted-foreground">
      {label}
    </div>
  </div>
);

const SidepanelTopBar = ({ children }: { children?: ReactNode }) => {
  if (!children) return null;
  return (
    <div className="flex w-full min-w-0 shrink-0 justify-center px-2 pt-2 pb-1 backdrop-blur-sm">
      <div className="w-full min-w-0">{children}</div>
    </div>
  );
};

export const App = () => {
  useImmersiveEscape();
  const ready = useWheelStore((s) => s.ready);
  const hydrate = useWheelStore((s) => s.hydrate);
  const items = useWheelStore((s) => s.items);
  const customize = useWheelStore((s) => s.customize);
  const spinning = useWheelStore((s) => s.spinning);
  const rotation = useWheelStore((s) => s.rotation);
  const setSpinning = useWheelStore((s) => s.setSpinning);
  const setRotation = useWheelStore((s) => s.setRotation);
  const setWinnerId = useWheelStore((s) => s.setWinnerId);
  const setWinnerSliceIndex = useWheelStore((s) => s.setWinnerSliceIndex);
  const completeSpinResult = useWheelStore((s) => s.completeSpinResult);
  const playWinnerEffect = useWheelStore((s) => s.playWinnerEffect);
  const winnerSliceIndex = useWheelStore((s) => s.winnerSliceIndex);
  const winnerId = useWheelStore((s) => s.winnerId);
  const customizeOpen = useCustomizeUiStore((s) => s.open);
  const resetNew = useWheelStore((s) => s.resetNew);
  const appendSpinHistory = useWheelStore((s) => s.appendSpinHistory);
  const spinHistoryCount = useWheelStore((s) => s.spinHistory.length);
  const rafRef = useRef<number>(0);
  const lastSliceRef = useRef(-1);
  const style2Ref = useRef<Style2Session | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [style2CanStop, setStyle2CanStop] = useState(false);
  const immersive = useImmersiveStore((s) => s.immersive);
  const toggleImmersive = useImmersiveStore((s) => s.toggleImmersive);
  const setCustomizeOpen = useCustomizeUiStore((s) => s.setOpen);
  const view = useAppViewStore((s) => s.view);
  const messages = useLocaleStore((s) => s.messages);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onHash = () => {
      const next = viewFromLocationHash();
      if (useAppViewStore.getState().view !== next) {
        useAppViewStore.getState().setView(next);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!customize.soundEnabled) stopTick();
  }, [customize.soundEnabled]);

  useEffect(() => {
    document.documentElement.classList.toggle("sidepanel-immersive", immersive);
    if (immersive) setCustomizeOpen(false);
    return () => {
      document.documentElement.classList.remove("sidepanel-immersive");
    };
  }, [immersive, setCustomizeOpen]);

  useEffect(() => {
    if (
      view !== APP_HOME_VIEW ||
      !customize.idleSpin ||
      spinning ||
      winnerId ||
      winnerSliceIndex !== null
    ) {
      return;
    }
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setRotation(
        useWheelStore.getState().rotation +
          dt * WHEEL_IDLE_TURNS_PER_SEC * Math.PI * 2,
      );
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [
    customize.idleSpin,
    spinning,
    winnerId,
    winnerSliceIndex,
    setRotation,
    view,
  ]);

  const spinItems = mapItemsForSpin(items, customize);

  const playSliceTick = (
    currentRotation: number,
    slices: ReturnType<typeof layoutSlices>,
  ) => {
    if (!customize.soundEnabled) return;
    const idx = sliceIndexUnderPointer(currentRotation, slices);
    if (idx < 0) return;
    if (lastSliceRef.current >= 0 && idx !== lastSliceRef.current) {
      playTick();
    }
    lastSliceRef.current = idx;
  };

  const completeSpin = (winnerIndex: number) => {
    setStyle2CanStop(false);
    style2Ref.current = null;
    const winner = spinItems[winnerIndex];
    completeSpinResult(winner?.id ?? null, winnerIndex);
    lastSliceRef.current = -1;
    if (winner) appendSpinHistory(winner.label, winner.id);
    if (customize.soundEnabled) playWin();
    else stopTick();
    playWinnerEffect();
    useStoreReviewStore.getState().recordSuccessfulSpin();
  };

  const startStyle2Loop = (slices: ReturnType<typeof layoutSlices>) => {
    let leftover = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const session = style2Ref.current;
      if (!session) return;
      leftover += now - last;
      last = now;
      let done = false;
      while (leftover >= SPIN_TICK_MS) {
        leftover -= SPIN_TICK_MS;
        done = stepStyle2Tick(session);
        if (done) break;
      }
      playSliceTick(session.rotation, slices);
      setRotation(session.rotation);
      setStyle2CanStop(style2IsWaitingStop(session));
      if (done) {
        completeSpin(session.winnerIndex);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const requestManualStop = () => {
    const session = style2Ref.current;
    if (!session || !style2IsWaitingStop(session)) return;
    const weights = spinItems.map((item) => item.weight || 1);
    const winnerIndex = pickWeightedIndex(weights);
    const slices = layoutSlices(spinItems, customize.themeColors);
    const slice = slices[winnerIndex];
    if (!slice) return;
    requestStyle2Stop(session, {
      winnerIndex,
      landingAngle: landingAngleInSlice(slice.start, slice.span, randomUnit()),
      delayUnit: randomUnit(),
      extraUnit: randomUnit(),
      strength: customize.style2StopStrength,
    });
    setStyle2CanStop(false);
  };

  const spin = () => {
    if (style2Ref.current && style2IsWaitingStop(style2Ref.current)) {
      requestManualStop();
      return;
    }
    if (spinning) return;
    unlockAudio();
    if (spinItems.length < MIN_SPIN_ITEMS) {
      toast.error(messages.ui.entries.addEntryToSpin);
      return;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setWinnerId(null);
    setWinnerSliceIndex(null);
    lastSliceRef.current = -1;
    resetTickThrottle();

    if (customize.spinStyle === "style2") {
      const session = createStyle2Session(rotation);
      style2Ref.current = session;
      setSpinning(true);
      setStyle2CanStop(true);
      startStyle2Loop(layoutSlices(spinItems, customize.themeColors));
      return;
    }

    const weights = spinItems.map((item) => item.weight || 1);
    const winnerIndex = pickWeightedIndex(weights);
    const slices = layoutSlices(spinItems, customize.themeColors);
    const slice = slices[winnerIndex];
    if (!slice) return;

    const start = rotation;
    const landing = landingAngleInSlice(slice.start, slice.span, randomUnit());
    const targetOffset = remainingOffsetToPointer(start, landing);
    const deltas = buildStyle1Deltas(
      customize.spinDurationSec * 1000,
      targetOffset,
    );
    const started = performance.now();
    setSpinning(true);
    setStyle2CanStop(false);

    const tick = (now: number) => {
      const { delta, done } = spinDeltaAtElapsed(deltas, now - started);
      const current = start + delta;
      setRotation(current);
      playSliceTick(current, slices);
      if (!done) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      completeSpin(winnerIndex);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const spinRef = useRef(spin);
  spinRef.current = spin;

  useEffect(() => {
    const onSpace = (event: KeyboardEvent) => {
      if (event.key !== " ") return;
      if (useAppViewStore.getState().view !== APP_HOME_VIEW) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditableKeyboardTarget(event.target)) return;
      if (
        event.target instanceof Element &&
        event.target.closest("[data-prevent-spin-space]")
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (event.type !== "keydown") return;
      if (event.repeat) return;
      if ((winnerId && customize.winnerPopup) || customizeOpen || historyOpen)
        return;
      if (spinning && !style2CanStop) return;
      spinRef.current();
    };
    window.addEventListener("keydown", onSpace, true);
    window.addEventListener("keyup", onSpace, true);
    return () => {
      window.removeEventListener("keydown", onSpace, true);
      window.removeEventListener("keyup", onSpace, true);
    };
  }, [
    spinning,
    style2CanStop,
    winnerId,
    customize.winnerPopup,
    customizeOpen,
    historyOpen,
  ]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  if (view === "random-number") {
    return <RandomNumberPage />;
  }

  if (view === "random-name") {
    return <RandomNamePage />;
  }

  if (view === "dice-roller") {
    return (
      <Suspense fallback={<ToolPageFallback label={messages.ui.dice.loading} />}>
        <DiceRollerPage />
      </Suspense>
    );
  }

  if (view === "coin-flip") {
    return (
      <Suspense fallback={<ToolPageFallback label={messages.ui.coin.loading} />}>
        <CoinFlipPage />
      </Suspense>
    );
  }

  if (view === "yes-or-no") {
    return (
      <Suspense fallback={<ToolPageFallback label={messages.ui.yesNo.loading} />}>
        <RandomYesNoPage />
      </Suspense>
    );
  }

  if (view === "shuffle-list") {
    return <ShuffleListPage />;
  }

  if (view === "random-team") {
    return <RandomTeamPage />;
  }

  if (!ready) {
    return (
      <div className="flex min-h-full flex-col">
        <SidepanelChromeHeader />
        <SidepanelTopBar />
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {messages.loadingWheel}
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        immersive
          ? "flex h-svh max-h-svh flex-col overflow-hidden"
          : "flex min-h-full flex-col"
      }
    >
      {immersive ? null : <SidepanelChromeHeader />}
      <SidepanelTopBar>
        <WheelHeader customize={customize} showEdit={!immersive} />
      </SidepanelTopBar>

      <div
        className={
          immersive ? WHEEL_STAGE_FRAME_IMMERSIVE_CLASS : WHEEL_STAGE_FRAME_CLASS
        }
      >
        <div
          className={
            immersive
              ? WHEEL_STAGE_SHELL_IMMERSIVE_CLASS
              : WHEEL_STAGE_SHELL_CLASS
          }
        >
          <div
            className={WHEEL_STAGE_SQUARE_BOX_CLASS}
            style={WHEEL_STAGE_SQUARE_BOX_STYLE}
          >
            <WheelCanvas
              items={spinItems}
              themeColors={customize.themeColors}
              rotation={rotation}
              rimEnabled={customize.rimEnabled}
              rimBorderColors={customize.rimBorderColors}
              rimDotColor={customize.rimDotColor}
              hideItemNames={customize.hideItemNames}
              revealSliceIndex={
                customize.hideItemNames && !spinning ? winnerSliceIndex : null
              }
              showDivider={customize.showDivider}
              wheelShadow={customize.wheelShadow}
              imageFit={customize.imageFit}
              highlightSliceIndex={
                customize.winnerHighlight && !spinning ? winnerSliceIndex : null
              }
              onSpin={spin}
              spinning={spinning}
              canStop={style2CanStop}
              className="size-full"
            />
            <WheelCenterHub
              fill={customize.centerColor}
              outline={customize.centerHubOutline}
              spinning={spinning}
              canStop={style2CanStop}
              onSpin={spin}
            />
          </div>
        </div>
        <WheelSessionMenu
          immersive={immersive}
          spinning={spinning}
          onOpenHistory={() => setHistoryOpen(true)}
          onToggleImmersive={toggleImmersive}
        />
      </div>
      <p className="mt-2 shrink-0 px-3 pb-2 text-center text-xs text-muted-foreground">
        {style2CanStop
          ? messages.hintStop
          : customize.spinStyle === "style2"
            ? messages.hintStyle2
            : messages.hintSpin}
      </p>

      {immersive ? null : (
        <>
          <StoreReviewPrompt />
          <section className="mx-3 mt-3 mb-3 flex h-[550px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm">
            <div className="mb-2 flex min-w-0 shrink-0 flex-col gap-2">
              <div>
                <h1 className="text-base font-semibold">{messages.entries}</h1>
                <p className="text-xs text-muted-foreground">
                  {fillTemplate(messages.itemCount, {
                    count: items.length,
                    max: MAX_WHEEL_ITEMS,
                  })}
                </p>
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <CustomizeTriggerButton />
                {spinHistoryCount > 0 ? (
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={spinning}
                    className="h-9 gap-2 border-sky-400/60 bg-sky-50 px-3 font-semibold text-sky-800 shadow-sm hover:border-sky-500 hover:bg-sky-100 hover:text-sky-950 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-100 dark:hover:border-sky-400 dark:hover:bg-sky-900/70 dark:hover:text-sky-50"
                    title={messages.history}
                    aria-label={messages.history}
                    onClick={() => setHistoryOpen(true)}
                  >
                    <History />
                    {messages.history}
                  </Button>
                ) : null}
                <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                  <WheelFileMenu disabled={spinning} />
                  <Button
                    size="lg"
                    disabled={spinning}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    title={messages.newWheel}
                    aria-label={messages.newWheel}
                    onClick={() => {
                      if (rafRef.current) cancelAnimationFrame(rafRef.current);
                      style2Ref.current = null;
                      setStyle2CanStop(false);
                      resetNew();
                      setHistoryOpen(false);
                      toast.success(messages.newWheelReady);
                    }}
                  >
                    <RefreshCw />
                    {messages.newWheel}
                  </Button>
                </div>
              </div>
            </div>
            <EntriesEditor />
          </section>

          <AboutFeatures />
          <AboutFaq />
          <BrandMark />
          <SiteEditorCta className="mb-4" />
        </>
      )}
      <CustomizeDrawer />
      <WinnerDialog />
      <WinnerEffectOverlay />
      <SpinHistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} />
    </div>
  );
};
