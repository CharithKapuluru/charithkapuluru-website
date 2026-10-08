"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Layer {
  label: string;
  description: string;
  color: string;
}

interface LayerDiagramProps {
  layers: Layer[];
  title?: string;
}

const LayerDiagram = ({ layers, title }: LayerDiagramProps) => {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  return (
    <motion.div
      className="my-8 p-5 md:p-6 bg-bg rounded-lg border border-fg/10"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {title && (
        <h4 className="font-display font-semibold text-fg mb-4">
          {title}
        </h4>
      )}

      <div className="space-y-1.5">
        {layers.map((layer, i) => (
          <motion.button
            key={i}
            className={`w-full text-left rounded-lg px-5 py-4 border transition-all cursor-pointer ${
              activeLayer === i
                ? "border-fg/20 shadow-sm"
                : "border-transparent hover:border-fg/10"
            }`}
            style={{ backgroundColor: layer.color }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            onClick={() => setActiveLayer(activeLayer === i ? null : i)}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-fg">
                {layer.label}
              </span>
              <span className="text-xs font-mono text-fg-2">
                {activeLayer === i ? "close" : "click to learn more"}
              </span>
            </div>

            <AnimatePresence>
              {activeLayer === i && (
                <motion.p
                  className="text-sm text-fg-2 mt-2 leading-relaxed"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {layer.description}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-fg-3 mt-4 text-center font-mono">
        Top = closest to user | Bottom = closest to hardware
      </p>
    </motion.div>
  );
};

export default LayerDiagram;
