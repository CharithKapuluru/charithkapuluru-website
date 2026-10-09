"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
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

/** Intrinsic dimensions of public/world/poses/*.webp to prevent layout shift with explicit dimensions. */
const POSE_SIZE: Record<PoseName, { w: number; h: number }> = {
  master: { w: 413, h: 1238 },
  wave: { w: 489, h: 1237 },
  laptop: { w: 600, h: 821 },
  peek: { w: 570, h: 1198 },
  point: { w: 440, h: 1237 },
  read: { w: 600, h: 1230 },
  bored: { w: 428, h: 1202 },
  lost: { w: 572, h: 1211 },
};

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
  const pokeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  useEffect(() => {
    return () => {
      if (pokeTimeoutRef.current) {
        clearTimeout(pokeTimeoutRef.current);
      }
    };
  }, []);

  const poke = () => {
    if (!pokeable) return;
    if (pokeTimeoutRef.current) {
      clearTimeout(pokeTimeoutRef.current);
    }
    const next = Math.min(pokeCount + 1, POKE_LINES.length);
    setPokeCount(next);
    setPokeLine(POKE_LINES[next - 1]);
    pokeTimeoutRef.current = setTimeout(() => setPokeLine(null), 1800);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.key === " ") e.preventDefault();
    poke();
  };

  const { w, h } = POSE_SIZE[pose];
  const height = Math.round((width * h) / w);

  return (
    <motion.div
      ref={ref}
      onClick={poke}
      onKeyDown={pokeable ? onKeyDown : undefined}
      role={pokeable ? "button" : undefined}
      tabIndex={pokeable ? 0 : undefined}
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
