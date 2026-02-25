"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GOLD_PALETTE = ["#d4af37", "#f0c040", "#c9a227", "#ffd700"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

type StarData = {
  left: number;
  top: number;
  size: number;
  color: string;
  opacity: number;
  twinkleDur: number;
  twinkleDelay: number;
};

function generateStars(
  count: number,
  sizeMin: number,
  sizeMax: number,
  opacityMin: number,
  opacityMax: number,
  palette: string[]
): StarData[] {
  const stars: StarData[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      color: pick(palette, Math.floor(Math.random() * palette.length)),
      opacity: opacityMin + Math.random() * (opacityMax - opacityMin),
      twinkleDur: 3 + Math.random() * 4,
      twinkleDelay: Math.random() * 5,
    });
  }
  return stars;
}

const CURSOR_RADIUS = 150;
const FORCE_STRENGTH = 0.15;
const SIZE_FACTOR_BASE = 2.5; // star of this size has factor 1

function applyStarMagnetic(
  mouseX: number,
  mouseY: number,
  star: StarData,
  w: number,
  h: number
): { moveX: number; moveY: number } {
  const starX = (star.left / 100) * w;
  const starY = (star.top / 100) * h;
  const dx = mouseX - starX;
  const dy = mouseY - starY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= CURSOR_RADIUS) {
    return { moveX: 0, moveY: 0 };
  }

  const force = 1 - distance / CURSOR_RADIUS;
  const sizeFactor = star.size / SIZE_FACTOR_BASE;
  const moveX = -dx * force * FORCE_STRENGTH * sizeFactor;
  const moveY = -dy * force * FORCE_STRENGTH * sizeFactor;
  return { moveX, moveY };
}

