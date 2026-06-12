"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Wrench } from "@phosphor-icons/react";
import { projects } from "@/lib/projectsData";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

export default function WorkshopSection() {
  const reduce = useReducedMotion();
  const [first, ...rest] = projects;

  const card = (p: (typeof projects)[number], big: boolean) => (
    <motion.div
      key={p.id}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={`/projects/${p.slug}`}
        className="group flex h-full flex-col rounded-2xl bg-bg-paper p-6 paper-shadow transition-transform hover:-translate-y-1 md:p-8"
      >
        <div className="mb-3 flex items-center gap-2 text-accent-moss">
          <Wrench size={20} weight="bold" />
          <span className="font-sans text-xs font-bold uppercase tracking-wide">
            {p.phaseCount} phases
          </span>
        </div>
        <h3
          className={`font-serif font-semibold text-text-charcoal group-hover:text-accent-moss ${
            big ? "text-3xl md:text-4xl" : "text-2xl"
          }`}
        >
          {p.title}
        </h3>
        <p className="mt-3 grow font-sans text-text-taupe">{p.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.technologies.slice(0, big ? 8 : 4).map((t) => (
            <span
              key={t}
              className="rounded-full bg-bg-stone px-3 py-1 font-mono text-xs text-text-olive"
            >
              {t}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );

  return (
    <section id="workshop" className="bg-bg-cream py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="font-serif text-4xl font-semibold text-text-charcoal md:text-5xl">
            The Workshop
          </h2>
          <div className="hidden items-end gap-2 md:flex">
            <SpeechBubble tail="right">things I actually built</SpeechBubble>
            <Avatar pose="point" width={110} flip pokeable={false} />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">{card(first, true)}</div>
          <div className="flex flex-col gap-6 md:col-span-2">
            {rest.map((p) => card(p, false))}
          </div>
        </div>
      </div>
    </section>
  );
}
