"use client";

import { useEffect, MutableRefObject } from "react";

/**
 * Scroll-spy via IntersectionObserver (replaces window scroll listeners).
 * Marks the phase whose section currently crosses the upper viewport band.
 */
export function useActivePhase(
  refs: MutableRefObject<(HTMLDivElement | null)[]>,
  setCurrent: (i: number) => void
) {
  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = refs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setCurrent(idx);
          }
        }
      },
      // A thin band near the top of the viewport: a section "activates"
      // when its top edge crosses ~20% from the top.
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [refs, setCurrent]);
}
