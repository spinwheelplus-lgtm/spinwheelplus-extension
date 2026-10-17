import { type ReactNode } from "react";

import { HelpTip, type HelpTipProps } from "@/components/ui/help-tip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";

export { dismissOpenHelpTips, HelpTip, type HelpTipProps } from "@/components/ui/help-tip";

export type SelectOption = {
  label: string;
  value: string;
};

type SectionProps = {
  title: string;
  titleHelp?: HelpTipProps;
  trailing?: ReactNode;
  children: ReactNode;
};

type FieldCardProps = {
  children: ReactNode;
  className?: string;
};

type ToggleRowProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title?: string;
  helpLabel?: string;
  helpTitle?: string;
  helpText?: ReactNode;
};

type SelectRowProps = {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onValueChange: (value: string) => void;
  ariaLabel: string;
  helpLabel?: string;
  helpTitle?: string;
  helpText?: ReactNode;
};

type FieldRowProps = {
  children: ReactNode;
  className?: string;
};

type FieldLabelProps = {
  children: ReactNode;
  className?: string;
};

type FieldColorBarProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  title?: string;
  disabled?: boolean;
};

type FieldLabelHelpProps = {
  children: ReactNode;
  helpLabel: string;
  helpTitle: string;
  helpText: ReactNode;
  className?: string;
};

type NativeSelectProps = {
  value: string;
  options: readonly SelectOption[];
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
  className?: string;
  onValueChange: (value: string) => void;
};

export const moreButtonClass =
  "border-2 border-dashed border-[#bbb] text-[#e74d3d] hover:border-[#e74d3d] hover:text-[#e74d3d]";
export const moreIconClass = "text-[#e74d3d]";

export const SWATCH_REMOVE_BADGE_CLASS =
  "absolute -top-2 -right-2 z-10 flex size-6 items-center justify-center rounded-full border border-white bg-[#ff0000] p-0 text-white shadow-sm hover:bg-[#e60000] hover:text-white";

export const STRIPPED_NATIVE_COLOR_INPUT_CLASS = cn(
  "box-border size-full min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent p-0 outline-none",
  "[appearance:none] [-webkit-appearance:none]",
  "[&::-webkit-color-swatch-wrapper]:border-0 [&::-webkit-color-swatch-wrapper]:rounded-lg [&::-webkit-color-swatch-wrapper]:p-0",
  "[&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none",
  "[&::-moz-color-swatch]:rounded-lg [&::-moz-color-swatch]:border-0",
);

export const themePreviewBackground = (colors: string[]): string => {
  const step = 360 / colors.length;
  return `conic-gradient(${colors
    .map((color, index) => {
      const start = index * step;
      const end = (index + 1) * step;
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ")})`;
};

const isLikelyLightHex = (hex: string): boolean => {
  const raw = hex.replace("#", "").trim();
  if (!/^[\da-f]{6}$/i.test(raw)) return false;
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 222;
};

export const rimSwatchFrameClass = (hex: string): string =>
  cn(
    "inline-flex size-12 shrink-0 overflow-hidden rounded-xl bg-background shadow-sm ring-1 ring-border/45",
    isLikelyLightHex(hex)
      ? "border-2 border-slate-400/70"
      : "border border-border",
  );

export const Section = ({ title, titleHelp, trailing, children }: SectionProps) => (
  <section className="space-y-3">
    <div className="flex items-center gap-3">
      <h3 className="shrink-0 text-base font-semibold">{title}</h3>
      {titleHelp ? (
        <HelpTip
          helpLabel={titleHelp.helpLabel}
          helpTitle={titleHelp.helpTitle}
          helpText={titleHelp.helpText}
        />
      ) : null}
      <div className="h-px flex-1 bg-primary/35" />
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
    {children}
  </section>
);

export const FieldCard = ({ children, className }: FieldCardProps) => (
  <div
    className={cn(
      "space-y-4 rounded-xl border border-border bg-muted p-3",
      className,
    )}
  >
    {children}
  </div>
);

export const SETTINGS_ROW_CLASS =
  "flex min-h-9 items-center gap-2 rounded-lg border border-border/80 bg-background px-3 py-2";

