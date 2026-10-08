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
                    className="h-40 bg-gradient-to-br relative flex items-end px-8 pb-6"
                  >
                    {/* Decorative circles */}
                    <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-bg-paper/10 blur-xl" />
                    <div className="absolute bottom-8 right-16 w-16 h-16 rounded-full bg-accent-moss/10 blur-lg" />

                    <div className="relative flex items-center gap-4">
                      <div className="p-4 rounded-xl bg-bg-paper/90 border border-text-charcoal/5 text-text-olive group-hover:text-accent-moss group-hover:scale-110 transition-all duration-300 shadow-sm">
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
                Networking, Docker, CI/CD basics, Git, APIs, and more, stay
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
