"use client";

export default function BackgroundPattern() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-[0.1] dark:opacity-[0.13]"
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
  );
}
