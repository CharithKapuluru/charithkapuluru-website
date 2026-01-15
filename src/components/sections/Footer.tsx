"use client";

import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-24 border-t border-text-olive/10 bg-bg-paper">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">

           <div className="space-y-8">
              <h2 className="text-[12vw] md:text-[8vw] leading-[0.8] font-serif text-text-charcoal tracking-tight">
                Let&apos;s <br /> <span className="italic text-accent-moss">Talk.</span>
              </h2>
              <div className="flex gap-6">
                <a href="mailto:kapulurucharith@gmail.com" className="text-xl font-sans border-b border-text-charcoal pb-1 hover:text-accent-terracotta hover:border-accent-terracotta transition-colors">
                  kapulurucharith@gmail.com
                </a>
              </div>
           </div>

           <div className="flex flex-col items-end gap-8 w-full md:w-auto">
              <div className="flex gap-4">
                <a href="https://github.com/CharithKapuluru" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-bg-cream hover:bg-text-charcoal hover:text-bg-paper transition-colors text-text-charcoal">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/charith-kapuluru-159456329/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-bg-cream hover:bg-text-charcoal hover:text-bg-paper transition-colors text-text-charcoal">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>

              <div className="text-right space-y-1">
                <p className="text-xs font-mono text-text-olive">DENTON, TX</p>
                <p className="text-xs font-mono text-text-olive">&copy; {new Date().getFullYear()} CHARITH KAPULURU</p>
              </div>
           </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
