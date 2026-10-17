import type { DiceFrameLayout } from "@/lib/dice-roller/roll-a-dice-stage-layout";

type DiceGridSkeletonProps = {
  layout?: DiceFrameLayout | null;
  diceCount?: number;
};

export const DiceGridSkeleton = ({
  layout,
  diceCount,
}: DiceGridSkeletonProps) => {
  if (layout == null) {
    return (
      <div
        className="mx-auto size-[180px] animate-pulse rounded-lg bg-black/5"
        aria-hidden
      />
    );
  }

  const cellCount =
    diceCount != null && diceCount > 0
      ? diceCount
      : layout.columns * layout.rows;

  return (
    <div
      className="flex animate-pulse flex-wrap content-start justify-center"
      style={{
        gap: layout.gapPx,
        width: layout.gridWidthPx,
        height: layout.gridHeightPx,
      }}
      aria-hidden
    >
      {Array.from({ length: cellCount }, (_, index) => (
        <div
          key={index}
          className="shrink-0 rounded-md bg-black/[0.06]"
          style={{
            width: layout.frameSizePx,
            height: layout.frameSizePx,
          }}
        />
      ))}
    </div>
  );
};