export const ToggleRow = ({
  label,
  checked,
  onCheckedChange,
  title,
  helpLabel,
  helpTitle,
  helpText,
}: ToggleRowProps) => {
  const hasHelp = Boolean(helpLabel && helpTitle && helpText);
  const tip = title ?? label;
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-0.5">
        <span className="leading-snug">{label}</span>
        {hasHelp ? (
          <HelpTip
            helpLabel={helpLabel as string}
            helpTitle={helpTitle as string}
            helpText={helpText}
          />
        ) : null}
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
        title={tip}
      />
    </>
  );

  if (hasHelp) {
    return <div className={cn(SETTINGS_ROW_CLASS, "justify-between")}>{body}</div>;
  }

  return (
    <label className={cn(SETTINGS_ROW_CLASS, "cursor-pointer justify-between")} title={tip}>
      {body}
    </label>
  );
};

export const SelectRow = ({
  label,
  value,
  options,
  onValueChange,
  ariaLabel,
  helpLabel,
  helpTitle,
  helpText,
}: SelectRowProps) => (
  <div className={SETTINGS_ROW_CLASS}>
    <span className="flex shrink-0 items-center gap-0.5">
      <span className="text-sm font-medium leading-snug">{label}</span>
      {helpLabel && helpTitle && helpText ? (
        <HelpTip
          helpLabel={helpLabel}
          helpTitle={helpTitle}
          helpText={helpText}
        />
      ) : null}
    </span>
    <NativeSelect
      ariaLabel={ariaLabel}
      value={value}
      options={options}
      className="h-8 bg-muted/30"
      onValueChange={onValueChange}
    />
  </div>
);

export const fieldControlClass = "flex min-w-0 flex-1 items-center gap-2";

export const FieldRow = ({ children, className }: FieldRowProps) => (
  <div className={cn("flex min-h-9 items-center gap-3", className)}>{children}</div>
);

export const FieldLabel = ({ children, className }: FieldLabelProps) => (
  <span className={cn("shrink-0 text-sm font-medium", className)}>{children}</span>
);

type FieldRangeProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  suffix?: string;
  ariaLabel: string;
  title?: string;
  disabled?: boolean;
  onValueChange: (value: number) => void;
};

export const FieldRange = ({
  min,
  max,
  step = 1,
  value,
  suffix = "",
  ariaLabel,
  title,
  disabled = false,
  onValueChange,
}: FieldRangeProps) => {
  const span = max - min;
  const pct = span > 0 ? ((value - min) / span) * 100 : 0;

  return (
    <div className={fieldControlClass}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        title={title}
        className="customize-range min-w-0 flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, var(--primary) ${pct}%, var(--border) ${pct}%)`,
        }}
        onChange={(event) => onValueChange(Number(event.target.value))}
      />
      <span className="w-11 shrink-0 text-right text-sm tabular-nums">
        {value}
        {suffix}
      </span>
    </div>
  );
};

export const FieldColorBar = ({
  value,
  onChange,
  ariaLabel,
  title,
  disabled = false,
}: FieldColorBarProps) => (
  <span
    className={cn(
      "inline-flex h-9 min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-background",
      disabled && "pointer-events-none opacity-50",
    )}
  >
    <input
      type="color"
      aria-label={ariaLabel}
      title={title}
      value={value}
      disabled={disabled}
      className={cn(
        STRIPPED_NATIVE_COLOR_INPUT_CLASS,
        "size-full min-h-0 min-w-0 cursor-pointer",
        disabled && "cursor-not-allowed",
      )}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  </span>
);

export const FieldLabelHelp = ({
  children,
  helpLabel,
  helpTitle,
  helpText,
  className,
}: FieldLabelHelpProps) => (
  <div
    className={cn(
      "flex w-auto shrink-0 items-center justify-start gap-0.5",
      className,
    )}
  >
    <span className="text-sm font-medium">{children}</span>
    <HelpTip helpLabel={helpLabel} helpTitle={helpTitle} helpText={helpText} />
  </div>
);

export const NativeSelect = ({
  value,
  options,
  disabled = false,
  ariaLabel,
  title,
  className,
  onValueChange,
}: NativeSelectProps) => (
  <select
    aria-label={ariaLabel}
    title={title}
    disabled={disabled}
    value={value}
    className={cn(
      "h-9 min-w-0 flex-1 cursor-pointer rounded-lg border border-border bg-background px-3 text-sm",
      "disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    onChange={(event) => onValueChange(event.target.value)}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
