"use client";

import { motion } from "framer-motion";

interface PhaseHeaderProps {
  phaseNumber: number | string;
  title: string;
  accentColor?: "terracotta" | "moss" | "sage" | "sand" | "olive";
}

const PhaseHeader = ({ phaseNumber, title, accentColor = "moss" }: PhaseHeaderProps) => {
  const accentColors = {
    terracotta: {
      line: "bg-accent-terracotta",
      number: "text-accent-terracotta/10",
    },
    moss: {
      line: "bg-accent-moss",
      number: "text-accent-moss/10",
    },
    sage: {
      line: "bg-accent-sage",
      number: "text-accent-sage/15",
    },
    sand: {
      line: "bg-accent-sand",
      number: "text-accent-sand/15",
    },
    olive: {
      line: "bg-accent-olive",
      number: "text-accent-olive/15",
    },
  };

  const colors = accentColors[accentColor];

  return (
    <motion.div
      className="relative mb-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Large faded phase number in background */}
      <motion.div
        className={`absolute -left-4 -top-8 text-[8rem] font-serif font-bold ${colors.number} select-none pointer-events-none leading-none`}
        style={{ transform: "rotate(3deg)" }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {phaseNumber}
      </motion.div>

      {/* Accent line with slight rotation */}
      <motion.div
        className={`w-16 h-1 ${colors.line} mb-4 rounded-full`}
        style={{ transform: "rotate(-2deg)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />

      {/* Title */}
      <motion.h2
        className="text-3xl font-serif text-text-charcoal relative z-10"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {title}
      </motion.h2>
    </motion.div>
  );
};

export default PhaseHeader;
