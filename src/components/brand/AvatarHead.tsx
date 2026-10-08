"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/** Head-only sprite that leans toward the cursor. Used as the wordmark mark. Intrinsic size: 800x945. */
export default function AvatarHead({ width = 36, className }: { width?: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotate = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 150, damping: 12 });
  const ty = useSpring(useTransform(my, [-1, 1], [-3, 3]), { stiffness: 150, damping: 12 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mx.set(Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / 500)));
      my.set(Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / 500)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  const height = Math.round((width * 945) / 800);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { rotate, y: ty }} className={cn("inline-block shrink-0", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/world/poses/head.webp" alt="" aria-hidden width={width} height={height} decoding="async" style={{ width, height }} />
    </motion.div>
  );
}
