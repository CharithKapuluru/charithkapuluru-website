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
  registerSheet: (el: HTMLDialogElement | null) => void;
  setActive: (index: number) => void;
  scrollTo: (index: number) => void;
}

const ReadingNavContext = createContext<ReadingNavValue | null>(null);

export function useReadingNavContext() {
  return useContext(ReadingNavContext);
}

function sameSections(a: ReadingSection[], b: ReadingSection[]) {
  return a.length === b.length && a.every((s, i) => s.id === b[i].id && s.label === b[i].label);
}

export function ReadingNavProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<ReadingSection[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const refsRef = useRef<SectionRefs | null>(null);
  const sheetRef = useRef<HTMLDialogElement | null>(null);

  const register = useCallback((s: ReadingSection[], refs: SectionRefs) => {
    // Keep the current array when nothing changed, so a `sections` that is not module-level cannot cause a render loop.
    setSections((prev) => (sameSections(prev, s) ? prev : s));
    refsRef.current = refs;
  }, []);

  const registerSheet = useCallback((el: HTMLDialogElement | null) => {
    sheetRef.current = el;
  }, []);

  const setActive = useCallback((index: number) => setActiveIndex((prev) => (prev === index ? prev : index)), []);

  const scrollTo = useCallback((index: number) => {
    // A sheet that carries the rail closes first, so choosing an item both scrolls and dismisses it.
    if (sheetRef.current?.open) sheetRef.current.close();
    refsRef.current?.current[index]?.scrollIntoView({ behavior: scrollBehavior(prefersReducedMotion()), block: "start" });
  }, []);

  const value = useMemo(
    () => ({ sections, activeIndex, register, registerSheet, setActive, scrollTo }),
    [sections, activeIndex, register, registerSheet, setActive, scrollTo],
  );

  return <ReadingNavContext.Provider value={value}>{children}</ReadingNavContext.Provider>;
}
