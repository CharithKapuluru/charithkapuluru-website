"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type PoseName = "master" | "wave" | "laptop" | "peek" | "point" | "read" | "bored" | "lost";

const POSE_ALT: Record<PoseName, string> = {
  master: "Cartoon Charith standing and smiling",
  wave: "Cartoon Charith waving hello",
  laptop: "Cartoon Charith sitting cross-legged, typing on a laptop",
  peek: "Cartoon Charith leaning over curiously",
  point: "Cartoon Charith pointing to the side",
  read: "Cartoon Charith in reading glasses holding a book",
  bored: "Cartoon Charith looking at his phone",
  lost: "Cartoon Charith holding a map upside down",
};

const POKE_LINES = ["hi!", "that tickles", "yes?", "still me", "ok ok stop poking me"];

interface AvatarProps {
  pose?: PoseName;
  width?: number;
  flip?: boolean;
  className?: string;
  /** Tilt the sprite toward the cursor (hero only). */
  track?: boolean;
  /** Show the poke lines when clicked. */
  pokeable?: boolean;
  /** Eager-load for the LCP candidate in the hero. */
  priority?: boolean;
}

export default function Avatar({ pose = "master", width = 220, flip = false, className, track = false, pokeable = true, priority = false }: AvatarProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [pokeLine, setPokeLine] = useState<string | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotate = useSpring(useTransform(mx, [-1, 1], [-6, 6]), { stiffness: 120, damping: 14 });
  const tiltY = useSpring(useTransform(my, [-1, 1], [-3, 5]), { stiffness: 120, damping: 14 });

  useEffect(() => {
    if (!track || reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2))));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2))));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [track, reduce, mx, my]);

  const poke = () => {
    if (!pokeable) return;
    const next = Math.min(pokeCount + 1, POKE_LINES.length);
    setPokeCount(next);
    setPokeLine(POKE_LINES[next - 1]);
    setTimeout(() => setPokeLine(null), 1800);
  };

  const height = Math.round(width * 1.4);

  return (
    <motion.div
      ref={ref}
      onClick={poke}
      style={track && !reduce ? { rotate, y: tiltY } : undefined}
      whileTap={pokeable && !reduce ? { scale: 0.97 } : undefined}
      className={cn("relative inline-block select-none", pokeable && "cursor-pointer", className)}
      aria-live={pokeable ? "polite" : undefined}
    >
      {pokeLine && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-1.5 font-display text-small text-fg shadow-float">
          {pokeLine}
        </span>
      )}
      {/* Plain img: images are unoptimized in static export, and explicit dimensions prevent layout shift. */}
      <img
        src={`/world/poses/${pose}.webp`}
        alt={POSE_ALT[pose]}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("h-auto", flip && "-scale-x-100")}
        style={{ width, maxWidth: "100%" }}
      />
    </motion.div>
  );
}
