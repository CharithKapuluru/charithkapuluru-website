"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
