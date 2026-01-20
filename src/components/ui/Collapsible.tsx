"use client";

import { useState } from "react";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Collapsible = ({ title, children, defaultOpen = false }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-6 border border-text-charcoal/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-bg-cream/50 hover:bg-bg-cream transition-colors text-left"
      >
        <span className="font-serif text-lg text-text-charcoal flex items-center gap-2">
          <span className="text-accent-moss">📖</span>
          {title}
        </span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-5 h-5 text-text-olive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 bg-bg-paper border-t border-text-charcoal/10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Collapsible;
