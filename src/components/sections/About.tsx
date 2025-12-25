"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Download, MapPin, Calendar } from "lucide-react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <span className="text-cyan-400 font-mono text-sm tracking-wider uppercase mb-4 block">
              About Me
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Passionate about building the{" "}
              <span className="gradient-text">future of tech</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left column - Image/Visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/10 overflow-hidden relative">
                {/* Placeholder for profile image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-6xl font-bold gradient-text">CK</span>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs">
                  Open to Work
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 grid-pattern opacity-50" />
              </div>

              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-6 -right-6 p-4 rounded-2xl glass"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Based in</p>
                    <p className="font-medium">United States</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -top-6 -left-6 p-4 rounded-2xl glass"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Experience</p>
                    <p className="font-medium">3+ Years</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right column - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <p className="text-lg text-zinc-300 leading-relaxed">
                I&apos;m a Software Engineer with a deep passion for emerging technologies.
                My journey in tech has led me to specialize in three cutting-edge domains
                that are shaping the future of our digital world.
              </p>

              <p className="text-lg text-zinc-400 leading-relaxed">
                In <span className="text-cyan-400 font-medium">Artificial Intelligence</span>,
                I work on building intelligent systems that can learn, adapt, and solve complex
                problems. From machine learning models to natural language processing, I love
                exploring how AI can enhance human capabilities.
              </p>

              <p className="text-lg text-zinc-400 leading-relaxed">
                My expertise in <span className="text-purple-400 font-medium">Cloud Computing</span>
                {" "}allows me to architect scalable, resilient infrastructure on platforms like
                AWS and GCP. I believe in building systems that can handle anything thrown at them.
              </p>

              <p className="text-lg text-zinc-400 leading-relaxed">
                With <span className="text-emerald-400 font-medium">Cybersecurity</span>,
                I ensure that the systems I build are not just functional but secure.
                In a world of increasing digital threats, security isn&apos;t an afterthought—it&apos;s
                foundational.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold gradient-text">10+</p>
                  <p className="text-sm text-zinc-500">Projects Completed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold gradient-text">3+</p>
                  <p className="text-sm text-zinc-500">Years Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold gradient-text">5+</p>
                  <p className="text-sm text-zinc-500">Certifications</p>
                </div>
              </div>

              {/* Resume button */}
              <motion.a
                href="/resume.pdf"
                target="_blank"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 mt-6"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
