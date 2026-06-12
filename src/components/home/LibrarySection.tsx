"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { topics } from "@/lib/fundamentalsData";

const SPINE_COLORS = [
  "#15803d", "#0369a1", "#b45309", "#7c3aed", "#be185d",
  "#0f766e", "#a16207", "#1d4ed8", "#c2410c", "#4d7c0f",
];

export default function LibrarySection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-bg-paper py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="font-serif text-4xl font-semibold text-text-charcoal md:text-5xl">
          The Library
        </h2>
        <p className="mt-3 max-w-[65ch] font-sans text-lg text-text-taupe">
          {topics.length} plain-language guides to how computers actually work.
          Zero assumptions, real analogies, occasional jokes.
        </p>

        <Link href="/fundamentals" className="mt-10 block" aria-label="Browse all Fundamentals articles">
          <div className="flex items-end gap-1.5 overflow-x-auto rounded-2xl bg-bg-stone p-6 pb-0">
            {topics.map((t, i) => (
              <motion.div
                key={t.id}
                whileHover={reduce ? undefined : { y: -14 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex h-44 w-12 shrink-0 items-end justify-center rounded-t-md pb-3 md:w-14"
                style={{ backgroundColor: SPINE_COLORS[i % SPINE_COLORS.length] }}
                title={t.title}
              >
                <span
                  className="font-sans text-[11px] font-bold text-white"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {t.title}
                </span>
              </motion.div>
            ))}
            <div className="h-3 w-full" />
          </div>
          <div className="rounded-b-2xl bg-[#a16207]/80 py-2 text-center font-sans text-sm font-bold text-white">
            browse the shelf
          </div>
        </Link>
      </div>
    </section>
  );
}