/* Very subtle shooting star – 1–2 only, infrequent */
function ShootingStar({ delay }: { delay: number }) {
  return (
    <div
      className="pointer-events-none absolute left-0 top-0 overflow-visible opacity-40"
      aria-hidden
      style={{
        animation: "shootingStarSubtle 2.5s ease-out infinite",
        animationDelay: `${delay}s`,
        willChange: "transform",
      }}
    >
      <div
        className="absolute top-1/2 h-px -translate-y-1/2 rounded-full"
        style={{
          left: "-40px",
          width: "40px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.15) 40%, rgba(255,215,0,0.35) 100%)",
          boxShadow: "0 0 3px 1px rgba(255,215,0,0.2)",
        }}
      />
      <div
        className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 -translate-x-0.5 rounded-full bg-[#ffd700]"
        style={{ boxShadow: "0 0 3px 1px rgba(255,215,0,0.4)" }}
      />
    </div>
  );
}

export default function BackgroundPattern() {
  const [layer1, setLayer1] = useState<StarData[]>([]);
  const [layer2, setLayer2] = useState<StarData[]>([]);
  const [layer3, setLayer3] = useState<StarData[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const layer1Ref = useRef<(HTMLSpanElement | null)[]>([]);
  const layer2Ref = useRef<(HTMLSpanElement | null)[]>([]);
  const layer3Ref = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setLayer1(generateStars(60, 1, 2, 0.2, 0.4, GOLD_PALETTE));
    setLayer2(generateStars(45, 1.5, 2.5, 0.25, 0.45, GOLD_PALETTE));
    setLayer3(generateStars(35, 2, 4, 0.3, 0.5, GOLD_PALETTE));
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  useEffect(() => {
    const tick = () => {
      const { x: mouseX, y: mouseY } = mouseRef.current;
      const w = typeof window !== "undefined" ? window.innerWidth : 1920;
      const h = typeof window !== "undefined" ? window.innerHeight : 1080;

      const updateLayer = (stars: StarData[], refs: React.MutableRefObject<(HTMLSpanElement | null)[]>) => {
        stars.forEach((star, i) => {
          const el = refs.current[i];
          if (!el) return;
          const { moveX, moveY } = applyStarMagnetic(mouseX, mouseY, star, w, h);
          el.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
        });
      };

      updateLayer(layer1, layer1Ref);
      updateLayer(layer2, layer2Ref);
      updateLayer(layer3, layer3Ref);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [layer1, layer2, layer3]);

  const renderStar = (
    s: StarData,
    i: number,
    layerRef: React.MutableRefObject<(HTMLSpanElement | null)[]>
  ) => (
    <span
      key={i}
      ref={(el) => {
        layerRef.current[i] = el;
      }}
      className="star-twinkle-glow absolute rounded-full"
      style={{
        left: `${s.left}%`,
        top: `${s.top}%`,
        width: s.size,
        height: s.size,
        backgroundColor: s.color,
        opacity: s.opacity,
        transform: "translate(-50%, -50%)",
        transition: "transform 0.3s ease-out",
        boxShadow: "0 0 3px 1px #ffd700",
        animation: `starTwinkleGlow ${s.twinkleDur}s ease-in-out infinite`,
        animationDelay: `${s.twinkleDelay}s`,
      }}
      aria-hidden
    />
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden bg-[#FFFFFF] dark:bg-[#0a0a0f]"
      aria-hidden
    >
      {/* Gold rings + dashed circles – behind mesh and stars (z-index: -1) */}
      <div
        className="absolute inset-0 dark:opacity-90"
        style={{ zIndex: -1 }}
        aria-hidden
      >
        {/* 2 large gold rings */}
        <div
          className="absolute rounded-full border border-[#d4af37] bg-transparent"
          style={{
            width: "min(90vmin, 560px)",
            height: "min(90vmin, 560px)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.25,
            borderWidth: "1px",
          }}
        />
        <div
          className="absolute rounded-full border border-[#d4af37] bg-transparent"
          style={{
            width: "min(70vmin, 420px)",
            height: "min(70vmin, 420px)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.2,
            borderWidth: "1px",
          }}
        />
        {/* Dashed circular lines – 1px dashed rgba(255, 215, 0, 0.2) */}
        <div
          className="absolute rounded-full bg-transparent"
          style={{
            width: "min(85vmin, 500px)",
            height: "min(85vmin, 500px)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            border: "1px dashed rgba(255, 215, 0, 0.2)",
          }}
        />
        <div
          className="absolute rounded-full bg-transparent"
          style={{
            width: "min(60vmin, 360px)",
            height: "min(60vmin, 360px)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            border: "1px dashed rgba(255, 215, 0, 0.2)",
          }}
        />
        <div
          className="absolute rounded-full bg-transparent"
          style={{
            width: "min(40vmin, 240px)",
            height: "min(40vmin, 240px)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            border: "1px dashed rgba(255, 215, 0, 0.2)",
          }}
        />
      </div>

      {/* Mesh gradient: soft blurry orbs (light mode only) – Pure White + Anti-Flash White */}
      <div className="absolute inset-0 dark:opacity-0" aria-hidden>
        <div
          className="absolute rounded-full opacity-65"
          style={{
            width: "85vmax",
            height: "85vmax",
            left: "-20%",
            top: "-15%",
            background: "#F2F2F2",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute rounded-full opacity-55"
          style={{
            width: "75vmax",
            height: "75vmax",
            right: "-25%",
            bottom: "-10%",
            background: "#F2F2F2",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute rounded-full opacity-45"
          style={{
            width: "60vmax",
            height: "60vmax",
            left: "30%",
            bottom: "-20%",
            background: "#F2F2F2",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute rounded-full opacity-50"
          style={{
            width: "55vmax",
            height: "55vmax",
            right: "10%",
            top: "-15%",
            background: "#F2F2F2",
            filter: "blur(85px)",
          }}
        />
      </div>

      {/* Abstract geometric shapes: rings + dashed curves (on mesh, behind stars) */}
      <div className="absolute inset-0 dark:opacity-80" aria-hidden>
        {/* Large hollow circles (rings) – thin gold border, low opacity */}
        <div
          className="bg-shape-float absolute rounded-full border border-[#d4af37]"
          style={{
            width: "min(85vmin, 520px)",
            height: "min(85vmin, 520px)",
            left: "5%",
            top: "10%",
            opacity: 0.2,
            borderWidth: "1px",
          }}
        />
        <div
          className="bg-shape-rotate absolute rounded-full border border-[#d4af37]"
          style={{
            width: "min(70vmin, 420px)",
            height: "min(70vmin, 420px)",
            right: "0%",
            bottom: "15%",
            opacity: 0.15,
            borderWidth: "1px",
          }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="bg-shape-float-alt rounded-full border border-[#d4af37]"
            style={{
              width: "min(55vmin, 340px)",
              height: "min(55vmin, 340px)",
              opacity: 0.12,
              borderWidth: "1px",
            }}
          />
        </div>

        {/* Dashed curved lines – SVG paths (viewBox 0 0 100 100 = % of area) */}
        <svg
          className="absolute inset-0 h-full w-full bg-shape-float-alt"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
          aria-hidden
        >
          <defs>
            <linearGradient id="goldLine1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffd700" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="goldLine2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path
            d="M -5 25 Q 30 5, 60 30 T 115 20 T 110 55"
            fill="none"
            stroke="url(#goldLine1)"
            strokeWidth="0.4"
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
          <path
            d="M 0 55 C 35 15, 65 85, 100 45"
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.4"
            strokeDasharray="3 5"
            strokeLinecap="round"
            opacity="0.2"
          />
          <path
            d="M 95 0 Q 55 40, 15 75 T -5 105"
            fill="none"
            stroke="url(#goldLine2)"
            strokeWidth="0.4"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Layer 1 – subtle drift + per-star cursor reaction */}
      <div className="star-drift-subtle-1 absolute inset-0">
        {layer1.map((s, i) => renderStar(s, i, layer1Ref))}
      </div>
      {/* Layer 2 */}
      <div className="star-drift-subtle-2 absolute inset-0">
        {layer2.map((s, i) => renderStar(s, i, layer2Ref))}
      </div>
      {/* Layer 3 */}
      <div className="star-drift-subtle-3 absolute inset-0">
        {layer3.map((s, i) => renderStar(s, i, layer3Ref))}
      </div>

      {/* Dark mode: extra subtle stars (no mouse reaction for simplicity) */}
      <div className="dark:block hidden absolute inset-0" aria-hidden>
        <div className="star-drift-subtle-4 absolute inset-0">
          {layer3.length > 0 &&
            layer3.slice(0, 6).map((s, i) => (
              <span
                key={`dm-${i}`}
                className="star-twinkle-glow absolute rounded-full"
                style={{
                  left: `${(s.left + 15) % 100}%`,
                  top: `${(s.top + 10) % 100}%`,
                  width: Math.min(s.size + 0.5, 4),
                  height: Math.min(s.size + 0.5, 4),
                  backgroundColor: "#fff8e7",
                  opacity: 0.35,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 3px 1px #ffd700",
                  animation: `starTwinkleGlow ${s.twinkleDur}s ease-in-out infinite`,
                  animationDelay: `${s.twinkleDelay + 1}s`,
                }}
                aria-hidden
              />
            ))}
        </div>
      </div>

      {/* 2 very subtle shooting stars, infrequent */}
      <ShootingStar delay={0} />
      <ShootingStar delay={45} />
    </div>
  );
}
