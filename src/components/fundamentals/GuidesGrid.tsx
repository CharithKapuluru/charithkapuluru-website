"use client";

import { useState } from "react";
import Link from "next/link";
import type { FundamentalsCategory, FundamentalsTopic } from "@/lib/fundamentalsData";
import { cn } from "@/lib/utils";

export default function GuidesGrid({ topics, categories }: { topics: FundamentalsTopic[]; categories: FundamentalsCategory[] }) {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? topics : topics.filter((t) => t.category === active);
  const labelById = Object.fromEntries(categories.map((c) => [c.id, c.label]));

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {[{ id: "all", label: "All" }, ...categories].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={active === c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "h-9 rounded-md border px-3 text-small font-medium transition-colors duration-150",
              active === c.id ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface text-fg-2 hover:border-fg-3 hover:text-fg",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        Showing {visible.length} {visible.length === 1 ? "guide" : "guides"}
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {visible.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/fundamentals/${t.slug}`}
              prefetch={false}
              className="group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-[border-color,translate] duration-150 hover:-translate-y-px hover:border-accent/50"
            >
              <span className="text-caption text-fg-3">{labelById[t.category]}</span>
              <h2 className="mt-2 font-display text-h3 text-fg group-hover:text-accent">{t.title}</h2>
              <p className="mt-2 line-clamp-2 text-small text-fg-2">{t.description}</p>
              <p className="mt-auto pt-5 text-caption text-fg-3 tabular">
                {t.readingTime} · {t.sectionCount} sections
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
