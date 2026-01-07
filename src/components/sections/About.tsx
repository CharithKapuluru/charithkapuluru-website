"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Download, Cpu, Globe, Zap, BookOpen, Music, ArrowUpRight } from "lucide-react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const techStack = [
    "TypeScript", "React", "Next.js", "Python", "TensorFlow", "AWS", "Rust", "TailwindCSS", "Node.js", "GraphQL"
  ];

  return (
    <section id="about" className="py-32 relative bg-bg-paper" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-24 max-w-3xl"
          >
            <h2 className="text-5xl md:text-7xl font-serif text-text-charcoal mb-8 tracking-tight leading-[0.9]">
              I build things that <span className="italic text-accent-terracotta">think.</span>
            </h2>
            <p className="text-text-taupe text-xl md:text-2xl leading-relaxed font-sans max-w-2xl">
              Beyond the code, I&apos;m an explorer of digital frontiers. I blend engineering rigor with creative intuition to build software that feels inevitable.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left Col: Narrative */}
            <div className="lg:col-span-7 space-y-12">
               <div className="space-y-6">
                  <h3 className="font-mono text-sm tracking-widest text-text-olive uppercase">The Journey</h3>
                  <p className="text-lg text-text-charcoal leading-relaxed">
                    My path wasn&apos;t linear. It started with a curiosity for how machines learn and evolved into a relentless pursuit of scalable architecture. I&apos;ve engineered systems that process millions of events and trained models that detect the unseen.
                  </p>
               </div>

               <div className="space-y-6">
                  <h3 className="font-mono text-sm tracking-widest text-text-olive uppercase">Technical Arsenal</h3>
                  <div className="flex flex-wrap gap-x-8 gap-y-3 text-lg md:text-xl font-serif text-text-charcoal">
                    {techStack.map((tech, i) => (
                      <span key={tech} className="relative group cursor-default">
                        {tech}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-moss group-hover:w-full transition-all duration-300" />
                        {i !== techStack.length - 1 && <span className="text-text-olive/30 ml-8 font-sans">/</span>}
                      </span>
                    ))}
                  </div>
               </div>
            </div>

            {/* Right Col: Stats & Personal */}
            <div className="lg:col-span-5 space-y-8">
               <div className="p-8 bg-bg-cream rounded-sm border-l-2 border-accent-moss">
                  <div className="flex justify-between items-end mb-4">
                     <span className="text-6xl font-serif text-text-charcoal">3+</span>
                     <span className="font-mono text-xs text-text-olive mb-2">YEARS EXP</span>
                  </div>
                  <div className="h-px w-full bg-text-charcoal/10 my-4" />
                  <div className="flex justify-between items-end">
                     <span className="text-6xl font-serif text-text-charcoal">12</span>
                     <span className="font-mono text-xs text-text-olive mb-2">SHIPPED PROJECTS</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-bg-stone/30">
                     <BookOpen className="w-5 h-5 text-text-olive mb-4" />
                     <p className="text-xs font-mono text-text-olive mb-1">READING</p>
                     <p className="font-serif text-lg text-text-charcoal italic">Superintelligence</p>
                  </div>
                  <div className="p-6 bg-bg-stone/30">
                     <Music className="w-5 h-5 text-text-olive mb-4" />
                     <p className="text-xs font-mono text-text-olive mb-1">LISTENING</p>
                     <p className="font-serif text-lg text-text-charcoal italic">Midnight City</p>
                  </div>
               </div>
               
               <a
                href="/resume.pdf"
                target="_blank"
                className="group flex items-center justify-between w-full p-6 bg-text-charcoal text-bg-paper hover:bg-accent-terracotta transition-colors duration-300"
              >
                <span className="font-mono text-sm">DOWNLOAD CV</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
