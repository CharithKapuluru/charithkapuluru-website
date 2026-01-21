"use client";

import { motion } from "framer-motion";

interface PullQuoteProps {
  children: React.ReactNode;
  attribution?: string;
}

const PullQuote = ({ children, attribution }: PullQuoteProps) => {
  return (
    <motion.div
      className="my-6 md:my-10 px-4 md:px-6 py-4 relative"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Large decorative quote mark - smaller on mobile */}
      <span
        className="absolute left-0 -top-2 md:-left-2 md:-top-4 text-5xl md:text-8xl font-serif text-accent-moss/20 leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <blockquote className="relative z-10 pl-4 md:pl-0">
        <p className="text-lg md:text-xl lg:text-2xl font-serif italic text-text-charcoal leading-relaxed">
          {children}
        </p>
        {attribution && (
          <footer className="mt-3 text-sm text-text-olive">
            &mdash; {attribution}
          </footer>
        )}
      </blockquote>

      {/* Closing quote mark - hidden on mobile */}
      <span
        className="absolute -right-2 bottom-0 text-5xl md:text-8xl font-serif text-accent-moss/20 leading-none select-none pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        &rdquo;
      </span>
    </motion.div>
  );
};

export default PullQuote;
