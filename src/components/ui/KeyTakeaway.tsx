"use client";

import { motion } from "framer-motion";

interface KeyTakeawayProps {
  children: React.ReactNode;
  variant?: "yellow" | "blue" | "green";
}

const KeyTakeaway = ({ children, variant = "yellow" }: KeyTakeawayProps) => {
  const bgColors = {
    yellow: "bg-amber-50",
    blue: "bg-blue-50",
    green: "bg-emerald-50",
  };

  const borderColors = {
    yellow: "border-amber-400",
    blue: "border-blue-400",
    green: "border-emerald-400",
  };

  return (
    <motion.div
      className={`
        ${bgColors[variant]} ${borderColors[variant]}
        border-l-4 rounded-r-lg p-5 my-8
      `}
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
          💡
        </motion.span>
        <div>
          <h4 className="font-serif font-semibold text-text-charcoal mb-2">
            Key Takeaway
          </h4>
          <p className="text-text-taupe leading-relaxed">{children}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default KeyTakeaway;
