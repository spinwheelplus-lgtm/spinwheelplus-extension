
import {
  FLIP_A_COIN_ASSETS,
  type FlipCoinMetal,
} from "@/lib/coin-flip/flip-a-coin-assets";
import { getFlipCoinMetalLabel } from "@/lib/coin-flip/flip-a-coin-metal-options";
import { cn } from "@/lib/cn";

const COIN_THUMB_ADD_CLASS =
    "size-12 rounded-full object-cover shadow-sm ring-2 ring-transparent";
const COIN_THUMB_SLOT_CLASS =
    "size-14 rounded-full object-cover shadow-md ring-2 ring-foreground/10";

type FlipACoinCoinThumbProps = {
    metal: FlipCoinMetal;
    variant: "add" | "slot";
    className?: string;
};

const FlipACoinCoinThumb = ({
    metal,
    variant,
    className,
}: FlipACoinCoinThumbProps) => (
    <img
        src={FLIP_A_COIN_ASSETS[metal].headsSrc}
        alt={getFlipCoinMetalLabel(metal)}
        width={variant === "add" ? 48 : 56}
        height={variant === "add" ? 48 : 56}
        className={cn(
            variant === "add" ? COIN_THUMB_ADD_CLASS : COIN_THUMB_SLOT_CLASS,
            className,
        )}
        loading="lazy"
        decoding="async"
        draggable={false}
    />
);

export default FlipACoinCoinThumb;
