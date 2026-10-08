"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  index?: number;
}

export default function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const reduce = useReducedMotion();

  return (
    <div className="my-6 rounded-md border border-border bg-surface">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 rounded-md px-4 py-3 text-left text-body font-medium text-fg hover:bg-surface-2"
      >
        <span>{title}</span>
        <CaretDown size={18} weight="regular" aria-hidden className={cn("shrink-0 text-fg-3 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 py-4 leading-relaxed text-fg-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
