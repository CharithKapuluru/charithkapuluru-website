"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useReadingNavContext } from "./ReadingNavContext";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function PercentRead() {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.round(v * 100);
    setPct((prev) => (prev === p ? prev : p));
  });
  return <span className="tabular">{pct}%</span>;
}

export default function OnThisPage() {
  const ctx = useReadingNavContext();
  return (
    <nav aria-label="On this page" className="text-small">
      <p className="mb-3 text-caption font-medium text-fg-3">On this page</p>
      {ctx && ctx.sections.length > 0 ? (
        <ol className="border-l border-border">
          {ctx.sections.map((s, i) => {
            const active = i === ctx.activeIndex;
            return (
              <li key={String(s.id)}>
                <button
                  type="button"
                  onClick={() => ctx.scrollTo(i)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "-ml-px block w-full border-l-2 py-1.5 pl-3 text-left text-fg-3 transition-colors duration-150 hover:text-fg",
                    active ? "border-accent text-fg" : "border-transparent",
                  )}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}
      <p className="mt-4 text-caption text-fg-3">
        <PercentRead /> read
      </p>
    </nav>
  );
}
