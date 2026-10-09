"use client";

import { useEffect, type RefObject } from "react";
import { useReadingNavActions, type ReadingSection, type SectionRefs } from "@/components/reading/ReadingNavContext";

/**
 * Scroll-spy for tutorial sections. Replaces the old scroll-spy hook: same IntersectionObserver band,
 * plus it publishes sections and the active index to the reading rails when a provider exists.
 * `sections` must be a module-level constant so the effect does not re-run every render.
 */
export function useReadingNav<T extends HTMLElement>(
  sections: ReadingSection[],
  refs: RefObject<(T | null)[]>,
  setCurrent?: (index: number) => void,
) {
  // Actions only: this hook runs inside every article and project, which must not re-render when the active section changes.
  const actions = useReadingNavActions();
  const register = actions?.register;
  const setActive = actions?.setActive;

  useEffect(() => {
    register?.(sections, refs as unknown as SectionRefs);
  }, [register, sections, refs]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as T[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = refs.current.indexOf(entry.target as T);
          if (idx !== -1) {
            setCurrent?.(idx);
            setActive?.(idx);
          }
        }
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [refs, setCurrent, setActive]);
}
