"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (reduce) return <>{children}</>;

  return (
    <>
      {!done && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ x: "0%" }}
              animate={{ x: "130vw" }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.6, 0, 0.3, 1] }}
              className="absolute rounded-full bg-white"
              style={{
                width: "70vw",
                height: "45vh",
                left: `-${75 + i * 10}vw`,
                top: `${i * 30}vh`,
                filter: "blur(8px)",
              }}
            />
          ))}
        </div>
      )}
      {children}
    </>
  );
}
