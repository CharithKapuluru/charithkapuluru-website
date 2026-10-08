"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Segment {
  label: string;
  value: number;
  unit: string;
  detail: string;
}

interface ResourceAllocatorProps {
  title: string;
  total: number;
  unit: string;
  segments: Segment[];
}

const colors = [
  { bg: "bg-accent",  text: "text-bg" },
  { bg: "bg-danger",  text: "text-bg" },
  { bg: "bg-info",    text: "text-fg dark:text-bg" },
  { bg: "bg-success", text: "text-bg" },
];

const ResourceAllocator = ({
  title,
  total,
  unit,
  segments,
}: ResourceAllocatorProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const usedTotal = segments.reduce((sum, s) => sum + s.value, 0);
  const remaining = total - usedTotal;

  return (
    <motion.div
      className="my-8 p-5 md:p-6 bg-bg rounded-lg border border-fg/10"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h4 className="font-display font-semibold text-fg mb-4">
        {title}
      </h4>

      {/* Bar */}
      <div className="h-10 md:h-12 rounded-lg overflow-hidden flex bg-surface-2/50">
        {segments.map((segment, i) => {
          const widthPercent = (segment.value / total) * 100;
          const color = colors[i % colors.length];
          return (
            <motion.div
              key={i}
              className={`${color.bg} ${color.text} flex items-center justify-center text-xs font-mono cursor-pointer relative`}
              style={{ width: `${widthPercent}%` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="truncate px-1">
                {segment.value}
                {segment.unit}
              </span>

              {/* Tooltip */}
              {hoveredIndex === i && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-primary-fg text-xs rounded px-3 py-1.5 whitespace-nowrap z-10">
                  {segment.detail}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary" />
                </div>
              )}
            </motion.div>
          );
        })}
        {remaining > 0 && (
          <div
            className="bg-surface-2/80 flex items-center justify-center text-xs font-mono text-fg-3"
            style={{ width: `${(remaining / total) * 100}%` }}
          >
            {remaining}
            {unit} free
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {segments.map((segment, i) => {
          const color = colors[i % colors.length];
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-sm ${color.bg}`} />
              <span className="text-fg-2">{segment.label}</span>
            </div>
          );
        })}
        {remaining > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm bg-surface-2/80" />
            <span className="text-fg-2">Host (remaining)</span>
          </div>
        )}
      </div>

      <p className="text-xs text-fg-3 mt-3 font-mono">
        Total: {total}
        {unit}
      </p>
    </motion.div>
  );
};

export default ResourceAllocator;
