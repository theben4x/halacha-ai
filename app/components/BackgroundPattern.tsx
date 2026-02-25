"use client";

/* Gold parallax stars – 3 layers, dark background. Only visible in dark mode. */

const GOLD = "#FFD700";
const GOLDENROD = "#DAA520";
const DARK_GOLD = "#B8860B";

type Star = { left: number; top: number; size: number; glow?: boolean; twinkle?: boolean; color: string };

/* Layer 1: far (small, slow) */
const LAYER_BACK: Star[] = [
  { left: 5, top: 10, size: 2, color: GOLD, twinkle: true },
  { left: 18, top: 22, size: 2, color: GOLDENROD },
  { left: 32, top: 8, size: 2, color: GOLD, glow: true, twinkle: true },
  { left: 45, top: 35, size: 2, color: DARK_GOLD },
  { left: 58, top: 15, size: 2, color: GOLDENROD, twinkle: true },
  { left: 72, top: 42, size: 2, color: GOLD },
  { left: 88, top: 18, size: 2, color: GOLDENROD, glow: true },
  { left: 12, top: 55, size: 2, color: GOLD, twinkle: true },
  { left: 28, top: 68, size: 2, color: DARK_GOLD },
  { left: 52, top: 72, size: 2, color: GOLDENROD, twinkle: true },
  { left: 78, top: 58, size: 2, color: GOLD },
  { left: 92, top: 78, size: 2, color: GOLDENROD, glow: true, twinkle: true },
  { left: 8, top: 85, size: 2, color: GOLD },
  { left: 65, top: 5, size: 2, color: DARK_GOLD, twinkle: true },
  { left: 38, top: 88, size: 2, color: GOLDENROD },
];

/* Layer 2: mid (medium, medium speed) */
const LAYER_MID: Star[] = [
  { left: 10, top: 25, size: 3, color: GOLD, glow: true },
  { left: 25, top: 12, size: 3, color: GOLDENROD, twinkle: true },
  { left: 42, top: 45, size: 3, color: GOLD },
  { left: 55, top: 28, size: 3, color: DARK_GOLD, twinkle: true },
  { left: 70, top: 8, size: 3, color: GOLDENROD, glow: true, twinkle: true },
  { left: 85, top: 52, size: 3, color: GOLD },
  { left: 15, top: 62, size: 3, color: GOLDENROD },
  { left: 48, top: 65, size: 3, color: GOLD, twinkle: true },
  { left: 75, top: 75, size: 3, color: DARK_GOLD, glow: true },
  { left: 5, top: 42, size: 3, color: GOLD, twinkle: true },
  { left: 35, top: 78, size: 3, color: GOLDENROD },
  { left: 62, top: 48, size: 3, color: GOLD },
  { left: 22, top: 38, size: 3, color: DARK_GOLD, twinkle: true },
  { left: 90, top: 32, size: 3, color: GOLDENROD, glow: true },
  { left: 8, top: 92, size: 3, color: GOLD },
  { left: 95, top: 88, size: 3, color: GOLDENROD, twinkle: true },
];

/* Layer 3: front (slightly larger, faster) */
const LAYER_FRONT: Star[] = [
  { left: 14, top: 18, size: 4, color: GOLD, glow: true, twinkle: true },
  { left: 36, top: 32, size: 4, color: GOLDENROD, twinkle: true },
  { left: 52, top: 12, size: 4, color: GOLD },
  { left: 68, top: 38, size: 4, color: DARK_GOLD, glow: true },
  { left: 82, top: 22, size: 4, color: GOLDENROD, twinkle: true },
  { left: 6, top: 48, size: 4, color: GOLD, twinkle: true },
  { left: 44, top: 58, size: 4, color: GOLDENROD },
  { left: 76, top: 62, size: 4, color: GOLD, glow: true, twinkle: true },
  { left: 20, top: 72, size: 4, color: DARK_GOLD },
  { left: 58, top: 82, size: 4, color: GOLDENROD, twinkle: true },
  { left: 92, top: 68, size: 4, color: GOLD },
  { left: 30, top: 5, size: 4, color: GOLD, glow: true },
  { left: 88, top: 42, size: 4, color: GOLDENROD, twinkle: true },
  { left: 12, top: 88, size: 4, color: GOLD },
  { left: 50, top: 48, size: 4, color: DARK_GOLD, twinkle: true },
  { left: 64, top: 28, size: 4, color: GOLDENROD, glow: true },
];

function StarDot({ star, className }: { star: Star; className?: string }) {
  return (
    <span
      className={`absolute rounded-full ${star.glow ? "star--glow" : ""} ${star.twinkle ? "star--twinkle" : ""} ${className ?? ""}`}
      style={{
        left: `${star.left}%`,
        top: `${star.top}%`,
        width: star.size,
        height: star.size,
        backgroundColor: star.color,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden
    />
  );
}

function StarLayer({
  stars,
  layerClass,
}: {
  stars: Star[];
  layerClass: "star-layer--back" | "star-layer--mid" | "star-layer--front";
}) {
  return (
    <div className={`star-layer ${layerClass} absolute inset-0`} aria-hidden>
      {stars.map((star, i) => (
        <StarDot key={i} star={star} />
      ))}
    </div>
  );
}

export default function BackgroundPattern() {
  return (
    <>
      {/* Light mode: subtle grid (original) */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-[0.1] dark:opacity-0"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(var(--halacha-gold) 1px, transparent 1px),
            linear-gradient(90deg, var(--halacha-gold) 1px, transparent 1px),
            linear-gradient(135deg, var(--halacha-gold) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "48px 48px, 48px 48px, 32px 32px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
      {/* Dark mode: gold parallax stars on deep night background */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden dark:block hidden"
        aria-hidden
        style={{ background: "linear-gradient(180deg, #030712 0%, #020617 50%, #0a0a0f 100%)" }}
      >
        <StarLayer stars={LAYER_BACK} layerClass="star-layer--back" />
        <StarLayer stars={LAYER_MID} layerClass="star-layer--mid" />
        <StarLayer stars={LAYER_FRONT} layerClass="star-layer--front" />
      </div>
    </>
  );
}
