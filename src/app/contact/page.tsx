"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const skills = [
  "TypeScript",
  "React / Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AWS Infrastructure",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Tailwind CSS",
  "Figma",
];

export default function ContactPage() {
  const formRef = useRef(null);
  const heroRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, margin: "-100px" });
  const isHeroInView = useInView(heroRef, { once: true });

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "Technical Consultation",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "contacts"), {
        name: formState.name,
        email: formState.email,
        projectType: formState.projectType,
        message: formState.message,
        createdAt: serverTimestamp(),
        read: false,
      });
      setSubmitted(true);
      setFormState({
        name: "",
        email: "",
        projectType: "Technical Consultation",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-paper text-text-charcoal">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-bg-paper/90 backdrop-blur-xl border-b border-text-charcoal/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <Link href="/" className="text-xl font-serif italic text-text-charcoal hover:text-accent-moss transition-colors">
            Charith K.
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#projects"
              className="text-sm font-sans text-text-olive hover:text-accent-moss transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/fundamentals"
              className="text-sm font-sans text-text-olive hover:text-accent-moss transition-colors"
            >
              Fundamentals
            </Link>
            <Link
              href="/contact"
              className="text-sm font-sans text-accent-moss font-semibold border-b-2 border-accent-moss pb-0.5"
            >
              Contact
            </Link>
          </div>
          <a
            href="/ck.pdf"
            download="Charith_Kapuluru_Resume.pdf"
            className="bg-text-charcoal text-bg-paper px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent-moss transition-colors active:scale-95"
          >
            Resume
          </a>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-8 mb-24" ref={heroRef}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-serif text-6xl md:text-8xl tracking-tight leading-[0.95] mb-8"
              >
                Technical precision <br />
                <span className="italic font-light text-accent-moss">
                  meets editorial clarity.
                </span>
              </motion.h1>
            </div>
            <div className="md:col-span-4 pb-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-lg text-text-olive font-light leading-relaxed"
              >
                A full-stack engineer focusing on scalable architecture and the
                craft of clean, purposeful interfaces.
              </motion.p>
            </div>
          </div>
        </section>

        {/* About & Portrait */}
        <section className="max-w-7xl mx-auto px-8 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Portrait placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="aspect-[4/5] bg-bg-stone overflow-hidden rounded-xl shadow-[0_10px_40px_-10px_rgba(45,42,38,0.12)] flex items-center justify-center">
                {/* Replace with <Image> once you add a portrait photo to /public/portrait.jpg */}
                <div className="flex flex-col items-center gap-4 text-text-olive/30">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs tracking-widest uppercase font-sans">Portrait</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-8 bg-bg-paper shadow-xl rounded-xl hidden md:block">
                <span className="block font-serif text-3xl italic text-accent-moss">Based in</span>
                <span className="block font-sans text-sm tracking-widest uppercase mt-2 text-text-olive">
                  Denton, Texas
                </span>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="pt-8 md:pt-20"
            >
              <div className="mb-12">
                <h2 className="font-serif text-4xl mb-6 text-text-charcoal">The Narrative</h2>
                <div className="space-y-5 text-text-olive leading-relaxed text-lg">
                  <p>
                    I specialize in building digital experiences that feel intentional and precise.
                    My approach combines the rigor of systems engineering with a deep appreciation
                    for clean, purposeful design.
                  </p>
                  <p>
                    From cloud infrastructure and DevSecOps pipelines to React-driven interfaces
                    and kernel-level concepts — I view engineering as a medium for building
                    things that last.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-sans font-semibold text-xs tracking-widest uppercase text-accent-moss mb-5">
                  Technical Core
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-bg-cream text-text-taupe text-sm rounded-full shadow-sm border border-text-charcoal/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="bg-bg-cream py-32" ref={formRef}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Left: Info */}
              <div className="lg:col-span-5">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7 }}
                  className="font-serif text-5xl mb-8 text-text-charcoal"
                >
                  Let&apos;s curate <br />something new.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-text-olive text-lg mb-12 max-w-sm leading-relaxed"
                >
                  Whether you have a specific project in mind or just want to
                  talk shop, I&apos;m always open to new conversations.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="space-y-8"
                >
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-text-olive mb-1">
                      Inquiries
                    </p>
                    <a
                      href="mailto:kapulurucharith@gmail.com"
                      className="text-lg font-medium hover:text-accent-moss transition-colors"
                    >
                      kapulurucharith@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-text-olive mb-1">
                      Location
                    </p>
                    <p className="text-lg font-medium">Denton, Texas</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-text-olive mb-2">
                      Connect
                    </p>
                    <div className="flex gap-6">
                      <a
                        href="https://github.com/CharithKapuluru"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-accent-moss transition-colors underline underline-offset-4"
                      >
                        GitHub
                      </a>
                      <a
                        href="https://www.linkedin.com/in/charith-kapuluru-159456329/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-accent-moss transition-colors underline underline-offset-4"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-7"
              >
                <div className="bg-bg-paper p-8 md:p-12 rounded-xl shadow-[0_10px_40px_-10px_rgba(45,42,38,0.08)]">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="text-xs uppercase tracking-widest font-bold text-text-olive mb-2 block">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                          placeholder="Your name"
                          className="w-full bg-transparent border-b border-text-charcoal/15 focus:border-accent-moss py-3 px-0 focus:ring-0 focus:outline-none transition-colors text-text-charcoal placeholder:text-text-olive/40 font-sans"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest font-bold text-text-olive mb-2 block">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({ ...formState, email: e.target.value })
                          }
                          placeholder="your@email.com"
                          className="w-full bg-transparent border-b border-text-charcoal/15 focus:border-accent-moss py-3 px-0 focus:ring-0 focus:outline-none transition-colors text-text-charcoal placeholder:text-text-olive/40 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-widest font-bold text-text-olive mb-2 block">
                        Project Type
                      </label>
                      <select
                        value={formState.projectType}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            projectType: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border-b border-text-charcoal/15 focus:border-accent-moss py-3 px-0 focus:ring-0 focus:outline-none transition-colors text-text-charcoal appearance-none cursor-pointer font-sans"
                      >
                        <option>Technical Consultation</option>
                        <option>Full-stack Development</option>
                        <option>Cloud Infrastructure</option>
                        <option>Design System Architecture</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-widest font-bold text-text-olive mb-2 block">
                        Message
                      </label>
                      <textarea
                        required
                        value={formState.message}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            message: e.target.value,
                          })
                        }
                        placeholder="Tell me about your vision..."
                        rows={4}
                        className="w-full bg-transparent border-b border-text-charcoal/15 focus:border-accent-moss py-3 px-0 focus:ring-0 focus:outline-none transition-colors text-text-charcoal placeholder:text-text-olive/40 resize-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || submitted}
                      className="w-full bg-text-charcoal text-bg-paper py-5 rounded-lg font-medium text-lg tracking-wide hover:bg-accent-moss transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? "Sending..."
                        : submitted
                        ? "Message Sent ✓"
                        : "Send Message"}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-bg-paper border-t border-text-charcoal/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 py-10 gap-6">
          <div className="text-lg font-serif italic text-text-charcoal">Charith K.</div>
          <div className="flex items-center gap-8">
            <a
              href="https://github.com/CharithKapuluru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase text-text-olive hover:text-accent-moss transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/charith-kapuluru-159456329/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase text-text-olive hover:text-accent-moss transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:kapulurucharith@gmail.com"
              className="text-xs tracking-widest uppercase text-text-olive hover:text-accent-moss transition-colors"
            >
              Email
            </a>
          </div>
          <p className="font-serif text-text-olive text-sm italic" suppressHydrationWarning>
            © {new Date().getFullYear()} Charith K.
          </p>
        </div>
      </footer>
    </div>
  );
}
