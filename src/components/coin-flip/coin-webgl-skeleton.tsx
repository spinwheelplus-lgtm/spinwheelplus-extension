import { FLIP_COIN_BASE_DIAMETER_PX } from "@/lib/coin-flip/flip-a-coin-assets";

/** Placeholder while the Three.js coin chunk loads. */
const FlipACoinWebGLSkeleton = () => (
    <div
        className="mx-auto aspect-square w-full max-w-[min(100%,280px)] animate-pulse rounded-full bg-muted/70"
        style={{ maxWidth: FLIP_COIN_BASE_DIAMETER_PX }}
        aria-hidden
    />
);

export default FlipACoinWebGLSkeleton;
