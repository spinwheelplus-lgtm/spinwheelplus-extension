import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

import { ResultPopupCard } from "@/components/result-popup-card";
import { ResultPopupFooter } from "@/components/result-popup-footer";
import { cn } from "@/lib/cn";
import { pickWheelTextColor, resolveItemSliceColor } from "@/lib/item-color";
import {
  DEFAULT_WINNER_POPUP_TITLE,
  resultPopupDialogContentClassName,
  resultPopupDialogContentStyle,
  resultPopupFooterRadiusClassName,
  resultPopupSkinUsesDarkChrome,
  resolveResultPopupSkin,
} from "@/lib/result-popup-skin";
import type { WheelItem } from "@/lib/types";
import { readWinnerPopupButtonMode } from "@/lib/winner-popup-buttons";
import { useMessages } from "@/lib/i18n/use-messages";
import { useWheelStore } from "@/store/wheel-store";

const CLOSE_MS = 200;

export const WinnerDialog = () => {
  const winnerId = useWheelStore((s) => s.winnerId);
  const winnerSliceIndex = useWheelStore((s) => s.winnerSliceIndex);
  const items = useWheelStore((s) => s.items);
  const customize = useWheelStore((s) => s.customize);
  const setWinnerId = useWheelStore((s) => s.setWinnerId);
  const removeItem = useWheelStore((s) => s.removeItem);
  const winnerLabel = useMessages().ui.common.winner;
  const buttonMode = readWinnerPopupButtonMode(customize.winnerPopupButtonMode);
  const skin = resolveResultPopupSkin(customize.winnerPopupSkin);
  const popupEnabled = customize.winnerPopup;
  const winner = items.find((item) => item.id === winnerId) ?? null;
  const [heldWinner, setHeldWinner] = useState<WheelItem | null>(null);
  const [heldSliceIndex, setHeldSliceIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const closeTimer = useRef(0);
  const displayWinner = winner ?? heldWinner;
  const sliceIndex = winnerSliceIndex ?? heldSliceIndex;
  const headerBg = displayWinner
    ? resolveItemSliceColor(displayWinner.bgColor, sliceIndex, customize.themeColors)
    : "#3369e8";
  const headerText = pickWheelTextColor(headerBg);
  const canRemove = items.length > 0;
  const wantsClose = buttonMode !== "remove_only";
  const wantsRemove = buttonMode !== "close_only";
  const showRemove = Boolean(displayWinner) && wantsRemove;
  const showClose = wantsClose || !canRemove;
  const open = Boolean(winnerId) && popupEnabled;
  const winnerName = displayWinner?.label.trim() || winnerLabel;
  const popupTitle = customize.winnerTitle.trim() || DEFAULT_WINNER_POPUP_TITLE;
  const onDark = resultPopupSkinUsesDarkChrome(skin);

  useEffect(() => {
    if (winner) {
      setHeldWinner(winner);
      setLeaving(false);
    }
  }, [winner]);

  useEffect(() => {
    if (winnerSliceIndex != null) setHeldSliceIndex(winnerSliceIndex);
  }, [winnerSliceIndex]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const requestClose = () => {
    if (!open || leaving) return;
    if (!showClose) return;
    setLeaving(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setWinnerId(null);
    }, CLOSE_MS);
  };

  const removeWinner = () => {
    if (!displayWinner || !canRemove || leaving) return;
    removeItem(displayWinner.id);
    setLeaving(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setWinnerId(null);
    }, CLOSE_MS);
  };

  return (
    <Drawer.Root
      open={open}
      dismissible={showClose}
      shouldScaleBackground={false}
      onOpenChange={(next) => {
        if (next) return;
        requestClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
            leaving && "opacity-0",
          )}
          data-vaul-animate={leaving ? "false" : undefined}
          onClick={showClose ? requestClose : undefined}
        />
        <Drawer.Content
          data-vaul-animate={leaving ? "false" : undefined}
          className={cn(
            "fixed z-50 flex bg-transparent p-0 shadow-none outline-none after:hidden",
            "!inset-0 !top-0 !right-0 !bottom-0 !left-0 !mt-0 !h-full !max-h-none !w-full !max-w-none",
            "!translate-x-0 !translate-y-0",
            "transition-opacity duration-200 ease-in",
            leaving && "opacity-0",
            skin === "broadcast" ? "items-end justify-center" : "items-center justify-center",
          )}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget && showClose) requestClose();
          }}
        >
          <Drawer.Title className="sr-only">{winnerLabel}</Drawer.Title>
          <Drawer.Description className="sr-only">
            {`${winnerLabel}: ${winnerName}. ${popupTitle}`}
          </Drawer.Description>
          {displayWinner ? (
            <div
              className={cn(
                "relative",
                resultPopupDialogContentClassName(skin),
                skin === "tape" || skin === "broadcast" ? "w-full" : "",
              )}
              style={resultPopupDialogContentStyle(skin)}
            >
              <ResultPopupCard
                skin={skin}
                title={popupTitle}
                winnerName={winnerName}
                imageSrc={displayWinner.imageDataUrl}
                headerStyle={{
                  backgroundColor: headerBg,
                  color: headerText,
                }}
                showHeaderClose={showClose}
                onClose={requestClose}
                closeAriaLabel="Close winner popup"
                footer={
                  <ResultPopupFooter
                    showCloseButton={showClose}
                    showRemoveButton={showRemove}
                    removeButtonEnabled={canRemove}
                    onClose={requestClose}
                    onRemove={removeWinner}
                    tone={onDark ? "on-dark" : "default"}
                    className={resultPopupFooterRadiusClassName(skin)}
                  />
                }
              />
            </div>
          ) : null}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
