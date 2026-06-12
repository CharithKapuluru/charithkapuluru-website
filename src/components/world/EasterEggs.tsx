"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Avatar from "./Avatar";
import SpeechBubble from "./SpeechBubble";
import { useWorld } from "./WorldProvider";
import { useKonami } from "@/hooks/useKonami";

const IDLE_MS = 30000;

export default function EasterEggs() {
  const reduce = useReducedMotion();
  const { boop } = useWorld();
  const [dancing, setDancing] = useState(false);
  const [idle, setIdle] = useState(false);

  useKonami(
    useCallback(() => {
      if (reduce) return;
      boop(700);
      setDancing(true);
      setTimeout(() => setDancing(false), 3200);
    }, [reduce, boop])
  );

  // Idle watcher: avatar gets bored after 30s of no input.
  useEffect(() => {
    let timer = setTimeout(() => setIdle(true), IDLE_MS);
    const reset = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), IDLE_MS);
    };
    const events: (keyof WindowEventMap)[] = ["pointermove", "keydown", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, []);

  return (
    <AnimatePresence>
      {dancing && (
        <motion.div
          key="dance"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, 360, 720] }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-[85] -translate-x-1/2"
          aria-hidden
        >
          <Avatar pose="wave" width={150} pokeable={false} />
        </motion.div>
      )}
      {idle && !dancing && (
        <motion.div
          key="idle"
          initial={{ x: 160, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 160, opacity: 0 }}
          className="fixed bottom-5 right-4 z-[85] flex flex-col items-center gap-1.5"
        >
          <SpeechBubble tail="bottom">you still there?</SpeechBubble>
          <Avatar pose="bored" width={110} pokeable={false} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
