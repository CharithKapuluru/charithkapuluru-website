"use client";

import { ThemeProvider } from "next-themes";

// Only what every page needs. Firebase auth and the reduced-motion guard for the animation library live in ReadingLayout, so the home page ships neither.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
