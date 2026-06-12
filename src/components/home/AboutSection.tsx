"use client";

import { motion, useReducedMotion } from "framer-motion";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

export default function AboutSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-bg-cream py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div className="flex items-center justify-center gap-4">
          <motion.div
            initial={reduce ? false : { opacity: 0, rotate: -6 }}
            whileInView={{ opacity: 1, rotate: -3 }}
            viewport={{ once: true }}
            className="w-64 rounded-md bg-white p-3 pb-10 paper-shadow"
          >
            <img
              src="/world/charith-photo.webp"
              alt="Charith Kapuluru, the real one, in a navy suit"
              className="w-full rounded-sm"
            />
            <p className="mt-3 text-center font-serif text-sm text-text-taupe">
              the real one
            </p>
          </motion.div>
          <div className="hidden flex-col items-center gap-2 md:flex">
            <SpeechBubble tail="bottom">that&apos;s me, allegedly</SpeechBubble>
            <Avatar pose="point" width={130} />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-4xl font-semibold text-text-charcoal md:text-5xl">
            About the human
          </h2>
          <div className="mt-5 space-y-4 font-sans text-lg text-text-taupe">
            <p>
              I&apos;m a software engineer doing my Master&apos;s in Computer Science at the
              University of North Texas. Before that I spent three years at KANsolv
              Technologies breaking monoliths into microservices on AWS and building
              the pipelines that kept them honest.
            </p>
            <p>
              I like Linux, Terraform, and explaining hard things simply. I won a
              cybersecurity hackathon once and have been insufferable about it since.
            </p>
          </div>
          <a
            href="/ck.pdf"
            download="Charith_Kapuluru_Resume.pdf"
            title="he straightens his tie when you hover this"
            className="mt-8 inline-block rounded-full bg-text-charcoal px-7 py-3.5 font-sans text-base font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98]"
          >
            Grab my resume
          </a>
        </div>
      </div>
    </section>
  );
}
