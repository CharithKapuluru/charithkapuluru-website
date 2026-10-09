"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CaretDown, X } from "@phosphor-icons/react/dist/ssr";
import { useReadingNavContext } from "./ReadingNavContext";
import { cn } from "@/lib/utils";

/** Below xl this sheet carries the rail: `content` (the rail) when given, otherwise a plain list of the sections. */
export default function SectionsSheet({ label, className, content }: { label: "Sections" | "Phases"; className?: string; content?: ReactNode }) {
  const ctx = useReadingNavContext();
  const ref = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // The trigger is hidden from xl up, so close the dialog when the viewport crosses that width; otherwise it would stay modal and leave the page inert.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 80rem)");
    const onChange = () => ref.current?.close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lets the context close this dialog when a section is chosen from inside it.
  useEffect(() => {
    ctx?.registerSheet(ref.current);
    return () => ctx?.registerSheet(null);
  }, [ctx]);

  if (!ctx || ctx.sections.length === 0) return null;
  const open = () => {
    setIsOpen(true);
    ref.current?.showModal();
  };
  const close = () => ref.current?.close();

  return (
    <div className={className}>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-small font-medium text-fg-2 hover:bg-surface-2 hover:text-fg"
      >
        {label}
        <CaretDown size={16} weight="regular" aria-hidden />
      </button>
      <dialog
        ref={ref}
        aria-label={label}
        className="m-0 mt-auto max-h-[80dvh] w-full max-w-none rounded-t-lg border border-border bg-surface p-0 text-fg sm:m-auto sm:max-w-md sm:rounded-lg"
        onClick={(e) => e.target === ref.current && close()}
        // React re-dispatches a nested dialog's close up the tree, so only react to this dialog's own close.
        onClose={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-display text-body font-semibold">{label}</span>
          <button type="button" onClick={close} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2">
            <X size={20} weight="regular" aria-hidden />
          </button>
        </div>
        {content ? (
          <div className="max-h-[70dvh] overflow-y-auto p-4">{isOpen ? content : null}</div>
        ) : (
          <ol className="max-h-[60dvh] overflow-y-auto p-2">
            {ctx.sections.map((s, i) => (
              <li key={String(s.id)}>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    ctx.scrollTo(i);
                  }}
                  aria-current={i === ctx.activeIndex ? "true" : undefined}
                  className={cn(
                    "flex h-11 w-full items-center rounded-md px-3 text-left text-small text-fg-2 hover:bg-surface-2 hover:text-fg",
                    i === ctx.activeIndex && "bg-accent-soft font-medium text-accent",
                  )}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        )}
      </dialog>
    </div>
  );
}
