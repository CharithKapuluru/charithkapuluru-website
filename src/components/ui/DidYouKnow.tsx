"use client";

import { motion } from "framer-motion";

interface DidYouKnowProps {
  children: React.ReactNode;
}

const DidYouKnow = ({ children }: DidYouKnowProps) => {
  return (
    <motion.div
      className="my-8 bg-emerald-50/80 border border-emerald-200/60 rounded-lg p-5 md:p-6"
      initial={{ scale: 0.98, opacity: 0, x: -10 }}
      whileInView={{ scale: 1, opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.5,
      }}
    >
      <div className="flex gap-4">
        <motion.span
          className="text-2xl flex-shrink-0"
          initial={{ rotate: -10, scale: 0.8 }}
          whileInView={{ rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          🤯
        </motion.span>
        <div>
          <h4 className="font-serif font-semibold text-emerald-800 mb-2">
            Did You Know?
          </h4>
          <div className="text-text-taupe leading-relaxed">{children}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default DidYouKnow;
