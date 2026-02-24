"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

function StarOfDavidIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
    >
      {/* Two overlapping triangles */}
      <polygon points="50,8 92,92 8,92" fill="currentColor" />
      <polygon points="50,92 8,8 92,8" fill="currentColor" />
    </svg>
  );
}

const floatVariants = {
  animate: {
    y: [0, -15, 0],
    x: [0, 8, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatVariantsSlow = {
  animate: {
    y: [0, 12, 0],
    x: [0, -10, 0],
    rotate: [0, -3, 0],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function BackgroundFloating() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Star of David - multiple instances */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-24 w-24 text-[var(--halacha-gold)] opacity-[0.07] dark:opacity-[0.08]"
        variants={floatVariants}
        initial="animate"
        animate="animate"
      >
        <StarOfDavidIcon className="h-full w-full" />
      </motion.div>
      <motion.div
        className="absolute right-[15%] top-[60%] h-32 w-32 text-[var(--halacha-navy)] opacity-[0.06] dark:text-[var(--halacha-gold)] dark:opacity-[0.07]"
        variants={floatVariantsSlow}
        initial="animate"
        animate="animate"
      >
        <StarOfDavidIcon className="h-full w-full" />
      </motion.div>
      <motion.div
        className="absolute bottom-[25%] left-[20%] h-20 w-20 text-[var(--halacha-gold)] opacity-[0.05] dark:opacity-[0.06]"
        variants={floatVariants}
        initial="animate"
        animate="animate"
      >
        <StarOfDavidIcon className="h-full w-full" />
      </motion.div>

      {/* Open book icons */}
      <motion.div
        className="absolute right-[20%] top-[15%] text-[var(--halacha-navy)] opacity-[0.06] dark:text-[var(--halacha-gold)] dark:opacity-[0.07]"
        variants={floatVariantsSlow}
        initial="animate"
        animate="animate"
      >
        <BookOpen className="h-16 w-16" strokeWidth={1.5} />
      </motion.div>
      <motion.div
        className="absolute bottom-[30%] right-[25%] text-[var(--halacha-gold)] opacity-[0.05] dark:opacity-[0.06]"
        variants={floatVariants}
        initial="animate"
        animate="animate"
      >
        <BookOpen className="h-20 w-20" strokeWidth={1.5} />
      </motion.div>
      <motion.div
        className="absolute left-[25%] top-[55%] text-[var(--halacha-navy)] opacity-[0.05] dark:text-[var(--halacha-gold)] dark:opacity-[0.06]"
        variants={floatVariantsSlow}
        initial="animate"
        animate="animate"
      >
        <BookOpen className="h-14 w-14" strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}
