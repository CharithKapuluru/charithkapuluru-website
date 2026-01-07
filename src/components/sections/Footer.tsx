"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-24 border-t border-text-olive/10 bg-bg-paper">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
           
           <div className="space-y-8">
              <h2 className="text-[12vw] md:text-[8vw] leading-[0.8] font-serif text-text-charcoal tracking-tight">
                Let&apos;s <br /> <span className="italic text-accent-moss">Talk.</span>
              </h2>
              <div className="flex gap-6">
                <a href="mailto:charith@example.com" className="text-xl font-sans border-b border-text-charcoal pb-1 hover:text-accent-terracotta hover:border-accent-terracotta transition-colors">
                  charith@example.com
                </a>
              </div>
           </div>

           <div className="flex flex-col items-end gap-8 w-full md:w-auto">
              <div className="flex gap-4">
                <a href="#" className="p-3 rounded-full bg-bg-cream hover:bg-text-charcoal hover:text-bg-paper transition-colors text-text-charcoal"><Github className="w-5 h-5" /></a>
                <a href="#" className="p-3 rounded-full bg-bg-cream hover:bg-text-charcoal hover:text-bg-paper transition-colors text-text-charcoal"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="p-3 rounded-full bg-bg-cream hover:bg-text-charcoal hover:text-bg-paper transition-colors text-text-charcoal"><Twitter className="w-5 h-5" /></a>
              </div>
              
              <div className="text-right space-y-1">
                <p className="text-xs font-mono text-text-olive">SAN FRANCISCO, CA</p>
                <p className="text-xs font-mono text-text-olive">© {new Date().getFullYear()} CHARITH KAPULURU</p>
              </div>
           </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
