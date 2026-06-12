"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

interface TocSection {
  id: string;
  title: string;
}

interface ArticleTableOfContentsProps {
  sections: TocSection[];
}

const ArticleTableOfContents = ({ sections }: ArticleTableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const [percent, setPercent] = useState(0);
  const { scrollYProgress } = useScroll();
  const barWidth = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  // Text label only re-renders when the integer percent changes.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.round(v * 100);
    setPercent((prev) => (prev === p ? prev : p));
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one with highest intersection ratio
          const best = visible.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b
          );
          setActiveId(best.target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 w-56 z-30">
      {/* Progress bar */}
      <div className="h-1 bg-bg-stone rounded-full mb-4 overflow-hidden">
        <motion.div className="h-full bg-accent-moss" style={{ width: barWidth }} />
      </div>

      <nav className="space-y-1">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={`flex items-center gap-2.5 w-full text-left py-1.5 px-2 rounded transition-all text-sm ${
                isActive
                  ? "text-accent-moss font-medium bg-accent-moss/5"
                  : "text-text-olive hover:text-text-charcoal"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                  isActive ? "bg-accent-moss" : "bg-text-charcoal/20"
                }`}
              />
              <span className="truncate font-serif">{section.title}</span>
            </button>
          );
        })}
      </nav>

      <p className="text-xs text-text-olive mt-4 font-mono">
        {percent}% read
      </p>
    </div>
  );
};

export default ArticleTableOfContents;
