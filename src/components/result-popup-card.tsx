import type { CSSProperties, ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  RESULT_POPUP_BODY_SCROLL_CLASS,
  RESULT_POPUP_CARD_SHELL_CLASS,
  RESULT_POPUP_IMAGE_CLASS,
  RESULT_POPUP_TAPE_EXTRA_PANEL_CLASS,
  RESULT_POPUP_TAPE_NAME_CLASS,
  RESULT_POPUP_TITLE_CLAMP_CLASS,
  RESULT_POPUP_WINNER_NAME_CLASS,
  resolveResultPopupTapeStyle,
  type ResultPopupSkinId,
} from "@/lib/result-popup-skin";

export type ResultPopupCardProps = {
  skin: ResultPopupSkinId;
  title: string;
  winnerName: string;
  message?: string | null;
  imageSrc?: string | null;
  headerStyle?: CSSProperties;
  showHeaderClose: boolean;
  onClose: () => void;
  closeAriaLabel: string;
  footer?: ReactNode;
};

type SkinInnerProps = Omit<ResultPopupCardProps, "skin" | "title"> & {
  titleNode: ReactNode;
};

const WinnerMedia = ({
  imageSrc,
  message,
  messageClassName,
  imageClassName,
}: {
  imageSrc?: string | null;
  message?: string | null;
  messageClassName?: string;
  imageClassName?: string;
}) => (
  <>
    {imageSrc ? (
      <div className="flex w-full justify-center">
        <img
          src={imageSrc}
          alt=""
          className={cn(RESULT_POPUP_IMAGE_CLASS, imageClassName)}
        />
      </div>
    ) : null}
    {message ? (
      <p className={cn("break-words text-base", messageClassName)}>{message}</p>
    ) : null}
  </>
);

const WinnerName = ({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) => (
  <p
    className={cn(RESULT_POPUP_WINNER_NAME_CLASS, className)}
    style={style}
    title={name}
    aria-live="polite"
  >
    {name}
  </p>
);

const PopupScrollBody = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn(RESULT_POPUP_BODY_SCROLL_CLASS, className)}>{children}</div>
);

const HeaderClose = ({
  show,
  onClose,
  ariaLabel,
  className,
  iconClassName,
}: {
  show: boolean;
  onClose: () => void;
  ariaLabel: string;
  className?: string;
  iconClassName?: string;
}) => {
  const closeLabel = useMessages().ui.common.close;
  if (!show) return null;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      className={cn("shrink-0", className)}
      aria-label={ariaLabel}
      title={closeLabel}
      onClick={onClose}
    >
      <X className={cn("size-4", iconClassName)} aria-hidden />
    </Button>
  );
};

const CardSkin = ({
  titleNode,
  winnerName,
  message,
  imageSrc,
  headerStyle,
  showHeaderClose,
  onClose,
  closeAriaLabel,
  footer,
}: SkinInnerProps) => (
  <div className={cn(RESULT_POPUP_CARD_SHELL_CLASS, "overflow-hidden rounded-2xl bg-card")}>
    <div
      className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 pt-3 pb-4"
      style={headerStyle}
    >
      {titleNode}
      <HeaderClose
        show={showHeaderClose}
        onClose={onClose}
        ariaLabel={closeAriaLabel}
        className="hover:bg-black/10 dark:hover:bg-white/10"
      />
    </div>
    <PopupScrollBody className="space-y-4 bg-background px-4 py-5 text-center">
      <WinnerName
        name={winnerName}
        className="text-3xl font-bold tracking-tight text-foreground"
      />
      <WinnerMedia
        imageSrc={imageSrc}
        message={message}
        messageClassName="text-muted-foreground"
        imageClassName="border border-border shadow-sm"
      />
    </PopupScrollBody>
    {footer}
  </div>
);

const ChalkCard = ({
  titleNode,
  winnerName,
  message,
  imageSrc,
  showHeaderClose,
  onClose,
  closeAriaLabel,
  footer,
}: SkinInnerProps) => (
  <div
    className={cn(
      RESULT_POPUP_CARD_SHELL_CLASS,
      "relative overflow-hidden rounded-sm bg-[#8b5a2b] p-[7px] shadow-[0_14px_32px_rgba(40,20,0,0.35)]",
    )}
  >
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2px] bg-[#1f4a38] text-[#f3efe0]">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-18deg, transparent, transparent 11px, rgba(255,255,255,0.07) 11px, rgba(255,255,255,0.07) 12px)",
        }}
        aria-hidden
      />
      <HeaderClose
        show={showHeaderClose}
        onClose={onClose}
        ariaLabel={closeAriaLabel}
        className="absolute top-3 right-3 z-10 rounded-full text-[#f3efe0] hover:bg-white/10 hover:text-white"
        iconClassName="text-[#f3efe0]"
      />
      <div className="relative shrink-0 px-5 pt-7 pb-3 text-center">{titleNode}</div>
      <PopupScrollBody className="relative space-y-4 px-5 pt-1 pb-5 text-center">
        <WinnerName
          name={winnerName}
          className="line-clamp-2 text-3xl font-semibold tracking-wide text-[#f3efe0]"
        />
        <div
          className="mx-auto h-px w-28 border-b border-dashed border-[#f3efe0]/45"
          aria-hidden
        />
        <WinnerMedia
          imageSrc={imageSrc}
          message={message}
          messageClassName="text-[#f3efe0]/75"
          imageClassName="border border-[#f3efe0]/25"
        />
      </PopupScrollBody>
      {footer}
    </div>
  </div>
);

