"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SpeechBubbleProps {
  children: ReactNode;
  /** Which side the tail points toward (where the avatar is). */
  tail?: "left" | "right" | "bottom";
  className?: string;
  delay?: number;
}

export default function SpeechBubble({
  children,
  tail = "bottom",
  className = "",
  delay = 0,
}: SpeechBubbleProps) {
  const reduce = useReducedMotion();
  const tailClasses = {
    left: "left-[-7px] top-1/2 -translate-y-1/2",
    right: "right-[-7px] top-1/2 -translate-y-1/2",
    bottom: "bottom-[-7px] left-1/2 -translate-x-1/2",
  }[tail];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
      className={`relative inline-block rounded-2xl bg-bg-paper px-4 py-2.5 font-serif text-text-charcoal paper-shadow ${className}`}
    >
      {children}
      <span
        aria-hidden
        className={`absolute h-3.5 w-3.5 rotate-45 bg-bg-paper ${tailClasses}`}
      />
    </motion.div>
  );
}
