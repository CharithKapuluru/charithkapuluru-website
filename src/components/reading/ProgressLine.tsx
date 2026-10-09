"use client";

import { motion, useScroll } from "framer-motion";

export default function ProgressLine() {
  const { scrollYProgress } = useScroll();
  return <motion.div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent" style={{ scaleX: scrollYProgress }} />;
}
