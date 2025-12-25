"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo/Name */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-bold">
                CK
              </div>
              <div>
                <p className="font-semibold">Charith Kapuluru</p>
                <p className="text-sm text-zinc-500">Software Engineer</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <a href="#about" className="text-zinc-400 hover:text-white transition-colors text-sm">
                About
              </a>
              <a href="#skills" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Skills
              </a>
              <a href="#projects" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Projects
              </a>
              <a href="#contact" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Contact
              </a>
            </nav>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/charithkapuluru"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/charithkapuluru"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/charithkapuluru"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:charith@example.com"
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-white/5">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Charith Kapuluru. All rights reserved.
            </p>

            <p className="text-sm text-zinc-600 mt-4 md:mt-0">
              Built with Next.js & Tailwind CSS
            </p>

            {/* Back to top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 mt-4 md:mt-0"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
