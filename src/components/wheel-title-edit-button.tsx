import type { SVGProps } from "react";

import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";

type WheelTitleEditButtonProps = {
  disabled?: boolean;
  onClick: () => void;
};

const PencilSparklesIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...props}
  >
    <path d="M10 3H8" />
    <path d="m15.007 5.008 3.987 3.986" />
    <path d="M20 15v4" />
    <path d="M21.174 6.813a2.82 2.82 0 0 0-3.986-3.987L3.842 16.175a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="M22 17h-4" />
    <path d="M4 5v4" />
    <path d="M6 7H2" />
    <path d="M9 2v2" />
  </svg>
);

export const WheelTitleEditButton = ({
  disabled = false,
  onClick,
}: WheelTitleEditButtonProps) => {
  const editHeader = useMessages().ui.wheel.editHeader;
  return (
  <button
    type="button"
    disabled={disabled}
    className={cn(
      "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white p-0 text-neutral-700 shadow-sm",
      "ring-1 ring-black/10 transition-shadow",
      "hover:bg-white hover:text-neutral-900 hover:shadow-md hover:ring-black/20",
      "focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
    )}
    aria-label={editHeader}
    title={editHeader}
    onClick={onClick}
  >
    <PencilSparklesIcon className="size-3.5 translate-x-px -translate-y-px" />
  </button>
  );
};
