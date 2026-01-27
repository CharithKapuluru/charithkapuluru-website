"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ResumeButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href="/Charith_Kapuluru_Resume.pdf"
      download="Charith_Kapuluru_Resume.pdf"
      className="group relative inline-flex items-center gap-3 px-6 py-3 bg-text-charcoal text-bg-paper rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-text-charcoal/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent-moss via-accent-sage to-accent-moss"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "0%" : "-100%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Icon */}
      <motion.span
        className="relative z-10"
        animate={{ y: isHovered ? [0, -2, 0] : 0 }}
        transition={{ duration: 0.4, repeat: isHovered ? Infinity : 0, repeatDelay: 0.3 }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </motion.span>

      {/* Text */}
      <span className="relative z-10 font-medium text-sm md:text-base">
        Download Resume
      </span>

      {/* Decorative dot */}
      <motion.span
        className="relative z-10 w-2 h-2 rounded-full bg-accent-terracotta"
        animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  );
};

export default ResumeButton;