const TapeCard = ({
  titleNode,
  winnerName,
  message,
  imageSrc,
  headerStyle,
  footer,
}: SkinInnerProps) => {
  const extra = Boolean(imageSrc || message);
  const tapeStyle = resolveResultPopupTapeStyle(headerStyle);

  return (
    <div
      className={cn(
        RESULT_POPUP_CARD_SHELL_CLASS,
        "relative overflow-visible pointer-events-none",
      )}
    >
      <div className="sr-only">{titleNode}</div>
      <div className="relative w-full shrink-0 overflow-visible pt-16 pb-8">
        <div className="relative left-1/2 flex w-[110%] -translate-x-1/2 -rotate-6 flex-col items-center">
          <div
            className="pointer-events-auto w-full border-y-[3px] border-white px-10 py-12 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            style={tapeStyle}
          >
            <WinnerName
              name={winnerName}
              className={cn(
                RESULT_POPUP_TAPE_NAME_CLASS,
                "text-4xl font-black tracking-wide uppercase",
              )}
              style={{ color: tapeStyle.color }}
            />
          </div>
          <div className="pointer-events-auto mt-3">{footer}</div>
        </div>
      </div>
      {extra ? (
        <PopupScrollBody
          className={cn(RESULT_POPUP_TAPE_EXTRA_PANEL_CLASS, "pointer-events-auto")}
        >
          <WinnerMedia
            imageSrc={imageSrc}
            message={message}
            messageClassName="text-sm text-zinc-100"
            imageClassName="ring-1 ring-white/20"
          />
        </PopupScrollBody>
      ) : null}
    </div>
  );
};

const BroadcastCard = ({
  titleNode,
  winnerName,
  message,
  imageSrc,
  headerStyle,
  footer,
}: SkinInnerProps) => {
  const extra = Boolean(imageSrc || message);
  const accent = resolveResultPopupTapeStyle(headerStyle);

  return (
    <div className={cn(RESULT_POPUP_CARD_SHELL_CLASS, "justify-end overflow-visible")}>
      {extra ? (
        <PopupScrollBody className={cn(RESULT_POPUP_TAPE_EXTRA_PANEL_CLASS, "mt-0 mb-3")}>
          <WinnerMedia
            imageSrc={imageSrc}
            message={message}
            messageClassName="text-sm text-zinc-100"
            imageClassName="ring-1 ring-white/20"
          />
        </PopupScrollBody>
      ) : null}
      <div className="flex w-full shrink-0 items-stretch bg-black/85 text-white shadow-[0_-10px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-md">
        <div
          className="w-2 shrink-0"
          style={{ backgroundColor: accent.backgroundColor }}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1 text-left">
            {titleNode}
            <WinnerName
              name={winnerName}
              className="mt-0.5 line-clamp-2 text-2xl font-black tracking-tight text-white uppercase"
            />
          </div>
          <div className="shrink-0">{footer}</div>
        </div>
      </div>
    </div>
  );
};

const titleClassBySkin = (skin: ResultPopupSkinId): string => {
  const clamp = RESULT_POPUP_TITLE_CLAMP_CLASS;
  if (skin === "classic") {
    return cn(clamp, "flex-1 text-base font-semibold");
  }
  if (skin === "tape") {
    return cn(clamp, "text-sm font-semibold tracking-wide text-white/80");
  }
  if (skin === "chalk") {
    return cn(
      clamp,
      "text-xs font-semibold tracking-[0.22em] text-[#f3efe0]/80 uppercase",
    );
  }
  return cn(
    clamp,
    "text-[11px] font-semibold tracking-[0.22em] text-white/70 uppercase",
  );
};

export const ResultPopupCard = ({
  skin,
  title,
  winnerName,
  message,
  imageSrc,
  headerStyle,
  showHeaderClose,
  onClose,
  closeAriaLabel,
  footer,
}: ResultPopupCardProps) => {
  const titleStyle =
    skin === "classic" && headerStyle?.color
      ? { color: headerStyle.color }
      : undefined;
  const titleNode = (
    <p className={titleClassBySkin(skin)} style={titleStyle} title={title}>
      {title}
    </p>
  );
  const inner: SkinInnerProps = {
    titleNode,
    winnerName,
    message,
    imageSrc,
    headerStyle,
    showHeaderClose,
    onClose,
    closeAriaLabel,
    footer,
  };

  if (skin === "tape") return <TapeCard {...inner} />;
  if (skin === "chalk") return <ChalkCard {...inner} />;
  if (skin === "broadcast") return <BroadcastCard {...inner} />;
  return <CardSkin {...inner} />;
};
