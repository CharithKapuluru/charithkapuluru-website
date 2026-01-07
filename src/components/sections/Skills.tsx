"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const skills = [
  "Artificial Intelligence", "Machine Learning", "Neural Networks", 
  "Deep Learning", "Computer Vision", "Natural Language Processing",
  "Cloud Architecture", "AWS", "Google Cloud", "Kubernetes", "Docker",
  "Terraform", "Cybersecurity", "Zero Trust", "Cryptography", "Network Security",
  "React", "Next.js", "TypeScript", "Python", "Rust", "Go"
];

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-1000, 0]);

  return (
    <section ref={containerRef} id="skills" className="py-32 overflow-hidden bg-bg-paper">
      <div className="container mx-auto px-6 mb-16">
        <h2 className="text-sm font-sans tracking-widest uppercase text-text-olive">Core Competencies</h2>
      </div>

      {/* Marquee 1 */}
      <div className="relative flex whitespace-nowrap mb-8">
        <motion.div style={{ x: x1 }} className="flex gap-12 items-center">
          {[...skills, ...skills, ...skills].map((skill, i) => (
             <div key={`${skill}-${i}`} className="flex items-center gap-12">
               <span className="text-[8vw] leading-none font-serif text-text-charcoal opacity-10 whitespace-nowrap hover:opacity-100 hover:text-accent-moss transition-all duration-300 cursor-default">
                 {skill}
               </span>
               <div className="w-4 h-4 rounded-full bg-accent-terracotta/20" />
             </div>
          ))}
        </motion.div>
      </div>

      {/* Marquee 2 (Reverse) */}
      <div className="relative flex whitespace-nowrap">
        <motion.div style={{ x: x2 }} className="flex gap-12 items-center">
          {[...skills.reverse(), ...skills, ...skills].map((skill, i) => (
             <div key={`${skill}-rev-${i}`} className="flex items-center gap-12">
               <span className="text-[8vw] leading-none font-serif text-text-charcoal opacity-10 whitespace-nowrap hover:opacity-100 hover:text-accent-terracotta transition-all duration-300 cursor-default">
                 {skill}
               </span>
               <div className="w-4 h-4 rounded-full bg-accent-sage/20" />
             </div>
          ))}
        </motion.div>
      </div>
      
      <div className="container mx-auto px-6 mt-24">
         <p className="max-w-xl text-lg text-text-taupe leading-relaxed">
           My stack is fluid, adapting to the problem at hand. I prioritize tools that offer 
           scalability, security, and developer ergonomics.
         </p>
      </div>
    </section>
  );
};

export default Skills;
