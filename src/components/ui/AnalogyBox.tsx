"use client";

import { motion } from "framer-motion";

interface AnalogyBoxProps {
  icon?: string;
  children: React.ReactNode;
}

const AnalogyBox = ({ icon = "💡", children }: AnalogyBoxProps) => {
  return (
    <motion.div
      className="my-8 bg-amber-50/80 border border-amber-200/60 rounded-lg p-5 md:p-6"
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
          className="text-3xl flex-shrink-0"
          initial={{ rotate: -10, scale: 0.8 }}
          whileInView={{ rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.span>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-700/80 mb-2 block">
            Think of it this way...
          </span>
          <div className="text-text-taupe leading-relaxed italic">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalogyBox;
