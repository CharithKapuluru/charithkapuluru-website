"use client";

import { ThemeProvider } from "next-themes";

// Only what every page needs. Firebase auth lives in the (reading) route-group layouts (src/app/projects and src/app/fundamentals) and the reduced-motion guard
// for the animation library in ReadingLayout, so the home, index, contact and 404 pages ship neither.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
