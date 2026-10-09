"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
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

/**
 * Smaller copies that scripts/process-art.mjs writes next to each full-size pose (<pose>-240.webp, <pose>-480.webp), so a 110 px slot does not
 * download a 600 px sprite. A copy exists only when it is at least 10% narrower than the full-size file: keep this rule in step with the script.
 */
const VARIANT_WIDTHS = [240, 480];

function poseSrcSet(pose: PoseName, fullWidth: number): string {
  const smaller = VARIANT_WIDTHS.filter((v) => v <= Math.floor(fullWidth * 0.9)).map((v) => `/world/poses/${pose}-${v}.webp ${v}w`);
  return [...smaller, `/world/poses/${pose}.webp ${fullWidth}w`].join(", ");
}

interface AvatarProps {
  pose?: PoseName;
  width?: number;
  flip?: boolean;
  className?: string;
  /** Show the poke lines when clicked. */
  pokeable?: boolean;
  /** Eager-load for the LCP candidate in the hero. */
  priority?: boolean;
}

export default function Avatar({ pose = "master", width = 220, flip = false, className, pokeable = true, priority = false }: AvatarProps) {
  const pokeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [pokeLine, setPokeLine] = useState<string | null>(null);

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
    <>
      <div
        onClick={poke}
        onKeyDown={pokeable ? onKeyDown : undefined}
        role={pokeable ? "button" : undefined}
        aria-label={pokeable ? "Poke Charith" : undefined}
        tabIndex={pokeable ? 0 : undefined}
        className={cn("relative inline-block select-none", pokeable && "cursor-pointer transition-transform duration-150 motion-safe:active:scale-[0.97]", className)}
      >
        {pokeLine && (
          <span aria-hidden className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-1.5 font-display text-small text-fg shadow-float">
            {pokeLine}
          </span>
        )}
        {/* Plain img: images are unoptimized in static export, and explicit dimensions prevent layout shift. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/world/poses/${pose}.webp`}
          srcSet={poseSrcSet(pose, w)}
          sizes={`${width}px`}
          alt={POSE_ALT[pose]}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className={cn("h-auto", flip && "-scale-x-100")}
          style={{ width, maxWidth: "100%" }}
        />
      </div>
      {/* The poke line is spoken from this live region; a live region on the button itself would re-read the whole control. */}
      {pokeable && (
        <span role="status" className="sr-only">
          {pokeLine}
        </span>
      )}
    </>
  );
}
