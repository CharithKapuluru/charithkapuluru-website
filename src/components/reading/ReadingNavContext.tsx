"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { prefersReducedMotion, scrollBehavior } from "@/lib/scroll";

export interface ReadingSection {
  id: number | string;
  label: string;
}

export type SectionRefs = RefObject<(HTMLElement | null)[]>;

interface ReadingNavValue {
  sections: ReadingSection[];
  activeIndex: number;
  register: (sections: ReadingSection[], refs: SectionRefs) => void;
  setActive: (index: number) => void;
  scrollTo: (index: number) => void;
}

const ReadingNavContext = createContext<ReadingNavValue | null>(null);

export function useReadingNavContext() {
  return useContext(ReadingNavContext);
}

export function ReadingNavProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<ReadingSection[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const refsRef = useRef<SectionRefs | null>(null);

  const register = useCallback((s: ReadingSection[], refs: SectionRefs) => {
    setSections(s);
    refsRef.current = refs;
  }, []);

  const setActive = useCallback((index: number) => setActiveIndex((prev) => (prev === index ? prev : index)), []);

  const scrollTo = useCallback((index: number) => {
    refsRef.current?.current[index]?.scrollIntoView({ behavior: scrollBehavior(prefersReducedMotion()), block: "start" });
  }, []);

  const value = useMemo(() => ({ sections, activeIndex, register, setActive, scrollTo }), [sections, activeIndex, register, setActive, scrollTo]);

  return <ReadingNavContext.Provider value={value}>{children}</ReadingNavContext.Provider>;
}
