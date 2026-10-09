"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { useKonami } from "@/hooks/useKonami";
import { prefersReducedMotion } from "@/lib/scroll";

/** Up, up, down, down, left, right, left, right, B, A: the avatar rises into the bottom of the screen for a few seconds. */
export default function Konami() {
  const [dancing, setDancing] = useState(false);
  const danceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (danceTimeoutRef.current) {
        clearTimeout(danceTimeoutRef.current);
      }
    };
  }, []);

  useKonami(
    useCallback(() => {
      if (prefersReducedMotion() || dancing) return;
      if (danceTimeoutRef.current) {
        clearTimeout(danceTimeoutRef.current);
      }
      setDancing(true);
      danceTimeoutRef.current = setTimeout(() => setDancing(false), 3200);
    }, [dancing]),
  );

  if (!dancing) return null;

  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 motion-safe:animate-rise" aria-hidden>
      <Avatar pose="wave" width={150} pokeable={false} />
    </div>
  );
}
