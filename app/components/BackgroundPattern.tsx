"use client";

import { useEffect, useState } from "react";

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
      twinkleDur: 2 + Math.random() * 3,
      twinkleDelay: Math.random() * 5,
    });
  }
  return stars;
}

const LIGHT_BG = "#fffdf7";
const DARK_BG = "#0a0a0f";

/* Shooting star: head + trail, diagonal streak across screen */
function ShootingStar({ delay }: { delay: number }) {
  return (
    <div
      className="pointer-events-none absolute left-0 top-0 overflow-visible"
      aria-hidden
      style={{
        animation: "shootingStar 2.2s ease-in-out infinite",
        animationDelay: `${delay}s`,
        willChange: "transform",
      }}
    >
      {/* Trail behind the head (to the left; head leads toward bottom-right) */}
      <div
        className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full"
        style={{
          left: "-70px",
          width: "70px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.3) 25%, rgba(255,215,0,0.7) 60%, #ffd700 100%)",
          boxShadow: "0 0 6px 2px rgba(255,215,0,0.4), 0 0 12px 4px rgba(240,192,64,0.3)",
        }}
      />
      {/* Bright head at leading edge */}
      <div
        className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 -translate-x-1 rounded-full bg-white"
        style={{
          boxShadow: "0 0 6px 2px #ffd700, 0 0 10px 4px rgba(255,255,255,0.8), 0 0 14px 6px rgba(255,215,0,0.5)",
        }}
      />
    </div>
  );
}

export default function BackgroundPattern() {
  const [layer1, setLayer1] = useState<StarData[]>([]);
  const [layer2, setLayer2] = useState<StarData[]>([]);
  const [layer3, setLayer3] = useState<StarData[]>([]);

  useEffect(() => {
    /* Layer 1: smaller, slower feel – 2–4px, opacity 0.6–0.85 */
    setLayer1(generateStars(55, 2, 4, 0.6, 0.85, GOLD_PALETTE));
    /* Layer 2: medium – 3–5px, opacity 0.7–0.95 */
    setLayer2(generateStars(40, 3, 5, 0.7, 0.95, GOLD_PALETTE));
    /* Layer 3: brighter/larger – 4–8px (some “bright” stars), opacity 0.75–1 */
    setLayer3(generateStars(30, 4, 8, 0.75, 1, GOLD_PALETTE));
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
        boxShadow: "0 0 6px 2px #ffd700, 0 0 12px 4px rgba(240,192,64,0.5)",
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
      {/* Layer 1 */}
      <div className="star-drift-1 absolute inset-0" style={{ willChange: "transform" }}>
        {layer1.map((s, i) => renderStar(s, i))}
      </div>
      {/* Layer 2 */}
      <div className="star-drift-2 absolute inset-0" style={{ willChange: "transform" }}>
        {layer2.map((s, i) => renderStar(s, i))}
      </div>
      {/* Layer 3 */}
      <div className="star-drift-3 absolute inset-0" style={{ willChange: "transform" }}>
        {layer3.map((s, i) => renderStar(s, i))}
      </div>

      {/* Dark mode: extra bright gold + white glow stars + white palette overlay feel is via same glow; we use same data but could swap palette in dark. For “bright gold + white” in dark we need stars to use GOLD_PALETTE_DARK when in dark mode. We can’t switch data by theme in SSR. So use CSS: in dark mode add a class that makes stars brighter or use a separate dark-only layer. Simpler: use one set of stars; in dark mode the #0a0a0f background makes gold pop. Optionally add a few “white” glow stars only in dark with a dark: variant. I'll add a small dark-only layer with white-gold stars. */}
      <div className="dark:block hidden absolute inset-0" aria-hidden>
        <div className="star-drift-4 absolute inset-0" style={{ willChange: "transform" }}>
          {layer3.length > 0 &&
            layer3.slice(0, 8).map((s, i) => (
              <span
                key={`dm-${i}`}
                className="star-twinkle-glow absolute rounded-full"
              style={{
                left: `${(s.left + 10) % 100}%`,
                top: `${(s.top + 5) % 100}%`,
                width: Math.min(s.size + 2, 8),
                height: Math.min(s.size + 2, 8),
                backgroundColor: "#fff8e7",
                opacity: 0.85,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 8px 2px #ffd700, 0 0 16px 6px rgba(255,255,255,0.4), 0 0 24px 8px rgba(255,215,0,0.3)",
                animation: `starTwinkleGlow ${s.twinkleDur}s ease-in-out infinite`,
                animationDelay: `${s.twinkleDelay + 1}s`,
              }}
              aria-hidden
              />
            ))}
        </div>
      </div>

      {/* Shooting stars – 5 with staggered delays */}
      <ShootingStar delay={0} />
      <ShootingStar delay={10} />
      <ShootingStar delay={22} />
      <ShootingStar delay={35} />
      <ShootingStar delay={48} />
    </div>
  );
}
