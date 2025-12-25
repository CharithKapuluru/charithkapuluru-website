'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Temporary gradient-based slideshow (use until you add videos)
// This gives you the Apple-style experience without needing videos immediately

interface GradientSlide {
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
}

const gradientSlides: GradientSlide[] = [
  {
    title: 'Innovation',
    subtitle: 'Building the Future',
    description: 'Creating exceptional digital experiences that inspire and transform',
    gradient: 'radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
  },
  {
    title: 'Design',
    subtitle: 'Beautiful & Functional',
    description: 'Where aesthetics meet usability in perfect harmony',
    gradient: 'radial-gradient(circle at 30% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 50%), linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
  },
  {
    title: 'Technology',
    subtitle: 'Cutting Edge Solutions',
    description: 'Leveraging modern technologies to solve real-world problems',
    gradient: 'radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(5, 150, 105, 0.2) 0%, transparent 50%), linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
  },
];

export default function GradientHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % gradientSlides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % gradientSlides.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + gradientSlides.length) % gradientSlides.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlay(false);
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
          style={{ background: gradientSlides[currentSlide].gradient }}
        >
          {/* Animated grain overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h2 className="text-white/60 text-xl md:text-2xl font-light mb-4 tracking-wider uppercase">
                  {gradientSlides[currentSlide].subtitle}
                </h2>
              </motion.div>

              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tight"
              >
                {gradientSlides[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-white/80 text-xl md:text-2xl font-light max-w-3xl mx-auto"
              >
                {gradientSlides[currentSlide].description}
              </motion.p>
            </div>
          </div>

          {/* Floating particles effect */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {gradientSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? 'bg-white w-12'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </div>
      </motion.div>

      {/* Temporary Notice */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/70 text-sm">
        Using gradient backgrounds • Add videos for full effect
      </div>
    </section>
  );
}
