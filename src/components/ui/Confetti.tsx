"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Confetti as ConfettiIcon } from "@phosphor-icons/react/dist/ssr";
import Button from "./Button";
import { useBackdropClose } from "@/hooks/useBackdropClose";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
  round: boolean;
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

const colors = ["var(--accent)", "var(--accent-strong)", "var(--success)", "var(--info)", "var(--fg-3)"];

const Confetti = ({ isActive, onComplete }: ConfettiProps) => {
  const reduce = useReducedMotion();
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!isActive) return;
    if (reduce) {
      // Nothing flies under reduced motion, but the caller still hears that the celebration is over.
      onComplete?.();
      return;
    }
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4,
        round: Math.random() > 0.5,
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the pieces are random, which is impure, so they are made after mount; the same effect owns the 3 s timer
    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isActive, onComplete, reduce]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 3,
                delay: piece.delay,
                ease: "easeIn",
              }}
              style={{
                position: "absolute",
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: piece.round ? "50%" : "0%",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export const CelebrationMessage = ({ isVisible, phaseName, onClose }: { isVisible: boolean; phaseName: string; onClose: () => void }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const backdrop = useBackdropClose(ref, () => ref.current?.close());

  // A modal <dialog> keeps focus inside while it is open, closes on Escape, and hands focus back to whatever had it before it opened.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isVisible && !dialog.open) dialog.showModal();
    else if (!isVisible && dialog.open) dialog.close();
  }, [isVisible]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="celebration-title"
      {...backdrop}
      // Escape, the Continue button and a click on the backdrop all end in a close event; the parent's flag follows it.
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-border bg-surface p-0 text-fg shadow-float motion-safe:animate-rise"
    >
      <div className="p-8 text-center">
        <ConfettiIcon size={40} aria-hidden className="mx-auto text-accent" />
        <h3 id="celebration-title" className="mt-4 text-h3 text-fg">Phase complete</h3>
        <p className="mt-2 text-body text-fg-2">
          You finished <strong className="text-fg">{phaseName}</strong>.
        </p>
        <Button onClick={() => ref.current?.close()} className="mt-6">
          Continue
        </Button>
      </div>
    </dialog>
  );
};

export default Confetti;
