"use client";

import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg-paper">
      {/* Organic Background Shape - "Ink/Watercolor" */}
      <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-accent-sage/10 blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent-terracotta/5 blur-[120px] mix-blend-multiply" />

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Typography Column */}
          <div className="lg:col-span-9">
             {/* Eyebrow */}
             <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-px bg-text-taupe/40"></span>
              <span className="text-sm font-sans tracking-widest uppercase text-text-taupe">Portfolio &lsquo;25</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[12vw] leading-[0.85] font-serif text-text-charcoal mb-8 tracking-tight"
            >
              Digital <br />
              <span className="italic font-light text-text-olive">Craftsman.</span>
            </motion.h1>

            {/* Introduction */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="max-w-xl ml-auto mr-0 lg:mr-24"
            >
               <p className="text-xl md:text-2xl text-text-taupe font-sans leading-relaxed">
                I&apos;m Charith Kapuluru. I architect intelligent systems that feel 
                <span className="font-serif italic text-accent-moss px-2">organic</span> 
                and inevitably human.
               </p>
               
               <div className="mt-12 flex flex-wrap gap-8 items-center">
                  <a href="#projects" className="group flex items-center gap-2 text-text-charcoal font-medium border-b border-text-charcoal pb-1 hover:text-accent-terracotta hover:border-accent-terracotta transition-colors">
                    View Case Studies
                    <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  </a>
                  
                  <div className="flex gap-4">
                    <a href="https://github.com/charithkapuluru" target="_blank" rel="noopener noreferrer" className="text-text-olive hover:text-text-charcoal transition-colors"><Github className="w-5 h-5" /></a>
                    <a href="https://linkedin.com/in/charithkapuluru" target="_blank" rel="noopener noreferrer" className="text-text-olive hover:text-text-charcoal transition-colors"><Linkedin className="w-5 h-5" /></a>
                    <a href="mailto:charith@example.com" className="text-text-olive hover:text-text-charcoal transition-colors"><Mail className="w-5 h-5" /></a>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Sidebar / Date Column */}
          <div className="lg:col-span-3 hidden lg:flex flex-col justify-between h-full min-h-[60vh] pt-4">
             <div className="text-right">
                <span className="block text-xs font-mono text-text-olive mb-1">LOCATION</span>
                <span className="block text-sm font-sans text-text-charcoal">San Francisco, CA</span>
                <span className="block text-xs font-mono text-text-olive mt-1">37.7749° N, 122.4194° W</span>
             </div>

             <div className="text-right mt-auto">
                 <div className="inline-block w-px h-24 bg-text-taupe/20 mb-4"></div>
                 <span className="block text-xs font-mono text-text-olive tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
