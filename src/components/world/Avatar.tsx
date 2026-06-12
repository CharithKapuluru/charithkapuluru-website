"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useWorld } from "./WorldProvider";

export type PoseName =
  | "master"
  | "wave"
  | "laptop"
  | "peek"
  | "point"
  | "read"
  | "bored"
  | "lost";

const POSE_ALT: Record<PoseName, string> = {
  master: "Cartoon Charith standing and smiling",
  wave: "Cartoon Charith waving hello",
  laptop: "Cartoon Charith sitting cross-legged, typing on a laptop",
  peek: "Cartoon Charith leaning over curiously",
  point: "Cartoon Charith pointing to the side",
  read: "Cartoon Charith in reading glasses holding a book",
  bored: "Cartoon Charith looking at his phone, bored",
  lost: "Cartoon Charith holding a map upside down, confused",
};

const POKE_LINES = [
  "hi!",
  "that tickles",
  "yes?",
  "still me",
  "ok ok stop poking me",
];

interface AvatarProps {
  pose?: PoseName;
  width?: number;
  flip?: boolean;
  className?: string;
  /** Tilt the whole sprite toward the cursor. */
  track?: boolean;
  /** Show poke speech lines when clicked. */
  pokeable?: boolean;
}

export default function Avatar({
  pose = "master",
  width = 220,
  flip = false,
  className = "",
  track = false,
  pokeable = true,
}: AvatarProps) {
  const reduce = useReducedMotion();
  const { boop } = useWorld();
  const ref = useRef<HTMLDivElement>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [pokeLine, setPokeLine] = useState<string | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotate = useSpring(useTransform(mx, [-1, 1], [-7, 7]), {
    stiffness: 120,
    damping: 14,
  });
  const tiltY = useSpring(useTransform(my, [-1, 1], [-4, 6]), {
    stiffness: 120,
    damping: 14,
  });

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

  const handlePoke = () => {
    if (!pokeable) return;
    boop(420 + pokeCount * 80);
    const next = Math.min(pokeCount + 1, POKE_LINES.length);
    setPokeCount(next);
    setPokeLine(POKE_LINES[next - 1]);
    setTimeout(() => setPokeLine(null), 1800);
  };

  return (
    <motion.div
      ref={ref}
      onClick={handlePoke}
      style={track && !reduce ? { rotate, y: tiltY } : undefined}
      whileTap={pokeable ? { scale: 0.96 } : undefined}
      className={`relative inline-block select-none ${pokeable ? "cursor-pointer" : ""} ${className}`}
    >
      {pokeLine && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-bg-paper px-3 py-1.5 font-serif text-sm text-text-charcoal paper-shadow"
        >
          {pokeLine}
        </motion.div>
      )}
      <Image
        src={`/world/poses/${pose}.webp`}
        alt={POSE_ALT[pose]}
        width={width}
        height={Math.round(width * 1.4)}
        className={flip ? "-scale-x-100" : ""}
        priority={false}
      />
    </motion.div>
  );
}

/** Head-only sprite that leans toward the cursor. Used in nav / hero corners. */
export function AvatarHead({ width = 90, className = "" }: { width?: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotate = useSpring(useTransform(mx, [-1, 1], [-14, 14]), {
    stiffness: 150,
    damping: 12,
  });
  const ty = useSpring(useTransform(my, [-1, 1], [-5, 5]), {
    stiffness: 150,
    damping: 12,
  });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / 500)));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / 500)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { rotate, y: ty }} className={`inline-block ${className}`}>
      <Image
        src="/world/poses/head.webp"
        alt="Cartoon Charith's head, watching the cursor"
        width={width}
        height={width}
      />
    </motion.div>
  );
}
