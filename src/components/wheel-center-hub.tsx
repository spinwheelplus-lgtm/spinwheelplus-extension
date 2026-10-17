import { pickWheelTextColor } from "@/lib/item-color";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/use-messages";

const PIN_VIEWBOX = "0 0 100 118";
const PIN_PATH = "M 50 5 L 65.5 31.5 A 36 36 0 1 1 34.5 31.5 Z";
const PIN_STROKE_WIDTH = 4.2;

type WheelCenterHubProps = {
  fill: string;
  outline: string;
  spinning: boolean;
  canStop?: boolean;
  onSpin: () => void;
};

export const WheelCenterHub = ({
  fill,
  outline,
  spinning,
  canStop = false,
  onSpin,
}: WheelCenterHubProps) => {
  const wheel = useMessages().ui.wheel;
  const label = canStop ? wheel.stop : spinning ? "..." : wheel.spin;
  const ariaLabel = canStop ? wheel.stopWheel : spinning ? wheel.spinning : wheel.spin;
  const title = canStop
    ? wheel.stopSpace
    : spinning
      ? wheel.spinning
      : wheel.spinSpace;

  return (
    <div
      className={cn(
        "@container/hub absolute top-1/2 left-1/2 z-20 aspect-[100/118] w-[20%] max-w-[20%] -translate-x-1/2 -translate-y-1/2",
        spinning && !canStop ? "cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
        viewBox={PIN_VIEWBOX}
      >
        <path d={PIN_PATH} fill={fill} />
        <path
          d={PIN_PATH}
          fill="none"
          stroke={outline}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={PIN_STROKE_WIDTH}
        />
      </svg>
      <button
        type="button"
        className={cn(
          "absolute inset-0 z-[2] flex size-full items-center justify-center pt-[9%] text-center text-[clamp(0.7rem,22cqw,1.05rem)] font-semibold leading-none tracking-tight",
          spinning && !canStop
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer",
        )}
        style={{ color: pickWheelTextColor(fill) }}
        onClick={onSpin}
        disabled={spinning && !canStop}
        aria-label={ariaLabel}
        title={title}
      >
        {label}
      </button>
    </div>
  );
};
