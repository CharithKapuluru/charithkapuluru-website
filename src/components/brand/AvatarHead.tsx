"use client";

import { useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Head-only sprite that leans toward the cursor while it is hovered. Used as the wordmark mark. Intrinsic size: 800x945.
 * The slot is 36 px, so it loads head-96.webp (head-192.webp for dense screens) instead of the 100 KB original.
 */
export default function AvatarHead({ width = 36, className }: { width?: number; className?: string }) {
  const [tilt, setTilt] = useState({ r: 0, y: 0 });

  const lean = (e: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)));
    const r = Math.round(nx * 12);
    const y = Math.round(ny * 3);
    setTilt((prev) => (prev.r === r && prev.y === y ? prev : { r, y }));
  };

  const height = Math.round((width * 945) / 800);

  return (
    // The wrapper takes the pointer and stays still; only the image tilts, so the hit area does not move under the cursor.
    <div onPointerMove={lean} onPointerLeave={() => setTilt({ r: 0, y: 0 })} className={cn("inline-block shrink-0", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/world/poses/head-96.webp"
        srcSet="/world/poses/head-96.webp 96w, /world/poses/head-192.webp 192w"
        sizes={`${width}px`}
        alt=""
        aria-hidden
        width={width}
        height={height}
        decoding="async"
        className="transition-transform duration-200"
        style={{ width, height, transform: `rotate(${tilt.r}deg) translateY(${tilt.y}px)` }}
      />
    </div>
  );
}
