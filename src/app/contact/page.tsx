"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import WorldNav from "@/components/world/WorldNav";
import GrassFooter from "@/components/home/GrassFooter";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";
import { useWorld } from "@/components/world/WorldProvider";

export default function ContactPage() {
  const reduce = useReducedMotion();
  const { wheee } = useWorld();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "Just saying hi",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "delivering" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await addDoc(collection(db, "contacts"), {
        ...formState,
        createdAt: serverTimestamp(),
        read: false,
      });
      wheee();
      setStatus(reduce ? "sent" : "delivering");
      if (!reduce) setTimeout(() => setStatus("sent"), 1600);
      setFormState({ name: "", email: "", projectType: "Just saying hi", message: "" });
    } catch (err) {
      console.error("Error submitting form:", err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border-2 border-bg-stone bg-white px-4 py-3 font-sans text-text-charcoal placeholder:text-text-olive/50 focus:border-accent-moss focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-bg-cream">
      <WorldNav />

      {/* Mailbox scene */}
      <section className="relative overflow-hidden pt-16">
        <img
          src="/world/scenes/mailbox-1920.webp"
          srcSet="/world/scenes/mailbox-768.webp 768w, /world/scenes/mailbox-1280.webp 1280w, /world/scenes/mailbox-1920.webp 1920w"
          sizes="100vw"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative mx-auto grid min-h-[85dvh] max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          {/* Left: pitch */}
          <div className="rounded-2xl bg-bg-paper/95 p-8 paper-shadow">
            <h1 className="font-serif text-4xl font-semibold text-text-charcoal md:text-5xl" style={{ textWrap: "balance" }}>
              Drop a postcard in the mailbox
            </h1>
            <p className="mt-4 max-w-[50ch] font-sans text-lg text-text-taupe">
              Recruiters, collaborators, and people who just read all ten Library
              articles: I answer everything.
            </p>
            <div className="mt-8 space-y-2 font-sans text-text-taupe">
              <p>
                <a href="mailto:kapulurucharith@gmail.com" className="font-bold text-accent-moss underline underline-offset-4 hover:no-underline">
                  kapulurucharith@gmail.com
                </a>
              </p>
              <p>Denton, Texas</p>
              <p className="flex gap-5 pt-2 text-sm font-bold">
                <a href="https://github.com/CharithKapuluru" target="_blank" rel="noopener noreferrer" className="hover:text-accent-moss">GitHub</a>
                <a href="https://www.linkedin.com/in/charith-kapuluru-159456329/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-moss">LinkedIn</a>
              </p>
            </div>
          </div>

          {/* Right: postcard form */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 1.5 }}
            className="relative rounded-md bg-white p-7 paper-shadow md:p-9"
          >
            {/* stamp */}
            <div aria-hidden className="absolute right-5 top-5 flex h-14 w-12 items-center justify-center rounded-sm border-2 border-dashed border-accent-moss/40 bg-bg-cream font-serif text-[10px] font-bold text-accent-moss">
              CK
            </div>
            <h2 className="font-serif text-2xl font-semibold text-text-charcoal">Postcard</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block font-sans text-sm font-bold text-text-taupe">From</label>
                  <input id="name" type="text" required value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block font-sans text-sm font-bold text-text-taupe">Reply address</label>
                  <input id="email" type="email" required value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="you@example.com" className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="projectType" className="mb-1.5 block font-sans text-sm font-bold text-text-taupe">This is about</label>
                <select id="projectType" value={formState.projectType}
                  onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                  className={inputClass}>
                  <option>Just saying hi</option>
                  <option>A job opportunity</option>
                  <option>A project or collaboration</option>
                  <option>Something else</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block font-sans text-sm font-bold text-text-taupe">Message</label>
                <textarea id="message" required rows={4} maxLength={5000} value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Write your postcard" className={`${inputClass} resize-none`} />
              </div>
              {status === "error" && (
                <p role="alert" className="font-sans text-sm font-bold text-accent-terracotta">
                  Sending failed. Please try again, or email me directly.
                </p>
              )}
              <button type="submit" disabled={status === "sending" || status === "delivering" || status === "sent"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-text-charcoal py-4 font-sans text-base font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98] disabled:opacity-60">
                <PaperPlaneTilt size={18} weight="bold" />
                {status === "sending" ? "Stamping..." : status === "delivering" ? "Delivering..." : status === "sent" ? "Delivered" : "Send postcard"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Envelope delivery run */}
        <AnimatePresence>
          {status === "delivering" && (
            <motion.div
              key="runner"
              initial={{ x: "100vw" }}
              animate={{ x: "-30vw" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="pointer-events-none fixed bottom-6 left-0 z-[80]"
              aria-hidden
            >
              <div className="relative">
                <span className="absolute -top-6 left-10 text-3xl">✉️</span>
                <Avatar pose="peek" width={130} flip pokeable={false} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {status === "sent" && (
          <div className="pointer-events-none fixed bottom-8 left-1/2 z-[80] -translate-x-1/2">
            <SpeechBubble tail="bottom">delivered. I will reply, promise</SpeechBubble>
          </div>
        )}
      </section>

      <GrassFooter />
    </div>
  );
}
