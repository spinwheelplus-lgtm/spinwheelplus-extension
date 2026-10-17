import { cn } from "@/lib/cn";

type SwitchProps = {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  "aria-label"?: string;
};

export const Switch = ({
  id,
  checked,
  onCheckedChange,
  disabled = false,
  className,
  title,
  "aria-label": ariaLabel,
}: SwitchProps) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    title={title ?? ariaLabel}
    disabled={disabled}
    className={cn(
      "relative inline-flex h-[18px] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors",
      "focus-visible:ring-2 focus-visible:ring-ring",
      checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-600",
      disabled && "cursor-not-allowed opacity-50",
      className,
    )}
    onClick={() => onCheckedChange(!checked)}
  >
    <span
      aria-hidden
      className={cn(
        "pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform",
        checked ? "translate-x-[14px]" : "translate-x-0.5",
      )}
    />
  </button>
);
