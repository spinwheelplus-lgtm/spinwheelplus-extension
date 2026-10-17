import type { ReactNode } from "react";

import { HelpTip } from "@/components/ui/help-tip";
import { cn } from "@/lib/cn";
import { FLIP_A_COIN_SECTION_TITLE_CLASS } from "@/lib/coin-flip/flip-a-coin-surface-classes";

type CoinSectionHeadingProps = {
  title: ReactNode;
  helpLabel: string;
  helpTitle: string;
  helpText: string;
  className?: string;
};

export const CoinSectionHeading = ({
  title,
  helpLabel,
  helpTitle,
  helpText,
  className,
}: CoinSectionHeadingProps) => (
  <div className={cn("flex min-h-6 items-center gap-1.5", className)}>
    <h2 className={FLIP_A_COIN_SECTION_TITLE_CLASS}>{title}</h2>
    <HelpTip helpLabel={helpLabel} helpTitle={helpTitle} helpText={helpText} />
  </div>
);
