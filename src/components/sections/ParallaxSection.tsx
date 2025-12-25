'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollAnimation } from '@/components/effects/useScrollAnimation';

interface ParallaxSectionProps {
  backgroundVideoSrc?: string;
  backgroundImage?: string;
  poster?: string;
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export default function ParallaxSection({
  backgroundVideoSrc,
  backgroundImage,
  poster,
  children,
  className = '',
  speed = 0.5,
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        {backgroundVideoSrc ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={poster}
              className="absolute inset-0 w-full h-full object-cover scale-110"
            >
              <source src={backgroundVideoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
          </>
        ) : backgroundImage ? (
          <>
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center scale-110"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-black" />
        )}
      </motion.div>

      {/* Content */}
      <motion.div ref={ref} style={{ opacity }} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
