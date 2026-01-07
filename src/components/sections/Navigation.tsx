"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Clock } from "lucide-react";

const navItems = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navigation = () => {
  const [time, setTime] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none"
      >
        <div className="bg-bg-cream/80 backdrop-blur-md border border-text-olive/10 shadow-sm pointer-events-auto rounded-full px-6 py-3 flex items-center gap-8 hover:shadow-md transition-shadow duration-300">
          {/* Logo / Home */}
          <a href="#" className="font-serif font-bold text-lg tracking-tight text-text-charcoal hover:text-accent-moss transition-colors">
            ck.
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-sans font-medium text-text-taupe hover:text-text-charcoal transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-accent-terracotta group-hover:w-full group-hover:left-0 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Time & Mobile Toggle */}
          <div className="flex items-center gap-4 pl-4 border-l border-text-olive/10">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-text-olive">
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 rounded-full hover:bg-text-charcoal/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-text-charcoal" /> : <Menu className="w-5 h-5 text-text-charcoal" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-bg-paper/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
          >
             {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-serif text-text-charcoal hover:italic transition-all"
              >
                {item.label}
              </a>
            ))}
             <div className="absolute bottom-10 font-mono text-sm text-text-olive flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
