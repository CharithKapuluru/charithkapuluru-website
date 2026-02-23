"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { topics } from "@/lib/fundamentalsData";

export default function FundamentalsPage() {
  return (
    <main className="min-h-screen bg-bg-paper">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-bg-paper/95 backdrop-blur-sm border-b border-text-charcoal/10">
        <div className="px-6 md:px-10 lg:px-16">
          <div className="flex items-center h-12">
            <Link
              href="/#projects"
              className="flex items-center gap-1.5 text-sm font-serif text-text-olive hover:text-accent-moss transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Home
            </Link>
          </div>
        </div>
      </div>

      {/* Hero - Full Width */}
      <section className="relative overflow-hidden">
        {/* Background gradient that fills the entire width */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-sage/15 via-bg-cream to-accent-moss/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent-moss)_0%,_transparent_50%)] opacity-[0.07]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-accent-sand)_0%,_transparent_50%)] opacity-[0.08]" />

        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-text-charcoal) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-charcoal) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          {/* Left side - Text */}
          <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 xl:px-24 py-16 lg:py-24">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm font-mono uppercase tracking-[0.2em] text-accent-moss mb-6"
            >
              Fundamentals
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-text-charcoal mb-8 leading-[1.1]"
            >
              Everything starts with understanding{" "}
              <em className="text-accent-moss not-italic font-serif">why</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-text-taupe leading-relaxed mb-4"
            >
              AI is changing the world. But the engineers who understand the
              fundamentals — how computers actually work, what Linux is, why
              servers exist — will always have the edge.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base text-text-olive leading-relaxed"
            >
              Whether you&apos;re a complete beginner or a working professional
              refreshing your basics, every concept is explained with real-world
              analogies, interactive examples, and zero assumptions.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-8 mt-10 pt-10 border-t border-text-charcoal/10"
            >
              {[
                { label: "Topics", value: "9 sections", icon: "📚" },
                { label: "Reading Time", value: "~35 min", icon: "⏱️" },
                { label: "Level", value: "Beginner Friendly", icon: "🌱" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-text-olive">
                      {stat.label}
                    </p>
                    <p className="text-lg font-serif font-semibold text-text-charcoal">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side - Visual */}
          <div className="hidden lg:flex items-center justify-center px-10 xl:px-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-lg"
            >
              {/* Visual card stack showing topics */}
              <div className="relative">
                {[
                  {
                    title: "Computing Basics",
                    icon: "🖥️",
                    color: "from-accent-moss/20 to-accent-sage/20",
                    rotate: "-3deg",
                    z: 1,
                  },
                  {
                    title: "Networking Basics",
                    icon: "📡",
                    color: "from-accent-terracotta/15 to-accent-sand/15",
                    rotate: "1deg",
                    z: 2,
                  },
                  {
                    title: "Linux Filesystem",
                    icon: "🐧",
                    color: "from-accent-sage/20 to-accent-moss/15",
                    rotate: "-1deg",
                    z: 3,
                  },
                  {
                    title: "File Permissions",
                    icon: "🔐",
                    color: "from-bg-cream to-accent-moss/15",
                    rotate: "2deg",
                    z: 4,
                  },
                ].map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 40, rotate: 0 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotate: card.rotate,
                    }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                    className={`relative bg-gradient-to-br ${card.color} rounded-2xl p-6 border border-text-charcoal/5 shadow-lg mb-4`}
                    style={{ zIndex: card.z }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{card.icon}</span>
                      <div>
                        <p className="font-serif text-lg text-text-charcoal font-medium">
                          {card.title}
                        </p>
                        <div className="h-1.5 w-24 bg-accent-moss/20 rounded-full mt-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{
                              duration: 1.5,
                              delay: 1 + i * 0.2,
                              ease: "easeOut",
                            }}
                            className="h-full bg-accent-moss/50 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Topic Cards - Full Width with background */}
      <section className="bg-bg-cream/50">
        <div className="px-6 md:px-10 lg:px-16 xl:px-24 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-text-charcoal mb-3">
              Available Topics
            </h2>
            <p className="text-text-taupe font-serif mb-10 max-w-xl">
              Start from the beginning or jump to the topic you need. Each section
              builds on what came before.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/fundamentals/${topic.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-text-charcoal/8 bg-bg-paper transition-all duration-300 hover:shadow-2xl hover:shadow-accent-moss/10 hover:border-accent-moss/20 hover:-translate-y-1"
                >
                  {/* Header gradient */}
                  <div
                    className={`h-40 bg-gradient-to-br ${topic.gradient} relative flex items-end px-8 pb-6`}
                  >
                    {/* Decorative circles */}
                    <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-bg-paper/10 blur-xl" />
                    <div className="absolute bottom-8 right-16 w-16 h-16 rounded-full bg-accent-moss/10 blur-lg" />

                    <div className="relative flex items-center gap-4">
                      <div className="p-4 rounded-xl bg-bg-paper/90 border border-text-charcoal/5 text-text-olive group-hover:text-accent-moss group-hover:scale-110 transition-all duration-300 shadow-sm">
                        {topic.icon === "network" ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                          </svg>
                        ) : topic.icon === "terminal" ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : topic.icon === "lock" ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                          />
                        </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] font-serif text-accent-moss font-medium">
                          {topic.subtitle}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-serif text-text-charcoal group-hover:text-accent-moss transition-colors">
                          {topic.title}
                        </h3>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-bg-paper/90 border border-text-charcoal/5 shadow-sm">
                      <span className="text-xs font-medium font-serif text-text-charcoal">
                        {topic.sectionCount} Sections
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className="text-sm font-serif text-text-taupe mb-6 leading-relaxed">
                      {topic.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {topic.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 text-xs font-serif bg-bg-cream text-text-olive rounded-lg border border-text-charcoal/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-text-charcoal/5">
                      <div className="flex items-center gap-4 text-xs font-mono text-text-olive">
                        <span>⏱️ {topic.readingTime}</span>
                        <span>🌱 Beginner Friendly</span>
                      </div>
                      <span className="text-accent-moss font-serif text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Start Reading
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Coming Soon Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border-2 border-dashed border-text-charcoal/15 bg-bg-paper/50 flex flex-col items-center justify-center p-12 text-center min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-full bg-accent-sage/15 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-accent-moss/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <p className="text-xl font-serif text-text-charcoal mb-2">
                More topics coming soon
              </p>
              <p className="text-sm text-text-taupe max-w-sm">
                Networking, Docker, CI/CD basics, Git, APIs, and more — stay
                tuned as new fundamentals are added over time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-moss/5 via-transparent to-accent-sage/5" />
        <div className="relative px-6 md:px-10 lg:px-16 xl:px-24 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-text-taupe font-serif text-lg mb-6">
              Ready to build your foundation?
            </p>
            <Link
              href="/fundamentals/computing-basics"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-moss text-bg-paper font-serif rounded-xl hover:bg-accent-moss/90 transition-colors text-lg shadow-lg shadow-accent-moss/20"
            >
              Start with Computing Basics
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
