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

const LERP = 0.05;
const LAYER1_MOUSE_FACTOR = 0.02;
const LAYER2_MOUSE_FACTOR = 0.05;
const LAYER3_MOUSE_FACTOR = 0.08;

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
  const currentRef = useRef({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
  });
  const [transform, setTransform] = useState({
    layer1: "translate(0px, 0px)",
    layer2: "translate(0px, 0px)",
    layer3: "translate(0px, 0px)",
  });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setLayer1(generateStars(60, 1, 2, 0.2, 0.4, GOLD_PALETTE));
    setLayer2(generateStars(45, 1.5, 2.5, 0.25, 0.45, GOLD_PALETTE));
    setLayer3(generateStars(35, 2, 4, 0.3, 0.5, GOLD_PALETTE));
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1920;
    const h = typeof window !== "undefined" ? window.innerHeight : 1080;
    mouseRef.current = {
      x: e.clientX - w / 2,
      y: e.clientY - h / 2,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  useEffect(() => {
    const tick = () => {
      const { x: mx, y: my } = mouseRef.current;
      const c = currentRef.current;

      const t1x = mx * LAYER1_MOUSE_FACTOR;
      const t1y = my * LAYER1_MOUSE_FACTOR;
      const t2x = mx * LAYER2_MOUSE_FACTOR;
      const t2y = my * LAYER2_MOUSE_FACTOR;
      const t3x = mx * LAYER3_MOUSE_FACTOR;
      const t3y = my * LAYER3_MOUSE_FACTOR;

      c.x1 += (t1x - c.x1) * LERP;
      c.y1 += (t1y - c.y1) * LERP;
      c.x2 += (t2x - c.x2) * LERP;
      c.y2 += (t2y - c.y2) * LERP;
      c.x3 += (t3x - c.x3) * LERP;
      c.y3 += (t3y - c.y3) * LERP;

      setTransform({
        layer1: `translate(${c.x1}px, ${c.y1}px)`,
        layer2: `translate(${c.x2}px, ${c.y2}px)`,
        layer3: `translate(${c.x3}px, ${c.y3}px)`,
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const renderStar = (s: StarData, i: number) => (
    <span
      key={i}
      className="star-twinkle-glow absolute rounded-full"
      style={{
        left: `${s.left}%`,
        top: `${s.top}%`,
        width: s.size,
        height: s.size,
        backgroundColor: s.color,
        opacity: s.opacity,
        transform: "translate(-50%, -50%)",
        boxShadow: "0 0 3px 1px #ffd700",
        animation: `starTwinkleGlow ${s.twinkleDur}s ease-in-out infinite`,
        animationDelay: `${s.twinkleDelay}s`,
      }}
      aria-hidden
    />
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden bg-[#fffdf7] dark:bg-[#0a0a0f]"
      aria-hidden
    >
      {/* Layer 1 – tiny, 2% mouse + subtle drift */}
      <div className="star-drift-subtle-1 absolute inset-0">
        <div style={{ willChange: "transform", transform: transform.layer1 }} className="absolute inset-0">
          {layer1.map((s, i) => renderStar(s, i))}
        </div>
      </div>
      {/* Layer 2 – small, 5% mouse + subtle drift */}
      <div className="star-drift-subtle-2 absolute inset-0">
        <div style={{ willChange: "transform", transform: transform.layer2 }} className="absolute inset-0">
          {layer2.map((s, i) => renderStar(s, i))}
        </div>
      </div>
      {/* Layer 3 – medium, 8% mouse + subtle drift */}
      <div className="star-drift-subtle-3 absolute inset-0">
        <div style={{ willChange: "transform", transform: transform.layer3 }} className="absolute inset-0">
          {layer3.map((s, i) => renderStar(s, i))}
        </div>
      </div>

      {/* Dark mode: same subtle stars, slightly more visible on dark bg */}
      <div className="dark:block hidden absolute inset-0" aria-hidden>
        <div className="star-drift-subtle-4 absolute inset-0">
          <div style={{ willChange: "transform", transform: transform.layer3 }} className="absolute inset-0">
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
      </div>

      {/* 2 very subtle shooting stars, infrequent */}
      <ShootingStar delay={0} />
      <ShootingStar delay={45} />
    </div>
  );
}
