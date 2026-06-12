"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { topics } from "@/lib/fundamentalsData";
import WorldNav from "@/components/world/WorldNav";
import LibraryHeader from "@/components/world/scenes/LibraryHeader";

export default function FundamentalsPage() {
  return (
    <main className="min-h-screen bg-bg-paper">
      <WorldNav />
      <LibraryHeader
        title="The Library"
        subtitle="Plain-language guides to how computers actually work. Pick a book."
        avatarLine="I read all of these. wrote them too"
      />

      {/* Topic Cards - Full Width with background */}
      <section className="bg-bg-cream/50">
        <div className="px-6 md:px-10 lg:px-16 xl:px-24 py-16">
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
                        ) : topic.icon === "folder" ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                          </svg>
                        ) : topic.icon === "shield" ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        ) : topic.icon === "clock" ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : topic.icon === "container" ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
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
                        <span>{topic.readingTime}</span>
                        <span>Beginner Friendly</span>
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
