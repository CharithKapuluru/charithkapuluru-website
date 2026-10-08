"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Avatar from "./Avatar";
import { useKonami } from "@/hooks/useKonami";

/** Up, up, down, down, left, right, left, right, B, A: the avatar spins across the bottom of the screen. */
export default function Konami() {
  const reduce = useReducedMotion();
  const [dancing, setDancing] = useState(false);

  useKonami(
    useCallback(() => {
      if (reduce || dancing) return;
      setDancing(true);
      setTimeout(() => setDancing(false), 3200);
    }, [reduce, dancing]),
  );

  return (
    <AnimatePresence>
      {dancing && (
        <motion.div
          key="dance"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, 360, 720] }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
          aria-hidden
        >
          <Avatar pose="wave" width={150} pokeable={false} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
