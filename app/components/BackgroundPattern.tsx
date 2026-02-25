"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Gold star colors only */
const GOLD_PALETTE = ["#d4af37", "#f0c040", "#c9a227", "#ffd700"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

type StarData = { left: number; top: number; size: number; color: string; opacity: number; delay: number };

function generateStars(
  count: number,
  sizeMin: number,
  sizeMax: number,
  opacity: number
): StarData[] {
  const stars: StarData[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      color: pick(GOLD_PALETTE, Math.floor(Math.random() * GOLD_PALETTE.length)),
      opacity,
      delay: Math.random() * 4,
    });
  }
  return stars;
}

const LIGHT_BG = "#fffdf7";

/* Light mode: white background + gold stars (3 layers, twinkle, mouse parallax) */
function LightModeStars() {
  const [starsLayer1, setStarsLayer1] = useState<StarData[]>([]);
  const [starsLayer2, setStarsLayer2] = useState<StarData[]>([]);
  const [starsLayer3, setStarsLayer3] = useState<StarData[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setStarsLayer1(generateStars(80, 1, 1, 0.3));
    setStarsLayer2(generateStars(50, 1, 2, 0.5));
    setStarsLayer3(generateStars(35, 2, 3, 0.8));
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    lastRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { innerWidth, innerHeight } = window;
      const x = (lastRef.current.x / innerWidth) * 2 - 1;
      const y = (lastRef.current.y / innerHeight) * 2 - 1;
      setMouse({ x, y });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [onMouseMove]);

  const speed1 = 12;
  const speed2 = 28;
  const speed3 = 48;
  const tx1 = mouse.x * speed1;
  const ty1 = mouse.y * speed1;
  const tx2 = mouse.x * speed2;
  const ty2 = mouse.y * speed2;
  const tx3 = mouse.x * speed3;
  const ty3 = mouse.y * speed3;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden dark:hidden"
      aria-hidden
      style={{ backgroundColor: LIGHT_BG }}
    >
      <div
        className="star-layer absolute inset-0"
        style={{
          willChange: "transform",
          transform: `translate(${tx1}px, ${ty1}px)`,
        }}
      >
        {starsLayer1.map((s, i) => (
          <span
            key={i}
            className="star-twinkle-light absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              backgroundColor: s.color,
              opacity: s.opacity,
              transform: "translate(-50%, -50%)",
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
      <div
        className="star-layer absolute inset-0"
        style={{
          willChange: "transform",
          transform: `translate(${tx2}px, ${ty2}px)`,
        }}
      >
        {starsLayer2.map((s, i) => (
          <span
            key={i}
            className="star-twinkle-light absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              backgroundColor: s.color,
              opacity: s.opacity,
              transform: "translate(-50%, -50%)",
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
      <div
        className="star-layer absolute inset-0"
        style={{
          willChange: "transform",
          transform: `translate(${tx3}px, ${ty3}px)`,
        }}
      >
        {starsLayer3.map((s, i) => (
          <span
            key={i}
            className="star-twinkle-light absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              backgroundColor: s.color,
              opacity: s.opacity,
              transform: "translate(-50%, -50%)",
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* Dark mode: existing gold stars on deep night (unchanged) */
const GOLD = "#FFD700";
const GOLDENROD = "#DAA520";
const DARK_GOLD = "#B8860B";

type Star = { left: number; top: number; size: number; glow?: boolean; twinkle?: boolean; color: string };

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

function DarkStarLayer({
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
      <LightModeStars />
      {/* Dark mode: gold parallax stars on deep night background */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden dark:block hidden"
        aria-hidden
        style={{ background: "linear-gradient(180deg, #030712 0%, #020617 50%, #0a0a0f 100%)" }}
      >
        <DarkStarLayer stars={LAYER_BACK} layerClass="star-layer--back" />
        <DarkStarLayer stars={LAYER_MID} layerClass="star-layer--mid" />
        <DarkStarLayer stars={LAYER_FRONT} layerClass="star-layer--front" />
      </div>
    </>
  );
}
