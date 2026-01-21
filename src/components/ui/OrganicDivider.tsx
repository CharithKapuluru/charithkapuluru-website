"use client";

import { motion } from "framer-motion";

interface OrganicDividerProps {
  variant?: "wave" | "branch" | "terrain";
  className?: string;
}

const OrganicDivider = ({ variant = "wave", className = "" }: OrganicDividerProps) => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut" as const },
        opacity: { duration: 0.3 },
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.8, duration: 0.4, type: "spring" as const, stiffness: 200 },
    },
  };

  if (variant === "wave") {
    return (
      <div className={`my-8 md:my-16 flex items-center justify-center px-4 ${className}`}>
        <motion.svg
          viewBox="0 0 400 30"
          className="w-full max-w-xs md:max-w-md h-6 md:h-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.path
            d="M0,15 Q50,5 100,15 T200,15 T300,15 T400,15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-accent-moss/40"
            variants={pathVariants}
          />
          {/* Small dots along the wave */}
          <motion.circle cx="100" cy="15" r="3" className="fill-accent-terracotta/60" variants={iconVariants} />
          <motion.circle cx="200" cy="15" r="3" className="fill-accent-moss/60" variants={iconVariants} />
          <motion.circle cx="300" cy="15" r="3" className="fill-accent-sage/60" variants={iconVariants} />
        </motion.svg>
      </div>
    );
  }

  if (variant === "branch") {
    return (
      <div className={`my-8 md:my-16 flex items-center justify-center gap-2 md:gap-4 px-4 ${className}`}>
        <motion.svg
          viewBox="0 0 150 20"
          className="w-20 md:w-32 h-4 md:h-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <defs>
            <linearGradient id="branchGradientLeft" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M150,10 L0,10"
            fill="none"
            stroke="url(#branchGradientLeft)"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-accent-moss"
            variants={pathVariants}
          />
        </motion.svg>

        {/* Leaf icon in center */}
        <motion.div
          className="text-accent-moss/70"
          variants={iconVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="currentColor">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </motion.div>

        <motion.svg
          viewBox="0 0 150 20"
          className="w-20 md:w-32 h-4 md:h-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <defs>
            <linearGradient id="branchGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,10 L150,10"
            fill="none"
            stroke="url(#branchGradientRight)"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-accent-moss"
            variants={pathVariants}
          />
        </motion.svg>
      </div>
    );
  }

  // Terrain variant - mountain silhouette (fits AWS/cloud theme)
  return (
    <div className={`my-8 md:my-16 flex items-center justify-center px-4 ${className}`}>
      <motion.svg
        viewBox="0 0 400 40"
        className="w-full max-w-xs md:max-w-lg h-8 md:h-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Cloud icon */}
        <motion.g variants={iconVariants}>
          <path
            d="M190,8 Q185,3 180,8 Q175,4 170,8 Q165,6 163,10 Q158,10 158,14 Q155,14 155,18 L205,18 Q205,14 202,14 Q202,10 197,10 Q195,6 190,8Z"
            className="fill-accent-sage/30"
          />
        </motion.g>

        {/* Mountain line */}
        <motion.path
          d="M0,35 L40,35 L60,25 L80,30 L100,20 L130,28 L150,15 L170,22 L200,12 L230,22 L250,15 L270,28 L300,20 L320,30 L340,25 L360,35 L400,35"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-moss/50"
          variants={pathVariants}
        />
      </motion.svg>
    </div>
  );
};

export default OrganicDivider;
