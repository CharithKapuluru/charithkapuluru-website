"use client";

import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import Avatar from "@/components/brand/Avatar";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Hero() {
  const reduce = useReducedMotion();
  const enter = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.32, delay: i * 0.06, ease },
  });

  return (
    <section className="mx-auto grid min-h-[min(calc(100dvh_-_4rem),820px)] max-w-6xl items-center gap-10 px-4 pb-16 pt-16 sm:px-6 md:grid-cols-12 md:pb-24 md:pt-24">
      <div className="order-2 md:order-1 md:col-span-7">
        <motion.h1 {...enter(0)} className="text-display-xl text-fg">
          I build cloud infrastructure and explain how it works.
        </motion.h1>
        <motion.p {...enter(1)} className="mt-5 max-w-[36ch] text-lede text-fg-2">
          Cloud and DevOps engineer. Three years shipping microservices on AWS, now finishing an MS in Computer Science at UNT.
        </motion.p>
        <motion.div {...enter(2)} className="mt-8 flex flex-wrap gap-3">
          <Button href="/projects" size="lg">
            View projects
          </Button>
          <Button href="/fundamentals" variant="secondary" size="lg">
            Read the guides
          </Button>
        </motion.div>
      </div>
      <motion.div {...enter(1)} className="order-1 md:order-2 md:col-span-5">
        <div className="relative mx-auto flex w-full max-w-[420px] items-end justify-center overflow-hidden rounded-lg bg-surface-2 px-6 pt-6">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,var(--accent-soft),transparent_70%)] opacity-70" />
          <Avatar pose="laptop" width={380} priority className="relative" />
        </div>
      </motion.div>
    </section>
  );
}
