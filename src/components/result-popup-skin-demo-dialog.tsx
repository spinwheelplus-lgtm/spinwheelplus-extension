import { useEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";

import { ResultPopupCard } from "@/components/result-popup-card";
import { ResultPopupFooter } from "@/components/result-popup-footer";
import { cn } from "@/lib/cn";
import {
  DEFAULT_WINNER_POPUP_TITLE,
  resultPopupDialogContentClassName,
  resultPopupDialogContentStyle,
  resultPopupFooterRadiusClassName,
  resultPopupSkinUsesDarkChrome,
  type ResultPopupSkinId,
} from "@/lib/result-popup-skin";

export const RESULT_POPUP_SKIN_DEMO_WINNER_NAME = "Your name";

type ResultPopupSkinDemoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skin: ResultPopupSkinId;
  title: string;
  headerStyle?: CSSProperties;
};

export const ResultPopupSkinDemoDialog = ({
  open,
  onOpenChange,
  skin,
  title,
  headerStyle,
}: ResultPopupSkinDemoDialogProps) => {
  const onDark = resultPopupSkinUsesDarkChrome(skin);
  const handleClose = () => onOpenChange(false);
  const popupTitle = title.trim() || DEFAULT_WINNER_POPUP_TITLE;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onOpenChange(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div
      className="pointer-events-auto fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-style-preview-title"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Dismiss popup preview"
        onClick={handleClose}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex p-0",
          skin === "broadcast"
            ? "items-end justify-center"
            : "items-center justify-center",
        )}
      >
        <h2 id="popup-style-preview-title" className="sr-only">
          Popup style preview
        </h2>
        <p className="sr-only">
          {`Preview winner popup. Winner: ${RESULT_POPUP_SKIN_DEMO_WINNER_NAME}.`}
        </p>
        <div
          className={cn(
            "pointer-events-auto relative",
            resultPopupDialogContentClassName(skin),
            skin === "tape" || skin === "broadcast" ? "w-full" : "",
          )}
          style={
            skin === "tape"
              ? undefined
              : resultPopupDialogContentStyle(skin)
          }
        >
          <ResultPopupCard
            skin={skin}
            title={popupTitle}
            winnerName={RESULT_POPUP_SKIN_DEMO_WINNER_NAME}
            headerStyle={headerStyle}
            showHeaderClose
            onClose={handleClose}
            closeAriaLabel="Close winner popup preview"
            footer={
              <ResultPopupFooter
                showCloseButton
                showRemoveButton={false}
                removeButtonEnabled={false}
                onClose={handleClose}
                onRemove={() => undefined}
                tone={onDark ? "on-dark" : "default"}
                className={resultPopupFooterRadiusClassName(skin)}
              />
            }
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};
