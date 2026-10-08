"use client";

import { useEffect, type ReactNode } from "react";
import { useReadingNavContext } from "./ReadingNavContext";
import { useProgress } from "@/hooks/useProgress";
import SignInControl from "./SignInControl";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export default function PhaseRail({ progressKey, actions }: { progressKey: string; actions?: ReactNode }) {
  const ctx = useReadingNavContext();
  const total = ctx?.sections.length ?? 0;
  const activeIndex = ctx?.activeIndex ?? 0;
  const progress = useProgress(progressKey, total);
  const { markBefore } = progress;

  useEffect(() => {
    if (total > 0) markBefore(activeIndex);
  }, [activeIndex, total, markBefore]);

  return (
    <nav aria-label="Phases" className="text-small">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-caption font-medium text-fg-3">Phases</p>
        {progress.signedIn && <p className="text-caption text-fg-3 tabular">{progress.percent}%</p>}
      </div>
      {progress.signedIn && (
        <div className="mb-3 h-px w-full bg-border">
          <div className="h-px bg-accent transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
      {!ctx || total === 0 ? (
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ) : (
        <ol className="space-y-0.5">
          {ctx.sections.map((s, i) => {
            const active = i === activeIndex;
            const done = progress.completed.includes(i);
            return (
              <li key={String(s.id)} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={done}
                  disabled={!progress.signedIn || !progress.ready}
                  onChange={() => progress.toggle(i)}
                  aria-label={`Mark ${s.label} complete`}
                  className="h-4 w-4 shrink-0 accent-accent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => ctx.scrollTo(i)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex h-8 min-w-0 flex-1 items-center rounded-md px-2 text-left text-fg-3 hover:text-fg",
                    active && "bg-accent-soft font-medium text-accent",
                    done && !active && "line-through",
                  )}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      )}
      {progress.loading ? (
        <Skeleton className="mt-4 h-9 w-full" />
      ) : progress.signedIn ? (
        <SignInControl className="mt-4" />
      ) : (
        <div className="mt-4 rounded-md border border-border bg-surface-2 p-3">
          <p className="text-caption text-fg-2">Sign in to save progress across devices.</p>
          <SignInControl className="mt-2" />
        </div>
      )}
      {actions && <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">{actions}</div>}
    </nav>
  );
}
