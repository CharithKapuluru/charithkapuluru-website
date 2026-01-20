"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-3 rounded-full bg-bg-cream border border-text-charcoal/10 shadow-md"
        aria-label="Toggle theme"
      >
        <span className="text-xl opacity-0">🌙</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-bg-cream border border-text-charcoal/10 shadow-md hover:shadow-lg transition-all duration-300"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <span className="text-xl">🌙</span>
      ) : (
        <span className="text-xl">☀️</span>
      )}
    </button>
  );
};

export default ThemeToggle;
