import type { ReactNode } from "react";

import { HelpTip } from "@/components/ui/help-tip";
import { cn } from "@/lib/cn";
import { ROLL_A_DICE_SECTION_TITLE_CLASS } from "@/lib/dice-roller/roll-a-dice-surface-classes";

type DiceSectionHeadingProps = {
  title: ReactNode;
  helpLabel: string;
  helpTitle: string;
  helpText: string;
  className?: string;
};

export const DiceSectionHeading = ({
  title,
  helpLabel,
  helpTitle,
  helpText,
  className,
}: DiceSectionHeadingProps) => (
  <div className={cn("flex min-h-6 items-center gap-1.5", className)}>
    <h2 className={ROLL_A_DICE_SECTION_TITLE_CLASS}>{title}</h2>
    <HelpTip
      helpLabel={helpLabel}
      helpTitle={helpTitle}
      helpText={helpText}
    />
  </div>
);
