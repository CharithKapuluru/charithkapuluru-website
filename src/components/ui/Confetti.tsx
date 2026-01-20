"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

const colors = [
  "#3A5A40", // moss
  "#BC4749", // terracotta
  "#D4A373", // sand
  "#A3B18A", // sage
  "#5A8A60", // light moss
  "#E8B88A", // light sand
];

const Confetti = ({ isActive, onComplete }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 360,
          size: Math.random() * 8 + 4,
        });
      }
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
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
                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Celebration message component
export const CelebrationMessage = ({
  isVisible,
  phaseName,
  onClose
}: {
  isVisible: boolean;
  phaseName: string;
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center z-[99] bg-black/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-bg-paper p-8 rounded-lg shadow-2xl text-center max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-serif text-text-charcoal mb-2">
              Phase Complete!
            </h3>
            <p className="text-text-taupe mb-4">
              You&apos;ve completed <strong className="text-accent-moss">{phaseName}</strong>
            </p>
            <p className="text-sm text-text-olive mb-6">
              Keep up the great work! Continue to the next phase.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-accent-moss text-white rounded-lg hover:bg-accent-moss/90 transition-colors"
            >
              Continue Learning
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;
