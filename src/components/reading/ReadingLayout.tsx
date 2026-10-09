"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ReadingNavProvider } from "./ReadingNavContext";
import ContextualNav, { type Crumb } from "./ContextualNav";

interface ReadingLayoutProps {
  crumbs: Crumb[];
  sheetLabel: "Sections" | "Phases";
  header: ReactNode;
  rail: ReactNode;
  after?: ReactNode;
  children: ReactNode;
}

/**
 * Contextual nav + three-column reading grid (gutter, 44rem column, 272px rail) that collapses to one column below xl.
 * Also carries the reduced-motion guard for the framer diagrams and dialogs inside the content. Auth is provided by the (reading)
 * route-group layouts of projects and fundamentals (so it persists between reading pages), not here.
 */
export default function ReadingLayout({ crumbs, sheetLabel, header, rail, after, children }: ReadingLayoutProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ReadingNavProvider>
        <ContextualNav crumbs={crumbs} sheetLabel={sheetLabel} sheetContent={rail} />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1280px] px-4 outline-none sm:px-6">
          <div className="grid gap-10 py-10 md:py-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,44rem)_272px] xl:gap-12">
            <div className="hidden xl:block" aria-hidden />
            <div className="mx-auto w-full min-w-0 max-w-[44rem] xl:mx-0 xl:max-w-none">
              {header}
              <div className="reading-body">{children}</div>
              {after}
            </div>
            <aside data-print-hide className="hidden xl:block">
              <div className="sticky top-24">{rail}</div>
            </aside>
          </div>
        </main>
      </ReadingNavProvider>
    </MotionConfig>
  );
}
