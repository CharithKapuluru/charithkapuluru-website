'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollAnimation } from '@/components/effects/useScrollAnimation';

interface StickyVideoSectionProps {
  videoSrc: string;
  poster?: string;
  title: string;
  description: string;
  features?: string[];
}

export default function StickyVideoSection({
  videoSrc,
  poster,
  title,
  description,
  features = [],
}: StickyVideoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.8, 0.8, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-black">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scale, opacity }} className="relative h-full">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={poster}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <motion.div
              style={{ y: textY }}
              className="max-w-6xl mx-auto px-6 text-center"
            >
              <motion.div
                ref={titleRef}
                initial={{ opacity: 0, y: 60 }}
                animate={titleVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight">
                  {title}
                </h2>
                <p className="text-xl md:text-2xl text-white/80 font-light max-w-4xl mx-auto mb-12">
                  {description}
                </p>
              </motion.div>

              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={titleVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={titleVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500"
                    >
                      <p className="text-white/90 text-lg font-light">
                        {feature}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
