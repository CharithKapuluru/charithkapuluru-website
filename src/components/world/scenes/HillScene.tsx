"use client";

import { motion, useReducedMotion } from "framer-motion";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

export default function HillScene() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* Scene art */}
      <img
        src="/world/scenes/hill-1920.webp"
        srcSet="/world/scenes/hill-768.webp 768w, /world/scenes/hill-1280.webp 1280w, /world/scenes/hill-1920.webp 1920w"
        sizes="100vw"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-bottom"
        fetchPriority="high"
      />
      {/* Drifting bonus clouds */}
      {!reduce &&
        [0, 1].map((i) => (
          <motion.div
            key={i}
            aria-hidden
            initial={{ x: "-20vw" }}
            animate={{ x: "120vw" }}
            transition={{ duration: 70 + i * 25, repeat: Infinity, ease: "linear", delay: i * 18 }}
            className="absolute rounded-full bg-white/80 blur-[2px]"
            style={{ width: 120 + i * 60, height: 36 + i * 14, top: `${10 + i * 9}%` }}
          />
        ))}

      {/* Copy on the upper sky area (light blue, AA contrast with ink text) */}
      <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-center px-5 pt-24 md:px-8">
        <div className="max-w-xl">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl font-semibold tracking-tight text-text-charcoal md:text-6xl"
            style={{ textWrap: "balance" }}
          >
            Hi, I&apos;m Charith. I build cloud things.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-md font-sans text-lg text-text-taupe"
          >
            DevOps engineer, Linux tinkerer, and your guide to this little world.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <a
              href="#workshop"
              className="inline-block rounded-full bg-text-charcoal px-7 py-3.5 font-sans text-base font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98]"
            >
              See my work
            </a>
          </motion.div>
        </div>
      </div>

      {/* Avatar bottom-right */}
      <div className="absolute bottom-[4%] right-[6%] hidden items-end gap-3 md:flex">
        <SpeechBubble tail="right" delay={0.8} className="mb-24">
          oh hey, you found me
        </SpeechBubble>
        <Avatar pose="wave" width={210} track />
      </div>
      {/* Mobile avatar, smaller */}
      <div className="absolute bottom-2 right-3 md:hidden">
        <Avatar pose="wave" width={120} />
      </div>
    </section>
  );
}
