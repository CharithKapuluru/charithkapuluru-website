"use client";

import { motion } from "framer-motion";

interface RealTalkProps {
  children: React.ReactNode;
}

const RealTalk = ({ children }: RealTalkProps) => {
  return (
    <motion.div
      className="my-8 relative"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Speech bubble tail */}
      <div className="absolute -left-1 top-4 w-4 h-4 bg-amber-50 border-l border-b border-amber-200/60 transform rotate-45 -translate-x-1/2" />

      <div className="bg-amber-50 border border-amber-200/60 rounded-lg rounded-tl-none p-5 pl-6">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">💬</span>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-600/80 mb-2 block">
              Real Talk
            </span>
            <p className="text-text-taupe leading-relaxed italic">
              {children}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RealTalk;
