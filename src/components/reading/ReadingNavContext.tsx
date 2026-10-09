"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { prefersReducedMotion, scrollBehavior } from "@/lib/scroll";

export interface ReadingSection {
  id: number | string;
  label: string;
}

export type SectionRefs = RefObject<(HTMLElement | null)[]>;

interface ReadingNavState {
  sections: ReadingSection[];
  activeIndex: number;
}

interface ReadingNavActions {
  register: (sections: ReadingSection[], refs: SectionRefs) => void;
  registerSheet: (el: HTMLDialogElement | null) => void;
  setActive: (index: number) => void;
  scrollTo: (index: number) => void;
}

type ReadingNavValue = ReadingNavState & ReadingNavActions;

// Two contexts: the actions never change, the state changes with every active section. The article and project components only need the
// actions (to register their sections and report the active one), so they do not re-render each time the reader scrolls into a new section.
const StateContext = createContext<ReadingNavState | null>(null);
const ActionsContext = createContext<ReadingNavActions | null>(null);

/** The stable half: register, registerSheet, setActive, scrollTo. Null outside a ReadingNavProvider. */
export function useReadingNavActions() {
  return useContext(ActionsContext);
}

/** Both halves, for the rails and sheets that show the sections and the active one. */
export function useReadingNavContext(): ReadingNavValue | null {
  const state = useContext(StateContext);
  const actions = useContext(ActionsContext);
  return useMemo(() => (state && actions ? { ...state, ...actions } : null), [state, actions]);
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

  const state = useMemo(() => ({ sections, activeIndex }), [sections, activeIndex]);
  const actions = useMemo(() => ({ register, registerSheet, setActive, scrollTo }), [register, registerSheet, setActive, scrollTo]);

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}
