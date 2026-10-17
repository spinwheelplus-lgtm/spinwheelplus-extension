import { type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useLocaleStore } from "@/store/locale-store";

export const ABOUT_PANEL_SHELL_CLASS =
  "mx-3 mt-3 rounded-2xl border border-border bg-card p-4 shadow-sm";
export const ABOUT_HEADING_CLASS = "min-w-0 flex-1 text-base font-semibold";
export const ABOUT_BODY_CLASS = "text-sm leading-relaxed text-muted-foreground";
export const ABOUT_LABEL_CLASS = "text-sm font-semibold text-foreground";

export const AboutPanelSection = ({
  labelledBy,
  children,
}: {
  labelledBy: string;
  children: ReactNode;
}) => (
  <section className={ABOUT_PANEL_SHELL_CLASS} aria-labelledby={labelledBy}>
    {children}
  </section>
);

type AboutSectionHeaderProps = {
  headingId: string;
  panelId: string;
  title: string;
  expanded: boolean;
  hideLabel: string;
  showLabel: string;
  onToggle: () => void;
  className?: string;
};

export const AboutSectionHeader = ({
  headingId,
  panelId,
  title,
  expanded,
  hideLabel,
  showLabel,
  onToggle,
  className,
}: AboutSectionHeaderProps) => {
  const messages = useLocaleStore((s) => s.messages);
  const actionLabel = expanded ? hideLabel : showLabel;
  const buttonText = expanded ? messages.hide : messages.show;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <h2 id={headingId} className={ABOUT_HEADING_CLASS}>
        {title}
      </h2>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        aria-expanded={expanded}
        aria-controls={panelId}
        title={actionLabel}
        aria-label={actionLabel}
        onClick={onToggle}
      >
        {buttonText}
      </Button>
    </div>
  );
};
