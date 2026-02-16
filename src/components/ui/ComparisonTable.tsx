"use client";

import { motion } from "framer-motion";

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

const ComparisonTable = ({ headers, rows, caption }: ComparisonTableProps) => {
  return (
    <motion.div
      className="my-8 overflow-x-auto rounded-lg border border-text-charcoal/10"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {caption && (
        <div className="px-4 py-3 bg-bg-cream border-b border-text-charcoal/10">
          <p className="text-sm font-serif font-semibold text-text-charcoal">
            {caption}
          </p>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-cream">
            {headers.map((header, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left font-serif font-semibold text-text-charcoal whitespace-nowrap ${
                  i === 0 ? "sticky left-0 bg-bg-cream z-10" : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0 ? "bg-bg-paper" : "bg-bg-cream/50"
              }
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 py-3 text-text-taupe ${
                    cellIndex === 0
                      ? "sticky left-0 font-medium text-text-charcoal whitespace-nowrap " +
                        (rowIndex % 2 === 0 ? "bg-bg-paper" : "bg-bg-cream/50")
                      : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ComparisonTable;
