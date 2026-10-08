import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Replaces the per-file Section wrappers: calm surface, hairline between sections, anchor-safe offset. */
const ArticleSection = forwardRef<HTMLElement, { id: string; children: ReactNode; className?: string }>(function ArticleSection(
  { id, children, className },
  ref,
) {
  return (
    <section id={id} ref={ref} className={cn("scroll-mt-24 border-t border-border py-10 first:border-t-0 first:pt-0 md:py-14", className)}>
      {children}
    </section>
  );
});

export default ArticleSection;
