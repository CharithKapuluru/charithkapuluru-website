import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { categories, getTopicsByCategory } from "@/lib/fundamentalsData";

export default function FundamentalsIndex() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <h2 className="text-h2 text-fg">Fundamentals</h2>
        <p className="mt-3 max-w-[60ch] text-lede text-fg-2">Ten plain-language guides to how servers, Linux and networks actually work.</p>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-x-16">
          {categories.map((c) => {
            const items = getTopicsByCategory(c.id);
            if (items.length === 0) return null;
            return (
              <div key={c.id}>
                <h3 className="text-small font-medium text-fg-3">{c.label}</h3>
                <ul className="mt-3 divide-y divide-border border-t border-border">
                  {items.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/fundamentals/${t.slug}`} prefetch={false} className="flex items-baseline justify-between gap-4 py-3 text-body text-fg-2 hover:text-fg">
                        <span>{t.title}</span>
                        <span className="shrink-0 text-caption text-fg-3 tabular">{t.readingTime}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <Link href="/fundamentals" className="mt-8 inline-flex items-center gap-1.5 text-small font-medium text-fg-2 hover:text-fg">
          All 10 guides
          <ArrowRight size={16} weight="regular" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
